# Setup

Install [geth](https://github.com/ethereum/go-ethereum/wiki/geth) first.

Install `nodejs` dependencies:

```
$ npm install
```

# Running

Start geth node (this will also start whisper node):
- **Do not connect to a light client or Infura node** - sending multiple txs in same block will not work

```
$ ./scripts/geth_ropsten
```
or
```
$ ./scripts/geth_mainnet
```

Copy and edit `.env.sample`:
- RPC_URL should be http://localhost:8545 for default local geth node
- SHH_URL should be ws://localhost:8546 for default local whisper node
- see **Generate Keys** to add new account and encrpyted password
```
$ cp .env.sample .env
```

Generate keys:

```
$ node ./run/generate.js <password> >> .env
```

Run meta tx listener:

```
$ node ./run/watch.js <password>
```
