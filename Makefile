.PHONY: help up down logs build restart clean setup install-deps frontend-install backend-install db-init db-reset shell test lint format

# Variables
COMPOSE = docker-compose
CONTAINER = whatsapp-dev-container

help: ## Show this help message
	@echo "WhatsApp Clone - Make Commands"
	@echo "==============================="
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

up: ## Start all services
	$(COMPOSE) up -d
	@echo "✅ Services started successfully"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend: http://localhost:5000"
	@echo "pgAdmin: http://localhost:5050"

down: ## Stop all services
	$(COMPOSE) down
	@echo "✅ Services stopped"

restart: ## Restart all services
	$(COMPOSE) restart
	@echo "✅ Services restarted"

logs: ## Show logs from all services
	$(COMPOSE) logs -f

logs-dev: ## Show logs from dev container
	$(COMPOSE) logs -f dev

logs-db: ## Show logs from database
	$(COMPOSE) logs -f postgres

logs-redis: ## Show logs from Redis
	$(COMPOSE) logs -f redis

build: ## Build all containers
	$(COMPOSE) build
	@echo "✅ Build completed"

build-no-cache: ## Build containers without cache
	$(COMPOSE) build --no-cache
	@echo "✅ Build completed"

clean: ## Clean up containers, volumes, and networks
	$(COMPOSE) down -v
	@echo "✅ Cleanup completed"

setup: build up db-init ## Complete setup
	@echo "✅ Setup completed! Services are running"

install-deps: backend-install frontend-install ## Install all dependencies

backend-install: ## Install backend dependencies
	cd backend && npm install

frontend-install: ## Install frontend dependencies
	cd frontend && npm install

db-init: ## Initialize database
	$(COMPOSE) exec postgres psql -U postgres -c "CREATE DATABASE whatsapp_db;" 2>/dev/null || true
	$(COMPOSE) exec postgres psql -U postgres -d whatsapp_db -f /docker-entrypoint-initdb.d/init.sql
	@echo "✅ Database initialized"

db-reset: ## Reset database
	$(COMPOSE) exec postgres dropdb -U postgres whatsapp_db 2>/dev/null || true
	$(COMPOSE) exec postgres createdb -U postgres whatsapp_db
	$(COMPOSE) exec postgres psql -U postgres -d whatsapp_db -f /docker-entrypoint-initdb.d/init.sql
	@echo "✅ Database reset completed"

shell: ## Open shell in dev container
	$(COMPOSE) exec dev /bin/bash

psql: ## Open PostgreSQL shell
	$(COMPOSE) exec postgres psql -U postgres -d whatsapp_db

redis-cli: ## Open Redis CLI
	$(COMPOSE) exec redis redis-cli

dev-backend: ## Start backend in dev mode
	cd backend && npm run dev

dev-frontend: ## Start frontend in dev mode
	cd frontend && npm run dev

test: ## Run tests
	cd backend && npm test
	cd frontend && npm test

lint: ## Run linters
	cd backend && npm run lint
	cd frontend && npm run lint

format: ## Format code
	cd backend && npm run format
	cd frontend && npm run format

status: ## Show services status
	$(COMPOSE) ps

ps: ## Show running processes (alias for status)
	$(COMPOSE) ps

prune: ## Remove unused Docker objects
	docker system prune -f
	@echo "✅ Docker system pruned"

version: ## Show version information
	@echo "Docker version:"
	@docker --version
	@echo "\nDocker Compose version:"
	@docker-compose --version

.DEFAULT_GOAL := help
