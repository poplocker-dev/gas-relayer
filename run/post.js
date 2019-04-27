require('dotenv').config()
const { eth, shh } = require('../lib/provider')

async function post (topic, symKey, payload) {
  try {
    const symKeyID = await shh.addSymKey(symKey)

    console.log('topic:', topic)
    console.log('payload:', payload)
    console.log('sending for:', symKeyID)

    const hash = await shh.post({
      ttl: 300,
      priority: 1,
      symKeyID,
      powTarget: 2.01,
      powTime: 100,
      topic: eth.utils.toHex(topic),
      payload: eth.utils.asciiToHex(payload)
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
