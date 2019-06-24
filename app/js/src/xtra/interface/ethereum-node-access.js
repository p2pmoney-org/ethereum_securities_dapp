'use strict';

var Module = class {
	
	constructor() {
		this.name = 'ethereum-node-access';
		
		this.global = null; // put by global on registration
		this.isready = false;
		this.isloading = false;
		
		this.web3_version = "1.0.x";
		//this.web3_version = "0.20.x";
		
		this.ethereum_node_access_instance = null;
	}
	
	init() {
		console.log('module init called for ' + this.name);

		var global = this.global;
		
		this.isready = true;
	}
	
	// compulsory  module functions
	loadModule(parentscriptloader, callback) {
		console.log('loadModule called for module ' + this.name);

		if (this.isloading)
			return;
			
		this.isloading = true;

		var self = this;
		var global = this.global;
		
		var modulescriptloader = global.getScriptLoader('ethereumnodeaccessmoduleloader', parentscriptloader);

		var moduleroot = ScriptLoader.getDappdir() + './js/src/xtra/lib';

		if (global.isInBrowser()) {
			if (this.web3_version  == "1.0.x") {
				modulescriptloader.push_script( moduleroot + '/web3.min-1.0.0-beta36.js');
			}
			else {
				modulescriptloader.push_script( moduleroot + '/web3-0.20.3.js');
				modulescriptloader.push_script( moduleroot + '/truffle-contract-1.1.11.js');
			}
		}

		modulescriptloader.load_scripts(function() { self.init(); if (callback) callback(null, self); });
		
		return modulescriptloader;
	}
	
	isReady() {
		return this.isready;
	}

	hasLoadStarted() {
		return this.isloading;
	}

	// optional  module functions
	
	
	
	// objects
	getEthereumNodeAccessInstance(session) {
		if (session.ethereum_node_access_instance)
			return session.ethereum_node_access_instance;
		
		console.log('instantiating EthereumNodeAccess');
		
		var global = this.global;

		var result = []; 
		var inputparams = [];
		
		inputparams.push(this);
		inputparams.push(session);
		
		result[0]= new EthereumNodeAccess(session);
		
		// call hook to let modify or replace instance
		var ret = global.invokeHooks('getEthereumNodeAccessInstance_hook', result, inputparams);
		
		if (ret && result[0]) {
			session.ethereum_node_access_instance = result[0];
		}
		else {
			session.ethereum_node_access_instance = new EthereumNodeAccess(session);
		}
		
		
		return session.ethereum_node_access_instance;
	}
	
	getArtifactProxyObject(artifactuuid, contractname, artifactpath, abi, bytecode) {
		return new ArtifactProxy(artifactuuid, contractname, artifactpath, abi, bytecode);
	}
	
	getContractProxyObject(contractuuid, artifact) {
		return new ContractProxy(contractuuid, artifact);
	}
	
	getContractInstanceProxyObject(contractinstanceuuid, address, contract) {
		return new ContractInstanceProxy(contractinstanceuuid, address, contract);
	}
	
	//
	// Web3
	//
	getWeb3Class(session) {
		if ( typeof window !== 'undefined' && window ) {
			return Web3;
		}
		else {
			return require('web3');
		}
	}
	
	getWeb3Provider(session) {
		var Web3 = this.getWeb3Class(session);

		var global = this.global;
		var ethnodemodule = global.getModuleObject('ethnode');

		var web3providerurl = ethnodemodule.getWeb3ProviderUrl();
		var web3Provider = new Web3.providers.HttpProvider(web3providerurl);

		return web3Provider;
	}
	
	getWeb3Instance(session) {
		if (this.web3instance)
			return this.web3instance;
		
		var Web3 = this.getWeb3Class();
		var web3Provider = this.getWeb3Provider(session);
		  
		this.web3instance = new Web3(web3Provider);		
		
		console.log("web3 instance created");
		
		return this.web3instance;
	}
	
	getEthereumJsClass(session) {
		if ( typeof window !== 'undefined' && window ) {
			return window.ethereumjs;
		}
		else {
			var ethereumjs;
			
			ethereumjs = require('ethereum.js');
			ethereumjs.Util = require('ethereumjs-util');
			ethereumjs.Wallet = require('ethereumjs-wallet');
			ethereumjs.tx = require('ethereumjs-tx');

			return ethereumjs;
		}
	}

	
	getSolidityContractObject(session, abi) {
		return new SolidityContract(session, abi);
	}
	
	
	getEthereumTransactionObject(session, sendingaccount) {
		return new EthereumTransaction(session, sendingaccount);
	}
	
	unstackEthereumTransactionObject(session, params) {
		let txjson = params[params.length - 1];
		let args = params.slice(0,-1);

		if (txjson instanceof EthereumTransaction) {
			var ethereumtransaction = params[params.length - 1];
		}
		else {

			let fromaddress = txjson.from;
			let fromaccount = session.getAccountObject(fromaddress);
			
			let toaddress = (txjson.to ? txjson.to : null);
			let toaccount = (toaddress ? session.getAccountObject(toaddress) : null);
			
			let amount = (txjson.value ? txjson.value : 0);
			
			let gas = (txjson.gas ? txjson.gas : 0);
			let gasPrice = (txjson.gasPrice ? txjson.gasPrice : 0);
			
			let txdata = (txjson.data ? txjson.data : null);
			
			let nonce = (txjson.nonce ? txjson.nonce : null);
			
			var ethereumtransaction = this.getEthereumTransactionObject(session, fromaccount);
		    
			ethereumtransaction.setToAddress(toaddress);
			ethereumtransaction.setValue(amount);
			ethereumtransaction.setGas(gas);
			ethereumtransaction.setGasPrice(gasPrice);
			ethereumtransaction.setData(txdata);
			ethereumtransaction.setNonce(nonce);
		}
		
		return ethereumtransaction;
	}
	
	

}

var ArtifactProxy = class {
	constructor(artifactuuid, artifactpath, contractName, abi, bytecode) {
		this.artifactuuid = artifactuuid;
		this.artifactpath = artifactpath;
		this.contractName = contractName;
		this.abi = abi;
		this.bytecode = bytecode;
	}
	
	getArtifactPath() {
		return this.artifactpath;
	}
	
	getContractName() {
		return this.contractName;
	}
	
	getAbi() {
		return this.abi;
	}
	
	getByteCode() {
		return this.bytecode;
	}
	
	getUUID() {
		return this.artifactuuid;
	}
}

var ContractProxy = class {
	constructor(contractuuid, artifact) {
		this.contractuuid = contractuuid;
		this.artifact = artifact;
	}
	
	getUUID() {
		return this.contractuuid;
	}
	
	getAbi() {
		return (this.artifact['abi'] ? this.artifact['abi'] : null);
	}

	getByteCode() {
		return (this.artifact['bytecode'] ? this.artifact['bytecode'] : null);
	}

	getContractName() {
		return (this.artifact['contractName'] ? this.artifact['contractName'] : null);
	}
}

