const socket = require('./socket')
const Mine = require('./mine')
const merkle = require('merkle')

let mine = new Mine();

mine.initialize()

socket.mine = mine;
