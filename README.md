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

Copy and edit `.env.sample`:

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
