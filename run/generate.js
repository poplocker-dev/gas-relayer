const SimpleCrypto = require('simple-crypto-js').default
const wallet       = require('ethereumjs-wallet')
require('dotenv').config()

const { web3 } = require('../lib/provider')

async function generate (secret) {
  try {
    if (!secret)
      throw('Provide secret for private key!')

    const symKey    = '0x' + await web3.shh.newSymKey()
    const keys      = wallet.generate();
    const sk        = keys.getPrivateKeyString();
    const account   = keys.getChecksumAddressString();
    const encrypted = (new SimpleCrypto(sk)).encrypt(secret);

    console.log(`SYM_KEY=${symKey}`)
    console.log(`ACCOUNT=${account}`);
    console.log(`ENCRYPTED=${encrypted}`);

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
