'use strict';

var Module = class {
	
	constructor() {
		this.name = 'ethereum-node-access';
		
		this.global = null; // put by global on registration
		this.isready = false;
		this.isloading = false;
		
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

		var moduleroot = './includes/lib';

		modulescriptloader.push_script( moduleroot + '/web3-0.20.3.js');
		modulescriptloader.push_script( moduleroot + '/truffle-contract-1.1.11.js');

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
		if (this.ethereum_node_access_instance)
			return this.ethereum_node_access_instance;
		
		console.log('instantiating EthereumNodeAccess');
		
		var global = this.global;

		var result = []; 
		var inputparams = [];
		
		inputparams.push(session);
		
		var ret = global.invokeHooks('getEthereumNodeAccessInstance_hook', result, inputparams);
		
		if (ret && result[0]) {
			this.ethereum_node_access_instance = result[0];
		}
		else {
			this.ethereum_node_access_instance = new EthereumNodeAccess(session);
		}

		
		return this.ethereum_node_access_instance;
	}
	
}

class EthereumNodeAccess {
	constructor(session) {
		this.session = session;
		
		this.web3providerurl = null;
		this.web3instance = null;
	}
	
	//
	// Web3
	//
	_getWeb3Class() {
		if ( typeof window !== 'undefined' && window ) {
			return Web3;
		}
		else {
			return require('web3');
		}
	}
	
	_getWeb3Provider() {
		var Web3 = this._getWeb3Class();

		var web3providerurl = this.session.getWeb3ProviderUrl();
		var web3Provider = new Web3.providers.HttpProvider(web3providerurl);

		return web3Provider;
	}
	
	_getWeb3Instance() {
		if (this.web3instance)
			return this.web3instance;
		
		var Web3 = this._getWeb3Class();
		var web3Provider = this._getWeb3Provider();
		  
		this.web3instance = new Web3(web3Provider);		
		
		console.log("web3 instance created");
		
		return this.web3instance;
	}
	
	
	// node
	web3_isSyncing(callback) {
		var self = this
		var session = this.session;

		var promise = new Promise(function (resolve, reject) {
			try {
				var web3 = self._getWeb3Instance();
				
				return web3.eth.isSyncing( function(err, res) {
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
				reject('web3 exception: ' + e);
			}
			
		});
		
		return promise
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
				reject('web3 exception: ' + e);
			}
			
		});
		
		return promise;
	}
	
	web3_unlockAccount(account, password, duration) {
		var web3 = this._getWeb3Instance();
		var address = account.getAddress();
		
		var res = web3.personal.unlockAccount(address, password, duration);
		
		return res;
		
	}
	
	web3_lockAccount(account) {
		var web3 = this._getWeb3Instance();
		var address = account.getAddress();
		
		web3.personal.lockAccount(address);
		
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
				reject('web3 exception: ' + e);
			}
			
		});
		
		return promise;
	}
	
	// transactions
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
				reject('web3 exception: ' + e);
			}
			
		});
		
		return promise
	}
	
	// contracts
	_getContractInstance(abi, address) {
		if (this.web3_contract_instance) {
			return this.web3_contract_instance;
		}
		
		var self = this;
		
		var web3 = this._getWeb3Instance();

		// Web3 < 1.0
		var web3_contract_instance = web3.eth.contract(abi).at(address);
		// Web3 > 1.0
		//var web3_contract_instance = new web3.eth.Contract(abi, address);
		
		this.web3_contract_instance = web3_contract_instance;
		
		return web3_contract_instance;
	}
	
	web3_contract_load_at(abi, address, callback) {
		var web3_contract = [];
		
		web3_contract['abi'] = abi;
		web3_contract['address'] = address;
		web3_contract['instance'] = this._getContractInstance(abi, address);
		
		if (callback)
			callback(null, web3_contract);
		
		return Promise.resolve(web3_contract);
	}
	
	web3_contract_dynamicMethodCall(web3_contract, abidef, params, callback) {
		var instance = web3_contract['instance'];
		
		var methodname = abidef.name;
		var signature = abidef.signature;
		
		var promise = new Promise( function(resolve, reject) {
	
			// Web3 < 1.0
			var ret = instance[methodname].call(...params, function (err, res) {
				if (!res) {
					if (callback)
						callback('dynamic call returned null', null);
					
					return reject(null);
				}
				
				if (callback)
					callback(null, res);
				
				return resolve(res);
				
			});
			
			
			// Web3 > 1.0
			// using spread operator
			/*return instance.methods[signature](...params).call(function(err, res) {
				if (err) {
					if (callback)
						callback(err, null);
					
					return reject(null);
				}
				
				if (callback)
					callback(null, res);
				
				return resolve(res);
			});*/
		
		});
		
		return promise
	}
	
	
	//
	// Truffle
	//
	_getTruffleContractClass() {
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
		return this.session.loadArtifact(artifactpath, callback);

	}
	
	truffle_loadContract(artifact) {
		return this._getTruffleContractObject(artifact);
	}
	
	truffle_contract_at(trufflecontract, address) {
		return trufflecontract.at(address);
	}

	truffle_contract_new(trufflecontract, params) {
		return trufflecontract.new(...params);
	}

	truffle_method_call(constractinstance, methodname, params) {
		var funcname = constractinstance[methodname];
		//console.log('contractinstance ' + Object.keys(constractinstance));
		//console.log('funcname is ' + funcname);
		
		return funcname.call(...params);
	}
	
	truffle_method_sendTransaction(constractinstance, methodname, params) {
		var funcname = constractinstance[methodname];
		
		return funcname.sendTransaction(...params);
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


