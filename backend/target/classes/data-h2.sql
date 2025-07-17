-- Insert default authorities
INSERT INTO authority (name) VALUES ('ROLE_ADMIN');
INSERT INTO authority (name) VALUES ('ROLE_COMPANY');
INSERT INTO authority (name) VALUES ('ROLE_ASSOCIATION');
INSERT INTO authority (name) VALUES ('ROLE_ENTREPRENEUR');
INSERT INTO authority (name) VALUES ('ROLE_INDIVIDUAL');

-- Create default admin user (password: admin123)
INSERT INTO users (id, login, password_hash, first_name, last_name, email, activated, lang_key, created_date, last_modified_date) 
VALUES (1, 'admin', '$2a$10$gSAhZrxMllrbgj/kkK9UceBPpChGWJA7SYIpBnEm.6HuvxBRdmcr2', 'Admin', 'User', 'admin@surplus.com', true, 'en', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Link admin user to admin role
INSERT INTO user_authority (user_id, authority_name) VALUES (1, 'ROLE_ADMIN');

-- Create admin user profile
INSERT INTO user_profile (id, first_name, last_name, email, role, is_verified, created_at, user_id) 
VALUES (1, 'Admin', 'User', 'admin@surplus.com', 'ADMIN', true, CURRENT_TIMESTAMP, 1);

-- Create sample company
INSERT INTO company (id, name, type, industry, description, email, phone, address, city, country, verified, total_surplus, total_donations, total_sales, co2_saved, waste_reduced, created_at, updated_at) 
VALUES (1, 'Green Tech Solutions', 'BUSINESS', 'Technology', 'A leading technology company focused on sustainable solutions', 'contact@greentech.com', '+1-555-0123', '123 Innovation Drive', 'San Francisco', 'USA', true, 150, 75, 45, 2500.00, 1800.50, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Create sample user for company
INSERT INTO users (id, login, password_hash, first_name, last_name, email, activated, lang_key, created_date, last_modified_date) 
VALUES (2, 'company_user', '$2a$10$gSAhZrxMllrbgj/kkK9UceBPpChGWJA7SYIpBnEm.6HuvxBRdmcr2', 'John', 'Doe', 'john@greentech.com', true, 'en', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Link company user to company role
INSERT INTO user_authority (user_id, authority_name) VALUES (2, 'ROLE_COMPANY');

-- Create company user profile
INSERT INTO user_profile (id, first_name, last_name, email, role, is_verified, created_at, user_id, company_id) 
VALUES (2, 'John', 'Doe', 'john@greentech.com', 'COMPANY', true, CURRENT_TIMESTAMP, 2, 1);

-- Create sample products
INSERT INTO product (id, title, description, category, condition, status, quantity, unit, estimated_value, sale_price, location, images, tags, views, interests, created_at, updated_at, owner_id, company_id) 
VALUES 
(1, 'Office Desk Chairs', 'High-quality ergonomic office chairs, slightly used but in excellent condition', 'OFFICE_EQUIPMENT', 'GOOD', 'AVAILABLE', 25, 'pieces', 2500.00, 1200.00, 'San Francisco, CA', 'chair1.jpg,chair2.jpg', 'office,furniture,ergonomic', 45, 12, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 1),
(2, 'Laptop Computers', 'Dell Latitude laptops, 2-year-old models, perfect for students or small businesses', 'ELECTRONICS', 'GOOD', 'AVAILABLE', 10, 'pieces', 8000.00, 4500.00, 'San Francisco, CA', 'laptop1.jpg,laptop2.jpg', 'electronics,computers,dell', 78, 23, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 1),
(3, 'Fabric Rolls', 'Various cotton fabric rolls from textile production overstock', 'TEXTILE', 'NEW', 'AVAILABLE', 50, 'rolls', 1500.00, 800.00, 'San Francisco, CA', 'fabric1.jpg,fabric2.jpg', 'textile,cotton,fabric', 32, 8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 1);

-- Create sample individual user
INSERT INTO users (id, login, password_hash, first_name, last_name, email, activated, lang_key, created_date, last_modified_date) 
VALUES (3, 'individual_user', '$2a$10$gSAhZrxMllrbgj/kkK9UceBPpChGWJA7SYIpBnEm.6HuvxBRdmcr2', 'Jane', 'Smith', 'jane@example.com', true, 'en', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Link individual user to individual role
INSERT INTO user_authority (user_id, authority_name) VALUES (3, 'ROLE_INDIVIDUAL');

-- Create individual user profile
INSERT INTO user_profile (id, first_name, last_name, email, role, is_verified, created_at, user_id) 
VALUES (3, 'Jane', 'Smith', 'jane@example.com', 'INDIVIDUAL', false, CURRENT_TIMESTAMP, 3);

-- Create sample transactions
INSERT INTO transaction (id, type, status, price, quantity, message, created_at, product_id, buyer_id, seller_id) 
VALUES 
(1, 'SALE', 'PENDING', 600.00, 5, 'Interested in purchasing 5 chairs for our startup office', CURRENT_TIMESTAMP, 1, 3, 2),
(2, 'DONATION', 'COMPLETED', 0.00, 2, 'These laptops would be perfect for our coding bootcamp students', CURRENT_TIMESTAMP, 2, 3, 2);

-- Create sample notifications
INSERT INTO notification (id, type, title, message, read, priority, created_at, user_id) 
VALUES 
(1, 'NEW_REQUEST', 'New Purchase Request', 'Jane Smith is interested in your Office Desk Chairs', false, 'NORMAL', CURRENT_TIMESTAMP, 2),
(2, 'TRANSACTION_UPDATE', 'Transaction Completed', 'Your donation of laptops has been completed successfully', true, 'HIGH', CURRENT_TIMESTAMP, 2),
(3, 'SURPLUS_MATCH', 'Surplus Match Found', 'We found office chairs that match your interests', false, 'HIGH', CURRENT_TIMESTAMP, 3);