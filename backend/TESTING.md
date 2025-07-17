# Backend API Testing Guide

## Overview
This guide provides comprehensive testing instructions for the Surplus Management Backend API.

## Prerequisites
- Backend running on `http://localhost:8080`
- MySQL database configured and running
- Sample data loaded (via `data.sql`)

## Test Users

### Admin User
- **Username**: `admin`
- **Password**: `admin123`
- **Role**: `ROLE_ADMIN`
- **Email**: `admin@surplus.com`

### Company User
- **Username**: `company_user`
- **Password**: `admin123`
- **Role**: `ROLE_COMPANY`
- **Email**: `john@greentech.com`

### Individual User
- **Username**: `individual_user`
- **Password**: `admin123`
- **Role**: `ROLE_INDIVIDUAL`
- **Email**: `jane@example.com`

## API Testing with cURL

### 1. Authentication Tests

#### Login as Admin
```bash
curl -X POST http://localhost:8080/api/authenticate \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123",
    "rememberMe": false
  }'
```

#### Login as Company User
```bash
curl -X POST http://localhost:8080/api/authenticate \
  -H "Content-Type: application/json" \
  -d '{
    "username": "company_user",
    "password": "admin123",
    "rememberMe": false
  }'
```

#### Register New User
```bash
curl -X POST http://localhost:8080/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "login": "newuser",
    "email": "newuser@example.com",
    "password": "password123",
    "firstName": "New",
    "lastName": "User",
    "langKey": "en"
  }'
```

#### Get Account Info
```bash
curl -X GET http://localhost:8080/api/account \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 2. Product Tests

#### Get My Products (Company User)
```bash
curl -X GET "http://localhost:8080/api/products/my-products?page=0&size=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Search Products
```bash
curl -X GET "http://localhost:8080/api/products/search?search=office&page=0&size=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Create New Product
```bash
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Test Product",
    "description": "This is a test product",
    "category": "OFFICE_EQUIPMENT",
    "condition": "GOOD",
    "quantity": 5,
    "unit": "pieces",
    "estimatedValue": 500.00,
    "salePrice": 300.00,
    "location": "Test Location",
    "tags": "test,sample"
  }'
```

#### Get Product by ID
```bash
curl -X GET http://localhost:8080/api/products/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Update Product
```bash
curl -X PUT http://localhost:8080/api/products/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Updated Product Title",
    "description": "Updated description",
    "category": "OFFICE_EQUIPMENT",
    "condition": "GOOD",
    "quantity": 10,
    "unit": "pieces",
    "estimatedValue": 600.00,
    "salePrice": 400.00,
    "location": "Updated Location",
    "tags": "updated,test"
  }'
```

### 3. Transaction Tests

#### Get My Transactions
```bash
curl -X GET "http://localhost:8080/api/transactions/my-transactions?page=0&size=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Create Transaction
```bash
curl -X POST http://localhost:8080/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "type": "SALE",
    "price": 250.00,
    "quantity": 2,
    "message": "Interested in purchasing 2 units",
    "product": {"id": 1}
  }'
```

#### Accept Transaction (Seller)
```bash
curl -X POST http://localhost:8080/api/transactions/1/accept \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Reject Transaction (Seller)
```bash
curl -X POST http://localhost:8080/api/transactions/1/reject \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "reason": "Item no longer available"
  }'
```

#### Complete Transaction
```bash
curl -X POST http://localhost:8080/api/transactions/1/complete \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Company Tests

#### Get My Company
```bash
curl -X GET http://localhost:8080/api/companies/my-company \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Get All Companies
```bash
curl -X GET "http://localhost:8080/api/companies?page=0&size=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Create Company
```bash
curl -X POST http://localhost:8080/api/companies \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Test Company",
    "type": "BUSINESS",
    "industry": "Technology",
    "description": "A test company",
    "email": "test@company.com",
    "phone": "+1-555-0199",
    "address": "123 Test Street",
    "city": "Test City",
    "country": "USA"
  }'
```

#### Get Company Stats
```bash
curl -X GET http://localhost:8080/api/companies/1/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 5. Notification Tests