var ContractInstanceProxy = class {
	constructor(contractinstanceuuid, address, contract) {
		this.contractinstanceuuid = contractinstanceuuid;
		this.address = address;
		this.contract = contract;
		
		this.instance = null;
	}
	
	getUUID() {
		return this.contractinstanceuuid;
	}
	
	getAddress() {
		return this.address;
	}
	
	getAbi() {
		return this.contract.getAbi();
	}
	
	getInstance() {
		return this.instance;
	}
}



class SolidityContract {
	constructor(session, abi) {
		
		this.session = session;
		this.abi = abi;
		
		var global = session.getGlobalObject();
		var ethereumnodeaccessmodule = global.getModuleObject('ethereum-node-access');
		
		this.ethereumnodeaccessmodule = ethereumnodeaccessmodule;
		this.web3_version = ethereumnodeaccessmodule.web3_version;
		
		this.web3 = ethereumnodeaccessmodule.getWeb3Instance(session);
	}
	
	getMethodAbiDefinition(methodname) {
		var abi = this.abi;
		var abidef = null;
		
		if (!abi)
			return abidef;
		
		for (var i = 0; i < abi.length; i++) {
			var item = abi[i];
			var name = item.name;
			
			if (name == methodname) {
				abidef = item;
				
				break;
			}
		}
		
		return abidef;
	}
	

	
	getDeployData(bytecode, args) {
		var web3 = this.web3;
		var session = this.session;
		
		var abi = this.abi;

		if (this.web3_version == "1.0.x") {
			// Web3 > 1.0
			
			if (!bytecode)
				throw 'no byte code, can not deploy contract';
			
			
			// creating contract object
			var contract = new web3.eth.Contract(abi);

			// then create a deploy transaction data
			var deploy = contract.deploy({
	              data: bytecode,
	              arguments: args
			}).encodeABI();
			
			return deploy
			
		}
		else {
			throw 'not implemented';
		}
	}
	
	getCallData(address, abidef, args) {
		var session = this.session;
		var web3 = this.web3;
		
		var abi = this.abi;
		
		if (this.web3_version == "1.0.x") {
			// Web3 > 1.0
			var instance = new web3.eth.Contract(abi, address);
				// should be done before reading signature
				// because fills signature hex value
		}
		else {
			var instance = web3.eth.contract(abi).at(address);
		}

		var methodname = abidef.name;
		var signature = abidef.signature;
		
		if (this.web3_version == "1.0.x") {
			// Web3 > 1.0
			var funcname = instance.methods[signature];

			// create a call transaction data
			//let calldata = funcname(...args).encodeABI();
			let calldata = instance.methods[signature](...args).encodeABI();
			
			return calldata;
		}
		else {
			// Web3 == 0.20.x
			

			var funcname = instance[methodname];

			// create a call transaction data
			// NOT TESTED
			//let calldata = funcname.call(...params).encodeABI();
			let calldata = funcname.getData(args);
			
			return calldata;
		}
	}
}

class EthereumTransaction {
	constructor(session, sendingaccount) {
		this.session = session;
		
		this.transactionuuid = null;
		this.transactionHash = null;
		
		this.sendingaccount = sendingaccount;
		
		this.recipientaccount = null;
		
		var global = session.getGlobalObject();
		var commonmodule = global.getModuleObject('common');
		var ethnodemodule = global.getModuleObject('ethnode');
		
		this.value = 0;
		
		this.gas = ethnodemodule.getDefaultGasLimit();
		this.gasPrice = ethnodemodule.getDefaultGasPrice();
		
		this.data = null;
		
		this.nonce = null;
		
		this.status = null;
		
		var ethereumnodeaccessmodule = global.getModuleObject('ethereum-node-access');
		
		this.ethereumnodeaccessmodule = ethereumnodeaccessmodule;
		this.web3_version = ethereumnodeaccessmodule.web3_version;
		
		this.web3 = ethereumnodeaccessmodule.getWeb3Instance(session);
	}
	
	getTransactionUUID() {
		return this.transactionuuid;
	}
	
	setTransactionUUID(txuuid) {
		this.transactionuuid = txuuid;
	}
	
	getTransactionHash() {
		return this.transactionHash;
	}
	
	setTransactionHash(txhash) {
		this.transactionHash = txhash;
	}
	
	getPayerAddress() {
		if (this.payeraddress)
			return this.payeraddress;
		else
			return this.getFromAddress();
	}
	
	setPayerAddress(address) {
		this.payeraddress = address;
	}
	
	getFromAddress() {
		return this.sendingaccount.getAddress();
	}
	
	getFromAccount() {
		return this.sendingaccount;
	}
	
	getToAddress() {
		return (this.recipientaccount ? this.recipientaccount.getAddress() : null);
	}
	
	getToAccount() {
		return this.recipientaccount;
	}
	
	setToAddress(address) {
		var toaccount = this.session.getAccountObject(address);
		
		this.recipientaccount = toaccount;
	}
	
	getValue() {
		return this.value;
	}
	
	setValue(value) {
		this.value = value;
	}
	
	getGas() {
		return this.gas;
	}
	
	setGas(gas) {
		this.gas = gas;
	}
	
	getGasPrice() {
		return this.gasPrice;
	}
	
	setGasPrice(gasprice) {
		this.gasPrice = gasprice;
	}
	
	getNonce() {
		return this.nonce;
	}
	
	setNonce(nonce) {
		this.nonce = nonce;
	}
	
	getData() {
		this.data;
	}
	
	setData(data) {
		this.data = data;
	}
	
	getStatus() {
		return this.status;
	}
	
	setStatus(status) {
		this.status = status;
	}
	
	getTxJson() {
		var web3 = this.web3;
		
		var fromaccount = this.sendingaccount;
		var toaccount = this.recipientaccount;
		
		var amount = this.value;
		var gas = this.gas;
		var gasPrice = this.gasPrice;
		
		var txdata = this.data;
		var nonce = this.nonce;
		
		var fromaddress = fromaccount.getAddress();
		var toaddress = (toaccount ? toaccount.getAddress() : null);
		
		var txjson = {from: fromaddress,
				to: toaddress,
				gas: gas, 
				gasPrice: gasPrice,
			};
		
		if (nonce)
			txjson.nonce = nonce;
		
		if (txdata)
			txjson.data = txdata;

		// amount conversion to Wei
		if (this.web3_version == "1.0.x") {
			// Web3 > 1.0
			if (amount)
				txjson.value = web3.utils.toWei(amount, 'ether');
		}
		else {
			// Web3 == 0.20.x
			if (amount)
				txjson.value = web3.toWei(amount, 'ether');
		}
		

		return txjson;
	}
	
