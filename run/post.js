require('dotenv').config()
const { web3 } = require('../lib/provider')

async function post (topic, symKey, payload) {
  try {
    const symKeyID = await web3.shh.addSymKey(symKey)

    console.log('topic:', topic)
    console.log('payload:', payload)
    console.log('sending for:', symKeyID)

    const hash = await web3.shh.post({
      ttl: 300,
      priority: 1,
      symKeyID,
      powTarget: 2.01,
      powTime: 100,
      topic: web3.utils.toHex(topic),
      payload: web3.utils.asciiToHex(payload)
    })
    console.log(`sent ${hash}`)
    process.exitCode = 0
    process.exit()
  }
  catch(e) {
    console.error(e)
    process.exitCode = 1
    process.exit()
  }
}

post('SLGR', process.env.SYM_KEY, process.argv[2])
