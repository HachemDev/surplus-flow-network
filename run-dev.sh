#!/bin/bash

# Surplus360 Development Startup Script
# This script starts all required services for development

echo "🚀 Starting Surplus360 Development Environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Start infrastructure services
echo "📦 Starting infrastructure services..."
docker-compose up -d mysql elasticsearch redis mailhog adminer

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 20

# Check MySQL connection
echo "🔍 Checking MySQL connection..."
until docker exec surplus360-mysql mysqladmin ping -h localhost -u root -proot --silent; do
    echo "   Waiting for MySQL to be ready..."
    sleep 3
done
echo "✅ MySQL is ready!"

# Check Elasticsearch connection
echo "🔍 Checking Elasticsearch connection..."
until curl -s http://localhost:9200 > /dev/null; do
    echo "   Waiting for Elasticsearch to be ready..."
    sleep 3
done
echo "✅ Elasticsearch is ready!"

# Build and run the Spring Boot application
echo "🏗️  Building and starting Spring Boot application..."
mvn clean compile
mvn spring-boot:run -Dspring-boot.run.profiles=dev &

# Store the PID for cleanup
SPRING_PID=$!

echo "🎉 Development environment is ready!"
echo ""
echo "📊 Services Status:"
echo "   • Spring Boot App: http://localhost:8080/api"
echo "   • Swagger UI: http://localhost:8080/api/swagger-ui.html"
echo "   • H2 Console: http://localhost:8080/api/h2-console"
echo "   • MySQL: localhost:3306 (root/root)"
echo "   • Elasticsearch: http://localhost:9200"
echo "   • Redis: localhost:6379"
echo "   • MailHog: http://localhost:8025"
echo "   • Adminer: http://localhost:8080"
echo ""
echo "🔑 Default Credentials:"
echo "   • Admin: admin/admin"
echo "   • User: user/user"
echo "   • Company: company/company"
echo ""
echo "💡 To stop the development environment:"
echo "   • Press Ctrl+C to stop Spring Boot"
echo "   • Run: docker-compose down"
echo ""

# Wait for Spring Boot to start
echo "⏳ Waiting for Spring Boot to start..."
until curl -s http://localhost:8080/api/actuator/health > /dev/null; do
    echo "   Starting Spring Boot application..."
    sleep 5
done

echo "✅ Spring Boot application is running!"
echo ""
echo "🎯 Ready to develop! The application is available at:"
echo "   🌐 API: http://localhost:8080/api"
echo "   📚 Documentation: http://localhost:8080/api/swagger-ui.html"
echo ""

# Keep the script running
wait $SPRING_PID