.PHONY: *


deploy: clean_aws_prod build_aws_prod start_aws_prod_server

clean_aws_prod:
	rm -rf /var/www/atlas/html
	cp -a . /var/www/atlas/html
build_aws_prod:
	cd /var/www/atlas/html
	npm run build
start_aws_prod_server:
	cd /var/www/atlas/html
	npm run start -p 8080 &