	getRawData(callback) {
		var self = this;
		var session = this.session;
		var global = session.getGlobalObject();
		var ethnodemodule = global.getModuleObject('ethnode');
		
		var web3 = this.web3;
		var fromaccount = this.sendingaccount;
		var toaccount = this.recipientaccount;
		
		var amount = this.value;
		var gas = this.gas;
		var gasPrice = this.gasPrice;
		
		var txdata = this.data;
		var nonce = this.nonce;
		
		var fromaddress = fromaccount.getAddress();
		var toaddress = (toaccount ? toaccount.getAddress() : null);
		
		var txjson = this.getTxJson();
		
		var ethereumnodeaccessmodule = this.ethereumnodeaccessmodule;
		var EthereumNodeAccess = ethnodemodule.getEthereumNodeAccessInstance();

		
		if (fromaccount.canSignTransactions()) {
			// signing the transaction
			var ethereumjs = ethereumnodeaccessmodule.getEthereumJsClass(session);
			
			var hexprivkey = fromaccount.getPrivateKey();
			
			var privkey = hexprivkey.substring(2);
			var bufprivkey = ethereumjs.Buffer.Buffer.from(privkey, 'hex');

		    
		    // signing
			if (this.web3_version == "1.0.x") {
				// Web3 > 1.0

			    // turn gas, gasprice and value to hex
			    // not to receive "insufficient funds for gas * price + value"
			    txjson.gas = web3.utils.toHex(gas.toString());
			    txjson.gasPrice = web3.utils.toHex(gasPrice.toString());
			    txjson.value = web3.utils.toHex((txjson.value ? txjson.value.toString() : 0));
			    
			}
			else {
				// Web3 == 0.20.x

			    // turn gas, gasprice and value to hex
			    // not to receive "insufficient funds for gas * price + value"
			    txjson.gas = web3.toHex(gas.toString());
			    txjson.gasPrice = web3.toHex(gasPrice.toString());
			    txjson.value = web3.toHex(txjson.value.toString());
			    
			}
			
			var tx = new ethereumjs.Tx(txjson);
			
		    
		    //return web3.eth.getTransactionCount(fromaddress, function (err, count) {
		    return EthereumNodeAccess.web3_getTransactionCount(fromaddress, function (err, count) {
		    	
		    	if (!err) {
			    	txjson.nonce = (nonce ? nonce : count);
			    	
					var tx = new ethereumjs.Tx(txjson);
					
					tx.sign(bufprivkey);

				    var raw = '0x' + tx.serialize().toString('hex');
				    
				    if (callback)
				    	callback(null, raw);

				    return raw;
		    	}
		    	else {
		    		if (callback)
		    			callback(err, null);
		    	}
		    });
		}
		else {
			throw 'not implemented';
		}
	}
	
	canSignTransaction() {
		return this.sendingaccount.canSignTransactions();
	}
}

class EthereumNodeAccess {
	constructor(session) {
		this.session = session;
		
		//this.web3providerurl = null;
		this.web3instance = null;
		
		var global = session.getGlobalObject();
		var ethereumnodeaccessmodule = global.getModuleObject('ethereum-node-access');
		
		if (!ethereumnodeaccessmodule)
			throw 'ethereum-node-access module is no loaded';
		
		this.ethereumnodeaccessmodule = ethereumnodeaccessmodule;
		this.web3_version = ethereumnodeaccessmodule.web3_version;
	}
	
	//
	// Web3
	//
	_getWeb3Class() {
		return this.ethereumnodeaccessmodule.getWeb3Class(this.session);
	}
	
	_getWeb3Provider() {
		return  this.ethereumnodeaccessmodule.getWeb3Provider(this.session);
	}
	
	_getWeb3Instance() {
		if (this.web3instance)
			return this.web3instance;
		
		this.web3instance = this.ethereumnodeaccessmodule.getWeb3Instance(this.session);		
		
		console.log("web3 instance created in EthereumNodeAccess");
		
		return this.web3instance;
	}
	
	/*_getEthereumJsClass() {
		if ( typeof window !== 'undefined' && window ) {
			return window.ethereumjs;
		}
		else {
			var ethereumjs;
			
			ethereumjs = require('ethereum.js');
			ethereumjs.Util = require('ethereumjs-util');
			ethereumjs.Wallet = require('ethereumjs-wallet');
			ethereumjs.tx = require('ethereumjs-tx');

			return ethereumjs;
		}
	}*/
	

	
	
	// node
	web3_isSyncing(callback) {
		var self = this
		var session = this.session;

		var promise = new Promise(function (resolve, reject) {
			try {
				var web3 = self._getWeb3Instance();
				
				if (self.web3_version == "1.0.x") {
					// Web3 > 1.0
					var funcname = web3.eth.isSyncing;
				}
				else {
					// Web3 == 0.20.x
					var funcname = web3.eth.getSyncing;
				}

				return funcname( function(err, res) {
					if (!err) {
						if (callback)
							callback(null, res);
						return resolve(res);
					}
					else {
						if (callback)
							callback('web3 error: ' + err, null);
						
						reject('web3 error: ' + err);
					}
				
				});
			}
			catch(e) {
				if (callback)
					callback('exception: ' + e, null);
				
				reject('web3 exception: ' + e);
			}
			
		});
		
		return promise
	}
	
	web3_isListening(callback) {
		var self = this
		var session = this.session;

		var promise = new Promise(function (resolve, reject) {
			try {
				var web3 = self._getWeb3Instance();
				
				if (self.web3_version == "1.0.x") {
					// Web3 > 1.0
					var funcname = web3.eth.net.isListening;
				}
				else {
					// Web3 == 0.20.x
					var funcname = web3.net.getListening;
				}

				return funcname( function(err, res) {
					if (!err) {
						if (callback)
							callback(null, res);
						return resolve(res);
					}
					else {
						if (callback)
							callback('web3 error: ' + err, null);
						
						reject('web3 error: ' + err);
					}
				
				});
			}
			catch(e) {
				if (callback)
					callback('exception: ' + e, null);
				
				reject('web3 exception: ' + e);
			}
			
		});
		
		return promise
	}
	
	web3_getNetworkId(callback) {
		var self = this
		var session = this.session;

		var promise = new Promise(function (resolve, reject) {
			try {
				var web3 = self._getWeb3Instance();
				
				if (self.web3_version == "1.0.x") {
					// Web3 > 1.0
					var funcname = web3.eth.net.getId;
				}
				else {
					// Web3 == 0.20.x
					var funcname = web3.version.getNetwork;
				}

				
				return funcname( function(err, res) {
					if (!err) {
						if (callback)
							callback(null, res);
						return resolve(res);
					}
					else {
						if (callback)
							callback('web3 error: ' + err, null);
						
						reject('web3 error: ' + err);
					}
				
				});
			}
			catch(e) {
				if (callback)
					callback('exception: ' + e, null);
				
				reject('web3 exception: ' + e);
			}
			
		});
		
		return promise
	}
	
