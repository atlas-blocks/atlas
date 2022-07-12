.PHONY: *

dev:
	docker-compose build
	docker-compose up

prod:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml build
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up

kill:
	docker kill reverse_proxy julia_backend frontend

kill-prod:
	docker kill reverse_proxy_prod julia_backend_prod frontend_prod
