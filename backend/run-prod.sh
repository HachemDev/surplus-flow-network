#!/bin/bash

# Surplus Backend - Production Run Script
# This script builds and runs the backend in production mode

echo "🏭 Starting Surplus Backend in Production Mode..."
echo "   - Profile: prod"
echo "   - Port: 8080"
echo "   - Building optimized JAR..."
echo ""

# Set production environment
export SPRING_PROFILES_ACTIVE=prod
export SERVER_PORT=8080

# Clean and build
echo "🔨 Building application..."
./mvnw clean package -Pprod -DskipTests

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🚀 Starting application..."
    
    # Run the built JAR
    java -jar -Dspring.profiles.active=prod -Dserver.port=8080 target/surplus-backend-1.0.0.jar
else
    echo "❌ Build failed!"
    exit 1
fi

echo ""
echo "✅ Backend stopped"