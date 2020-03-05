prepare_dev:
	export NODE_ENV=development
	docker run --name postgres --rm -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres postgres:10 || \
		docker restart postgres
	./node_modules/.bin/sequelize db:drop || true
	./node_modules/.bin/sequelize db:create
	perl -pi -e 's/false/true/g' config/development.json
	node ./models/index.js
	perl -pi -e 's/true/false/g' config/development.json
	./node_modules/.bin/sequelize db:seed:all --seeders-path tests/seeders
	node ./tests/helper/dummy-sso-server.js &
	./node_modules/.bin/webpack --watch

start_dev:
	npm run build && npm run start

clean:
	-kill -9 $$(lsof -i :8888 | awk 'FNR==2 {print $$2}')
	-kill -9 $$(lsof -i :8080 | awk 'FNR==2 {print $$2}')
