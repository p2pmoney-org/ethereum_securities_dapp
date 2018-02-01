/**
 * 
 */
'use strict';

var GlobalObject;

var ETHER_TO_WEI = 1000000000000000000;


class Global {
	
	// status
	static get STATUS_LOCAL() { return 1;}	
	static get STATUS_DEPLOYED() { return 2;}	
	
	// forms
	static get FORM_ADD_CONTRACT_ADDRESS() { return 1;}	
	
	static get FORM_CREATE_CONTRACT() { return 2;}	// local
	static get FORM_MODIFY_CONTRACT() { return 3;}	
	
	static get FORM_DEPLOY_CONTRACT() { return 5;}	// blockchain
	static get FORM_UPDATE_CONTRACT() { return 6;}	
	
	static get FORM_CREATE_STAKEHOLDER() { return 10}	// local
	static get FORM_MODIFY_STAKEHOLDER() { return 11}	

	static get FORM_DEPLOY_STAKEHOLDER() { return 15}	
	
	static get FORM_CREATE_ISSUANCE() { return 20}	
	static get FORM_MODIFY_ISSUANCE() { return 21}	
	
	static get FORM_DEPLOY_ISSUANCE() { return 25}	
	
	static get FORM_CREATE_TRANSACTION() { return 30}// local
	static get FORM_MODIFY_TRANSACTION() { return 31}	

	static get FORM_DEPLOY_TRANSACTION() { return 35}	
	
	// views
	static get VIEW_CONTRACT_LIST() { return 1;}
	static get VIEW_CONTRACT() { return 5;}
	
	static get VIEW_CONTRACT_STAKEHOLDERS() { return 10;}
	static get VIEW_CONTRACT_STAKEHOLDER() { return 15;}
	
	static get VIEW_CONTRACT_ISSUANCES() { return 20;}	
	static get VIEW_CONTRACT_ISSUANCE() { return 25;}	

	static get VIEW_CONTRACT_TRANSACTIONS() { return 30;}	
	static get VIEW_CONTRACT_TRANSACTION() { return 35;}

	constructor(app) {
		this.app = app;

		this.classmap = Object.create(null); 
		
		// control
		this.controllers = null;
		
		// ui management
		this.breadcrumbs = null;
		this.forms = null;
		this.views = null;
		
		// state of the navigation
		this.currentformband = Global.FORM_ADD_CONTRACT_ADDRESS;
		this.currentviewband = Global.VIEW_CONTRACT_LIST;
		
		this.currentcontract = null;
		this.currentstakeholder = null;
		this.currentissuance = null;
		this.currenttransaction = null;
		
		// model
		this.session = null;
		
		this.globalscope = null;
		this.initialized = false;
		this.initGlobalScope();
		
	}
	
	initGlobalScope() {
		if ( typeof window !== 'undefined' && window ) {
			// if we are in browser and not node js
			this.globalscope = window;
			
			Global.Web3 = Web3;
			Global.TruffleContract = TruffleContract;
			Global.ethereumjs = ethereumjs;
			Global.keythereum = keythereum;
			
			Global.EthereumNodeAccess = EthereumNodeAccess;
			
		}
		else {
			// node js (e.g. truffle migrate)
			this.globalscope = global;
			
			Global.Web3 = require('web3');
			Global.TruffleContract = require('truffle-contract');
			
			Global.ethereumjs = require('ethereum.js');
			Global.ethereumjs.Util = require('ethereumjs-util');
			Global.ethereumjs.Wallet = require('ethereumjs-wallet');
			
			Global.keythereum = require('keythereum');
			
			Global.EthereumNodeAccess = require('../lib/ethereum-node-access.js');

			
			Global.Session = require('./model/session.js');
			Global.Account = require('./model/account.js');
			Global.AccountMap = Global.Account.AccountMap;
			Global.Contracts = require('./model/contracts.js');
			Global.StakeHolder = require('./model/stakeholder.js');
			Global.StockIssuance = require('./model/stockissuance.js');
			Global.StockLedger = require('./model/stockledger.js');
			Global.StockTransaction = require('./model/stocktransaction.js');
		}
	}
	
