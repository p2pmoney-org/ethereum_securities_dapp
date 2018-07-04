/**
 * 
 */
'use strict';

class Session {
	constructor(global) {
		
		this.global = global;
		
		this.sessionuuid = null;
		
		this.contracts = null;

		// web3
		this.web3providerurl = null;
		//this.web3instance = null;
		
		// ethereum node access
		this.ethereum_node_access_instance = null;
		

		var common = global.getModuleObject('common');

		// local storage
		this.localstorage = new common.LocalStorage(this);
		
		// instantiation mechanism
		this.classmap = Object.create(null); 
		
		this.accountmap = new common.AccountMap();

		// impersonation
		this.identifyingaccountaddress = null;
		
		// payer
		this.walletaccountaddress = null;
		this.needtounlockaccounts = true;
		
		// execution context
		this.nodejs = true;
	}
	
	isInNodejs() {
		return this.nodejs;
	}
	
	setIsInNodejs(choice) {
		this.nodejs = choice;
	}
	
	getSessionUUID() {
		if (this.sessionuuid)
			return this.sessionuuid;
		
		this.sessionuuid = this.guid();
		
		return this.sessionuuid;
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
	
	getEthereumNodeAccessInstance() {
		if (this.ethereum_node_access_instance)
			return this.ethereum_node_access_instance;
		
		console.log('instantiating EthereumNodeAccess');
		
		var global = this.getGlobalObject();

		var result = []; 
		var inputparams = [];
		
		inputparams.push(this);
		
		var ret = global.invokeHooks('getEthereumNodeAccessInstance_hook', result);
		
		if (ret && result[0]) {
			this.ethereum_node_access_instance = result[0];
		}
		else {
			this.ethereum_node_access_instance = new Session.EthereumNodeAccess(this);
		}

		
		return this.ethereum_node_access_instance;
	}
	
	getAccountEncryptionInstance(account) {
		if (!account)
			return;
		
		if (account.accountencryption)
			return account.accountencryption;
		
		console.log('instantiating AccountEncryption');
		
		var global = this.getGlobalObject();

		var result = [];
		var inputparams = [];
		
		inputparams.push(this);
		inputparams.push(account);
		
		var ret = global.invokeHooks('getAccountEncryptionInstance_hook', result, inputparams);
		
		if (ret && result[0]) {
			account.accountencryption = result[0];
		}
		else {
			account.accountencryption = new Session.AccountEncryption(this, account);
		}
		
		return account.accountencryption;
	}
	
	
	// storage
	getLocalStorageObject() {
		return this.localstorage;
	}


	loadArtifact(jsonfile, callback) {
		console.log("requiring load of artifact " + jsonfile);
		var loadpromise 
		
		if ( !this.nodejs ) {
			loadpromise = $.getJSON(jsonfile, function(data) {
				console.log('contract json file read ');
				
				if (callback)
				callback(data);
				
				return data;
			});
			
		}
		else {
			var process = require('process');
			var fs = require('fs');
			var path = require('path');
			
			var truffle_relative_dir = '../../../../build';
			this.execution_dir = (process.env.root_dir ? process.env.root_dir :  path.join(__dirname, truffle_relative_dir));
			
			var jsonPath;
			var jsonFile;
			var config;
			
			try {
				jsonPath = path.join(this.execution_dir, jsonfile);
				jsonFile = fs.readFileSync(jsonPath, 'utf8');
				
				var data = JSON.parse(jsonFile);
				
				if (callback)
					callback(data);

				return Promise.resolve(data);
				
			}
			catch(e) {
				console.log('exception reading json file: ' + e.message); 
			}
		}
		
		
		
		return loadpromise;
	}
	
	// accounts
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
	}
	
	removeAccountObject(account) {
		this.accountmap.removeAccount(account);
	}
	
	createBlankAccountObject() {
		return new Session.Account(this, null);
	}
	

	
	isAnonymous() {
		return (this.identifyingaccountaddress == null);
	}
	
	disconnectAccount() {
		this.identifyingaccountaddress = null;
		
		// we clean the account map
		this.accountmap.empty();
	}
	
	impersonateAccount(account) {
		if (!account) {
			this.identifyingaccountaddress = null;
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
			
			this.addAccountObject(account);
		
			this.identifyingaccountaddress = address;
		}
	}
	
	getSessionAccountAddress() {
		return this.identifyingaccountaddress;
	}
	
