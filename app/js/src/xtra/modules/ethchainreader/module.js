'use strict';

var Module = class {
	
	constructor() {
		this.name = 'ethchainreader';
		
		this.global = null; // put by global on registration
		this.isready = false;
		this.isloading = false;
		
		// operating
		//this.web3instance = null;
		
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

		// ethchainreader
		var modulescriptloader = global.getScriptLoader('ethchainreaderloader', parentscriptloader);
		
		var moduleroot = './js/src/xtra/modules/ethchainreader';

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
	/*getWeb3Class() {
		if ( typeof window !== 'undefined' && window ) {
			return Web3;
		}
		else {
			return require('web3');
		}
	}*/
	
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
	getEthereumNodeAccess(session) {
		var global = this.global;
		
		var SessionClass = (typeof Session !== 'undefined' ? Session : global.getModuleObject('common').Session);
		if (session instanceof SessionClass !== true)
			throw 'must pass a session object as first parameter!';
		
		var global = session.getGlobalObject();
		
		var ethereumnodeaccessmodule = global.getModuleObject('ethereum-node-access');
		
		return ethereumnodeaccessmodule.getEthereumNodeAccessInstance(session);
	}
	
	getChainReaderInterface(session) {
		var global = this.global;
		
		var SessionClass = (typeof Session !== 'undefined' ? Session : global.getModuleObject('common').Session);
		if (session instanceof SessionClass !== true)
			throw 'must pass a session object as first parameter!';
		
		var global = session.getGlobalObject();
		
		var chainreaderinterface = null;

		var result = []; 
		var inputparams = [];
		
		inputparams.push(this);
		
		var ret = global.invokeHooks('getChainReaderInterface_hook', result, inputparams);
		
		if (ret && result[0]) {
			chainreaderinterface = result[0];
		}
		else {
			chainreaderinterface = new this.ChainReaderInterface(session, this);
		}
		
		return chainreaderinterface;
	}
	
	getEthereumNodeObject(session) {
		var global = this.global;
		
		var SessionClass = (typeof Session !== 'undefined' ? Session : global.getModuleObject('common').Session);
		if (session instanceof SessionClass !== true)
			throw 'must pass a session object as first parameter!';
		
		var global = session.getGlobalObject();
		
		var ethereumnodeobject = null;

		var result = []; 
		var inputparams = [];
		
		inputparams.push(this);
		inputparams.push(session);
		
		var ret = global.invokeHooks('getEthereumNodeObject_hook', result, inputparams);
		
		if (ret && result[0]) {
			ethereumnodeobject = result[0];
		}
		else {
			ethereumnodeobject = new this.EthereumNode(session, this);
		}
		
		return ethereumnodeobject;
	}

	
	
}

if ( typeof GlobalClass !== 'undefined' && GlobalClass ) {
	GlobalClass.getGlobalObject().registerModuleObject(new Module());
	
	// dependencies
	GlobalClass.getGlobalObject().registerModuleDepency('ethchainreader', 'common');
}
else if (typeof window !== 'undefined') {
	let _GlobalClass = ( window && window.simplestore && window.simplestore.Global ? window.simplestore.Global : null);
	
	_GlobalClass.getGlobalObject().registerModuleObject(new Module());
	
	// dependencies
	_GlobalClass.getGlobalObject().registerModuleDepency('ethchainreader', 'common');
}
else if (typeof global !== 'undefined') {
	// we are in node js
	let _GlobalClass = ( global && global.simplestore && global.simplestore.Global ? global.simplestore.Global : null);
	
	_GlobalClass.getGlobalObject().registerModuleObject(new Module());
	
	// dependencies
	_GlobalClass.getGlobalObject().registerModuleDepency('ethchainreader', 'common');
}


