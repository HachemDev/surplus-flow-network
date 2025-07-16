-- Development data for Surplus360
-- This file is loaded when the application starts with dev profile

-- Insert authorities
INSERT INTO authority (name, description) VALUES ('ROLE_ADMIN', 'Administrator role');
INSERT INTO authority (name, description) VALUES ('ROLE_USER', 'User role');
INSERT INTO authority (name, description) VALUES ('ROLE_COMPANY', 'Company role');
INSERT INTO authority (name, description) VALUES ('ROLE_ASSOCIATION', 'Association role');
INSERT INTO authority (name, description) VALUES ('ROLE_ENTREPRENEUR', 'Entrepreneur role');
INSERT INTO authority (name, description) VALUES ('ROLE_INDIVIDUAL', 'Individual role');

-- Insert admin user (password: admin)
INSERT INTO app_user (login, password_hash, first_name, last_name, email, activated, lang_key, created_at, role) 
VALUES ('admin', '$2a$10$gSAhZrxMllrbgj/kkK9UceBPpChGWJA7SzIpFSNNwdUuIS0gQqjS6', 'Administrator', 'System', 'admin@surplus360.com', true, 'en', CURRENT_TIMESTAMP, 'ADMIN');

-- Insert demo user (password: user)
INSERT INTO app_user (login, password_hash, first_name, last_name, email, activated, lang_key, created_at, role) 
VALUES ('user', '$2a$10$VEjxo0jq2YLEe/0zBbMQqOPaHSrWFxqAg8qZPnSsKXvQRdAoUvQy.', 'Demo', 'User', 'user@surplus360.com', true, 'en', CURRENT_TIMESTAMP, 'INDIVIDUAL');

-- Insert demo company user (password: company)
INSERT INTO app_user (login, password_hash, first_name, last_name, email, activated, lang_key, created_at, role) 
VALUES ('company', '$2a$10$mE.qmcV0mFU5NcKh73TZx.z4ueI/.H24qyqUq_T7jECkzqj5w8mJi', 'Company', 'Manager', 'company@surplus360.com', true, 'en', CURRENT_TIMESTAMP, 'COMPANY');

-- Assign authorities to users
INSERT INTO user_authority (user_id, authority_name) VALUES (1, 'ROLE_ADMIN');
INSERT INTO user_authority (user_id, authority_name) VALUES (1, 'ROLE_USER');
INSERT INTO user_authority (user_id, authority_name) VALUES (2, 'ROLE_USER');
INSERT INTO user_authority (user_id, authority_name) VALUES (2, 'ROLE_INDIVIDUAL');
INSERT INTO user_authority (user_id, authority_name) VALUES (3, 'ROLE_USER');
INSERT INTO user_authority (user_id, authority_name) VALUES (3, 'ROLE_COMPANY');

-- Insert sample company
INSERT INTO company (name, type, industry, description, email, phone, address, city, postal_code, country, location, verified, rse_score, total_surplus, total_donations, total_sales, co2_saved, waste_reduced, created_at, updated_at) 
VALUES ('EcoTech Solutions', 'BUSINESS', 'Technology', 'Sustainable technology solutions for businesses', 'contact@ecotech.com', '+33123456789', '123 Green Street', 'Paris', '75001', 'France', 'Paris, France', true, 85, 150, 75, 75, 25.5, 500.0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert sample products
INSERT INTO product (title, description, category, condition, status, quantity, unit, estimated_value, sale_price, location, images, tags, expiration_date, pickup_instructions, views, interests, owner_id, company_id, created_at, updated_at) 
VALUES ('Office Desk Chairs', 'Ergonomic office chairs in excellent condition. Perfect for startups or home offices.', 'OFFICE_EQUIPMENT', 'GOOD', 'AVAILABLE', 10, 'pieces', 1500.00, 750.00, 'Paris, France', '["chair1.jpg", "chair2.jpg"]', 'office,furniture,ergonomic,chairs', NULL, 'Available for pickup during business hours', 45, 12, 3, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO product (title, description, category, condition, status, quantity, unit, estimated_value, sale_price, location, images, tags, expiration_date, pickup_instructions, views, interests, owner_id, company_id, created_at, updated_at) 
VALUES ('Laptop Computers', 'Dell Latitude laptops, refurbished and ready for use. Great for students or small businesses.', 'ELECTRONICS', 'LIKE_NEW', 'AVAILABLE', 5, 'pieces', 2500.00, 1200.00, 'Lyon, France', '["laptop1.jpg", "laptop2.jpg"]', 'electronics,computers,laptops,dell', NULL, 'Contact us to schedule pickup', 78, 25, 3, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO product (title, description, category, condition, status, quantity, unit, estimated_value, sale_price, location, images, tags, expiration_date, pickup_instructions, views, interests, owner_id, company_id, created_at, updated_at) 
VALUES ('Industrial Fabric Rolls', 'High-quality textile materials suitable for various manufacturing purposes.', 'TEXTILE', 'NEW', 'AVAILABLE', 50, 'meters', 5000.00, 2500.00, 'Marseille, France', '["fabric1.jpg", "fabric2.jpg"]', 'textile,fabric,manufacturing,industrial', NULL, 'Large truck access required for pickup', 32, 8, 3, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert sample user profiles
INSERT INTO user_profile (first_name, last_name, phone, address, city, postal_code, country, avatar, is_verified, role, email, company_id, user_id, created_at, updated_at) 
VALUES ('Administrator', 'System', '+33123456789', '123 Admin Street', 'Paris', '75001', 'France', 'admin-avatar.jpg', true, 'ADMIN', 'admin@surplus360.com', NULL, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO user_profile (first_name, last_name, phone, address, city, postal_code, country, avatar, is_verified, role, email, company_id, user_id, created_at, updated_at) 
VALUES ('Demo', 'User', '+33987654321', '456 User Avenue', 'Lyon', '69001', 'France', 'user-avatar.jpg', true, 'INDIVIDUAL', 'user@surplus360.com', NULL, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO user_profile (first_name, last_name, phone, address, city, postal_code, country, avatar, is_verified, role, email, company_id, user_id, created_at, updated_at) 
VALUES ('Company', 'Manager', '+33555666777', '789 Business Boulevard', 'Paris', '75002', 'France', 'company-avatar.jpg', true, 'COMPANY', 'company@surplus360.com', '1', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert sample notifications
INSERT INTO notification (user_id, type, title, message, data, read, priority, created_at, updated_at) 
VALUES ('2', 'SURPLUS_MATCH', 'New Surplus Match Found', 'We found office equipment that matches your interests!', '{"productId": 1, "category": "OFFICE_EQUIPMENT"}', false, 'MEDIUM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO notification (user_id, type, title, message, data, read, priority, created_at, updated_at) 
VALUES ('3', 'SYSTEM', 'Welcome to Surplus360', 'Thank you for joining our circular economy platform!', '{"welcomeMessage": true}', false, 'LOW', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO notification (user_id, type, title, message, data, read, priority, created_at, updated_at) 
VALUES ('1', 'SYSTEM', 'Admin Dashboard Updated', 'New features available in the admin dashboard', '{"feature": "analytics"}', false, 'HIGH', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);