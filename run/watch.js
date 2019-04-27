const SimpleCrypto = require('simple-crypto-js').default
const { eth, shh } = require('../lib/provider')
const abi          = require('../config/smartlocker.abi.json') //cached
require('dotenv').config()

function processTx (err, result, sk) {
  return new Promise((resolve, reject) => {
    if (err) reject(err)
    else {
      const metaTx   = JSON.parse(eth.utils.hexToAscii(result.payload))
      const contract = new eth.Contract(abi, metaTx.from)
      const { from, to, value, data, gasPrice, gasLimit, signature } = metaTx

      console.log(`RQ : ${to} : ${value}`)

      return contract
        .methods
        .executeSigned(to, value, data, gasPrice, gasLimit, signature)
        .estimateGas().then(gasEstimate => {

          const encoded = contract.methods
                                  .executeSigned(to, value, data, gasPrice, gasLimit, signature)
                                  .encodeABI()
          const outerTx = {
            from: process.env.ACCOUNT,
            to: from,
            gasLimit: gasEstimate,
            gasPrice,
            data: encoded,
            chainId: 3,
            value: '0x0'
          }

          eth.accounts
             .signTransaction(outerTx, sk)
             .then(signed => {
               eth
                 .sendSignedTransaction(signed.rawTransaction, (err, hash) => {
                   if (err)
                     reject(err)
                   else
                     resolve({ to, hash })
                 })
             }).catch(e => { console.log(`DROP : ${to} :  'tx sign'`); reject(e) })

        }).catch(e => { console.log(`DROP : ${to} : gas estimate`); reject(e) })
    }
  }).catch(console.error)
}

async function watch (symKey, secret, topic) {
  try {
    const symKeyID = await shh.addSymKey(symKey)
    const version  = await shh.getVersion()
    const topics   = [eth.utils.toHex(topic)]
    const sk       = (new SimpleCrypto(secret)).decrypt(process.env.ENCRYPTED)

    if (!sk) throw('FATAL : key decryption failed')

    console.log('whisper version:', version);

    shh.subscribe('messages', { symKeyID, topics }, (e,r) => {
      processTx(e,r,sk)
        .then(tx => console.log(`SENT : ${tx.to} : ${tx.hash}`))
        .catch(console.error)
    })

    console.log('subscribed to:', topic)
    console.log('sym key id:', symKeyID)
  }
  catch(e) {
    console.error(e)
    process.exitCode = 1
    process.exit()
  }
}

watch(process.env.SYM_KEY, process.argv[2], 'SLGR')