	finalizeGlobalScopeInit(callback) {
		console.log('Global.finalizeGlobalScopeInit called');
		
		if (this.initialized) {
			if (callback)
				callback(true);
			
			return;
		}
		
		var self = this;
		
		var promises = [];
		var promise;
		
		if ( typeof window !== 'undefined' && window ) {
			var ethereum_node_access_path = self.globalscope.Config.getXtraValue('ethereum_node_access_path');
			
			if (ethereum_node_access_path) {
				console.log("overloading EthereumNodeAccess facade with " + ethereum_node_access_path);
				
				var promise = new Promise(function(resolve, reject) {
					self.app.include(ethereum_node_access_path, function(err, res) {
						if (!err) {
							Global.EthereumNodeAccess = window.Xtra_EthereumNodeAccess;
							
							// in case session object already requested, reapply
							Global.Session.EthereumNodeAccess = Global.EthereumNodeAccess;
						}
						
						return resolve(true);
					});
					
					
				});
				promises.push(promise);
			}

		}
		
		Promise.all(promises).then(function(arr) {
			console.log("Global.finalizeGlobalScopeInit resolved");
			
			self.initialized = true;
			
			if (callback)
				callback(true);
		});
		
	}
	
	// state
	
	// display
	getCurrentFormBand() {
		return this.currentformband;
	}
	
	setCurrentFormBand(value) {
		this.currentviewband = (value ? value : Global.FORM_ADD_ADDRESS);

		this.currentformband = value;
	}
	
	getCurrentViewBand() {
		return this.currentviewband;
	}
	
	setCurrentViewBand(value) {
		this.currentviewband = (value ? value : Global.VIEW_CONTRACT_LIST);
	}
	
	// objects
	resetNavigation() {
		this.currentcontract = null;
		this.currentstakeholder = null;
		this.currentissuance = null;
		this.currenttransaction = null;
	}
	
	getCurrentContract() {
		return this.currentcontract;
	}
	
	setCurrentContract(contract) {
		this.currentcontract = contract;
	}
	
	getCurrentStakeHolder() {
		return this.currentstakeholder;
	}
	
	setCurrentStakeHolder(stakeholder) {
		this.currentstakeholder = stakeholder;
	}
	
	getCurrentIssuance() {
		return this.currentissuance;
	}
	
	setCurrentIssuance(issuance) {
		this.currentissuance = issuance;
	}
	
	getCurrentTransaction() {
		return this.currenttransaction;
	}
	
	setCurrentTransaction(transaction) {
		this.currenttransaction = transaction;
	}
	
	// object instances
	getAppObject() {
		return this.app;
	}
	
	getControllersObject() {
		if (this.controllers)
			return this.controllers;
		
		this.controllers = new Global.Controllers(this);
		this.globalscope.Global.Controllers.setGlobalClass(Global);
		
		return this.controllers;
	}
	
	// ui
	getBreadCrumbsObject() {
		if (this.breadcrumbs)
			return this.breadcrumbs;
		
		this.breadcrumbs = new Global.BreadCrumbs(this);
		
		return this.breadcrumbs;
	}
	
	getFormsObject() {
		if (this.forms)
			return this.forms;
		
		this.forms = new Global.Forms(this);
		
		return this.forms;
	}
	
	getViewsObject() {
		if (this.views)
			return this.views;
		
		this.views = new Global.Views(this);
		
		return this.views;
	}
	
	// class map
	getGlobalClass() {
		return Global;
	}
	
	getClass(classname) {
		if (classname == 'Global')
			return Global;
		
		if (classname in this.classmap) {
			return this.classmap[classname];
		}
	}
	
	addClass(classname, theclass) {
		this.classmap[classname] = theclass;
	}
	
	// client side persistence
	readLocalJson() {
		var jsonstring = localStorage.getItem('securities-ledgers');
		
		console.log("local storage json is " + jsonstring);
		
		var json = JSON.parse(jsonstring);
		
		return json;
	}
	
	saveLocalJson(json) {
		localStorage.setItem('securities-ledgers', JSON.stringify(json));
	}
	
	saveContractObjects(contracts) {
		var json = contracts.getContractObjectsJson();
		console.log("contracts json is " + JSON.stringify(json));
		
		this.saveLocalJson(json);
		
	}

	
	// web3
	getWeb3ProviderUrl() {
		return this.globalscope.Config.getWeb3ProviderUrl();
	}
	
	getWeb3Instance() {
		var session = this.getSessionObject();

		return session.getWeb3Instance();
	}
	
	
	// wallet
	useWalletAccount() {
		var wallletaccount = this.globalscope.Config.getWalletAccountAddress();
		
		if (wallletaccount)
			return true;
		else
			return false;
	}
	
	getWalletAccountAddress() {
		return this.globalscope.Config.getWalletAccountAddress();
	}
	
	useWalletAccountChallenge() {
		return this.globalscope.Config.useWalletAccountChallenge();
	}
	
