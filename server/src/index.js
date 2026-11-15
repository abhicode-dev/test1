import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const asyncRoute = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const positiveAmount = (value) => Number.isFinite(Number(value)) && Number(value) > 0;

app.get('/api/health', asyncRoute(async (_req, res) => {
  await pool.query('SELECT 1');
  res.json({ status: 'ok', database: 'connected' });
}));

app.get('/api/customers', asyncRoute(async (_req, res) => {
  const [rows] = await pool.query(
    `SELECT c.*, COUNT(a.id) AS account_count
     FROM customers c
     LEFT JOIN accounts a
     ON a.customer_id = c.customer_id
     GROUP BY c.customer_id
     ORDER BY c.customer_id`
  );

  res.json(rows);
}));

app.post('/api/customers', asyncRoute(async (req, res) => {
  const { first_name, last_name, email } = req.body;

  if (!first_name || !last_name || !email) {
    return res.status(400).json({
      message: 'first_name, last_name and email are required'
    });
  }

  const [result] = await pool.execute(
    'INSERT INTO customers (first_name, last_name, email) VALUES (?, ?, ?)',
    [first_name.trim(), last_name.trim(), email.trim()]
  );

  const [rows] = await pool.execute(
    'SELECT * FROM customers WHERE customer_id = ?',
    [result.insertId]
  );

  res.status(201).json(rows[0]);
}));

app.get('/api/accounts', asyncRoute(async (_req, res) => {
  const [rows] = await pool.query(
    `SELECT a.*, CONCAT(c.first_name,' ',c.last_name) AS customer_name
     FROM accounts a JOIN customers c ON c.customer_id = a.customer_id`
  );
  res.json(rows);
}));

app.get('/api/accounts/:id', asyncRoute(async (req, res) => {
  const [rows] = await pool.execute(
    `SELECT a.*, CONCAT(c.first_name,' ',c.last_name) AS customer_name
     FROM accounts a JOIN customers c ON c.customer_id = a.customer_id WHERE a.id=?`,
    [req.params.id]
  );
  if (!rows.length) return res.status(404).json({ message: 'Account not found' });
  res.json(rows[0]);
}));

app.get('/api/transactions', asyncRoute(async (req, res) => {
  const accountId = req.query.accountId;
  const sql = `SELECT t.*, a.account_number FROM transactions t JOIN accounts a ON a.id=t.account_id
               ${accountId ? 'WHERE t.account_id=?' : ''} ORDER BY t.created_at DESC, t.id DESC`;
  const [rows] = accountId ? await pool.execute(sql, [accountId]) : await pool.query(sql);
  res.json(rows);
}));


app.post('/api/transfers', asyncRoute(async (req, res) => {
  const { from_account_id, to_account_id, amount, description } = req.body;

  if (
    !from_account_id ||
    !to_account_id ||
    String(from_account_id) === String(to_account_id) ||
    !positiveAmount(amount)
  ) {
    return res.status(400).json({
      message: 'Provide two different account IDs and an amount greater than zero'
    });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const ids = [Number(from_account_id), Number(to_account_id)].sort((a, b) => a - b);

    const [accounts] = await connection.query(
      'SELECT * FROM accounts WHERE id IN (?,?) ORDER BY id FOR UPDATE',
      ids
    );

    if (accounts.length !== 2 || accounts.some(a => a.status !== 'Active')) {
      throw Object.assign(
        new Error('One or both accounts are unavailable'),
        { status: 404 }
      );
    }

    const from = accounts.find(a => a.id === Number(from_account_id));
    const to = accounts.find(a => a.id === Number(to_account_id));

    if (Number(from.balance) < Number(amount)) {
      throw Object.assign(new Error('Insufficient funds'), { status: 400 });
    }

    await connection.execute(
      'UPDATE accounts SET balance = balance - ? WHERE id = ?',
      [amount, from.id]
    );

    await connection.execute(
      'UPDATE accounts SET balance = balance + ? WHERE id = ?',
      [amount, to.id]
    );

    await connection.execute(
      `INSERT INTO transactions
       (account_id, transaction_type, amount, description)
       VALUES (?, ?, ?, ?), (?, ?, ?, ?)`,
      [
        from.id,
        'Debit',
        amount,
        description || 'Bank transfer',
        to.id,
        'Credit',
        amount,
        description || 'Bank transfer'
      ]
    );

    await connection.commit();

    res.status(201).json({
      message: 'Transfer successful'
    });

  } catch (error) {
    await connection.rollback();

    res.status(error.status || 500).json({
      message: error.message || 'Transfer failed'
    });

  } finally {
    connection.release();
  }
}));


