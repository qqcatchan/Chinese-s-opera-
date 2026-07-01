# Mobile Demo

This demo shows a minimal mobile-friendly app that:
- Accesses camera and microphone
- Displays a simple audio volume meter
- Connects to a signaling server (Socket.io) for simple chat and room join

How to run:

1. cd frontend/mobile-demo
2. npm install
3. npm run start

Access from your phone on the same Wi-Fi using your computer IP e.g. http://192.168.1.10:5173
Or use ngrok to expose a secure URL: ngrok http 5173

Notes:
- For pose detection, include MediaPipe or TF.js models. index.html includes MediaPipe CDN as an optional quick test.
