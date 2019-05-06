require('dotenv').config()
const Web3 = require('web3')
const shh = new Web3.modules.Shh(process.env.SHH_URL, null)
const eth = new Web3.modules.Eth(process.env.RPC_URL)

module.exports = { shh, eth }
