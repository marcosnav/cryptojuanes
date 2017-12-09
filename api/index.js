require('dotenv').config()
const axios = require('axios')

const apiFullUrl = `${process.env.API_BASE_URL}/${process.env.NETWORK}`

const api = {
  i: axios.create({ baseURL: apiFullUrl }),
  blocks() {
    return this.i.get('/blocks')
  },
  block_offset_height(){
    return this.i.get('/blocks?offset_height')
  },
  pool() {
    return this.i.get('/pool')
  },
  transaction() {
    return this.i.get('/transaction')
  },
  postBlock(payload) {
    return this.i.post('/block_found', payload)
  },
}

module.exports = api
