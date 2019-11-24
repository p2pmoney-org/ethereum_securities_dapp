'use strict';

var Module = class {
	constructor() {
		this.name = 'common';
		this.current_version = "0.12.2.2019.11.23";
		
		this.global = null; // put by global on registration
		this.isready = false;
		this.isloading = false;
		
		// control
		this.controllers = null;
		
		// model
		//this.session = null; // current session
		
		this.session_array = [];
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
		modulescriptloader.push_script( moduleroot + '/model/localvault.js');
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
		
		var localstorage = session.getLocalStorageObject();
		return localstorage.getLocalJsonLeaf(_keys, uuid, uuidfieldname);
	}
	
	updateLocalJsonLeaf(session, keys, uuid, json, uuidfieldname) {
		var commonkeys = ['common'];
		
		var _keys = commonkeys.concat(keys);

		var localstorage = session.getLocalStorageObject();
		return localstorage.updateLocalJsonLeaf(_keys, uuid, json, uuidfieldname);
	}
	
	insertLocalJsonLeaf(session, keys, parentuuid, collectionname, json, uuidfieldname) {
		var commonkeys = ['common'];
		
		var _keys = commonkeys.concat(keys);

		var localstorage = session.getLocalStorageObject();
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
	createBlankSessionObject() {
		console.log('Creating Session Object')
		
		// making sure class properties are ok
		this.Session.Config = this.global.globalscope.simplestore.Config;
		
		// libs
		this.Session.AccountEncryption = this.global.globalscope.simplestore.AccountEncryption;
		
		// model classes
		this.Session.CryptoKey = this.CryptoKey;
		this.Session.CryptoKeyMap = this.CryptoKeyMap;
		
		this.Session.Account = this.Account;
		this.Session.AccountMap = this.AccountMap;
		

		// creating object
		var session = new this.Session(this.global);
		var sessionuuid = session.getSessionUUID();
		
		
		// calling creatingSession_hook
		var global = this.global;

		var result = []; 
		var inputparams = [];
		
		inputparams.push(session);
		
		var ret = global.invokeHooks('creatingSession_hook', result, inputparams);
		
		if (ret && result && result.length) {
			console.log('session creation hook handled by a module');			
		}
		
		// put session in multi-session array
		this.session_array.push(session);

		return session;
	}
	
	/*getSessionObject() {
		if (this.session)
			return this.session;
		
		if (this.session_array.length) {
			this.session = this.session_array[0];
			
			return this.session;
		}

		this.session = this.createBlankSessionObject();
		
		return this.session;
	}
	
	setCurrentSessionObject(session) {
		var newsessionuuid = session.getSessionUUID();
		
		var newsession = this.findSessionObjectFromUUID(newsessionuuid);
		
		if (!newsession) {
			// not in our array yet, push it
			this.session_array.push(session);
		}
		
		this.session = session;
	}*/
	
	
	// multi session management
	getSessionObjects() {
		return this.session_array;
	}
	
	resetSessionObjects() {
		for (var i = 0; i < this.session_array.length;i ++) {
			var session = this.session_array[i];
			
			if (session) {
				// re-read config
				session.setWalletAccountAddress(this.getWalletAccountAddress());
				session.setNeedToUnlockAccounts(this.needToUnlockAccounts());
			}
		}
	}
	
	findSessionObjectFromUUID(sessionuuid) {
		for (var i = 0; i < this.session_array.length;i ++) {
			var session = this.session_array[i];
			
			if (session && (session.getSessionUUID() == sessionuuid))
				return session;
		}
	}
	
	// user
	createBlankUserObject(session) {
		var global = this.global;
		
		var SessionClass = (typeof Session !== 'undefined' ? Session : global.getModuleObject('common').Session);
		if (session instanceof SessionClass !== true)
			throw 'must pass a session object as first parameter!';
		
		var global = session.getGlobalObject();
		
		return new this.User(session);
	}
	
	// contracts
	
	// crypto keys
	getCryptoKeyObject(session, address) {
		var global = this.global;
		
		var SessionClass = (typeof Session !== 'undefined' ? Session : global.getModuleObject('common').Session);
		if (session instanceof SessionClass !== true)
			throw 'must pass a session object as first parameter!';
		
		var global = session.getGlobalObject();
		
		return session.getCryptoKeyObject(address);
	}
	
	createBlankCryptoKeyObject(session) {
		var global = this.global;
		
		var SessionClass = (typeof Session !== 'undefined' ? Session : global.getModuleObject('common').Session);
		if (session instanceof SessionClass !== true)
			throw 'must pass a session object as first parameter!';
		
		var global = session.getGlobalObject();
		
		return session.createBlankCryptoKeyObject();
	}
	
	// accounts
	getAccountObject(session, address) {
		var global = this.global;
		
		var SessionClass = (typeof Session !== 'undefined' ? Session : global.getModuleObject('common').Session);
		if (session instanceof SessionClass !== true)
			throw 'must pass a session object as first parameter!';
		
		var global = session.getGlobalObject();
		
		return session.getAccountObject(address);
	}
	
	createBlankAccountObject(session) {
		var global = this.global;
		
		var SessionClass = (typeof Session !== 'undefined' ? Session : global.getModuleObject('common').Session);
		if (session instanceof SessionClass !== true)
			throw 'must pass a session object as first parameter!';
		
		var global = session.getGlobalObject();
		
		return session.createBlankAccountObject();
	}
	
	// vaults
	openVault(session, vaultname, passphrase, type, callback) {
		var LocalVault = this.LocalVault;
		
		LocalVault.openVault(session, vaultname, passphrase, type, callback);
	}
	
	createVault(session, vaultname, passphrase, type, callback) {
		var LocalVault = this.LocalVault;
		
		LocalVault.createVault(session, vaultname, passphrase, type, callback);
	}
	
	getVaultObjects(session) {
		var LocalVault = this.LocalVault;

		return LocalVault.getVaultObjects(session);
	}
	
	getFromVault(session, vaultname, vaulttype, key) {
		var LocalVault = this.LocalVault;
		
		var vault = LocalVault.getVaultObject(session, vaultname, vaulttype);
		
		if (vault) {
			return vault.getValue(key);
		}
	}

	putInVault(session, vaultname, vaulttype, key, value, callback) {
		var LocalVault = this.LocalVault;
		
		var vault = LocalVault.getVaultObject(session, vaultname, vaulttype);
		
		if (vault) {
			vault.putValue(key, value, callback);
		}
		else {
			if (callback)
				callback('no vault with this name: ' + vaultname, null);
		}
	}
	
}

if ( typeof GlobalClass !== 'undefined' && GlobalClass )
GlobalClass.getGlobalObject().registerModuleObject(new Module());
else if (typeof window !== 'undefined') {
	let _GlobalClass = ( window && window.simplestore && window.simplestore.Global ? window.simplestore.Global : null);
	
	_GlobalClass.getGlobalObject().registerModuleObject(new Module());
}
else if (typeof global !== 'undefined') {
	// we are in node js
	let _GlobalClass = ( global && global.simplestore && global.simplestore.Global ? global.simplestore.Global : null);
	
	_GlobalClass.getGlobalObject().registerModuleObject(new Module());
}
