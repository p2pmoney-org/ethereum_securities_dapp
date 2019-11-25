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
		if (!cryptokey || !cryptokey.address)
			return;
		
		var entry = cryptokey.address.toString().trim().toLowerCase();

		// we only add proper crypto keys
		if (!cryptokey.getPrivateKey()) {
			console.log('pushing cryptokey ' + cryptokey + ' with no private key');
			return;
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
		
		this.origin = null;
		
		this.owner = null;
		
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
	
	getOrigin() {
		return this.origin;
	}
	
	setOrigin(origin) {
		if (!origin || !origin.storage)
			return;
		
		this.origin = origin;
	}
	
	getOwner() {
		return this.owner;
	}
	
	setOwner(user) {
		this.owner = user;
	}
	
	getAddress() {
		return this.address;
	}
	
	setAddress(address) {
		if (!this.areAddressesEqual(this.address, address)) {
			this.address = (address ? address.trim().toLowerCase() : address);
			
			this.private_key = null;
			this.public_key = null; // ECE public key
			this.rsa_public_key = null; // asymmetric
		}
	}
	
	getPublicKey() {
		return this.public_key;
	}
	
	setPublicKey(pubkey) {
		this.public_key = (pubkey ? pubkey.trim().toLowerCase() : pubkey);
		
		if (!pubkey)
			return;
		
		this.cryptoencryption.setPublicKey(this.public_key);
	}
	
	getPrivateKey() {
		return this.private_key;
	}
	
	setPrivateKey(privkey) {
		this.private_key = (privkey ? privkey.trim().toLowerCase() : privkey);
		
		this.cryptoencryption.setPrivateKey(this.private_key);
	}
	
	isPrivateKeyValid() {
		if (!this.private_key)
			return false;

		return this.cryptoencryption.isValidPrivateKey(this.private_key);
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
	
	setRsaPublicKey(pubkey) {
		this.rsa_public_key = pubkey;
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
	
	// utils
	areAddressesEqual(address1, address2) {
		if ((!address1) || (!address2))
			return false;
		
		return (address1.trim().toLowerCase() == address2.trim().toLowerCase());
	}
	

}


if ( typeof GlobalClass !== 'undefined' && GlobalClass ) {
	GlobalClass.registerModuleClass('common', 'CryptoKey', CryptoKey);
	GlobalClass.registerModuleClass('common', 'CryptoKeyMap', CryptoKeyMap);
}
else if (typeof window !== 'undefined') {
	let _GlobalClass = ( window && window.simplestore && window.simplestore.Global ? window.simplestore.Global : null);
	
	_GlobalClass.registerModuleClass('common', 'CryptoKey', CryptoKey);
	_GlobalClass.registerModuleClass('common', 'CryptoKeyMap', CryptoKeyMap);
}
else if (typeof global !== 'undefined') {
	// we are in node js
	let _GlobalClass = ( global && global.simplestore && global.simplestore.Global ? global.simplestore.Global : null);
	
	_GlobalClass.registerModuleClass('common', 'CryptoKey', CryptoKey);
	_GlobalClass.registerModuleClass('common', 'CryptoKeyMap', CryptoKeyMap);
}