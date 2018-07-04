'use strict';

var Module = class {
	
	constructor() {
		this.name = 'securities';
		
		this.global = null; // put by global on registration
		this.isready = false;
		
		this.controllers = null;
		this.views = null;
		
		this.session = null;
	}
	
	init() {
		console.log('securities module init called');
		
		var commonmodule = this.global.getModuleObject('common');
		
		var contracts = commonmodule.getContractsObject();
		
		// register StockLedger in the contracts global object
		contracts.registerContractClass('StockLedger', this.StockLedger);
		
		// force refresh of list
		commonmodule.getContractsObject(true);
		
		this.isready = true;
	}
	
	loadModule(parentscriptloader, callback) {
		console.log('securities module loadModule called');

		var self = this;
		var global = this.global;

		// securities
		var modulescriptloader = global.getScriptLoader('securitiesmoduleloader', parentscriptloader);
		
		modulescriptloader.push_script('./js/src/includes/securities/control/controllers.js');

		modulescriptloader.push_script('./js/src/includes/securities/view/views.js');

		modulescriptloader.push_script('./js/src/includes/securities/model/securities.js');
		modulescriptloader.push_script('./js/src/includes/securities/model/stakeholder.js');

		modulescriptloader.push_script('./js/src/includes/securities/model/stockledger/stockledger.js');
		modulescriptloader.push_script('./js/src/includes/securities/model/stockledger/stockholder.js');
		modulescriptloader.push_script('./js/src/includes/securities/model/stockledger/stockissuance.js');
		modulescriptloader.push_script('./js/src/includes/securities/model/stockledger/stocktransaction.js');
		modulescriptloader.push_script('./js/src/includes/securities/model/stockledger/interface/stockledger-contractinterface.js');
		modulescriptloader.push_script('./js/src/includes/securities/model/stockledger/interface/stockledger-localpersistor.js');
		
		modulescriptloader.load_scripts(function() { self.init(); if (callback) callback(null, self); });
		
		return modulescriptloader;
	}
	
	isReady() {
		return this.isready;
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
	
	
}

GlobalClass.getGlobalObject().registerModuleObject(new Module());

// dependencies
GlobalClass.getGlobalObject().registerModuleDepency('securities', 'common');