app.get('/api/loans', asyncRoute(async (_req, res) => {
  const [rows] = await pool.query(
    `SELECT l.*, CONCAT(c.first_name,' ',c.last_name) AS customer_name
     FROM loans l JOIN customers c ON c.customer_id = l.customer_id ORDER BY l.id DESC`
  );
  res.json(rows);
}));

app.post('/api/loans', asyncRoute(async (req, res) => {
  const { customer_id, principal_amount, term_months } = req.body;

  if (
    !Number.isInteger(Number(customer_id)) ||
    Number(customer_id) < 1 ||
    !positiveAmount(principal_amount) ||
    !Number.isInteger(Number(term_months)) ||
    Number(term_months) < 1
  ) {
    return res.status(400).json({
      message: 'Valid customer_id, principal_amount and term_months are required'
    });
  }

  const customerId = Number(customer_id);
  const principal = Number(principal_amount);
  const termMonths = Number(term_months);

  const [customers] = await pool.execute( 
    'SELECT * FROM customers WHERE customer_id = ?',
    [customerId]
  );

  if (!customers.length) {
    return res.status(404).json({ message: 'Customer not found' });
  }

  const [result] = await pool.execute(
    `INSERT INTO loans
     (customer_id, principal_amount, outstanding_balance, term_months)
     VALUES (?, ?, ?, ?)`,
    [customerId, principal, principal, termMonths]
  );

  const [rows] = await pool.execute(
    'SELECT * FROM loans WHERE id = ?',
    [result.insertId]
  );

  res.status(201).json(rows[0]);
}));
//put loans

// app.put('/api/loans/:id', asyncRoute(async (req, res) => {

//   const loanId = Number(req.params.id);
//   const { term_months } = req.body;

//   // Validate loan ID
//   if (!Number.isInteger(loanId) || loanId < 1) {
//     return res.status(400).json({
//       message: 'Valid loan ID is required'
//     });
//   }

//   // Validate loan term
//   if (
//     !Number.isInteger(Number(term_months)) ||
//     Number(term_months) < 1
//   ) {
//     return res.status(400).json({
//       message: 'Valid term_months is required'
//     });
//   }

//   // Check whether loan exists
//   const [loans] = await pool.execute(
//     'SELECT * FROM loans WHERE id = ?',
//     [loanId]
//   );

//   if (!loans.length) {
//     return res.status(404).json({
//       message: 'Loan not found'
//     });
//   }

//   // Update loan
//   await pool.execute(
//     'UPDATE loans SET term_months = ? WHERE id = ?',
//     [Number(term_months), loanId]
//   );

//   // Retrieve updated loan
//   const [updatedLoans] = await pool.execute(
//     'SELECT * FROM loans WHERE id = ?',
//     [loanId]
//   );

//   res.status(200).json(updatedLoans[0]);

// }));
// updated put

app.put('/api/loans/:id', asyncRoute(async (req, res) => {

  const loanId = Number(req.params.id);
  const { term_months, status } = req.body;
  console.log("Request body:", req.body);
console.log("Term:", term_months);
console.log("Status:", status);

  // Validate loan ID
  if (!Number.isInteger(loanId) || loanId < 1) {
    return res.status(400).json({
      message: 'Valid loan ID is required'
    });
  }

  // PUT requires the complete editable representation
  if (
    !Number.isInteger(Number(term_months)) ||
    Number(term_months) < 1 ||
    !['Active', 'Paid'].includes(status)
  ) {
    return res.status(400).json({
      message: 'Valid term_months and status are required'
    });
  }

  // Check whether loan exists
  const [loans] = await pool.execute(
    'SELECT * FROM loans WHERE id = ?',
    [loanId]
  );

  if (!loans.length) {
    return res.status(404).json({
      message: 'Loan not found'
    });
  }

  // Replace the editable fields
  await pool.execute(
    'UPDATE loans SET term_months = ?, status = ? WHERE id = ?',
    [Number(term_months), status, loanId]
  );

  // Retrieve updated loan
  const [updatedLoans] = await pool.execute(
    'SELECT * FROM loans WHERE id = ?',
    [loanId]
  );

  res.status(200).json(updatedLoans[0]);

}));
//patch loans

