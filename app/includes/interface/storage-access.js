'use strict';

var Module = class {
	
	constructor() {
		this.name = 'storage-access';
		
		this.global = null; // put by global on registration
		this.isready = false;
		this.isloading = false;
		
		this.storage_access_instance = null;
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
		
		var modulescriptloader = global.getScriptLoader('storageaccessmoduleloader', parentscriptloader);

		var moduleroot = './includes/lib';

		if (global.isInBrowser()) {
			
		}

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
	getStorageAccessInstance(session) {
		if (this.storage_access_instance)
			return this.storage_access_instance;
		
		console.log('instantiating StorageAccess');
		
		var global = this.global;

		var result = []; 
		var inputparams = [];
		
		inputparams.push(session);
		
		var ret = global.invokeHooks('getStorageAccessInstance_hook', result, inputparams);
		
		if (ret && result[0]) {
			this.storage_access_instance = result[0];
		}
		else {
			this.storage_access_instance = new StorageAccess(session);
		}

		
		return this.storage_access_instance;
	}
	
	// utilitites
	keystostring(keys) {
		var key = '';
		
		for (var i =0; i < keys.length; i++) {
			key += (i > 0 ? '-' : '') + keys[i]
		}
		
		return key;
	}
	
	readClientSideJson(session, keys) {
		var key = this.keystostring(keys);
		var jsonstring = localStorage.getItem(key.toString());
		
		//console.log("client side local storage json for key " + key.toString() + " is " + jsonstring);
		
		var json = JSON.parse(jsonstring);
		
		return json;
	}
	
	saveClientSideJson(session, keys, json) {
		var key = this.keystostring(keys);
		var jsonstring = JSON.stringify(json);

		//console.log("saving in client side local storage json " + jsonstring + " for key " + key.toString());
		
		localStorage.setItem(key, jsonstring);
	}
	

	
}

class StorageAccess {
	constructor(session) {
		this.session = session;
	}
	
	//
	// Storage API
	//
	
	// client side
	readClientSideJson(keys) {
		var session = this.session;
		var global = session.getGlobalObject();
		var storagemodule = global.getModuleObject('storage-access');
		
		var jsonleaf = storagemodule.readClientSideJson(session, keys);
		
		return jsonleaf;
	}
	
	saveClientSideJson(keys, json) {
		var session = this.session;
		var global = session.getGlobalObject();
		var storagemodule = global.getModuleObject('storage-access');
		
		storagemodule.saveClientSideJson(session, keys, json);
	}
	
	// user
	readUserJson(keys, callback) {
		var self = this;

		var promise = new Promise(function (resolve, reject) {
			// client side storage only for dapp
			var json = self.readClientSideJson(keys);
			
			if (callback)
				callback(null, json);
			
			return resolve(json);
		});
		
		return promise;

	}
	
	saveUserJson(keys, json, callback) {
		var self = this;

		var promise = new Promise(function (resolve, reject) {
			// client side storage only for dapp
			self.saveClientSideJson(keys, json);
			
			if (callback)
				callback(null, json);
			
			return resolve(json);
		});
		
		return promise;
	}
	
	// user storage
	account_session_keys(callback) {
		console.log("StorageAccess.account_session_keys called");
		
		var self = this;
		var session = this.session;
		var global = session.getGlobalObject();
		
		var cryptoencryptionmodule = global.getModuleObject('cryptokey-encryption');

		var promise = new Promise(function (resolve, reject) {
			try {
				var keys = ['accounts'];
				
				self.readUserJson(keys, function(err, res) {
					
					var jsonarray = res;
					
					var keysjson = cryptoencryptionmodule.decryptJsonArray(session, jsonarray);
					
					var json = {keys: keysjson};
					
					if (callback)
						callback(null, json);
					
					return resolve(json);
				}).catch(err => {
				    console.log('error in StorageAccess.account_session_keys: ', err);
				    
				    if (callback)
					    callback(err, null);
				});;
			
			}
			catch(e) {
			    if (callback)
				    callback('exception: ' + e, null);
			    
				reject('exception in StorageAccess.account_session_keys: ' + e);
			}
		});
		
		return promise;


	}
	
	user_add_account(user, account, callback) {
		console.log("StorageAccess.user_add_account called");
		
		var self = this;
		var session = this.session;
		var global = session.getGlobalObject();
		var cryptoencryptionmodule = global.getModuleObject('cryptokey-encryption');
		
		var promise = new Promise(function (resolve, reject) {
			var keys = ['accounts'];
			
			var uuid = account.getAccountUUID();
			
			if (!uuid) {
				uuid = account.getAddress();
				account.setAccountUUID(uuid);
			}
			

			var description = account.getDescription();

			var privatekey = account.getPrivateKey();
			var cryptokey = cryptoencryptionmodule.pickCryptoKeyEncryptionInstance(session);
			var encryptedprivatekey = cryptoencryptionmodule.encryptPrivateKey(privatekey, cryptokey);
				
			
			var json = {uuid: uuid, owner_uuid: user.getUserUUID(), address: account.getAddress(), private_key: encryptedprivatekey, description: description};
			
			
			// local storage
			var commonmodule = global.getModuleObject('common');
			
			var jsonleaf = commonmodule.getLocalJsonLeaf(session, keys, uuid);
			
			if (jsonleaf) {
				commonmodule.updateLocalJsonLeaf(session, keys, uuid, json);
			}
			else {
				commonmodule.insertLocalJsonLeaf(session, keys, null, null, json);
			}
			
			if (callback)
				callback(null, json);
			
			return resolve(json);
		});
		
		return promise;
	}
	
	user_update_account(user, account, callback) {
		console.log("StorageAccess.user_update_account called");
		
		var self = this;
		var session = this.session;
		var global = session.getGlobalObject();
		var cryptoencryptionmodule = global.getModuleObject('cryptokey-encryption');
		
		var promise = new Promise(function (resolve, reject) {
			var keys = ['accounts'];
			
			var uuid = account.getAccountUUID();
			
			if (!uuid) {
				throw 'account has not uuid, can not update it';
			}
			

			var description = account.getDescription();

			var privatekey = account.getPrivateKey();
			var cryptokey = cryptoencryptionmodule.pickCryptoKeyEncryptionInstance(session);
			var encryptedprivatekey = cryptoencryptionmodule.encryptPrivateKey(privatekey, cryptokey);
				
			
			// local storage
			var commonmodule = global.getModuleObject('common');
			
			var jsonleaf = commonmodule.getLocalJsonLeaf(session, keys, uuid);
			
			if (jsonleaf) {
				var json = {uuid: uuid, 
							owner_uuid: jsonleaf.owner_uuid, 
							address: jsonleaf.address, 
							private_key: jsonleaf.private_key, 
							description: description
						}; // can only update description
				
				
				commonmodule.updateLocalJsonLeaf(session, keys, uuid, json);
			}
			else {
				throw 'could not find account with uuid ' + uuid;
			}
			
			if (callback)
				callback(null, jsonleaf);
			
			return resolve(jsonleaf);
		});
		
		return promise;
	}
}


if ( typeof window !== 'undefined' && window ) // if we are in browser and not node js (e.g. truffle)
window.StorageAccess = StorageAccess;
else
module.exports = StorageAccess; // we are in node js

GlobalClass.getGlobalObject().registerModuleObject(new Module());
