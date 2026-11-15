
import React, { useEffect, useState } from 'react';

const API = 'http://localhost:5000/api';

const money = (n) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(Number(n || 0));

export default function App() {
  const [submittingPath, setSubmittingPath] = useState('');
  const [loanPrincipal, setLoanPrincipal] = useState('');
const [loanTerm, setLoanTerm] = useState('1');
  const [tab, setTab] = useState('Overview');
  const [accounts, setAccounts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loans, setLoans] = useState([]);
  const [repayments, setRepayments] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  async function request(path, options = {}) {
    const response = await fetch(`${API}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  }

  async function refresh() {
    try {
      setLoading(true);

      
        const [a, c, t, l, r] = await Promise.all([
          request('/accounts'),
          request('/customers'),
          request('/transactions'),
          request('/loans'),
          request('/loan-repayments')
        ]);
        
        setAccounts(a);
        setCustomers(c);
        setTransactions(t);
        setLoans(l);
        setRepayments(r);
        setError('');
    } catch (e) {
      setError(
        `${e.message}. Check that the API and MySQL are running.`
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function submit(event, path, body, success) {
    event.preventDefault();
  
    // Prevent another submission while one is running
    if (submittingPath) {
      return;
    }
  
    setSubmittingPath(path);
    setError('');
    setMessage('');
  
    try {
      await request(path, {
        method: 'POST',
        body: JSON.stringify(body)
      });
  
      setMessage(success);
      event.target.reset();
  
      await refresh();
  
    } catch (e) {
      setError(e.message);
  
    } finally {
      setSubmittingPath('');
    }
  }

  const total = accounts.reduce(
    (sum, account) => sum + Number(account.balance || 0),
    0
  );

  const activeLoans = loans.filter(
    loan => String(loan.status).toUpperCase() === 'ACTIVE'
  );

  const tabs = [
    'Overview',
    'Customers',
    'Accounts',
    'Transactions',
    'Transfer',
    'Loans'
  ];

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">M</span>
          <span>MyBank</span>
        </div>

        <p className="side-caption">PRACTICE BANK</p>

        {tabs.map(t => (
          <button
            key={t}
            className={`nav ${tab === t ? 'active' : ''}`}
            onClick={() => {
              setTab(t);
              setError('');
              setMessage('');
            }}
          >
            {t}
          </button>
        ))}

        <div className="side-note">
          Demo environment
          <br />
          No real money involved
        </div>
      </aside>

      <main className="main">
        <header>
          <div>
            <div className="eyebrow">
              MYBANK / {tab.toUpperCase()}
            </div>
            <h1>{tab}</h1>
          </div>

          <div className="avatar">JD</div>
        </header>

        {error && (
          <div className="alert error" role="alert">
            {error}
          </div>
        )}

        {message && (
          <div className="alert success" role="status">
            {message}
          </div>
        )}

        {loading ? (
          <Panel title="Loading">
            <p className="muted">Loading MyBank data...</p>
          </Panel>
        ) : (
          <>
            {tab === 'Overview' && (
              <>
                <section className="welcome">
                  <div>
                    <p className="eyebrow light">
                      YOUR FINANCES AT A GLANCE
                    </p>
                    <h2>Welcome to MyBank</h2>
                    <p>
                      Explore the demo data and practise testing
                      real database changes.
                    </p>
                  </div>

                  <div className="welcome-mark">M</div>
                </section>

                <div className="stats">
                  <Stat
                    label="Total account balance"
                    value={money(total)}
                  />

                  <Stat
                    label="Customers"
                    value={customers.length}
                  />

                  <Stat
                    label="Accounts"
                    value={accounts.length}
                  />

                  <Stat
                    label="Active loans"
                    value={activeLoans.length}
                  />
                </div>

                <Panel title="Recent transactions">
                  <Transactions rows={transactions.slice(0, 5)} />
                </Panel>
              </>
            )}

            {tab === 'Customers' && (
              <>
                <Panel title="Customer directory">
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Customer</th>
                        <th>Email</th>
                        <th>Accounts</th>
                      </tr>
                    </thead>

                    <tbody>
                      {customers.map(c => (
                        <tr key={c.customer_id}>
                          <td>{c.customer_id}</td>
                          <td>
                            {c.first_name} {c.last_name}
                          </td>
                          <td>{c.email}</td>
                          <td>{c.account_count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Panel>

                <Panel title="Add customer">
                  <form
                    className="form-grid"
                    onSubmit={e =>
                      submit(
                        e,
                        '/customers',
                        {
                          first_name: e.target.first_name.value,
                          last_name: e.target.last_name.value,
                          email: e.target.email.value
                        },
                        'Customer created successfully.'
                      )
                    }
                  >
                    <Field
                      name="first_name"
                      label="First name"
                      required
                    />

                    <Field
                      name="last_name"
                      label="Last name"
                      required
                    />

                    <Field
                      name="email"
                      label="Email"
                      type="email"
                      required
                    />

                    <button className="primary">
                      Create customer
                    </button>
                  </form>
                </Panel>
              </>
            )}

            {tab === 'Accounts' && (
              <Panel title="Bank accounts">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Account number</th>
                      <th>Customer</th>
                      <th>Type</th>
                      <th>Balance</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {accounts.map(a => (
                      <tr key={a.id}>
                        <td>{a.id}</td>
                        <td>{a.account_number}</td>
                        <td>{a.customer_name}</td>
                        <td>{a.account_type}</td>
                        <td>{money(a.balance)}</td>
                        <td>
                          <span className="pill">{a.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Panel>
            )}

            {tab === 'Transactions' && (
              <Panel title="Transaction history">
                <Transactions rows={transactions} />
              </Panel>
            )}

            {tab === 'Transfer' && (
              <Panel title="Transfer money">
                <p className="muted">
                  Transfers update both account balances and create
                  debit/credit transaction records.
                </p>

                <form
                  className="form-grid"
                  onSubmit={e =>
                    submit(
                      e,
                      '/transfers',
                      {
                        from_account_id: Number(e.target.from.value),
                        to_account_id: Number(e.target.to.value),
                        amount: Number(e.target.amount.value),
                        description: e.target.description.value
                      },
                      'Transfer completed successfully.'
                    )
                  }
                >
                  <label>
                    From account

                    <select name="from" required>
                      {accounts.map(a => (
                        <option value={a.id} key={a.id}>
                          {a.account_number} — {a.customer_name}
                          {' '}({money(a.balance)})
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    To account

                    <select name="to" required>
                      {accounts.map(a => (
                        <option value={a.id} key={a.id}>
                          {a.account_number} — {a.customer_name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <Field
                    name="amount"
                    label="Amount (INR)"
                    type="number"
                    min="0.01"
                    step="0.01"
                    required
                  />

                  <Field
                    name="description"
                    label="Description"
                  />

                  <button className="primary">
                    Transfer money
                  </button>
                </form>
              </Panel>
            )}

            {tab === 'Loans' && (
              <>
                <Panel title="Loan accounts">
                  <table>
                    <thead>
                      <tr>
                        <th>Loan ID</th>
                        <th>Customer</th>
                        <th>Principal</th>
                        <th>Outstanding</th>
                        <th>Term</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {loans.map(l => (
                        <tr key={l.id}>
                          <td>{l.id}</td>
                          <td>{l.customer_name}</td>
                          <td>{money(l.principal_amount)}</td>
                          <td>{money(l.outstanding_balance)}</td>
                          <td>{l.term_months} months</td>
                          <td>
                            <span className="pill">{l.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Panel>

                <div className="two-col">
                <Panel title="Create loan">
  <form
    className="stack"
    onSubmit={e =>
      submit(
        e,
        '/loans',
        {
          customer_id: Number(e.target.customer_id.value),
          principal_amount: Number(e.target.principal.value),
          term_months: Number(e.target.term_months.value)
        },
        'Loan created successfully.'
      )
    }
  >
    <label>
      Customer

      <select name="customer_id" required>
        {customers.map(c => (
          <option
            key={c.customer_id}
            value={c.customer_id}
          >
            {c.first_name} {c.last_name}
          </option>
        ))}
      </select>
    </label>

    <label>
      Principal (INR)

      <input
        name="principal"
        type="number"
        min="0.01"
        step="0.01"
        value={loanPrincipal}
        onChange={e => setLoanPrincipal(e.target.value)}
        required
      />
    </label>

    <label>
      Repayment plan

      <select
        name="term_months"
        value={loanTerm}
        onChange={e => setLoanTerm(e.target.value)}
        required
      >
        <option value="1">1 Month Plan</option>
        <option value="3">3 Month Plan</option>
      </select>
    </label>

    {Number(loanPrincipal) > 0 && (
      <div className="panel">
        <h3>Repayment Summary</h3>

        <p>
          Loan Amount: <strong>{money(loanPrincipal)}</strong>
        </p>

        <p>
          Selected Plan: <strong>{loanTerm} Month(s)</strong>
        </p>

        <p>
          Monthly Payment: {' '}
          <strong>
            {money(Number(loanPrincipal) / Number(loanTerm))}
          </strong>
        </p>

        <p>
          Total Repayment: {' '}
          <strong>{money(loanPrincipal)}</strong>
        </p>

        <p className="muted">
          Interest Rate: 0%
        </p>
      </div>
    )}

<button
  className="primary"
  disabled={submittingPath === '/loans'}
>
  {submittingPath === '/loans'
    ? 'Creating loan...'
    : 'Create loan'}
</button>
  </form>
</Panel>




                  <Panel title="Record repayment">
                    <form
                      className="stack"
                      onSubmit={e => {
                        const id = e.target.loan_id.value;

                        submit(
                          e,
                          `/loans/${id}/repayments`,
                          {
                            amount: Number(e.target.amount.value),
                            note: e.target.note.value
                          },
                          'Repayment recorded successfully.'
                        );
                      }}
                    >
                      <label>
                        Loan

                        <select name="loan_id" required>
                          {activeLoans.map(l => (
                            <option key={l.id} value={l.id}>
                              #{l.id} — {l.customer_name}
                              {' '}({money(l.outstanding_balance)})
                            </option>
                          ))}
                        </select>
                      </label>

                      <Field
                        name="amount"
                        label="Repayment amount (INR)"
                        type="number"
                        min="0.01"
                        step="0.01"
                        required
                      />

                      <Field
                        name="note"
                        label="Note"
                      />

                      <button
                        className="primary"
                        disabled={activeLoans.length === 0}
                      >
                        Record repayment
                      </button>
                    </form>
                  </Panel>
                </div>
                <Panel title="Repayment history">
  {repayments.length === 0 ? (
    <p className="muted">No repayments recorded yet.</p>
  ) : (
    <table>
      <thead>
        <tr>
          <th>Repayment ID</th>
          <th>Loan ID</th>
          <th>Customer</th>
          <th>Amount paid</th>
          <th>Remaining balance</th>
          <th>Repayment date</th>
        </tr>
      </thead>

      <tbody>
        {repayments.map(r => (
          <tr key={r.id}>
            <td>{r.id}</td>
            <td>{r.loan_id}</td>
            <td>{r.customer_name}</td>
            <td>{money(r.amount)}</td>
            <td>{money(r.remaining_balance)}</td>
            <td>
              {new Date(r.repayment_date).toLocaleString('en-IN')}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</Panel>
              </>
            )}
          </>
        )}

        <footer>
          MyBank Practice App · For software testing education only
        </footer>
      </main>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="stat">
      <p>{label}</p>
      <strong>{value}</strong>
    </div>
  );
}

function Panel({ title, children }) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {children}
    </section>
  );
}

function Field({ name, label, type = 'text', ...props }) {
  return (
    <label>
      {label}
      <input name={name} type={type} {...props} />
    </label>
  );
}

function Transactions({ rows }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Reference</th>
          <th>Account</th>
          <th>Type</th>
          <th>Amount</th>
          <th>Description</th>
          <th>Date</th>
        </tr>
      </thead>

      <tbody>
        {rows.map(t => (
          <tr key={t.id}>
            <td>{t.reference_code || `TX-${t.id}`}</td>
            <td>{t.account_number}</td>
            <td>
              <span className={`type ${String(t.transaction_type).toLowerCase()}`}>
                {t.transaction_type}
              </span>
            </td>
            <td>{money(t.amount)}</td>
            <td>{t.description}</td>
            <td>{new Date(t.created_at).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
