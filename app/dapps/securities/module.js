'use strict';

var Module = class {
	
	constructor() {
		this.name = 'securities-dapp';
		
		this.global = null; // put by global on registration
		this.isready = false;
		this.isloading = false;
		
		this.controllers = null; // one object, even if plural used
		
		this.plugins = {}; // map
		
		this.registerModel();
	}
	
	init() {
		console.log('module init called for ' + this.name);
		
		var global = this.global;
		var dappsmodule = global.getModuleObject('dapps');
		
		// create controllers
		var securitiescontrollers = new this.SecuritiesAngularControllers(global);
		dappsmodule.pushAngularController(securitiescontrollers);
		
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

		// securities ui
		var modulescriptloader = global.getScriptLoader('securitiesdapploader', parentscriptloader);
		
		var moduleroot = './dapps/securities';

		modulescriptloader.push_script( moduleroot + '/angular-ui/js/src/control/controllers.js');
		modulescriptloader.push_script( moduleroot + '/angular-ui/js/src/view/views.js');
		
		
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
		
		global.registerHook('postFinalizeGlobalScopeInit_hook', this.name, this.postFinalizeGlobalScopeInit_hook);
	}
	
	//
	// hooks
	//
	postFinalizeGlobalScopeInit_hook(result, params) {
		console.log('postFinalizeGlobalScopeInit_hook called for ' + this.name);
		
		var global = this.global;

		// old ui mvc module
		console.log('WARNING!!!! old ui is NO LONGER ENABLED in postFinalizeGlobalScopeInit_hook');
		/*var mvcscriptloader = global.findScriptLoader('mvcloader');
		var securitiesmvcscriptloader = mvcscriptloader.getChildLoader('securities-mvcloader');

		securitiesmvcscriptloader.push_script('./js-ui/src/module.js');

		//perform load
		securitiesmvcscriptloader.load_scripts(function() {
			var global = GlobalClass.getGlobalObject();	
			
			var allmodulesscriptloader = global.loadModule('securities-mvc', mvcscriptloader, function() {
				// and finally loading the app
				var appscriptloader = allmodulesscriptloader.getChildLoader('securities-apploader');
				
				appscriptloader.push_script('./js-ui/app.js');

				//perform load
				appscriptloader.load_scripts();
			});
		});*/
		
		result.push({module: this.name, handled: true});
		
		return true;
	}

	//
	// functions
	//
	
	registerModel() {
		var global = (this.global ? this.global : GlobalClass.getGlobalObject());
		
		if (global.isGlobalScopeInitializing())
			throw 'registerModel is called too late, after global scope intialization started.'
		
		console.log('registerModel called for ' + this.name);

		var dappsmodelsloader = global.findScriptLoader('dappsmodelsloader');

		var moduleroot = './dapps/securities';
		
		// securities module
		dappsmodelsloader.push_script( moduleroot + '/includes/module.js', function() {
			// load module if initialization has finished
			if (global.isReady())
			global.loadModule('securities', dappsmodelsloader);
		 });
		
	}
	
	// functions
}

GlobalClass.getGlobalObject().registerModuleObject(new Module());

// dependencies
GlobalClass.getGlobalObject().registerModuleDepency('securities-dapp', 'dapps');
