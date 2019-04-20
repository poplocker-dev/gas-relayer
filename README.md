# Setup

Install [geth](https://github.com/ethereum/go-ethereum/wiki/geth) first.

Install `nodejs` dependencies:

```
$ npm install
```

# Running

Start geth node:

```
$ ./scripts/geth_ropsten
```

Generate keys:

```
$ node ./run/generate.js > .env
```

Run message listener:

```
$ node ./run/watch.js
```

Post some stuff:

```
$ node ./run/post 'some stuff'
```
