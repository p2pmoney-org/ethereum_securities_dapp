/**
 * 
 */
'use strict';

var Session = class {
	constructor(global) {
		
		this.global = global;
		
		this.sessionuuid = null;
		
		this.contracts = null;

		// web3
		this.web3providerurl = null;
		//this.web3instance = null;
		
		// ethereum node access
		this.ethereum_node_access_instance = null;
		

		var commonmodule = global.getModuleObject('common');

		// local storage
		this.localstorage = new commonmodule.LocalStorage(this);
		
		// instantiation mechanism
		this.classmap = Object.create(null); 
		
		this.cryptokeymap = new commonmodule.CryptoKeyMap();
		this.accountmap = new commonmodule.AccountMap();
		
		this.transactionmap = Object.create(null); // use a simple object to implement the map

		// impersonation
		this.user = null;
		this.identifyingaccountaddress = null; // obsolete
		
		// payer
		this.walletaccountaddress = null;
		this.needtounlockaccounts = true;
		
		// utility
		this.getClass = function() { return this.constructor.getClass()};
	}
	
	getSessionUUID() {
		if (this.sessionuuid)
			return this.sessionuuid;
		
		this.sessionuuid = this.guid();
		
		return this.sessionuuid;
	}
	
	setSessionUUID(sessionuuid) {
		console.log('changing sessionuuid from ' + this.sessionuuid + ' to ' + sessionuuid);
		this.sessionuuid = sessionuuid;
	}
	
	// class map
	getGlobalClass() {
		return Session;
	}
	
	getSessionClass() {
		return Session;
	}
	
	getClass(classname) {
		if (classname == 'Global')
			return this.getGlobalClass();
		
		if (classname in this.classmap) {
			return this.classmap[classname];
		}
	}
	
	addClass(classname, theclass) {
		this.classmap[classname] = theclass;
	}
	
	// config
	getXtraConfigValue(key) {
		var Session = this.getClass();
		return Session.Config.getXtraValue(key);
	}
	
	// web 3
	getWeb3ProviderUrl() {
		return this.web3providerurl;
	}
	
	setWeb3ProviderUrl(url) {
		this.web3providerurl = url;
	}
	
	// instance of objects
	getGlobalObject() {
		return this.global;
	}
	
	
	// instances of interfaces
	getEthereumNodeAccessInstance() {
		var global = this.getGlobalObject();
		var ethereumnodeaccessmodule = global.getModuleObject('ethereum-node-access');
		
		return ethereumnodeaccessmodule.getEthereumNodeAccessInstance(this);
	}
	
	getCryptoKeyEncryptionInstance(cryptokey) {
		var global = this.getGlobalObject();
		var cryptokeytencryptionmodule = global.getModuleObject('cryptokey-encryption');
		return cryptokeytencryptionmodule.getCryptoKeyEncryptionInstance(this, cryptokey);
	}
	
	getAccountEncryptionInstance(account) {
		var global = this.getGlobalObject();
		var accountencryptionmodule = global.getModuleObject('account-encryption');
		
		return accountencryptionmodule.getAccountEncryptionInstance(this, account);
	}
	
	getStorageAccessInstance() {
		var global = this.getGlobalObject();
		var storageaccessmodule = global.getModuleObject('storage-access');
		
		return storageaccessmodule.getStorageAccessInstance(this);
	}
	
	
	// storage
	getLocalStorageObject() {
		return this.localstorage;
	}

	// rest connection
	createRestConnection(rest_server_url, rest_server_api_path) {
		var global = this.global;
		var commonmodule = global.getModuleObject('common');

		return new commonmodule.RestConnection(this, rest_server_url, rest_server_api_path);
	}
	
	// addresses and keys (personal or third party, as strings)
	isValidAddress(address) {
		var blankaccount = this.createBlankAccountObject()
		var accountencryption = this.getAccountEncryptionInstance(blankaccount);

		return accountencryption.isValidAddress(address);		
	}

	isValidPublicKey(pubkey) {
		var blankaccount = this.createBlankAccountObject()
		var accountencryption = this.getAccountEncryptionInstance(blankaccount);

		return accountencryption.isValidPublicKey(pubkey);		
	}
	
	isValidPrivateKey(privkey) {
		var blankaccount = this.createBlankAccountObject()
		var accountencryption = this.getAccountEncryptionInstance(blankaccount);

		return accountencryption.isValidPrivateKey(privkey);		
	}
	
	generatePrivateKey() {
		var blankaccount = this.createBlankAccountObject()
		var accountencryption = this.getAccountEncryptionInstance(blankaccount);

		return accountencryption.generatePrivateKey();		
	}

	areAddressesEqual(address1, address2) {
		if ((!address1) || (!address2))
			return false;
		
		return (address1.trim().toLowerCase() == address2.trim().toLowerCase());
	}
	
	// crypto keys (encryption operations)
	addCryptoKeyObject(cryptokey) {
		this.cryptokeymap.pushCryptoKey(cryptokey);
	}
	
	removeCryptoKeyObject(cryptokey) {
		this.cryptokeymap.removeCryptoKey(cryptokey);
	}
	
	createBlankCryptoKeyObject() {
		var Session = this.getClass();
		
		return new Session.CryptoKey(this, null);
	}
	
	getSessionCryptoKeyObjects(bForceRefresh, callback) {
		var cryptokeys = this.cryptokeymap.getCryptoKeyArray();
		
		if ((!bForceRefresh) && (bForceRefresh != true)) {
			
			if (callback)
				callback(null, cryptokeys);
			
			return cryptokeys;
		}
		
		var global = this.getGlobalObject();
		var self = this;
		
		// invoke hook to build processing chain
		var result = [];
		
		var params = [];
		
		params.push(this);
		
		result.get = function(err, keyarray) {

			if (!err) {
				self.cryptokeymap.empty();
				
				for (var i = 0; i < keyarray.length; i++) {
					var key = keyarray[i];
					
					self.cryptokeymap.pushCryptoKey(key);
				}
				
				if (callback)
					callback(null, self.cryptokeymap.getCryptoKeyArray());
			}
			else {
				if (callback)
					callback(err, self.cryptokeymap.getCryptoKeyArray());
			}
		};

		var ret = global.invokeHooks('getSessionCryptoKeyObjects_hook', result, params);
		
		if (ret && result && result.length) {
			global.log('getSessionCryptoKeyObjects_hook result is ' + JSON.stringify(result));
		}
		
		
		// process after hooks chained the get functions
		var keyarray = [];
		
		result.get(null, keyarray);

		
		return this.cryptokeymap.getCryptoKeyArray();
	}
	
	
	
	// account objects
	// (all accounts, personal or third party, referenced by the session)
	areAccountsEqual(account1, account2) {
		if ((!account1) || (!account2))
			return false;
		
		return this.areAddressesEqual(account1.getAddress(), account2.getAddress());
	}
	
	getAccountObject(address) {
		if (!address)
			return;
		
		var key = address.toString();
		var mapvalue = this.accountmap.getAccount(key);
		
		var account;
		
		if (mapvalue !== undefined) {
			// is already in map
			account = mapvalue;
		}
		else {
			var Session = this.getClass();
			account = new Session.Account(this, address);
			
			// put in map
			this.accountmap.pushAccount(account);
		}
		
		return account;
	}
	
	getAccountObjectFromPrivateKey(privkey) {
		var account = this.createBlankAccountObject();
		
		account.setPrivateKey(privkey);
		
		this.addAccountObject(account);
		
		return account;
	}
	
	addAccountObject(account) {
		this.accountmap.pushAccount(account);
		
		var owner = account.getOwner();
		
		if (owner) {
			var sessionuser = this.getSessionUserObject();
			
			if (sessionuser.isEqual(owner))
				sessionuser.addAccountObject(account);
		}
	}
	
	removeAccountObject(account) {
		this.accountmap.removeAccount(account);
	}
	
	createBlankAccountObject() {
		var Session = this.getClass();
		return new Session.Account(this, null);
	}
	
	getAccountObjects(bForceRefresh, callback) {
		var accounts = this.accountmap.getAccountArray();
		
		if ((!bForceRefresh) && (bForceRefresh != true)) {
			
			if (callback)
				callback(null, accounts);
			
			return accounts;
		}
		
		var global = this.getGlobalObject();
		var self = this;
		
		// invoke hook to build processing chain
		var result = [];
		
		var params = [];
		
		params.push(this);
		
		result.get = function(err, accountarray) {
			if (!err) {
				self.accountmap.empty();
				
				for (var i = 0; i < accountarray.length; i++) {
					var account = accountarray[i];
					
					self.accountmap.pushAccount(account);
				}
				
				if (callback)
					callback(null, self.accountmap.getAccountArray());
			}
			else {
				if (callback)
					callback(err, self.accountmap.getAccountArray());
			}
		};

		var ret = global.invokeHooks('getAccountObjects_hook', result, params);
		
		if (ret && result && result.length) {
			global.log('getAccountObjects_hook result is ' + JSON.stringify(result));
		}
		
		
		// process after hooks chained the get functions
		var accountarray = [];
		
		result.get(null, accountarray);
		
		return this.accountmap.getAccountArray();
	}
	
	// transactions
	getTransactionObject(transactionuuid) {
		var transaction = new Session.Transaction(this, transactionuuid);
		
		if (transactionuuid in this.transactionmap)  {
			transaction.setHash(this.transactionmap[transactionuuid]);
		}
		
		return transaction;
	}
	

	// user (impersonation)
	impersonateUser(user) {
		if (this.user && user)
			this.disconnectUser();
		
		this.user = user;
	}
	
	disconnectUser() {
		this.user = null;
		
		// we clean the cryptokey map
		this.cryptokeymap.empty();
		
		// we clean the account map
		this.accountmap.empty();
		
		// we clean the local storage
		this.localstorage.empty();
	}
	
	getSessionUserObject() {
		return this.user;
	}
	
	getSessionUserIdentifier() {
		if (this.user)
			return this.user.getUserName();
	}
	
	// session identification
	isAnonymous() {
		var oldisanonymous = (this.user == null);
		
		// we call isSessionAnonymous hook in case
		// we should not longer be identified
		var global = this.global;

		var result = []; 
		var inputparams = [];
		
		inputparams.push(this);
		
		var ret = global.invokeHooks('isSessionAnonymous_hook', result, inputparams);
		
		if (ret && result && result.length) {
			console.log('Session.isAnonymous handled by a module');			
		}

		var newisanonymous = (this.user == null);
		
		if (newisanonymous != oldisanonymous)
		console.log('a isSessionAnonymous_hook has changed the isanonymous flag');
		
		return (this.user == null);
	}
	
	disconnectAccount() {
		//this.identifyingaccountaddress = null;
		this.user = null;
		
		// we clean the cryptokey map
		this.cryptokeymap.empty();
		
		// we clean the account map
		this.accountmap.empty();
		
		// we clean the local storage
		this.localstorage.empty();
	}
	
	impersonateAccount(account) {
		if (!account) {
			//this.identifyingaccountaddress = null;
			this.user = null;
			return;
		}
		
		var address = account.getAddress();
		
		console.log("impersonating session with account " + address);
		
		
		if (account.isValid()) {
			// make sure we don't have have another copy of the account in our map
			var oldaccount = this.getAccountObject(address);
			
			if (oldaccount) {
				this.removeAccountObject(oldaccount);
			}
			
			//this.identifyingaccountaddress = address;
			var global = this.getGlobalObject();
			var commonmodule = global.getModuleObject('common');

			this.user = commonmodule.createBlankUserObject();
			
			this.user.setUserName(address);
			this.user.setUserUUID(address);

			this.user.addAccountObject(account);
			
			// adding to our map
			this.addAccountObject(account);
			
		}
	}
	
	// session accounts
	// (all personal accounts of the user impersonated in the session)
	getFirstSessionAccountObject() {
		var sessionaccounts = this.getSessionAccountObjects();
		
		if (sessionaccounts && sessionaccounts[0])
			return sessionaccounts[0];
	}

	getMainSessionAccountObject() {
		// return first for the moment
		return this.getFirstSessionAccountObject();
	}

	getSessionAccountObject(accountaddress) {
		if (!accountaddress)
			return;
		
		var sessionaccounts = this.getSessionAccountObjects();
		
		if (!sessionaccounts)
			return;
		
		for (var i = 0; i < sessionaccounts.length; i++) {
			var account = sessionaccounts[i];
			var address = account.getAddress();
			
			if (this.areAddressesEqual(accountaddress, address))
				return account;
		}
	}
	
	getSessionAccountObjects(bForceRefresh, callback) {
		var accounts;
		
		if ((!bForceRefresh) && (bForceRefresh != true)) {
			
			if (this.user != null)
				accounts = this.user.getAccountObjects();
			else
				accounts = null;
			
			if (callback)
				callback(null, accounts);
			
			return accounts;
		}
		
		// we refresh the list of all accounts
		var self = this;
		
		this.getAccountObjects(bForceRefresh, function(err, ress) {
			var accnts;
			if (!err) {
				
				if (self.user != null)
					accnts = self.user.getAccountObjects();
				else
					accnts = null;
				
				if (callback)
					callback(null, accnts);
				
				return accnts;
			}
			else {
				if (callback)
					callback(err, accnts);
				
				return accnts;
			}
		});
		
		if (this.user != null)
			return this.user.getAccountObjects();
		else
			return null;
	}
	
	readSessionAccountFromKeys(keys) {
		var session = this;
		var global = this.getGlobalObject();
		var commonmodule = global.getModuleObject('common');
		var user = session.getSessionUserObject();
		
		var accountarray = [];
		
		for (var i = 0; i < keys.length; i++) {
			var key = keys[i];
			
			var keyuuid = key['key_uuid'];
			var privatekey = key['private_key'];
			var publickey = key['public_key'];
			var address = key['address'];
			var rsapublickey = key['rsa_public_key'];
			var description = key['description'];
			
			var account = commonmodule.createBlankAccountObject();
			
			account.setAccountUUID(keyuuid);
			account.setDescription(description);
			
			
			if (privatekey) {
				try {
					account.setPrivateKey(privatekey);
					
					//user.addAccountObject(account);
					account.setOwner(user);
					session.addAccountObject(account);
					
					accountarray.push(account);
				}
				catch(e) {
					console.log('exception while adding internal accounts: ' + e);
				}
			}
			else {
				// simple account, not a session account
				try {
					account.setAddress(address);
					account.setPublicKey(publickey);
					account.setRsaPublicKey(rsapublickey);
				
					session.addAccountObject(account);
					
					accountarray.push(account);
				}
				catch(e) {
					console.log('exception while adding external accounts: ' + e);
				}
			}
		
		}
		
		return accountarray;
	}
	
	getSessionAccountAddresses() {
		var array = [];

		if (this.user) {
			var accountarray = this.getSessionAccountObjects();
			
			for (var i = 0; i < accountarray.length; i++) {
				var account = accountarray[i];
				array.push(account.getAddress());
			}
		}
		
		return array;
		//return this.identifyingaccountaddress;
	}
	
	isSessionAccount(account) {
		if (this.isAnonymous())
			return false;
		
		if (!account)
			return false;
		
		if (this.isSessionAccountAddress(account.getAddress()))
			return true;
		else
			return false;
	}
	
	isSessionAccountAddress(accountaddress) {
		if (this.isAnonymous())
			return false;
		
		if (!accountaddress)
			return false;
		
		var addresses = this.getSessionAccountAddresses();
		
		for (var i = 0; i < addresses.length; i++) {
			var address = addresses[i];
			
			if (this.areAddressesEqual(accountaddress, address))
				return true;
		}
		
		return false;
	}
	
	
	
	// Wallet
	getWalletAccountAddress() {
		return this.walletaccountaddress;
	}
	
	setWalletAccountAddress(address) {
		this.walletaccountaddress = address;
	}
	
	needToUnlockAccounts() {
		return this.needtounlockaccounts;
	}
	
	setNeedToUnlockAccounts(choice) {
		this.needtounlockaccounts = choice;
	}
	
	getWalletAccountObject() {
		var address = this.getWalletAccountAddress();
		
		if (address)
			return this.getAccountObject(address);
	}

	
	// contracts
	getContractsObject(bForceRefresh, callback) {
		if ((this.contracts) && (!bForceRefresh) && (bForceRefresh != true)) {
			
			if (callback)
				callback(null, this.contracts);
			
			return this.contracts;
		}
		
		if (this.contracts) {
			this.contracts.flushContractObjects();
		}
		else {
			var Session = this.getClass();
			this.contracts = new Session.Contracts(this);
		}
		
		var global = this.getGlobalObject();
		var self = this;
		
		// invoke hook to build processing chain
		var result = [];
		
		var params = [];
		
		params.push(this);
		
		result.get = function(err, jsonarray) {
			if (!err) {
				self.contracts.initContractObjects(jsonarray);
				
				if (callback)
					callback(null, self.contracts);
			}
			else {
				if (callback)
					callback(err, self.contracts);
			}
		};

		var ret = global.invokeHooks('getContractsObject_hook', result, params);
		
		if (ret && result && result.length) {
			global.log('getContractsObject_hook result is ' + JSON.stringify(result));
		}
		
		
		// process after hooks chained the get functions
		var jsonarray = [];
		
		result.get(null, jsonarray);

		
		return this.contracts;
	}
	
	saveContractObjects(contracts, callback) {
		var json = contracts.getContractObjectsJson();
		console.log("Session.saveContractObjects: contracts json is " + JSON.stringify(json));
		
		var global = this.getGlobalObject();
		var self = this;
		
		var keys = ['common','contracts'];

		var localstorageobject = this.getLocalStorageObject();
		
		localstorageobject.saveLocalJson(keys, json, function(err, jsonarray) {
			if (!err) {
				// re-initialize contract list (that can have been refreshed from previous states)
				// with the saved version
				if (self.contracts) {
					self.contracts.initContractObjects(jsonarray);
				}
			}
			
			if (callback)
				callback(null, self.contracts);
			
			return self.contracts;
		});
	}

	// contract instance
	getContractInstance(contractaddress, contractartifact) {
		var Session = this.getClass();
		var contractinstance = new Session.ContractInstance(this, contractaddress, contractartifact);
		
		return contractinstance;
	}
	
	// signatures
	validateStringSignature(accountaddress, plaintext, signature) {
		var account = this.getAccountObject(accountaddress);
		
		if (!account)
			return false;
		
		return account.validateStringSignature(plaintext, signature)
	}
	
	
	
	guid() {
		var EthereumNodeAccess = this.getEthereumNodeAccessInstance();
		
		return EthereumNodeAccess.guid();
	}
	
	getTransactionUUID() {
		return 'id_' + this.guid();
	}
	
	getUUID() {
		// we use loosely the terms guid and uuid for the moment
		return this.guid();
	}
	
	signString(plaintext) {
		var sessionaccount = this.getFirstSessionAccountObject();
		
		if (!sessionaccount)
			throw 'Session must be signed-in to sign a string';
			
		var AccountEncryption = this.getAccountEncryptionInstance(sessionaccount);
		
		return AccountEncryption.signString(plaintext);
	}
}

if ( typeof GlobalClass !== 'undefined' && GlobalClass )
GlobalClass.registerModuleClass('common', 'Session', Session);
else
module.exports = Session; // we are in node js