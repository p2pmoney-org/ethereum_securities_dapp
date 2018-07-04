'use strict';

var GlobalObject;


class Global {
	constructor() {
		
		// global variables
		this.variables = Object.create(null);
		
		// modules
		this.modules = [];
		
		this.moduledependencies = [];
		
		// hooks
		this.hook_arrays = [];

		// context
		this.globalscope = null;
		this.initialized = false;
		this.initializationpromises = [];
		
		this.initGlobalScope();
	}
	
	initGlobalScope() {
		if ( typeof window !== 'undefined' && window ) {
			// if we are in browser and not node js
			this.globalscope = window;
			
		}
		else {
			// node js (e.g. truffle migrate)
			this.globalscope = global;
			
		}
	}
	
	pushFinalInitializationPromise(promise) {
		if (promise)
			this.initializationpromises.push(promise);
	}
	
	finalizeGlobalScopeInit(callback) {
		console.log('Global.finalizeGlobalScopeInit called');
		
		if (this.initialized) {
			if (callback)
				callback(true);
			
			return;
		}
		
		// ask modules to register hooks now if they want to be called by preFinalizeGlobalScopeInit_hook
		this.registerModulesHooks();
		
		
		// calling preFinalizeGlobalScopeInit_hook (gives opportunity to add promises to this.initializationpromises
		var result = []; 
		
		var ret = this.invokeHooks('preFinalizeGlobalScopeInit_hook', result);

		// resolve initialization promises
		var self = this;
		
		
		Promise.all(this.initializationpromises).then(function() {
			console.log("Global.finalizeGlobalScopeInit resolved");
			
			self.initialized = true;
			
			// calling postFinalizeGlobalScopeInit_hook
			var result = []; // description of the form entries
			
			var ret = self.invokeHooks('postFinalizeGlobalScopeInit_hook', result);
			
			if (callback)
				callback(true);
		});
		
	}
	
	//
	// config setting
	//
	getConfigValue(name) {
		return this.globalscope.Config[name];
	}
	
	getXtraConfigValue(name) {
		return this.globalscope.Config.getXtraValue(name);
	}
	
	
	//
	// variables
	//
	getVariable(name) {
		return this.variables[name];
	}
	
	putVariable(name, value) {
		this.variables[name] = value;
	}
	
	//
	// scripts
	//
	getScriptLoader(loadername, parentscriptloader) {
		return this.globalscope.ScriptLoader.getScriptLoader(loadername, parentscriptloader);
	}
	
	//
	// modules
	//
	getModuleObject(modulename) {
		return (this.modules[modulename] ? this.modules[modulename] : null);
	}
	
	registerModuleObject(module) {
		console.log('Global.registerModuleObject called for ' + (module ? module.name : 'invalid'));

		this.modules[module.name] = module; // for direct access by name in getModuleObject
		this.modules.push(module); //for iteration on the array
		
		// we set global property
		module.global = this;
	}
	
	registerModuleDepency(modulename, dependingfrom) {
		var entry = [];
		
		entry['module'] = modulename;
		entry['dependency'] = dependingfrom;
		this.moduledependencies.push(entry);
	}
	
	hasModuleDependencies(modulename) {
		for (var i = 0; i < this.moduledependencies.length; i++) {
			var entry = this.moduledependencies[i];
			
			if (entry['module'] == modulename)
				return true;
		}
		
		return false;
	}
	
	canLoadModule(modulename) {
		if (!this.hasModuleDependencies(modulename))
			return true;
		
		for (var i = 0; i < this.moduledependencies.length; i++) {
			var entry = this.moduledependencies[i];
			
			if (entry['module'] == modulename) {
				var depency = entry['dependency']
				var module = this.getModuleObject(depency);
				
				if (!module.isReady()) {
					return false;
				}
			}
		}
		
		return true;
	}

