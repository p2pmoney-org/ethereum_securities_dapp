'use strict';

var ETHER_TO_WEI = 1000000000000000000;

var Module = class {
	
	constructor() {
		this.name = 'ethnode';
		
		this.global = null; // put by global on registration
		this.isready = false;
		this.isloading = false;
		
		// web3
		this.web3providerurl = null; // default provider url
		//this.web3instance = null;
		
		// ethereum node access
		//this.ethereum_node_access_instance = null;
		
		// operating
		//this.web3instance = null;
		
		this.controllers = null;
		
		this.transactionmap = Object.create(null); // use a simple object to implement the map

		// payer
		this.defaultgaslimit = null;
		this.defaultgasprice = null;
		
		this.walletaccountaddress = null;
		this.needtounlockaccounts = null;
		
	}
	
	init() {
		console.log('module init called for ' + this.name);
		
		this.isready = true;
		
		
		// web3
		var web3providerurl = this.global.globalscope.simplestore.Config.getWeb3ProviderUrl();
		
		this.setWeb3ProviderUrl(web3providerurl);
		
		// config
		/*this.session.setWalletAccountAddress(this.getWalletAccountAddress());
		this.session.setNeedToUnlockAccounts(this.needToUnlockAccounts());*/
	}
	
	loadModule(parentscriptloader, callback) {
		console.log('loadModule called for module ' + this.name);

		if (this.isloading)
			return;
			
		this.isloading = true;

		var self = this;
		var global = this.global;

		// ethnode
		var modulescriptloader = global.getScriptLoader('ethnodeloader', parentscriptloader);
		
		var moduleroot = './js/src/xtra/modules/ethnode';

		modulescriptloader.push_script( moduleroot + '/control/controllers.js');

		modulescriptloader.push_script( moduleroot + '/model/contracts.js');
		modulescriptloader.push_script( moduleroot + '/model/contractinstance.js');
		modulescriptloader.push_script( moduleroot + '/model/transaction.js');
		modulescriptloader.push_script( moduleroot + '/model/web3provider.js');
		
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
	registerHooks() {
		console.log('module registerHooks called for ' + this.name);
		
		var global = this.global;
		
		global.registerHook('getContractsObject_hook', 'ethnode', this.getContractsObject_hook);
		global.registerHook('cleanSessionContext_hook', 'ethnode', this.cleanSessionContext_hook);
	}
	
	getContractsObject_hook(result, params) {
		console.log('getContractsObject_hook called for ' + this.name);
		
		var global = this.global;
		var self = this;
		
		var session = params[0];
		
		var nextget = result.get;
		result.get = function(err, jsonarray) {
			var keys = ['common','contracts'];
			
			var localstorageobject = session.getLocalStorageObject();
			
			localstorageobject.readLocalJson(keys, true, function(err, myjsonarray) {
				var newjsonarray = (myjsonarray && (myjsonarray.length > 0) ? jsonarray.concat(myjsonarray) : jsonarray);
				
				if (!err) {
					if (nextget)
						nextget(null, newjsonarray);
				}
				else {
					if (nextget)
						nextget(err, null);
				}
			});
			
			
		}; // chaining of get function

		result.push({module: 'common', handled: true});
		
		return true;
	}
	
	cleanSessionContext_hook(result, params) {
		console.log('cleanSessionContext_hook called for ' + this.name);
		
		var global = this.global;
		var self = this;
		
		var session = params[0];
		
		// we flush the list of contracts
		if (session && (session.contracts)) {
			session.contracts.flushContractObjects();
		}	
	}
	

	//
	// control
	//
	
	getControllersObject() {
		if (this.controllers)
			return this.controllers;
		
		this.controllers = new this.Controllers(this);
		
		return this.controllers;
	}

	//
	// model
	//
	
	// web 3
	getWeb3ProviderUrl(session) {
		if ((session) && (session.web3providerurl))
			return session.web3providerurl; // return session's value
		
		var web3providerurl = this.web3providerurl; // return Config value as default
		
		return web3providerurl;
	}
	
	setWeb3ProviderUrl(url, session, callback) {
		var global = this.global;

		if (session) {
			// set for this session only
			session.web3providerurl = url;
			var ethereumnodeaccessmodule = global.getModuleObject('ethereum-node-access');
			
			ethereumnodeaccessmodule.clearEthereumNodeAccessInstance(session);
			
			if (callback) {
				// if callback provided, we make sure to initialize ethereumnodeaccessinstance
				// with the new url to avoid concurrency problems
				var ethereumnodeaccessinstance = this.getEthereumNodeAccessInstance(session);
				
				ethereumnodeaccessinstance.web3_setProviderUrl(url, (err, res) => {
					var key = url.toLowerCase();
					
					if (!session.web3providermap[key]) {
						// put instance in the map
						var web3provider = new this.Web3Provider(session, web3providerurl, ethereumnodeaccessinstance);
						
						session.web3providermap[key] = web3provider;
					}
					
					callback(null, url);
				})
				.catch(err => {
					console.log('promise rejection in Module.setWeb3ProviderUrl: ' + err);
					
					if (callback)
						callback(err, null);
				});
			}
		}
		else {
			this.web3providerurl = url;
			
			if (callback)
				callback(null, url);
		}
	}
	
	getDefaultGasLimit(session) {
		if (session && session.defaultgaslimit)
			return session.defaultgaslimit;
		
		if (this.defaultgaslimit)
			return this.defaultgaslimit;
		
		this.defaultgaslimit = this.global.globalscope.simplestore.Config.getDefaultGasLimit();
		
		return this.defaultgaslimit;
	}
	
	setDefaultGasLimit(gaslimit, session) {
		if (session) {
			session.defaultgaslimit = gaslimit;
		}
		else {
			this.defaultgaslimit = gaslimit;
		}
	}

	
	getDefaultGasPrice(session) {
		if (session && session.defaultgasprice)
			return session.defaultgasprice;
			
		if (this.defaultgasprice)
			return this.defaultgasprice;
		
		this.defaultgasprice = this.global.globalscope.simplestore.Config.getDefaultGasPrice();
		
		return this.defaultgasprice;
	}
	
	setDefaultGasPrice(gasprice, session) {
		if (session) {
			session.defaultgasprice = gasprice;
		}
		else {
			this.defaultgasprice = gasprice;
		}
	}
	
	// instances of interfaces
	getEthereumNodeAccessInstance(session, web3providerurl) {
		var global = this.global;
		
		var SessionClass = (typeof Session !== 'undefined' ? Session : global.getModuleObject('common').Session);
		if (session instanceof SessionClass !== true)
			throw 'must pass a session object as first parameter!';
		
		var global = session.getGlobalObject();
		
		var ethereumnodeaccessmodule = global.getModuleObject('ethereum-node-access');
		
		if (!web3providerurl)
		return ethereumnodeaccessmodule.getEthereumNodeAccessInstance(session); // returns default
		
		// look in session map
		if (!session.web3providermap)
			session.web3providermap = Object.create(null); // create alternate providers map if do not exist
		

		var key = web3providerurl.toLowerCase();
		
		if (session.web3providermap[key])
			return session.web3providermap[key].getEthereumNodeAccessInstance();
		
		// create a ethereum node access with the correct url
		var ethereumnodeaccessinstance = ethereumnodeaccessmodule.createBlankEthereumNodeAccessInstance(session);
		
		ethereumnodeaccessinstance.web3_setProviderUrl(web3providerurl);
		
		// then create and store the provider
		var web3provider = new this.Web3Provider(session, web3providerurl, ethereumnodeaccessinstance);
		
		session.web3providermap[key] = web3provider;
		
		return web3provider.getEthereumNodeAccessInstance();
	}
	
	
	// accounts
	needToUnlockAccounts() {
		if ((typeof this.needtounlockaccounts !== 'undefined') && (this.needtounlockaccounts != null))
			return this.needtounlockaccounts;
		
		var needtounlockaccounts = this.global.globalscope.simplestore.Config.needToUnlockAccounts();
		
		this.needtounlockaccounts = needtounlockaccounts;
		
		return this.needtounlockaccounts;
	}
	
	setNeedToUnlockAccounts(choice) {
		this.needtounlockaccounts = choice;
	}
	
	unlockAccount(session, account, password, duration, callback) {
		var global = this.global;
		
		var SessionClass = (typeof Session !== 'undefined' ? Session : global.getModuleObject('common').Session);
		if (session instanceof SessionClass !== true)
			throw 'must pass a session object as first parameter!';
		
		var global = session.getGlobalObject();
		var ethnodemodule = global.getModuleObject('ethnode');
		
		if (ethnodemodule.needToUnlockAccounts() === false) {
			
			if (callback)
				callback(null, true);
			
			return Promise.resolve(true);
		}
		
		account.lastunlock = Date.now()/1000; // in seconds
		account.lastunlockduration = duration;
		
		console.log('Account.unlock called for ' + duration + ' seconds ');
		
		// call interface to unlock
		var EthereumNodeAccess = ethnodemodule.getEthereumNodeAccessInstance(session);
		
		return EthereumNodeAccess.web3_unlockAccount(account, password, duration, callback);
	}
	
	lockAccount(session, account, callback) {
		var global = this.global;
		
		var SessionClass = (typeof Session !== 'undefined' ? Session : global.getModuleObject('common').Session);
		if (session instanceof SessionClass !== true)
			throw 'must pass a session object as first parameter!';
		
		var global = session.getGlobalObject();
		
		var ethnodemodule = global.getModuleObject('ethnode');
		
		if (ethnodemodule.needToUnlockAccounts() === false) {
			
			if (callback)
				callback(null, true);
			
			return Promise.resolve(true);
		}
		
		// call interface to lock
		account.lastunlock = null; // unix time
		account.lastunlockduration = null;
		
		var EthereumNodeAccess = ethnodemodule.getEthereumNodeAccessInstance(session);
		
		return EthereumNodeAccess.web3_lockAccount(account, callback);
	}
	
	isAccountLocked(session, account) {
		var global = this.global;
		
		var SessionClass = (typeof Session !== 'undefined' ? Session : global.getModuleObject('common').Session);
		if (session instanceof SessionClass !== true)
			throw 'must pass a session object as first parameter!';
		
		var global = session.getGlobalObject();
		
		var ethnodemodule = global.getModuleObject('ethnode');
		
		if (ethnodemodule.needToUnlockAccounts() === false) 
			return false;
		
		if (account.lastunlock == null)
			return true;
		
		var now = Date.now()/1000; // in seconds
		
		if (now - account.lastunlock > account.lastunlockduration - 1) {
			this.lockAccount(account);
			
			return true;
		}
	}
	
	getAccountBalance(session, account) {
		var global = this.global;
		
		var SessionClass = (typeof Session !== 'undefined' ? Session : global.getModuleObject('common').Session);
		if (session instanceof SessionClass !== true)
			throw 'must pass a session object as first parameter!';
		
		var global = session.getGlobalObject();
		
		var ethnodemodule = global.getModuleObject('ethnode');
		
		var EthereumNodeAccess = ethnodemodule.getEthereumNodeAccessInstance(session);
		
		var accountaddress = account.getAddress();
		
		return EthereumNodeAccess.web3_getBalance(this.accountaddress);
	}
	
	// chain async (on default provider)
	getChainAccountBalance(session, account, callback) {
		var global = this.global;
		
		var SessionClass = (typeof Session !== 'undefined' ? Session : global.getModuleObject('common').Session);
		if (session instanceof SessionClass !== true)
			throw 'must pass a session object as first parameter!';
		
		var global = session.getGlobalObject();
		
		var ethnodemodule = global.getModuleObject('ethnode');

		var EthereumNodeAccess = ethnodemodule.getEthereumNodeAccessInstance(session);
		
		var accountaddress = account.getAddress();

		return EthereumNodeAccess.web3_getBalance(accountaddress, callback);
	}
	
	transferAmount(session, fromaccount, toaccount, amount, gas, gasPrice, transactionuuid, callback) {
		console.log('Account.transferAmount called for amount ' + amount + ' to ' + (toaccount ? toaccount.getAddress() : null) + ' with transactionuuid ' + transactionuuid);
		
		var global = this.global;
		
		var SessionClass = (typeof Session !== 'undefined' ? Session : global.getModuleObject('common').Session);
		if (session instanceof SessionClass !== true)
			throw 'must pass a session object as first parameter!';
		
		var global = session.getGlobalObject();
		
		var ethnodemodule = global.getModuleObject('ethnode');
		
		var ethereumnodeaccessmodule = global.getModuleObject('ethereum-node-access');
		
		var ethereumtransaction =  ethereumnodeaccessmodule.getEthereumTransactionObject(session, fromaccount);
		
		var toaddress = (toaccount ? toaccount.getAddress() : null);
		
		ethereumtransaction.setToAddress(toaddress);
		ethereumtransaction.setValue(amount);
		ethereumtransaction.setGas(gas);
		ethereumtransaction.setGasPrice(gasPrice);
		
		ethereumtransaction.setTransactionUUID(transactionuuid);

		var EthereumNodeAccess = ethnodemodule.getEthereumNodeAccessInstance(session); // default
		
		// set provider url in transaction (to avoid warning in logs)
		var web3providerurl = EthereumNodeAccess.web3_getProviderUrl();
		ethereumtransaction.setWeb3ProviderUrl(web3providerurl);
		
		
		return EthereumNodeAccess.web3_sendEthTransaction(ethereumtransaction, callback);
		
		/*var txdata = null;
		var nonce = null;
		
		return EthereumNodeAccess.web3_sendTransaction(this, toaccount, amount, gas, gasPrice, txdata, nonce, callback);*/
	}
	
	// chain async (on alternate provider)
	getAltChainAccountBalance(session, account, web3providerurl, callback) {
		var global = this.global;
		
		var SessionClass = (typeof Session !== 'undefined' ? Session : global.getModuleObject('common').Session);
		if (session instanceof SessionClass !== true)
			throw 'must pass a session object as first parameter!';
		
		var global = session.getGlobalObject();
		
		var ethnodemodule = global.getModuleObject('ethnode');

		var EthereumNodeAccess = ethnodemodule.getEthereumNodeAccessInstance(session, web3providerurl);
		
		var accountaddress = account.getAddress();

		return EthereumNodeAccess.web3_getBalance(accountaddress, callback);
	}
	

	
	// wallet
	useWalletAccount() {
		var wallletaccount = this.global.globalscope.simplestore.Config.getWalletAccountAddress();
		
		if (wallletaccount)
			return true;
		else
			return false;
	}
	
	getWalletAccountAddress(session) {
		if (session && session.walletaccountaddress)
			return session.walletaccountaddress;
		
		if ((typeof this.walletaccountaddress !== 'undefined') && (this.walletaccountaddress != null))
			return this.walletaccountaddress;
		
		var walletaccountaddress = this.global.globalscope.simplestore.Config.getWalletAccountAddress();
		
		this.walletaccountaddress = walletaccountaddress;

		
		return this.walletaccountaddress;
	}
	
	setWalletAccountAddress(address, session) {
		if (session) {
			session.walletaccountaddress = address;
		}
		else {
			this.walletaccountaddress = address;
		}
	}
	
	useWalletAccountChallenge() {
		var walletaccountchallenge = this.global.globalscope.simplestore.Config.useWalletAccountChallenge();
		
		return walletaccountchallenge;
	}
	
	getWalletAccountObject(session) {
		var global = this.global;
		
		var SessionClass = (typeof Session !== 'undefined' ? Session : global.getModuleObject('common').Session);
		if (session instanceof SessionClass !== true)
			throw 'must pass a session object as first parameter!';
		
		var global = session.getGlobalObject();
		
		var address = this.getWalletAccountAddress(session);
		
		if (address) {
			var global = this.global;
			var commonmodule = global.getModuleObject('common');
			
			var walletaccount = commonmodule.getAccountObject(session, address);
			
			walletaccount.setDescription(global.t('default wallet'));
			walletaccount.setOrigin({storage: 'configuration'});
			
			return walletaccount;
		}
	}

	
	// contracts
	getContractsObject(session, bForceRefresh, callback) {
		var global = this.global;
		
		var SessionClass = (typeof Session !== 'undefined' ? Session : global.getModuleObject('common').Session);
		if (session instanceof SessionClass !== true)
			throw 'must pass a session object as first parameter!';
		
		var global = session.getGlobalObject();
		
		if ((session.contracts) 
				&& (!bForceRefresh) 
				&& (bForceRefresh != true)) {
			
			if (callback)
				callback(null, session.contracts);
			
			return session.contracts;
		}
		
		var self = this;
		
		if (session.contracts) {
			session.contracts.flushContractObjects();
		}
		else {
			session.contracts = new this.Contracts(session);
		}
		
		// invoke hook to build processing chain
		var result = [];
		
		var params = [];
		
		params.push(session);
		
		result.get = function(err, jsonarray) {
			if (!err) {
				session.contracts.initContractObjects(jsonarray);
				
				if (callback)
					callback(null, session.contracts);
			}
			else {
				if (callback)
					callback(err, session.contracts);
			}
		};

		var ret = global.invokeHooks('getContractsObject_hook', result, params);
		
		if (ret && result && result.length) {
			global.log('getContractsObject_hook result is ' + JSON.stringify(result));
		}
		
		
		// process after hooks chained the get functions
		var jsonarray = [];
		
		result.get(null, jsonarray);

		
		return session.contracts;
	}
	
	saveContractObjects(session, contracts, callback) {
		var json = contracts.getContractObjectsJson();
		console.log("Session.saveContractObjects: contracts json is " + JSON.stringify(json));
		
		var global = this.global;
		var self = this;
		
		var SessionClass = (typeof Session !== 'undefined' ? Session : global.getModuleObject('common').Session);
		if (session instanceof SessionClass !== true)
			throw 'must pass a session object as first parameter!';
		
		var global = session.getGlobalObject();
		
		var keys = ['common','contracts'];

		var localstorageobject = session.getLocalStorageObject();
		
		localstorageobject.saveLocalJson(keys, json, function(err, jsonarray) {
			if (!err) {
				// re-initialize contract list (that can have been refreshed from previous states)
				// with the saved version
				if (session.contracts) {
					session.contracts.initContractObjects(jsonarray);
				}
			}
			
			if (callback)
				callback(null, session.contracts);
			
			return session.contracts;
		});
	}

	// contract instance
	getContractInstance(session, contractaddress, contractartifact, web3providerurl) {
		var global = this.global;
		
		var SessionClass = (typeof Session !== 'undefined' ? Session : global.getModuleObject('common').Session);
		if (session instanceof SessionClass !== true)
			throw 'must pass a session object as first parameter!';
		
		var global = session.getGlobalObject();
		
		var contractinstance = new this.ContractInstance(session, contractaddress, contractartifact, web3providerurl);
		
		return contractinstance;
	}
	
	// transactions
	getTransactionObject(session, transactionuuid) {
		var global = this.global;
		
		var SessionClass = (typeof Session !== 'undefined' ? Session : global.getModuleObject('common').Session);
		if (session instanceof SessionClass !== true)
			throw 'must pass a session object as first parameter!';
		
		var global = session.getGlobalObject();
		
		var transaction = new this.Transaction(session, transactionuuid);
		
		if (transactionuuid in this.transactionmap)  {
			transaction.setHash(this.transactionmap[transactionuuid]);
		}
		
		return transaction;
	}
	
	getTransactionList(session, callback) {
		var global = this.global;
		
		var SessionClass = (typeof Session !== 'undefined' ? Session : global.getModuleObject('common').Session);
		if (session instanceof SessionClass !== true)
			throw 'must pass a session object as first parameter!';
		
		var global = session.getGlobalObject();
		
		var EthereumNodeAccess = this.getEthereumNodeAccessInstance(session);
		
		return EthereumNodeAccess.web3_getTransactionList(callback);
	}
	
	// ether
	static getWeiFromEther(numofether) {
		var wei = numofether * ETHER_TO_WEI;

		return wei;
	}
	
	getEtherFromwei(numofwei) {
		var ether = numofwei / ETHER_TO_WEI;

		return ether;
	}
}

if ( typeof GlobalClass !== 'undefined' && GlobalClass ) {
	GlobalClass.getGlobalObject().registerModuleObject(new Module());
	
	GlobalClass.getGlobalObject().registerModuleDepency('ethnode', 'common');
}
else if (typeof window !== 'undefined') {
	let _GlobalClass = ( window && window.simplestore && window.simplestore.Global ? window.simplestore.Global : null);
	
	_GlobalClass.getGlobalObject().registerModuleObject(new Module());
	
	// dependencies
	_GlobalClass.getGlobalObject().registerModuleDepency('ethnode', 'common');
}
else if (typeof global !== 'undefined') {
	// we are in node js
	let _GlobalClass = ( global && global.simplestore && global.simplestore.Global ? global.simplestore.Global : null);
	
	_GlobalClass.getGlobalObject().registerModuleObject(new Module());
	
	// dependencies
	_GlobalClass.getGlobalObject().registerModuleDepency('ethnode', 'common');
}