	getSessionAccountObject() {
		if (this.identifyingaccountaddress != null)
			return this.getAccountObject(this.identifyingaccountaddress);
		else
			return null;
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
		
		if (this.areAddressesEqual(accountaddress, this.identifyingaccountaddress))
			return true;
		else
			return false;
	}
	
	areAddressesEqual(address1, address2) {
		if ((!address1) || (!address2))
			return false;
		
		return (address1.trim().toLowerCase() == address2.trim().toLowerCase());
	}
	
	areAccountsEqual(account1, account2) {
		if ((!account1) || (!account2))
			return false;
		
		return this.areAddressesEqual(account1.getAddress(), account2.getAddress());
	}
	
	
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
	getContractsObject(bForceRefresh) {
		if ((this.contracts) && (!bForceRefresh) && (bForceRefresh != true))
			return this.contracts;
		
		if (this.contracts) {
			this.contracts.flushContractObjects();
		}
		else {
			this.contracts = new Session.Contracts(this);
		}
		
		var global = this.getGlobalObject();
		var commonmodule = global.getModuleObject('common');
		
		var keys = ['contracts'];

		var jsonarray = commonmodule.readLocalJson(this, keys);
		
		this.contracts.initContractObjects(jsonarray);
		
		return this.contracts;
	}
	
	saveContractObjects(contracts) {
		var json = contracts.getContractObjectsJson();
		console.log("contracts json is " + JSON.stringify(json));
		
		var global = this.getGlobalObject();
		var commonmodule = global.getModuleObject('common');
		
		var keys = ['contracts'];

		commonmodule.saveLocalJson(this, keys, json);
	}

	ownsContract(contract) {
		if (this.isAnonymous())
			return false;
		
		if (!contract)
			return false;
		
		var contractowneraccount = contract.getSyncChainOwnerAccount();
		
		console.log("contract owner is " + contract.getOwner() + " account is " + contractowneraccount.getAddress());
		
		return this.isSessionAccount(contractowneraccount);
	}
	
	// contract instance
	getContractInstance(contractaddress, contractartifact) {
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
		var sessionaccount = this.getSessionAccountObject();
		
		if (!sessionaccount)
			throw 'Session must be signed-in to sign a string';
			
		var AccountEncryption = this.getAccountEncryptionInstance(sessionaccount);
		
		return AccountEncryption.signString(plaintext);
	}
	
	// contract part decryption (asymmetric)
	decryptContractStakeHolderIdentifier(contract, stakeholder) {
		var sessionaccountaddress = this.getSessionAccountAddress();
		var stakeholdercreatoraddress = stakeholder.getChainCreatorAddress();
		
		var contractowneraccount = contract.getSyncChainOwnerAccount();
		var contractowneraddress = contractowneraccount.getAddress();
		
		/*console.log('stakeholderaddress is ' + stakeholder.getAddress());
		console.log('stakeholdercreatoraddress is ' + stakeholdercreatoraddress);
		console.log('sessionaccountaddress is ' + sessionaccountaddress);*/
		
		
		if (this.areAddressesEqual(sessionaccountaddress, stakeholdercreatoraddress)) {
			var cocryptedIdentifier;
			
			if (contractowneraddress == stakeholder.getAddress()) {
				cocryptedIdentifier = contract.getOwnerStakeHolderObject().getChainCocryptedIdentifier();
				// look at the overloaded version of stakeholder object
			}
			else {
				cocryptedIdentifier = stakeholder.getChainCocryptedIdentifier();
			}
			
			// we created this stakeholder, look for assymmetric description of contract segment
			var senderaccount = this.getSessionAccountObject();
			var recipientaccount = this.getSessionAccountObject();

			return recipientaccount.rsaDecryptString(cocryptedIdentifier, senderaccount);
		}
		else {
			var creatoraccount = this.getAccountObject(stakeholdercreatoraddress);
			
			if (this.areAddressesEqual(sessionaccountaddress, contractowneraddress)) {
				var cocryptedIdentifier;
				
				if (contractowneraddress == stakeholder.getAddress()) {
					cocryptedIdentifier = contract.getOwnerStakeHolderObject().getChainCocryptedIdentifier();
					// look at the overloaded version of stakeholder object
				}
				else {
					cocryptedIdentifier = stakeholder.getChainCocryptedIdentifier();
				}
				
				// we own the contract and look for stakeholder creator who encrypted the identifier
				var stakeholdercreator = contract.getChainStakeHolderFromAddress(stakeholdercreatoraddress); // sender is creator
				var creatoraccount = stakeholdercreator.getAccountObject(); // fills rsa key if necessary
				
				var senderaccount = creatoraccount;
				var recipientaccount = this.getSessionAccountObject();
				
				return recipientaccount.rsaDecryptString(cocryptedIdentifier, senderaccount);
			}
			else {
				// we can not decrypt the identifier
				return stakeholder.getChainCreatorCryptedIdentifier();
			}
				
			
		}
	}
	
