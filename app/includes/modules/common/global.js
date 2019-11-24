'use strict';

var GlobalObject;


class Global {
	constructor() {
		
		console.log('Global constructor called');
		
		GlobalObject = this;
		
		// execution context
		this.execution_env = 'prod';
		
		this.innodejs = false;
		this.inreactnative= false;
		this.inbrowser = true;
		
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
		
		this.allmodulesloadstarted = false;
		
		this.initGlobalScope();
	}
	
	getExecutionEnvironment() {
		return this.execution_env;
	}
	
	setExecutionEnvironment(val) {
		console.log('changing execution environment to ' + val);
		
		var bootstrap = this.getBootstrapObject();
		
		switch (val) {
			case 'dev':
				bootstrap.setExecutionEnvironment('dev');

				this.execution_env = 'dev';
				this.overrideConsoleLog();
				break;
			default:
				bootstrap.setExecutionEnvironment('prod');
				this.execution_env = 'prod';
				break;
		};
	}
	
	getJavascriptEnvironment() {
		return this.getBootstrapObject().getJavascriptEnvironment();
	}
	
	getBootstrapObject() {
		var Bootstrap = this.globalscope.simplestore.Bootstrap;
		return Bootstrap.getBootstrapObject();
	}
	
	getRootScriptLoader() {
		return this.globalscope.simplestore.ScriptLoader.getRootScriptLoader();
	}
	
	isInNodejs() {
		return this.innodejs;
	}
	
	setIsInNodejs(choice) {
		this.innodejs = choice;
	}
	
	isInReactNative() {
		return this.inreactnative;
	}
	
	setInReactNative(choice) {
		this.inreactnative = choice;
	}
	
	isInBrowser() {
		return this.inbrowser;
	}
	
	setIsInBrowser(choice) {
		this.inbrowser = choice;
	}
	
	getExecutionGlobalScope() {
		return this.globalscope;
	}
	
	// initialization sequence
	isReady() {
		return this.initialized;
	}
	
