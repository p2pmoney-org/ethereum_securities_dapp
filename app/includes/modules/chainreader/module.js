'use strict';

var Module = class {
	
	constructor() {
		this.name = 'chainreader';
		
		this.global = null; // put by global on registration
		this.isready = false;
		this.isloading = false;
		
		// operating
		this.web3instance = null;
		
		this.controllers = null;
	}
	
	init() {
		console.log('module init called for ' + this.name);
		
		this.isready = true;
	}
	
	loadModule(parentscriptloader, callback) {
		console.log('loadModule called for module ' + this.name);

		if (this.isloading)
			return;
			
		this.isloading = true;

		var self = this;
		var global = this.global;

		// chainreader
		var modulescriptloader = global.getScriptLoader('chainreaderloader', parentscriptloader);
		
		var moduleroot = './includes/modules/chainreader';

		modulescriptloader.push_script( moduleroot + '/chainreader-interface.js');

		modulescriptloader.push_script( moduleroot + '/control/controllers.js');

		modulescriptloader.push_script( moduleroot + '/model/ethnode.js');
		modulescriptloader.push_script( moduleroot + '/model/account.js');
		modulescriptloader.push_script( moduleroot + '/model/block.js');
		modulescriptloader.push_script( moduleroot + '/model/contract.js');
		modulescriptloader.push_script( moduleroot + '/model/transaction.js');
		
		modulescriptloader.load_scripts(function() { self.init(); if (callback) callback(null, self); });
		
		return modulescriptloader;
	}
	
	isReady() {
		return this.isready;
	}

	hasLoadStarted() {
		return this.isloading;
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
	// model
	//
	
	// classes
	getWeb3Class() {
		if ( typeof window !== 'undefined' && window ) {
			return Web3;
		}
		else {
			return require('web3');
		}
	}
	
	getAccountClass() {
		return this.Account;
	}
	
	getContractClass() {
		return this.Contract;
	}
	
	getBlockClass() {
		return this.Block;
	}
	
	getTransactionClass() {
		return this.Transaction;
	}
	
	
	// objects
	/*getWeb3Provider() {
		var commonmodule = this.global.getModuleObject('common');
		
		var Web3 = this.getWeb3Class();

		var web3providerurl = commonmodule.getWeb3ProviderUrl();
		var web3Provider = new Web3.providers.HttpProvider(web3providerurl);

		return web3Provider;
	}
	
	getWeb3Instance() {
		if (this.web3instance)
			return this.web3instance;
		
		var Web3 = this.getWeb3Class();
		var web3Provider = this.getWeb3Provider();
		  
		this.web3instance = new Web3(web3Provider);		
		
		console.log("web3 instance created for chainreader");
		
		return this.web3instance;
	}*/
	
	getSessionObject() {
		var commonmodule = this.global.getModuleObject('common');

		return commonmodule.getSessionObject();
	}
	
	getEthereumNodeAccess() {
		var session = this.getSessionObject();
		
		if (session)
			return session.getEthereumNodeAccessInstance();
	}
	
	getChainReaderInterface() {
		var global = this.global;
		
		var chainreaderinterface = null;

		var result = []; 
		var inputparams = [];
		
		inputparams.push(this);
		
		var ret = global.invokeHooks('getChainReaderInterface_hook', result, inputparams);
		
		if (ret && result[0]) {
			chainreaderinterface = result[0];
		}
		else {
			chainreaderinterface = new this.ChainReaderInterface(this);
		}
		
		return chainreaderinterface;
	}
	
	getEthereumNodeObject() {
		var global = this.global;
		
		var ethereumnodeobject = null;

		var result = []; 
		var inputparams = [];
		
		inputparams.push(this);
		
		var ret = global.invokeHooks('getEthereumNodeObject_hook', result, inputparams);
		
		if (ret && result[0]) {
			ethereumnodeobject = result[0];
		}
		else {
			ethereumnodeobject = new this.EthereumNode(this);
		}
		
		return ethereumnodeobject;
	}

	
	
}

GlobalClass.getGlobalObject().registerModuleObject(new Module());

// dependencies
GlobalClass.getGlobalObject().registerModuleDepency('chainreader', 'common');