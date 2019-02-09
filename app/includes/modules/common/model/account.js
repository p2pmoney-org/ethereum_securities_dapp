/**
 * 
 */
'use strict';

var AccountMap = class {
	constructor() {
		this.map = Object.create(null); // use a simple object to implement the map
	}
	
	getAccount(address) {
		var key = address.toString().trim().toLowerCase();
		
		if (key in this.map) {
			return this.map[key];
		}
	}
	
	getAccountArray() {
		var array = [];
		
		for (var key in this.map) {
		    if (!this.map[key]) continue;
		    
		    array.push(this.map[key]);
		}
		
		return array;
	}
	
	pushAccount(account) {
		var key = account.address.toString().trim().toLowerCase();

		if (!account.getPrivateKey()) {
			console.log('pushing account ' + key + ' with no private key');
			
			// we check if we have already this account
			// and check that we do not replace an object with a private key
			// with an object that does not have one
			if (key in this.map) {
				if (this.map[key].getPrivateKey())
					return;
			}
		}

		// simple replace
		this.map[key] = account;
	}
	
	removeAccount(account) {
		var key = account.address.toString().trim().toLowerCase();

		delete this.map[key];
	}
	
	count() {
		return Object.keys(this.map).length;
	}
	
	empty() {
		this.map = Object.create(null);
	}
}


