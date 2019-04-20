require('dotenv').config()

const { web3 } = require('../lib/provider')

async function generate (oldKey=false) {
  try {

    let key = null;

    if (oldKey)
      key = process.env.SYM_KEY
    else
      key = '0x' + await web3.shh.newSymKey()

    const kid = await web3.shh.addSymKey(key)
    console.log(`SYM_KEY=${key}`)
    console.log(`SYM_KEY_ID=${kid}`)
    process.exitCode = 0
    process.exit()
  }
  catch(e) {
    console.error(e)
    process.exitCode = 1
    process.exit()
  }
}

generate(process.argv[2])
