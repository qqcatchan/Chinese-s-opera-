const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')

const app = express()
app.use(cors())
app.get('/health', (req, res) => res.json({ status: 'ok' }))

const server = http.createServer(app)
const io = new Server(server, { cors: { origin: '*' } })

io.on('connection', (socket) => {
  console.log('socket connected', socket.id)

  socket.on('join', ({ room }) => {
    socket.join(room)
    socket.to(room).emit('message', { from: 'system', text: `${socket.id} joined room ${room}` })
    socket.emit('message', { from: 'system', text: `joined ${room}` })
  })

  socket.on('message', ({ room, text }) => {
    // broadcast chat and also allow carrying signalling payloads
    io.to(room).emit('message', { from: socket.id, text })
  })

  // enhanced signal handler: if room provided, broadcast to room; if `to` provided, send to specific socket id
  socket.on('signal', ({ room, to, data }) => {
    if (room) {
      // broadcast to others in room
      socket.to(room).emit('signal', { from: socket.id, data })
    } else if (to) {
      io.to(to).emit('signal', { from: socket.id, data })
    }
  })

  socket.on('disconnect', () => {
    console.log('disconnect', socket.id)
  })
})

const PORT = process.env.PORT || 4000
server.listen(PORT, () => console.log('Signaling server listening on', PORT))
