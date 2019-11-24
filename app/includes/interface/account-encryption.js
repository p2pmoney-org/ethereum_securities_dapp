'use strict';

var Module = class {
	
	constructor() {
		this.name = 'account-encryption';
		
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
		
		var modulescriptloader = global.getScriptLoader('accountencryptionmoduleloader', parentscriptloader);

		var moduleroot = './includes/lib';

		/*if (global.isInBrowser()) {
			modulescriptloader.push_script( moduleroot + '/ethereumjs-all-2017-10-31.min.js');
			modulescriptloader.push_script( moduleroot + '/keythereum.min-1.0.2.js');
			modulescriptloader.push_script( moduleroot + '/bitcore.min-0.11.7.js');
			modulescriptloader.push_script( moduleroot + '/bitcore-ecies.min-0.9.2.js');
		}*/


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
	getAccountEncryptionInstance(session, account) {
		if (!account)
			return;
		
		if (account.accountencryption)
			return account.accountencryption;
		
		console.log('instantiating AccountEncryption');
		
		var global = this.global;

		var result = [];
		var inputparams = [];
		
		inputparams.push(this);
		inputparams.push(session);
		inputparams.push(account);
		
		result[0] = new AccountEncryption(session, account);
		
		// call hook to let modify or replace instance
		var ret = global.invokeHooks('getAccountEncryptionInstance_hook', result, inputparams);
		
		if (ret && result[0]) {
			account.accountencryption = result[0];
		}
		else {
			account.accountencryption = new AccountEncryption(session, account);
		}
		
		return account.accountencryption;
	}
	
}

class AccountEncryption {
	constructor(session, account) {
		this.session = session;
		this.account = account;
		
		var global = session.getGlobalObject();
		var cryptokeytencryptionmodule = global.getModuleObject('cryptokey-encryption');
		var cryptokey = account.getCryptoKey();
		
		this.cryptokeyencryptioninstance = cryptokeytencryptionmodule.getCryptoKeyEncryptionInstance(session, cryptokey);
	}
	
	isReady(callback) {
		var promise = new Promise(function (resolve, reject) {
			
			if (callback)
				callback(null, true);
			
			resolve(true);
		});
		
		return promise
	}
	
	// encryption
	getKeythereumClass() {
		return this.cryptokeyencryptioninstance.getKeythereumClass();
	}
	
	getEthereumJsClass() {
		return this.cryptokeyencryptioninstance.getEthereumJsClass();
	}
	
	setPrivateKey(privkey) {
		var account = this.account;
		account.private_key = privkey;
		
		this.cryptokeyencryptioninstance.setPrivateKey(privkey);

	}
	
	setPublicKey(pubkey) {
		var account = this.account;

		if (account.private_key)
			throw 'you should not call directly setPublicKey if a private key has already been set';

		this.cryptokeyencryptioninstance.setPublicKey(pubkey);
		
	}
	
	// symmetric
	canDoAesEncryption() {
		return this.cryptokeyencryptioninstance.canDoAesEncryption();
	}
	
	canDoAesDecryption() {
		return this.cryptokeyencryptioninstance.canDoAesDecryption();
	}
	
	getAesCryptionParameters() {
		return this.cryptokeyencryptioninstance.getAesCryptionParameters();
	}
	
	// symmetric encryption with the private key
	aesEncryptString(plaintext) {
		return this.cryptokeyencryptioninstance.aesEncryptString(plaintext);
	}
	
	aesDecryptString(cyphertext) {
		console.log('AccountEncryption.aesDecryptString called for ' + cyphertext);
		
		return this.cryptokeyencryptioninstance.aesDecryptString(cyphertext);
	}
	
	// asymmetric encryption with the private/public key pair
	getBitcoreClass() {
		return this.cryptokeyencryptioninstance.getBitcoreClass();
	}
	
	
	getBitcoreEcies() {
		return this.cryptokeyencryptioninstance.getBitcoreEcies();
	}
	
	
	canDoRsaEncryption() {
		return this.cryptokeyencryptioninstance.canDoRsaEncryption();
	}
	
	canDoRsaDecryption() {
		return this.cryptokeyencryptioninstance.canDoRsaDecryption();
	}
	
	getRsaWifFromPrivateKey(privatekey) {
		return this.cryptokeyencryptioninstance.getRsaWifFromPrivateKey(privatekey);
	}
	
	getRsaPublicKeyFromPrivateKey(privateKey) {
		return this.cryptokeyencryptioninstance.getRsaPublicKeyFromPrivateKey(privateKey);
	}
	
	getRsaPublicKey(account) {
		if (!account)
			throw 'Null account passed to getRsaPublicKey';
		
		var rsaPubKey = account.getRsaPublicKey();
		
		if (rsaPubKey)
			return rsaPubKey;
		else {
			var cryptokey = account.getCryptoKey();
			
			return this.cryptokeyencryptioninstance.getRsaPublicKey(cryptokey);
		}
	}
	
	rsaEncryptString(plaintext, recipientaccount) {
		console.log('AccountEncryption.rsaEncryptString called for ' + plaintext);
		
		var recipientcryptokey = recipientaccount.getCryptoKey();
		
		return this.cryptokeyencryptioninstance.rsaEncryptString(plaintext, recipientcryptokey);
	}
	
	rsaDecryptString(cyphertext, senderaccount) {
		console.log('AccountEncryption.rsaDecryptString called for ' + cyphertext);
		
		var sendercryptokey = senderaccount.getCryptoKey();
		
		return this.cryptokeyencryptioninstance.rsaDecryptString(cyphertext, sendercryptokey);
	}
	
	// signature
	signString(plaintext) {
		
		console.log('creating signature for text '+ plaintext);
		
		return this.cryptokeyencryptioninstance.signString(plaintext);
	}
	
	validateStringSignature(plaintext, signature) {
		return this.cryptokeyencryptioninstance.validateStringSignature(plaintext, signature);
	}
	
	// utils
	isValidAddress(address) {
		return this.cryptokeyencryptioninstance.isValidAddress(address);
	}

	isValidPublicKey(pubkey) {
		return this.cryptokeyencryptioninstance.isValidPublicKey(pubkey);
	}
	
	isValidPrivateKey(privkey) {
		return this.cryptokeyencryptioninstance.isValidPrivateKey(privkey);
	}
	
	generatePrivateKey() {
		return this.cryptokeyencryptioninstance.generatePrivateKey();
	}

	
}

if ( typeof window !== 'undefined' && window ) // if we are in browser and not node js (e.g. truffle)
window.simplestore.AccountEncryption = AccountEncryption;
else if (typeof global !== 'undefined')
global.simplestore.AccountEncryption = AccountEncryption; // we are in node js

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

