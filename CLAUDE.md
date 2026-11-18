# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Overview
"ShopEase" — a beginner-friendly learning project: React + Vite frontend, Express REST API, MySQL database. Not production-ready: no auth, payments, orders, or admin authorization yet.

## Layout
```text
./
├── client/            React 18 + Vite (ES modules, .jsx)
│   └── src/
│       ├── App.jsx            Page switching via useState ('products' | 'customers'), no router
│       ├── pages/             ProductsPage.jsx, CustomersPage.jsx
│       ├── services/api.js    fetch wrappers; API_BASE_URL hardcoded to http://localhost:5000/api
│       └── styles.css
├── server/            Express 4 API (ES modules, "type": "module")
│   ├── server.js              App setup, /api/health, route mounting, error handler
│   ├── config/db.js           mysql2/promise connection pool (reads .env)
│   └── routes/                customers.js, products.js (Express Router)
└── database/shopping.sql      Creates `shopping_app` DB + sample data
```

## Commands
Run from `server/`:
- `npm install`
- `npm run dev` — nodemon, API on http://localhost:5000
- `npm start` — plain node

Run from `client/`:
- `npm install`
- `npm run dev` — Vite dev server (usually http://localhost:5173)
- `npm run build` / `npm run preview`

Database: run `database/shopping.sql` in MySQL to create/reset the schema and sample data.

There are no tests or linters configured.

## Configuration
- Server reads `server/.env` (copy from `.env.example`): `PORT`, `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`.
- Never commit `.env` or print/echo real database credentials.

## API endpoints
- `GET /api/health` — checks DB with `SELECT 1`
- `GET /api/products`
- `GET /api/customers`

## Conventions
- 4-space indentation, single quotes, semicolons, ES module `import`/`export`.
- Route handlers: `async (req, res, next)` with `try/catch` passing errors to `next(error)`; the central error handler in `server.js` returns a generic 500.
- Use `pool.execute` with `?` placeholders for any user-supplied values (no string-concatenated SQL).
- Snake_case column names are returned as-is to the client (e.g. `product_id`, `stock_quantity`).
- New API calls go in `client/src/services/api.js`; new pages go in `client/src/pages/` and are wired into `App.jsx`.
- When adding a new table or column, update `database/shopping.sql` as well.

## Notes
- Customer data is sample data only — don't add real personal information.
- Platform is Windows; README commands use PowerShell.