	web3_getPeerCount(callback) {
		var self = this
		var session = this.session;

		var promise = new Promise(function (resolve, reject) {
			try {
				var web3 = self._getWeb3Instance();
				
				if (self.web3_version == "1.0.x") {
					// Web3 > 1.0
					var funcname = web3.eth.net.getPeerCount;
				}
				else {
					// Web3 == 0.20.x
					var funcname = web3.net.getPeerCount;
				}

				
				return funcname( function(err, res) {
					if (!err) {
						if (callback)
							callback(null, res);
						return resolve(res);
					}
					else {
						if (callback)
							callback('web3 error: ' + err, null);
						
						reject('web3 error: ' + err);
					}
				
				});
			}
			catch(e) {
				if (callback)
					callback('exception: ' + e, null);
				
				reject('web3 exception: ' + e);
			}
			
		});
		
		return promise
	}

	// node
	web3_getNodeInfo(callback) {
		var self = this
		var session = this.session;

		var promises = [];
		var promise;
		
		var issyncing;
		var currentblock = -1;
		var highestblock = -1;
		
		// islistening
		promise = this.web3_isListening();
		promises.push(promise);
		
		// networkid
		promise = this.web3_getNetworkId();
		promises.push(promise);

		// peercount
		promise = this.web3_getPeerCount();
		promises.push(promise);

		
		// issyncing
		promise = this.web3_isSyncing(function(error, result) {
			var syncingobj;
			
			if (!error) {
				if(result !== false) {
					issyncing = true;
					
					var arr = [];

					for(var key in result){
					  arr[key] = result[key];
					}
					
					syncingobj = arr;
				}
				else {
					issyncing = false;
					
					syncingobj = false;
				}
			}
			else {
				issyncing = error;
			}
			return result;
		});
		promises.push(promise);
		
		// blocknumber
		promise = this.web3_getBlockNumber();
		promises.push(promise);
		
		// all promises
		return Promise.all(promises).then(function(res) {
			var islistening = res[0];
			var networkid = res[1];
			var peercount = res[2];
			var syncingobj = res[3];
			var blocknumber = res[4];
			
			currentblock = ((syncingobj !== false) && (syncingobj) && (syncingobj['currentBlock']) ? syncingobj['currentBlock'] : blocknumber);
			highestblock = ((syncingobj !== false) && (syncingobj) && (syncingobj['highestBlock']) ? syncingobj['highestBlock'] : blocknumber);

			var json = {islistening: islistening, 
					networkid: networkid, 
					peercount: peercount, 
					issyncing: issyncing,
					currentblock: currentblock,
					highestblock: highestblock};
			
			if (callback)
				callback(null, json);
			
			return json
		});
	}

	
	// accounts
	web3_getBalanceSync(address) {
		var web3 = this._getWeb3Instance();
		var balance = web3.eth.getBalance(address);
		
		return balance;
	}
	
	web3_getBalance(address, callback) {
		if (!callback)
			return this.web3_getBalanceSync(address);
		
		var self = this
		var session = this.session;

		var promise = new Promise(function (resolve, reject) {
			try {
				var web3 = self._getWeb3Instance();
				
				return web3.eth.getBalance(address, function(err, balance) {
					if (!err) {
						if (callback)
							callback(null, balance);
						
						return resolve(balance);
					}
					else {
						if (callback)
							callback('web3 error: ' + err, null);
						
						reject('web3 error: ' + err);
					}
				
				});
			}
			catch(e) {
				if (callback)
					callback('exception: ' + e, null);
				
				reject('web3 exception: ' + e);
			}
			
		});
		
		return promise;
	}
	
	web3_getCode(address, callback) {
		var self = this
		var session = this.session;

		var promise = new Promise(function (resolve, reject) {
			try {
				var web3 = self._getWeb3Instance();
				
				return web3.eth.getCode(address, function(err, code) {
					if (!err) {
						if (callback)
							callback(null, code);
						return resolve(code);
					}
					else {
						if (callback)
							callback('web3 error: ' + err, null);
						
						reject('web3 error: ' + err);
					}
				
				});
			}
			catch(e) {
				if (callback)
					callback('exception: ' + e, null);
				
				reject('web3 exception: ' + e);
			}
			
		});
		
		return promise;
	}
	
	web3_unlockAccount(account, password, duration, callback) {
		var self = this;
		var web3 = this._getWeb3Instance();
		
		if (account.canSignTransactions()) {
			var privatekey = account.getPrivateKey();
			
			var promise = new Promise(function (resolve, reject) {
				if (self.web3_version == "1.0.x") {
					// create an account from private key
					// (used in lock account to remove account from wallet)
					var web3account = web3.eth.accounts.privateKeyToAccount(privatekey);
					account.web3account = web3account;
				}

				if (callback)
					callback(null, true);

				return resolve(true);
			});
			
		}
		else {
			var address = account.getAddress();
			
			if (self.web3_version == "1.0.x") {
				// Web3 > 1.0
				var funcname = web3.eth.personal.unlockAccount;
			}
			else {
				// Web3 == 0.20.x
				var funcname = web3.personal.unlockAccount;
			}
			
			var promise = new Promise(function (resolve, reject) {
				try {
					
					return funcname(address, password, duration, function(err, res) {
						if (!err) {
							if (callback)
								callback(null, res);
							return resolve(res);
						}
						else {
							if (callback)
								callback('web3 error: ' + err, null);
							
							reject('web3 error: ' + err);
						}
					
					});
				}
				catch(e) {
					if (callback)
						callback('exception: ' + e, null);
					
					reject('web3 exception: ' + e);
				}
				
			});
		}
		
		return promise;
	}
	
	web3_lockAccount(account, callback) {
		var self = this;
		var web3 = this._getWeb3Instance();
		
		if (account.canSignTransactions()) {
			var web3account = account.web3account;
			
			var promise = new Promise(function (resolve, reject) {
				if (self.web3_version == "1.0.x") {
					// Web3 > 1.0
					if (web3account)
					web3.eth.accounts.wallet.remove(web3account);
				}
				
				account.web3account = null;

				if (callback)
					callback(null, true);

				return resolve(true);
			});
			
		}
		else {
			var address = account.getAddress();
			
			if (self.web3_version == "1.0.x") {
				// Web3 > 1.0
				var funcname = web3.eth.personal.lockAccount;
			}
			else {
				// Web3 == 0.20.x
				var funcname = web3.personal.lockAccount;
			}
			
			
			var promise = new Promise(function (resolve, reject) {
				try {
					
					return funcname(address, function(err, res) {
						if (!err) {
							if (callback)
								callback(null, res);
							return resolve(res);
						}
						else {
							if (callback)
								callback('web3 error: ' + err, null);
							
							reject('web3 error: ' + err);
						}
					
					});
				}
				catch(e) {
					if (callback)
						callback('exception: ' + e, null);
					
					reject('web3 exception: ' + e);
				}
				
			});
		}
		
		
		return promise;
	}
	
	// blocks
	web3_getBlockNumber(callback) {
		var self = this
		var session = this.session;

		var promise = new Promise(function (resolve, reject) {
			try {
				var web3 = self._getWeb3Instance();
				
				return web3.eth.getBlockNumber( function(err, res) {
					if (!err) {
						if (callback)
							callback(null, res);
						return resolve(res);
					}
					else {
						if (callback)
							callback('web3 error: ' + err, null);
						
						reject('web3 error: ' + err);
					}
				
				});
			}
			catch(e) {
				if (callback)
					callback('exception: ' + e, null);
				
				reject('web3 exception: ' + e);
			}
			
		});
		
		return promise;
	}
	
