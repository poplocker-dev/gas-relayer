require('dotenv').config()
const Web3 = require('web3')
const shh = new Web3.modules.Shh('ws://localhost:8546', null)
const eth = new Web3.modules.Eth(process.env.RPC_URL)

module.exports = { shh, eth }
