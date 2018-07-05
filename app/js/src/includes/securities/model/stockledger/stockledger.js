/**
 * 
 */
'use strict';

class StockLedger {
	constructor(session, contractaddress) {
		this.session = session;
		this.address = contractaddress;
		
		this.uuid = null;

		this.status = Securities.STATUS_LOCAL;

		// local data
		this.contractindex = null; // index in list of contracts

		this.localowner = null;
		this.localowneridentifier = null;
		this.localledgername = null;
		this.localledgerdescription = null;
		
		this.local_creation_date = new Date().getTime();
		this.local_submission_date = null;
		
		// blockchain data
		this.contract_name = null;
		this.contract_version = null;

		// company
		this.owner = null;
		this.owner_rsa_pubkey = null;

		this.ledger_name = null;
		this.cocrypted_ledger_description = null;
		
		this.creation_date = null; // unix time
		this.creation_block_date = null; // now in block number
		
		this.replaced_by = null;
		this.replacement_date = null; // unix time
		this.replacement_block_date = null; // now in block number
		
		// operating variables
		this.finalized_init = null;
		
		this.contractlocalpersistor = null;
		this.contractinterface = null;
		
		// arrays
		this.chainaccountarray = [];

		this.localstakeholderarray = [];
		this.chainstakeholderarray = [];
		
		this.localstockissuancearray = [];
		this.chainstockissuancearray = [];
		
		this.localstocktransactionarray = [];
		this.chainstocktransactionarray = [];
	}
	
	getSecuritiesModuleObject() {
		var global = GlobalClass.getGlobalObject();
		var securitiesmodule = global.getModuleObject('securities');
		return securitiesmodule;
	}
	
	getAddress() {
		return this.address;
	}
	
	setAddress(address) {
		this.address = address;
	}
	
	getContractType() {
		return 'StockLedger';
	}
	
	getUUID() {
		if (this.uuid)
			return this.uuid;
		
		this.uuid = this.session.getUUID();
		
		return this.uuid;
	}
	
	getContractLocalPersistor() {
		if (this.contractlocalpersistor)
			return this.contractlocalpersistor;
		
		var session = this.session;
		var contractuuid = this.getUUID();
		
		var global = GlobalClass.getGlobalObject();
		var securitiesmodule = global.getModuleObject('securities');
		
		this.contractlocalpersistor = new securitiesmodule.StockLedgerLocalPersistor(session, contractuuid)
		
		return this.contractlocalpersistor;
	}
	
	
	
	getOwner() {
		if (this.isLocalOnly())
			return this.getLocalOwner();
		else
			return this.getSyncChainOwner();
	}
	
	getOwnerAccount() {
		if (this.isLocalOnly())
			return this.session.getAccountObject(this.getLocalOwner());
		else
			return this.getSyncChainOwnerAccount();
		
	}
	
	getOwnerStakeHolderObject() {
		console.log('StockLedger.getOwnerStakeHolderObject called for ' + this.address);

		var stakeholder = this.getSyncChainOwnerStakeHolderObject();
		
		if (stakeholder.getChainCocryptedIdentifier() == "0x")
			this.overloadOwnerStakeHolderObject(); // if not overloaded, try to do it for this session
		
		return stakeholder;
	}
	
	overloadOwnerStakeHolderObject() {
		var stakeholder = this.getSyncChainOwnerStakeHolderObject();

		var session = this.session;
		var accountaddress = stakeholder.getAddress();
		
		console.log('StockLedger.overloadOwnerStakeHolderObject called for ' + this.address);
		
		if (session.isSessionAccountAddress(accountaddress)) {
			var sessionaccount = session.getSessionAccountObject();
			
			console.log('overloading owner\'s stakeholder object for ' + this.address);

			// we overload contract's element for the owner
			// that contract did not save

			
			// getting elements
			var _cocrypted_ledger_description = this.cocrypted_ledger_description;
		
			var _shldr_identifier = sessionaccount.aesDecryptString(stakeholder.getChainCreatorCryptedIdentifier());
			var _shldr_privkey = sessionaccount.getPrivateKey();

			// filling by mimicking registerStakeHolderAccount encryption steps
			var creator = sessionaccount;
			var contractowneraccount = sessionaccount;
			var stakeholderaccount = sessionaccount;
			
			var _contractdescription = creator.aesDecryptString(_cocrypted_ledger_description);
			
	        var _cocrypted_shldr_privkey = creator.rsaEncryptString(_shldr_privkey, contractowneraccount);
	        var _cocrypted_shldr_identifier =  creator.rsaEncryptString(_shldr_identifier, contractowneraccount);
	        
	        var _crtcrypted_shldr_description_string = creator.aesEncryptString(_contractdescription);
	        
	        var _shldrcrypted_shldr_description_string = creator.rsaEncryptString(_contractdescription, stakeholderaccount);
	        var _shldrcrypted_shldr_identifier = creator.rsaEncryptString(_shldr_identifier, stakeholderaccount);
			
	        var _signature  = session.signString(stakeholder.getChainOrderId());
			
	    	
	        // overloading values in stakeholder object
	        stakeholder.setChainCocryptedPrivKey(_cocrypted_shldr_privkey);
	    	stakeholder.setChainCocryptedIdentifier(_cocrypted_shldr_identifier);
	    	
	    	stakeholder.setChainCreatorCryptedDescription(_crtcrypted_shldr_description_string);

	    	stakeholder.setChainSignature(_signature);
	    	
	    	stakeholder.setChainStakeHolderCryptedDescription(_shldrcrypted_shldr_description_string);
	    	stakeholder.setChainStakeHolderCryptedIdentifier(_shldrcrypted_shldr_identifier);
			
		}
	}
	
	resetOwnerStakeHolderObject() {
		console.log('StockLedger.resetOwnerStakeHolderObject called for ' + this.address);
		
		var stakeholder = this.getSyncChainOwnerStakeHolderObject();
		
		var _contractdescription = "0x";
		
        var _cocrypted_shldr_privkey = "0x";
        var _cocrypted_shldr_identifier =  "0x";
        
        var _crtcrypted_shldr_description_string = "0x";
        
        var _shldrcrypted_shldr_description_string = "0x";
        var _shldrcrypted_shldr_identifier = creator.rsaEncryptString(_shldr_identifier, stakeholderaccount);
		
        var _signature  = "0x";
		
    	
        // overloading values in stakeholder object
        stakeholder.setChainCocryptedPrivKey(_cocrypted_shldr_privkey);
    	stakeholder.setChainCocryptedIdentifier(_cocrypted_shldr_identifier);
    	
    	stakeholder.setChainCreatorCryptedDescription(_crtcrypted_shldr_description_string);

    	stakeholder.setChainSignature(signature);
    	
    	stakeholder.setChainStakeHolderCryptedDescription(_shldrcrypted_shldr_description_string);
    	stakeholder.setChainStakeHolderCryptedIdentifier(_shldrcrypted_shldr_identifier);
	}
		
	
	// initialization of object
	initContract(json) {
		console.log('StockLedger.initContract called for ' + this.address);
		
		// load local ledger elements (if any)
		var securitiesmodule = this.getSecuritiesModuleObject();
		var session = this.session;
		
		if (json["uuid"])
			this.uuid = json["uuid"];
		
		if (json["status"])
			this.setStatus(json["status"]);
		
		if (json["description"])
			this.setLocalLedgerDescription(json["description"]);
		
		if (json["ledgername"])
			this.setLocalLedgerName(json["ledgername"]);

		if (json["owner"])
			this.setLocalOwner(json["owner"]);
			
		if (json["owneridentifier"])
			this.setLocalOwnerIdentifier(json["owneridentifier"]);
			
		if (json["creationdate"])
			this.setLocalCreationDate(json["creationdate"]);
			
		if (json["submissiondate"])
			this.setLocalSubmissionDate(json["submissiondate"]);
			
		// load pending shareholders
		if (json['stakeholders']) {
			console.log('reading array of ' + json['stakeholders'].length + ' stakeholders');
			
			var localstakeholderarray = securitiesmodule.getStockHoldersFromJsonArray(session, this, json['stakeholders']);
			
			for (var i = 0; i < localstakeholderarray.length; i++) {
				this.addLocalStakeHolder(localstakeholderarray[i]);
			}
		}
		
		// load pending issuances
		if (json['issuances']) {
			console.log('reading array of ' + json['issuances'].length + ' issuances');
			
			var localissuancearray = securitiesmodule.getStockIssuancesFromJsonArray(session, this, json['issuances']);
			
			for (var i = 0; i < localissuancearray.length; i++) {
				this.addLocalIssuance(localissuancearray[i]);
			}
		}
		
		// load pending transaction
		if (json['transactions']) {
			console.log('reading array of ' + json['transactions'].length + ' issuances');
			
			var localtransactionarray = securitiesmodule.getStockTransactionsFromJsonArray(session, this, json['transactions']);
			
			for (var i = 0; i < localtransactionarray.length; i++) {
				this.addLocalTransaction(localtransactionarray[i]);
			}
		}
		

		// chain elements
		// postpone initialization necessary for blockchain members to finalizeInit(callback)
	}
	
