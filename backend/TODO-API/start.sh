#!/bin/bash
set -e
sudo apt update && sudo apt install -y jq && sudo apt-get install -y unzip && sudo apt install -y openjdk-17-jre-headless

# install aws-cli
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip -o awscliv2.zip
sudo ./aws/install --update
export PATH=$PATH:/usr/local/bin

# download flyway
echo "Downloading and installing flyway"
wget https://download.red-gate.com/maven/release/com/redgate/flyway/flyway-commandline/10.11.0/flyway-commandline-10.11.0-linux-x64.tar.gz
tar -xzf flyway-commandline-10.11.0-linux-x64.tar.gz > dev/null 2>&1
sudo rm -rf /opt/flyway/flyway-10.11.0
sudo mv flyway-10.11.0 /opt/flyway
export PATH=$PATH:/opt/flyway/flyway-10.11.0
source ~/.bashrc

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

# run flyway migrations 
flyway -url="jdbc:postgresql://$DB_HOST:5432/tododb" -user="$DB_USER" -password="$DB_PASS" -locations=migrations migrate

# clean up crap
rm awscliv2.zip && rm flyway-commandline-10.11.0-linux-x64.tar.gz

# start the process as a systemd service

APP_NAME="TODO-API"
APP_USER="ubuntu"
APP_DIR="~/build"
EXECUTABLE="$APP_DIR/$APP_NAME"
SERVICE_NAME="todo-api"
SERVICE_FILE="/etc/systemd/system/$SERVICE_NAME.service"

# ensure the binary is executable ===
echo "Making $EXECUTABLE executable..."
chmod +x "$EXECUTABLE" || { echo "Failed to chmod +x"; exit 1; }

# create systemd service file ===
echo "Creating systemd service at $SERVICE_FILE..."

sudo bash -c "cat > $SERVICE_FILE" <<EOF
[Unit]
Description=TODO API .NET Service
After=network.target

[Service]
WorkingDirectory=$APP_DIR
ExecStart=$EXECUTABLE
Restart=always
Environment=ASPNETCORE_ENVIRONMENT=Production
Environment=DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=1

StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

# Reload and start the service
echo "Reloading systemd and starting the service..."
sudo systemctl daemon-reexec
sudo systemctl daemon-reload
sudo systemctl enable "$SERVICE_NAME"
sudo systemctl start "$SERVICE_NAME"

# Show status ===
echo "Service status:"
sudo systemctl status "$SERVICE_NAME" --no-pager




