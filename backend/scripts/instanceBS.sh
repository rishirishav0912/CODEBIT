Content-Type: multipart/mixed; boundary="//"
MIME-Version: 1.0

--//
Content-Type: text/cloud-config; charset="us-ascii"
MIME-Version: 1.0
Content-Transfer-Encoding: 7bit
Content-Disposition: attachment; filename="cloud-config.txt"

#cloud-config
cloud_final_modules:
  - [scripts-user, always]

--//
Content-Type: text/x-shellscript; charset="us-ascii"
MIME-Version: 1.0
Content-Transfer-Encoding: 7bit
Content-Disposition: attachment; filename="userdata.txt"

#!/bin/bash
sudo apt update -y
sudo apt install apache2 -y
systemctl start apache2
systemctl enable apache2

LOG_FILE="/var/log/bootstrap.log"

echo "Starting bootstrap script..." > $LOG_FILE

# Step 1: Check if the script has already been executed (flag file check)
if [ ! -f /var/log/grub-updated ]; then
    echo "First boot: Performing GRUB update and reboot..." >> $LOG_FILE
    sudo sed -i 's/GRUB_CMDLINE_LINUX="\(.*\)"/GRUB_CMDLINE_LINUX="\1 systemd.unified_cgroup_hierarchy=0"/' /etc/default/grub
    sudo update-grub
    touch /var/log/grub-updated  # Flag to indicate GRUB update has been performed
    sudo reboot  # Reboot to apply changes
fi
sleep 60
sudo apt update -y && sudo apt upgrade -y
sudo apt update -y
sudo apt install -y wget unzip docker.io docker-compose
wget https://github.com/judge0/judge0/releases/download/v1.13.1/judge0-v1.13.1.zip
unzip judge0-v1.13.1.zip
cd judge0-v1.13.1
REDIS_PASSWORD=$(openssl rand -base64 12)
POSTGRES_PASSWORD=$(openssl rand -base64 12)
sed -i "s/REDIS_PASSWORD=.*/REDIS_PASSWORD=${REDIS_PASSWORD}/" judge0.conf
sed -i "s/POSTGRES_PASSWORD=.*/POSTGRES_PASSWORD=${POSTGRES_PASSWORD}/" judge0.conf
docker-compose up -d db redis
sleep 10
docker-compose up -d
sleep 5