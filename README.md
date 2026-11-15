# MyBank Practice Application

A small **demo-only** banking application for learning React, Node/Express, MySQL, API testing, database validation, and WebdriverIO + Cucumber.

## Features
- View seeded customers and bank accounts
- View transactions
- Create a customer
- Transfer money between accounts
- Create a simple loan
- Record a simulated loan repayment
- REST API with validation and database transactions

> This is a learning project only. It has no real banking, authentication, encryption, or payment integration. Never use real customer or financial data.

## Requirements
- Node.js 20+
- MySQL 8+
- npm

## 1. Create the database
Open MySQL Workbench or a MySQL terminal and run:

```sql
SOURCE /full/path/to/mybank-practice-app/database/schema.sql;
SOURCE /full/path/to/mybank-practice-app/database/seed.sql;
```

On Windows, use the actual path, for example:
`SOURCE C:/Users/YourName/Downloads/mybank-practice-app/database/schema.sql;`

## 2. Configure the API
Open `server/.env.example`, copy it to `server/.env`, and set your MySQL username/password.

```bash
cd server
npm install
npm run dev
```

API runs at `http://localhost:5000`.
Health check: `http://localhost:5000/api/health`

## 3. Start React
In a second terminal:

```bash
cd client
npm install
npm run dev
```

Open the Vite URL shown in the terminal (normally `http://localhost:5173`).

## Useful API endpoints
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | API/database health |
| GET | `/api/customers` | List customers |
| POST | `/api/customers` | Create customer |
| GET | `/api/accounts` | List accounts |
| GET | `/api/accounts/:id` | Account details |
| GET | `/api/transactions` | List transactions |
| POST | `/api/transfers` | Transfer between accounts |
| GET | `/api/loans` | List loans |
| POST | `/api/loans` | Create a loan |
| POST | `/api/loans/:id/repayments` | Record a simulated repayment |

## Suggested testing exercises
1. Verify the dashboard totals against SQL `SUM()` queries.
2. Verify customer/account/transaction data shown in React matches MySQL.
3. Create a customer and verify the row in `customers`.
4. Transfer money and verify both account balances and two transaction rows.
5. Try a transfer with insufficient funds; verify it fails and neither balance changes.
6. Try transferring to the same account or using an invalid account ID.
7. Create a loan and verify the loan row and starting outstanding balance.
8. Repay a loan and verify outstanding balance and repayment history.
9. Test invalid values: zero, negative amount, missing fields, unknown IDs.
10. Refresh the page and confirm persisted data is still present.

## Useful SQL checks
```sql
USE mybank;

SELECT * FROM customers;
SELECT * FROM accounts;
SELECT * FROM transactions ORDER BY created_at DESC;
SELECT * FROM loans;
SELECT * FROM loan_repayments ORDER BY created_at DESC;

-- Account balance check
SELECT account_number, balance FROM accounts;

-- Total deposits/credits and withdrawals/debits
SELECT account_id, SUM(
  CASE WHEN transaction_type = 'CREDIT' THEN amount ELSE -amount END
) AS net_transaction_amount
FROM transactions
GROUP BY account_id;
```

The transfer endpoint updates balances and writes transaction records in a single MySQL transaction. For this reason, test both the UI/API response and the database state.
