#!/bin/bash
set -e
sudo apt update && sudo apt install -y jq && sudo apt-get install -y unzip && sudo apt install -y openjdk-17-jre-headless


# install aws
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip -o awscliv2.zip
sudo ./aws/install --update

# download flyway
echo "Downloading and installing flyway"
wget -q https://repo1.maven.org/maven2/org/flywaydb/flyway-commandline/10.11.0/flyway-commandline-10.11.0-linux-x64.tar.gz
tar -xzf flyway-commandline-10.11.0-linux-x64.tar.gz
sudo mv flyway-10.11.0 /opt/flyway
sudo ln -s /opt/flyway/flyway /usr/local/bin/flyway

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

