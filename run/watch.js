const SimpleCrypto   = require('simple-crypto-js').default
const { eth, shh }   = require('../lib/provider')
const registrarAbi   = require('../config/registrar.abi.json') //cached
const smartLockerAbi = require('../config/smartlocker.abi.json') //cached
require('dotenv').config()

function processTx (error, result, sk, nonce) {
  return new Promise((resolve, reject) => {
    if (error) reject(error)
    else {
      const metaTx = JSON.parse(eth.utils.hexToUtf8(result.payload))
      const { from, to, value, data, gasPrice, gasLimit, signature } = metaTx

      const registrarContract = new eth.Contract(registrarAbi, process.env.REGISTRAR_ADDRESS)
      const smartLockerContract = new eth.Contract(smartLockerAbi, from)

      console.log(`RQ : ${to} : ${value}`)

      return registrarContract
        .methods
        .getName(from)
        .call()
        .then(smartLockerName => {
          if (!smartLockerName || smartLockerName.length == 0) throw('Invalid SmartLocker')
        })
        .then(smartLockerContract
          .methods
          .executeSigned(to, value, data, gasPrice, gasLimit, signature)
          .estimateGas)
        .then(gasEstimate => {

          const encoded = smartLockerContract.methods
                                             .executeSigned(to, value, data, gasPrice, gasLimit, signature)
                                             .encodeABI()

          const outerTxGasPrice = gasPrice - process.env.FEE;
          if (outerTxGasPrice < process.env.SAFE_LOW) throw('Gas price too low')

          const outerTx = {
            from: process.env.ACCOUNT,
            to: from,
            gas: gasEstimate,
            gasPrice: outerTxGasPrice,
            data: encoded,
            chainId: parseInt(process.env.CHAIN_ID),
            value: '0x0',
            nonce
          }

          eth.accounts
             .signTransaction(outerTx, sk)
             .then(signed => {
               eth
                 .sendSignedTransaction(signed.rawTransaction, (error, hash) => {
                   if (error)
                     reject(error)
                   else
                     resolve({ to, hash })
                 })
             }).catch(e => { console.log(`DROP : ${to} :  'tx sign'`); reject(e) })

        }).catch(e => { console.log(`DROP : ${to} : gas estimate`); reject(e) })
    }
  })
}

const setupNonce = () => {
  let latest = eth.utils.toBN(0)
  const one  = eth.utils.toBN(1)
  let timeStamp = 0

  return {
    get current () { return '0x' + latest.toString(16) },

    async track () {
      remote = eth.utils.toBN(await eth.getTransactionCount(process.env.ACCOUNT))
      if (remote.gt(latest) || Date.now() - timeStamp > process.env.NONCE_TTL) latest = remote
      return this.current
    },

    up () {
      latest = latest.add(one)
      timeStamp = Date.now()
      return this.current
    }
  }
}

async function watch (topic, secret) {
  try {
    const symKeyID = await shh.generateSymKeyFromPassword(topic)
    const version  = await shh.getVersion()
    const topics   = [eth.utils.toHex(topic)]
    const sk       = (new SimpleCrypto(secret)).decrypt(process.env.ENCRYPTED)
    const nonce    = setupNonce()

    nonce.track().then(n => console.log('latest nonce:', n) )

    if (!sk) throw('FATAL : key decryption failed')

    //console.log('private key:', sk);
    console.log('whisper version:', version);

    shh.subscribe('messages', { symKeyID, topics }, (error, result) => {
      nonce.track()
           .then(n => processTx(error, result, sk, n))
           .then(tx => console.log(`SENT : ${tx.to} : ${tx.hash}`))
           .then(() => nonce.up())
           .catch(console.error)
    })

    console.log('subscribed to:', topic)
  }
  catch(e) {
    console.error(e)
    process.exitCode = 1
    process.exit()
  }
}

watch(process.env.GAS_RELAY_TOPIC, process.argv[2])