app.patch('/api/loans/:id', asyncRoute(async (req, res) => {

  const loanId = Number(req.params.id);
  const { term_months } = req.body;

  // Validate loan ID
  if (!Number.isInteger(loanId) || loanId < 1) {
    return res.status(400).json({
      message: 'Valid loan ID is required'
    });
  }

  // Validate term_months
  if (
    !Number.isInteger(Number(term_months)) ||
    Number(term_months) < 1
  ) {
    return res.status(400).json({
      message: 'Valid term_months is required'
    });
  }

  // Check whether loan exists
  const [loans] = await pool.execute(
    'SELECT * FROM loans WHERE id = ?',
    [loanId]
  );

  if (!loans.length) {
    return res.status(404).json({
      message: 'Loan not found'
    });
  }

  // Update only the supplied field
  await pool.execute(
    'UPDATE loans SET term_months = ? WHERE id = ?',
    [Number(term_months), loanId]
  );

  // Retrieve updated loan
  const [updatedLoans] = await pool.execute(
    'SELECT * FROM loans WHERE id = ?',
    [loanId]
  );

  res.status(200).json(updatedLoans[0]);

}));
//delete loan

app.delete('/api/loans/:id', asyncRoute(async (req, res) => {

  const loanId = Number(req.params.id);

  // Validate loan ID
  if (!Number.isInteger(loanId) || loanId < 1) {
    return res.status(400).json({
      message: 'Valid loan ID is required'
    });
  }

  // Check whether loan exists
  const [loans] = await pool.execute(
    'SELECT * FROM loans WHERE id = ?',
    [loanId]
  );

  if (!loans.length) {
    return res.status(404).json({
      message: 'Loan not found'
    });
  }

  // Delete loan
  await pool.execute(
    'DELETE FROM loans WHERE id = ?',
    [loanId]
  );

  res.status(200).json({
    message: 'Loan deleted successfully'
  });

}));




// Get all loan repayment records
app.get('/api/loan-repayments', asyncRoute(async (req, res) => {
  const [rows] = await pool.execute(`
    SELECT
      lr.id,
      lr.loan_id,
      lr.amount,
      lr.remaining_balance,
      lr.repayment_date,
      CONCAT(c.first_name, ' ', c.last_name) AS customer_name
    FROM loan_repayments lr
    INNER JOIN loans l ON lr.loan_id = l.id
    INNER JOIN customers c ON l.customer_id = c.customer_id
    ORDER BY lr.repayment_date DESC, lr.id DESC
  `);

  res.json(rows);
}));



app.post('/api/loans/:id/repayments', asyncRoute(async (req, res) => {
  const { amount } = req.body;

  if (!positiveAmount(amount)) {
    return res.status(400).json({
      message: 'Repayment amount must be greater than zero'
    });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [loans] = await connection.execute(
      'SELECT * FROM loans WHERE id = ? FOR UPDATE',
      [req.params.id]
    );

    if (!loans.length) {
      throw Object.assign(new Error('Loan not found'), { status: 404 });
    }

    const loan = loans[0];

    if (Number(amount) > Number(loan.outstanding_balance)) {
      throw Object.assign(
        new Error('Repayment exceeds outstanding balance'),
        { status: 400 }
      );
    }

    const remaining = Number(
      (Number(loan.outstanding_balance) - Number(amount)).toFixed(2)
    );

    const newStatus = remaining === 0 ? 'Paid' : 'Active';

    await connection.execute(
      `INSERT INTO loan_repayments
       (loan_id, amount, remaining_balance)
       VALUES (?, ?, ?)`,
      [loan.id, amount, remaining]
    );

    await connection.execute(
      'UPDATE loans SET outstanding_balance = ?, status = ? WHERE id = ?',
      [remaining, newStatus, loan.id]
    );

    await connection.commit();

    res.status(201).json({
      message: 'Repayment recorded',
      outstanding_balance: remaining,
      status: newStatus
    });

  } catch (error) {
    await connection.rollback();

    res.status(error.status || 500).json({
      message: error.message || 'Repayment failed'
    });

  } finally {
    connection.release();
  }
}));


app.use((err, _req, res, _next) => {
  if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'Email or account number already exists' });
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});
app.get('/api/db-check', asyncRoute(async (req, res) => {
  const [rows] = await pool.execute(`
    SELECT
      DATABASE() AS database_name,
      @@hostname AS server_name,
      @@port AS port_number,
      @@server_uuid AS server_uuid,
      @@datadir AS data_directory,
      (SELECT COUNT(*) FROM loans) AS loan_count,
      (SELECT COUNT(*) FROM loan_repayments) AS repayment_count
  `);

  res.json(rows[0]);
}));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`MyBank API listening on http://localhost:${port}`));
