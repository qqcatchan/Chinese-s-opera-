#!/bin/bash
# scripts/deploy_to_vps.sh
# Usage: ./deploy_to_vps.sh user@host:/path domain
# Copies current repo to remote and runs docker-compose

if [ "$#" -lt 2 ]; then
  echo "Usage: $0 user@host:/path domain"
  exit 1
fi
TARGET="$1"
DOMAIN="$2"

# create .env locally
TURN_SECRET=$(openssl rand -hex 32)
cat > .env <<EOF
DOMAIN=$DOMAIN
TURN_SECRET=$TURN_SECRET
COTURN_EXTERNAL_IP=$(curl -s ifconfig.me)
EOF

# Archive repo
tar czf deploy_package.tgz .

# Copy to remote
scp deploy_package.tgz "$TARGET"
ssh ${TARGET%%:*} "mkdir -p ${TARGET#*:} && tar xzf ${TARGET#*:}/deploy_package.tgz -C ${TARGET#*:} && cd ${TARGET#*:} && docker-compose up -d --build && docker-compose -f infra/docker-compose.coturn.yml up -d"

echo "Deployment initiated. Check remote logs for status."