	web3_getBlock(blockid, bWithTransactions, callback) {
		var self = this
		var session = this.session;

		var promise = new Promise(function (resolve, reject) {
			try {
				var web3 = self._getWeb3Instance();
				
				return web3.eth.getBlock(blockid, bWithTransactions, function(err, res) {
					if (!err) {
						if (callback)
							callback(null, res);
						return resolve(res);
					}
					else {
						if (callback)
							callback('web3 error: ' + err, null);
						
						reject('web3 error: ' + err);
					}
				
				});
			}
			catch(e) {
				if (callback)
					callback('exception: ' + e, null);
				
				reject('web3 exception: ' + e);
			}
			
		});
		
		return promise;
	}
	
	// transactions
	_findTransactionFromUUID(transactionuuid) {
		// we look in local history
	}
	
	_readTransactionLogs() {
		var session = this.session;
		
		var storageaccess = session.getStorageAccessInstance();
		
		var keys = ['ethnode', 'transactions'];
		
		var jsonarray = storageaccess.readClientSideJson(keys);
		
		return jsonarray;
	}
	
	_saveTransactionLog(ethtransaction) {
		var session = this.session;
		
		var transactionuuid = ethtransaction.getTransactionUUID();
		var transactionHash = ethtransaction.getTransactionHash();
		var from = ethtransaction.getFromAddress();
		var to = ethtransaction.getToAddress();
		var value = ethtransaction.getValue();
		var creationdate = Date.now();
		
		var status = ethtransaction.getStatus();
		
		var json = {transactionuuid: transactionuuid, transactionHash: transactionHash, from: from, to: to, value: value, creationdate: creationdate, status: status};
		
		// add to transaction list (on the client/browser side)
		var storageaccess = session.getStorageAccessInstance();
		
		var keys = ['ethnode', 'transactions'];
		
		var jsonarray = storageaccess.readClientSideJson(keys);
		
		if ((!jsonarray) || (jsonarray.length == 0)) {
			jsonarray = [];
		}
		
		jsonarray.push(json);
		
		storageaccess.saveClientSideJson(keys, jsonarray);
	}
	
	web3_findTransaction(transactionuuid, callback) {
		var self = this
		var session = this.session;
		
		var hash = this._findTransactionFromUUID(transactionuuid);
		
		return this.web3_getTransaction(hash, callback);
	}
	
	web3_getTransactionList(callback) {
		var self = this;
		var session = this.session;
		var global = session.getGlobalObject();
		
		var user = session.getSessionUserObject();
		var useruuid = (user ? user.getUserUUID() : null);

		var ethnodemodule = global.getModuleObject('ethnode');

		var promise = new Promise(function (resolve, reject) {
			try {
				var txarray = self._readTransactionLogs();
				
				if (txarray) {
					var transactionarray = [];
					
					for (var i = 0; i < txarray.length; i++) {
						var tx = txarray[i];
						var transaction = ethnodemodule.getTransactionObject(tx['transactionuuid']);
						
						transaction.setTransactionHash(tx['transactionHash']);
						transaction.setFrom(tx['from']);
						transaction.setTo(tx['to']);
						transaction.setValue(tx['value']);
						transaction.setCreationDate(tx['creationdate']);
						transaction.setStatus(tx['status']);
					
						transactionarray.push(transaction);
					}
					
					if (callback)
						callback(null, transactionarray);
					
					return resolve(transactionarray);
				}
				else {
					if (callback)
						callback('error retrieving user transaction list', null);

					reject('error retrieving user transaction list');
				}
			}
			catch(e) {
				if (callback)
					callback('exception: ' + e, null);
				
				reject('exception: ' + e);
			}
			
		});
		
		return promise;
	}

	web3_getTransactionCount(fromaddress, callback) {
		var self = this
		var session = this.session;

		var promise = new Promise(function (resolve, reject) {
			try {
				var web3 = self._getWeb3Instance();
				
				return web3.eth.getTransactionCount(fromaddress, function(err, res) {
					if (!err) {
						if (callback)
							callback(null, res);
						return resolve(res);
					}
					else {
						if (callback)
							callback('web3 error: ' + err, null);
						
						reject('web3 error: ' + err);
					}
				
				});
			}
			catch(e) {
				if (callback)
					callback('exception: ' + e, null);
				
				reject('web3 exception: ' + e);
			}
			
		});
		
		return promise;
	}
	
	web3_getTransaction(hash, callback) {
		var self = this
		var session = this.session;

		var promise = new Promise(function (resolve, reject) {
			try {
				var web3 = self._getWeb3Instance();
				
				return web3.eth.getTransaction(hash, function(err, res) {
					if (!err) {
						if (callback)
							callback(null, res);
						return resolve(res);
					}
					else {
						if (callback)
							callback('web3 error: ' + err, null);
						
						reject('web3 error: ' + err);
					}
				
				});
			}
			catch(e) {
				if (callback)
					callback('exception: ' + e, null);
				
				reject('web3 exception: ' + e);
			}
			
		});
		
		return promise;
	}
	
	web3_getTransactionReceipt(hash, callback) {
		var self = this
		var session = this.session;

		var promise = new Promise(function (resolve, reject) {
			try {
				var web3 = self._getWeb3Instance();
				
				return web3.eth.getTransactionReceipt(hash, function(err, res) {
					if (!err) {
						if (callback)
							callback(null, res);
						return resolve(res);
					}
					else {
						if (callback)
							callback('web3 error: ' + err, null);
						
						reject('web3 error: ' + err);
					}
				
				});
			}
			catch(e) {
				if (callback)
					callback('exception: ' + e, null);
				
				reject('web3 exception: ' + e);
			}
			
		});
		
		return promise
	}
	
