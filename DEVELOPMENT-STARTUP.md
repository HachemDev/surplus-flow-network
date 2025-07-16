# Surplus360 Backend - Development Startup Guide

## 🚀 Quick Start

### Prerequisites
- Java 21 or higher
- Maven 3.8+
- Docker and Docker Compose (optional)

### 1. Clone and Setup
```bash
# Navigate to the project directory
cd surplus360-backend

# Install dependencies
mvn clean install
```

### 2. Start Infrastructure (Optional)
```bash
# Start all services with Docker Compose
docker-compose up -d

# Or run individual services
docker-compose up -d mysql elasticsearch redis mailhog adminer
```

### 3. Run the Application
```bash
# Development profile (H2 database)
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Or with external database
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

## 📋 Access Points

### Application
- **API Base URL**: `http://localhost:8080/api`
- **Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **API Docs**: `http://localhost:8080/v3/api-docs`
- **Health Check**: `http://localhost:8080/actuator/health`

### Development Tools
- **H2 Console**: `http://localhost:8080/h2-console` (dev profile)
  - URL: `jdbc:h2:mem:testdb`
  - Username: `sa`
  - Password: (empty)

### Docker Services
- **MySQL**: `localhost:3306`
- **Elasticsearch**: `http://localhost:9200`
- **Redis**: `localhost:6379`
- **MailHog**: `http://localhost:8025`
- **Adminer**: `http://localhost:8080`

## 🔑 Default Credentials

The application includes sample data with default users:

### Admin User
- **Username**: `admin`
- **Password**: `admin`
- **Email**: `admin@surplus360.com`

### Regular User
- **Username**: `user`
- **Password**: `user`
- **Email**: `user@surplus360.com`

### Company User
- **Username**: `company`
- **Password**: `company`
- **Email**: `company@surplus360.com`

## 🧪 Testing the API

### 1. Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin"}'
```

### 2. Create Product
```bash
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Test Product",
    "description": "A test product",
    "category": "ELECTRONICS",
    "condition": "NEW",
    "quantity": 1,
    "unit": "piece",
    "estimatedValue": 100.0,
    "location": "Test Location"
  }'
```

### 3. Search Products
```bash
curl -X GET "http://localhost:8080/api/products/search?query=test&category=ELECTRONICS"
```

### 4. Upload File
```bash
curl -X POST http://localhost:8080/api/files/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/your/file.jpg" \
  -F "directory=products"
```

## 📊 Sample Data

The application includes comprehensive sample data:
- **3 Users** with different roles
- **2 Companies** with RSE metrics
- **15 Products** across various categories
- **5 Transactions** with different statuses
- **10 Notifications** for testing

## 🔧 Development Configuration

### Application Properties
- **Dev Profile**: Uses H2 in-memory database
- **Prod Profile**: Uses MySQL with Docker
- **JWT Secret**: Configured in application.yml
- **Email**: Uses MailHog for testing

### Database Migration
```bash
# Clear H2 database (dev)
# Just restart the application

# Reset MySQL database (prod)
docker-compose down -v
docker-compose up -d mysql
```

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Change server port in application.yml
   server:
     port: 8081
   ```

2. **Database Connection Issues**
   ```bash
   # Check Docker services
   docker-compose ps
   
   # Restart services
   docker-compose restart mysql
   ```

3. **Elasticsearch Not Starting**
   ```bash
   # Increase Docker memory
   # Or disable Elasticsearch in application.yml
   elasticsearch:
     enabled: false
   ```

### Logs
```bash
# View application logs
tail -f logs/application.log

# View specific service logs
docker-compose logs -f mysql
docker-compose logs -f elasticsearch
```

## 🔄 API Testing with Swagger

1. Go to `http://localhost:8080/swagger-ui.html`
2. Click "Authorize" and enter: `Bearer YOUR_TOKEN`
3. Test any endpoint directly from the UI

## 📱 Frontend Integration

### CORS Configuration
- All origins allowed in development
- Configure specific origins for production

### WebSocket Connection
```javascript
const socket = new SockJS('http://localhost:8080/ws');
const stompClient = Stomp.over(socket);
stompClient.connect({
  'Authorization': 'Bearer YOUR_TOKEN'
}, onConnected, onError);
```

## 🚀 Production Deployment

### Environment Variables
```bash
export SPRING_PROFILES_ACTIVE=prod
export DATABASE_URL=jdbc:mysql://localhost:3306/surplus360
export DATABASE_USERNAME=surplus360
export DATABASE_PASSWORD=your_password
export JWT_SECRET=your_jwt_secret
export EMAIL_HOST=smtp.gmail.com
export EMAIL_USERNAME=your_email
export EMAIL_PASSWORD=your_password
```

### Build for Production
```bash
# Build JAR file
mvn clean package -DskipTests

# Run production build
java -jar target/surplus360-backend-1.0.0.jar --spring.profiles.active=prod
```

## 📈 Monitoring

### Health Checks
- **Application**: `/actuator/health`
- **Database**: `/actuator/health/db`
- **Elasticsearch**: `/actuator/health/elasticsearch`

### Metrics
- **JVM**: `/actuator/metrics/jvm.memory.used`
- **HTTP**: `/actuator/metrics/http.server.requests`
- **Database**: `/actuator/metrics/hikaricp.connections`

## ✅ Verification Checklist

- [ ] Application starts without errors
- [ ] Database connection established
- [ ] Swagger UI accessible
- [ ] Authentication working
- [ ] Product CRUD operations
- [ ] File upload functionality
- [ ] WebSocket connection
- [ ] Email service (check MailHog)
- [ ] Search functionality
- [ ] Notification system

## 🆘 Support

For issues or questions:
1. Check the logs for error messages
2. Verify all services are running
3. Confirm JWT token is valid
4. Test with sample data first
5. Check Docker container status

The backend is now fully functional and ready for development! 🎉