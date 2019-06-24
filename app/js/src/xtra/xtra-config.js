// additional js variables for overload on standard dapp
/**
 * 
 */
'use strict';

class XtraConfigModule {
	constructor() {
		this.name = 'xtraconfig';
		
		this.global = null; // put by global on registration
		this.isready = false;
		this.isloading = false;
		
		this.registerAdditionalModules();
	}
	
	registerAdditionalModules() {
		console.log('registerAdditionalModules called for ' + this.name);
		
		var self = this;
		
		// load and register additional modules
		var modulescriptloader = ScriptLoader.findScriptLoader('moduleloader')
		var xtramodulescriptloader = modulescriptloader.getChildLoader('xtramoduleloader')
		
		// get list of additional modules from Config
		if (Config && Config.get) {
			var moduleroot = './js/src/xtra/modules/';
			
			// get list of xtra modules
			var modulearray = [];
			
			var xtramodulearray = Config.get('xtramoduleload');
			
			if (Array.isArray(xtramodulearray) === false) {
				if (xtramodulearray) {
					modulearray.push(xtramodulearray);
				}
			}
			else {
				modulearray.push(...xtramodulearray);
			}


			// actual load xtra modules
			
			for (var i = 0; i < modulearray.length; i++) {
				var moduleentry = modulearray[i];
				
				var __push_script = function (modulename) {
					xtramodulescriptloader.push_script( moduleentry['path'], function() {
						// load module if initialization has finished
						if (self.global && (self.global.isReady()))
						global.loadModule(modulename, dappsmodelsloader);
					 });
				};
				
				
				// we need a closure to stack the module's name
				__push_script(moduleentry['name']);
			}

			xtramodulescriptloader.load_scripts();
		}
		
	}
	
	init() {
		console.log('module init called for ' + this.name);
		
		this.isready = true;
	}
	
	// compulsory  module functions
	loadModule(parentscriptloader, callback) {
		console.log('loadModule called for module ' + this.name);
		
		if (this.isloading)
			return;
			
		this.isloading = true;

		var self = this;

		var modulescriptloader = parentscriptloader.getChildLoader('xtraconfigmoduleloader');

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
}

class XtraConfig {
	
	constructor() {
		// add xtra values that could be accessed
		// via Config.getXtraValue(key)
	}
	

}

//export

if ( typeof window !== 'undefined' && window ) // if we are in browser and not node js (e.g. truffle)
window.Config.XtraConfig = XtraConfig;

GlobalClass.getGlobalObject().registerModuleObject(new XtraConfigModule());