	decryptContractStakeHolderPrivateKey(contract, stakeholder) {
		var sessionaccountaddress = this.getSessionAccountAddress();
		var stakeholdercreatoraddress = stakeholder.getChainCreatorAddress();
		var contractowneraccount = contract.getSyncChainOwnerAccount();
		var contractowneraddress = contractowneraccount.getAddress();
		
		if (this.areAddressesEqual(sessionaccountaddress, stakeholdercreatoraddress)) {
			// we created this stakeholder, look for asymmetricmmetric decryption of our part
			var senderaccount = this.getSessionAccountObject();
			var recipientaccount = this.getSessionAccountObject();

			return recipientaccount.rsaDecryptString(stakeholder.getChainCocryptedPrivKey(), senderaccount);
		}
		else {
			var creatoraccount = this.getAccountObject(stakeholdercreatoraddress);
			if (this.areAddressesEqual(sessionaccountaddress, contractowneraddress)) {
				// we own the contract  and look for stakeholder who encrypted the private key when registering his/her account
				// sender is stakeholder's account
				var stakeholderaccount = stakeholder.getAccountObject(); // fills rsa key if necessary
				
				var senderaccount = stakeholderaccount;
				var recipientaccount = this.getSessionAccountObject();

				return recipientaccount.rsaDecryptString(stakeholder.getChainCocryptedPrivKey(), senderaccount);
			}
			else {
				// we can not decrypt the private key
				return stakeholder.getChainCocryptedPrivKey();
			}
		}
		
	}
	
	// creator part decryption (symmetric)
	decryptCreatorStakeHolderDescription(contract, stakeholder) {
		var sessionaccountaddress = this.getSessionAccountAddress();
		
		var stakeholdercreatoraddress = stakeholder.getChainCreatorAddress();
		
		var contractowneraccount = contract.getSyncChainOwnerAccount();
		var contractowneraddress = contractowneraccount.getAddress();
		
		if (this.areAddressesEqual(sessionaccountaddress, stakeholdercreatoraddress)) {
			// we created this stakeholder, look for symmetric decryption of our part
			return this.getSessionAccountObject().aesDecryptString(stakeholder.getChainCreatorCryptedDescription());
		}
		else {
			var creatoraccount = this.getAccountObject(stakeholdercreatoraddress);
			if (this.areAddressesEqual(sessionaccountaddress, contractowneraddress)) {
				// we own the contract  and look for stakeholder's private key
				// to symmetrically decrypt with his/her private key
				var stkldrcreator = contract.getChainStakeHolderFromAddress(stakeholdercreatoraddress);
				var creatorprivatekey = this.decryptContractStakeHolderPrivateKey(contract, stkldrcreator);
				
				creatoraccount.setPrivateKey(creatorprivatekey);
				
				return creatoraccount.aesDecryptString(stakeholder.getChainCreatorCryptedDescription());
			}
			else {
				// we can not decrypt the description
				return stakeholder.getChainCreatorCryptedDescription();
			}
		}
	}
	
	decryptCreatorStakeHolderIdentifier(contract, stakeholder) {
		var sessionaccountaddress = this.getSessionAccountAddress();
		
		var stakeholdercreatoraddress = stakeholder.getChainCreatorAddress();
		
		var contractowneraccount = contract.getSyncChainOwnerAccount();
		var contractowneraddress = contractowneraccount.getAddress();
		
		if (this.areAddressesEqual(sessionaccountaddress, stakeholdercreatoraddress)) {
			// we created this stakeholder, look for symmetric decryption of our part
			return this.getSessionAccountObject().aesDecryptString(stakeholder.getChainCreatorCryptedIdentifier());
		}
		else {
			var creatoraccount = this.getAccountObject(stakeholdercreatoraddress);
			if (this.areAddressesEqual(sessionaccountaddress, contractowneraddress)) {
				// we own the contract  and look for stakeholder's private key
				// to symmetrically decrypt with his/her private key
				var stkldrcreator = contract.getChainStakeHolderFromAddress(stakeholdercreatoraddress);
				var creatorprivatekey = this.decryptContractStakeHolderPrivateKey(contract, stkldrcreator);
				
				creatoraccount.setPrivateKey(creatorprivatekey);
				
				return creatoraccount.aesDecryptString(stakeholder.getChainCreatorCryptedIdentifier());
			}
			else {
				// we can not decrypt the description
				return stakeholder.getChainCreatorCryptedIdentifier();
			}
		}
	}
	
