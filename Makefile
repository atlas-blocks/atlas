.PHONY: *

frontend: 
	cd frontend; \
	ls; \
	npm run build; \
	npm run start -p 8080 