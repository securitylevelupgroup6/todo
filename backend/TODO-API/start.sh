#!/bin/bash
set -e
sudo apt update && sudo apt install -y jq
echo "Fetching DB secrets from AWS Secrets Manager..."

SECRET=$(aws secretsmanager get-secret-value \
  --secret-id prod/postgres \
  --query SecretString \
  --output text)

DB_USER=$(echo $SECRET | jq -r .db_username)
DB_PASS=$(echo $SECRET | jq -r .db_password)

DB_HOST=$(aws secretsmanager get-secret-value \
  --secret-id rds-host \
  --query SecretString \
  --output text)


CONNECTION_STRING="Host=$DB_HOST;Port=5432;Database=todo-db;Username=$DB_USER;Password=$DB_PASS"
echo $CONNECTION_STRING

