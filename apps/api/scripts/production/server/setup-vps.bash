#!/bin/bash

# Atualiza o cache do apt
sudo apt-get update -y

# Instala os pacotes necessários para utilizar repositórios HTTPS do apt
sudo apt-get install -y apt-transport-https ca-certificates curl gnupg2 software-properties-common

# Baixa a chave GPG do Docker e a adiciona ao keyring do sistema
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Adiciona o repositório oficial do Docker à lista de fontes do apt
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Atualiza o cache do apt
sudo apt-get update -y

# Instala o Docker
sudo apt-get install -y docker-ce docker-ce-cli containerd.io