# Surplus360 - Frontend & Backend Integration Guide

This guide explains how to set up and run the Surplus360 application with proper frontend-backend integration, focusing on authentication.

## Architecture Overview

- **Frontend**: React + TypeScript + Vite + Tailwind CSS + ShadCN UI (Port 3000)
- **Backend**: Spring Boot + JHipster + JWT Authentication (Port 8080)
- **Database**: H2 (Development) / MySQL (Production)
- **Integration**: Vite proxy for seamless API communication

## Quick Start

### 1. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies (Maven will handle this)
cd backend && ./mvnw dependency:resolve
cd ..
```

### 2. Start Development Environment

**Option A: Start both simultaneously**
```bash
npm run dev:full
```

**Option B: Start separately**
```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend  
npm run dev:frontend
```

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api
- **H2 Database Console**: http://localhost:8080/h2-console

## Authentication Flow

### JWT Token Authentication

The application uses JWT tokens for authentication following JHipster standards:

1. **Login**: `POST /api/authenticate`
   ```json
   {
     "username": "admin",
     "password": "admin",
     "rememberMe": false
   }
   ```

2. **Response**: 
   ```json
   {
     "id_token": "eyJhbGciOiJIUzUxMiJ9..."
   }
   ```

3. **Subsequent Requests**: Include `Authorization: Bearer <token>` header

### Default Users

The backend comes with default users:

- **Admin**: 
  - Username: `admin`
  - Password: `admin`
  - Roles: `ROLE_USER`, `ROLE_ADMIN`

- **User**: 
  - Username: `user`
  - Password: `user`
  - Roles: `ROLE_USER`

### Frontend Authentication Service

The frontend `AuthService` handles:

- Token storage (localStorage/sessionStorage)
- Automatic token inclusion in API requests
- Token expiration handling
- User account fetching

```typescript
// Login example
import AuthService from '@/services/AuthService';

const loginResponse = await AuthService.login({
  username: 'admin',
  password: 'admin',
  rememberMe: true
});

// Get current user account
const userAccount = await AuthService.getAccount();
```

## API Integration

### Proxy Configuration

The Vite development server proxies API requests to the backend:

```typescript
// vite.config.ts
proxy: {
  '/api': {
    target: 'http://localhost:8080',
    changeOrigin: true,
    secure: false,
  }
}
```

### API Base Service

All API services extend `BaseApiService` which:

- Automatically adds JWT tokens to requests
- Handles authentication errors (401/403)
- Provides common HTTP methods (GET, POST, PUT, DELETE)
- Manages pagination and search parameters

### Entity Services

Generated services for each entity:

- `CompanyService`: CRUD operations for companies
- `ProductService`: Product management
- `TransactionService`: Transaction handling
- `NotificationService`: Notification management
- `UserProfileService`: User profile operations

## Development Workflow

### 1. Backend Development

```bash
# Start backend only
npm run dev:backend

# Run backend tests
npm run backend:test

# Access H2 console
# URL: http://localhost:8080/h2-console
# JDBC URL: jdbc:h2:mem:surplus360
# Username: surplus360
# Password: (empty)
```

### 2. Frontend Development

```bash
# Start frontend only
npm run dev:frontend

# Lint frontend code
npm run lint

# Build for production
npm run build
```

### 3. Database Access

**H2 Console (Development):**
- URL: http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:mem:surplus360`
- Username: `surplus360`
- Password: (leave empty)

## Authentication Integration Examples

### 1. Login Component

```typescript
import { useAuth } from '@/contexts/AuthContext';

const LoginForm = () => {
  const { login } = useAuth();
  
  const handleSubmit = async (credentials) => {
    try {
      await login(credentials);
      // Redirect to dashboard
    } catch (error) {
      // Handle login error
    }
  };
};
```

### 2. Protected Routes

```typescript
import { useAuth } from '@/contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};
```

### 3. API Calls with Authentication

```typescript
import { useAuth } from '@/contexts/AuthContext';
import { companyService } from '@/services/api';

const CompanyList = () => {
  const { hasRole } = useAuth();
  
  const createCompany = async (companyData) => {
    if (!hasRole('ROLE_USER')) {
      throw new Error('Insufficient permissions');
    }
    
    return await companyService.create(companyData);
  };
};
```

## Environment Configuration

### Development (.env)

```bash
VITE_API_URL=http://localhost:3000/api
VITE_BACKEND_URL=http://localhost:8080
NODE_ENV=development
```

### Production

Update environment variables for production deployment:

```bash
VITE_API_URL=https://your-domain.com/api
VITE_BACKEND_URL=https://your-domain.com
NODE_ENV=production
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure Vite proxy is configured correctly
2. **Authentication Fails**: Check if backend is running on port 8080
3. **Database Connection**: Verify H2 console access and connection settings
4. **API 404 Errors**: Confirm API endpoints match JHipster conventions

### Debug Steps

1. Check if backend is running: `curl http://localhost:8080/api/account`
2. Verify frontend proxy: Check Network tab in browser DevTools
3. Inspect JWT token: Use jwt.io to decode tokens
4. Check backend logs for authentication issues

## Next Steps

1. **Customize Authentication**: Add social login, 2FA, etc.
2. **Add User Registration**: Implement user registration flow
3. **Role-Based Access**: Implement fine-grained permissions
4. **API Documentation**: Set up Swagger/OpenAPI documentation
5. **Testing**: Add integration tests for authentication flow

## Support

For issues related to:
- **Frontend**: Check Vite and React documentation
- **Backend**: Refer to JHipster documentation
- **Authentication**: Review JWT and Spring Security guides