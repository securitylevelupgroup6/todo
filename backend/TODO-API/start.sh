#!/bin/bash
set -e
sudo apt update && sudo apt install -y jq && sudo apt-get install -y unzip

# install aws
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# download flyway
curl -L https://repo1.maven.org/maven2/org/flywaydb/flyway-commandline/9.22.1/flyway-commandline-9.22.1-linux-x64.tar.gz -o flyway.tar.gz
tar -xzf flyway.tar.gz
sudo mv flyway-9.22.1/flyway /usr/local/bin/
rm -rf flyway.tar.gz flyway-9.22.1

export PATH=$PATH:/usr/local/bin

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

# run flyway migrations 
flyway -url="jdbc:postgresql://$DB_HOST:5432/todo-api" -user="$DB_USER" -password="$DB_PASS" -locations=filesystem:~/migrations \ migrate

# start the process as a systemd service

