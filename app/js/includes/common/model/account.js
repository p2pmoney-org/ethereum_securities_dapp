/**
 * 
 */
'use strict';

class AccountMap {
	constructor() {
		this.map = Object.create(null); // use a simple object to implement the map
	}
	
	getAccount(address) {
		var key = address.toString().trim().toLowerCase();
		
		if (key in this.map) {
			return this.map[key];
		}
	}
	
	pushAccount(account) {
		var key = account.address.toString().trim().toLowerCase();

		// TODO: we could check if we have already this account
		// and check that we do not replace an object with a private key
		// with an object that does not have one
		if (!account.getPrivateKey()) {
			console.log('pushing account ' + key + ' with no private key');
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


class Account{
	constructor(session, address) {
		this.session = session;
		this.address = (address ? address.trim().toLowerCase() : address);
		
		this.lastunlock = null; // unix time
		this.lastunlockduration = null;
		
		// encryption
		this.private_key = null;
		this.public_key = null; // ECE public key
		this.rsa_public_key = null; // asymmetric
		
		this.accountencryption = this.session.getAccountEncryptionInstance(this);
	}
	
	getAddress() {
		return this.address;
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
	
	
	getPublicKey() {
		return this.public_key;
	}
	
	setPublicKey(pubkey) {
		this.public_key = (pubkey ? pubkey.trim().toLowerCase() : pubkey);
		
		this.accountencryption.setPublicKey(this.public_key);
	}
	
	getPrivateKey() {
		return this.private_key;
	}
	
	setPrivateKey(privkey) {
		this.private_key = (privkey ? privkey.trim().toLowerCase() : privkey);
		
		this.accountencryption.setPrivateKey(this.private_key);
	}
	
	// operation
	unlock(password, duration) {
		if (this.session.needToUnlockAccounts() === false) 
			return;
		
		this.lastunlock = Date.now()/1000; // in seconds
		this.lastunlockduration = duration;
		
		console.log('Account.unlock called for ' + duration + ' seconds ');
		//console.log('Account.unlock called for ' + duration + ' seconds ' + password);
		
/*		var web3 = this.session.getWeb3Instance();
		
		var res = web3.personal.unlockAccount(this.address, password, duration);
		
		return res;*/
		
		var EthereumNodeAccess = this.session.getEthereumNodeAccessInstance();
		
		return EthereumNodeAccess.web3_unlockAccount(this, password, duration);
	}
	
	lock() {
		if (this.session.needToUnlockAccounts() === false) 
			return;
		
		this.lastunlock = null; // unix time
		this.lastunlockduration = null;
		
/*		var web3 = this.session.getWeb3Instance();
		
		web3.personal.lockAccount(this.address)*/
		
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
		return this.aesEncryptString(plaintext);
	}
	
	decryptString(ciphertext) {
		return this.aesDecryptString(ciphertext);
	}
	
	// symmetric encryption with the private key
	aesEncryptString(plaintext) {
		return this.accountencryption.aesEncryptString(plaintext);
	}
	
	aesDecryptString(cyphertext) {
		return this.accountencryption.aesDecryptString(cyphertext);
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
		return this.accountencryption.rsaEncryptString(plaintext, recipientaccount);
	}
	
	rsaDecryptString(cyphertext, senderaccount) {
		return this.accountencryption.rsaDecryptString(cyphertext, senderaccount);
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
