#!/usr/bin/env bash
set -e -x

source xetro/ci/tasks/utils.sh

build_config() {
  cat > config/production.json <<EOF
{
  "sso": {
    "microsoft": {
      "api": "https://graph.microsoft.com/v1.0/",
      "host": "graph.microsoft.com",
      "address": "https://login.microsoftonline.com",
      "client_id": "${SSO_MICROSOFT_CLIENT_ID}",
      "client_secret": "${SSO_MICROSOFT_CLIENT_SECRET}",
      "tenant_id": "${SSO_MICROSOFT_TENANT_ID}",
      "redirect_uri": "${SSO_MICROSOFT_REDIRECT_URI}",
      "scopes": ["user.read"]
    },
    "dell": {
      "client_id": "${SSO_DELL_CLIENT_ID}",
      "client_secret": "${SSO_DELL_CLIENT_SECRET}",
      "auth_domain": "${SSO_DELL_AUTH_DOMAIN}",
      "userinfo": "${SSO_DELL_USERINFO_URL}"
    }
  },
  "database": {
    "forceSync": false
  },
  "server": {
    "address": "https://${APP_NAME}.${CF_DOMAIN}",
    "session_secret": "D25F7461-7A32-4C76-BDB1-840B50642EDA"
  }
}
EOF
}

push_green_app() {
  if ! cf app ${APP_NAME}; then
    cf push ${APP_NAME} --no-start -n ${APP_NAME}
  fi

  cf push ${green_app} --no-start -n ${green_app}
  cf bind-service ${green_app} ${CF_DB_SERVICE_NAME}
  cf start ${green_app}
}

replace_blue_with_green() {
  cf map-route ${green_app} ${CF_DOMAIN} -n ${APP_NAME}
  cf unmap-route ${APP_NAME} ${CF_DOMAIN} -n ${APP_NAME}
  cf unmap-route ${green_app} ${CF_DOMAIN} -n ${green_app}
  cf unbind-service ${APP_NAME} ${CF_DB_SERVICE_NAME}

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
