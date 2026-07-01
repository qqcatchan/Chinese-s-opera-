#!/bin/bash
set -e

# Simple setup script for demo (Linux/macOS)
cd frontend/mobile-demo
npm install
cd ../../backend/signaling
npm install

echo "Setup complete. Start services via 'docker-compose up' or run frontend/backend manually."
