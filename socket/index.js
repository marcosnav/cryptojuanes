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
  //event.type # ping, subscribe
  //event.message.type # block_found, new_transaction, etc
  //event.message.data # { block }, { transaction }, et
  if (event.message == undefined)
    return;

  switch(event.message.data){
    case 'new_transaction':{
      socket.mine.add_transaction(JSON.parse(event.message.data))
      break;
    }
    case 'block_found':{
      socket.mine.initialize();
      break;
    }
    case 'target_changed':{
      socket.mine.target_changed(event.message.data.new_target);
      break;
    }
  }
})



module.exports = socket
