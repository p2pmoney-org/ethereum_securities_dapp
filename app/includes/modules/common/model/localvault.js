/**
 * 
 */
'use strict';

var LocalVault = class {
	static get CLIENT_VAULT() { return 0;}
	static get LOCAL_VAULT() { return 1;}

	constructor(session, vaultname, type) {
		this.session = session;
		this.vaultname = vaultname;
		
		this.type = type;
		
		this.cryptokey = null;
		
		this.valuemap = Object.create(null);
		
	}
	
	getCryptoKeyObject() {
		return this.cryptokey;
	}
	
	_read(keys, callback) {
		var session =this.session;
		var localStorage = session.getLocalStorageObject();
		var clientAccess = session.getClientStorageAccessInstance();
		
		switch (this.type) {
			case LocalVault.CLIENT_VAULT:
				clientAccess.readUserJson(keys, callback);
				break;
			case LocalVault.LOCAL_VAULT:
				localStorage.readLocalJson(keys, true, callback);
				break;
			default:
				clientAccess.readUserJson(keys, callback);
				break;
		}
		
	}
	
	_save(keys, json, callback) {
		var session =this.session;
		var localStorage = session.getLocalStorageObject();
		var clientAccess = session.getClientStorageAccessInstance();
		
		switch (this.type) {
			case LocalVault.CLIENT_VAULT:
				clientAccess.saveUserJson(keys, json, callback);
				break;
			case LocalVault.LOCAL_VAULT:
				localStorage.saveLocalJson(keys, json, callback);
				break;
			default:
				clientAccess.saveUserJson(keys, json, callback);
				break;
		}
	}
	
	unlock(passphrase, callback) {
		var session = this.session;
		var vaultname = this.vaultname;

		// read crypto key
		var cryptokey = session.createBlankCryptoKeyObject();
		var cryptokeyencryptioninstance = session.getCryptoKeyEncryptionInstance(cryptokey);
		
		// set crypto key origin
		cryptokey.setOrigin({storage: 'vault', vaultname: vaultname});
		
		var keys = ['common', 'vaults', vaultname, 'keystore'];

		this._read(keys, (err, res) => {
			var key_uuid = (res ? res.key_uuid : null);
			var keystorestring = (res ? res.content : null);
			
			// decrypt crypto key
			var privatekey =  cryptokeyencryptioninstance.readPrivateKeyFromStoreString(keystorestring, passphrase);
			
			if (privatekey) {
				cryptokey.setKeyUUID(key_uuid);
				cryptokey.setPrivateKey(privatekey);
				
				this.cryptokey = cryptokey;
				
				// then read value
				this.readValues((err, res) =>  {
					if (callback)
						callback(null, this);
				});
				
			}
			else {
				if (callback)
					callback('no key found', null);
			}
			
		});
		
	}
	
	lock() {
		this.cryptokey = null;
		this.valuemap = Object.create(null);
	}
	
	isLocked() {
		return (this.cryptokey ? false : true);
	}
	
	changePassphrase(oldpassphrase, newpassphrase, callback) {
		var vaultname = this.vaultname;
		var keys = ['common', 'vaults', vaultname, 'keystore'];
		
		this.unlock(oldpassphrase, (err, res) => {
			if (res) {
				// get keystore string
				var keystorestring =  cryptokeyencryptioninstance.getPrivateKeyStoreString(newpassphrase);

				// save keystore string
				if (keystorestring) {
					var filename = cryptokeyencryptioninstance.getPrivateKeyStoreFileName();
					var key_uuid = cryptokey.getKeyUUID();
					
					var json = {key_uuid: key_uuid, filename: filename, content: keystorestring};
					
					this._save(keys, json, (err, res) => {
						if (callback)
							callback(err, (err ? null : vault));
					});
					
				}
				else {
					if (callback)
						callback('can not create vault', null);
				}
			}
		});
		
	}
	
	readValues(callback) {
		if (this.isLocked()) {
			if (callback)
				callback('vault is locked', null);

			return;
		}
		
		var session = this.session;
		var vaultname = this.vaultname;
		
		var cryptokey = this.cryptokey;
		
		// read encrypted value
		var keys = ['common', 'vaults', vaultname, 'values'];

		this._read(keys, (err, res) => {
			var encryptedvaluestring = (res ? res.encryptedvalues : null);
			var plainvaluestring;
			var json;
			
			if (encryptedvaluestring) {
				var cryptokeyencryptioninstance = session.getCryptoKeyEncryptionInstance(cryptokey);
				
				plainvaluestring =  cryptokeyencryptioninstance.aesDecryptString(encryptedvaluestring);
			
				json = (plainvaluestring ? JSON.parse(plainvaluestring) : null);
				
				this.valuemap = Object.create(null);
				
				for (var key in json) {
				    if (json.hasOwnProperty(key)) {
				        this.valuemap.key = json.key;
				    }
				}
				
			}
			
			if (callback)
				callback(null, this.valuemap);
		});

	}
	
	getValue(key) {
		if (this.valuemap)
			return this.valuemap[key];
	}
	
	saveValues(callback) {
		var session = this.session;
		var vaultname = this.vaultname;

		// stringify, encrypt and save
		var keys = ['common', 'vaults', vaultname, 'values'];
		
		var cryptokey = this.cryptokey;
		var key_uuid = cryptokey.getKeyUUID();
		
		var cryptokeyencryptioninstance = session.getCryptoKeyEncryptionInstance(cryptokey);

		var plainvaluestring = JSON.stringify(this.valuemap);
		var encryptedvaluestring = cryptokeyencryptioninstance.aesEncryptString(plainvaluestring);
		
		var json = {key_uuid: key_uuid, encryptedvalues: encryptedvaluestring};
		
		this._save(keys, json, (err, res) => {
			if (callback)
				callback(err, res);
		});
		
	}
	
	putValue(key, value, callback) {
		if (this.isLocked()) {
			if (callback)
				callback('vault is locked', null);

			return;
		}
		
		if ((!key) || (!value))
			return;
		
		this.valuemap[key] = value;
		
		this.saveValues((err, res) => {
			if (callback)
				callback(err, (err ? null : value));
		});
		
	}
	
	// static
	
	static _getSafeVaultName(session, vaultname, type) {
		var safename = vaultname;
		
		var localStorage = session.getLocalStorageObject();

		if (!localStorage.isValidKey(vaultname)) {
			return;
		}
		
		return safename;
	}

	static openVault(session, vaultname, passphrase, type, callback) {
		var safevaultname = LocalVault._getSafeVaultName(session, vaultname, type);

		if (!safevaultname) {
			if (callback)
				callback('vault name can only contain safe characters: ' + vaultname, null);
			
			return;
		}
		
		var vault = new LocalVault(session, safevaultname, type);
		
		// put in map
		var vaultmap = session.vaultmap;
		
		vaultmap[vaultname + '-type' + type] = vault;
		
		vault.unlock(passphrase, function(err, res) {
			if (callback)
				callback(err, (err ? null : vault));
		});
	}
	
	static createVault(session, vaultname, passphrase, type, callback) {
		var safevaultname = LocalVault._getSafeVaultName(session, vaultname, type);

		if (!safevaultname) {
			if (callback)
				callback('vault name can only contain safe characters: ' + vaultname, null);
			
			return;
		}
		
		// check vault with this name does not exist
		var vault = new LocalVault(session, vaultname, type);

		var keys = ['common', 'vaults', safevaultname, 'keystore'];
		
		vault._read(keys, (err, res) => {
			if(res) {
				if (callback)
					callback('vault with this name already exists: ' + vaultname, null);
			}
			else {
				// put in map
				var vaultmap = session.vaultmap;
				
				vaultmap[vaultname + '-type' + type] = vault;
				
				// create a crypto key
				var cryptokey = session.createBlankCryptoKeyObject();
				cryptokey.setKeyUUID(session.guid());
				
				var cryptokeyencryptioninstance = session.getCryptoKeyEncryptionInstance(cryptokey);

				var privkey = cryptokeyencryptioninstance.generatePrivateKey();
				cryptokey.setPrivateKey(privkey);
				
				// set crypto key origin
				cryptokey.setOrigin({storage: 'memory'});
				
				// get keystore string
				var keystorestring =  cryptokeyencryptioninstance.getPrivateKeyStoreString(passphrase);

				// save keystore string
				if (keystorestring) {
					var filename = cryptokeyencryptioninstance.getPrivateKeyStoreFileName();
					var key_uuid = cryptokey.getKeyUUID();
					
					var json = {key_uuid: key_uuid, filename: filename, content: keystorestring};
					
					vault._save(keys, json, function(err, res) {
						if (callback)
							callback(err, (err ? null : vault));
					});
					
				}
				else {
					if (callback)
						callback('can not create vault', null);
				}
			}
		});
		
	}
	
	static getVaultObject(session, vaultname, type) {
		var vaultmap = session.vaultmap;
		
		return vaultmap[vaultname + '-type' + type];
	}
	
	static getVaultObjects(session) {
		return session.getVaultObjects();
	}
}

if ( typeof GlobalClass !== 'undefined' && GlobalClass )
	GlobalClass.registerModuleClass('common', 'LocalVault', LocalVault);
else if (typeof window !== 'undefined') {
	let _GlobalClass = ( window && window.simplestore && window.simplestore.Global ? window.simplestore.Global : null);
	
	_GlobalClass.registerModuleClass('common', 'LocalVault', LocalVault);
}
else if (typeof global !== 'undefined') {
	// we are in node js
	let _GlobalClass = ( global && global.simplestore && global.simplestore.Global ? global.simplestore.Global : null);
	
	_GlobalClass.registerModuleClass('common', 'LocalVault', LocalVault);
}