var Account = class {
	constructor(session, address) {
		this.session = session;
		this.address = (address ? address.trim().toLowerCase() : address);
		
		this.description = null;
		
		this.lastunlock = null; // unix time
		this.lastunlockduration = null;
		
		this.owner = null;
		
		this.accountuuid = null;
		
		// encryption
		this.private_key = null;
		this.public_key = null; // ECE public key
		this.rsa_public_key = null; // asymmetric
		
		this.accountencryption = this.session.getAccountEncryptionInstance(this);
	}
	
	getUUID() {
		if (this.accountuuid)
			return this.accountuuid;
		
		this.accountuuid = this.session.getUUID();
		
		return this.accountuuid;
	}
	
	getAccountUUID() {
		return this.getUUID();
	}
	
	setAccountUUID(uuid) {
		this.accountuuid = uuid;
	}
	
	getAddress() {
		return this.address;
	}
	
	setAddress(address) {
		this.address = address;
		
		this.private_key = null;
		this.public_key = null; // ECE public key
		this.rsa_public_key = null; // asymmetric
	}
	
	getOwner() {
		return this.owner;
	}
	
	setOwner(user) {
		this.owner = user;
	}
	
	isValid() {
		if (this.address != null) {
			if (this.session.isValidAddress(this.address)) {
				return true;
			}
			else {
				return false;
			}
		}
		else {
			throw 'Account is not valid!';
		}
	}
	
	getDescription() {
		return this.description;
	}
	
	setDescription(description) {
		this.description = description;
	}
	
	
	getPublicKey() {
		return this.public_key;
	}
	
	setPublicKey(pubkey) {
		this.public_key = (pubkey ? pubkey.trim().toLowerCase() : pubkey);
		
		if (!pubkey)
			return;
		
		this.accountencryption.setPublicKey(this.public_key);
	}
	
	isPublicKeyValid() {
		if (!this.public_key)
			return false;
		
		return this.accountencryption.isValidPublicKey(this.public_key);
	}
	
	getPrivateKey() {
		return this.private_key;
	}
	
	setPrivateKey(privkey) {
		var private_key = (privkey ? privkey.trim().toLowerCase() : privkey);
		
		try {
			if (this.accountencryption.isValidPrivateKey(privkey))
			this.accountencryption.setPrivateKey(private_key);
		}
		catch(e) {
			this.private_key = null;
		}
	}
	
	isPrivateKeyValid() {
		if (!this.private_key)
			return false;
		
		return this.accountencryption.isValidPrivateKey(this.private_key);
	}
	
	canSignTransactions() {
		return this.isPrivateKeyValid();
	}
	
	// operation
	unlock(password, duration) {
		if (this.session.needToUnlockAccounts() === false) 
			return;
		
		this.lastunlock = Date.now()/1000; // in seconds
		this.lastunlockduration = duration;
		
		console.log('Account.unlock called for ' + duration + ' seconds ');
		
		// call interface to unlock
		var EthereumNodeAccess = this.session.getEthereumNodeAccessInstance();
		
		return EthereumNodeAccess.web3_unlockAccount(this, password, duration);
	}
	
	lock() {
		if (this.session.needToUnlockAccounts() === false) 
			return;
		
		// call interface to lock
		this.lastunlock = null; // unix time
		this.lastunlockduration = null;
		
		var EthereumNodeAccess = this.session.getEthereumNodeAccessInstance();
		
		return EthereumNodeAccess.web3_lockAccount(this);
	}
	
	isLocked() {
		var session = this.session;
		
		if (session.needToUnlockAccounts() === false) 
			return false;
		
		if (this.lastunlock == null)
			return true;
		
		var now = Date.now()/1000; // in seconds
		
		if (now - this.lastunlock > this.lastunlockduration - 1) {
			this.lock();
			
			return true;
		}
	}
	
	getBalance() {
		var EthereumNodeAccess = this.session.getEthereumNodeAccessInstance();
		
		return EthereumNodeAccess.web3_getBalance(this.address);
	}
	
	// encryption
	canDoAesEncryption() {
		return this.accountencryption.canDoAesEncryption();
	}
	
	canDoAesDecryption() {
		return this.accountencryption.canDoAesDecryption();
	}
	
	getAesPublicKey() {
		return this.getPublicKey();
	}
	
	setAesPublicKey(pubkey) {
		this.setPublicKey(pubkey);
	}
	
	encryptString(plaintext) {
		if (!plaintext)
			return;
		
		return this.aesEncryptString(plaintext);
	}
	
	decryptString(ciphertext) {
		if (!ciphertext)
			return;
		
		return this.aesDecryptString(ciphertext);
	}
	
	// symmetric encryption with the private key
	aesEncryptString(plaintext) {
		if (!plaintext)
			return;
		
		return this.accountencryption.aesEncryptString(plaintext);
	}
	
	aesDecryptString(ciphertext) {
		if (!ciphertext)
			return;
		
		return this.accountencryption.aesDecryptString(ciphertext);
	}
	
	// asymmetric encryption with the private/public key pair
	canDoRsaEncryption() {
		return this.accountencryption.canDoRsaEncryption();
	}
	
	canDoRsaDecryption() {
		return this.accountencryption.canDoRsaDecryption();
	}
	
	getRsaPublicKey() {
		return this.rsa_public_key;
	}
	
	setRsaPublicKey(pubkey) {
		this.rsa_public_key = pubkey;
	}
	
	rsaEncryptString(plaintext, recipientaccount) {
		if (!plaintext)
			return;
		
		return this.accountencryption.rsaEncryptString(plaintext, recipientaccount);
	}
	
	rsaDecryptString(ciphertext, senderaccount) {
		if (!ciphertext)
			return;
		
		return this.accountencryption.rsaDecryptString(ciphertext, senderaccount);
	}
	
	// signature
	signString(text) {
		return this.accountencryption.signString(text);
	}
	
	validateStringSignature(text, signature) {
		return this.accountencryption.validateStringSignature(text, signature);
	}
	
	// chain async
	getChainBalance(callback) {
		var EthereumNodeAccess = this.session.getEthereumNodeAccessInstance();
		
		return EthereumNodeAccess.web3_getBalance(this.address, callback);
	}
	
	transferAmount(toaccount, amount, gas, gasPrice, transactionuuid, callback) {
		console.log('Account.transferAmount called for amount ' + amount + ' to ' + (toaccount ? toaccount.getAddress() : null) + ' with transactionuuid ' + transactionuuid);
		
		var session = this.session;
		var global = session.getGlobalObject();
		var ethereumnodeaccessmodule = global.getModuleObject('ethereum-node-access');
		
		var ethereumtransaction =  ethereumnodeaccessmodule.getEthereumTransactionObject(session, this);
		
		var toaddress = (toaccount ? toaccount.getAddress() : null);
		
		ethereumtransaction.setToAddress(toaddress);
		ethereumtransaction.setValue(amount);
		ethereumtransaction.setGas(gas);
		ethereumtransaction.setGasPrice(gasPrice);
		
		ethereumtransaction.setTransactionUUID(transactionuuid);

		
		var EthereumNodeAccess = session.getEthereumNodeAccessInstance();
		
		
		return EthereumNodeAccess.web3_sendEthTransaction(ethereumtransaction, callback);
		
		/*var txdata = null;
		var nonce = null;
		
		return EthereumNodeAccess.web3_sendTransaction(this, toaccount, amount, gas, gasPrice, txdata, nonce, callback);*/
	}
	
	
	// static
	static getAccountObject(session, address) {
		return session.getAccountObject(address);
	}
	
	static getWalletAccountObject(session) {
		return session.getWalletAccountObject();
	}
	
}

if ( typeof window !== 'undefined' && window )
GlobalClass.registerModuleClass('common', 'Account', Account);
else
module.exports = Account; // we are in node js

if ( typeof window !== 'undefined' && window )
GlobalClass.registerModuleClass('common', 'AccountMap', AccountMap);
else
Account.AccountMap = AccountMap; // we are in node js