	getLocalJson() {
		// ledger part
		var uuid = this.getUUID();
		var address = this.getAddress();
		var contracttype = this.getContractType();
		
		
		var status = this.getStatus();
		
		var description = this.getLocalDescription();
		
		var ledgername = this.getLocalLedgerName();
		var owner = this.getLocalOwner();
		var owneridentifier = this.getLocalOwnerIdentifier();
		
		var creationdate= this.getLocalCreationDate();
		var submissiondate= this.getLocalSubmissionDate();

		var json = {uuid: uuid, address: address, contracttype: contracttype, status: status, 
				creationdate: creationdate, submissiondate: submissiondate,
				description: description, ledgername: ledgername, owner: owner, owneridentifier: owneridentifier};
		
		// stakeholder list
		if (this.localstakeholderarray) {
			var jsonarray = []

			for (var i = 0; i < this.localstakeholderarray.length; i++) {
				var stakeholder = this.localstakeholderarray[i];
				
				if (stakeholder.isLocalOnly()) {
					var jsonelement = stakeholder.getLocalJson();
					console.log('json is  ' + jsonelement);
					jsonarray.push(jsonelement);
				}
			}
			
			//console.log('returning ' + jsonarray.length + ' local stakeholders');
			json['stakeholders'] = jsonarray;
		}
		
		// issuance list
		if (this.localstockissuancearray) {
			var jsonarray = []

			for (var i = 0; i < this.localstockissuancearray.length; i++) {
				var issuance = this.localstockissuancearray[i];
				
				if (issuance.isLocalOnly()) {
					var jsonelement = issuance.getLocalJson();
					console.log('json is  ' + jsonelement);
					jsonarray.push(jsonelement);
				}
			}
			
			//console.log('returning ' + jsonarray.length + ' local issuances');
			json['issuances'] = jsonarray;
		}
		
		// transaction list
		if (this.localstocktransactionarray) {
			var jsonarray = []

			for (var i = 0; i < this.localstocktransactionarray.length; i++) {
				var transaction = this.localstocktransactionarray[i];
				
				if (transaction.isLocalOnly()) {
					var jsonelement = transaction.getLocalJson();
					console.log('json is  ' + jsonelement);
					jsonarray.push(jsonelement);
				}
			}
			
			//console.log('returning ' + jsonarray.length + ' local transactions');
			json['transactions'] = jsonarray;
		}
		
		
		
		
		return json;
	}
	
	saveLocalJson() {
		var persistor = this.getContractLocalPersistor();
		
		persistor.saveStockledgerJson(this);
	}
	
	//
	// collections
	//
	
	// accounts
	getChainAccounts() {
		return this.chainaccountarray;
	}
	
	getChainAccountFromAddress(address) {
		if (!address)
			return;
		
		var session = this.session;
		
		for (var i = 0; i < this.chainaccountarray.length; i++) {
			var account = this.chainaccountarray[i];
			
			if ((account) && (session.areAddressesEqual(account.getAddress(),address)))
				return account;
		}
	}
	
	addChainAccountAt(account, index) {
		this.chainaccountarray[index] = account;
	}
	
	
	
	// stakeholders
	getStakeHolderFromKey(index) {
		var stakeholder;
		var i;
		
		// local first
		for (i = 0; i < this.localstakeholderarray.length; i++) {
			stakeholder = this.localstakeholderarray[i];
			
			if ((stakeholder) && (stakeholder.getStakeHolderIndex() == index))
				return stakeholder;
		}
		
		// then chain
		for (i = 0; i < this.chainstakeholderarray.length; i++) {
			stakeholder = this.chainstakeholderarray[i];
			
			if ((stakeholder) && (stakeholder.getStakeHolderIndex() == index))
				return stakeholder;
		}
	}
	
	removeStakeHolderObject(stakeholder) {
		if (!stakeholder)
			return;
		
		var key = stakeholder.getStakeHolderIndex();
		var i;
		var stakehldr;
		
		if (stakeholder.isLocalOnly()) {
			// local
			for (i = 0; i < this.localstakeholderarray.length; i++) {
				stakehldr = this.localstakeholderarray[i];
				
				if ((stakehldr) && (stakehldr.getStakeHolderIndex() == key))
					this.localstakeholderarray.splice(i, 1);
			}
		}
		else {
			// chain
			for (i = 0; i < this.chainstakeholderarray.length; i++) {
				stakehldr = this.chainstakeholderarray[i];
				
				if ((stakehldr) && (stakehldr.getStakeHolderIndex() == key))
					this.chainstakeholderarray.splice(i, 1);
			}
			
		}

		
	}
	
	getLocalStakeHolders() {
		return this.localstakeholderarray;
	}
	
	addLocalStakeHolder(stakeholder) {
		var length = this.localstakeholderarray.length;
		this.localstakeholderarray.push(stakeholder);
		
		var key = "key" + Math.floor((Math.random() * 1000) + 1) + "-index" + length;
		stakeholder.setStakeHolderIndex(key);
	}
	
	findLocalStakeHolderFromOrderId(orderid) {
		var stakeholder;
		var i;
		
		// local array
		for (i = 0; i < this.localstakeholderarray.length; i++) {
			stakeholder = this.localstakeholderarray[i];
			
			if ((stakeholder) && (stakeholder.getLocalOrderId() == orderid))
				return stakeholder;
		}
		
	}
	
	getChainStakeHolders() {
		return this.chainstakeholderarray;
	}
	
	getChainStakeHolderFromAddress(address) {
		if (!address)
			return;
		
		var session = this.session;
		
		for (var i = 0; i < this.chainstakeholderarray.length; i++) {
			var stakeholder = this.chainstakeholderarray[i];
			
			if ((stakeholder) && (session.areAddressesEqual(stakeholder.getAddress(),address))) {
					return stakeholder;
			}
		}
	}
	
	addChainStakeHolderAt(stakeholder, index) {
		this.chainstakeholderarray[index] = stakeholder;
		
		var key = "key" + Math.floor((Math.random() * 1000) + 1) + "-index" + index;
		stakeholder.setStakeHolderIndex(key);
	}
	
	// issuances
	getIssuanceFromKey(key) {
		var issu;
		var i;
		
		// local first
		for (i = 0; i < this.localstockissuancearray.length; i++) {
			issu = this.localstockissuancearray[i];
			
			if ((issu) && (issu.getIssuanceIndex() == key))
				return issu;
		}
		
		// then chain
		for (i = 0; i < this.chainstockissuancearray.length; i++) {
			issu = this.chainstockissuancearray[i];
			
			if ((issu) && (issu.getIssuanceIndex() == key))
				return issu;
		}
	}
	
	removeIssuanceObject(issuance) {
		if (!issuance)
			return;
		
		var key = issuance.getIssuanceIndex();
		var i;
		var issu;
		
		if (issuance.isLocalOnly()) {
			// local
			for (i = 0; i < this.localstockissuancearray.length; i++) {
				issu = this.localstockissuancearray[i];
				
				if ((issu) && (issu.getIssuanceIndex() == key))
					this.localstockissuancearray.splice(i, 1);
			}
		}
		else {
			// chain
			for (i = 0; i < this.chainstockissuancearray.length; i++) {
				issu = this.chainstockissuancearray[i];
				
				if ((issu) && (issu.getIssuanceIndex() == key))
					this.chainstockissuancearray.splice(i, 1);
			}
			
		}

		
	}
	
	
	getLocalIssuances() {
		return this.localstockissuancearray;
	}
	
	addLocalIssuance(issuance) {
		var length = this.localstockissuancearray.length;
		this.localstockissuancearray.push(issuance);
		
		var key = "key" + Math.floor((Math.random() * 1000) + 1) + "-index" + length;
		issuance.setIssuanceIndex(key);
	}
	
	findLocalIssuanceFromOrderId(orderid) {
		var issu;
		var i;
		
		// local first
		for (i = 0; i < this.localstockissuancearray.length; i++) {
			issu = this.localstockissuancearray[i];
			
			if ((issu) && (issu.getLocalOrderId() == orderid))
				return issu;
		}
	}
	
	getChainIssuances() {
		return this.chainstockissuancearray;
	}
	
	addChainIssuanceAt(issuance, index) {
		this.chainstockissuancearray[index] = issuance;
		
		var key = "key" + Math.floor((Math.random() * 1000) + 1) + "-index" + index;
		issuance.setIssuanceIndex(key);
	}
	
	// transactions
	getTransactionFromKey(key) {
		var tx;
		var i;
		
		// local first
		for (i = 0; i < this.localstocktransactionarray.length; i++) {
			tx = this.localstocktransactionarray[i];
			
			if ((tx) && (tx.getTransactionIndex() == key))
				return tx;
		}
		
		// then chain
		for (i = 0; i < this.chainstocktransactionarray.length; i++) {
			tx = this.chainstocktransactionarray[i];
			
			if ((tx) && (tx.getTransactionIndex() == key))
				return tx;
		}
	}
	
