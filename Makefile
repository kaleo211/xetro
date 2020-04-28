prepare_dev:
	export NODE_ENV=development

	@if lsof -n -i4TCP:5432 | grep LISTEN ; then \
		echo postgres is running; \
	else \
		if docker ps -a --filter name=postgres | grep postgres ; then \
			echo restarting postgres; \
			docker restart postgres; \
		else \
			echo starting postgres; \
			docker run --name postgres --rm -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres postgres:10; \
		fi; \
	fi;

	sleep 3

	-./node_modules/.bin/sequelize db:drop
	./node_modules/.bin/sequelize db:create

	perl -pi -e 's/false/true/g' config/development.json
	node -r esm ./models/index.js
	perl -pi -e 's/true/false/g' config/development.json
	./node_modules/.bin/sequelize db:seed:all --seeders-path utils/seeders

	-kill -9 $$(lsof -i :8888 | awk 'FNR==2 {print $$2}')
	node ./utils/dummy-sso-server.js &
	./node_modules/.bin/webpack --watch

start_dev:
	npm run build && npm run start

clean:
	-kill -9 $$(lsof -i :8888 | awk 'FNR==2 {print $$2}')
	-kill -9 $$(lsof -i :8080 | awk 'FNR==2 {print $$2}')