	// stakeholder part decryption (asymmetric)
	decryptStakeHolderStakeHolderDescription(contract, stakeholder) {
		var sessionaccountaddress = this.getSessionAccountAddress();
		
		var stakeholderaddress = stakeholder.getAddress();
		var stakeholderaccount = this.getAccountObject(stakeholderaddress);

		var stakeholdercreatoraddress = stakeholder.getChainCreatorAddress();

		var contractowneraccount = contract.getSyncChainOwnerAccount();
		var contractowneraddress = contractowneraccount.getAddress();
		
		if (this.areAddressesEqual(sessionaccountaddress, stakeholderaddress)) {
			// we are the stakeholder, do asymmetric decryption with our private key
			var stkldrcreator = contract.getChainStakeHolderFromAddress(stakeholdercreatoraddress);
			var creatoraccount = stkldrcreator.getAccountObject(); // fills rsa key if necessary
			
			var senderaccount = creatoraccount;
			var recipientaccount = this.getSessionAccountObject();

			return recipientaccount.rsaDecryptString(stakeholder.getChainStakeHolderCryptedDescription(), senderaccount);
		}
		else {
			if (this.areAddressesEqual(sessionaccountaddress, contractowneraddress)) {
				var stkldrcreator = contract.getChainStakeHolderFromAddress(stakeholdercreatoraddress);
				var creatoraccount = stkldrcreator.getAccountObject(); // fills rsa key if necessary
				
				// we own the contract  and look for stakeholder's private key
				// to asymmetrically decrypt with his/her private key
				var stakeholderprivatekey = this.decryptContractStakeHolderPrivateKey(contract, stakeholder);
				
				stakeholderaccount.setPrivateKey(stakeholderprivatekey);
				
				var senderaccount = creatoraccount;
				var recipientaccount = stakeholderaccount;

				return recipientaccount.rsaDecryptString(stakeholder.getChainStakeHolderCryptedDescription(), senderaccount);
			}
			else {
				// we can not decrypt the description
				return stakeholder.getChainStakeHolderCryptedDescription();
			}
		}
	}
	
	decryptStakeHolderStakeHolderIdentifier(contract, stakeholder) {
		var sessionaccountaddress = this.getSessionAccountAddress();
		
		var stakeholderaddress = stakeholder.getAddress();
		var stakeholderaccount = this.getAccountObject(stakeholderaddress);

		var stakeholdercreatoraddress = stakeholder.getChainCreatorAddress();

		var contractowneraccount = contract.getSyncChainOwnerAccount();
		var contractowneraddress = contractowneraccount.getAddress();
		
		if (this.areAddressesEqual(sessionaccountaddress, stakeholderaddress)) {
			// we are the stakeholder, do asymmetric decryption with our private key
			var stkldrcreator = contract.getChainStakeHolderFromAddress(stakeholdercreatoraddress);
			var creatoraccount = stkldrcreator.getAccountObject(); // fills rsa key if necessary
			
			var senderaccount = creatoraccount;
			var recipientaccount = this.getSessionAccountObject();

			return recipientaccount.rsaDecryptString(stakeholder.getChainStakeHolderCryptedIdentifier(), senderaccount);
		}
		else {
			if (this.areAddressesEqual(sessionaccountaddress, contractowneraddress)) {
				var stkldrcreator = contract.getChainStakeHolderFromAddress(stakeholdercreatoraddress);
				var creatoraccount = stkldrcreator.getAccountObject(); // fills rsa key if necessary

				// we own the contract  and look for stakeholder's private key
				// to asymmetrically decrypt with his/her private key
				var stakeholderprivatekey = this.decryptContractStakeHolderPrivateKey(contract, stakeholder);
				
				stakeholderaccount.setPrivateKey(stakeholderprivatekey);
				
				var senderaccount = creatoraccount;
				var recipientaccount = stakeholderaccount;

				return recipientaccount.rsaDecryptString(stakeholder.getChainStakeHolderCryptedIdentifier(), senderaccount);
			}
			else {
				// we can not decrypt the description
				return stakeholder.getChainStakeHolderCryptedDescription();
			}
		}
	}
}

if ( typeof GlobalClass !== 'undefined' && GlobalClass )
GlobalClass.registerModuleClass('common', 'Session', Session);
else
module.exports = Session; // we are in node js