	removeTransactionObject(transaction) {
		if (!transaction)
			return;
		
		var key = transaction.getTransactionIndex();
		var i;
		var tx;
		
		console.log("looking for transaction with key " + key);
		
		if (transaction.isLocalOnly()) {
			// local
			for (i = 0; i < this.localstocktransactionarray.length; i++) {
				tx = this.localstocktransactionarray[i];
				console.log("transaction at ' + i + ' has key " + tx.getTransactionIndex());
				
				if ((tx) && (tx.getTransactionIndex() == key))
					this.localstocktransactionarray.splice(i, 1);

			}
		}
		else {
			// chain
			for (i = 0; i < this.chainstocktransactionarray.length; i++) {
				tx = this.chainstocktransactionarray[i];
				
				if ((tx) && (tx.getTransactionIndex() == key))
					this.chainstocktransactionarray.splice(i, 1);
			}
			
		}

		
	}
	
	getLocalTransactions() {
		return this.localstocktransactionarray;
	}
	
	addLocalTransaction(transaction) {
		var length = this.localstocktransactionarray.length;
		this.localstocktransactionarray.push(transaction);
		
		var key = "key" + Math.floor((Math.random() * 1000) + 1) + "-index" + length;
		transaction.setTransactionIndex(key);
	}
	
	findLocalTransactionFromOrderId(orderid) {
		var tx;
		var i;
		
		for (i = 0; i < this.localstocktransactionarray.length; i++) {
			tx = this.localstocktransactionarray[i];
			
			if ((tx) && (tx.getLocalOrderId() == orderid))
				return tx;
		}
	}
	
	getChainTransactions() {
		return this.chainstocktransactionarray;
	}
	
	addChainTransactionAt(transaction, index) {
		this.chainstocktransactionarray[index] = transaction;
		
		var key = "key" + Math.floor((Math.random() * 1000) + 1) + "-index" + index;
		transaction.setTransactionIndex(key);
	}
	
	
	
	// local part
	isLocalOnly() {
		if (this.address == null)
			return true;
		else
			return false;
	}
	
	isLocal() {
		return true; // necessarily true for contracts
	}
	
	isOnChain() {
		return (this.status == Securities.STATUS_ON_CHAIN);
	}
	
	getStatus() {
		return this.status;
	}
	
	checkStatus(callback) {
		if (this.address == null) {
			var status = this.getStatus();
			
			if (callback)
				callback(null, status);
			
			return status;
		}
		
		var self = this;
		
		this.getChainContractVersion(function(err, res) {
			if (res) {
				self.setStatus(Securities.STATUS_ON_CHAIN);
			}
			
			if ((err) || (!res)) {
				var currenttatus = self.getStatus();
				
				switch(currenttatus) {
				case Securities.STATUS_LOCAL:
					case Securities.STATUS_LOST:
					case Securities.STATUS_NOT_FOUND:
					case Securities.STATUS_SENT:
					case Securities.STATUS_PENDING:
					case Securities.STATUS_CANCELLED:
					case Securities.STATUS_REJECTED:
						break;
					
					case Securities.STATUS_DEPLOYED:
					case Securities.STATUS_ON_CHAIN:
						self.setStatus(Securities.STATUS_NOT_FOUND);
						break;
					default:
						self.setStatus(Securities.STATUS_UNKOWN);
						break;
				}
				
				if (currenttatus == Securities.STATUS_ON_CHAIN)
				self.setStatus(Securities.STATUS_LOST);
			}
			
			var status = self.getStatus();
			
			if (callback)
				callback(null, status);
			
			return status;
		});
	}
	
	setStatus(status) {
		switch(status) {
			case Securities.STATUS_LOST:
			case Securities.STATUS_NOT_FOUND:
			case Securities.STATUS_LOCAL:
			case Securities.STATUS_SENT:
			case Securities.STATUS_PENDING:
			case Securities.STATUS_DEPLOYED:
			case Securities.STATUS_CANCELLED:
			case Securities.STATUS_REJECTED:
			case Securities.STATUS_ON_CHAIN:
				this.status = status;
				break;
			default:
				// do not change for a unknown status
				break;
		}
	}
	
	getContractIndex() {
		return this.contractindex;
	}
	
	setContractIndex(index) {
		return this.contractindex = index;
	}
	
	getLocalDescription() {
		return this.getLocalLedgerDescription();
	}
	
	setLocalDescription(description) {
		this.setLocalLedgerDescription(description);
	}
	
	getLocalLedgerName() {
		return this.localledgername;
	}
	
	setLocalLedgerName(localledgername) {
		this.localledgername = localledgername;
	}
	
	getLocalLedgerDescription() {
		var address_string = (this.address ? this.address.toString() : null);
		var trailer = (address_string ? address_string.substring(0, 7) + "..." + address_string.substr(this.address.length - 3) : 'notdeployed'); 
		return (this.localledgerdescription ? this.localledgerdescription : 'stockledger-' + trailer);
	}
	
	setLocalLedgerDescription(description) {
		this.localledgerdescription = description;
	}
	
	getLocalOwner() {
		return this.localowner;
	}
	
	setLocalOwner(localowner) {
		this.localowner = localowner;
	}
	
	getLocalOwnerIdentifier() {
		return this.localowneridentifier;
	}
	
	setLocalOwnerIdentifier(localowneridentifier) {
		this.localowneridentifier = localowneridentifier;
	}
	
	getLocalCreationDate() {
		return this.local_creation_date;
	}
	
	setLocalCreationDate(creation_date) {
		this.local_creation_date = creation_date;
	}
	
	getLocalSubmissionDate() {
		return this.local_submission_date;
	}
	
	setLocalSubmissionDate(submission_date) {
		this.local_submission_date = submission_date;
	}
	
	// chain side
	
	getContractInterface() {
		if (this.contractinterface)
			return this.contractinterface;
		
		var session = this.session;
		var contractaddress = this.address;
		
		var global = GlobalClass.getGlobalObject();
		var securitiesmodule = global.getModuleObject('securities');
		
		this.contractinterface = new securitiesmodule.StockLedgerContractInterface(session, contractaddress)
		
		return this.contractinterface;
	}
	
	getContractInstance() {
		if (this.contractinstance)
			return this.contractinstance;
		
		this.contractinstance = this.getContractInterface().getContractInstance();
		
		return this.contractinstance;
	}
	
	
	// deployment
	validateLedgerDeployment(payingaccount, owningaccount, gas, gasPrice, callback) {
		// we check the account is unlocked
		if (payingaccount.isLocked())
			throw 'account ' + payingaccount.getAddress() + ' is locked, unable to deploy contract: ' + this.localledgerdescription;
		
		// we validate we are signed-in with the correct owning account
		var session = this.session;
		
		if (!session.isSessionAccount(owningaccount))
			throw 'account ' + owningaccount.getAddress() + ' is not currently signed-in';
		
		return true;
	}
	
	deploy(payingaccount, owningaccount, gas, gasPrice, callback) {
		var self = this;
		var session = this.session;

		var fromaddress = payingaccount.getAddress();
		
		console.log('StockLedger.deploy called for ' + this.localledgerdescription + " from " + fromaddress + " with gas limit " + gas + " and gasPrice " + gasPrice);
		
		
		// we validate the transaction
		if (!this.validateLedgerDeployment(payingaccount, owningaccount, gas, gasPrice, callback))
			return;
		
		var contractinterface = this.getContractInterface();
		
		var contractowner = this.localowner;

		if (!session.areAddressesEqual(owningaccount.getAddress(), contractowner)) {
			throw 'Mismatch on the owner of the contract';
		}
		
		if (!owningaccount.canDoAesEncryption) {
			throw 'Can not encrypt data for the owner of the contract';
		}
		
		var contractownerpublkey = owningaccount.getRsaPublicKey();
		var cryptedowneridentifier = owningaccount.aesEncryptString(self.localowneridentifier);
		var ledgername = self.localledgername;
		var cryptedledgerdescription = owningaccount.aesEncryptString(self.localledgerdescription);
		
		self.setLocalSubmissionDate(new Date().getTime());
		
		var promise = contractinterface.deploy(contractowner, contractownerpublkey,	cryptedowneridentifier,	ledgername,	cryptedledgerdescription, payingaccount, owningaccount, gas, gasPrice)
		.then(function(res) {
			console.log('StockLedger.deploy promise of deployment should be resolved');
			
			self.setStatus(Securities.STATUS_PENDING); // we'll set to deploy when we see the contract through an activate
			self.setAddress(contractinterface.getAddress());
			
			if (callback)
				callback(null, res);
			
			return res;
		});

	}
	
	// account
	validateAccountRegistration(payingaccount, gas, gasPrice, account, callback) {
		// we check the account is unlocked
		if (payingaccount.isLocked())
			throw 'account ' + payingaccount.getAddress() + ' is locked, unable to register account: ' + account.getAddress();
		
		// we validate we have a bona fide private key
		var privkey = account.getPrivateKey();
		
		if (!privkey)
			throw 'no private key set, impossible to register account: ' + account.getAddress();
			
		return true;
	}

	
	
