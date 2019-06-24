'use strict';

var ETHER_TO_WEI = 1000000000000000000;

var Module = class {
	
	constructor() {
		this.name = 'ethnode';
		
		this.global = null; // put by global on registration
		this.isready = false;
		this.isloading = false;
		
		// web3
		this.web3providerurl = null;
		//this.web3instance = null;
		
		// ethereum node access
		this.ethereum_node_access_instance = null;
		
		// operating
		this.web3instance = null;
		
		this.controllers = null;
		
		
		this.transactionmap = Object.create(null); // use a simple object to implement the map

		// payer
		this.walletaccountaddress = null;
		this.needtounlockaccounts = null;
		
	}
	
	init() {
		console.log('module init called for ' + this.name);
		
		this.isready = true;
		
		
		// web3
		var web3providerurl = this.global.globalscope.Config.getWeb3ProviderUrl();
		
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
		if (this.contracts) {
			this.contracts.flushContractObjects();
		}	
	}
	

	// session
	getSessionObject() {
		var global = this.global;
		var commonmodule = global.getModuleObject('common');
		
		return commonmodule.getSessionObject();
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
	getWeb3ProviderUrl() {
		return this.web3providerurl;
	}
	
	setWeb3ProviderUrl(url) {
		this.web3providerurl = url;
	}
	/*getWeb3ProviderUrl() {
	return this.global.globalscope.Config.getWeb3ProviderUrl();
	}*/
	
	getDefaultGasLimit() {
		var defaultlimit = this.global.globalscope.Config.getDefaultGasLimit();
		
		return defaultlimit;
	}
	
	getDefaultGasPrice() {
		var defaultprice = this.global.globalscope.Config.getDefaultGasPrice();
		
		return defaultprice;
	}
	
	// instances of interfaces
	getEthereumNodeAccessInstance() {
		var global = this.global;
		var session = this.getSessionObject();
		var ethereumnodeaccessmodule = global.getModuleObject('ethereum-node-access');
		
		return ethereumnodeaccessmodule.getEthereumNodeAccessInstance(session);
	}
	
	
	// accounts
	needToUnlockAccounts() {
		if ((typeof this.needtounlockaccounts !== 'undefined') && (this.needtounlockaccounts != null))
			return this.needtounlockaccounts;
		
		var needtounlockaccounts = this.global.globalscope.Config.needToUnlockAccounts();
		
		this.needtounlockaccounts = needtounlockaccounts;
		
		return this.needtounlockaccounts;
	}
	
	setNeedToUnlockAccounts(choice) {
		this.needtounlockaccounts = choice;
	}
	
	unlockAccount(account, password, duration, callback) {
		var session = this.getSessionObject();
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
		var EthereumNodeAccess = ethnodemodule.getEthereumNodeAccessInstance();
		
		return EthereumNodeAccess.web3_unlockAccount(account, password, duration, callback);
	}
	
	lockAccount(account, callback) {
		var session = this.getSessionObject();
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
		
		var EthereumNodeAccess = ethnodemodule.getEthereumNodeAccessInstance();
		
		return EthereumNodeAccess.web3_lockAccount(account, callback);
	}
	
	isAccountLocked(account) {
		var session = this.getSessionObject();
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
	
	getAccountBalance(account) {
		var session = this.getSessionObject();
		var global = session.getGlobalObject();
		var ethnodemodule = global.getModuleObject('ethnode');
		
		var EthereumNodeAccess = ethnodemodule.getEthereumNodeAccessInstance();
		
		var accountaddress = account.getAddress();
		
		return EthereumNodeAccess.web3_getBalance(this.accountaddress);
	}
	
	// chain async
	getChainAccountBalance(account, callback) {
		var session = this.getSessionObject();
		var global = session.getGlobalObject();
		var ethnodemodule = global.getModuleObject('ethnode');

		var EthereumNodeAccess = ethnodemodule.getEthereumNodeAccessInstance();
		
		var accountaddress = account.getAddress();

		return EthereumNodeAccess.web3_getBalance(accountaddress, callback);
	}
	
	transferAmount(fromaccount, toaccount, amount, gas, gasPrice, transactionuuid, callback) {
		console.log('Account.transferAmount called for amount ' + amount + ' to ' + (toaccount ? toaccount.getAddress() : null) + ' with transactionuuid ' + transactionuuid);
		
		var session = this.getSessionObject();
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

		
		var EthereumNodeAccess = ethnodemodule.getEthereumNodeAccessInstance();
		
		
		return EthereumNodeAccess.web3_sendEthTransaction(ethereumtransaction, callback);
		
		/*var txdata = null;
		var nonce = null;
		
		return EthereumNodeAccess.web3_sendTransaction(this, toaccount, amount, gas, gasPrice, txdata, nonce, callback);*/
	}
	
	// wallet
	useWalletAccount() {
		var wallletaccount = this.global.globalscope.Config.getWalletAccountAddress();
		
		if (wallletaccount)
			return true;
		else
			return false;
	}
	
	getWalletAccountAddress() {
		if ((typeof this.walletaccountaddress !== 'undefined') && (this.walletaccountaddress != null))
			return this.walletaccountaddress;
		
		var walletaccountaddress = this.global.globalscope.Config.getWalletAccountAddress();
		
		this.walletaccountaddress = walletaccountaddress;

		
		return this.walletaccountaddress;
	}
	
	setWalletAccountAddress(address) {
		this.walletaccountaddress = address;
	}
	
	useWalletAccountChallenge() {
		var walletaccountchallenge = this.global.globalscope.Config.useWalletAccountChallenge();
		
		return walletaccountchallenge;
	}
	
	getWalletAccountObject() {
		var address = this.getWalletAccountAddress();
		
		if (address) {
			var global = this.global;
			var commonmodule = global.getModuleObject('common');
			
			return commonmodule.getAccountObject(address);
		}
	}

	
	// contracts
	getContractsObject(bForceRefresh, callback) {
		if ((this.contracts) && (!bForceRefresh) && (bForceRefresh != true)) {
			
			if (callback)
				callback(null, this.contracts);
			
			return this.contracts;
		}
		
		var global = this.global;
		var session = this.getSessionObject();
		var self = this;
		
		if (this.contracts) {
			this.contracts.flushContractObjects();
		}
		else {
			this.contracts = new this.Contracts(session);
		}
		
		// invoke hook to build processing chain
		var result = [];
		
		var params = [];
		
		params.push(session);
		
		result.get = function(err, jsonarray) {
			if (!err) {
				self.contracts.initContractObjects(jsonarray);
				
				if (callback)
					callback(null, self.contracts);
			}
			else {
				if (callback)
					callback(err, self.contracts);
			}
		};

		var ret = global.invokeHooks('getContractsObject_hook', result, params);
		
		if (ret && result && result.length) {
			global.log('getContractsObject_hook result is ' + JSON.stringify(result));
		}
		
		
		// process after hooks chained the get functions
		var jsonarray = [];
		
		result.get(null, jsonarray);

		
		return this.contracts;
	}
	
	saveContractObjects(contracts, callback) {
		var json = contracts.getContractObjectsJson();
		console.log("Session.saveContractObjects: contracts json is " + JSON.stringify(json));
		
		var global = this.global;
		var self = this;
		
		var session = this.getSessionObject();
		
		var keys = ['common','contracts'];

		var localstorageobject = session.getLocalStorageObject();
		
		localstorageobject.saveLocalJson(keys, json, function(err, jsonarray) {
			if (!err) {
				// re-initialize contract list (that can have been refreshed from previous states)
				// with the saved version
				if (self.contracts) {
					self.contracts.initContractObjects(jsonarray);
				}
			}
			
			if (callback)
				callback(null, self.contracts);
			
			return self.contracts;
		});
	}

	// contract instance
	getContractInstance(contractaddress, contractartifact) {
		var session = this.getSessionObject();
		var contractinstance = new this.ContractInstance(session, contractaddress, contractartifact);
		
		return contractinstance;
	}
	
	// transactions
	getTransactionObject(transactionuuid) {
		var session = this.getSessionObject();;
		
		var transaction = new this.Transaction(session, transactionuuid);
		
		if (transactionuuid in this.transactionmap)  {
			transaction.setHash(this.transactionmap[transactionuuid]);
		}
		
		return transaction;
	}
	
	getTransactionList(callback) {
		var session = this.getSessionObject();
		var EthereumNodeAccess = this.getEthereumNodeAccessInstance();
		
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

GlobalClass.getGlobalObject().registerModuleObject(new Module());

// dependencies
GlobalClass.getGlobalObject().registerModuleDepency('ethnode', 'common');