	web3_sendEthTransaction(ethtransaction, callback) {
		console.log('EthereumNodeAccess.web3_sendEthTransaction called');
		
		if (!ethtransaction)
			throw 'no transaction defined';
		
		var self = this
		var session = this.session;
		
		if (ethtransaction.getTransactionUUID() === null)
			ethtransaction.setTransactionUUID(session.guid());
		
		var transactionuuid = ethtransaction.getTransactionUUID();
		
		console.log('EthereumNodeAccess.web3_sendEthTransaction txjson is ' + JSON.stringify(ethtransaction.getTxJson()));
		
		var promise = new Promise( function(resolve, reject) {
			
			try {
				var web3 = self._getWeb3Instance();
				
				// common callback function
				var __transactioncallback = function(err, res) {
					var transactionHash = res;
					console.log('EthereumNodeAccess.web3_sendEthTransaction transactionHash is ' + transactionHash);
					
					if (transactionHash) {
						ethtransaction.setTransactionHash(transactionHash);
						ethtransaction.setStatus('completed');				
					}
					else {
						ethtransaction.setStatus('failed');
					}
					
					self._saveTransactionLog(ethtransaction);
			         
					if (!err) {
						if (callback)
							callback(null, transactionHash);
						
						return resolve(transactionHash);
					}
					else {
						if (callback)
							callback('web3 error: ' + err, null);
						
						reject('web3 error: ' + err);
					}
				};
				
				// sending unsigned or signed
				if (ethtransaction.canSignTransaction()) {
					// signing the transaction
				    return ethtransaction.getRawData(function(err, raw) {
				    	if (!err) {
				    		
						    
				    		// send signed
							if (self.web3_version == "1.0.x") {
								// Web3 > 1.0
								var funcname = web3.eth.sendSignedTransaction;
							}
							else {
								// Web3 == 0.20.x
								var funcname = web3.eth.sendRawTransaction;
							}
							
							return funcname(raw, __transactioncallback);
				    	}
				    	else {
				    		__transactioncallback(err, null);
				    	}
				    });

				}
				else {
					// unsigned send (node will sign thanks to the unlocking of account)
					var txjson = ethtransaction.getTxJson();
					return web3.eth.sendTransaction(txjson, __transactioncallback);
				}
				
			}
			catch(e) {
				if (callback)
					callback('exception: ' + e, null);
				
				reject('web3 exception: ' + e);
			}
		
		});
		
		return promise
	}
	
	web3_sendTransaction(fromaccount, toaccount, amount, gas, gasPrice, txdata, nonce, callback) {
		console.log('EthereumNodeAccess.web3_sendTransaction called');
		
		var self = this
		var session = this.session;
		
		if (!fromaccount)
			throw 'no sender specified for transaction';
		
		if ( (amount > 0) && !toaccount)
			throw 'no recipient specified for transaction. Use burn if you want to destroy ethers.';
		
		var fromaddress = fromaccount.getAddress();
		var toaddress = (toaccount ? toaccount.getAddress() : null);

		console.log('EthereumNodeAccess.web3_sendTransaction called from ' + fromaddress + ' to ' + toaddress + ' amount ' + amount);

	    var ethtransaction = self.ethereumnodeaccessmodule.getEthereumTransactionObject(session, fromaccount);
	    
	    ethtransaction.setToAddress(toaddress);
	    ethtransaction.setValue(amount);
	    ethtransaction.setGas(gas);
	    ethtransaction.setGasPrice(gasPrice);
	    ethtransaction.setData(txdata);
	    ethtransaction.setNonce(nonce);
	    
		var transactionuuid = session.guid(); // maybe we could read it from txdata
		
		ethtransaction.setTransactionUUID(transactionuuid);

		return this.web3_sendEthTransaction(ethtransaction, callback);
	}
	
	
	// contracts
	_loadArtifact(jsonfile, callback) {
		var loadpromise = $.getJSON(jsonfile, function(data) {
				console.log('contract json file read ');

				if (callback)
					callback(data);

				return data;
		});
		
		return loadpromise;
	}
	
	/*_getWeb3ContractObject(contractartifact) {
		
		var TruffleContract = this._getTruffleContractClass();
		
		var trufflecontract = TruffleContract(contractartifact);
	  
		trufflecontract.setProvider(this._getWeb3Provider());
		
		return trufflecontract;
	}*/
	

	_getContractInstance(abi, address) {
		/*if (this.web3_contract_instance) {
			return this.web3_contract_instance;
		}*/
		
		var self = this;
		
		var web3 = this._getWeb3Instance();

		if (this.web3_version == "1.0.x") {
			// Web3 > 1.0
			var web3_contract_instance = new web3.eth.Contract(abi, address);
		}
		else {
			// Web3 == 0.20.x
			var web3_contract_instance = web3.eth.contract(abi).at(address);
		}
		
		//this.web3_contract_instance = web3_contract_instance;
		
		return web3_contract_instance;
	}
	
	/*_encapsulateArtifact(web3_contract_artifact) {
		web3_contract_artifact.getArtifactPath = function() {
			return web3_contract_artifact['artifactpath'];
		};
		
		web3_contract_artifact.getContractName = function() {
			return web3_contract_artifact['contractName'];
		};
		
		web3_contract_artifact.getAbi = function() {
			return web3_contract_artifact['abi'];
		};
		
		web3_contract_artifact.getByteCode = function() {
			return web3_contract_artifact['bytecode'];
		};
	}*/
	
	web3_loadArtifact(artifactpath, callback) {
		var self = this;
		var session = this.session;
		var ethereumnodeaccessmodule = this.ethereumnodeaccessmodule;

		var web3_contract_artifact = [];
		
		var promise = this._loadArtifact(artifactpath, function(data) {
			
			web3_contract_artifact['artifactuuid'] = session.guid();
			web3_contract_artifact['data'] = data;
			web3_contract_artifact['artifactpath'] = artifactpath;
			web3_contract_artifact['contractName'] = data.contractName;
			web3_contract_artifact['abi'] = data.abi;
			web3_contract_artifact['bytecode'] = data.bytecode;
			
			//self._encapsulateArtifact(web3_contract_artifact);
			
			var artifactproxy = ethereumnodeaccessmodule.getArtifactProxyObject(web3_contract_artifact['artifactuuid'], web3_contract_artifact['contractName'], web3_contract_artifact['artifactpath'], web3_contract_artifact['abi'], web3_contract_artifact['bytecode']);
			artifactproxy.data = data;
			
			if (callback)
				callback(null, artifactproxy);
			
			return artifactproxy;
		});

		return promise;
	}
	
	/*_encapsulateContract(contractobject) {
		contractobject.getAbi = function() {
			return (contractobject.artifact['abi'] ? contractobject.artifact['abi'] : null);
		};

		contractobject.getByteCode = function() {
			return (contractobject.artifact['bytecode'] ? contractobject.artifact['bytecode'] : null);
		};

		contractobject.getContractName = function() {
			return (contractobject.artifact['contractName'] ? contractobject.artifact['contractName'] : null);
		};
		
	}*/
	
	web3_loadContract(artifact) {
		var session = this.session;
		var ethereumnodeaccessmodule = this.ethereumnodeaccessmodule;

		var contractobject = {};
		
		contractobject.artifact = artifact;
		contractobject.contractuuid = session.guid();
		
		//this._encapsulateContract(contractobject);
		
		var contractproxy = ethereumnodeaccessmodule.getContractProxyObject(contractobject.contractuuid, contractobject.artifact);
		
		return contractproxy;
	}
	
	_waitTransactionReceipt(transactionHash, delay, callback) {
		var self = this;

		self.web3_getTransactionReceipt(transactionHash, function(err, result) {
		    if(err) {
		        if (callback)
		        	callback('error executing getTransactionReceipt:  ' + err, null)
		    }
		    else {
		        if(result === null) {
		            setTimeout(function() {
		            	self._waitTransactionReceipt(transactionHash, delay, callback);
		            }, delay);
		        }
		        else {
					//console.log('EthereumNodeAccess._getPendingTransactionReceipt receipt is ' + JSON.stringify(result));

					if (callback)
			        	callback(null, result);
			        
			        return result;
		        }
		    }
		});
	}
	