	registerAccount(payingaccount, gas, gasPrice, account, callback) {
		var self = this;
		var session = this.session;

		var fromaddress = payingaccount.getAddress();
		
		var accountaddress = account.getAddress();
		
		console.log('StockLedger.registerAccount called for ' + accountaddress + " from " + fromaddress + " with gas limit " + gas + " and gasPrice " + gasPrice);
		
		
		// we validate the transaction
		if (!this.validateAccountRegistration(payingaccount, gas, gasPrice, account, callback))
			return;
		
		var promise = this.finalizeInit(function (res) {
			if (!res)
				return callback("contract did not finalize its initialization", null);

			return res;
			
		}).then(function (res) {
			var callfunc = function(contractint) {
				
				var contractinterface = self.getContractInterface();

				var _acct_address = account.getAddress();
				var _rsa_pubkey = account.getRsaPublicKey();
				var _ece_pubkey = account.getAesPublicKey();
				
				var _acct_privkey = account.getPrivateKey();
				
				var contractowneraccount = self.getSyncChainOwnerAccount();
				
				if (!contractowneraccount.canDoRsaEncryption) {
					throw 'Can not encrypt data for the owner of the contract';
				}
				
				var _cocrypted_acct_privkey = account.rsaEncryptString(_acct_privkey, contractowneraccount);
				
				console.log('registering a shareholder with address ' + _acct_address);
				return contractinterface.registerAccount(_acct_address, _rsa_pubkey, _ece_pubkey, _cocrypted_acct_privkey,
						payingaccount, gas, gasPrice);
				
			 };
		
			 if (self.contractinterface)
			 return callfunc(self.contractinterface);
		
		})
		.then(function (res) {
	    	console.log('returning from registerAccount with return ' + res);
	    	if (callback)
				callback(null, res);
	    	
	    	return res;
		});
		
		return promise;
		
	}
	
	// shareholder
	validateStakeHolderRegistration(payingaccount, gas, gasPrice, stakeholder, callback) {
		// we check the account is unlocked
		if (payingaccount.isLocked())
			throw 'account ' + payingaccount.getAddress() + ' is locked, unable to register shareholder: ' + stakeholder.getLocalIdentifier();
		
		// we validate we are signed-in
		var session = this.session;
		
		if (session.isAnonymous())
			throw 'session is not currently signed-in';
		
		var shldr_privkey = stakeholder.getLocalPrivKey();
		
		if (!shldr_privkey) {
			var shldraddress = stakeholder.getAddress();
			
			if (!shldraddress) {
				throw 'no address set, impossible to register shareholder: ' + stakeholder.getLocalIdentifier();
			}
			else {
				var account = this.getChainAccountFromAddress(shldraddress);
				
				if (!account) {
					throw 'address ' + shldraddress + ' does not correspond to a registered account, impossible to register shareholder: ' + stakeholder.getLocalIdentifier();
				}
				else {
					var sessionaccountaddress = session.getSessionAccountAddress();
					
					if (!this.getChainStakeHolderFromAddress(sessionaccountaddress)) {
						throw 'not signed-in as a shareholder of the contract, impossible to register new shareholder: ' + stakeholder.getLocalIdentifier();
					}
					else {
						if (!account.cocrypted_acct_privkey) {
							throw 'no contract owner\'s encryption of private key available, impossible to register new shareholder: ' + stakeholder.getLocalIdentifier();
						}
					}
					
				}
				
				
				
			}
		}
		else {
			if (!session.ownsContract(this))
				throw 'session needs to be signed-in as the contract owner to register shareholder: ' + stakeholder.getLocalIdentifier();
		}
		
		return true;
	}

	registerStakeHolder(payingaccount, gas, gasPrice, stakeholder, callback) {
		var self = this;
		var session = this.session;

		var fromaddress = payingaccount.getAddress();
		
		var stakeholderidentifier = stakeholder.getLocalIdentifier();
		
		console.log('StockLedger.registerStakeHolder called for ' + stakeholderidentifier + " from " + fromaddress + " with gas limit " + gas + " and gasPrice " + gasPrice);
		
		
		// we validate the transaction
		if (!this.validateStakeHolderRegistration(payingaccount, gas, gasPrice, stakeholder, callback))
			return;
		
		var promise = this.getChainNextOrderId(function (err, res) {
			if (!res)
				return callback("contract could not get an order id to submit transaction: " + err, null);

			return Promise.resolve(res);
			
		}).then(function (res) {
			var _orderid = res;
			
			stakeholder._deployment = [];
			stakeholder._deployment['orderid'] = _orderid; // to find it back after deploy if successful
			
			var callfunc = function(contractint) {
				
				var contractinterface = self.getContractInterface();

				var _shldr_address = stakeholder.getAddress();
				var _shldr_rsa_pubkey = stakeholder.getChainRsaPubKey();
				
				var _shldr_identifier= stakeholder.getLocalIdentifier();
				var _shldr_privkey = stakeholder.getLocalPrivKey();
				
				var contractowneraccount = self.getSyncChainOwnerAccount();
				
				var stakeholderaccount = stakeholder.getAccountObject();
				
				var creator = session.getSessionAccountObject();
				var _creatoraddress = creator.getAddress();
				
				if (!contractowneraccount.canDoRsaEncryption) {
					throw 'Can not encrypt data for the owner of the contract';
				}
				
				var _cocrypted_shldr_privkey ;
				var _cocrypted_shldr_identifier =  creator.rsaEncryptString(_shldr_identifier, contractowneraccount);
				
				var _cocrypted_ledger_description = self.cocrypted_ledger_description;
				
				var _contractdescription;

				if (session.areAccountsEqual(creator, contractowneraccount)) {
					// stakeholder registered by contract's owner
					_cocrypted_shldr_privkey = creator.rsaEncryptString(_shldr_privkey, contractowneraccount);
					_contractdescription = creator.aesDecryptString(_cocrypted_ledger_description);
				}
				else {
					// stakeholder registered by another stakeholder
					var shldraddress = stakeholder.getAddress();
					var account = self.getChainAccountFromAddress(shldraddress);

					_cocrypted_shldr_privkey = account.cocrypted_acct_privkey; // we simply copy the encrypted key
					_contractdescription = 'description missing';
				}
				
				if (!creator.canDoAesEncryption) {
					throw 'Can not encrypt data for the creator of shareholder registration';
				}
				
				var _crtcrypted_shldr_description_string = creator.aesEncryptString(_contractdescription);
				var _crtcrypted_shldr_identifier = creator.aesEncryptString(_shldr_identifier);
				
				var _shldrcrypted_shldr_description_string = creator.rsaEncryptString(_contractdescription, stakeholderaccount);
				var _shldrcrypted_shldr_identifier = creator.rsaEncryptString(_shldr_identifier, stakeholderaccount);
				
				var _signature = session.signString(_orderid);

				
				var _registration_date = Date.now();
				
				console.log('registering a shareholder with address ' + _shldr_address + ' rsa public key ' + _shldr_rsa_pubkey + ' crypted private key ' + _cocrypted_shldr_privkey + ' crypted identifier ' + _cocrypted_shldr_identifier + ' registration date ' + _registration_date);
				
				stakeholder.setStatus(Securities.STATUS_SENT);
				stakeholder.setLocalSubmissionDate(_registration_date);
				
				return contractinterface.registerStakeHolder(_shldr_address, _shldr_rsa_pubkey, _cocrypted_shldr_privkey, _cocrypted_shldr_identifier, 
						_registration_date,	_creatoraddress, _crtcrypted_shldr_description_string, _crtcrypted_shldr_identifier,
						_orderid, _signature, _shldrcrypted_shldr_description_string, _shldrcrypted_shldr_identifier,
						payingaccount, gas, gasPrice);
				
			 };
		
			 if (self.contractinterface)
			 return callfunc(self.contractinterface);
		
		})
		.then(function(res) {
			console.log('StockLedger.registerStakeHolder promise of registration should be resolved');
			
			stakeholder.setStatus(Securities.STATUS_DEPLOYED);
			
			stakeholder.setLocalOrderId(stakeholder._deployment['orderid']);
			
			if (callback)
				callback(null, res);
			
			return res;
		});
		
		return promise;
		
	}
	
	// issuance
	validateIssuanceRegistration(payingaccount, gas, gasPrice, issuance, callback) {
		// we check the account is unlocked
		if (payingaccount.isLocked())
			throw 'account ' + payingaccount.getAddress() + ' is locked, unable to register issuance: ' + issuance.getLocalDescription();
		
		// we validate we are signed-in with the correct owning account
		var session = this.session;
		var owningaccount = this.getSyncChainOwnerAccount();
		
		if (!session.isSessionAccount(owningaccount))
			throw 'account ' + owningaccount.getAddress() + ' is not currently signed-in';

		return true;
	}
	
