#!/usr/bin/env bash
set -e -x

source xetro/ci/tasks/utils.sh

build_config() {
  cat > config/production.json <<EOF
{
  "sso": {
    "dell": {
      "clientID": "${SSO_DELL_CLIENT_ID}",
      "clientSecret": "${SSO_DELL_CLIENT_SECRET}",
      "authDomain": "${SSO_DELL_AUTH_DOMAIN}",
      "userinfo": "${SSO_DELL_USERINFO_URL}"
    }
  },
  "database": {
    "hostname": "${DB_HOSTNAME}",
    "port": ${DB_PORT},
    "name": "${DB_NAME}",
    "dialect": "${DB_DIALECT}",
    "username": "${DB_USERNAME}",
    "password": "${DB_PASSWORD}",
    "logging": ${DB_LOGGING},
    "forceSync": ${DB_FORCE_SYNC}
  },
  "server": {
    "address": "https://${APP_NAME}.${CF_DOMAIN}",
    "sessionSecret": "D25F7461-7A32-4C76-BDB1-840B50642EDA"
  }
}
EOF
}

push_green_app() {
  if ! cf app ${APP_NAME}; then
    cf push ${APP_NAME} --no-start -n ${APP_NAME}
  fi

  cf push ${green_app} --no-start -n ${green_app}
  # cf bind-service ${green_app} ${CF_DB_SERVICE_NAME}
  cf start ${green_app}
}

replace_blue_with_green() {
  cf map-route ${green_app} ${CF_DOMAIN} -n ${APP_NAME}
  cf unmap-route ${APP_NAME} ${CF_DOMAIN} -n ${APP_NAME}
  cf unmap-route ${green_app} ${CF_DOMAIN} -n ${green_app}
  # cf unbind-service ${APP_NAME} ${CF_DB_SERVICE_NAME}

  cf delete ${APP_NAME} -f
  cf rename ${green_app} ${APP_NAME}
}

main() {
  pushd xetro
    green_app="${APP_NAME}-green"
    login_to_cf
    build_config
    push_green_app
    replace_blue_with_green
  popd
}
main
