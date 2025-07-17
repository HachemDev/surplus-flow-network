#!/bin/bash

echo "🚀 Starting Surplus Management Application"
echo "=========================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Port $1 is already in use. Please stop the service using this port."
        return 1
    fi
    return 0
}

# Check required ports
echo "🔍 Checking required ports..."
check_port 3306 || exit 1
check_port 8080 || exit 1
check_port 3000 || exit 1

echo "✅ All required ports are available"

# Start with Docker Compose
echo "🐳 Starting application with Docker Compose..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check if MySQL is ready
echo "🔍 Checking MySQL connection..."
until docker-compose exec mysql mysqladmin ping -h"localhost" --silent; do
    echo "⏳ Waiting for MySQL to be ready..."
    sleep 2
done
echo "✅ MySQL is ready"

# Check if backend is ready
echo "🔍 Checking backend health..."
until curl -f http://localhost:8080/actuator/health > /dev/null 2>&1; do
    echo "⏳ Waiting for backend to be ready..."
    sleep 5
done
echo "✅ Backend is ready"

# Display status
echo ""
echo "🎉 Application started successfully!"
echo "====================================="
echo ""
echo "📊 Services Status:"
echo "  • MySQL Database: http://localhost:3306"
echo "  • Backend API: http://localhost:8080"
echo "  • Frontend: http://localhost:3000"
echo "  • Swagger UI: http://localhost:8080/swagger-ui.html"
echo "  • Health Check: http://localhost:8080/actuator/health"
echo ""
echo "👤 Test Users:"
echo "  • Admin: admin / admin123"
echo "  • Company: company_user / admin123"
echo "  • Individual: individual_user / admin123"
echo ""
echo "📚 Documentation:"
echo "  • API Testing Guide: ./backend/TESTING.md"
echo "  • Setup Guide: ./backend/setup-backend.md"
echo "  • Main README: ./README.md"
echo ""
echo "🛑 To stop the application, run: docker-compose down"
echo ""

# Optional: Open browser
if command -v open &> /dev/null; then
    echo "🌐 Opening browser..."
    open http://localhost:3000
    open http://localhost:8080/swagger-ui.html
elif command -v xdg-open &> /dev/null; then
    echo "🌐 Opening browser..."
    xdg-open http://localhost:3000
    xdg-open http://localhost:8080/swagger-ui.html
fi

echo "✨ Ready to use!"