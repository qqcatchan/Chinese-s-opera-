// webrtc-helper.js
// Utilities to format and forward signaling messages (used by signaling server)

module.exports = {
  broadcastSignalToRoom: function(io, room, fromSocketId, data) {
    // send signal to all in room except sender
    io.to(room).emit('signal', { from: fromSocketId, data })
  },

  sendSignalToSocket: function(io, toSocketId, fromSocketId, data) {
    io.to(toSocketId).emit('signal', { from: fromSocketId, data })
  }
}