	_getPendingTransactionReceipt(transactionHash, callback) {
		var self = this;

		return new Promise(function (resolve, reject) {
			try {
				self._waitTransactionReceipt(transactionHash, 500, function(err, res) {
					console.log('EthereumNodeAccess._getPendingTransactionReceipt callback called for ' + transactionHash);
					
					if (!err) {
						
						if (callback)
							callback(null, res);
						
						return resolve(res);
					}
					else {
						console.log('EthereumNodeAccess._getPendingTransactionReceipt error ' + JSON.stringify(err));

						if (callback)
							callback('web3 error: ' + err, null);
						
						reject('web3 error: ' + err);
					}
				
				});
			}
			catch(e) {
				reject('web3 exception: ' + e);
			}
			
		});		
	}
	
	/*_encapsulateContractInstance(web3_contract_instance) {
		var contract = web3_contract_instance['contract'];
		web3_contract_instance.getContract = function() {
			return contract;
		};
		
		var abi = contract.getAbi();
		web3_contract_instance.getAbi = function() {
			return abi;
		};
		
		var address = web3_contract_instance['address'];
		web3_contract_instance.getAddress = function() {
			return address;
		};
		
		var instance = 
		web3_contract_instance.getInstance = function() {
			return this['instance'];
		};
		
		
	}*/
	
	web3_contract_new(web3contract, params, callback) {
		var self = this;
		var session = this.session;
		var ethereumnodeaccessmodule = this.ethereumnodeaccessmodule;
		
		var web3 = this._getWeb3Instance();
		
		var web3_contract_instance = {};
		
		var abi = web3contract.getAbi();
		var bytecode = web3contract.getByteCode();
		
		web3_contract_instance['contract'] = web3contract;
		
		var ethereumtransaction = ethereumnodeaccessmodule.unstackEthereumTransactionObject(session, params);
		let args = params.slice(0,-1);

		if (!bytecode)
			throw 'no byte code, can not deploy contract';
		
		// then create a deploy transaction data
		let soliditycontract = ethereumnodeaccessmodule.getSolidityContractObject(session, abi);
		let deploy = soliditycontract.getDeployData(bytecode, args);
		
		ethereumtransaction.setData(deploy);
		
		// sending deploy transaction
		try {
			return this.web3_sendEthTransaction(ethereumtransaction, function(err, res) {
				if (!err) {
					var transactionHash = res;
					console.log('contract deployment transaction hash is ' + transactionHash);
					
					if (callback)
						callback(null, transactionHash);
					
					return transactionHash;
				}
				else {
					var error = 'error deploying contract: ' + err;
					console.log('EthereumNodeAcces.web3_contract_new error:' + error);
					
					if (callback)
						callback(error, null);
				}
				
			})
			.then(function(transactionHash) {
				return self._getPendingTransactionReceipt(transactionHash, function(err, res) {
					if (err) {
						console.log('contract deployment transaction is invalid: ' + transactionHash);
						
						if (callback)
							callback('contract deployment transaction is invalid: ' + transactionHash, null);
					}
					else {
						//console.log('contract deployment transaction receipt is: ' + JSON.stringify(res));
						return res;
					}
					
				});
			})
			.then(function(receipt) {
				if (receipt) {
					var address = receipt['contractAddress'];
					console.log('contract deployment address is ' + address);
					
					web3_contract_instance['contractinstanceuuid'] = session.guid();
					web3_contract_instance['contract'] = web3contract;
					web3_contract_instance['address'] = address;
					web3_contract_instance['instance'] = self._getContractInstance(abi, address);
					
					//self._encapsulateContractInstance(web3_contract_instance);
					var constractinstanceproxy = ethereumnodeaccessmodule.getContractInstanceProxyObject(web3_contract_instance['contractinstanceuuid'], web3_contract_instance['address'], web3_contract_instance['contract']);
					constractinstanceproxy.instance = web3_contract_instance['instance'];
					
					return constractinstanceproxy;
				}
			});
		}
		catch(e) {
			console.log('exception: ' + e);
		}
		
	}
	
	web3_abi_load_at(abi, address, callback) {
		var session = this.session;
		var ethereumnodeaccessmodule = this.ethereumnodeaccessmodule;

		// create contract object
		var contractobject = {};
		
		contractobject.artifact = {};
		
		contractobject.artifact['data'] = abi;
		contractobject.artifact['artifactpath'] = null;
		contractobject.artifact['contractName'] = null;
		contractobject.artifact['abi'] = abi;
		contractobject.artifact['bytecode'] = null;
		
		//this._encapsulateContract(contractobject);

		var artifactproxy = ethereumnodeaccessmodule.getArtifactProxyObject(session.guid(), contractobject.artifact['contractName'], contractobject.artifact['artifactpath'], contractobject.artifact['abi'], contractobject.artifact['bytecode']);
		var contractproxy = ethereumnodeaccessmodule.getContractProxyObject(session.guid(), artifactproxy);

		
		// create contract instance
		var web3_contract_instance = [];
		
		web3_contract_instance['contractinstanceuuid'] = session.guid();
		web3_contract_instance['contract'] = contractproxy;
		web3_contract_instance['address'] = address;
		web3_contract_instance['instance'] = this._getContractInstance(abi, address);
		
		//this._encapsulateContractInstance(web3_contract_instance);
		var constractinstanceproxy = ethereumnodeaccessmodule.getContractInstanceProxyObject(web3_contract_instance['contractinstanceuuid'], web3_contract_instance['address'], web3_contract_instance['contract']);
		constractinstanceproxy.instance = web3_contract_instance['instance'];

		if (callback)
			callback(null, constractinstanceproxy);
			 		
		return Promise.resolve(constractinstanceproxy);	
	}
	
	web3_contract_at(web3contract, address, callback) {
		var session = this.session;
		var ethereumnodeaccessmodule = this.ethereumnodeaccessmodule;

		var web3_contract_instance = [];
		
		var abi = web3contract.getAbi();
		
		web3_contract_instance['contractinstanceuuid'] = session.guid();
		web3_contract_instance['contract'] = web3contract;
		web3_contract_instance['address'] = address;
		web3_contract_instance['instance'] = this._getContractInstance(abi, address);
		
		//this._encapsulateContractInstance(web3_contract_instance);
		var constractinstanceproxy = ethereumnodeaccessmodule.getContractInstanceProxyObject(web3_contract_instance['contractinstanceuuid'], web3_contract_instance['address'], web3_contract_instance['contract']);
		constractinstanceproxy.instance = web3_contract_instance['instance'];
		
		if (callback)
			callback(null, constractinstanceproxy);
		
		return Promise.resolve(constractinstanceproxy);
	}
	