	deferModuleLoad(modulename, callback, loopnum) {
		console.log('defering module load of ' + modulename);
		
		if (!loopnum)
			loopnum = 0;
		
		var self = this;

		if (!this.canLoadModule(modulename)) {
			loopnum++;
			console.log("loop number " + loopnum);
			
			if (loopnum > 100) {
				console.log('breaking the wait in deferModuleLoad of ' + modulename);
				
				if (callback)
					callback();
				
				return;
			}

			setTimeout(function() {self.deferModuleLoad(modulename, callback, loopnum);},100);
		}
		else {
			console.log('finished defering module load of ' + modulename);
			
			if (callback)
			callback();
		}
		
	}
	
	loadModule(modulename, parentscriptloader, callback) {
		console.log('Global.loadModule called of ' + modulename);
		
		var module = this.getModuleObject(modulename);
		
		if (!this.canLoadModule(modulename)) {
			console.log('cannot yet load module ' + modulename);
			var dummyscriptloader = this.getScriptLoader('dummy', parentscriptloader);
			
			this.deferModuleLoad(modulename, function() {
				console.log('finished waiting module load of dpendencies for ' + modulename);
				
				var modulescriptloader = module.loadModule(parentscriptloader, function (err, res) {
					console.log('finished loading after defering module ' + res.name);
					
					if (dummyscriptloader) 
						dummyscriptloader.loadfinished = true;
					
					if (callback)
						callback(null, module);
				});

			});
			
			return dummyscriptloader;
		}
		else {
			var modulescriptloader = module.loadModule(parentscriptloader, function (err, res) {
				console.log('finished loading module ' + res.name);
				
				if (callback)
					callback(null, module);
			});
			
			return modulescriptloader;
		}
		
	}
	
	areModulesReady() {
		for (var i=0; i < this.modules.length; i++) {
			var module = this.modules[i];
			
			if (!module.isReady())
				return false;
		}
		
		return true;
	}
	
	//
	// hooks mechanism
	//
	registerModulesHooks() {
		console.log('Global.registerModulesHooks called');
		
		// call registerHooks function for all modules if functions exists
		for (var i=0; i < this.modules.length; i++) {
			var module = this.modules[i];
			
			if ( (module.isReady()) && (module.registerHooks))
				module.registerHooks();
		}
	}
	
	getHookArray(hookentry) {
		var entry = hookentry.toString();
		
		if (!this.hook_arrays[hookentry])
			this.hook_arrays[hookentry] = [];
			
		return this.hook_arrays[hookentry];
	}
	
	registerHook(hookentry, modulename, hookfunction) {
		var hookarray = this.getHookArray(hookentry);
		
		if (typeof hookfunction === "function") {
			var hookfunctionname = hookfunction.toString();
			var entry = [];
			
			entry['modulename'] = modulename.toString().toLowerCase();
			entry['functionname'] = hookfunctionname;
			entry['function'] = hookfunction;
			
			console.log('registering hook '+ hookentry + ' for ' + modulename);
			hookarray.push(entry);
		}
	}
	
	invokeHooks(hookentry, result, inputparams) {
		console.log('Global.invokeHooks called for ' + hookentry);

		var hookarray = this.getHookArray(hookentry);

		for (var i=0; i < hookarray.length; i++) {
			var entry = hookarray[i];
			var func = entry['function'];
			
			var ret = func(result, inputparams);
			
			if ((ret) && (ret === false))
				return ret
		}
		
		return true;
	}
	
	
	// i18n
	t(string) {
		return string;
	}
	
	// static functions
	static getGlobalObject() {
		if (GlobalObject)
			return GlobalObject;
		
		GlobalObject = new Global();
		
		return GlobalObject;
	}
	
	static registerModuleClass(modulename, classname, classprototype) {
		Global.getGlobalObject().getModuleObject(modulename)[classname] = classprototype;
	}
	
}

var GlobalClass = Global;

if ( typeof window !== 'undefined' && window ) // if we are in browser and not node js (e.g. truffle)
window.Global = Global;
else
module.exports = Global; // we are in node js