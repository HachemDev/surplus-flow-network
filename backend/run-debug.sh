#!/bin/bash

# Surplus Backend - Debug Run Script
# This script runs the backend with remote debugging enabled

echo "🐛 Starting Surplus Backend in Debug Mode..."
echo "   - Profile: dev"
echo "   - Port: 8080"
echo "   - Debug port: 5005"
echo "   - Hot reload: enabled"
echo "   - API Documentation: http://localhost:8080/swagger-ui.html"
echo ""
echo "📝 To connect your IDE debugger:"
echo "   - Host: localhost"
echo "   - Port: 5005"
echo "   - Transport: Socket"
echo "   - Debugger mode: Attach"
echo ""

# Set development environment
export SPRING_PROFILES_ACTIVE=dev
export SERVER_PORT=8080
export DEBUG_PORT=5005

# Run with Maven wrapper and debug configuration
./mvnw spring-boot:run -Pdebug \
    -Dspring-boot.run.profiles=dev \
    -Dspring-boot.run.jvmArguments="-Dserver.port=8080 -Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005"

echo ""
echo "✅ Backend stopped"