	initGlobalScope() {
		if ( typeof window !== 'undefined' && window ) {
			// if we are in browser (or react-native) and not node js
			this.globalscope = window;
			
		}
		else if (typeof global !== 'undefined') {
			// node js (e.g. truffle migrate)
			this.globalscope = global;
			
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
		// set internal javascript env flags
		var javascriptenv = this.getJavascriptEnvironment();
		
		if (javascriptenv == 'react-native') {
			this.innodejs = false;
			this.inreactnative= true;
			this.inbrowser = false;
		}
		else if (javascriptenv == 'nodejs') {
			this.innodejs = true;
			this.inreactnative= false;
			this.inbrowser = false;
		}
		
		// xtra_execution_env
		var xtra_execution_env = this.getXtraConfigValue('client_env');
		
		var rootscriptloader = this.getRootScriptLoader();
		
		console.log('xtra_execution_env is ' + xtra_execution_env);
		
		if (xtra_execution_env == 'dev')
			this.setExecutionEnvironment('dev');

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
		
		// signal start of global initialization
		rootscriptloader.signalEvent('on_global_object_initializing');

		// ask registered modules to load now if they haven't started
		this.loadAllModules();

		// ask modules to register hooks now if they want to be called by preFinalizeGlobalScopeInit_hook
		this.registerModulesHooks();
		
		
		// calling preFinalizeGlobalScopeInit_hook (gives opportunity to add promises to this.initializationpromises
		var result = []; 
		
		var ret = this.invokeHooks('preFinalizeGlobalScopeInit_hook', result);

		this._deferGlobalInit(0, function() {
			console.log("Global object is now up and ready!");
			
			// signal end of global initialization
			rootscriptloader.signalEvent('on_global_object_ready');

			
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
		return this.globalscope.simplestore.Config[name];
	}
	
	getXtraConfigValue(name) {
		return this.globalscope.simplestore.Config.getXtraValue(name);
	}
	
	// version info
	getVersionInfo() {
		var versioninfos = [];

		var result = [];
		
		var params = [];
		
		params.push(versioninfos);

		var ret = this.invokeHooks('getVersionInfo_hook', result, params);

		if (ret && result && result.length) {
			console.log('getVersionInfo_hook overload handled by a module');			
		}
		
		return versioninfos;
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
		return this.globalscope.simplestore.ScriptLoader.getScriptLoader(loadername, parentscriptloader);
	}
	
	findScriptLoader(loadername) {
		return this.globalscope.simplestore.ScriptLoader.findScriptLoader(loadername);
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
		
		if (this.modules[module.name]) {
			console.log('WARNING: collision on module name ' + module.name + ', older module will no longer be accessible by its name!');
			
			// park previous module with trailing digit
			var n = 1;
			var newname = module.name + '-' + n;
			
			while (this.modules[newname]) {
				n++;
				newname = loadername + '-' + n;
			}
			
			this.modules[newname] = this.modules[module.name];
		}

		this.modules[module.name] = module; // for direct access by name in getModuleObject
		this.modules.push(module); //for iteration on the array
		
		// we set global property
		module.global = this;
		
		if ((this.allmodulesloadstarted) && (module.isloading === false)) {
			console.log('WARNING: module ' + module.name + ' registered too late, will not be loaded by global object!');
		}
		// global object set in the module
		// call postRegisterModule if module has the function
		if (module.postRegisterModule) {
			console.log('WARNING: module ' + module.name + ' has a postRegisterModule method, gives it opportunity to do the load if needed');
			module.postRegisterModule();
		}
		else {
			console.log('WARNING: module ' + module.name + ' may need to implement a postRegisterModule method to do the load');
		}
		
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
		
		this.allmodulesloadstarted = true;
		
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
			var bAddEntry = true;
			
			if (typeof this._findModuleHookEntry(hookentry, modulename)  !== 'undefined') {
				// overload existing entry
				console.log('overloading hook '+ hookentry + ' for ' + modulename);

				entry = this._findModuleHookEntry(hookentry, modulename);
				bAddEntry = false;
			}
			
			entry['modulename'] = modulename;
			entry['functionname'] = hookfunctionname;
			entry['function'] = hookfunction;
			entry['priority'] = 0; // default
			
			if (bAddEntry) {
				console.log('registering hook '+ hookentry + ' for ' + modulename);
				
				hookarray.push(entry);
				
				// sort array
				this._sortHookEntryArray(hookentry)
			}
			
		}
	}
	
	_findModuleHookEntry(hookentry, modulename) {
		var hookarray = this.getHookArray(hookentry);
		
		if (!hookarray)
			return;
		
		for (var i=0; i < hookarray.length; i++) {
			var entry = hookarray[i];
			var __modulename = entry['modulename'];
			
			if (__modulename == modulename)
				return entry;
		}		
	}
	
	_sortHookEntryArray(hookentry) {
		var hookarray = this.getHookArray(hookentry);
		
		if (!hookarray)
			return;
		
		// sort descending order
		hookarray.sort(function(entrya,entryb) {return (entryb['priority'] - entrya['priority']);});
		
	}
	
	modifyHookPriority(hookentry, modulename, priority) {
		
		if (!Number.isInteger(priority))
			return;
		
		var entry = this._findModuleHookEntry(hookentry, modulename);
		
		if (entry) {
			entry['priority'] = priority;
			
			// sort array
			this._sortHookEntryArray(hookentry)
		}
		
	}
	
	invokeHooks(hookentry, result, inputparams) {
		console.log('Global.invokeHooks called for ' + hookentry);
		
		if ((!this.isReady()) 
				&& (hookentry != 'preFinalizeGlobalScopeInit_hook'))
			throw 'Global object is not ready. No invoke of hooks can be done at this time: ' + hookentry;
		
		if ((!result) || (Array.isArray(result) === false))
			throw 'invokeHooks did not receive an array as result parameter for hookentry: ' + hookentry;

		var hookarray = this.getHookArray(hookentry);
		var ret_array = {};

		for (var i=0; i < hookarray.length; i++) {
			var entry = hookarray[i];
			var func = entry['function'];
			var modulename = entry['modulename'];
			var module = this.getModuleObject(modulename);
			
			if (module) {
				var ret = func.call(module, result, inputparams);
				
				ret_array[modulename] = ret;
				
				if (result[result.length-1] && (result[result.length-1].module == modulename) && (result[result.length-1].stop === true))
					break;
			}
			
		}
		
		return true;
	}
	
	
	// i18n
	t(string) {
		return string;
	}
	
	// log functions
	overrideConsoleLog() {
		console.log('overridding console log');
		
		if (this.overrideconsolelog == true)
			return;
		
		console.log('global.execution_env is ' + this.execution_env);
		
		if (this.execution_env == 'dev') {
			this.overrideconsolelog = true;
			
			// capture bootstrap log function
			var bootstrap = this.getBootstrapObject();
			this.orgconsolelog = bootstrap.log;
			
			var self = this;
			
			console.log = function() {
				self.log.apply(self, arguments);
			}; 
			
		}
		
	}
	
	releaseConsoleLog() {
		this.overrideconsolelog = false;
		
		console.log = this.orgconsolelog ; 
	}
	
	_timeString() {
		var now = new Date();
		var hours = now.getHours();
		var minutes = now.getMinutes();
		var seconds = now.getSeconds();
		var milliseconds = now.getMilliseconds();
		
		var hours = (now.getHours().toString().length == 2 ? now.getHours().toString() : "0" + now.getHours().toString());
		var minutes = (now.getMinutes().toString().length == 2 ? now.getMinutes().toString() : "0" + now.getMinutes().toString());
		var seconds = (now.getSeconds().toString().length == 2 ? now.getSeconds().toString() : "0" + now.getSeconds().toString());
		var milliseconds = (now.getMilliseconds().toString().length == 3 ? now.getMilliseconds().toString() : "0" + (now.getMilliseconds().toString().length == 2 ? now.getMilliseconds().toString() : "0" + now.getMilliseconds().toString()));
		
		return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
	}
	
	log(string) {
		if (this.execution_env != 'dev')
			return; // logging to console disabled
		
		if (this.overrideconsolelog == true) {
			var line = this._timeString() + ": ";
			
			line += string;
			
			this.orgconsolelog(line); // we've overloaded console.log
		}
		else {
			console.log(sring);
		}
	}
	
	formatDate(date, format) {
		var d = date;
		
		switch(format) {
			case 'YYYY-mm-dd HH:MM:SS':
			return d.getFullYear().toString()+"-"
			+((d.getMonth()+1).toString().length==2?(d.getMonth()+1).toString():"0"+(d.getMonth()+1).toString())+"-"
			+(d.getDate().toString().length==2?d.getDate().toString():"0"+d.getDate().toString())+" "
			+(d.getHours().toString().length==2?d.getHours().toString():"0"+d.getHours().toString())+":"
			+(d.getMinutes().toString().length==2?d.getMinutes().toString():"0"+d.getMinutes().toString())+":"
			+(d.getSeconds().toString().length==2?d.getSeconds().toString():"0"+d.getSeconds().toString());
			
			default:
				return date.toString(format);
		}
	}
	
	parseDate(datestring) {
		return Date.parse(datestring);
	}
	

	getGlobalClass() {
		return Global;
	}
	
	getModuleClass(modulename, classname) {
		return this.getModuleObject(modulename)[classname]
	}

	
	// static functions
	static getGlobalObject() {
		if (GlobalObject)
			return GlobalObject;
		
		GlobalObject = new Global();
		
		return GlobalObject;
	}
	
	static registerModuleClass(modulename, classname, classprototype) {
		console.log('GlobalClass.registerModuleClass called for module ' + modulename + ' and class ' + classname);
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

var GlobalClass = Global; // for the browser env only

if ( typeof window !== 'undefined' && window ) // if we are in browser (or react-native) and not node js (e.g. from truffle)
window.simplestore.Global = Global;
else if (typeof global !== 'undefined')
global.simplestore.Global = Global; // we are in node js

