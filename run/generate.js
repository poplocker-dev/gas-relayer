const SimpleCrypto = require('simple-crypto-js').default
const wallet       = require('ethereumjs-wallet')

async function generate (secret, topic) {
  try {
    if (!secret)
      throw('Provide secret for private key!')

    const keys      = wallet.generate()
    const sk        = keys.getPrivateKeyString()
    const account   = keys.getChecksumAddressString()
    const encrypted = (new SimpleCrypto(secret)).encrypt(sk)

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

generate(process.argv[2])
