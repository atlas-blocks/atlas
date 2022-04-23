.PHONY: *

dev:
	docker-compose build
	docker-compose up

prod:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml build
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up

kill:
	docker kill reverse_proxy julia-backend frontend
