# Deployment Guide

This guide explains how to deploy the demo services (frontend, signaling, coturn) to a VPS using Docker Compose and Caddy for HTTPS.

Prerequisites
- A VPS (Ubuntu 22.04+ or similar) with Docker and docker-compose installed
- A domain name pointed to the VPS public IP (A record)
- Ports open: 80, 443, 3478 (UDP/TCP), and a UDP range 49152-65535 for coturn

Recommended files in repo:
- docker-compose.yml (root) — runs frontend + signaling
- infra/docker-compose.coturn.yml — runs coturn TURN server
- infra/caddy/Caddyfile — Caddy reverse proxy + TLS
- .env — contains DOMAIN and TURN_SECRET

Quick deploy (one server)

1. Clone repo on the VPS

  git clone https://github.com/qqcatchan/Chinese-s-opera-.git
  cd Chinese-s-opera-

2. Create .env with values

  DOMAIN=yourdomain.example
  TURN_SECRET=$(openssl rand -hex 32)
  COTURN_EXTERNAL_IP=your_public_ip

3. Start services (example using docker-compose override)

  # start frontend + signaling
  docker-compose up -d --build

  # start coturn (aux compose)
  docker-compose -f infra/docker-compose.coturn.yml up -d --build

4. Configure Caddy for HTTPS

  - Place the Caddyfile at infra/caddy/Caddyfile and replace {$DOMAIN} with your domain
  - Run Caddy (recommended: docker-compose service or systemd)

Example: run Caddy in Docker

  docker run -d \
    --name caddy \
    -p 80:80 -p 443:443 \
    -v /var/www:/usr/share/caddy \
    -v /etc/caddy/Caddyfile:/etc/caddy/Caddyfile \
    -v caddy_data:/data \
    -v caddy_config:/config \
    caddy:2

Notes & Troubleshooting
- TURN server requires open UDP ports for media relay; ensure your VPS firewall allows the range 49152-65535 UDP
- If using cloud provider, add firewall rules for ports 80/443/3478 and UDP range
- For production TURN, secure your static-auth-secret and consider long-term credentials per-user

Optional: Use managed TURN (Twilio, Xirsys) to avoid running your own coturn

