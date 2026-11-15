USE mybank;

INSERT INTO customers (id, first_name, last_name, email, phone) VALUES
(1, 'Aarav', 'Sharma', 'aarav@example.test', '9000000001'),
(2, 'Diya', 'Patel', 'diya@example.test', '9000000002'),
(3, 'Rohan', 'Mehta', 'rohan@example.test', '9000000003');

INSERT INTO accounts (id, customer_id, account_number, account_type, balance, status) VALUES
(1, 1, 'MYB1000001', 'SAVINGS', 25000.00, 'ACTIVE'),
(2, 2, 'MYB1000002', 'SAVINGS', 18000.00, 'ACTIVE'),
(3, 3, 'MYB1000003', 'CURRENT', 42000.00, 'ACTIVE');

INSERT INTO transactions (account_id, transaction_type, amount, description, reference_code) VALUES
(1, 'CREDIT', 25000.00, 'Opening balance', 'OPEN-1001'),
(2, 'CREDIT', 18000.00, 'Opening balance', 'OPEN-1002'),
(3, 'CREDIT', 42000.00, 'Opening balance', 'OPEN-1003');

INSERT INTO loans (id, customer_id, principal, outstanding_balance, term_months, status) VALUES
(1, 1, 12000.00, 12000.00, 3, 'ACTIVE');
