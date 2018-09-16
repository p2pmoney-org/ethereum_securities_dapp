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
		this.initializing = false;
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
			this.globalscope = this;
			
		}
	}
	
	pushFinalInitializationPromise(promise) {
		if (promise) {
			if (this.initialized)
				throw "global scope initialization has finished, it's no longer possible to push promises at this stage";
			
			this.initializationpromises.push(promise);
		}
	}
	
	_deferGlobalInit(loopnum, callback) {
		if (!loopnum)
			loopnum = 0;
		
		var self = this;
		
		if (!this.areModulesReady()) {
			loopnum++;
			//console.log("loop number " + loopnum);
			
			if (loopnum > 1000) {
				throw 'ERROR: modules took too long to get ready. Aborting initialization of global scope!!!';
			}
			
			setTimeout(function() {self._deferGlobalInit(loopnum, callback);},100);
		}
		else {
			this._doGlobalInit(callback);
		}
	}
	
	_doGlobalInit(callback) {
		// resolve initialization promises
		var self = this;
		
		
		Promise.all(this.initializationpromises).then(function(res) {
			console.log('Global.finalizeGlobalScopeInit ' + res.length + ' promises resolved');
			
			self.initialized = true;
			
			// calling postFinalizeGlobalScopeInit_hook
			var result = []; // description of the form entries
			
			var ret = self.invokeHooks('postFinalizeGlobalScopeInit_hook', result);
			
			if (callback)
				callback(true);
		});
	}

	
	finalizeGlobalScopeInit(callback) {
		console.log('Global.finalizeGlobalScopeInit called'); 
		
		if (this.initialized) {
			if (callback)
				callback(true);
			
			return;
		}
		
		if (this.initializing) {
			throw 'ERROR: calling twice finalizeGlobalScopeInit';
			
			return;
		}
		
		this.initializing = true;
		
		// ask registered modules to load now if they haven't started
		this.loadAllModules();

		// ask modules to register hooks now if they want to be called by preFinalizeGlobalScopeInit_hook
		this.registerModulesHooks();
		
		
		// calling preFinalizeGlobalScopeInit_hook (gives opportunity to add promises to this.initializationpromises
		var result = []; 
		
		var ret = this.invokeHooks('preFinalizeGlobalScopeInit_hook', result);

		this._deferGlobalInit(0, function() {
			console.log("Global object is now up and ready!");
			
			if (callback)
				callback(true);
		})
	}
	
	hasGlobalScopeInitializationStarted() {
		return this.initializing;
	}
	
	isGlobalScopeInitializing() {
		return ((this.initializing == true) && (this.initialized == false));
	}
	
	isGlobalScopeReady() {
		return this.initialized;
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
	
	findScriptLoader(loadername) {
		return this.globalscope.ScriptLoader.findScriptLoader(loadername);
	}
	
	//
	// modules
	//
	getModuleObject(modulename) {
		return (this.modules[modulename] ? this.modules[modulename] : null);
	}
	
	registerModuleObject(module) {
		console.log('Global.registerModuleObject called for ' + (module ? module.name : 'invalid'));
		
		if (!module)
			throw 'passed a null value to registerModuleObject';
		
		if (!module.name)
			throw 'module needs to have a name property';
		
		if (!module.loadModule)
			throw 'module ' + module.name + ' needs to have a loadModule function';

		if (!module.hasLoadStarted)
			throw 'module ' + module.name + ' needs to have a hasLoadStarted function';

		if (!module.isReady)
			throw 'module ' + module.name + ' needs to have a isReady function';

		this.modules[module.name] = module; // for direct access by name in getModuleObject
		this.modules.push(module); //for iteration on the array
		
		// we set global property
		module.global = this;
		
		// global object set in the module
		// call postRegisterModule if module has the function
		if (module.postRegisterModule)
			module.postRegisterModule();
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
				
				if ( module && (!module.isReady())) {
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
		
		if (!module)
			throw 'could not find module: ' + modulename;

		if (module.hasLoadStarted())
			throw 'trying to load module multiple times: ' + modulename;
		
		if (!this.canLoadModule(modulename)) {
			console.log('cannot yet load module ' + modulename);
			this.dummycount = (this.dummycount ? this.dummycount +1 : 1);
			var dummyscriptloader = this.getScriptLoader('dummy' + this.dummycount, parentscriptloader);
			
			this.deferModuleLoad(modulename, function() {
				console.log('finished waiting module load of dependencies for ' + modulename);
				
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
			
			if (!module.isReady()) {
				console.log('module is not ready: ' + module.name);
				return false;
			}
		}
		
		return true;
	}
	
	loadAllModules() {
		console.log('Global.loadAllModules called');
				
		var parentscriptloader = this.getScriptLoader('finalallmodulesloader');
		
		for (var i=0; i < this.modules.length; i++) {
			var module = this.modules[i];
			
			if (!module.hasLoadStarted()) {
				module.loadModule(parentscriptloader);
			}
		}
		
		parentscriptloader.load_scripts();
		
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
			
			if (module.registerHooks)
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
			
			entry['modulename'] = modulename;
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
			var modulename = entry['modulename'];
			var module = this.getModuleObject(modulename);
			
			if (module) {
				var ret = func.call(module, result, inputparams);
				
				if ((ret) && (ret === false))
					return ret
			}
			
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
		
		classprototype.getClass = function() {
			return classprototype;
		}
		
		classprototype.getClassName = function() {
			return classname;
		}
		
		classprototype.getGlobalObject = function() {
			return Global.getGlobalObject();
		}
	}
	
}

var GlobalClass = Global;

if ( typeof window !== 'undefined' && window ) // if we are in browser and not node js (e.g. truffle)
window.Global = Global;
else
module.exports = Global; // we are in node js