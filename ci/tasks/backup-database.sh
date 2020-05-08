#!/usr/bin/env bash
set -e

source ./xetro/ci/tasks/utils.sh

login_to_cf
fetch_db_creds

cf ssh -N -T -L 63306:${db_hostname}:${db_port} ${APP_NAME} &
sleep 10
tunnelPID=$!

timestamp=`date '+%Y-%m-%d-%H-%M'`
mysqldump --no-create-db --no-create-info -P 63306 -u ${db_username} -p${db_password} -h 127.0.0.1 ${db_database} > xetro-dev-data_${timestamp}.sql
mysqldump -P 63306 -u ${db_username} -p${db_password} -h 127.0.0.1 ${db_database} > xetro-dev-database_${timestamp}.sql

kill -9 $tunnelPID

echo "${DATABASE_BACKUP_HOST_SSH_KEY}" >> key
chmod 600 key

ssh -i key -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no ${DATABASE_BACKUP_HOST_USER}@${DATABASE_BACKUP_HOST_IP} "find ~/Documents/database-backup/xetro/dev-*.sql -mtime +${DATABASE_BACKUP_MAX_DAYS} -exec rm {} \; || true"
scp -i key -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no xetro-dev-*.sql ${DATABASE_BACKUP_HOST_USER}@${DATABASE_BACKUP_HOST_IP}:~/Documents/database-backup/xetro
