const socket = require('./socket')
const api = require('./api')
const Mine = require('./mine')


api.pool().then((response)=>{
  let initial_transactions = response.data;
  api.block_offset_height().then((response)=>{
    let block = response.data;
    let mine = new Mine(prev_block,pool_transactions);
    socket.mine = mine;
  })
})



// const onBlockFound = () => {

// }

// const onNewTransaction  = () => {

// }

// const onTargetChanged  = () => {

// }