	registerIssuance(payingaccount, gas, gasPrice, issuance, callback) {
		var self = this;
		var session = this.session;
		
		var fromaddress = payingaccount.getAddress();
		
		var issuancedescription = issuance.getLocalDescription();
		
		console.log('StockLedger.registerIssuance called for ' + issuancedescription + " from " + fromaddress + " with gas limit " + gas + " and gasPrice " + gasPrice);
		
		
		// we validate the transaction
		if (!this.validateIssuanceRegistration(payingaccount, gas, gasPrice, issuance, callback))
			return;
		
		var promise = this.getChainNextOrderId(function (err, res) {
			if (!res)
				return callback("contract could not get an order id to submit transaction: " + err, null);

			return Promise.resolve(res);
			
		}).then(function (res) {
			var _orderid = res;

			issuance._deployment = [];
			issuance._deployment['orderid'] = _orderid; // to find it back after deploy if successful
			
			var callfunc = function(contractint) {
				
				var contractinterface = self.getContractInterface();

				var _name = issuance.getLocalName(); 
				var localdescription = issuance.getLocalDescription(); 
				var  _numberofshares = issuance.getLocalNumberOfShares(); 
				var  _percentofcapital = issuance.getLocalPercentOfCapital(); 
				
				var _type = issuance.getChainType();
				var _code = issuance.getLocalCode();
				
				_code = (_code ? _code : session.guid()); // we give a random uuid if none has been set

				var contractowneraccount = self.getSyncChainOwnerAccount();
				
				if (!contractowneraccount.canDoAesEncryption) {
					throw 'Can not encrypt data for the owner of the contract';
				}
				
				var _cocrypted_issuance_description = contractowneraccount.aesEncryptString(localdescription);
				
				
				var _registration_date = Date.now();
				
				var _signature = session.signString(_orderid);

				console.log('registering an issuance with name ' + _name + ' description ' + localdescription + ' number of shares ' + _numberofshares + ' percent of capital ' + _percentofcapital + ' registration date ' + _registration_date);

				issuance.setStatus(Securities.STATUS_SENT);
				issuance.setLocalSubmissionDate(_registration_date);
				
				return contractinterface.registerIssuance(_name, _cocrypted_issuance_description, _numberofshares, _percentofcapital, 
						_registration_date, _orderid, _signature, _type, _code,
						payingaccount, gas, gasPrice);
				
			 };
		
			 if (self.contractinterface)
			 return callfunc(self.contractinterface);
		
		})		
		.then(function(res) {
			console.log('StockLedger.registerIssuance promise of registration should be resolved');
			
			issuance.setStatus(Securities.STATUS_DEPLOYED);
			
			issuance.setLocalOrderId(issuance._deployment['orderid']);
			
			if (callback)
				callback(null, res);
			
			return res;
		});

		
		return promise;
	}
	
	// transaction
	validateTransaction(payingaccount, gas, gasPrice, stocktransaction, callback) {
		// we check the account is unlocked
		if (payingaccount.isLocked())
			throw 'account ' + payingaccount.getAddress() + ' is locked, unable to register transaction of ' + stocktransaction.getLocalNumberOfShares() + ' shares';
		
		// we validate we are signed-in
		var session = this.session;
		
		if (session.isAnonymous()) {
			throw 'session is not currently signed-in';
		}

		var owningaccount = this.getSyncChainOwnerAccount();

		if (!session.isSessionAccount(owningaccount)) {
			// trying to register a transaction while not being owner of the contract
			var sessionaccountaddress = session.getSessionAccountAddress();
			
			if (!this.getChainStakeHolderFromAddress(sessionaccountaddress)) {
				throw 'only registered shareholders of the contract can register transactions';
			}
			else {
				if (stocktransaction.getLocalNature() < 11) {
					throw 'shareholders can not register transactions with a nature of ' + stocktransaction.getLocalNature();
				}
			}
		}
		
		
		return true;
	}
	
	registerTransaction(payingaccount, gas, gasPrice, stocktransaction, callback) {
		var self = this;
		var session = this.session;
		
		var fromaddress = payingaccount.getAddress();
		
		var transactionnumberofshares = stocktransaction.getLocalNumberOfShares();
		
		console.log('StockLedger.registerTransaction called for ' + transactionnumberofshares + " shares from " + fromaddress + " with gas limit " + gas + " and gasPrice " + gasPrice);
		
		
		// we validate the transaction
		if (!this.validateTransaction(payingaccount, gas, gasPrice, stocktransaction, callback))
			return;
		
		var promise = this.getChainNextOrderId(function (err, res) {
			if (!res)
				return callback("contract could not get an order id to submit transaction: " + err, null);

			return Promise.resolve(res);
			
		}).then(function (res) {
			var _orderid = res;

			stocktransaction._deployment = [];
			stocktransaction._deployment['orderid'] = _orderid; // to find it back after deploy if successful
			
			var callfunc = function(contractint) {
				
				var contractinterface = self.getContractInterface();

			    var _from = stocktransaction.getLocalFrom();
			    var _to = stocktransaction.getLocalTo();
			    
			    var _nature = stocktransaction.getLocalNature();
			    
			    var _issuancenumber = stocktransaction.getLocalIssuanceNumber();
			    var _numberofshares = stocktransaction.getLocalNumberOfShares();
			    var _consideration = stocktransaction.getLocalConsideration();
			    var _currency = stocktransaction.getLocalCurrency();
				
				var contractowneraccount = self.getSyncChainOwnerAccount();
				
				// should we encrypt consideration?
				var _cocrypted_consideration = _consideration;
				var _cocrypted_currency = _currency;

				var _shldrcrypted_consideration = _consideration;
				var _shldrcrypted_currency = _currency;

				var sessionaccount = session.getSessionAccountObject();
				
				if (sessionaccount) {
					if (!sessionaccount.canDoAesEncryption) {
						throw 'Can not do aes encrypt of data for the current session account';
					}
					
					_shldrcrypted_consideration = sessionaccount.aesEncryptString(_consideration.toString());
					_shldrcrypted_currency = sessionaccount.aesEncryptString(_currency.toString());

					if (!contractowneraccount.canDoRsaEncryption()) {
						throw 'Can not do rsa encrypt of data for the current owner of the contract';
					}
					
					_cocrypted_consideration = sessionaccount.rsaEncryptString(_consideration.toString(), contractowneraccount);
					_cocrypted_currency = sessionaccount.rsaEncryptString(_currency.toString(), contractowneraccount);
					
					
					// sign order id
					var creator = session.getSessionAccountObject();
					var _creatoraddress = creator.getAddress();
					
					if (!creator.canDoAesEncryption) {
						throw 'Can not encrypt data for the creator of transaction registration';
					}
					
					var _signature = session.signString(_orderid);
				}
				else {
					throw 'You need to have a signed session to register a transaction';
				}
				
				var _registration_date = Date.now();
				
				console.log('registering a transaction from ' + _from + ' to ' + _to + ' of nature ' + _nature + ' for issuance ' + _issuancenumber + ' number of shares ' + _numberofshares + ' consideration ' + _consideration + ' ' + _currency + ' registration date ' + _registration_date);

				stocktransaction.setStatus(Securities.STATUS_SENT);
				stocktransaction.setLocalSubmissionDate(_registration_date);
				
				return contractinterface.registerTransaction(_numberofshares, _from, _to, _nature, _issuancenumber, _orderid, 
						_registration_date, _consideration, _currency, _creatoraddress, _signature,
						payingaccount, gas, gasPrice);
				
			 };
		
			 if (self.contractinterface)
			 return callfunc(self.contractinterface);
		
		})
		.then(function(res) {
			console.log('StockLedger.registerTransaction promise of registration should be resolved');
			
			stocktransaction.setStatus(Securities.STATUS_DEPLOYED);
			
			stocktransaction.setLocalOrderId(stocktransaction._deployment['orderid']);
			
			if (callback)
				callback(null, res);
			
			return res;
		});

		
		return promise;
	}
	
	// chain data
	
	// synchronous methods
	isSynchronousReady() {
		if (this.contractinstance == null)
			throw 'Contract instance not created';
		
		if (this.owner == null)
			throw 'Owner address not retrieved';
		
		if (this.owner_rsa_pubkey == null)
			throw 'Owner public key not retrieved';
		
		if (this.finalized_init != true)
			throw 'Stockledger.finalizedInit not completed';
		
		return true;
	}
	
	
	getSyncChainOwner() {
		if (this.owner == null)
			throw 'Contract has not be completely loaded, can not call Stockledger.getSyncChainOwner at this point';
			
		return this.owner;
	}
	
	getSyncChainOwnerAccount() {
		var session = this.session;
		
		if (this.owner == null)
			throw 'Contract has not be completely loaded, can not call Stockledger.getSyncChainOwnerAccount at this point';

		var address = this.getSyncChainOwner();
		var account = session.getAccountObject(address);
		
		if (this.owner_rsa_pubkey == null)
			throw 'Contract has not be completely loaded, can not call Stockledger.getSyncChainOwnerAccount at this point';
		
		account.setRsaPublicKey(this.owner_rsa_pubkey);
		
		return account;
	}
	
	getSyncChainOwnerStakeHolderObject() {
		if (this.chainstakeholderarray.length == 0)
			throw 'Shareholder array has not been loaded';
		
		if (!this.chainstakeholderarray[0])
			throw 'Shareholder object for contract\'s owner has not been loaded';
		
		return this.chainstakeholderarray[0];
	}
	
	
	
