'use strict';


var Module = class {
	
	constructor() {
		this.name = 'mvc';
		
		this.global = null; // put by global on registration
		this.isready = false;
		this.isloading = false;
	}
	
	init() {
		console.log('module init called for ' + this.name);

		var global = this.global;
		
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
		var mvcmodule = global.getModuleObject('mvc');
		
		var modulescriptloader = global.getScriptLoader('mvcmoduleloader', parentscriptloader);

		var moduleroot = './angular-ui/js/src';

		modulescriptloader.push_script( moduleroot + '/control/controllers.js');
		modulescriptloader.push_script( moduleroot + '/view/views.js');
		modulescriptloader.push_script( moduleroot + '/model/models.js');

		// DAPPs
		modulescriptloader.load_scripts(function() { 
									self.init(); 
									mvcmodule.Models.loadModules(parentscriptloader, function() {
										// spawning potential asynchronous operations
										global.finalizeGlobalScopeInit(function(res) {
											console.log("mvc module finished initialization of GlobalScope");
											if (callback) callback(null, self);
										});
										
									}); 
								});
		
		return modulescriptloader;
	}
	
	isReady() {
		return this.isready;
	}

	hasLoadStarted() {
		return this.isloading;
	}

	// optional module functions
	registerHooks() {
		console.log('module registerHooks called for ' + this.name);
		
		var global = this.global;
		
		global.registerHook('creatingSession_hook', 'mvc', this.creatingSession_hook);
	}
	
	//
	// hooks
	//
	creatingSession_hook(result, params) {
		console.log('creatingSession_hook called for ' + this.name);
		
		var global = this.global;

		var session = params[0];

		// check url parameters
		var getUrlVars = function() {
		    var vars = {};
		    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		        vars[key] = value;
		    });
		    return vars;
		};
		
		var params = getUrlVars();
		
		if (params && params['sessionuuid']) {
			var sessionuuid = params['sessionuuid'];
			
			console.log('app bootstrapped with sessionuuid ' + sessionuuid);
			
			session.setSessionUUID(sessionuuid);
			
		}

		result.push({module: 'mvc', handled: true});
		
		return true;
	}
	
	
	// objects
	getControllersObject() {
		if (this.controllers)
			return this.controllers;
		
		var global = this.global;
		this.controllers = new this.Controllers(global);
		
		return this.controllers;
	}
	
	getViewsObject() {
		if (this.views)
			return this.views;
		
		var global = GlobalClass.getGlobalObject();

		var global = this.global;
		this.views = new this.Views(global);
		
		return this.views;
	}

}

GlobalClass.getGlobalObject().registerModuleObject(new Module());


//dependencies
//GlobalClass.getGlobalObject().registerModuleDepency('mvc', 'noticebook');