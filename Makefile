COMPOSE = docker compose -f docker-compose.yml -f docker-compose.dev.yml

.PHONY: up down ps logs build smoke reset

up:
	$(COMPOSE) up -d --build

build:
	$(COMPOSE) build

down:
	$(COMPOSE) down

ps:
	$(COMPOSE) ps

logs:
	$(COMPOSE) logs --tail=80

smoke:
	./scripts/smoke.sh

reset:
	$(COMPOSE) down -v

.PHONY: ci
ci:
	$(MAKE) up
	$(MAKE) smoke
	$(MAKE) reset
