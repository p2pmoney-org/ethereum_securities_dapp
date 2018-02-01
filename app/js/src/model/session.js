/**
 * 
 */
'use strict';

class Session {
	constructor() {
		
		this.sessionuuid = null;
		
		this.contracts = null;

		// web3
		this.web3providerurl = null;
		this.web3instance = null;
		
		// instantiation mechanism
		this.classmap = Object.create(null); 
		
		
		this.accountmap = new Session.AccountMap();

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
	
	getWeb3Provider() {
		var web3providerurl = this.getWeb3ProviderUrl();
		var web3Provider = new Session.Web3.providers.HttpProvider(web3providerurl);

		return web3Provider;
	}
	
	getWeb3Instance() {
		if (this.web3instance)
			return this.web3instance;
		
		var web3Provider = this.getWeb3Provider();
		  
		this.web3instance = new Session.Web3(web3Provider);		
		
		console.log("web3 instance created");
		
		return this.web3instance;
	}
	
	getEthereumJsInstance() {
		return Session.ethereumjs;
	}
	
	getKeythereumInstance() {
		return Session.keythereum;
	}
	
	getEthereumNodeAccessInstance() {
		return new Session.EthereumNodeAccess(this);
	}
	


	// truffle
	getTruffleContractObject(contractartifact) {
		//var TruffleContract = this.getClass('TruffleContract');
		  
		var trufflecontract = Session.TruffleContract(contractartifact);
	  
		trufflecontract.setProvider(this.getWeb3Provider());
		
		return trufflecontract;
	}
	
	loadArtifact(jsonfile, callback) {
		console.log("requiring load of artifact " + jsonfile);
		var loadpromise 
		
		if ( !this.nodejs ) {
			loadpromise = $.getJSON('./contracts/StockLedger.json', function(data) {
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
		var ethereumjs = this.getEthereumJsInstance();
		
		if (ethereumjs.Util.isValidAddress(address)){
			return true;
		}
		else {
			throw address + ' is not a valid address!';
		}
	}

	isValidPublicKey(pubkey) {
		var ethereumjs = this.getEthereumJsInstance();
		
		var pubkeystr = pubkey.substring(2); // remove leading '0x'
		var pubkeybuf = ethereumjs.Buffer.Buffer(pubkeystr, 'hex'); 
		
		if (ethereumjs.Util.isValidPublic(pubkeybuf)){
			return true;
		}
		else {
			throw pubkey + ' is not a valid public key!';
		}
	}
	
	isValidPrivateKey(privkey) {
		var ethereumjs = this.getEthereumJsInstance();
		
		/*console.log('typeof ethereumjs:',               (typeof ethereumjs));
		console.log('Object.keys(ethereumjs):',         Object.keys(ethereumjs));
		console.log('typeof ethereumjs.Tx:',            (typeof ethereumjs.Tx));
		console.log('typeof ethereumjs.RLP:',           (typeof ethereumjs.RLP));
		console.log('typeof ethereumjs.Util:',          (typeof ethereumjs.Util));
		console.log('typeof ethereumjs.Buffer:',        (typeof ethereumjs.Buffer));
		console.log('typeof ethereumjs.Buffer.Buffer:', (typeof ethereumjs.Buffer.Buffer));*/
		
		var privkeystr = privkey.substring(2); // remove leading '0x'
		var privkeybuf = ethereumjs.Buffer.Buffer(privkeystr, 'hex'); 
		
		if (ethereumjs.Util.isValidPrivate(privkeybuf)){
			return true;
		}
		else {
			throw privkey + ' is not a valid private key!';
		}
	}
	
	generatePrivateKey() {
		var ethereumjs = this.getEthereumJsInstance();

		var accountPassword="123456";
		var key = ethereumjs.Wallet.generate(accountPassword);
		return '0x' + key._privKey.toString('hex');		
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
		
		return (address1.toLowerCase() == address2.toLowerCase());
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
	getContractsObject() {
		if (this.contracts)
			return this.contracts;
		
		this.contracts = new Session.Contracts(this);
		
		return this.contracts;
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
	
	
	// stakeholders
	createStakeHolderObject(address) {
		return new Session.StakeHolder(this, address);
	}
	
	createBlankStakeHolderObject() {
		return new Session.StakeHolder(this, null);
	}
	
	getStakeHoldersFromJsonArray(jsonarray) {
		return Session.StakeHolder.getStakeHoldersFromJsonArray(this, jsonarray)
	}
	
	// issuances
	createBlankStockIssuanceObject() {
		return new Session.StockIssuance(this);
	}
	
	getStockIssuancesFromJsonArray(jsonarray) {
		return Session.StockIssuance.getStockIssuancesFromJsonArray(this, jsonarray)
	}
	
	// transactions
	createBlankStockTransactionObject() {
		return new Session.StockTransaction(this);
	}
	
	getStockTransactionsFromJsonArray(jsonarray) {
		return Session.StockTransaction.getStockTransactionsFromJsonArray(this, jsonarray)
	}
	
	getTransactionUUID() {
		return 'txn_' + this.guid();
	}
	
	guid() {
		  function s4() {
		    return Math.floor((1 + Math.random()) * 0x10000)
		      .toString(16)
		      .substring(1);
		  }
		  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
		    s4() + '-' + s4() + s4() + s4();
	}
}

if ( typeof GlobalClass !== 'undefined' && GlobalClass )
GlobalClass.Session = Session;
else
module.exports = Session; // we are in node js