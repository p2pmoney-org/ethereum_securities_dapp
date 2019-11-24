/**
 * 
 */
'use strict';

var AccountMap = class {
	constructor() {
		this.map = Object.create(null); // use a simple object to implement the map
	}
	
	getAccounts(address) {
		var key = address.toString().trim().toLowerCase();
		
		if (key in this.map) {
			var entry = this.map[key];
			
			if (Array.isArray(entry)) {
				return entry;
			}
			else {
				var array = [];
				
				array.push(entry);
				
				return array;
			}
		}	
	}
		
	getAccount(address) {
		var array = this.getAccounts(address);
		
		if (array)
			return array[0]; // return first by default
	}
	
	getAccountArray() {
		var array = [];
		
		for (var key in this.map) {
		    if (!this.map[key]) continue;
		    
			var entry = this.map[key];
			
			if (Array.isArray(entry)) {
				for (var i = 0; i < entry.length; i++) {
					array.push(entry[i]);
				}
			}
			else {
			    array.push(entry);
			}
		}
		
		return array;
	}
	
	pushAccount(account) {
		if (!account || !account.address)
			return;
		
		var key = account.address.toString().trim().toLowerCase();
		var entry = this.map[key];
		var accountstorage = (account.getOrigin() !== null ? account.getOrigin().storage : null);
		
		if (entry) {
			// entry already exists, check if we arealdy had a collision
			
			if (Array.isArray(entry)) {
				//already had collision
				var bExist = false;
				
				for (var i = 0; i < entry.length; i++) {
					var currentstorage = (entry[i].getOrigin() !== null ? entry[i].getOrigin().storage : null);
					
					if (accountstorage && (accountstorage == currentstorage)) {
						bExist = true;

						// replace (only if previous didn't have a private key)
						if (!entry[i].getPrivateKey()) {
							entry[i] = account;
						}
					}
				}
				
				if (!bExist) {
					// add to the current array
					entry.push(account);
				}
			}
			else {
				// simple account as an entry
				// look if we have now a collision from different storage or simple replacement
				var currentstorage = (entry.getOrigin() !== null ? entry.getOrigin().storage : null);
				
				if (accountstorage && (accountstorage == currentstorage)) {
					// simple replacement

					// we check that we do not replace an object with a private key
					// with an object that does not have one
					if (entry.getPrivateKey()) {
						if (!account.getPrivateKey()) {
							console.log('pushing account ' + key + ' with no private key');
						}
						else {
							this.map[key] = account;
						}
						
					}
					else{
						this.map[key] = account;
					}
				}
				else {
					// collision, we create an array to hold
					// accounts from different storage for this address
					var newentry = [];
					
					newentry.push(entry);
					newentry.push(account);
					
					this.map[key] = newentry;
				}
			}
			
		}
		else {
			// simple insert
			this.map[key] = account;
		}

	}
	
	removeAccount(account) {
		var key = account.address.toString().trim().toLowerCase();
		
		var entry = this.map[key];
		var accountstorage = (account.getOrigin() !== null ? account.getOrigin().storage : null);
		
		if (entry) {
			if (Array.isArray(entry)) {
				var newentry = [];
				var bSpliced = false;
				
				for (var i = 0; i < entry.length; i++) {
					var currentstorage = (entry[i].getOrigin() !== null ? entry[i].getOrigin().storage : null);
					
					if (accountstorage && (accountstorage == currentstorage)) {
						// omit this one
						bSpliced = true;
					}
					else{
						newentry.push(entry[i]);
					}
				}
				
				if (bSpliced)
					this.map[key] = newentry;
			}
			else {
				var currentstorage = (entry.getOrigin() !== null ? entry.getOrigin().storage : null);
				
				if (accountstorage == currentstorage)
				delete this.map[key];
			}
		}
		else {
			// nothing to remove
		}

	}
	
	count() {
		var array = this.getAccountArray();
		return array.length;
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
		
		this.origin = null;
		
		// encryption
		this.cryptokey = null;
		
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
		
		var cryptokey = this.getCryptoKey();
		
		cryptokey.setAddress(address);
	}
	
	getOwner() {
		return this.owner;
	}
	
	setOwner(user) {
		this.owner = user;
	}
	
	getOrigin() {
		return this.origin;
	}
	
	setOrigin(origin) {
		if (!origin || !origin.storage)
			return;
		
		this.origin = origin;
	}
	
	isValid() {
		var address = this.getAddress();
		
		if (address != null) {
			if (this.session.isValidAddress(address)) {
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
	
	getCryptoKey() {
		if (this.cryptokey)
			return this.cryptokey;
		
		var session = this.session;
		
		this.cryptokey = session.createBlankCryptoKeyObject();
		
		if (this.private_key)
			this.cryptokey.setPrivateKey(this.private_key);
		else
			this.cryptokey.setAddress(this.address);
		
		return this.cryptokey;
	}
	
	
	getPublicKey() {
		var cryptokey = this.getCryptoKey();
		
		if (cryptokey)
		return cryptokey.getPublicKey();
	}
	
	setPublicKey(pubkey) {
		var cryptokey = this.getCryptoKey();
		
		if (cryptokey)
		cryptokey.setPublicKey(pubkey);
	}
	
	isPublicKeyValid() {
		var cryptokey = this.getCryptoKey();
		
		if (cryptokey)
			return cryptokey.isPublicKeyValid()
		
		return false;
	}
	
	getPrivateKey() {
		var cryptokey = this.getCryptoKey();
		
		if (cryptokey)
			return cryptokey.getPrivateKey();
	}
	
	setPrivateKey(privkey) {
		var private_key = (privkey ? privkey.trim().toLowerCase() : privkey);
		
		try {
			var cryptokey = this.getCryptoKey();
			
			if (cryptokey) {
				cryptokey.setPrivateKey(privkey);
				this.address = cryptokey.getAddress();
			}
		}
		catch(e) {
			this.private_key = null;
		}
	}
	
	isPrivateKeyValid() {
		var cryptokey = this.getCryptoKey();
		
		if (cryptokey)
			return cryptokey.isPrivateKeyValid();
		
		return false;
	}
	
	canSignTransactions() {
		return this.isPrivateKeyValid();
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
		var cryptokey = this.getCryptoKey();
		
		if (cryptokey)
			return cryptokey.getRsaPublicKey();
	}
	
	setRsaPublicKey(pubkey) {
		var cryptokey = this.getCryptoKey();
		
		if (cryptokey)
			cryptokey.setRsaPublicKey(pubkey);
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
	
	
	// static
	static getAccountObject(session, address) {
		return session.getAccountObject(address);
	}
	
}

if ( typeof GlobalClass !== 'undefined' && GlobalClass ) {
	GlobalClass.registerModuleClass('common', 'Account', Account);
	GlobalClass.registerModuleClass('common', 'AccountMap', AccountMap);
}
else if (typeof window !== 'undefined') {
	let _GlobalClass = ( window && window.simplestore && window.simplestore.Global ? window.simplestore.Global : null);
	
	_GlobalClass.registerModuleClass('common', 'Account', Account);
	_GlobalClass.registerModuleClass('common', 'AccountMap', AccountMap);
}
else if (typeof global !== 'undefined') {
	// we are in node js
	let _GlobalClass = ( global && global.simplestore && global.simplestore.Global ? global.simplestore.Global : null);
	
	_GlobalClass.registerModuleClass('common', 'Account', Account);
	_GlobalClass.registerModuleClass('common', 'AccountMap', AccountMap);
}
