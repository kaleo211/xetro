#!/usr/bin/env bash
set -e

login_to_cf() {
  cf api api.${CF_ENDPOINT} --skip-ssl-validation
  cf auth ${CF_USERNAME} "${CF_PASSWORD}"
  cf target -o ${CF_ORG} -s ${CF_SPACE}
}

fetch_db_creds() {
  org_guid=$(cf curl /v2/organizations | jq -r ".resources[] | select(.entity.name == \"${CF_ORG}\") | .metadata.guid")
  space_guid=$(cf curl /v2/organizations/${org_guid}/spaces | jq -r ".resources[] | select(.entity.name == \"${CF_SPACE}\") | .metadata.guid")

  app_guid=$(cf curl "/v2/apps?q=space_guid:${space_guid}" | jq -r ".resources[] | select(.entity.name == \"${APP_NAME}\") | .metadata.guid")

  vcap=`cf curl /v2/apps/$app_guid/env | jq -r '.system_env_json.VCAP_SERVICES'`
  creds=`echo ${vcap} | jq -r '."p.mysql"[].credentials'`

  export db_username=`echo ${creds} | jq -r '.username'`
  export db_password=`echo ${creds} | jq -r '.password'`
  export db_database=`echo ${creds} | jq -r '.name'`
  export db_hostname=`echo ${creds} | jq -r '.hostname'`
  export db_port=`echo ${creds} | jq -r '.port'`
}
