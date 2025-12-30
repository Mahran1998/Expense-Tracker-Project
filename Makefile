COMPOSE_PROD = docker compose -f docker-compose.yml
COMPOSE_DEV  = docker compose -f docker-compose.yml -f docker-compose.dev.yml

.PHONY: up up-dev build build-dev down down-dev ps ps-dev logs logs-dev smoke smoke-dev diag diag-dev reset reset-dev ci

up:
	$(COMPOSE_PROD) up -d --build

up-dev:
	$(COMPOSE_DEV) up -d --build

build:
	$(COMPOSE_PROD) build

build-dev:
	$(COMPOSE_DEV) build

down:
	$(COMPOSE_PROD) down

down-dev:
	$(COMPOSE_DEV) down

ps:
	$(COMPOSE_PROD) ps

ps-dev:
	$(COMPOSE_DEV) ps

logs:
	$(COMPOSE_PROD) logs --tail=80

logs-dev:
	$(COMPOSE_DEV) logs --tail=80

smoke:
	./scripts/smoke.sh

# In dev we *expect* RabbitMQ UI to be exposed, so we enable the check.
smoke-dev:
	CHECK_RABBIT_UI=1 ./scripts/smoke.sh

reset:
	$(COMPOSE_PROD) down -v

reset-dev:
	$(COMPOSE_DEV) down -v

diag:
	$(COMPOSE_PROD) ps > compose-ps.txt || true
	$(COMPOSE_PROD) logs --no-color --tail=400 > compose-logs.txt || true

diag-dev:
	$(COMPOSE_DEV) ps > compose-ps.txt || true
	$(COMPOSE_DEV) logs --no-color --tail=400 > compose-logs.txt || true

ci:
	$(MAKE) up
	$(MAKE) smoke
	$(MAKE) reset
