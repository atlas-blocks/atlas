.PHONY: *

build:
	docker-compose build
run:
	docker-compose up

dev: build run

build-prod:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

run-prod:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up

prod: build-prod run-prod

kill:
	docker kill reverse_proxy jupyter_backend frontend

kill-prod:
	docker kill reverse_proxy_prod jupyter_backend_prod frontend_prod

