const SimpleCrypto = require('simple-crypto-js').default
const wallet       = require('ethereumjs-wallet')
require('dotenv').config()

const { shh } = require('../lib/provider')

async function generate (secret, uname) {
  try {
    if (!secret)
      throw('Provide secret for private key!')
    if (!uname)
      throw('Provide universal name for symkey')

    const symKey    = '0x' + await shh.generateSymKeyFromPassword(uname)
    const keys      = wallet.generate()
    const sk        = keys.getPrivateKeyString()
    const account   = keys.getChecksumAddressString()
    const encrypted = (new SimpleCrypto(secret)).encrypt(sk)

    console.log(`UNAME=${uname}`)
    console.log(`SYM_KEY=${symKey}`)
    console.log(`ACCOUNT=${account}`)
    console.log(`ENCRYPTED=${encrypted}`)

    process.exitCode = 0
    process.exit()
  }
  catch(e) {
    console.error(e)
    process.exitCode = 1
    process.exit()
  }
}

generate(process.argv[2], process.argv[3])
