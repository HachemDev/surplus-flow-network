# Surplus Management Backend

A Spring Boot backend application for the Surplus Management System.

## 🚀 Quick Start

### Prerequisites

- Java 17 or higher
- Maven 3.6+ (or use the included Maven wrapper)
- MySQL 8.0+ (for production)

### Running the Application

The backend can be run in several ways using Maven:

#### 1. Development Mode (Recommended for development)
```bash
# Using the convenient script
./run-dev.sh

# Or directly with Maven wrapper
./mvnw spring-boot:run -Pdev
```

#### 2. Debug Mode (For debugging with IDE)
```bash
# Using the convenient script
./run-debug.sh

# Or directly with Maven wrapper
./mvnw spring-boot:run -Pdebug -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005"
```

#### 3. Production Mode
```bash
# Using the convenient script
./run-prod.sh

# Or manually
./mvnw clean package -Pprod
java -jar target/surplus-backend-1.0.0.jar
```

## 🔧 Development

### Maven Profiles

The project includes several Maven profiles:

- **dev** (default): Development mode with hot reload and dev tools
- **debug**: Development mode with remote debugging enabled
- **prod**: Production mode with optimizations

### Available Maven Commands

```bash
# Clean and compile
./mvnw clean compile

# Run tests
./mvnw test

# Package the application
./mvnw package

# Run with specific profile
./mvnw spring-boot:run -Pdev
./mvnw spring-boot:run -Pprod

# Skip tests during build
./mvnw package -DskipTests

# Run with custom port
./mvnw spring-boot:run -Dspring-boot.run.jvmArguments="-Dserver.port=8090"
```

### Hot Reload

The application includes Spring Boot DevTools for automatic restart during development:

- Automatic restart when classpath files change
- LiveReload support for web resources
- Enhanced development experience

## 🐛 Debugging

### Remote Debugging

When running in debug mode, the application starts with remote debugging enabled:

- **Debug Port**: 5005
- **Host**: localhost
- **Transport**: Socket
- **Mode**: Attach to JVM

#### IDE Configuration

**IntelliJ IDEA:**
1. Go to Run → Edit Configurations
2. Add new "Remote JVM Debug" configuration
3. Set Host: `localhost`, Port: `5005`
4. Set Debugger mode: `Attach to JVM`

**VS Code:**
1. Add to `launch.json`:
```json
{
    "type": "java",
    "name": "Debug Backend",
    "request": "attach",
    "hostName": "localhost",
    "port": 5005
}
```

**Eclipse:**
1. Go to Run → Debug Configurations
2. Create new "Remote Java Application"
3. Set Host: `localhost`, Port: `5005`

## 📊 Monitoring and Health

The application includes Spring Boot Actuator for monitoring:

- **Health Check**: http://localhost:8080/actuator/health
- **Application Info**: http://localhost:8080/actuator/info
- **Metrics**: http://localhost:8080/actuator/metrics

## 📚 API Documentation

When running, the API documentation is available at:
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/v3/api-docs

## 🗄️ Database Configuration

### Development (H2 In-Memory)
The application uses H2 in-memory database by default for development.

### Production (MySQL)
Configure MySQL connection in `application-prod.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/surplus_db
    username: ${DB_USERNAME:surplus_user}
    password: ${DB_PASSWORD:surplus_password}
```

## 🔐 Security

The application includes Spring Security with JWT authentication:

- JWT token-based authentication
- Role-based access control
- Secure endpoints protection

## 🧪 Testing

Run tests with Maven:

```bash
# Run all tests
./mvnw test

# Run specific test class
./mvnw test -Dtest=UserControllerTest

# Run tests with coverage
./mvnw test jacoco:report
```

## 📁 Project Structure

```
src/
├── main/
│   ├── java/com/surplus/
│   │   ├── SurplusBackendApplication.java  # Main application class
│   │   ├── config/                         # Configuration classes
│   │   ├── controller/                     # REST controllers
│   │   ├── entity/                         # JPA entities
│   │   ├── repository/                     # Data repositories
│   │   ├── service/                        # Business logic
│   │   └── dto/                           # Data transfer objects
│   └── resources/
│       ├── application.yml                 # Main configuration
│       ├── application-dev.yml             # Development config
│       └── application-prod.yml            # Production config
└── test/                                   # Test classes
```

## 🔄 Continuous Integration

The project is configured for CI/CD with:

- Maven wrapper for consistent builds
- Profile-based configuration
- Automated testing
- Docker support

## 📝 Common Issues

### Port Already in Use
If port 8080 is already in use, run with a different port:
```bash
./mvnw spring-boot:run -Dspring-boot.run.jvmArguments="-Dserver.port=8090"
```

### Java Version Issues
Ensure Java 17 is installed and set as JAVA_HOME:
```bash
java -version
echo $JAVA_HOME
```

### Maven Issues
If Maven is not installed, use the included wrapper:
```bash
./mvnw --version
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `./mvnw test`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.