	// asynchronous methods
	finalizeInit(callback) {
		console.log('StockLedger.finalizeInit called for ' + this.address);
		
		if (this.finalized_init) {
			if (callback)
				callback(true);
			
			return Promise.resolve(true);
		}
		
		var self = this;
		var session = this.session;
		
		var promises = []
		
		var promiseowner = this.getContractInstance().activate().then(function (contractinstance) {

			if (self.contractinstance)
			return self.getContractInstance().method_call("owner", [])
		
		}).then(function(res) {
	    	
	    	console.log('StockLedger.finalizeInit returning from owner with return ' + res);
	    	
	    	return res;
	    });
		
		promises.push(promiseowner);
		
		var promiseownerpubkey = this.getContractInstance().activate().then(function (contractinstance) {
			
			if (self.contractinstance)
			return self.getContractInstance().method_call("owner_pubkey", [])
			
		}).then(function(res) {
	    	
	    	console.log('StockLedger.finalizeInit returning from owner_pubkey with return ' + res);
	    	
			
	    	return res;
	    });

		promises.push(promiseownerpubkey);
		
		var promise_all = Promise.all(promises).then(function(arr) {
	    	self.owner = arr[0];
	    	self.owner_rsa_pubkey = arr[1];
	    	
	    	if (self.owner) {
		    	// set public key in owner account object
		    	var owneraccount = self.session.getAccountObject(self.owner);
		    	
		    	owneraccount.setRsaPublicKey(self.owner_rsa_pubkey);

		    	self.setStatus(Securities.STATUS_ON_CHAIN);
	    	}
	    	else {
		    	self.setStatus(Securities.STATUS_NOT_FOUND);
	    	}
	    	
			
			self.finalized_init = true;
			
	    	console.log('StockLedger.finalizeInit all promises resolved with return ' + arr);
			callback(true);
		});
		
		
		return promise_all;
	}
	
	getChainNextOrderId(callback) {
		console.log('StockLedger.getChainNextOrderId called for ' + this.address);
		
		var self = this;
		var session = this.session;
		
		var promise = this.finalizeInit(function (res) {
			if (!res)
				return callback("contract did not finalize its initialization", null);

			return res;
			
		}).then(function (res) {
			var callfunc = function(instance) {
				var contractInstance = instance;
				

				var promise2 = self.getContractInterface().getNextOrderId().then(function(res) {
			    	
			    	console.log('returning from next_orderid with return ' + res);
			    	
			    	if (callback)
						callback(null, res);
						
			    	return res;
			    });
			    
				return promise2;
			 };
		
			 if (self.contractinstance)
			 return callfunc(self.contractinstance);
		
		});
		
		return promise;
	}
	
	
	getChainLedgerName(callback) {
		console.log('StockLedger.getChainLedgerName called for ' + this.address);
		
		var self = this;
		var session = this.session;
		
		var promise = this.getContractInterface().getLedgerName().then(function(res) {
			    	
	    	console.log('returning from ledger_name with return ' + res);
	    	
	    	self.ledger_name = res;
			
	    	if (callback)
				callback(null, res);
				
	    	return res;
	    });
		
		return promise;
	}
	
	getChainLedgerDescription(callback) {
		return this.getChainCoCryptedLedgerDescription(callback);
	}
	
	getChainCoCryptedLedgerDescription(callback) {
		console.log('StockLedger.getChainCoCryptedLedgerDescription called for ' + this.address);
		
		var self = this;
		var session = this.session;
		
		var promise = this.getContractInterface().getCoCryptedLedgerDescription().then(function(res) {
			    	
	    	console.log('returning from cocrypted_ledger_description with return ' + res);
	    	
	    	self.cocrypted_ledger_description = res;
			
	    	if (callback)
				callback(null, res);
				
	    	return res;
	    });
		
		return promise;
		
	}
	
	getChainOwner(callback) {
		console.log('StockLedger.getChainOwner called for ' + this.address);
		
		var self = this;
		var session = this.session;
		
		var promise = this.getContractInterface().getOwner().then(function(res) {
			    	
	    	console.log('returning from owner with return ' + res);
	    	
	    	self.owner = res;
			
	    	if (callback)
				callback(null, res);
				
	    	return res;
	    });
		
		return promise;
		
	}
	
	getChainOwnerPublicKey(callback) {
		console.log('StockLedger.getChainOwnerPublicKey called for ' + this.address);
		
		var self = this;
		var session = this.session;
		
		var promise = this.getContractInterface().getOwnerPublicKey().then(function(res) {
			    	
	    	console.log('returning from owner_pubkey with return ' + res);
	    	
	    	self.owner_rsa_pubkey = res;
			
	    	if (callback)
				callback(null, res);
				
	    	return res;
	    });
		
		return promise;
		
	}
	
	getChainContractName(callback) {
		console.log('StockLedger.getChainContractName called for ' + this.address);
		
		var self = this;
		var session = this.session;
		
		var promise = this.getContractInterface().getContractName().then(function(res) {
			    	
	    	console.log('returning from contract_name with return ' + res);
	    	
	    	self.contract_name = res;
			
	    	if (callback)
				callback(null, res);
				
	    	return res;
	    });
		
		return promise;
		
	}
	
	getChainContractVersion(callback) {
		console.log('StockLedger.getChainContractVersion called for ' + this.address);
		
		var self = this;
		var session = this.session;
		
		var promise = this.getContractInterface().getContractVersion().then(function(res) {
			    	
	    	console.log('returning from contract_version with return ' + res);
	    	
	    	self.contract_version = res;
			
	    	if (callback)
				callback(null, res);
				
	    	return res;
		});
		
		return promise;
		
	}
	
	// loads
	loadChainAccountsAndStakeHolders(callback) {
		console.log('StockLedger.loadChainAccountsAndStakeHolders called for ' + this.address);
		
		var self = this;
		
		var promise = this.getChainAccountList(function (err, res) {
			if (err)
			return callback("could not load account list: " + err, null);

			return res;
			
		}).then(function (res) {
			console.log('loadChainAccountsAndStakeHolders, account list loaded');

			if (res) {
				return self.getChainStakeHolderList(function (err, res) {
					if (err)
						return callback("could not load stakeholder list: " + err, null);

					return res;
						
				});
			}
			else {
				return callback("no account list loaded", null);
			}
		}).then(function(res) {
			console.log('loadChainAccountsAndStakeHolders, stakeholder list loaded');
			
			if (callback)
			return callback(null, true);
		});
		
		return promise;
	}

	// accounts
	getChainAccountCount(callback) {
		console.log('StockLedger.getChainAccountCount called for ' + this.address);
		
		var self = this;
		var session = this.session;
		
		var promise = this.finalizeInit(function (res) {
			if (!res)
				return callback("contract did not finalize its initialization", null);

			return res;
			
		}).then(function (contractinstance) {
			var callfunc = function(instance) {
				var contractInstance = instance;

				var promise2 = self.getContractInterface().getAccountCount().then(function(res) {
			    	
			    	console.log('returning from getAccountCount with return ' + res);
			    	
			    	self.contract_version = res;
					
			    	if (callback)
						callback(null, res);
			    	
			    	return res;
			    });
			    
				return promise2;
			 };
		
			 if (self.contractinstance)
			 return callfunc(self.contractinstance);
			
		});
		
		return promise;
		
	}
	
	getChainAccountAt(index, callback) {
		console.log('StockLedger.getChainAccountAt called for ' + this.address + ' at index ' + index);
		
		var self = this;
		var session = this.session;
		
		var owner = this.localowner;
		
		var promise = this.finalizeInit(function (res) {
			if (!res)
				return callback("contract did not finalize its initialization", null);

			return res;
			
		}).then(function (res) {
			var callfunc = function(instance) {
				var contractInstance = instance;

				var promise2 = self.getContractInstance().method_call("getAccountAt", [index]);
			    
				return promise2;
			 };
		
			if (self.contractinstance)
			 return callfunc(self.contractinstance);
			
		}).then( function(res_array) {
			if (!res_array) {
				if (callback)
					callback('getAccountAt no result retrieved', null);
				
				return;
			}
			
			console.log('returning from getAccountAt with res_array ' + res_array);

			var _acct_address = (res_array && res_array[0] ? res_array[0] : null);
			var _rsa_pubkey = (res_array && res_array[1] ? res_array[1] : null);
			var _ece_pubkey = (res_array && res_array[2] ? res_array[2] : null);
			var _cocrypted_acct_privkey = (res_array && res_array[3] ? res_array[3] : null);
			
			var _acct_privkey = null;

			var account = session.createBlankAccountObject();
			
			account.cocrypted_acct_privkey = _cocrypted_acct_privkey;

			if (session.ownsContract(self)) {
				// we decrypt the private key
				var senderaccount = session.createBlankAccountObject();
				var contractowneraccount = session.getSessionAccountObject();
				
				senderaccount.setRsaPublicKey(_rsa_pubkey);
				
				_acct_privkey = contractowneraccount.rsaDecryptString(_cocrypted_acct_privkey, senderaccount);
			}
			
			if (_acct_privkey && (session.isValidPrivateKey(_acct_privkey))) {
				// we set only the private key and recompute public keys and address from there
				account.setPrivateKey(_acct_privkey);
			}
			else {
				account.setRsaPublicKey(_rsa_pubkey);
				account.setAesPublicKey(_ece_pubkey);
			}
			
			session.addAccountObject(account);

	    	self.addChainAccountAt(account, index);

	    	if (callback)
				callback(null, account);
		});
		
		return promise;
		
	}
	
