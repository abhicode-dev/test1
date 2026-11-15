CREATE DATABASE IF NOT EXISTS mybank;
USE mybank;

DROP TABLE IF EXISTS loan_repayments;
DROP TABLE IF EXISTS loans;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS accounts;
DROP TABLE IF EXISTS customers;

CREATE TABLE customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(60) NOT NULL,
  last_name VARCHAR(60) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE accounts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  account_number VARCHAR(20) NOT NULL UNIQUE,
  account_type ENUM('SAVINGS','CURRENT') NOT NULL DEFAULT 'SAVINGS',
  balance DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  status ENUM('ACTIVE','BLOCKED') NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_accounts_customer FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  account_id INT NOT NULL,
  transaction_type ENUM('CREDIT','DEBIT') NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  description VARCHAR(255),
  reference_code VARCHAR(40),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_transactions_account FOREIGN KEY (account_id) REFERENCES accounts(id)
);

CREATE TABLE loans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  principal DECIMAL(12,2) NOT NULL,
  outstanding_balance DECIMAL(12,2) NOT NULL,
  term_months INT NOT NULL,
  status ENUM('ACTIVE','PAID') NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_loans_customer FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE loan_repayments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  loan_id INT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  note VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_repayments_loan FOREIGN KEY (loan_id) REFERENCES loans(id)
);
