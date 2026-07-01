# Deployment — Full guide (expanded)

This document expands the earlier deployment notes and shows a full flow for deploying the demo stack to a single VPS using Docker Compose and Caddy for TLS.

Prerequisites
- VPS (Ubuntu 22.04+ recommended) with public IP
- Domain name pointing to VPS A record
- Ports to open: 80, 443, 3478 (UDP/TCP), UDP range 49152-65535 for TURN
- Docker and docker-compose installed on VPS

Steps
1. Clone repository on VPS
  git clone https://github.com/qqcatchan/Chinese-s-opera-.git
  cd Chinese-s-opera-

2. Create .env file
  DOMAIN=yourdomain.example
  TURN_SECRET=$(openssl rand -hex 32)
  COTURN_EXTERNAL_IP=$(curl -s ifconfig.me)

3. Start core services
  docker-compose up -d --build

4. Start coturn (TURN server)
  docker-compose -f infra/docker-compose.full.yml up -d coturn

5. Start Caddy (TLS)
  docker-compose -f infra/docker-compose.full.yml up -d caddy

6. Verify
  - Visit https://yourdomain.example -> should reach frontend
  - Signaling health: https://yourdomain.example/health

Troubleshooting
- TURN not relaying: ensure UDP firewall rules for 49152-65535
- Caddy failing to obtain cert: ensure DNS A record points to server and ports 80/443 open

Optional: Use managed TURN provider to avoid firewall/port management
