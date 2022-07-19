.PHONY: *

build:
	docker-compose build $(s)
run:
	docker-compose up $(s)

dev: build run

build-prod:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml build $(s)

run-prod:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up $(s)

prod: build-prod run-prod

kill:
	docker kill reverse_proxy jupyter_backend frontend

kill-prod:
	docker kill reverse_proxy_prod jupyter_backend_prod frontend_prod

