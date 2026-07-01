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
    io.to(room).emit('message', { from: socket.id, text })
  })

  socket.on('signal', ({ to, data }) => {
    io.to(to).emit('signal', { from: socket.id, data })
  })

  socket.on('disconnect', () => {
    console.log('disconnect', socket.id)
  })
})

const PORT = process.env.PORT || 4000
server.listen(PORT, () => console.log('Signaling server listening on', PORT))
