# Surplus Management Full-Stack Application

A complete full-stack application for managing surplus products with React frontend and Spring Boot backend.

## 🚀 Quick Start

### Prerequisites
- **Java 17+** (for backend)
- **Node.js 18+** (for frontend)
- **MySQL 8.0+** (for database)
- **Maven 3.6+** (for backend build)

### Backend Setup

The backend is a Spring Boot application that can be easily run using Maven:

```bash
cd backend

# Option 1: Using convenient scripts
./run-dev.sh          # Development mode with hot reload
./run-debug.sh        # Debug mode (remote debugging on port 5005)
./run-prod.sh         # Production mode

# Option 2: Using Maven directly
./mvnw spring-boot:run -Pdev           # Development mode
./mvnw spring-boot:run -Pdebug         # Debug mode
./mvnw clean package -Pprod            # Build for production

# Option 3: Using Make (if available)
make dev              # Development mode
make debug            # Debug mode
make prod             # Production mode
```

**Available endpoints:**
- **Application**: http://localhost:8080
- **API Documentation**: http://localhost:8080/swagger-ui.html
- **Health Check**: http://localhost:8080/actuator/health

For detailed backend documentation, see [backend/README.md](backend/README.md)

### Frontend Setup
```bash
cd frontend  # or wherever your React app is located
npm install
npm run dev
```

## 📋 Features

### 🔐 Authentication & Security
- JWT-based authentication
- Role-based access control (ADMIN, COMPANY, ASSOCIATION, ENTREPRENEUR, INDIVIDUAL)
- Secure password hashing with BCrypt
- CORS configuration for cross-origin requests
- Input validation and SQL injection protection

### 👥 User Management
- User registration and login
- User profiles with detailed information
- Company management for business users
- Account activation and password reset

### 📦 Product Management
- Create, read, update, delete products
- Product categories and conditions
- Image upload support
- Search and filtering capabilities
- Product status tracking (AVAILABLE, RESERVED, IN_PROGRESS, COMPLETED)

### 💼 Transaction Management
- Create transactions for products
- Transaction status workflow (PENDING, ACCEPTED, IN_TRANSIT, DELIVERED, COMPLETED, CANCELLED)
- Transaction history and tracking
- Buyer and seller management

### 🔔 Notification System
- Real-time notifications for users
- Different notification types (SURPLUS_MATCH, TRANSACTION_UPDATE, DELIVERY_UPDATE, SYSTEM, NEW_REQUEST)
- Mark notifications as read
- Notification history

### 📊 Dashboard & Analytics
- User dashboard with statistics
- Company performance metrics
- Transaction analytics
- Product view counts and interests

## 🏗️ Architecture

### Backend (Spring Boot)
```
backend/
├── src/main/java/com/surplus/
│   ├── domain/           # JPA entities
│   ├── repository/       # Data access layer
│   ├── service/          # Business logic
│   ├── controller/       # REST endpoints
│   ├── security/         # Security configuration
│   ├── config/           # Application configuration
│   └── exception/        # Exception handling
├── src/main/resources/
│   ├── application.yml   # Configuration
│   └── data.sql         # Initial data
└── pom.xml              # Maven dependencies
```

### Frontend (React + TypeScript)
```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── services/           # API services
├── types/              # TypeScript types
├── hooks/              # Custom React hooks
├── contexts/           # React contexts
├── lib/                # Utility functions
└── app/                # Application configuration
```

## 🔧 API Endpoints

### Authentication
- `POST /api/authenticate` - User login
- `POST /api/register` - User registration
- `GET /api/account` - Get current user info

### Products
- `GET /api/products/my-products` - Get user's products
- `GET /api/products/search` - Search products
- `POST /api/products` - Create product
- `GET /api/products/{id}` - Get product by ID
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product
- `POST /api/products/{id}/view` - Increment view count

### Transactions
- `GET /api/transactions/my-transactions` - Get user's transactions
- `POST /api/transactions` - Create transaction
- `POST /api/transactions/{id}/accept` - Accept transaction
- `POST /api/transactions/{id}/reject` - Reject transaction
- `POST /api/transactions/{id}/complete` - Complete transaction
- `POST /api/transactions/{id}/cancel` - Cancel transaction

### Companies
- `GET /api/companies/my-company` - Get user's company
- `POST /api/companies` - Create company
- `PUT /api/companies/{id}` - Update company
- `GET /api/companies/{id}/stats` - Get company statistics

### Notifications
- `GET /api/notifications/my-notifications` - Get user's notifications
- `POST /api/notifications/{id}/read` - Mark notification as read
- `POST /api/notifications/mark-all-read` - Mark all as read
- `GET /api/notifications/unread-count` - Get unread count

### User Profiles
- `GET /api/user-profiles/me` - Get current user profile
- `PUT /api/user-profiles/me` - Update current user profile

## 🛠️ Development

### Backend Development
```bash
cd backend
mvn spring-boot:run
```

The backend will be available at `http://localhost:8080`

### Frontend Development
```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:3000` or `http://localhost:5173`

### Database Management
- **Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **H2 Console** (dev): `http://localhost:8080/h2-console`
- **Actuator Health**: `http://localhost:8080/actuator/health`

## 🔒 Security Configuration

### JWT Configuration
```yaml
application:
  jwt:
    secret: your-secret-key-here
    token-validity-in-seconds: 86400
    token-validity-in-seconds-for-remember-me: 2592000
```

### Database Security
- Separate database user with limited privileges
- Encrypted password storage
- SQL injection protection through JPA

### CORS Configuration
```yaml
application:
  cors:
    allowed-origins: 
      - http://localhost:3000
      - http://localhost:5173
    allowed-methods: GET,POST,PUT,DELETE,OPTIONS
    allowed-headers: "*"
    allow-credentials: true
```

## 📊 Database Schema

### Core Tables
- `users` - User authentication data
- `authority` - User roles and permissions
- `user_profile` - Extended user information
- `company` - Company information
- `product` - Product listings
- `transaction` - Transaction records
- `notification` - User notifications

### Relationships
- Users have UserProfiles (1:1)
- Users can belong to Companies (N:1)
- Users own Products (1:N)
- Products have Transactions (1:N)
- Users receive Notifications (1:N)

## 🚀 Production Deployment

### Environment Variables
```bash
export JWT_SECRET=your-production-secret-key
export MYSQL_URL=jdbc:mysql://your-db-host:3306/surplus_db
export MYSQL_USERNAME=your-db-user
export MYSQL_PASSWORD=your-db-password
export MAIL_USERNAME=your-email@domain.com
export MAIL_PASSWORD=your-email-password
```

### Build for Production
```bash
# Backend
cd backend
mvn clean package -Pprod

# Frontend
cd frontend
npm run build
```

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
mvn test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation in `/docs`

---

**Built with ❤️ using Spring Boot, React, and modern web technologies**