	getChainAccountList(callback) {
		console.log('StockLedger.getChainAccountList called for ' + this.address);
		
		var self = this;
		var session = this.session;
		
		var promise = this.finalizeInit(function (res) {
			if (!res)
				return callback("contract did not finalize its initialization", null);

			return res;
			
		}).then(function (contractinstance) {
			var callfunc = function(instance) {
				var contractInstance = instance;

				return self.getChainAccountCount(function (err, res) {
					var count = res;

					console.log("count of account is " + count);
					
					return res;
				});
			 };
		
			if (self.contractinstance)
			 return callfunc(self.contractinstance);
			
		}).then(function(res) {
			var count = res;
			
			console.log("creating list of " + count + " promises to get accounts at each index");
			
			var promises = [];
			
			for (var i = 0; i < count; i++) {
				var promise = self.getChainAccountAt(i);
				promises.push(promise);
			}
			
			return Promise.all(promises).then(function(res) {
		    	console.log("all getChainAccountAt promises have been resolved, array is now complete");
				
		    	if (callback)
				return callback(null, self.chainaccountarray);
	    	});			
		});
		
		return promise;
		
	}
	
	
	
	// shareholders
	getChainStakeHolderCount(callback) {
		console.log('StockLedger.getChainStakeHolderCount called for ' + this.address);
		
		var self = this;
		var session = this.session;
		
		var promise = this.finalizeInit(function (res) {
			if (!res)
				return callback("contract did not finalize its initialization", null);

			return res;
			
		}).then(function (contractinstance) {
			var callfunc = function(instance) {
				var contractInstance = instance;

				var promise2 = self.getContractInterface().getShareHolderCount().then(function(res) {
			    	
			    	console.log('returning from getShareHolderCount with return ' + res);
			    	
			    	self.contract_version = res;
					
			    	if (callback)
						callback(null, res);
			    	
			    	return res;
			    });
			    
				return promise2;
			 };
		
			 if (self.contractinstance)
			 return callfunc(self.contractinstance);
			
		});
		
		return promise;
		
	}
	
	getChainStakeHolderAt(index, callback) {
		console.log('StockLedger.getChainStakeHolderAt called for ' + this.address + ' at index ' + index);
		
		var self = this;
		var session = this.session;
		var securitiesmodule = this.getSecuritiesModuleObject();

		var stakeholder = securitiesmodule.createBlankStockHolderObject(session, this);
		
		var owner = this.localowner;
		
		var promise = this.finalizeInit(function (res) {
			if (!res)
				return callback("contract did not finalize its initialization", null);

			return res;
			
		}).then(function (res) {
			var callfunc = function(instance) {
				var contractInstance = instance;

				var promise2 = self.getContractInstance().method_call("getShareHolderAt", [index]);
				//var promise2 = contractInstance.getShareHolderAt.call(index);
			    
				return promise2;
			 };
		
			if (self.contractinstance)
			 return callfunc(self.contractinstance);
			
		}).then( function(res_array) {
			if (!res_array) {
				if (callback)
					callback('getShareHolderAt no result retrieved', null);
				
				return;
			}
			
			// address, cocrypted_shldr_key, cocrypted_shldr_identifier, registration_date, block_date
			var address = (res_array && res_array[0] ? res_array[0] : null);
			var shldr_rsa_pubkey = (res_array && res_array[1] ? res_array[1] : null);
			var cocrypted_shldr_privkey = (res_array && res_array[2] ? res_array[2] : null);
			var cocrypted_shldr_identifier = (res_array && res_array[3] ? res_array[3] : null);
			var registration_date = (res_array && res_array[4] ? res_array[4] : null);
			var block_date = (res_array && res_array[5] ? res_array[5] : null);
			
			console.log('returning from getShareHolderAt with res_array ' + res_array);
			console.log('returning from getShareHolderAt with address ' + address + ' rsa publickey ' + shldr_rsa_pubkey + ' cocrypted ' + cocrypted_shldr_privkey + ' regdate ' + registration_date + ' block date ' + block_date);
			
			stakeholder.setAddress(address);
	    	
	    	stakeholder.setChainPosition(index);
	    	stakeholder.setChainRsaPubKey(shldr_rsa_pubkey);
	    	stakeholder.setChainCocryptedPrivKey(cocrypted_shldr_privkey);
	    	stakeholder.setChainCocryptedIdentifier(cocrypted_shldr_identifier);
	    	stakeholder.setChainRegistrationDate(registration_date);
	    	stakeholder.setChainBlockDate(block_date);

			// because of Compiler error "Stack too deep, try using less variables." we must make a second call
	    	// to get the rest of the variables
	    	var callfunc = function(instance) {
				var contractInstance = instance;

				var promise2 = self.getContractInstance().method_call("getShareHolderExtraAt", [index]);
				//var promise2 = contractInstance.getShareHolderAt.call(index);
			    
				return promise2;
			 };
				
			 if (self.contractinstance)
			 return callfunc(self.contractinstance);
		}).then(function(res_array) {
			if (!res_array) {
				if (callback)
					callback('getShareHolderExtraAt no result retrieved', null);
				
				return;
			}
			
	    	
			var creator = (res_array && res_array[0] ? res_array[0] : null);
			var crtcrypted_shldr_description_string = (res_array && res_array[1] ? res_array[1] : null);
			var crtcrypted_shldr_identifier = (res_array && res_array[2] ? res_array[2] : null);
			var orderid = (res_array && res_array[3] ? res_array[3] : null);
			var signature = (res_array && res_array[4] ? res_array[4] : null);
			var shldrcrypted_shldr_description = (res_array && res_array[5] ? res_array[5] : null);
			var shldrcrypted_shldr_identifier = (res_array && res_array[6] ? res_array[6] : null);

			console.log('returning from getShareHolderExtraAt with res_array ' + res_array);
			console.log('returning from getShareHolderExtraAt with creator ' + creator + ' orderid ' + orderid);
			
			stakeholder.setChainCreatorAddress(creator);
	    	stakeholder.setChainCreatorCryptedDescription(crtcrypted_shldr_description_string);
	    	stakeholder.setChainCreatorCryptedIdentifier(crtcrypted_shldr_identifier);
	    	stakeholder.setChainOrderId(orderid);
	    	stakeholder.setChainSignature(signature);
	    	stakeholder.setChainStakeHolderCryptedDescription(shldrcrypted_shldr_description);
	    	stakeholder.setChainStakeHolderCryptedIdentifier(shldrcrypted_shldr_identifier);

	    	stakeholder.setStatus(Securities.STATUS_ON_CHAIN);
	    	
	    	self.addChainStakeHolderAt(stakeholder, index);
	    	
	    	// look if it is also present in the local storage list
	    	var localstakeholder = self.findLocalStakeHolderFromOrderId(stakeholder.getChainOrderId());
	    	
	    	if (localstakeholder) {
	    		localstakeholder.copy(stakeholder);
	    		
	    		if (localstakeholder.getStatus() != Securities.STATUS_DEPLOYED)
	    			localstakeholder.setStatus(Securities.STATUS_DEPLOYED);
	    	}
			
	    	if (callback)
			 callback(null, stakeholder);
	    	
	    	return stakeholder;
	    });
		
		return promise;
		
	}
	
	getChainStakeHolderList(callback) {
		console.log('StockLedger.getChainStakeHolderList called for ' + this.address);
		
		var self = this;
		var session = this.session;
		
		var promise = this.finalizeInit(function (res) {
			if (!res)
				return callback("contract did not finalize its initialization", null);

			return res;
			
		}).then(function (contractinstance) {
			var callfunc = function(instance) {
				var contractInstance = instance;

				return self.getChainStakeHolderCount(function (err, res) {
					var count = res;
					console.log("count of stakeholders is " + count);
					
					return res;
				});
			 };
		
			if (self.contractinstance)
			 return callfunc(self.contractinstance);
			
		}).then(function(res) {
			var count = res;
			console.log("creating list of " + count + " promises to get stakeholders at each index");
			
			var promises = [];
			
			for (var i = 0; i < count; i++) {
				var promise = self.getChainStakeHolderAt(i);
				promises.push(promise);
			}
			
			return Promise.all(promises).then(function(res) {
		    	console.log("all getChainStakeHolderAt promises have been resolved, array is now complete");
				
		    	if (callback)
				return callback(null, self.chainstakeholderarray);
	    	});			
		});
		
		return promise;
		
	}
	
