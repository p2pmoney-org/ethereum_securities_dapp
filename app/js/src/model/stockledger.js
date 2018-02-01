/**
 * 
 */
'use strict';

class StockLedger {
	constructor(session, contractaddress) {
		this.session = session;
		this.address = contractaddress;

		// local data
		this.contractindex = null; // index in list of contracts

		this.localowner = null;
		this.localowneridentifier = null;
		this.localledgername = null;
		this.localledgerdescription = null;
		
		// blockchain data
		this.contract_name = null;
		this.contract_version = null;

		// company
		this.owner = null;
		this.owner_pubkey = null;

		this.ledger_name = null;
		this.cocrypted_ledger_description = null;
		
		this.creation_date = null; // unix time
		this.creation_block_date = null; // now in block number
		
		this.replaced_by = null;
		this.replacement_date = null; // unix time
		this.replacement_block_date = null; // now in block number
		
		// operating variables
		this.finalized_init = null;
		
		this.trufflecontract = null;
		this.loadtrufflecontractpromise = null;

		this.trufflecontractinstanceexists = null;
		this.trufflecontractinstance = null;
		this.trufflecontractinstancepromise = null;
		
		
		// arrays
		this.localstakeholderarray = [];
		this.chainstakeholderarray = [];
		
		this.localstockissuancearray = [];
		this.chainstockissuancearray = [];
		
		this.localstocktransactionarray = [];
		this.chainstocktransactionarray = [];
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
	
	// initialization of object
	initContract(json) {
		console.log('StockLedger.initContract called for ' + this.address);
		
		// load local ledger elements (if any)
		
		if (json["description"])
			this.setLocalLedgerDescription(json["description"]);
		
		if (json["ledgername"])
			this.setLocalLedgerName(json["ledgername"]);

		if (json["owner"])
			this.setLocalOwner(json["owner"]);
			
		if (json["owneridentifier"])
			this.setLocalOwnerIdentifier(json["owneridentifier"]);
			
		// load pending shareholders
		if (json['stakeholders']) {
			console.log('reading array of ' + json['stakeholders'].length + ' stakeholders');
			
			var localstakeholderarray = this.session.getStakeHoldersFromJsonArray(json['stakeholders']);
			
			for (var i = 0; i < localstakeholderarray.length; i++) {
				this.addLocalStakeHolder(localstakeholderarray[i]);
			}
		}
		
		// load pending issuances
		if (json['issuances']) {
			console.log('reading array of ' + json['issuances'].length + ' issuances');
			
			var localissuancearray = this.session.getStockIssuancesFromJsonArray(json['issuances']);
			
			for (var i = 0; i < localissuancearray.length; i++) {
				this.addLocalIssuance(localissuancearray[i]);
			}
		}
		
		// load pending transaction
		if (json['transactions']) {
			console.log('reading array of ' + json['transactions'].length + ' issuances');
			
			var localtransactionarray = this.session.getStockTransactionsFromJsonArray(json['transactions']);
			
			for (var i = 0; i < localtransactionarray.length; i++) {
				this.addLocalTransaction(localtransactionarray[i]);
			}
		}
		

		// chain elements
		// postpone initialization necessary for blockchain members to finalizeInit(callback)
	}
	
	getLocalJson() {
		// ledger part
		var address = this.getAddress();
		var contracttype = this.getContractType();
		
		var description = this.getLocalDescription();
		
		var ledgername = this.getLocalLedgerName();
		var owner = this.getLocalOwner();
		var owneridentifier = this.getLocalOwnerIdentifier();

		var json = {address: address, contracttype: contracttype, description: description, ledgername: ledgername, owner: owner, owneridentifier: owneridentifier};
		
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
			
			console.log('returning ' + jsonarray.length + ' local stakeholders');
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
			
			console.log('returning ' + jsonarray.length + ' local issuances');
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
			
			console.log('returning ' + jsonarray.length + ' local transactions');
			json['transactions'] = jsonarray;
		}
		
		
		
		
		return json;
	}
	
	// collections
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
	
	getChainStakeHolders() {
		return this.chainstakeholderarray;
	}
	
