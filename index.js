
const socket = require('./socket')
const Mine = require('./mine')
const merkle = require('merkle')
const sha256 = require('sha256')

let mine = new Mine();

/*hashes = [
  { hash: '3c53d29f545bcab87ba63ffeb58999c448970aa86dc0a7cb4a6e7af5d9d9dd70'},
  { hash: '592192d0a8281a619b438c90f55a9f1ca07454ccab5f527b9c5f6595795cfeb2'},
  { hash: '0c93532d66c24bb9ad7561bdadcd39bafaf5ec97bcad71172a1ae88dba1c5fdf'},
  { hash: '0174d60a7e9dd959be598b2114759f118936c9a75a8e7f3b8c43950ba07624a4'}
]
//11b82f4c4252bc60a5b3031f2a69ac64dd384e76fc3c015163bc50fb7492c711
console.log(mine.generate_merkle_hash(hashes));*/

mine.initialize()

socket.mine = mine;
