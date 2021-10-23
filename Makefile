start_sso: export NODE_ENV=dev
start_sso:
	-kill -9 $$(lsof -i :8888 | awk 'FNR==2 {print $$2}')
	./node_modules/.bin/ts-node ./utils/dummy-sso-server.ts &

init_dev: export NODE_ENV=dev
init_dev:
	./utils/scripts/start-database.sh $(DATABASE)
	$(MAKE) start_sso

start_dev: export NODE_ENV=dev
start_dev:
	npm run build && npm run start

clean:
	-kill -9 $$(lsof -i :8888 | awk 'FNR==2 {print $$2}')
	-kill -9 $$(lsof -i :8080 | awk 'FNR==2 {print $$2}')

test:
	./node_modules/jest/bin/jest.js --silent