#### Get My Notifications
```bash
curl -X GET "http://localhost:8080/api/notifications/my-notifications?page=0&size=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Get Unread Count
```bash
curl -X GET http://localhost:8080/api/notifications/unread-count \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Mark Notification as Read
```bash
curl -X POST http://localhost:8080/api/notifications/1/read \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Mark All as Read
```bash
curl -X POST http://localhost:8080/api/notifications/mark-all-read \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 6. User Profile Tests

#### Get My Profile
```bash
curl -X GET http://localhost:8080/api/user-profiles/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Update My Profile
```bash
curl -X PUT http://localhost:8080/api/user-profiles/me \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "firstName": "Updated",
    "lastName": "Name",
    "phone": "+1-555-0123",
    "address": "123 Updated Street",
    "city": "Updated City",
    "country": "USA"
  }'
```

## Testing with Postman

### Import Collection
1. Open Postman
2. Import the following collection:

```json
{
  "info": {
    "name": "Surplus Management API",
    "description": "API collection for testing the Surplus Management backend"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:8080"
    },
    {
      "key": "token",
      "value": ""
    }
  ],
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"username\": \"admin\",\n  \"password\": \"admin123\",\n  \"rememberMe\": false\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/authenticate",
              "host": ["{{baseUrl}}"],
              "path": ["api", "authenticate"]
            }
          }
        }
      ]
    }
  ]
}
```

### Environment Variables
Create a Postman environment with:
- `baseUrl`: `http://localhost:8080`
- `token`: (will be set automatically after login)

## Automated Testing

### Run Unit Tests
```bash
cd backend
mvn test
```

### Run Integration Tests
```bash
cd backend
mvn test -Dtest=**/*IT
```

### Generate Test Report
```bash
cd backend
mvn surefire-report:report
```

## Health Checks

### Application Health
```bash
curl -X GET http://localhost:8080/actuator/health
```

### Database Health
```bash
curl -X GET http://localhost:8080/actuator/health/db
```

### Application Info
```bash
curl -X GET http://localhost:8080/actuator/info
```

## Expected Responses

### Successful Login Response
```json
{
  "id_token": "eyJhbGciOiJIUzUxMiJ9..."
}
```

### Account Info Response
```json
{
  "id": 1,
  "login": "admin",
  "firstName": "Admin",
  "lastName": "User",
  "email": "admin@surplus.com",
  "activated": true,
  "langKey": "en",
  "authorities": ["ROLE_ADMIN"]
}
```

### Product List Response
```json
{
  "content": [
    {
      "id": 1,
      "title": "Office Desk Chairs",
      "description": "High-quality ergonomic office chairs...",
      "category": "OFFICE_EQUIPMENT",
      "condition": "GOOD",
      "status": "AVAILABLE",
      "quantity": 25,
      "unit": "pieces",
      "estimatedValue": 2500.00,
      "salePrice": 1200.00,
      "location": "San Francisco, CA",
      "views": 45,
      "interests": 12
    }
  ],
  "totalElements": 3,
  "totalPages": 1,
  "size": 10,
  "number": 0,
  "first": true,
  "last": true
}
```

## Common Error Responses

### 401 Unauthorized
```json
{
  "error": "Authentication failed",
  "message": "Invalid credentials",
  "status": 401
}
```

### 403 Forbidden
```json
{
  "error": "Access denied",
  "message": "You don't have permission to access this resource",
  "status": 403
}
```

### 404 Not Found
```json
{
  "error": "Resource not found",
  "message": "The requested resource was not found",
  "status": 404
}
```

### 400 Bad Request
```json
{
  "error": "Validation failed",
  "details": {
    "title": "Title is required",
    "quantity": "Quantity must be greater than 0"
  },
  "status": 400
}
```

## Performance Testing

### Load Testing with Apache Bench
```bash
# Test login endpoint
ab -n 100 -c 10 -p login.json -T application/json http://localhost:8080/api/authenticate

# Test product search
ab -n 100 -c 10 -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8080/api/products/search
```

### Memory and CPU Monitoring
```bash
# Monitor application metrics
curl -X GET http://localhost:8080/actuator/metrics/jvm.memory.used
curl -X GET http://localhost:8080/actuator/metrics/system.cpu.usage
```

This testing guide provides comprehensive coverage of all API endpoints and common testing scenarios for the Surplus Management Backend.