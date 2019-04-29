'use strict';

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
		
		if (this.isready) {
			if (callback)
				callback(null, this);
			
			return;
		}

		if (this.isloading) {
			var error = 'calling loadModule while still loading for module ' + this.name;
			console.log('error: ' + error);
			
			if (callback)
				callback(error, null);
			
			return;
		}
			
		this.isloading = true;

		var self = this;
		var global = this.global;

		var modulescriptloader = global.getScriptLoader('commonmoduleloader', parentscriptloader);
		
		var moduleroot = './includes/modules/common';

		modulescriptloader.push_script( moduleroot + '/control/controllers.js');

		modulescriptloader.push_script( moduleroot + '/model/localstorage.js');
		modulescriptloader.push_script( moduleroot + '/model/restconnection.js');
		modulescriptloader.push_script( moduleroot + '/model/cryptokey.js');
		modulescriptloader.push_script( moduleroot + '/model/account.js');
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
		//this.Session.EthereumNodeAccess = this.global.globalscope.EthereumNodeAccess;
		this.Session.AccountEncryption = this.global.globalscope.AccountEncryption;
		
		// model classes
		//this.Session.Contracts = this.Contracts;
		//this.Session.ContractInstance = this.ContractInstance;
		
		this.Session.CryptoKey = this.CryptoKey;
		this.Session.CryptoKeyMap = this.CryptoKeyMap;
		
		this.Session.Account = this.Account;
		this.Session.AccountMap = this.AccountMap;
		
		//this.Session.Transaction = this.Transaction;
		
		this.session = new this.Session(this.global);
		
		
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
	/*getContractsObject(bForceRefresh, callback) {
		var session = this.getSessionObject();
		
		return session.getContractsObject(bForceRefresh, callback);
	}*/
	
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
	
}

GlobalClass.getGlobalObject().registerModuleObject(new Module());