	getChainStakeholderFromAddress(address) {
		if (!address)
			return;
		
		var session = this.session;
		
		for (var i = 0; i < this.chainstakeholderarray.length; i++) {
			var stakeholder = this.chainstakeholderarray[i];
			
			if ((stakeholder) && (session.areAddressesEqual(stakeholder.getAddress(),address)))
				return stakeholder;
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
		if (!tx)
			return;
		
		var key = transaction.getTransactionIndex();
		var i;
		var tx;
		
		if (transaction.isLocalOnly()) {
			// local
			for (i = 0; i < this.localstocktransactionarray.length; i++) {
				tx = this.localstocktransactionarray[i];
				
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
	
	// chain side
	
	// initialization of truffle interface
	loadTruffleContract(callback) {
		//var finished = false;
		var session = this.session;
		var self = this;
		
		//var loadpromise = $.getJSON('./contracts/StockLedger.json', function(data) {
		//var loadpromise = session.loadArtifact('./contracts/StockLedger.json', function(data) {
		var EthereumNodeAccess = session.getEthereumNodeAccessInstance();
		var loadpromise = EthereumNodeAccess.truffle_loadArtifact('./contracts/StockLedger.json', function(data) {
			// Get the necessary contract artifact file and instantiate it with truffle-contract
			var StockLedgerArtifact = data;
			
			self.trufflecontract = EthereumNodeAccess.truffle_loadContract(StockLedgerArtifact);
			//self.trufflecontract = session.getTruffleContractObject(StockLedgerArtifact);
			  
			//finished = true;
			console.log('contract json file read ');
			
			if (callback)
			callback(null, self.trufflecontract);
			
			return self.trufflecontract;
		});
		
		console.log("load promise is " + loadpromise);
		
		loadpromise.then(function() {
			console.log('load promise resolved ');
		});
		
		console.log('load promise on the backburner');
		
		return loadpromise
	}
	
	getTruffleContractObject(callback) {
		// contract instance done
		if ((this.trufflecontractinstance) || (this.trufflecontractinstantexists === false)) {
			// we already have an instance
			// or the address does not correspond to a contract on this network
			if (callback)  {
				if (this.trufflecontractinstantexists === false)
					callback("no contract at this address " + this.address, null);
				else
					callback(null, this.trufflecontractinstance);
			}
			
			
			return Promise.resolve(this.trufflecontractinstance);
		}
		
		// contract instance promised
		var self = this;
		var session = this.session;
		var EthereumNodeAccess = session.getEthereumNodeAccessInstance();
		
		var handleaccept = function (instance) {
			console.log('handleaccept: truffle contract instantiation done for ' + self.address);
			
			
			if (!instance) {
				self.trufflecontractinstantexists = false;
			}
			else {
				self.trufflecontractinstantexists = true;
				self.trufflecontractinstance = instance;
			}

			//if (callback)
			//callback(null, self.trufflecontractinstance );
			
			return instance;
		};
		
		var handlereject = function (err) {
			if (err) {
				console.log('handlereject: error within promise: ' + err);
				self.trufflecontractinstantexists = false;
			}
			else {
				console.log('handlereject: error within promise');
			}

			if (callback)
			callback('handlereject: error within promise: ' + err, null);
			
		};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		
/*		if (this.trufflecontractinstancepromise) {
			console.log('truffle contract instantiation promise already created, but not resolved');
			
			// add handler for the callback
			console.log('adding post treatment');
			
			this.trufflecontractinstancepromise.then(function (instance) {
				console.log('truffle instantiation promise created, performing subsequent post treatment for ' + self.address);
				//console.log('instance is ' + JSON.stringify(instance));
				
				var promise2 = self.trufflecontractinstancepromise.then(handleaccept).catch(handlereject);
				
				return promise2;
			});
			
			return this.trufflecontractinstancepromise;
		}
		
		// contract load done
		if (this.trufflecontract) {
			console.log('truffle contract already created, but instantiation promise not created');
			// we already loaded the contract, but not created an instance promise yet
			//trufflecontractinstancepromise = this.trufflecontract.deployed();
			try {
				this.trufflecontractinstancepromise = this.trufflecontract.at(this.address);
			}
			catch(e) {
				console.log('error in trufflecontract.at(): ' + e);
				self.trufflecontractinstantexists = false;
				return Promise.resolve(null);
			}
			
			// we attach a post treatment to the instantiation promise
			this.trufflecontractinstancepromise.then(handleaccept).catch(handlereject);

			
			return this.trufflecontractinstancepromise;
		}
		
		// contract load promise
		
		if (this.loadtrufflecontractpromise) {
			// load promise has been created
			// but not resolved yet
			console.log('still waiting truffle load promise');
		}
		else {
			// neither load, nor instance promises created
			console.log('truffle load promise not created yet');
			
			// we create a load promise now and attach an instantiation promise to it
			this.loadtrufflecontractpromise = this.loadTruffleContract(function (err, res) {
				console.log('truffle loading done for original promise');
				
			});
			
		}
		
		// we attach the promise of the creation of an instantiation promise
		console.log('creating a composed promise from load to instantiation');
		this.trufflecontractinstancepromise = this.loadtrufflecontractpromise.then( function (err, res) {
			console.log('truffle loading done, starting instantiation promise');
			
			//self.trufflecontractinstancepromise = self.trufflecontract.deployed();
			try {
				self.trufflecontractinstancepromise = self.trufflecontract.at(self.address);
			}
			catch(e) {
				console.log('error in trufflecontract.at(): ' + e);
				self.trufflecontractinstantexists = false;
				return Promise.resolve(null);
			}
			
			return self.trufflecontractinstancepromise;
			
		});
		
		this.trufflecontractinstancepromise.then(function (instance) {
			console.log('truffle instantiation promise created, performing initial post treatment for ' + self.address);
			//console.log('instance is ' + JSON.stringify(instance));
			
			var promise2 = self.trufflecontractinstancepromise.then(handleaccept).catch(handlereject);
			
			return promise2;
		});
		
		return this.trufflecontractinstancepromise;*/

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		
		
		if (this.trufflecontractinstancepromise) {
			console.log('StockLedger.getTruffleContractObject truffle contract instantiation promise already created, but not resolved yet');
			
			console.log('StockLedger.getTruffleContractObject returning promise');

			return this.trufflecontractinstancepromise;
		}
		else {
			this.loadtrufflecontractpromise = this.loadTruffleContract(function(err, res) {
				console.log('load truffle contract resolved, ready to continue instantiation');
				return Promise.resolve(res);
			});
			
			this.trufflecontractinstancepromise = this.loadtrufflecontractpromise.then(function(trufflecontract) {
				console.log('StockLedger.getTruffleContractObject load truffle contract resolved');
				//console.log('load truffle contract resolved ' + JSON.stringify(trufflecontract));
				//console.log('load truffle contract resolved ' + JSON.stringify(self.trufflecontract));
				try {
					console.log('StockLedger.getTruffleContractObject calling trufflecontract.at()');
					return EthereumNodeAccess.truffle_contract_at(self.trufflecontract, self.address);
					//return self.trufflecontract.at(self.address);
				}
				catch(e) {
					console.log('StockLedger.getTruffleContractObject error in trufflecontract.at(): ' + e);
					self.trufflecontractinstantexists = false;
					return Promise.resolve(null);
				}
			})
			.then(handleaccept)
			.then(function(res) {
				console.log('StockLedger.getTruffleContractObject calling trufflecontract.at() resolved');
				console.log('StockLedger.getTruffleContractObject adding post treatment to instantiation promise');
				
				if (res) {
					if (res.then)
					return res.then(handleaccept);
					
					if (res.catch)
					res.catch(handlereject);
				} 
				else
					return Promise.resolve(null);
			})
			.then(function(res) {
				
				console.log('StockLedger.getTruffleContractObject trufflecontract instantiation completed');

				if (callback)
					callback(null, self.trufflecontractinstance);
				 				
				return self.trufflecontractinstance;
			});
			
			console.log('StockLedger.getTruffleContractObject truffle instantiation promise created for ' + self.address);
			
			return this.trufflecontractinstancepromise;
		}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	}
	
	// deployment
	deploy(payingaccount, owningaccount, gas, gasPrice, callback) {
		var self = this;
		var session = this.session;
		var EthereumNodeAccess = session.getEthereumNodeAccessInstance();

		var fromaddress = payingaccount.getAddress();
		
		console.log('StockLedger.deploy called for ' + this.localledgerdescription + " from " + fromaddress + " with gas limit " + gas + " and gasPrice " + gasPrice);
		
		
		// we check the account is unlocked
		if (payingaccount.isLocked())
			throw 'account ' + fromaddress + ' is locked, unable to deploy contract: ' + this.localledgerdescription;
		
		var promise = this.loadTruffleContract(function (err, res) {
			var trufflecontract = res;
			
			if (!trufflecontract) {
				callback("contract json not loaded", null);
				return;
			}

			return trufflecontract;
			
		}).then(function (res) {
			var callfunc = function(_contract) {
				
				var contractowner = self.localowner;

				if (!session.areAddressesEqual(owningaccount.getAddress(), contractowner)) {
					throw 'Mismatch on the owner of the contract';
				}
				
				if (!owningaccount.canDoAesEncryption) {
					throw 'Can not encrypt data for the owner of the contract';
				}
				
				var contractownerpublkey = owningaccount.getPublicKey();
				var cryptedowneridentifier = owningaccount.aesEncryptString(self.localowneridentifier);
				var ledgername = self.localledgername;
				var cryptedledgerdescription = owningaccount.aesEncryptString(self.localledgerdescription);
				
				var params = [contractowner, contractownerpublkey, cryptedowneridentifier, ledgername, cryptedledgerdescription];

				console.log('load finished, trying to deploy contract ' + self.localledgerdescription + ' with owner ' + contractowner + ' ledgername ' + ledgername + ' crypted owneridentifier ' + cryptedowneridentifier + ' crypted ledgerdescription ' + cryptedledgerdescription);
				
				
				/*var promise2 = _contract.new(contractowner, 
							contractownerpublkey,
							cryptedowneridentifier,
							ledgername,
							cryptedledgerdescription,
							{from: fromaddress, gas: gas, gasPrice: gasPrice})*/
				var promise2 = EthereumNodeAccess.truffle_contract_new(_contract,
							[contractowner, 
							contractownerpublkey,
							cryptedowneridentifier,
							ledgername,
							cryptedledgerdescription,
							{from: fromaddress, gas: gas, gasPrice: gasPrice}])
							.then(instance => {
				    
					var contractaddress = instance.address;
					
					self.setAddress(instance.address);
					
					console.log('StockLedger.deploy contract has been deployed at  ' + contractaddress);
				    
				    if (callback)
				    callback(null, contractaddress);
				    
				    return Promise.resolve(self);
				}).catch(err => {
				    console.log('error', err);
				});
				
				return promise2;
			}
		
			if (self.trufflecontract)
			return callfunc(self.trufflecontract);
			
			
		}).then(function(res) {
			console.log('StockLedger.deploy promise of deployment should be resolved')
		});
		
		return promise;
		
	}

	registerStakeHolder(payingaccount, gas, gasPrice, stakeholder, callback) {
		var self = this;
		var session = this.session;
		var EthereumNodeAccess = session.getEthereumNodeAccessInstance();

		var fromaddress = payingaccount.getAddress();
		
		var stakeholderidentifier = stakeholder.getLocalIdentifier();
		
		console.log('StockLedger.registerStakeHolder called for ' + stakeholderidentifier + " from " + fromaddress + " with gas limit " + gas + " and gasPrice " + gasPrice);
		
		
		// we check the account is unlocked
		if (payingaccount.isLocked())
			throw 'account ' + fromaddress + ' is locked, unable to register shareholder contract: ' + stakeholderidentifier;
		
		var promise = this.finalizeInit(function (res) {
			if (!res)
				return callback("contract did not finalize its initialization", null);

			return res;
			
		}).then(function (res) {
			var callfunc = function(instance) {
				var contractInstance = instance;
				
				var _shldr_address = stakeholder.getAddress();
				var _shldr_pubkey = stakeholder.getChainPubKey();
				
				var _shldr_identifier= stakeholder.getLocalIdentifier();
				var _shldr_privkey = stakeholder.getLocalPrivKey();
				
				var contractowneraccount = self.getSyncChainOwnerAccount();
				
				if (!contractowneraccount.canDoAesEncryption) {
					throw 'Can not encrypt data for the owner of the contract';
				}
				
				var _cocrypted_shldr_privkey = contractowneraccount.aesEncryptString(_shldr_privkey);
				var _cocrypted_shldr_identifier =  contractowneraccount.aesEncryptString(_shldr_identifier);
				
				var _registration_date = Date.now();
				
				console.log('registering a shareholder with address ' + _shldr_address + ' public key ' + _shldr_pubkey + ' crypted private key ' + _cocrypted_shldr_privkey + ' crypted identifier ' + _cocrypted_shldr_identifier + ' registration date ' + _registration_date);

				//var promise2 = contractInstance.registerShareHolder.call(_shldr_address, 
				/*var promise2 = contractInstance.registerShareHolder.sendTransaction(_shldr_address, 
																		_shldr_pubkey,
																		_cocrypted_shldr_privkey, 
																		_cocrypted_shldr_identifier, 
																		_registration_date,
																		{from: fromaddress, gas: gas, gasPrice: gasPrice}
																		)*/
				var promise2 = EthereumNodeAccess.truffle_method_sendTransaction(contractInstance, "registerShareHolder",
																		[_shldr_address, 
																		_shldr_pubkey,
																		_cocrypted_shldr_privkey, 
																		_cocrypted_shldr_identifier, 
																		_registration_date,
																		{from: fromaddress, gas: gas, gasPrice: gasPrice}]
																		)
																		.then(function(res) {
			    	
			    	console.log('returning from registerShareHolder with return ' + res);
			    	
			    	//stakeholder.setChainPosition(res);
			    	self.removeStakeHolderObject(stakeholder);
					
			    	if (callback)
						callback(null, res);
						
			    	return res;
			    });
			    
				return promise2;
			 };
		
			 if (self.trufflecontractinstance)
			 callfunc(self.trufflecontractinstance);
		
		});
		
		return promise;
		
	}
	
	registerIssuance(payingaccount, gas, gasPrice, issuance, callback) {
		var self = this;
		var session = this.session;
		var EthereumNodeAccess = session.getEthereumNodeAccessInstance();
		
		var fromaddress = payingaccount.getAddress();
		
		var issuancedescription = issuance.getLocalDescription();
		
		console.log('StockLedger.registerIssuance called for ' + issuancedescription + " from " + fromaddress + " with gas limit " + gas + " and gasPrice " + gasPrice);
		
		
		// we check the account is unlocked
		if (payingaccount.isLocked())
			throw 'account ' + fromaddress + ' is locked, unable to register issuance: ' + issuancedescription;
		
		var promise = this.finalizeInit(function (res) {
			if (!res)
				return callback("contract did not finalize its initialization", null);

			return res;
			
		}).then(function (res) {
			var callfunc = function(instance) {
				var contractInstance = instance;
				
				var _name = issuance.getLocalName(); 
				var localdescription = issuance.getLocalDescription(); 
				var  _numberofshares = issuance.getLocalNumberOfShares(); 
				var  _percentofcapital = issuance.getLocalPercentOfCapital(); 
				var _orderid = session.getTransactionUUID();
				
				var contractowneraccount = self.getSyncChainOwnerAccount();
				
				if (!contractowneraccount.canDoAesEncryption) {
					throw 'Can not encrypt data for the owner of the contract';
				}
				
				var _cocrypted_issuance_description = contractowneraccount.aesEncryptString(localdescription);
				
				var _registration_date = Date.now();
				
				console.log('registering an issuance with name ' + _name + ' description ' + localdescription + ' number of shares ' + _numberofshares + ' percent of capital ' + _percentofcapital + ' registration date ' + _registration_date);

				/*var promise2 = contractInstance.registerIssuance.sendTransaction(_name, 
																	_cocrypted_issuance_description,
																	_numberofshares, 
																	_percentofcapital, 
																	_registration_date,
																	_orderid,
																	{from: fromaddress, gas: gas, gasPrice: gasPrice}
																	)*/
				var promise2 = EthereumNodeAccess.truffle_method_sendTransaction(contractInstance, "registerIssuance",
																	[_name, 
																	_cocrypted_issuance_description,
																	_numberofshares, 
																	_percentofcapital, 
																	_registration_date,
																	_orderid,
																	{from: fromaddress, gas: gas, gasPrice: gasPrice}]
																	)
																	.then(function(res) {
			    	
			    	console.log('returning from registerIssuance with return ' + res);
			    	
			    	//issuance.setChainPosition(res);
			    	self.removeIssuanceObject(issuance);
					
			    	if (callback)
						callback(null, res);
						
			    	return res;
			    });
			    
				return promise2;
			 };
		
			 if (self.trufflecontractinstance)
			 callfunc(self.trufflecontractinstance);
		
		});
		
		return promise;
	}
	
	registerTransaction(payingaccount, gas, gasPrice, stocktransaction, callback) {
		var self = this;
		var session = this.session;
		var EthereumNodeAccess = session.getEthereumNodeAccessInstance();
		
		var fromaddress = payingaccount.getAddress();
		
		var transactionnumberofshares = stocktransaction.getLocalNumberOfShares();
		
		console.log('StockLedger.registerIssuance called for ' + transactionnumberofshares + " shares from " + fromaddress + " with gas limit " + gas + " and gasPrice " + gasPrice);
		
		
		// we check the account is unlocked
		if (payingaccount.isLocked())
			throw 'account ' + fromaddress + ' is locked, unable to register transaction of ' + transactionnumberofshares + ' shares';
		
		var promise = this.finalizeInit(function (res) {
			if (!res)
				return callback("contract did not finalize its initialization", null);

			return res;
			
		}).then(function (res) {
			var callfunc = function(instance) {
				var contractInstance = instance;
				
			    var _from = stocktransaction.getLocalFrom();
			    var _to = stocktransaction.getLocalTo();
			    
			    var _nature = stocktransaction.getLocalNature();
			    
			    var _issuancenumber = stocktransaction.getLocalIssuanceNumber();
			    var _numberofshares = stocktransaction.getLocalNumberOfShares();
			    var _consideration = stocktransaction.getLocalConsideration();
			    var _currency = stocktransaction.getLocalCurrency();
				
				var _orderid = session.getTransactionUUID();
				
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
					
					_cocrypted_consideration = contractowneraccount.rsaEncryptString(_consideration.toString());
					_cocrypted_currency = contractowneraccount.rsaEncryptString(_currency.toString());
					
					
					// sign order id
					var signature = sessionaccount.signString(_orderid);
				}
				else {
					throw 'You need to have a signed session to register a transaction';
				}
				
				var _registration_date = Date.now();
				
				console.log('registering a transaction from ' + _from + ' to ' + _to + ' of nature ' + _nature + ' for issuance ' + _issuancenumber + ' number of shares ' + _numberofshares + ' consideration ' + _consideration + ' ' + _currency + ' registration date ' + _registration_date);

				/*var promise2 = contractInstance.registerTransaction.sendTransaction(_numberofshares, 
																				_from, 
																				_to, 
																				_nature, 
																				_issuancenumber, 
																				_orderid, 
																				_registration_date, 
																				_consideration, 
																				_currency,
																		{from: fromaddress, gas: gas, gasPrice: gasPrice}
																		)*/
				var promise2 = EthereumNodeAccess.truffle_method_sendTransaction(contractInstance, "registerTransaction",
																				[_numberofshares, 
																				_from, 
																				_to, 
																				_nature, 
																				_issuancenumber, 
																				_orderid, 
																				_registration_date, 
																				_consideration, 
																				_currency,
																				{from: fromaddress, gas: gas, gasPrice: gasPrice}]
																				)
																				.then(function(res) {
			    	
			    	console.log('returning from registerTransaction with return ' + res);
			    	
			    	//stocktransaction.setChainPosition(res);
			    	self.removeTransactionObject(stocktransaction);
					
			    	if (callback)
						callback(null, res);
						
			    	return res;
			    });
			    
				return promise2;
			 };
		
			 if (self.trufflecontractinstance)
			 callfunc(self.trufflecontractinstance);
		
		});
		
		return promise;
	}
	
	// chain data
	
	// synchronous methods
	isSynchronousReady() {
		if (this.trufflecontractinstance == null)
			throw 'Contract instance not created';
		
		if (this.owner == null)
			throw 'Owner address not retrieved';
		
		if (this.owner_pubkey == null)
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
		
		if (this.owner_pubkey == null)
			throw 'Contract has not be completely loaded, can not call Stockledger.getSyncChainOwnerAccount at this point';
		
		account.setPublicKey(this.owner_pubkey);
		
		return account;
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
		var EthereumNodeAccess = session.getEthereumNodeAccessInstance();
		
		var promises = []
		
		var promiseinstance = this.getTruffleContractObject(function (err, res) {
			var trufflecontractinstance = res;
			
			if (!trufflecontractinstance)
				return callback("contract instance is null", null);

			return trufflecontractinstance;
			
		})
		
		var promiseowner = promiseinstance.then(function (trufflecontractinstance) {

			if (trufflecontractinstance)
			//return trufflecontractinstance.owner.call();
			return EthereumNodeAccess.truffle_method_call(trufflecontractinstance, "owner", [])
		
		}).then(function(res) {
	    	
	    	console.log('StockLedger.finalizeInit returning from owner with return ' + res);
	    	
	    	return res;
	    });
		
		promises.push(promiseowner);
		
		var promiseownerpubkey = promiseinstance.then(function (trufflecontractinstance) {
			
			if (trufflecontractinstance)
			//return trufflecontractinstance.owner_pubkey.call();
			return EthereumNodeAccess.truffle_method_call(trufflecontractinstance, "owner_pubkey", [])
			
		}).then(function(res) {
	    	
	    	console.log('StockLedger.finalizeInit returning from owner_pubkey with return ' + res);
	    	
			
	    	return res;
	    });

		promises.push(promiseownerpubkey);
		
		var promise_all = Promise.all(promises).then(function(arr) {
	    	self.owner = arr[0];
	    	self.owner_pubkey = arr[1];
	    	
	    	// set public key in owner account object
	    	var owneraccount = self.session.getAccountObject(self.owner);
	    	
	    	owneraccount.setPublicKey(self.owner_pubkey);
			
			self.finalized_init = true;
			
	    	console.log('StockLedger.finalizeInit all promises resolved with return ' + arr);
			callback(true);
		});
		
		
		return promise_all;
	}
	
	
	getChainLedgerName(callback) {
		console.log('StockLedger.getChainLedgerName called for ' + this.address);
		
		var self = this;
		var session = this.session;
		var EthereumNodeAccess = session.getEthereumNodeAccessInstance();
		
		var promise = this.getTruffleContractObject(function (err, res) {
			var trufflecontractinstance = res;
			
			if (!trufflecontractinstance)
				return callback("contract instance is null", null);

			return trufflecontractinstance;
			
		}).then(function (trufflecontractinstance) {
			var callfunc = function(instance) {
				var contractInstance = instance;
				

				var promise2 = EthereumNodeAccess.truffle_method_call(contractInstance, "ledger_name", []).then(function(res) {
				//var promise2 = contractInstance.ledger_name.call().then(function(res) {
			    	
			    	console.log('returning from ledger_name with return ' + res);
			    	
			    	self.ledger_name = res;
					
			    	if (callback)
						callback(null, res);
						
			    	return res;
			    });
			    
				return promise2;
			 };
		
			 if (trufflecontractinstance)
			 callfunc(trufflecontractinstance);
		
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
		var EthereumNodeAccess = session.getEthereumNodeAccessInstance();
		
		var promise = this.getTruffleContractObject(function (err, res) {
			var trufflecontractinstance = res;

			if (!trufflecontractinstance)
				return callback("contract instance is null", null);
			
			return trufflecontractinstance;
			
		}).then(function (trufflecontractinstance) {
			var callfunc = function(instance) {
				var contractInstance = instance;

				//var promise2 = contractInstance.cocrypted_ledger_description.call().then(function(res) {
				var promise2 = EthereumNodeAccess.truffle_method_call(contractInstance, "cocrypted_ledger_description", []).then(function(res) {
			    	
			    	console.log('returning from cocrypted_ledger_description with return ' + res);
			    	
			    	self.cocrypted_ledger_description = res;
					
			    	if (callback)
						callback(null, res);
						
			    	return res;
			    });
			    
				return promise2;
			 };
		
			
			 if (trufflecontractinstance)
			callfunc(trufflecontractinstance);
			
		});
		
		return promise;
		
	}
	
	getChainOwner(callback) {
		console.log('StockLedger.getChainOwner called for ' + this.address);
		
		var self = this;
		var session = this.session;
		var EthereumNodeAccess = session.getEthereumNodeAccessInstance();
		
		var promise = this.getTruffleContractObject(function (err, res) {
			var trufflecontractinstance = res;
			var numberofshares;

			if (!trufflecontractinstance)
				return callback("contract instance is null", null);
			
			return trufflecontractinstance;
				
		}).then(function (trufflecontractinstance) {
			var callfunc = function(instance) {
				var contractInstance = instance;

				var promise2 = EthereumNodeAccess.truffle_method_call(contractInstance, "owner", []).then(function(res) {
				//var promise2 = contractInstance.owner.call().then(function(res) {
			    	
			    	console.log('returning from owner with return ' + res);
			    	
			    	self.owner = res;
					
			    	if (callback)
						callback(null, res);
						
			    	return res;
			    });
			    
				return promise2;
			 };
		
			 if (trufflecontractinstance)
			callfunc(trufflecontractinstance);
			
		});
		
		return promise;
		
	}
	
	getChainOwnerPublicKey(callback) {
		console.log('StockLedger.getChainOwnerPublicKey called for ' + this.address);
		
		var self = this;
		var session = this.session;
		var EthereumNodeAccess = session.getEthereumNodeAccessInstance();
		
		var promise = this.getTruffleContractObject(function (err, res) {
			var trufflecontractinstance = res;
			var numberofshares;

			if (!trufflecontractinstance)
				return callback("contract instance is null", null);
			
			return trufflecontractinstance;
				
		}).then(function (trufflecontractinstance) {
			var callfunc = function(instance) {
				var contractInstance = instance;

				var promise2 = EthereumNodeAccess.truffle_method_call(contractInstance, "owner_pubkey", []).then(function(res) {
				//var promise2 = contractInstance.owner_pubkey.call().then(function(res) {
			    	
			    	console.log('returning from owner_pubkey with return ' + res);
			    	
			    	self.owner_pubkey = res;
					
			    	if (callback)
						callback(null, res);
						
			    	return res;
			    });
			    
				return promise2;
			 };
		
			 if (trufflecontractinstance)
			callfunc(trufflecontractinstance);
			
		});
		
		return promise;
		
	}
	
	getChainContractName(callback) {
		console.log('StockLedger.getChainContractName called for ' + this.address);
		
		var self = this;
		var session = this.session;
		var EthereumNodeAccess = session.getEthereumNodeAccessInstance();
		
		var promise = this.getTruffleContractObject(function (err, res) {
			var trufflecontractinstance = res;
			var numberofshares;

			if (!trufflecontractinstance)
				return callback("contract instance is null", null);
			
			return trufflecontractinstance;
			
		}).then(function (trufflecontractinstance) {
			var callfunc = function(instance) {
				var contractInstance = instance;

				var promise2 = EthereumNodeAccess.truffle_method_call(contractInstance, "contract_name", []).then(function(res) {
				//var promise2 = contractInstance.contract_name.call().then(function(res) {
			    	
			    	console.log('returning from contract_name with return ' + res);
			    	
			    	self.contract_name = res;
					
			    	if (callback)
						callback(null, res);
						
			    	return res;
			    });
			    
				return promise2;
			 };
		
			 if (trufflecontractinstance)
			callfunc(trufflecontractinstance);
			
		});
		
		return promise;
		
	}
	
	getChainContractVersion(callback) {
		console.log('StockLedger.getChainContractVersion called for ' + this.address);
		
		var self = this;
		var session = this.session;
		var EthereumNodeAccess = session.getEthereumNodeAccessInstance();
		
		var promise = this.getTruffleContractObject(function (err, res) {
			var trufflecontractinstance = res;

			if (!trufflecontractinstance)
				return callback("contract instance is null", null);
			
				return trufflecontractinstance;
		}).then(function (trufflecontractinstance) {
			var callfunc = function(instance) {
				var contractInstance = instance;

				var promise2 = EthereumNodeAccess.truffle_method_call(contractInstance, "contract_version", []).then(function(res) {
				//var promise2 = contractInstance.contract_version.call().then(function(res) {
			    	
			    	console.log('returning from contract_version with return ' + res);
			    	
			    	self.contract_version = res;
					
			    	if (callback)
						callback(null, res);
						
			    	return res;
			    });
			    
				return promise2;
			 };
		
			 if (trufflecontractinstance)
			callfunc(trufflecontractinstance);
			
		});
		
		return promise;
		
	}
	
	// shareholders
	getChainStakeHolderCount(callback) {
		console.log('StockLedger.getChainStakeHolderCount called for ' + this.address);
		
		var self = this;
		var session = this.session;
		var EthereumNodeAccess = session.getEthereumNodeAccessInstance();
		
		var promise = this.finalizeInit(function (res) {
			if (!res)
				return callback("contract did not finalize its initialization", null);

			return res;
			
		}).then(function (trufflecontractinstance) {
			var callfunc = function(instance) {
				var contractInstance = instance;

				var promise2 = EthereumNodeAccess.truffle_method_call(contractInstance, "getShareHolderCount", []).then(function(res) {
				//var promise2 = contractInstance.getShareHolderCount.call().then(function(res) {
			    	
			    	console.log('returning from getShareHolderCount with return ' + res);
			    	
			    	self.contract_version = res;
					
			    	if (callback)
						callback(null, res);
			    	
			    	return res;
			    });
			    
				return promise2;
			 };
		
			 if (self.trufflecontractinstance)
			 return callfunc(self.trufflecontractinstance);
			
		});
		
		return promise;
		
	}
	
	getChainStakeHolderAt(index, callback) {
		console.log('StockLedger.getChainStakeHolderAt called for ' + this.address + ' at index ' + index);
		
		var self = this;
		var session = this.session;
		var EthereumNodeAccess = session.getEthereumNodeAccessInstance();

		var owner = this.localowner;
		
		var promise = this.finalizeInit(function (res) {
			if (!res)
				return callback("contract did not finalize its initialization", null);

			return res;
			
		}).then(function (res) {
			var callfunc = function(instance) {
				var contractInstance = instance;

				var EthereumNodeAccess = session.getEthereumNodeAccessInstance();
				var promise2 = EthereumNodeAccess.truffle_method_call(contractInstance, "getShareHolderAt", [index]);
				//var promise2 = contractInstance.getShareHolderAt.call(index);
			    
				return promise2;
			 };
		
			if (self.trufflecontractinstance)
			 return callfunc(self.trufflecontractinstance);
			
		}).then( function(res_array) {
			// address, cocrypted_shldr_key, cocrypted_shldr_identifier, registration_date, block_date
			var address = (res_array && res_array[0] ? res_array[0] : null);
			var shldr_pubkey = (res_array && res_array[1] ? res_array[1] : null);
			var cocrypted_shldr_privkey = (res_array && res_array[2] ? res_array[2] : null);
			var cocrypted_shldr_identifier = (res_array && res_array[3] ? res_array[3] : null);
			var registration_date = (res_array && res_array[4] ? res_array[4] : null);
			var block_date = (res_array && res_array[5] ? res_array[5] : null);
	    	
			console.log('returning from getShareHolderAt with address ' + address + ' publickey ' + shldr_pubkey + ' cocrypted ' + cocrypted_shldr_privkey + ' regdate ' + registration_date + ' block date ' + block_date);
			
	    	var stakeholder = session.createStakeHolderObject(address);
	    	
	    	stakeholder.setChainPosition(index);
	    	stakeholder.setChainPubKey(shldr_pubkey);
	    	stakeholder.setChainCocryptedPrivKey(cocrypted_shldr_privkey);
	    	stakeholder.setChainCocryptedIdentifier(cocrypted_shldr_identifier);
	    	stakeholder.setChainRegistrationDate(registration_date);
	    	stakeholder.setChainBlockDate(block_date);
	    	
	    	self.addChainStakeHolderAt(stakeholder, index);
			
	    	if (callback)
				callback(null, stakeholder);
				
	    });
		
		return promise;
		
	}
	
	getChainStakeHolderList(callback) {
		console.log('StockLedger.getChainStakeHolderList called for ' + this.address);
		
		var self = this;
		var session = this.session;
		var EthereumNodeAccess = session.getEthereumNodeAccessInstance();
		
		var promise = this.finalizeInit(function (res) {
			if (!res)
				return callback("contract did not finalize its initialization", null);

			return res;
			
		}).then(function (trufflecontractinstance) {
			var callfunc = function(instance) {
				var contractInstance = instance;

				return self.getChainStakeHolderCount(function (err, res) {
					var count = res;
					console.log("count of stakeholders is " + count);
					var promises = [];
					
					for (var i = 0; i < count; i++) {
						var promise = self.getChainStakeHolderAt(i);
						promises.push(promise);
					}
					
					return Promise.all(promises).then(function(res) {
				    	console.log("all getChainStakeHolderAt promises have been resolved, array is now complete");
						
				    	if (callback)
							callback(null, self.chainstakeholderarray);
			    	});
				});
			 };
		
			if (self.trufflecontractinstance)
			 callfunc(self.trufflecontractinstance);
			
		});
		
		return promise;
		
	}
	
	// issuances
	getChainIssuanceAt(index, callback) {
		console.log('StockLedger.getChainIssuanceAt called for ' + this.address + ' at index ' + index);
		
		var self = this;
		var session = this.session;
		var EthereumNodeAccess = session.getEthereumNodeAccessInstance();

		var owner = this.localowner;
		
		var promise = this.finalizeInit(function (res) {
			if (!res)
				return callback("contract did not finalize its initialization", null);

			return res;
			
		}).then(function (trufflecontractinstance) {
			var callfunc = function(instance) {
				var contractInstance = instance;

				var promise2 = EthereumNodeAccess.truffle_method_call(contractInstance, "getIssuanceAt", [index]).then(function(res_array) {
				//var promise2 = contractInstance.getIssuanceAt.call(index).then( function(res_array) {
			    	
					console.log('returning from getChainIssuanceAt with return ' + res_array);
					
			    	var issuance = session.createBlankStockIssuanceObject();
			    	
			    	var numberofshares = res_array[0];
			    	var percentofcapital = res_array[1]; 
			    	var issuance_date = res_array[2]; 
			    	var block_date = res_array[3]; 
			    	var name = res_array[4]; 
			    	var cocrypted_description = res_array[5]; 
			    	var cancel_date = res_array[6]; 
			    	var cancel_block_date = res_array[7];
			    	
			    	issuance.setChainPosition(index);
			    	
			    	issuance.setChainNumberOfShares(numberofshares);
			    	issuance.setChainPercentOfCapital(percentofcapital);
			    	issuance.setChainIssuanceDate(issuance_date);
			    	issuance.setChainIssuanceBlockDate(block_date);
			    	issuance.setChainName(name);
			    	issuance.setChainCocryptedDescription(cocrypted_description);
			    	issuance.setChainCancelDate(cancel_date);
			    	issuance.setChainCancelBlockDate(cancel_block_date);

			    	self.addChainIssuanceAt(issuance, index);
					
			    	if (callback)
						callback(null, issuance);
						
			    });
			    
				return promise2;
			 };
		
			 if (self.trufflecontractinstance)
			 return callfunc(self.trufflecontractinstance);
			
		});
		
		return promise;
		
	}
	
	getChainIssuanceCount(callback) {
		console.log('StockLedger.getChainIssuanceCount called for ' + this.address);
		
		var self = this;
		var session = this.session;
		var EthereumNodeAccess = session.getEthereumNodeAccessInstance();
		
		var promise = this.finalizeInit(function (res) {
			if (!res)
				return callback("contract did not finalize its initialization", null);

			return res;
			
		}).then(function (trufflecontractinstance) {
			var callfunc = function(instance) {
				var contractInstance = instance;

				var promise2 = EthereumNodeAccess.truffle_method_call(contractInstance, "getIssuanceCount", []).then(function(res) {
				//var promise2 = contractInstance.getIssuanceCount.call().then(function(res) {
			    	
			    	console.log('returning from getIssuanceCount with return ' + res);
			    	
			    	self.contract_version = res;
					
			    	if (callback)
						callback(null, res);
						
			    });
			    
				return promise2;
			 };
		
			 if (self.trufflecontractinstance)
			 return callfunc(self.trufflecontractinstance);
			
		});
		
		return promise;
		
	}
	
	getChainIssuanceList(callback) {
		console.log('StockLedger.getChainIssuanceList called for ' + this.address);
		
		var self = this;
		var session = this.session;
		var EthereumNodeAccess = session.getEthereumNodeAccessInstance();
		
		var promise = this.finalizeInit(function (res) {
			if (!res)
				return callback("contract did not finalize its initialization", null);

			return res;
			
		}).then(function (trufflecontractinstance) {
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
		
			if (self.trufflecontractinstance)
			 callfunc(self.trufflecontractinstance);
			
		});
		
		return promise;
		
	}
	
	// transactions
	getChainTransactionAt(index, callback) {
		console.log('StockLedger.getChainTransactionAt called for ' + this.address + ' at index ' + index);
		
		var self = this;
		var session = this.session;
		var EthereumNodeAccess = session.getEthereumNodeAccessInstance();

		var owner = this.localowner;
		
		var promise = this.finalizeInit(function (res) {
			if (!res)
				return callback("contract did not finalize its initialization", null);

			return res;
			
		}).then(function (trufflecontractinstance) {
			var callfunc = function(instance) {
				var contractInstance = instance;

				var promise2 = EthereumNodeAccess.truffle_method_call(contractInstance, "getTransactionAt", [index]).then(function(res_array) {
				//var promise2 = contractInstance.getTransactionAt.call(index).then( function(res_array) {
			    	
					console.log('returning from getChainTransactionAt with return ' + res_array);
					
			    	var transaction = session.createBlankStockTransactionObject();
			    	
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
			    	

			    	self.addChainTransactionAt(transaction, index);
					
			    	if (callback)
						callback(null, transaction);
						
			    });
			    
				return promise2;
			 };
		
			 if (self.trufflecontractinstance)
			 return callfunc(self.trufflecontractinstance);
			
		});
		
		return promise;
		
	}
	
	getChainTransactionCount(callback) {
		console.log('StockLedger.getChainTransactionCount called for ' + this.address);
		
		var self = this;
		var session = this.session;
		var EthereumNodeAccess = session.getEthereumNodeAccessInstance();
		
		var promise = this.finalizeInit(function (res) {
			if (!res)
				return callback("contract did not finalize its initialization", null);

			return res;
			
		}).then(function (trufflecontractinstance) {
			var callfunc = function(instance) {
				var contractInstance = instance;

				var promise2 = EthereumNodeAccess.truffle_method_call(contractInstance, "getTransactionCount", []).then(function(res) {
				//var promise2 = contractInstance.getTransactionCount.call().then(function(res) {
			    	
			    	console.log('returning from getTransactionCount with return ' + res);
			    	
			    	self.contract_version = res;
					
			    	if (callback)
						callback(null, res);
						
			    });
			    
				return promise2;
			 };
		
			 if (self.trufflecontractinstance)
			 return callfunc(self.trufflecontractinstance);
			
		});
		
		return promise;
		
	}
	
	getChainTransactionList(callback) {
		console.log('StockLedger.getChainTransactionList called for ' + this.address);
		
		var self = this;
		var session = this.session;
		var EthereumNodeAccess = session.getEthereumNodeAccessInstance();
		
		var promise = this.finalizeInit(function (res) {
			if (!res)
				return callback("contract did not finalize its initialization", null);

			return res;
			
		}).then(function (trufflecontractinstance) {
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
		
			if (self.trufflecontractinstance)
			 callfunc(self.trufflecontractinstance);
			
		});
		
		return promise;
		
	}
}


if ( typeof GlobalClass !== 'undefined' && GlobalClass )
GlobalClass.StockLedger = StockLedger;
else
module.exports = StockLedger; // we are in node js
