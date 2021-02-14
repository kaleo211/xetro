#!/bin/bash
# This script should ONLY be invoked by MAKE

set -e

function main {
  database=${1}

  config_file="./config/${NODE_ENV}.json"

  if [ "${database}" = 'mysql' ] ; then
    config=${mysql_config}
  elif [ "${database}" = 'postgres' ] ; then
    config=${postgres_config}
    echo ${config}
  else
    exit 1
  fi;

  replace ".dev=${config}" './config/config.json'
  replace ".database=${config}" ${config_file}

  # Start database container
  eval $database

  # Create new database
  ./node_modules/.bin/sequelize db:drop || true
  ./node_modules/.bin/sequelize db:create

  # Initialize sequelize models
  replace ".database.forceSync=true" ${config_file}
	node -r esm ./models/index.js

  # Seed the database
  replace ".database.forceSync=false" ${config_file}
  ./node_modules/.bin/sequelize db:seed:all --seeders-path utils/seeders
}

function replace {
  local query=${1}
  local file=${2}
  cat <<< "$(jq "${query}" ${file} | jq '.')" > ${file}
}

postgres_config='{
  "username": "postgres",
  "password": "postgres",
  "database": "xetro",
  "host": "127.0.0.1",
  "port": 5432,
  "dialect": "postgres"
}'

mysql_config='{
  "username": "root",
  "password": "mysql",
  "database": "xetro",
  "host": "127.0.0.1",
  "port": 3306,
  "dialect": "mysql"
}'

function mysql {
  if lsof -n -i4TCP:3306 | grep LISTEN ; then
    echo "mysql is running";
  else
    if docker ps -a --filter name=mysql | grep mysql ; then
      echo "restarting mysql";
      docker "restart mysq"l;
    else
      echo "starting mysql";
      docker run --name mysql --rm -d -p 3306:3306 -e MYSQL_ROOT_PASSWORD=mysql mysql:5;
    fi;
    while ! nc -z localhost 3306; do sleep 1; done;
  fi;
}

function postgres {
	if lsof -n -i4TCP:5432 | grep LISTEN ; then
		echo "postgres is running";
	else
		if docker ps -a --filter name=postgres | grep postgres ; then
			echo "restarting postgres";
			docker restart postgres;
		else
			echo "starting postgres";
			docker run --name postgres --rm -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres postgres:10;
		fi;
		while ! nc -z localhost 5432; do sleep 1; done;
	fi;
}

main "$@"
exit
