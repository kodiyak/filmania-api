#!/bin/bash

domain="api.v2.filmania.tv"
app_path="/root/apps/api-filmania-tv/scripts/api/scripts/nginx"

echo ${domain}
echo ${app_path}

# Instala o Nginx
sudo apt-get install -y nginx

# Instala o CertBot
sudo apt-get update -y
sudo apt-get install certbot python3-certbot-nginx -y
sudo apt-get update -y

# Remove arquivos NGINX existentes
sudo rm -f /etc/nginx/sites-available/${domain}.conf /etc/nginx/sites-enabled/${domain}.conf

if [ -d "/etc/letsencrypt/live/${domain}" ]; then
  # Adiciona arquivos NGINX (SSL)
  sudo cp ${app_path}/nginx-ssl.conf /etc/nginx/sites-available/${domain}.conf
  sudo ln -s /etc/nginx/sites-available/${domain}.conf /etc/nginx/sites-enabled/${domain}.conf

  # Recarrega NGINX (SSL)
  sudo service nginx restart
  sudo service nginx reload

  # Verifica NGINX (SSL)
  sudo nginx -t
else
  # Libera a porta HTTP e HTTPS
  sudo ufw allow 80/tcp
  sudo ufw allow 443/tcp

  # Adiciona arquivos NGINX (HTTP)
  sudo cp ${app_path}/nginx.conf /etc/nginx/sites-available/${domain}.conf
  sudo ln -s /etc/nginx/sites-available/${domain}.conf /etc/nginx/sites-enabled/${domain}.conf

  sudo service nginx restart
  sudo service nginx reload

  # Geração do certificado
  sudo certbot certonly --nginx -d ${domain} --non-interactive --agree-tos --email mathews.wto@gmail.com

  # Remove arquivos NGINX (HTTP)
  sudo rm -f /etc/nginx/sites-available/${domain}.conf /etc/nginx/sites-enabled/${domain}.conf

  # Adiciona arquivos NGINX (SSL)
  sudo cp ${app_path}/nginx-ssl.conf /etc/nginx/sites-available/${domain}.conf
  sudo ln -s /etc/nginx/sites-available/${domain}.conf /etc/nginx/sites-enabled/${domain}.conf

  # Recarrega NGINX (SSL)
  sudo service nginx restart
  sudo service nginx reload

  # Verifica NGINX (SSL)
  sudo nginx -t
fi