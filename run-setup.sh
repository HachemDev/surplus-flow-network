#!/bin/bash

echo "=== Spring Boot Backend Setup ==="
echo "Setting up the Surplus Management Backend..."

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo "❌ Java is not installed. Please install Java 17 or later."
    exit 1
fi

# Check if Maven is installed
if ! command -v mvn &> /dev/null; then
    echo "❌ Maven is not installed. Please install Maven 3.6 or later."
    exit 1
fi

# Check if MySQL is running
if ! command -v mysql &> /dev/null; then
    echo "⚠️  MySQL is not installed. Please install MySQL 8.0 or later."
    echo "   You can install it using:"
    echo "   - Ubuntu/Debian: sudo apt install mysql-server"
    echo "   - macOS: brew install mysql"
    echo "   - Windows: Download from https://dev.mysql.com/downloads/mysql/"
    exit 1
fi

echo "✅ Prerequisites check passed"

# Create database and user
echo "📊 Setting up MySQL database..."
mysql -u root -p << EOF
CREATE DATABASE IF NOT EXISTS surplus_db;
CREATE USER IF NOT EXISTS 'surplus_user'@'localhost' IDENTIFIED BY 'surplus_password';
GRANT ALL PRIVILEGES ON surplus_db.* TO 'surplus_user'@'localhost';
FLUSH PRIVILEGES;
EOF

if [ $? -eq 0 ]; then
    echo "✅ Database setup completed"
else
    echo "❌ Database setup failed. Please check your MySQL installation and root password."
    exit 1
fi

# Build the application
echo "🔨 Building the application..."
mvn clean compile

if [ $? -eq 0 ]; then
    echo "✅ Application built successfully"
else
    echo "❌ Build failed. Please check the error messages above."
    exit 1
fi

# Run the application
echo "🚀 Starting the Spring Boot application..."
echo "The application will be available at: http://localhost:8080"
echo "Swagger UI will be available at: http://localhost:8080/swagger-ui.html"
echo "Press Ctrl+C to stop the application"

mvn spring-boot:run