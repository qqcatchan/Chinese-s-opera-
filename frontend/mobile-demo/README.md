# Mobile Demo

This demo shows a minimal mobile-friendly app that:
- Accesses camera and microphone
- Performs real-time pose detection using MediaPipe
- Displays a simple audio volume meter
- Connects to a signaling server (Socket.io) for simple chat and room join
- Demonstrates WebRTC P2P (video + audio) using the signaling server

How to run:

1. Start signaling server

```bash
cd backend/signaling
npm install
npm start
```

2. Start frontend demo

```bash
cd frontend/mobile-demo
npm install
npm run start
```

3. Access from your phone on the same Wi-Fi using your computer IP e.g. http://192.168.1.10:5173
Or use ngrok to expose a secure URL: ngrok http 5173

Quick test checklist:
- Open demo URL on mobile
- Allow camera & microphone permissions
- Click "Join Room" then "Start P2P" (open same URL on a second device to connect)
- Speak and move to see volume meter and pose overlay

Notes:
- For lowest latency, use both devices on the same local network
- If using HTTPS via ngrok, set SIGNALING_SERVER to the ngrok domain if needed (see GETTING_STARTED.md)
