'use strict';

var ETHER_TO_WEI = 1000000000000000000;

var Module = class {
	constructor() {
		this.name = 'common';
		
		this.global = null; // put by global on registration
		this.isready = false;
		this.isloading = false;
		
		// control
		this.controllers = null;
		
		// model
		this.session = null;
	}
	
	init() {
		console.log('module init called for ' + this.name);
		
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

		var modulescriptloader = global.getScriptLoader('commonmoduleloader', parentscriptloader);
		
		var moduleroot = './includes/modules/common';

		modulescriptloader.push_script( moduleroot + '/control/controllers.js');

		modulescriptloader.push_script( moduleroot + '/model/localstorage.js');
		modulescriptloader.push_script( moduleroot + '/model/restconnection.js');
		modulescriptloader.push_script( moduleroot + '/model/contracts.js');
		modulescriptloader.push_script( moduleroot + '/model/contractinstance.js');
		modulescriptloader.push_script( moduleroot + '/model/cryptokey.js');
		modulescriptloader.push_script( moduleroot + '/model/account.js');
		modulescriptloader.push_script( moduleroot + '/model/transaction.js');
		modulescriptloader.push_script( moduleroot + '/model/user.js');
		modulescriptloader.push_script( moduleroot + '/model/session.js'); // should be last

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
		
		global.registerHook('getContractsObject_hook', 'common', this.getContractsObject_hook);
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
	
	// web3
	getWeb3ProviderUrl() {
		return this.global.globalscope.Config.getWeb3ProviderUrl();
	}
	
	getDefaultGasLimit() {
		return this.global.globalscope.Config.getDefaultGasLimit();
	}
	
	getDefaultGasPrice() {
		return this.global.globalscope.Config.getDefaultGasPrice();
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
		return this.global.globalscope.Config.getWalletAccountAddress();
	}
	
	useWalletAccountChallenge() {
		return this.global.globalscope.Config.useWalletAccountChallenge();
	}
	
	needToUnlockAccounts() {
		return this.global.globalscope.Config.needToUnlockAccounts();
	}
	
	// local persistence (as opposed to chain persistence)
	// from cache
	readLocalJson(session, keys) {
		var commonkeys = ['common'];
		
		var _keys = commonkeys.concat(keys);
		
		var localstorage = session.getLocalStorageObject();

		var json = localstorage.readLocalJson(_keys);
		
		return json;
	}
	
	getLocalJsonLeaf(session, keys, uuid, uuidfieldname) {
		var commonkeys = ['common'];
		
		var _keys = commonkeys.concat(keys);
		
		var localstorage = this.session.getLocalStorageObject();
		return localstorage.getLocalJsonLeaf(_keys, uuid, uuidfieldname);
	}
	
	updateLocalJsonLeaf(session, keys, uuid, json, uuidfieldname) {
		var commonkeys = ['common'];
		
		var _keys = commonkeys.concat(keys);

		var localstorage = this.session.getLocalStorageObject();
		return localstorage.updateLocalJsonLeaf(_keys, uuid, json, uuidfieldname);
	}
	
	insertLocalJsonLeaf(session, keys, parentuuid, collectionname, json, uuidfieldname) {
		var commonkeys = ['common'];
		
		var _keys = commonkeys.concat(keys);

		var localstorage = this.session.getLocalStorageObject();
		return localstorage.insertLocalJsonLeaf(_keys, parentuuid, collectionname, json, uuidfieldname);
	}
	
	// async
	saveLocalJson(session, keys, json, callback) {
		var commonkeys = ['common'];
		
		var _keys = commonkeys.concat(keys);
		
		var localstorage = session.getLocalStorageObject();

		localstorage.saveLocalJson(_keys, json, callback);
	}
	
	
	// session
	getSessionObject() {
		if (this.session)
			return this.session;
		
		console.log('Creating Session Object')
		
		this.Session.Config = this.global.globalscope.Config;
		
		// libs
		this.Session.EthereumNodeAccess = this.global.globalscope.EthereumNodeAccess;
		this.Session.AccountEncryption = this.global.globalscope.AccountEncryption;
		
		// model classes
		this.Session.Contracts = this.Contracts;
		this.Session.ContractInstance = this.ContractInstance;
		
		this.Session.CryptoKey = this.CryptoKey;
		this.Session.CryptoKeyMap = this.CryptoKeyMap;
		
		this.Session.Account = this.Account;
		this.Session.AccountMap = this.AccountMap;
		
		this.Session.Transaction = this.Transaction;
		
		var web3providerurl = this.getWeb3ProviderUrl();

		this.session = new this.Session(this.global);
		
		// web3
		this.session.setWeb3ProviderUrl(web3providerurl);
		
		// config
		this.session.setWalletAccountAddress(this.getWalletAccountAddress());
		this.session.setNeedToUnlockAccounts(this.needToUnlockAccounts());
		
		// calling creatingSession_hook
		var global = this.global;

		var result = []; 
		var inputparams = [];
		
		inputparams.push(this.session);
		
		var ret = global.invokeHooks('creatingSession_hook', result, inputparams);
		
		if (ret && result && result.length) {
			console.log('session creation hook handled by a module');			
		}

		return this.session;
	}
	
	resetSessionObject() {
		if (this.session) {
			// re-read config
			this.session.setWalletAccountAddress(this.getWalletAccountAddress());
			this.session.setNeedToUnlockAccounts(this.needToUnlockAccounts());
		}
	}
	
	// user
	createBlankUserObject() {
		var session = this.getSessionObject();
		
		return new this.User(session);
	}
	
	// contracts
	getContractsObject(bForceRefresh, callback) {
		var session = this.getSessionObject();
		
		return session.getContractsObject(bForceRefresh, callback);
	}
	
	// crypto keys
	getCryptoKeyObject(address) {
		var session = this.getSessionObject();
		
		return session.getCryptoKeyObject(address);
	}
	
	createBlankCryptoKeyObject() {
		var session = this.getSessionObject();
		
		return session.createBlankCryptoKeyObject();
	}
	
	// accounts
	getAccountObject(address) {
		var session = this.getSessionObject();
		
		return session.getAccountObject(address);
	}
	
	createBlankAccountObject() {
		var session = this.getSessionObject();
		
		return session.createBlankAccountObject();
	}
	
	// transactions
	getTransactionObject(transactionuuid) {
		var session = this.getSessionObject();
		
		return session.getTransactionObject(transactionuuid);
	}
	
	getTransactionList(callback) {
		var session = this.getSessionObject();
		var EthereumNodeAccess = session.getEthereumNodeAccessInstance();
		
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