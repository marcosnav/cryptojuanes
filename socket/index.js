require('dotenv').config()
const WebSocket = require('ws')

const {
  NETWORK,
  CHANNEL,
  NICKNAME,
  UUID,
  SOCKET_URL,
} = process.env

const params = {
  channel: CHANNEL,
  nickname: NICKNAME,
  uuid: UUID,
  game: NETWORK,
}

const socket = new WebSocket(SOCKET_URL)

socket.on('open', () => {
  const data = {
    command: 'subscribe',
    identifier: JSON.stringify(params)
  }
  socket.send(JSON.stringify(data))
})

socket.on('message', (ev) => {
  const event = JSON.parse(ev)
  console.log(event)
})

module.exports = socket
