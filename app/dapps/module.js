'use strict';

var Module = class {
	
	constructor() {
		this.name = 'dapps';
		
		this.global = null; // put by global on registration
		this.isready = false;
		this.isloading = false;
		
		// operating
		this.angularcontrollers = [];
		
		this.registerDappsModules();
	}
	
	init() {
		console.log('module init called for ' + this.name);
		
		var global = this.global;
		
		this.isready = true;
	}
	
	loadModule(parentscriptloader, callback) {
		console.log('loadModule called for module ' + this.name);

		if (this.isready) {
			if (callback)
				callback(null, this);
			
			return;
		}

		if (this.isloading) {
			var error = 'calling loadModule while still loading for module ' + this.name;
			console.log('error: ' + error);
			
			if (callback)
				callback(error, null);
			
			return;
		}
			
		this.isloading = true;

		var self = this;
		var global = this.global;

		// loading dapps
		var modulescriptloader = global.getScriptLoader('dappsloader', parentscriptloader);
		
		var moduleroot = './dapps';

		// no file loaded

		
		modulescriptloader.load_scripts(function() { self.init(); if (callback) callback(null, self); });
		
		return modulescriptloader;
	}
	
	registerDappsModules() {
		var global = (this.global ? this.global : GlobalClass.getGlobalObject());
		
		console.log('registerDappsModules called for ' + this.name);
		
		var dappsscriptloader = global.findScriptLoader('dappmodulesloader');
		var dappsmodelsloader = modulescriptloader.getChildLoader('dappsmodelsloader');

		var moduleroot = './dapps';

		//securities dapp
		dappsscriptloader.push_script( moduleroot + '/securities/module.js', function() {
			// load module if initialization has finished
			if (global.isReady())
			global.loadModule('securities-dapp', modulescriptloader);
			
			// then load models
			dappsmodelsloader.load_scripts();
		 });
		
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
		
		global.registerHook('alterMenuBar_hook', 'dapps', this.alterMenuBar_hook);
	}
	
	//
	// hooks
	//
	alterMenuBar_hook(result, params) {
		console.log('alterMenuBar_hook called for ' + this.name);
		
		var global = this.global;
		
		var menuitems = params[1];
		
		var menuitem = [];
		var child;
		
		menuitems.push(menuitem);
		
		menuitem.label = global.t('Stock Ledgers');
		
		menuitem.children = [];
		
		// private list
		child = {};
		
		child.label = global.t('My list');
		child.state = 'home.stockledgers';
		
		menuitem.children.push(child);
		
		// create
		child = {};
		
		child.label = global.t('Create');
		child.state = 'home.stockledgers.create';
		
		menuitem.children.push(child);
		
		// import
		child = {};
		
		child.label = global.t('Import');
		child.state = 'home.stockledgers.import';
		
		menuitem.children.push(child);
		
		
		result.push({module: 'dapps', handled: true});
		
		return true;
	}
	
	// functions
	getAngularControllers() {
		return this.angularcontrollers;	
	}
	
	pushAngularController(angularcontroller) {
		this.angularcontrollers.push(angularcontroller);
	}
	

}

GlobalClass.getGlobalObject().registerModuleObject(new Module());

// dependencies
GlobalClass.getGlobalObject().registerModuleDepency('dapps', 'common');