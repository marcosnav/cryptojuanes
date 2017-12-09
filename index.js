const socket = require('./socket')
const Mine = require('./mine')
const merkle = require('merkle')


let mine = new Mine();

hashes = [
  "4c714086e821264e94a5412f8043e5c6041b67ec99bd7dca66dac67bc11ceaa8",
  "f0bc70e6e0d168efbe10f2179ab22f9810fbe8dfad7ea69d3c638c9b9194a631",
  "b3c212a29c16081301b7e95edef583bb8ec8c3302f66673b411638f993a00cb1"
 ]

console.log(mine.merkle_tree(hashes));
socket.mine = mine;
