CREATE DATABASE IF NOT EXISTS shopping_app;
USE shopping_app;

CREATE TABLE IF NOT EXISTS customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(30),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    category VARCHAR(100),
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO customers (first_name, last_name, email, phone) VALUES
('Rahul', 'Sharma', 'rahul@example.com', '9000000001'),
('Priya', 'Kumar', 'priya@example.com', '9000000002'),
('Amit', 'Verma', 'amit@example.com', '9000000003')
ON DUPLICATE KEY UPDATE
first_name = VALUES(first_name),
last_name = VALUES(last_name),
phone = VALUES(phone);

INSERT INTO products (product_name, description, price, stock_quantity, category, image_url) VALUES
('Wireless Headphones', 'Over-ear wireless headphones for everyday listening.', 2499.00, 25, 'Electronics', 'https://placehold.co/600x400?text=Headphones'),
('Running Shoes', 'Comfortable shoes for walking and running.', 3199.00, 18, 'Fashion', 'https://placehold.co/600x400?text=Shoes'),
('Backpack', 'Everyday backpack with multiple compartments.', 1499.00, 30, 'Accessories', 'https://placehold.co/600x400?text=Backpack'),
('Water Bottle', 'Reusable stainless-steel water bottle.', 599.00, 50, 'Home', 'https://placehold.co/600x400?text=Bottle');
