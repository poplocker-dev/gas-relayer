const SimpleCrypto = require('simple-crypto-js')
const { web3 }     = require('../lib/provider')
require('dotenv').config()

async function processTx (err, result) {
  if (err)
    console.error(err)
  else {
    const payload = web3.utils.hexToAscii(result.payload)
    console.log('message!', payload)
  }
}

async function watch (symKey, topic) {
  try {
    const symKeyID = await web3.shh.addSymKey(symKey)
    const version  = await web3.shh.getVersion()
    const topics   = [web3.utils.toHex(topic)]

    console.log('whisper version:', version);

    web3.shh.subscribe('messages', { symKeyID, topics }, processTx)

    console.log('subscribed to:', topic)
    console.log('sym key id:', symKeyID)
  }
  catch(e) {
    console.error(e)
    process.exitCode = 1
    process.exit()
  }
}

watch(process.env.SYM_KEY, 'SLGR')
