'use strict';

var Module = class {
	
	constructor() {
		this.name = 'securities';
		
		this.global = null; // put by global on registration
		this.isready = false;
		this.isloading = false;
		
		this.controllers = null;
		this.views = null;
		
		this.session = null;
	}
	
	init() {
		console.log('module init called for ' + this.name);
		
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

		// securities
		var modulescriptloader = global.getScriptLoader('securitiesmoduleloader', parentscriptloader);
		
		var moduleroot = './dapps/securities/includes';

		modulescriptloader.push_script( moduleroot + '/control/controllers.js');

		modulescriptloader.push_script( moduleroot + '/view/views.js');

		modulescriptloader.push_script( moduleroot + '/model/securities.js');
		modulescriptloader.push_script( moduleroot + '/model/stakeholder.js');

		modulescriptloader.push_script( moduleroot + '/model/stockledger/stockledger.js');
		modulescriptloader.push_script( moduleroot + '/model/stockledger/stockholder.js');
		modulescriptloader.push_script( moduleroot + '/model/stockledger/stockissuance.js');
		modulescriptloader.push_script( moduleroot + '/model/stockledger/stocktransaction.js');
		modulescriptloader.push_script( moduleroot + '/model/stockledger/interface/stockledger-contractinterface.js');
		modulescriptloader.push_script( moduleroot + '/model/stockledger/interface/stockledger-localpersistor.js');
		
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
	registerHooks() {
		console.log('module registerHooks called for ' + this.name);
		
		var global = this.global;
		
		global.registerHook('postFinalizeGlobalScopeInit_hook', 'securities', this.postFinalizeGlobalScopeInit_hook);
	}
	
	//
	// hooks
	//
	postFinalizeGlobalScopeInit_hook(result, params) {
		console.log('postFinalizeGlobalScopeInit_hook called for ' + this.name);
		
		var global = this.global;

		var commonmodule = this.global.getModuleObject('common');
		
		var contracts = commonmodule.getContractsObject();
		
		// register StockLedger in the contracts global object
		contracts.registerContractClass('StockLedger', this.StockLedger);
		
		// force refresh of list
		commonmodule.getContractsObject(true);
		

		result.push({module: 'securities', handled: true});
		
		return true;
	}

	//
	// control
	//
	
	getControllersObject() {
		if (this.controllers)
			return this.controllers;
		
		this.controllers = new this.Controllers(this);
		
		return this.controllers;
	}

	//
	// view
	//
	
	getViewsObject() {
		if (this.views)
			return this.views;
		
		this.views = new this.Views(this);
		
		return this.views;
	}

	//
	// model
	//
	
	_getSessionObject() {
		if (this.session)
			return this.session;
		
		var commonmodule = this.global.getModuleObject('common');
		this.session = commonmodule.getSessionObject();
		
		return this.session;
	}
	
	// stock ledgers
	_filterLocalContracts(contracts) {
		var array = [];
		
		if (!contracts)
			return array;
		
		var locals = contracts.getLocalOnlyContractObjects();

		for (var i = 0; i < locals.length; i++) {
			var local = locals[i];
			
			if (local.getContractType() == 'StockLedger')
			array.push(local);
		}

		return array;
	}
	
	_filterContracts(contracts) {
		var array = [];
		
		if (!contracts)
			return array;
		
		var contractarray = contracts.getContractObjectsArray();

		for (var i = 0; i < contractarray.length; i++) {
			var contract = contractarray[i];
			
			if (contract.getContractType() == 'StockLedger')
			array.push(contract);
		}

		return array;
	}
	
	getStockLedgers(session, bForceRefresh, callback) {
		var global = this.global;
		var self = this;
		
		var commonmodule = global.getModuleObject('common');
		
		var contracts = commonmodule.getContractsObject(bForceRefresh, function(err, contracts) {
			if (callback) {
				var array = self._filterContracts(contracts);
				
				callback(null, array);
			}
		});
		
		var array = this._filterContracts(contracts);
		
		return array;
	}
	
	getLocalStockLedgers(session, bForceRefresh, callback) {
		var global = this.global;
		var self = this;
		
		var commonmodule = global.getModuleObject('common');
		
		var contracts = commonmodule.getContractsObject(bForceRefresh, function(err, contracts) {
			if (callback) {
				var array = self._filterLocalContracts(contracts);
				
				callback(null, array);
			}
		});
		
		var array = this._filterLocalContracts(contracts);
		
		return array;
	}
	
	getChainStockLedgers(session, bForceRefresh) {
		var global = this.global;
		var commonmodule = global.getModuleObject('common');
		
		var contracts = commonmodule.getContractsObject(bForceRefresh);
		
		var array = [];
		
		var chains = contracts.getChainContractObjects();

		for (var i = 0; i < chains.length; i++) {
			var chain = chains[i];
			
			if (chain.getContractType() == 'StockLedger')
			array.push(chain);
		}

		return array;
	}
	
	findChainERC20Token(noticebookarray, address) {
		if (!address)
			return;
		
		var addr = address.trim().toLowerCase();
		
		for (var i = 0; i < noticebookarray.length; i++) {
			var bookaddress = noticebookarray[i].getAddress().trim().toLowerCase();
			if (bookaddress == addr)
				return noticebookarray[i];
		}
	}
	
	_filterContracts(contracts) {
		var array = [];
		
		if (!contracts)
			return array;
		
		var contractarray = contracts.getContractObjectsArray();

		for (var i = 0; i < contractarray.length; i++) {
			var contract = contractarray[i];
			
			if (contract.getContractType() == 'StockLedger')
			array.push(contract);
		}

		return array;
	}
	
	getStockLedgers(session, bForceRefresh, callback) {
		var global = this.global;
		var self = this;
		
		var commonmodule = global.getModuleObject('common');
		
		var contracts = commonmodule.getContractsObject(bForceRefresh, function(err, contracts) {
			if (callback) {
				var array = self._filterContracts(contracts);
				
				callback(null, array);
			}
		});
		
		var array = this._filterContracts(contracts);
		
		return array;
		
	}
	
	// stakeholders
	createStakeHolderObject(session, address) {
		return new this.StakeHolder(session, address);
	}
	
	createBlankStakeHolderObject(session) {
		return new this.StakeHolder(session, null);
	}
	
	getStakeHoldersFromJsonArray(jsonarray) {
		return this.StakeHolder.getStakeHoldersFromJsonArray(this, jsonarray)
	}
	
	// stockholders
	createStockHolderObject(session, stockledger, address) {
		return new this.StockHolder(session, stockldeger, address);
	}
	
	createBlankStockHolderObject(session, stockledger) {
		return new this.StockHolder(session, stockledger);
	}
	
	getStockHolderObjectFromAddress(stockledger, address) {
		return stockledger.getChainStakeHolderFromAddress(address);
	}
	
	getStockHoldersFromJsonArray(session, stockledger, jsonarray) {
		return this.StockHolder.getStockHoldersFromJsonArray(this, session, stockledger, jsonarray)
	}
	
	// issuances
	createBlankStockIssuanceObject(session, stockledger) {
		return new this.StockIssuance(session, stockledger);
	}
	
	getStockIssuancesFromJsonArray(session, stockledger, jsonarray) {
		return this.StockIssuance.getStockIssuancesFromJsonArray(this, session, stockledger, jsonarray)
	}
	
	// transactions
	createBlankStockTransactionObject(session, stockledger) {
		return new this.StockTransaction(session, stockledger);
	}
	
	getStockTransactionsFromJsonArray(session, stockledger, jsonarray) {
		return this.StockTransaction.getStockTransactionsFromJsonArray(this, session, stockledger, jsonarray)
	}
	
	// contract part 
	ownsContract(contract) {
		var session = this._getSessionObject();
		
		if (session.isAnonymous())
			return false;
		
		if (!contract)
			return false;
		
		var contractowneraccount = contract.getSyncChainOwnerAccount();
		
		console.log("contract owner is " + contract.getOwner() + " account is " + contractowneraccount.getAddress());
		
		return session.isSessionAccount(contractowneraccount);
	}
	
	
	// decryption (asymmetric)
	decryptContractStakeHolderIdentifier(contract, stakeholder) {
		var session = this._getSessionObject();
		
		
		//var sessionaccountaddress = session.getSessionAccountAddress();
		var stakeholdercreatoraddress = stakeholder.getChainCreatorAddress();
		
		var contractowneraccount = contract.getSyncChainOwnerAccount();
		var contractowneraddress = contractowneraccount.getAddress();
		
		if (session.isSessionAccountAddress(stakeholdercreatoraddress)) {
			var cocryptedIdentifier;
			
			if (contractowneraddress == stakeholder.getAddress()) {
				cocryptedIdentifier = contract.getOwnerStakeHolderObject().getChainCocryptedIdentifier();
				// look at the overloaded version of stakeholder object
			}
			else {
				cocryptedIdentifier = stakeholder.getChainCocryptedIdentifier();
			}
			
			// we created this stakeholder, look for assymmetric description of contract segment
			//var senderaccount = session.getFirstSessionAccountObject();
			var senderaccount = session.getSessionAccountObject(stakeholdercreatoraddress);
			//var recipientaccount = session.getFirstSessionAccountObject();
			var recipientaccount = session.getSessionAccountObject(stakeholdercreatoraddress);

			return recipientaccount.rsaDecryptString(cocryptedIdentifier, senderaccount);
		}
		else {
			var creatoraccount = session.getAccountObject(stakeholdercreatoraddress);
			
			if (session.isSessionAccountAddress(contractowneraddress)) {
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
				//var recipientaccount = session.getFirstSessionAccountObject();
				var recipientaccount = session.getSessionAccountObject(contractowneraddress);
				
				return recipientaccount.rsaDecryptString(cocryptedIdentifier, senderaccount);
			}
			else {
				// we can not decrypt the identifier
				return stakeholder.getChainCreatorCryptedIdentifier();
			}
				
			
		}
	}
	
	decryptContractStakeHolderPrivateKey(contract, stakeholder) {
		var session = this._getSessionObject();
		
		//var sessionaccountaddress = session.getSessionAccountAddress();
		var stakeholdercreatoraddress = stakeholder.getChainCreatorAddress();
		var contractowneraccount = contract.getSyncChainOwnerAccount();
		var contractowneraddress = contractowneraccount.getAddress();
		
		if (session.isSessionAccountAddress(stakeholdercreatoraddress)) {
			// we created this stakeholder, look for asymmetricmmetric decryption of our part
			//var senderaccount = session.getFirstSessionAccountObject();
			var senderaccount = session.getSessionAccountObject(stakeholdercreatoraddress);
			//var recipientaccount = session.getFirstSessionAccountObject();
			var recipientaccount = session.getSessionAccountObject(stakeholdercreatoraddress);

			return recipientaccount.rsaDecryptString(stakeholder.getChainCocryptedPrivKey(), senderaccount);
		}
		else {
			var creatoraccount = session.getAccountObject(stakeholdercreatoraddress);
			if (session.isSessionAccountAddress(contractowneraddress)) {
				// we own the contract  and look for stakeholder who encrypted the private key when registering his/her account
				// sender is stakeholder's account
				var stakeholderaccount = stakeholder.getAccountObject(); // fills rsa key if necessary
				
				var senderaccount = stakeholderaccount;
				//var recipientaccount = session.getFirstSessionAccountObject();
				var recipientaccount = session.getSessionAccountObject(contractowneraddress);

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
		var session = this._getSessionObject();
		
		//var sessionaccountaddress = session.getSessionAccountAddress();
		
		var stakeholdercreatoraddress = stakeholder.getChainCreatorAddress();
		
		var contractowneraccount = contract.getSyncChainOwnerAccount();
		var contractowneraddress = contractowneraccount.getAddress();
		
		if (session.isSessionAccountAddress(stakeholdercreatoraddress)) {
			// we created this stakeholder, look for symmetric decryption of our part
			var sessionaccount = session.getSessionAccountObject(stakeholdercreatoraddress);

			return sessionaccount.aesDecryptString(stakeholder.getChainCreatorCryptedDescription());
		}
		else {
			var creatoraccount = session.getAccountObject(stakeholdercreatoraddress);
			if (session.isSessionAccountAddress(contractowneraddress)) {
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
		var session = this._getSessionObject();
		
		//var sessionaccountaddress = session.getSessionAccountAddress();
		
		var stakeholdercreatoraddress = stakeholder.getChainCreatorAddress();
		
		var contractowneraccount = contract.getSyncChainOwnerAccount();
		var contractowneraddress = contractowneraccount.getAddress();
		
		if (session.isSessionAccountAddress(stakeholdercreatoraddress)) {
			// we created this stakeholder, look for symmetric decryption of our part
			var sessionaccount = session.getSessionAccountObject(stakeholdercreatoraddress);
			
			return sessionaccount.aesDecryptString(stakeholder.getChainCreatorCryptedIdentifier());
		}
		else {
			var creatoraccount = session.getAccountObject(stakeholdercreatoraddress);
			if (session.isSessionAccountAddress(contractowneraddress)) {
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
		var session = this._getSessionObject();
		
		//var sessionaccountaddress = session.getSessionAccountAddress();
		
		var stakeholderaddress = stakeholder.getAddress();
		var stakeholderaccount = session.getAccountObject(stakeholderaddress);

		var stakeholdercreatoraddress = stakeholder.getChainCreatorAddress();

		var contractowneraccount = contract.getSyncChainOwnerAccount();
		var contractowneraddress = contractowneraccount.getAddress();
		
		if (session.isSessionAccountAddress(stakeholderaddress)) {
			// we are the stakeholder, do asymmetric decryption with our private key
			var stkldrcreator = contract.getChainStakeHolderFromAddress(stakeholdercreatoraddress);
			var creatoraccount = stkldrcreator.getAccountObject(); // fills rsa key if necessary
			
			var senderaccount = creatoraccount;
			//var recipientaccount = session.getFirstSessionAccountObject();
			var recipientaccount = session.getSessionAccountObject(stakeholderaddress);

			return recipientaccount.rsaDecryptString(stakeholder.getChainStakeHolderCryptedDescription(), senderaccount);
		}
		else {
			if (session.isSessionAccountAddress(contractowneraddress)) {
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
		var session = this._getSessionObject();
		
		//var sessionaccountaddress = session.getSessionAccountAddress();
		
		var stakeholderaddress = stakeholder.getAddress();
		var stakeholderaccount = session.getAccountObject(stakeholderaddress);

		var stakeholdercreatoraddress = stakeholder.getChainCreatorAddress();

		var contractowneraccount = contract.getSyncChainOwnerAccount();
		var contractowneraddress = contractowneraccount.getAddress();
		
		if (session.isSessionAccountAddress(stakeholderaddress)) {
			// we are the stakeholder, do asymmetric decryption with our private key
			var stkldrcreator = contract.getChainStakeHolderFromAddress(stakeholdercreatoraddress);
			var creatoraccount = stkldrcreator.getAccountObject(); // fills rsa key if necessary
			
			var senderaccount = creatoraccount;
			//var recipientaccount = session.getFirstSessionAccountObject();
			var recipientaccount = session.getSessionAccountObject(stakeholderaddress);

			return recipientaccount.rsaDecryptString(stakeholder.getChainStakeHolderCryptedIdentifier(), senderaccount);
		}
		else {
			if (session.isSessionAccountAddress(contractowneraddress)) {
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

GlobalClass.getGlobalObject().registerModuleObject(new Module());

// dependencies
GlobalClass.getGlobalObject().registerModuleDepency('securities', 'common');