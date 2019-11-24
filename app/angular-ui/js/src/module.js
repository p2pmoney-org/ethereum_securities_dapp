'use strict';


var Module = class {
	
	constructor() {
		this.name = 'mvc';
		this.current_version = "0.12.2.2019.11.12";
		
		this.global = null; // put by global on registration
		this.app = null;

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
		var mvcmodule = global.getModuleObject('mvc');
		

		// mvc files
		var modulescriptloader = parentscriptloader.getChildLoader('mvcmoduleloader');
		
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
		
		// initialization
		global.registerHook('postFinalizeGlobalScopeInit_hook', 'mvc', this.postFinalizeGlobalScopeInit_hook);

		// session
		global.registerHook('creatingSession_hook', 'mvc', this.creatingSession_hook);
	}
	
	//
	// hooks
	//
	
	postFinalizeGlobalScopeInit_hook(result, params) {
		console.log('postFinalizeGlobalScopeInit_hook called for ' + this.name);
		
		var global = this.global;
		
		// angular libs
		var ScriptLoader = window.simplestore.ScriptLoader;
		var rootscriptloader = ScriptLoader.getRootScriptLoader();
		var modulescriptloader = ScriptLoader.findScriptLoader('mvcmoduleloader');
		var angularscriptloader = modulescriptloader.getChildLoader('angularloader');
		
		/*angularscriptloader.push_script('./angular-ui/lib/angular-1.6.9.js');
		//angularscriptloader.push_script('./angular-ui/lib/angular-1.7.0.js');

		angularscriptloader.push_script('./angular-ui/lib/ui-bootstrap-tpls-2.5.0.js');
		angularscriptloader.push_script('./angular-ui/lib/angular-ui-router-1.0.18.js');

		angularscriptloader.push_script('./angular-ui/lib/angular-breadcrumb-0.5.0.js');*/
		
		console.log('loading angular libraries');
		var angularlibs = [];
		
		angularlibs.push({modulename: 'angular', version: '1.6.9', script: './angular-ui/lib/angular-1.6.9.js'});
		//angularlibs.push({modulename: 'angular', version: '1.7.0', script: './angular-ui/lib/angular-1.7.0.js'});
		angularlibs.push({modulename: 'ui.bootstrap', version: '2.5.0', script: './angular-ui/lib/ui-bootstrap-2.5.0.js'});
		angularlibs.push({modulename: 'ui.router', version: '1.0.18', script: './angular-ui/lib/angular-ui-router-1.0.18.js'});
		angularlibs.push({modulename: 'ncy-angular-breadcrumb', version: '0.5.0', script: './angular-ui/lib/angular-breadcrumb-0.5.0.js'});
		
		// invoke hook if a module wants to alter angular libraries
		var result = [];
		
		var params = [];
		
		params.push(angularlibs);

		var ret = global.invokeHooks('alterAngularLibraries_hook', result, params);
		
		if (ret && result && result.length) {
			console.log('alterAngularLibraries_hook overload handled by a module');			
		}
		
		
		for (var i = 0; i < angularlibs.length; i++) {
			if ((angularlibs[i].disabled) && (angularlibs[i].disabled === true)) // simple way to prevent load
				continue;
			
			angularscriptloader.push_script(angularlibs[i].script);
		}

		//perform load
		angularscriptloader.load_scripts(function() {
			// signal end of angular app
			rootscriptloader.signalEvent('on_angular_ui_load_end');
		});

	}
	
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
	getAppObject() {
		return this.app;
	}
	
	setAppObject(app) {
		this.app = app;
	}
	
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
	
	// functions
	getMvcInfo() {
		var info = [];
		
		info['framework'] = 'angularjs-1.x';
		
		return info;
	}

}

GlobalClass.getGlobalObject().registerModuleObject(new Module());


//dependencies
GlobalClass.getGlobalObject().registerModuleDepency('mvc', 'common');