/**
 * 
 */
'use strict';

var CryptoKeyMap = class {
	constructor() {
		this.map = Object.create(null); // use a simple object to implement the map
	}
	
	getCryptoKey(address) {
		var entry = address.toString().trim().toLowerCase();
		
		if (entry in this.map) {
			return this.map[entry];
		}
	}
	
	getCryptoKeyArray() {
		var array = [];
		
		for (var entry in this.map) {
		    if (!this.map[entry]) continue;
		    
		    array.push(this.map[entry]);
		}
		
		return array;
	}
	
	pushCryptoKey(cryptokey) {
		var entry = cryptokey.address.toString().trim().toLowerCase();

		// TODO: we could check if we have already this cryptokey
		// and check that we do not replace an object with a private key
		// with an object that does not have one
		if (!cryptokey.getPrivateKey()) {
			console.log('pushing cryptokey ' + cryptokey + ' with no private key');
		}

		// simple replace
		this.map[entry] = cryptokey;
	}
	
	removeCryptoKey(cryptokey) {
		var entry = cryptokey.address.toString().trim().toLowerCase();

		delete this.map[entry];
	}
	
	count() {
		return Object.keys(this.map).length;
	}
	
	empty() {
		this.map = Object.create(null);
	}
}


var CryptoKey = class {
	constructor(session, address) {
		this.session = session;
		this.address = (address ? address.trim().toLowerCase() : address);
		
		this.description = null;
		
		this.keyuuid = null;
		
		// encryption
		this.private_key = null;
		this.public_key = null; // ECE public key
		this.rsa_public_key = null; // asymmetric
		
		this.cryptoencryption = session.getCryptoKeyEncryptionInstance(this);
	}
	
	getKeyUUID() {
		return this.keyuuid;
	}
	
	setKeyUUID(uuid) {
		this.keyuuid = uuid;
	}
	
	getAddress() {
		return this.address;
	}
	
	getPublicKey() {
		return this.public_key;
	}
	
	getPrivateKey() {
		return this.private_key;
	}
	
	setPrivateKey(privkey) {
		this.private_key = (privkey ? privkey.trim().toLowerCase() : privkey);
		
		this.cryptoencryption.setPrivateKey(this.private_key);
	}
	
	getDescription() {
		return this.description;
	}
	
	setDescription(description) {
		this.description = description;
	}
	
	// encryption
	
	// symmetric encryption with the private key
	canDoAesEncryption() {
		return this.cryptoencryption.canDoAesEncryption();
	}
	
	canDoAesDecryption() {
		return this.cryptoencryption.canDoAesDecryption();
	}
	
	getAesPublicKey() {
		return this.getPublicKey();
	}
	
	setAesPublicKey(pubkey) {
		this.setPublicKey(pubkey);
	}
	
	aesEncryptString(plaintext) {
		return this.cryptoencryption.aesEncryptString(plaintext);
	}
	
	aesDecryptString(cyphertext) {
		return this.cryptoencryption.aesDecryptString(cyphertext);
	}
	
	// asymmetric encryption with the private/public key pair
	canDoRsaEncryption() {
		return this.cryptoencryption.canDoRsaEncryption();
	}
	
	canDoRsaDecryption() {
		return this.cryptoencryption.canDoRsaDecryption();
	}
	
	getRsaPublicKey() {
		return this.rsa_public_key;
	}
	
	rsaEncryptString(plaintext, recipientaccount) {
		return this.cryptoencryption.rsaEncryptString(plaintext, recipientaccount);
	}
	
	rsaDecryptString(cyphertext, senderaccount) {
		return this.cryptoencryption.rsaDecryptString(cyphertext, senderaccount);
	}
	
	// signature
	signString(text) {
		return this.cryptoencryption.signString(text);
	}
	
	validateStringSignature(text, signature) {
		return this.cryptoencryption.validateStringSignature(text, signature);
	}
}


if ( typeof window !== 'undefined' && window )
GlobalClass.registerModuleClass('common', 'CryptoKey', CryptoKey);
else
module.exports = CryptoKey; // we are in node js

if ( typeof window !== 'undefined' && window )
GlobalClass.registerModuleClass('common', 'CryptoKeyMap', CryptoKeyMap);
else
CryptoKey.CryptoKeyMap = CryptoKeyMap; // we are in node js
