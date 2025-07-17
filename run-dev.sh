#!/bin/bash

# Surplus Management - Development Run Script
# This script runs the full-stack application in development mode

echo "🚀 Starting Surplus Management in Development Mode..."
echo "   - Profile: dev"
echo "   - Backend Port: 8080"
echo "   - Frontend: Served by Vite (if running separately)"
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
echo "✅ Application stopped"