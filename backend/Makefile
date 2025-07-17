# Surplus Backend Makefile
# Convenient commands for running the Spring Boot backend

.PHONY: help run dev debug prod test clean build install

# Default target
help:
	@echo "Surplus Backend - Available Commands:"
	@echo ""
	@echo "  make dev     - Run in development mode (hot reload)"
	@echo "  make debug   - Run in debug mode (remote debugging on port 5005)"
	@echo "  make prod    - Build and run in production mode"
	@echo "  make test    - Run all tests"
	@echo "  make clean   - Clean build artifacts"
	@echo "  make build   - Build the application"
	@echo "  make install - Install dependencies"
	@echo "  make run     - Same as 'make dev'"
	@echo ""
	@echo "Maven wrapper commands:"
	@echo "  ./mvnw spring-boot:run -Pdev"
	@echo "  ./mvnw spring-boot:run -Pdebug"
	@echo "  ./mvnw clean package -Pprod"
	@echo ""

# Development mode (default)
run: dev

dev:
	@echo "🚀 Starting in development mode..."
	./mvnw spring-boot:run -Pdev

# Debug mode
debug:
	@echo "🐛 Starting in debug mode (port 5005)..."
	./mvnw spring-boot:run -Pdebug -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005"

# Production mode
prod:
	@echo "🏭 Building and running in production mode..."
	./mvnw clean package -Pprod
	java -jar target/surplus-backend-1.0.0.jar

# Run tests
test:
	@echo "🧪 Running tests..."
	./mvnw test

# Clean build artifacts
clean:
	@echo "🧹 Cleaning build artifacts..."
	./mvnw clean

# Build the application
build:
	@echo "🔨 Building application..."
	./mvnw package

# Install dependencies
install:
	@echo "📦 Installing dependencies..."
	./mvnw dependency:resolve

# Quick development setup
setup:
	@echo "⚙️  Setting up development environment..."
	./mvnw dependency:resolve
	@echo "✅ Setup complete! Run 'make dev' to start the application."