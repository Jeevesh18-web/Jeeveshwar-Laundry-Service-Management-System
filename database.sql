CREATE DATABASE IF NOT EXISTS jeeveshwar_laundry;
USE jeeveshwar_laundry;

CREATE TABLE customers (
  customer_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(15) NOT NULL,
  email VARCHAR(100),
  address VARCHAR(255)
);

CREATE TABLE services (
  service_id INT AUTO_INCREMENT PRIMARY KEY,
  service_name VARCHAR(100) NOT NULL,
  service_type VARCHAR(100),
  price_per_kg DECIMAL(10,2) NOT NULL,
  description VARCHAR(255)
);

CREATE TABLE orders (
  order_id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  service_id INT NOT NULL,
  clothes_weight DECIMAL(8,2) NOT NULL,
  order_date DATE NOT NULL,
  delivery_date DATE,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(30) DEFAULT 'Received',
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
  FOREIGN KEY (service_id) REFERENCES services(service_id)
);

CREATE TABLE payments (
  payment_id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_date DATE NOT NULL,
  payment_method VARCHAR(30),
  status VARCHAR(20) DEFAULT 'Pending',
  FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

INSERT INTO services (service_name, service_type, price_per_kg, description) VALUES
('Washing', 'Wash', 50.00, 'Regular clothes washing'),
('Ironing', 'Press', 30.00, 'Steam ironing service'),
('Dry Cleaning', 'Premium', 120.00, 'Special care dry cleaning');
