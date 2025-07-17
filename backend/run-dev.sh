#!/bin/bash

# Surplus Backend - Development Run Script
# This script runs the backend in development mode with hot reload

echo "🚀 Starting Surplus Backend in Development Mode..."
echo "   - Profile: dev"
echo "   - Port: 8080"
echo "   - Hot reload: enabled"
echo "   - API Documentation: http://localhost:8080/swagger-ui.html"
echo ""

# Set development environment
export SPRING_PROFILES_ACTIVE=dev
export SERVER_PORT=8080

# Run with Maven wrapper
./mvnw spring-boot:run -Pdev \
    -Dspring-boot.run.profiles=dev \
    -Dspring-boot.run.jvmArguments="-Dserver.port=8080"

echo ""
echo "✅ Backend stopped"