	needToUnlockAccounts() {
		return this.globalscope.Config.needToUnlockAccounts();
	}
	
	
	//
	// model
	//
	getSessionObject() {
		if (this.session)
			return this.session;

		// set in the Session global object classes used in the model
		
		Global.Session.Config = this.globalscope.Config;
		
		// libs
		Global.Session.Web3 = Global.Web3;
		Global.Session.TruffleContract = Global.TruffleContract;
		Global.Session.ethereumjs = Global.ethereumjs;
		Global.Session.keythereum = Global.keythereum;
		Global.Session.EthereumNodeAccess = Global.EthereumNodeAccess;
		
		// model classes
		Global.Session.Contracts = Global.Contracts;
		Global.Session.Account = Global.Account;
		Global.Session.AccountMap = Global.AccountMap;
		Global.Session.StockLedger = Global.StockLedger;
		Global.Session.StockIssuance = Global.StockIssuance;
		Global.Session.StockTransaction = Global.StockTransaction;
		Global.Session.StakeHolder = Global.StakeHolder;
		
		var web3providerurl = this.getWeb3ProviderUrl();
		
		this.session = new Global.Session();
		
		if ( typeof window !== 'undefined' && window ) {
			this.session.setIsInNodejs(false);
		}
		
		// web3
		this.session.setWeb3ProviderUrl(web3providerurl);
		
		// config
		this.session.setWalletAccountAddress(this.getWalletAccountAddress());
		this.session.setNeedToUnlockAccounts(this.needToUnlockAccounts());
		
		return this.session;
		
	}
	
	getContractsObject() {
		var session = this.getSessionObject();
		
		return session.getContractsObject();
	}
	
	// accounts
	getAccountObject(address) {
		var session = this.getSessionObject();
		
		return session.getAccountObject(address);
	}
	
	createBlankAccountObject() {
		var session = this.getSessionObject();
		
		return session.createBlankAccountObject();
	}
	
	// stakeholders
	createStakeHolderObject(address) {
		var session = this.getSessionObject();

		return session.createStakeHolderObject(address);
	}
	
	createBlankStakeHolderObject() {
		var session = this.getSessionObject();

		return session.createBlankStakeHolderObject();
	}
	
	getStakeHoldersFromJsonArray(jsonarray) {
		var session = this.getSessionObject();
		
		return session.getStakeHoldersFromJsonArray(jsonarray);
	}
	
	getStakeholderDisplayName(address, contract) {
		var session = this.getSessionObject();
		
		var displayname = (session.isSessionAccountAddress(address) ? 'You' : address);
		
		if (displayname != 'You') {
			var ownsContract = session.ownsContract(contract);
			
			if (ownsContract) {
				// we can read the stakeholdername
				var stakeholder = contract.getChainStakeholderFromAddress(address);
				
				if (stakeholder) {
					var contractowneraccount = contract.getOwnerAccount();
					
					if (contractowneraccount)
					displayname = contractowneraccount.aesDecryptString(stakeholder.getChainCocryptedIdentifier());
				}
			}
		}
		
	    return displayname;
	}
	
	// issuances
	createBlankStockIssuanceObject() {
		var session = this.getSessionObject();
		
		return session.createBlankStockIssuanceObject();
	}
	
	getStockIssuancesFromJsonArray(jsonarray) {
		var session = this.getSessionObject();
		
		return session.getStockIssuancesFromJsonArray(jsonarray)
	}
	
	// transactions
	createBlankStockTransactionObject() {
		var session = this.getSessionObject();
		
		return session.createBlankStockTransactionObject();
	}
	
	getStockTransactionsFromJsonArray(jsonarray) {
		var session = this.getSessionObject();
		
		return session.getStockTransactionsFromJsonArray(jsonarray)
	}
	
	
	// utility
	guid() {
		  function s4() {
		    return Math.floor((1 + Math.random()) * 0x10000)
		      .toString(16)
		      .substring(1);
		  }
		  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
		    s4() + '-' + s4() + s4() + s4();
	}
	
	areAddressesEqual(address1, address2) {
		var session = this.getSessionObject();
		
		return session.areAddressesEqual(address1, address2);
	}
	
	// static functions
	static createGlobalObject(app) {
		if (GlobalObject)
			return GlobalObject;
		
		GlobalObject = new Global(app);

		// spawning potential asynchronous operations
		GlobalObject.finalizeGlobalScopeInit(function(res) {
			console.log("Global object is now up and ready!");
		});

		return GlobalObject;
		
	}
	
	static getGlobalObject() {
		if (GlobalObject)
			return GlobalObject;
		
		throw "global object has not been initialized!";
	}
	
	
	// ether
	static getWeiFromEther(numofether) {
		var wei = numofether * ETHER_TO_WEI;

		return wei;
	}
	
	static getEtherFromwei(numofwei) {
		var ether = numofwei / ETHER_TO_WEI;

		return ether;
	}
	
}

var GlobalClass = Global;

if ( typeof window !== 'undefined' && window ) // if we are in browser and not node js (e.g. truffle)
window.Global = Global;
else
module.exports = Global; // we are in node js
