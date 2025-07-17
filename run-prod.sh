#!/bin/bash

# Surplus Management - Production Run Script
# This script builds and runs the full-stack application in production mode

echo "🏭 Starting Surplus Management in Production Mode..."
echo "   - Profile: prod"
echo "   - Backend Port: 8080"
echo "   - Frontend: Built and served by Spring Boot"
echo "   - Building optimized full-stack application..."
echo ""

# Set production environment
export SPRING_PROFILES_ACTIVE=prod
export SERVER_PORT=8080

# Clean and build (this will also build the frontend)
echo "🔨 Building full-stack application..."
./mvnw clean package -Pprod -DskipTests

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🚀 Starting application..."
    
    # Run the built JAR
    java -jar -Dspring.profiles.active=prod -Dserver.port=8080 target/surplus-management-1.0.0.jar
else
    echo "❌ Build failed!"
    exit 1
fi

echo ""
echo "✅ Application stopped"