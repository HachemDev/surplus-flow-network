# Surplus Management Full-Stack Application

A complete monolithic full-stack application for managing surplus products with React frontend integrated into a Spring Boot backend.

## 🚀 Quick Start

### Prerequisites
- **Java 17+** (required)
- **Maven 3.6+** (optional - Maven wrapper included)
- **Node.js 18+** (for frontend development)
- **MySQL 8.0+** (for production database)

### Running the Application

The application is now structured as a **monolithic Spring Boot application** with Maven configuration at the root level.

#### Development Mode (Backend Only)
```bash
# Option 1: Using convenient scripts
./run-dev.sh

# Option 2: Using Maven wrapper directly
./mvnw spring-boot:run -Pdev

# Option 3: Using Make
make dev
```

#### Full-Stack Development (Frontend + Backend)
```bash
# Terminal 1: Start backend
./run-dev.sh

# Terminal 2: Start frontend dev server
npm run dev
```

#### Debug Mode (Remote Debugging)
```bash
# Using script
./run-debug.sh

# Using Maven directly
./mvnw spring-boot:run -Pdebug
```

#### Production Mode (Full-Stack Build)
```bash
# Using script (builds frontend automatically)
./run-prod.sh

# Using Maven directly
./mvnw clean package -Pprod
java -jar target/surplus-management-1.0.0.jar
```

### Available Endpoints

When running:
- **Application**: http://localhost:8080
- **API Documentation**: http://localhost:8080/swagger-ui.html
- **Health Check**: http://localhost:8080/actuator/health
- **Frontend (dev)**: http://localhost:5173 (if running separately)

## 📁 Project Structure

```
surplus-management/
├── src/
│   ├── main/
│   │   ├── java/com/surplus/          # Spring Boot backend code
│   │   │   ├── SurplusBackendApplication.java
│   │   │   ├── controller/             # REST controllers
│   │   │   ├── entity/                 # JPA entities
│   │   │   ├── repository/             # Data repositories
│   │   │   ├── service/                # Business logic
│   │   │   └── dto/                    # Data transfer objects
│   │   └── resources/
│   │       ├── application.yml         # Main configuration
│   │       ├── application-dev.yml     # Development config
│   │       ├── application-prod.yml    # Production config
│   │       └── static/                 # Frontend build output (prod)
│   └── test/                           # Test classes
├── src/                                # Frontend React source (root level)
├── public/                             # Frontend public assets
├── dist/                               # Frontend build output
├── pom.xml                             # Maven configuration (ROOT LEVEL)
├── mvnw, mvnw.cmd                      # Maven wrapper
├── package.json                        # Frontend dependencies
├── run-dev.sh                          # Development script
├── run-debug.sh                        # Debug script
├── run-prod.sh                         # Production script
├── Makefile                            # Make commands
└── README.md                           # This file
```

## 🔧 Development

### Maven Profiles

- **dev** (default): Development mode with hot reload
- **debug**: Development mode with remote debugging on port 5005
- **prod**: Production mode with frontend build integration

### Available Commands

#### Maven Commands
```bash
# Development
./mvnw spring-boot:run -Pdev

# Debug mode
./mvnw spring-boot:run -Pdebug

# Production build (includes frontend)
./mvnw clean package -Pprod

# Run tests
./mvnw test

# Clean
./mvnw clean
```

#### Make Commands
```bash
make dev        # Start backend in development mode
make debug      # Start backend in debug mode
make prod       # Build and run full-stack in production
make test       # Run backend tests
make clean      # Clean all build artifacts
make frontend   # Start frontend development server
make setup      # Install all dependencies
```

#### NPM Commands (Frontend)
```bash
npm install     # Install frontend dependencies
npm run dev     # Start frontend development server
npm run build   # Build frontend for production
npm run preview # Preview production build
```

## 🐛 Debugging

### Remote Debugging Setup

The application supports remote debugging on port 5005:

**IntelliJ IDEA:**
1. Run → Edit Configurations
2. Add "Remote JVM Debug"
3. Host: `localhost`, Port: `5005`

**VS Code:**
1. Use the provided `.vscode/launch.json`
2. Select "Debug Surplus Management (Remote)"

**Eclipse:**
1. Run → Debug Configurations
2. Create "Remote Java Application"
3. Host: `localhost`, Port: `5005`

## 📦 Production Deployment

### Building for Production

The production build automatically:
1. Installs Node.js and npm
2. Installs frontend dependencies
3. Builds the React frontend
4. Copies frontend build to Spring Boot static resources
5. Creates a single executable JAR

```bash
./mvnw clean package -Pprod
java -jar target/surplus-management-1.0.0.jar
```

### Docker Deployment

```bash
# Build the application
./mvnw clean package -Pprod

# Run with Docker (if Dockerfile exists)
docker build -t surplus-management .
docker run -p 8080:8080 surplus-management
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
- Email notifications for status changes
- Transaction history and tracking

### 🎨 Frontend Features
- Modern React UI with TypeScript
- Responsive design with Tailwind CSS
- Real-time updates
- Interactive dashboards
- Mobile-friendly interface

## 🗄️ Database Configuration

### Development
Uses H2 in-memory database by default for development.

### Production
Configure MySQL connection in `src/main/resources/application-prod.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/surplus_db
    username: ${DB_USERNAME:surplus_user}
    password: ${DB_PASSWORD:surplus_password}
```

## 🧪 Testing

```bash
# Run all tests
./mvnw test

# Run specific test class
./mvnw test -Dtest=UserControllerTest

# Run tests with coverage
./mvnw test jacoco:report
```

## 📝 Common Issues

### Port Already in Use
```bash
./mvnw spring-boot:run -Dspring-boot.run.jvmArguments="-Dserver.port=8090"
```

### Java Version Issues
```bash
java -version  # Should be 17+
echo $JAVA_HOME
```

### Frontend Build Issues
```bash
npm install    # Reinstall dependencies
npm run build  # Test frontend build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `./mvnw test`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

## 🎯 Key Benefits of This Structure

1. **Monolithic Architecture**: Single deployable unit
2. **Maven at Root**: Standard Maven project structure
3. **Integrated Frontend**: Frontend built and served by Spring Boot
4. **Multiple Run Options**: Scripts, Maven, Make commands
5. **Development Friendly**: Hot reload, debugging, separate dev servers
6. **Production Ready**: Single JAR deployment with embedded frontend
7. **Cross-Platform**: Works on Windows, macOS, Linux