	_web3_contract_dynamicMethodCall(web3_contract_instance, abidef, params, callback) {
		var self = this;
		
		var instance = web3_contract_instance['instance'];
		
		var methodname = abidef.name;
		var signature = abidef.signature;
		
		if (this.web3_version == "1.0.x") {
			// Web3 > 1.0
			var funcname = instance.methods[signature];
		}
		else {
			// Web3 == 0.20.x
			var funcname = instance[methodname];
		}
		
		var promise = new Promise( function(resolve, reject) {
			
			var __funcback = function (err, res) {
				
				if (res) {
					if (callback)
						callback(null, res);
					
					return resolve(res);
				}
				else {
					var error = 'web3_contract_dynamicMethodCall did not retrieve any result';
					console.log('error: ' + error);

					if (callback)
						callback(error, null);

					return reject(null);
				}
				
				
			};
	
			if (self.web3_version == "1.0.x") {
				// Web3 > 1.0
				var ret = funcname(...params).call(__funcback)
				.catch(err => {
				    console.log('catched error in EthereumNodeAccess.web3_contract_dynamicMethodCall ' + err);
				});
				
			}
			else {
				// Web3 == 0.20.x
				// using spread operator
				var ret = funcname.call(...params, __funcback)
				/*.catch(err => {
				    console.log('catched error in EthereumNodeAccess.web3_contract_dynamicMethodCall ' + err);
				})*/;
				
			}
		
		});
		
		return promise
	}
	
	_web3_contract_dynamicSendTransaction(web3_contract_instance, abidef, params, callback) {
		var self = this;
		var session = this.session;
		var ethereumnodeaccessmodule = this.ethereumnodeaccessmodule;
		
		var web3 = this._getWeb3Instance();
		
		var abi = web3_contract_instance.getAbi()
		var instance = web3_contract_instance.getInstance();
		var contractaddress = web3_contract_instance.getAddress();
		
		var methodname = abidef.name;
		var signature = abidef.signature;

		var ethereumtransaction = ethereumnodeaccessmodule.unstackEthereumTransactionObject(session, params);
		let args = params.slice(0,-1);

		// create a call transaction data
		let soliditycontract = ethereumnodeaccessmodule.getSolidityContractObject(session, abi);
		let calldata = soliditycontract.getCallData(contractaddress, abidef, args);
		
		ethereumtransaction.setData(calldata);
		ethereumtransaction.setToAddress(contractaddress);
		
		// sending method transaction
		try {
			return this.web3_sendEthTransaction(ethereumtransaction, function(err, res) {
				if (!err) {
					var transactionHash = res;
					console.log('EthereumNodeAccess._web3_contract_dynamicSendTransaction transaction hash is ' + transactionHash);
					
					if (callback)
						callback(null, transactionHash);
					
					return transactionHash;
				}
				else {
					console.log('EthereumNodeAccess._web3_contract_dynamicSendTransaction error: ' + err);
					
					if (callback)
						callback('EthereumNodeAccess._web3_contract_dynamicSendTransaction error: ' + err, null);
				}
				
			});
		}
		catch(e) {
			console.log('exception: ' + e);
		}

	}
	
	_getMethodAbiDefinition(abi, methodname) {
		var abidef = null;
		
		if (!abi)
			return abidef;
		
		for (var i = 0; i < abi.length; i++) {
			var item = abi[i];
			var name = item.name;
			
			if (name == methodname) {
				abidef = item;
				
				break;
			}
		}
		
		return abidef;
	}
	

	
	web3_method_call(web3_contract_instance, methodname, params, callback) {
		var abi = web3_contract_instance.getAbi();
		var abidef = this._getMethodAbiDefinition(abi, methodname);
		
		return this._web3_contract_dynamicMethodCall(web3_contract_instance, abidef, params, callback);
	}
	
	web3_method_sendTransaction(web3_contract_instance, methodname, params, callback) {
		var abi = web3_contract_instance.getAbi();
		var abidef = this._getMethodAbiDefinition(abi, methodname);
		
		return this._web3_contract_dynamicSendTransaction(web3_contract_instance, abidef, params, callback);
	}
	

	//
	// Truffle
	//
	_getTruffleContractClass() {
		if (this.web3_version == "1.0.x")
			throw 'must not longer instantiate truffle';
		
		if ( typeof window !== 'undefined' && window ) {
			return TruffleContract;
		}
		else {
			return require('truffle-contract');
		}
	}
	
	_getTruffleContractObject(contractartifact) {
		
		var TruffleContract = this._getTruffleContractClass();
		
		var trufflecontract = TruffleContract(contractartifact);
	  
		trufflecontract.setProvider(this._getWeb3Provider());
		
		return trufflecontract;
	}
	
	truffle_loadArtifact(artifactpath, callback) {
		return this._loadArtifact(artifactpath, callback);

	}
	
	truffle_loadContract(artifact) {
		if (this.web3_version == "1.0.x") {
			// Web3 > 1.0
			return this.web3_loadContract(artifact);
		}
		else {
			// Web3 == 0.20.x
			return this._getTruffleContractObject(artifact);
		}
	}
	
	truffle_contract_at(trufflecontract, address) {
		if (this.web3_version == "1.0.x") {
			// Web3 > 1.0
			return this.web3_contract_at(trufflecontract, address);
		}
		else {
			// Web3 == 0.20.x
			return trufflecontract.at(address);
		}
	}

	truffle_contract_new(trufflecontract, params) {
		if (this.web3_version == "1.0.x") {
			// Web3 > 1.0
			return this.web3_contract_new(trufflecontract, params);
		}
		else {
			// Web3 == 0.20.x
			return trufflecontract.new(...params);
		}
	}

	truffle_method_call(constractinstance, methodname, params) {
		if (this.web3_version == "1.0.x") {
			// Web3 > 1.0
			return this.web3_method_call(constractinstance, methodname, params);
		}
		else {
			// Web3 == 0.20.x
			var funcname = constractinstance[methodname];
			//console.log('contractinstance ' + Object.keys(constractinstance));
			//console.log('funcname is ' + funcname);
			
			return funcname.call(...params);
		}
	}
	
	truffle_method_sendTransaction(constractinstance, methodname, params) {
		if (this.web3_version == "1.0.x") {
			// Web3 > 1.0
			return this.web3_method_sendTransaction(constractinstance, methodname, params);
		}
		else {
			// Web3 == 0.20.x
			var funcname = constractinstance[methodname];
			
			return funcname.sendTransaction(...params);
		}
	}
	
	// uuid
	guid() {
		  function s4() {
		    return Math.floor((1 + Math.random()) * 0x10000)
		      .toString(16)
		      .substring(1);
		  }
		  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
		    s4() + '-' + s4() + s4() + s4();
	}

	
}

if ( typeof window !== 'undefined' && window ) // if we are in browser and not node js (e.g. truffle)
window.EthereumNodeAccess = EthereumNodeAccess;
else
module.exports = EthereumNodeAccess; // we are in node js

GlobalClass.getGlobalObject().registerModuleObject(new Module());


