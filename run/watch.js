require('dotenv').config()
const { web3 } = require('../lib/provider')

async function watch (symKeyID, topic) {
  try {
    const version  = await web3.shh.getVersion()
    const topics   = [web3.utils.toHex(topic)]

    const callback = (err, result) => {
      if (err)
        throw(err)
      else
        console.log('message!', web3.utils.hexToAscii(result.payload))
    }
    
    console.log('whisper version:', version);

    web3.shh.subscribe('messages', { symKeyID, topics }, callback)

    console.log('subscribed to:', topic)
    console.log('sym key id:', symKeyID)
  }
  catch(e) {
    console.error(e)
    process.exitCode = 1
    process.exit()
  }
}

watch(process.env.SYM_KEY_ID, 'SLGR')
