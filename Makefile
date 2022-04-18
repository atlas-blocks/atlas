.PHONY: *

dev:
	docker-compose build
	docker-compose up

prod:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml build
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up

frontend: 
	cd frontend; \
	ls; \
	npm run build; \
	npm run start -p 8080 