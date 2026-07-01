import React, { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'

const SIGNALING_SERVER = window.__SIGNALING_SERVER__ || (location.hostname + ':4000')

export default function App() {
  const videoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const canvasRef = useRef(null)
  const audioRef = useRef(null)
  const pcRef = useRef(null)
  const [socket, setSocket] = useState(null)
  const [messages, setMessages] = useState([])
  const [joinedRoom, setJoinedRoom] = useState(false)
  const [room, setRoom] = useState('demo-room')
  const [peerConnected, setPeerConnected] = useState(false)

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 320, height: 240 }, audio: true })
        if (videoRef.current) videoRef.current.srcObject = stream
        if (audioRef.current) audioRef.current.srcObject = stream
      } catch (e) {
        console.error('media error', e)
      }
    }
    startCamera()

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(t => t.stop())
      }
    }
  }, [])

  // setup MediaPipe Pose
  useEffect(() => {
    if (!window.Pose) return
    const pose = new window.Pose({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5/${file}` })
    pose.setOptions({
      modelComplexity: 0,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    })

    pose.onResults(onPoseResults)

    let intervalId
    function loop() {
      if (videoRef.current && videoRef.current.readyState >= 2) {
        try {
          pose.send({ image: videoRef.current })
        } catch (e) {
          // sometimes pose.send throws when frame not ready
        }
      }
    }
    intervalId = setInterval(loop, 150)

    return () => clearInterval(intervalId)

    function onPoseResults(results) {
      const canvas = canvasRef.current
      if (!canvas || !results) return
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height)

      if (results.poseLandmarks) {
        drawLandmarks(ctx, results.poseLandmarks)
        const advice = analyzePose(results.poseLandmarks)
        ctx.fillStyle = 'rgba(0,0,0,0.6)'
        ctx.fillRect(0, canvas.height - 48, canvas.width, 48)
        ctx.fillStyle = '#fff'
        ctx.font = '14px Arial'
        ctx.fillText('Advice: ' + advice, 8, canvas.height - 20)
      }
    }

    function drawLandmarks(ctx, landmarks) {
      ctx.fillStyle = 'rgba(255,0,0,0.9)'
      for (let i = 0; i < landmarks.length; i++) {
        const x = landmarks[i].x * canvas.width
        const y = landmarks[i].y * canvas.height
        ctx.beginPath()
        ctx.arc(x, y, 3, 0, 2 * Math.PI)
        ctx.fill()
      }
      // draw simple connections (shoulder to hip)
      const drawLine = (a, b) => {
        ctx.strokeStyle = 'rgba(0,255,0,0.8)'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(landmarks[a].x * canvas.width, landmarks[a].y * canvas.height)
        ctx.lineTo(landmarks[b].x * canvas.width, landmarks[b].y * canvas.height)
        ctx.stroke()
      }
      // shoulders and hips
      drawLine(11, 12)
      drawLine(11, 23)
      drawLine(12, 24)
    }

    function analyzePose(landmarks) {
      // simple torso tilt check using shoulders and hips
      const leftShoulder = landmarks[11]
      const rightShoulder = landmarks[12]
      const leftHip = landmarks[23]
      const rightHip = landmarks[24]

      const shoulderMid = { x: (leftShoulder.x + rightShoulder.x) / 2, y: (leftShoulder.y + rightShoulder.y) / 2 }
      const hipMid = { x: (leftHip.x + rightHip.x) / 2, y: (leftHip.y + rightHip.y) / 2 }

      const dx = shoulderMid.x - hipMid.x
      const dy = shoulderMid.y - hipMid.y
      const angle = Math.atan2(dy, dx) * (180 / Math.PI)
      const tilt = Math.abs(angle)

      if (tilt > 10) return 'Torso tilted. Stand upright.'
      return 'Good posture.'
    }
  }, [videoRef.current])

  useEffect(() => {
    // setup audio analyser
    if (!audioRef.current) return
    const audioEl = audioRef.current
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    let src
    try {
      src = audioCtx.createMediaStreamSource(audioEl.srcObject || new MediaStream())
    } catch (e) {
      return
    }
    const analyser = audioCtx.createAnalyser()
    analyser.fftSize = 1024
    src.connect(analyser)
    const data = new Uint8Array(analyser.frequencyBinCount)

    let rafId
    function tick() {
      analyser.getByteFrequencyData(data)
      const sum = data.reduce((s, v) => s + v, 0)
      const avg = sum / data.length
      const meter = document.getElementById('volume-meter')
      if (meter) meter.style.width = Math.min(100, Math.round(avg / 2)) + '%'
      rafId = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(rafId)
  }, [audioRef.current])

  function startSocket() {
    if (socket) return
    const addr = (location.hostname.includes('localhost') ? 'http://' : 'https://') + SIGNALING_SERVER
    const s = io(addr)
    s.on('connect', () => console.log('connected to signaling'))
    s.on('message', (m) => handleSignalMessage(m))
    s.on('signal', (payload) => handleSignal(payload))
    setSocket(s)
  }

  function handleSignalMessage(m) {
    // message events are used for chat and legacy signalling
    if (!m || !m.text) return
    try {
      const obj = JSON.parse(m.text)
      if (obj && obj.signal) handleSignal({ from: m.from || 'unknown', data: obj.signal })
      else setMessages(prev => [...prev, m])
    } catch (e) {
      setMessages(prev => [...prev, m])
    }
  }

  function handleSignal({ from, data }) {
    if (!data) return
    const pc = ensurePeerConnection()

    if (data.type === 'offer') {
      pc.setRemoteDescription(new RTCSessionDescription(data))
        .then(() => pc.createAnswer())
        .then(answer => pc.setLocalDescription(answer))
        .then(() => {
          socket.emit('signal', { room, data: pc.localDescription })
        })
    }

    if (data.type === 'answer') {
      pc.setRemoteDescription(new RTCSessionDescription(data))
    }

    if (data.candidate) {
      pc.addIceCandidate(new RTCIceCandidate(data.candidate)).catch(e => console.warn('addIce', e))
    }
  }

  function joinRoom() {
    if (!socket) startSocket()
    socket.emit('join', { room })
    setJoinedRoom(true)
  }

  function sendChatMessage() {
    const text = document.getElementById('chat-input').value
    if (!socket) return
    socket.emit('message', { room, text })
    setMessages(prev => [...prev, { from: 'me', text }])
    document.getElementById('chat-input').value = ''
  }

  function ensurePeerConnection() {
    if (pcRef.current) return pcRef.current
    const pc = new RTCPeerConnection()
    pcRef.current = pc

    // add local tracks
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks()
      tracks.forEach(t => pc.addTrack(t, videoRef.current.srcObject))
    }

    pc.ontrack = (ev) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = ev.streams[0]
        setPeerConnected(true)
      }
    }

    pc.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit('signal', { room, data: { candidate: event.candidate } })
      }
    }

    return pc
  }

  async function startP2P() {
    if (!socket) startSocket()
    const pc = ensurePeerConnection()
    const offer = await pc.createOffer()
    await pc.setLocalDescription(offer)
    socket.emit('signal', { room, data: pc.localDescription })
  }

  function hangup() {
    if (pcRef.current) {
      pcRef.current.close()
      pcRef.current = null
      setPeerConnected(false)
    }
  }

  return (
    <div className="app">
      <h2>Mobile Demo — Pose & Vocal & Multiplayer</h2>
      <div className="video-wrap">
        <video ref={videoRef} autoPlay playsInline muted width="320" height="240" />
        <canvas ref={canvasRef} className="overlay" width="320" height="240" />
      </div>

      <div className="controls">
        <div>
          <label>Room: <input value={room} onChange={e => setRoom(e.target.value)} /></label>
          <button onClick={joinRoom} disabled={joinedRoom}>Join Room</button>
        </div>
        <div style={{ marginTop: 8 }}>
          <button onClick={startP2P} disabled={!joinedRoom || peerConnected}>Start P2P</button>
          <button onClick={hangup} disabled={!peerConnected}>Hangup</button>
        </div>
        <div className="chat">
          <div className="messages">
            {messages.map((m, i) => <div key={i} className="msg"><strong>{m.from || 'user'}:</strong> {m.text}</div>)}
          </div>
          <input id="chat-input" placeholder="Type message" />
          <button onClick={sendChatMessage}>Send</button>
        </div>
      </div>

      <div className="vocal">
        <p>Microphone volume</p>
        <div className="meter-bg"><div id="volume-meter" className="meter"></div></div>
        <audio ref={audioRef} style={{ display: 'none' }} />
      </div>

      <div style={{ marginTop: 12 }}>
        <p>Remote stream:</p>
        <video ref={remoteVideoRef} autoPlay playsInline width="240" height="180" />
      </div>

      <div className="notes">
        <p>Notes: This demo captures camera & mic on mobile. Pose detection uses MediaPipe via CDN. If permissions fail, ensure HTTPS (use ngrok) and allow camera/microphone.</p>
      </div>
    </div>
  )
}
