# ethereum_securities_dapp
An implementation of a contract to manage a share ledger on the blockchain (StockLedger.sol) and a browser application in javascript to offer a reference implementation the deployment and interaction with contracts on the ethereum blockchain.

## Getting Started

These instructions will let you install the ethereum_securities dapp on a machine already running as a client node of an etehereum test network or using a development tool like Ganache.

THIS DAPP IS FOR REFERENCE PURPOSES AND SHOULD NOT BE USED IN PRODUCTION.

### Prerequisites

You need to have a fully configured ethereum test node (e.g. running a client such as geth or parity) or Ganache installed.
You need to have git and npm installed on that node.
You need to have a browser like Firefox or Chrome.

### Installing

Connect through ssh to your node and go to the directory where you want to install your ethereum_reader_server. Then enter the following commands:

```
$ git clone https://github.com/p2pmoney-org/ethereum_securities_dapp
$ cd ./ethereum_securities_dapp
$ npm install
$ truffle migrate
$ npm run dapp
```

By default, a browser session will be opened and access a lite-server instance running on port 8000 (can be modified in the bs-config.json file) and connect to a blockchain node listening on port 8545 (can be modified in the ./app/js/src/config.js file).

If you are using another browser, you can enter directly the following address:

```
http://localhost:8000
```

### Online demo
You can find all the elements and links to an online demo at 

```
http://wordpress.p2pmoney.org/index.php/instructions-for-testing-stockledger-contract/
```