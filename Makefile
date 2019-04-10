lifecycle: clean
	node tests/helper/dummy-sso-server.js 1>tmp/sso.log 2>&1 &
	node server.js 1>tmp/server.log 2>&1 &

	while ! nc -z localhost 8080; do sleep 1; done

	node_modules/.bin/nightwatch

clean:
	-kill -9 $$(lsof -i :4444 | awk 'FNR==2 {print $$2}')
	-kill -9 $$(lsof -i :8080 | awk 'FNR==2 {print $$2}')
