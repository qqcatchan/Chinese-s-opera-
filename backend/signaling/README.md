# Signaling server

This simple server provides Socket.io signaling endpoints for the mobile demo.

To run locally:

cd backend/signaling
npm install
npm start

To run with Docker:

docker build -t signaling-server .
docker run -p 4000:4000 signaling-server
