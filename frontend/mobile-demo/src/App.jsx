import React, { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'

const SIGNALING_SERVER = window.__SIGNALING_SERVER__ || (location.hostname + ':4000')

export default function App() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const audioRef = useRef(null)
  const [socket, setSocket] = useState(null)
  const [messages, setMessages] = useState([])
  const [joinedRoom, setJoinedRoom] = useState(false)
  const [room, setRoom] = useState('demo-room')

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: true })
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

  useEffect(() => {
    // setup audio analyser
    if (!audioRef.current) return
    const audioEl = audioRef.current
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    const src = audioCtx.createMediaStreamSource(audioEl.srcObject || new MediaStream())
    const analyser = audioCtx.createAnalyser()
    analyser.fftSize = 2048
    src.connect(analyser)
    const data = new Uint8Array(analyser.frequencyBinCount)

    let rafId
    function tick() {
      analyser.getByteFrequencyData(data)
      // simple volume meter
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
    s.on('message', (m) => setMessages(prev => [...prev, m]))
    setSocket(s)
  }

  function joinRoom() {
    if (!socket) startSocket()
    socket.emit('join', { room })
    setJoinedRoom(true)
  }

  function sendMessage() {
    const text = document.getElementById('chat-input').value
    if (!socket) return
    socket.emit('message', { room, text })
    setMessages(prev => [...prev, { from: 'me', text }])
    document.getElementById('chat-input').value = ''
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
        <div className="chat">
          <div className="messages">
            {messages.map((m, i) => <div key={i} className="msg"><strong>{m.from || 'user'}:</strong> {m.text}</div>)}
          </div>
          <input id="chat-input" placeholder="Type message" />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>

      <div className="vocal">
        <p>Microphone volume</p>
        <div className="meter-bg"><div id="volume-meter" className="meter"></div></div>
        <audio ref={audioRef} style={{ display: 'none' }} />
      </div>

      <div className="notes">
        <p>Notes: This demo captures camera & mic on mobile. For pose detection, enable MediaPipe in index.html (CDN) or integrate a local model.</p>
      </div>
    </div>
  )
}