	// issuances
	getChainIssuanceAt(index, callback) {
		console.log('StockLedger.getChainIssuanceAt called for ' + this.address + ' at index ' + index);
		
		var self = this;
		var session = this.session;

		var securitiesmodule = this.getSecuritiesModuleObject();

    	var issuance = securitiesmodule.createBlankStockIssuanceObject(session, this);
    	
		var owner = this.localowner;
		
		var promise = this.finalizeInit(function (res) {
			if (!res)
				return callback("contract did not finalize its initialization", null);

			return res;
			
		}).then(function (contractinstance) {
			var callfunc = function(instance) {
				var contractInstance = instance;

				var promise2 = self.getContractInstance().method_call("getIssuanceAt", [index]);
			    
				return promise2;
			 };
		
			 if (self.contractinstance)
			 return callfunc(self.contractinstance);
			
		}).then(function(res_array) {
			if (!res_array) {
				if (callback)
					callback('getChainIssuanceAt no result retrieved', null);
				
				return;
			}
			
			console.log('returning from getChainIssuanceAt with return ' + res_array);
			
	    	var numberofshares = res_array[0];
	    	var percentofcapital = res_array[1]; 
	    	var issuance_date = res_array[2]; 
	    	var block_date = res_array[3]; 
	    	var name = res_array[4]; 
	    	var cocrypted_description = res_array[5]; 
	    	var cancel_date = res_array[6]; 
	    	var cancel_block_date = res_array[7];
	    	
	    	var orderid = res_array[8]; 
	    	var signature = res_array[9]; 

	    	
	    	issuance.setChainPosition(index);
	    	
	    	issuance.setChainNumberOfShares(numberofshares);
	    	issuance.setChainPercentOfCapital(percentofcapital);
	    	issuance.setChainIssuanceDate(issuance_date);
	    	issuance.setChainIssuanceBlockDate(block_date);
	    	issuance.setChainName(name);
	    	issuance.setChainCocryptedDescription(cocrypted_description);
	    	issuance.setChainCancelDate(cancel_date);
	    	issuance.setChainCancelBlockDate(cancel_block_date);
	    	
	    	issuance.setChainOrderId(orderid);
	    	issuance.setChainSignature(signature);
	    	
				
			var callfunc = function(instance) {
				var contractInstance = instance;

				var promise2 = self.getContractInstance().method_call("getIssuanceExtraAt", [index]);
			    
				return promise2;
			 };
		
			 if (self.contractinstance)
			 return callfunc(self.contractinstance);
			 
	    }).then(function(res_array) {
			if (!res_array) {
				if (callback)
					callback('getChainIssuanceExtraAt no result retrieved', null);
				
				return;
			}
			
			console.log('returning from getChainIssuanceExtraAt with return ' + res_array);
			
	    	var type = res_array[0];
	    	var code = res_array[1]; 

	    	
	    	issuance.setChainType(type);
	    	issuance.setChainCode(code);
	    	
	    	issuance.setStatus(Securities.STATUS_ON_CHAIN);
	    	self.addChainIssuanceAt(issuance, index);
			
	    	// look if it is also present in the local storage list
	    	var localissuance = self.findLocalIssuanceFromOrderId(issuance.getChainOrderId());
	    	
	    	if (localissuance) {
	    		localissuance.copy(issuance);
	    		
	    		if (localissuance.getStatus() != Securities.STATUS_DEPLOYED)
	    			localissuance.setStatus(Securities.STATUS_DEPLOYED);
	    	}

	    	if (callback)
				callback(null, issuance);
			
	    	return issuance;
	    });
		
		return promise;
		
	}
	
	getChainIssuanceCount(callback) {
		console.log('StockLedger.getChainIssuanceCount called for ' + this.address);
		
		var self = this;
		var session = this.session;
		
		var promise = this.finalizeInit(function (res) {
			if (!res)
				return callback("contract did not finalize its initialization", null);

			return res;
			
		}).then(function (contractinstance) {
			var callfunc = function(instance) {
				var contractInstance = instance;

				var promise2 = self.getContractInterface().getIssuanceCount().then(function(res) {
			    	
			    	console.log('returning from getIssuanceCount with return ' + res);
			    	
			    	self.contract_version = res;
					
			    	if (callback)
						callback(null, res);
						
			    });
			    
				return promise2;
			 };
		
			 if (self.contractinstance)
			 return callfunc(self.contractinstance);
			
		});
		
		return promise;
		
	}
	
	getChainIssuanceList(callback) {
		console.log('StockLedger.getChainIssuanceList called for ' + this.address);
		
		var self = this;
		var session = this.session;
		
		var promise = this.finalizeInit(function (res) {
			if (!res)
				return callback("contract did not finalize its initialization", null);

			return res;
			
		}).then(function (contractinstance) {
			var callfunc = function(instance) {
				var contractInstance = instance;

				return self.getChainIssuanceCount(function (err, res) {
					var count = res;
					console.log("count of issuances is " + count);
					var promises = [];
					
					for (var i = 0; i < count; i++) {
						var promise = self.getChainIssuanceAt(i);
						promises.push(promise);
					}
					
					return Promise.all(promises).then(function(res) {
				    	console.log("all getChainIssuanceAt promises have been resolved, array is now complete");
						
				    	if (callback)
							callback(null, self.chainstockissuancearray);
			    	});
				});
			 };
		
			if (self.contractinstance)
			 return callfunc(self.contractinstance);
			
		});
		
		return promise;
		
	}
	
	// transactions
	getChainTransactionAt(index, callback) {
		console.log('StockLedger.getChainTransactionAt called for ' + this.address + ' at index ' + index);
		
		var self = this;
		var session = this.session;

		var securitiesmodule = this.getSecuritiesModuleObject();

    	var transaction = securitiesmodule.createBlankStockTransactionObject(session, this);
    	
		var owner = this.localowner;
		
		var promise = this.finalizeInit(function (res) {
			if (!res)
				return callback("contract did not finalize its initialization", null);

			return res;
			
		}).then(function (contractinstance) {
			var callfunc = function(instance) {
				var contractInstance = instance;

				var promise2 = self.getContractInstance().method_call("getTransactionAt", [index]);
			    
				return promise2;
			 };
		
			 if (self.contractinstance)
			 return callfunc(self.contractinstance);
			
		}).then(function(res_array) {
			if (!res_array) {
				if (callback)
					callback('getChainTransactionAt no result retrieved', null);
				
				return;
			}
			
	    	
			console.log('returning from getChainTransactionAt with return ' + res_array);
			
	    	var from = res_array[0];
	    	var to = res_array[1];
			
	    	var transactiondate = res_array[2]; // unix time
	    	var block_date = res_array[3]; 
			
	    	var nature = res_array[4]; // 0 creation, 1 registered transfer, 2 shareholder record (e.g. signed endorsement)
			
	    	var issuancenumber = res_array[5]; // 1 based
	    	var orderid = res_array[6]; // unique, provided by caller

	    	var numberofshares = res_array[7];
			
	    	var consideration = res_array[8];
	    	var currency = res_array[9];
	    	
	    	var creator = res_array[10];
	    	var signature = res_array[11];
	    	
	    	transaction.setChainPosition(index);
	    	
	    	transaction.setChainFrom(from);
	    	transaction.setChainTo(to);
	    	transaction.setChainTransactionDate(transactiondate);
	    	transaction.setChainBlockDate(block_date);
	    	transaction.setChainNature(nature);
	    	transaction.setChainIssuanceNumber(issuancenumber);
	    	transaction.setChainOrderId(orderid);
	    	transaction.setChainNumberOfShares(numberofshares);
	    	transaction.setChainConsideration(consideration);
	    	transaction.setChainCurrency(currency);
	    	
	    	transaction.setChainCreatorAddress(creator);
	    	transaction.setChainSignature(signature);

	    	transaction.setStatus(Securities.STATUS_ON_CHAIN);
	    	self.addChainTransactionAt(transaction, index);
			
	    	// look if it is also present in the local storage list
	    	var localtransaction = self.findLocalTransactionFromOrderId(transaction.getChainOrderId());
	    	
	    	if (localtransaction) {
	    		localtransaction.copy(transaction);
	    		
	    		if (localtransaction.getStatus() != Securities.STATUS_DEPLOYED)
	    			localtransaction.setStatus(Securities.STATUS_DEPLOYED);
	    	}

	    	if (callback)
				callback(null, transaction);
			
	    	return 	transaction;
	    });
		
		return promise;
		
	}
	
	getChainTransactionCount(callback) {
		console.log('StockLedger.getChainTransactionCount called for ' + this.address);
		
		var self = this;
		var session = this.session;
		
		var promise = this.finalizeInit(function (res) {
			if (!res)
				return callback("contract did not finalize its initialization", null);

			return res;
			
		}).then(function (contractinstance) {
			var callfunc = function(instance) {
				var contractInstance = instance;

				var promise2 = self.getContractInterface().getTransactionCount().then(function(res) {
			    	
			    	console.log('returning from getTransactionCount with return ' + res);
			    	
			    	self.contract_version = res;
					
			    	if (callback)
						callback(null, res);
						
			    });
			    
				return promise2;
			 };
		
			 if (self.contractinstance)
			 return callfunc(self.contractinstance);
			
		});
		
		return promise;
		
	}
	
	getChainTransactionList(callback) {
		console.log('StockLedger.getChainTransactionList called for ' + this.address);
		
		var self = this;
		var session = this.session;
		
		var promise = this.finalizeInit(function (res) {
			if (!res)
				return callback("contract did not finalize its initialization", null);

			return res;
			
		}).then(function (contractinstance) {
			var callfunc = function(instance) {
				var contractInstance = instance;

				return self.getChainTransactionCount(function (err, res) {
					var count = res;
					console.log("count of transactions is " + count);
					var promises = [];
					
					for (var i = 0; i < count; i++) {
						var promise = self.getChainTransactionAt(i);
						promises.push(promise);
					}
					
					return Promise.all(promises).then(function(res) {
				    	console.log("all getChainTransactionAt promises have been resolved, array is now complete");
						
				    	if (callback)
							callback(null, self.chainstocktransactionarray);
			    	});
				});
			 };
		
			if (self.contractinstance)
			 return callfunc(self.contractinstance);
			
		});
		
		return promise;
		
	}
}


if ( typeof GlobalClass !== 'undefined' && GlobalClass )
	GlobalClass.registerModuleClass('securities', 'StockLedger', StockLedger);
else
	module.exports = StockLedger; // we are in node js

