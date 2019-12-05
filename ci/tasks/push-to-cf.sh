#!/usr/bin/env bash
set -e -x

push_green_app() {
  cat > config/${NODE_ENV}.json <<EOF
{
  "sso": {
    "address": "https://login.microsoftonline.com",
    "client_id": "${SSO_CLIENT_ID}",
    "client_secret": "${SSO_CLIENT_SECRET}",
    "tenant_id": "${SSO_TENANT_ID}",
    "redirect_uri": "${SSO_REDIRECT_URI}",
    "scopes": [
        "user.read"
    ]
  },
  "microsoft": {
    "api": "https://graph.microsoft.com/v1.0/",
    "host": "graph.microsoft.com"
  },
  "database": {
    "username": "${DB_USERNAME}",
    "password": "${DB_PASSWORD}",
    "host": "${DB_HOST}",
    "database": "${DB_NAME}",
    "dialect": "${DB_DIALECT}"
  },
  "server": {
    "session_secret": "D25F7461-7A32-4C76-BDB1-840B50642EDA"
  }
}
EOF

  yarn install
  yarn run build

  if ! cf app ${APP_NAME}; then
    cf push ${APP_NAME} --no-start -n ${APP_NAME}
  fi

  cf push ${green_app} --no-start -n ${green_app}
  cf set-env ${green_app} NODE_ENV ${NODE_ENV}

  cf start ${green_app}
}

switch_blue_with_green() {
  cf map-route ${green_app} ${CF_DOMAIN} -n ${APP_NAME}
  cf unmap-route ${APP_NAME} ${CF_DOMAIN} -n ${APP_NAME}
  cf unmap-route ${green_app} ${CF_DOMAIN} -n ${green_app}

  cf delete ${APP_NAME} -f
  cf rename ${green_app} ${APP_NAME}
}

main() {
  cf api http://api.${CF_ENDPOINT} --skip-ssl-validation
  cf auth ${CF_USERNAME} "${CF_PASSWORD}"
  cf target -o ${CF_ORG} -s ${CF_SPACE}

  pushd xetro
    green_app="${APP_NAME}-green"

    push_green_app
    switch_blue_with_green
  popd
}
main
