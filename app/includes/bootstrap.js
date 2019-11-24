'use strict';
console.log('loading bootstrap');

class Bootstrap {
	constructor() {
		this.execution_env = 'prod';
		this.javascript_env = 'browser';
		
		if (typeof window !== 'undefined' && window ) {
			if (typeof document !== 'undefined' && document ) {
				this.javascript_env = 'browser';
			}
			else {
				this.javascript_env = 'react-native';
			}
		}
		else if (typeof global !== 'undefined') {
			this.javascript_env = 'nodejs';
		}
		else {
			this.javascript_env = 'unknown';
		}
		
		// capture console.log
		this.overrideConsoleLog();
	}
	
	_testConsole() {
		try {
			console;
			return true;
		}
		catch(e) {
			return false;
		}
	}
	
	overrideConsoleLog() {
		
		// in case of browsers not supporting console
		if (!this._testConsole()) {
			window.console = {};
			
			window.console.log = function() {};
		}
		
		console.log('overridding console log');
		
		if (this.execution_env != 'dev') {
			console.log('set the execution environment to dev to keep receiving logs');
			
			// capture current log function
			this.orgconsolelog = console.log.bind(console);
			
			var self = this;
			
			console.log = function() {
				if (self.execution_env == 'debug')
				self.orgconsolelog.apply(this, arguments);
			};
			
			this.log = this.orgconsolelog;
			
		}
		else {
			// outputs everything
			// no overload of console.log
			this.orgconsolelog = console.log;
			this.log = console.log
		}
	}
	
	getExecutionEnvironment() {
		return this.execution_env;
	}
	
	setExecutionEnvironment(val) {
		switch (val) {
			case 'dev':
				this.execution_env = 'debug';
				break;
			default:
				this.execution_env = 'prod';
				break;
		};
	}
	
	getJavascriptEnvironment() {
		switch(this.javascript_env) {
			case 'browser':
				return 'browser';
			case 'react-native':
				return 'react-native';
			case 'nodejs':
				return 'nodejs';
			default:
				return 'browser';
		}
	}
	
	setJavascriptEnvironment(val) {
		switch(val) {
			case 'browser':
				this.javascript_env = 'browser';
			case 'react-native':
				this.javascript_env = 'react-native';
			case 'nodejs':
				this.javascript_env = 'nodejs';
			default:
				break;
		}
	}
	
	releaseConsoleLog() {
		this.overrideconsolelog = false;
		
		console.log = this.orgconsolelog ; 
	}
	
	getMvcUI() {
		if (this.mvcui === undefined)
			return 'angularjs-1.x';
		else 
			return this.mvcui;
	}
	
	setMvcUI(mvcui) {
		this.mvcui = mvcui;
	}
	
	
	// static
	static getBootstrapObject() {
		return BootstrapObject;
	}
}

var BootstrapObject = new Bootstrap();

var scriptloadermap = Object.create(null);

var browserload;


class ScriptLoader {
	
	constructor() {
		this.loadername = null;
		this.parentloader = null;
		
		this.scripts = [];
		
		this.loadstarted = false;
		this.loadfinished = false;
		
		this.script_root_dir = null;
		
		this.eventlisteners = Object.create(null);; // map events to arrays of listeners
	}
	
	getScriptRootDir() {
		if (this.script_root_dir)
			return this.script_root_dir;
		else
			return ScriptLoader.dapp_dir;
	}
	
	setScriptRootDir(script_root_dir) {
		this.script_root_dir = script_root_dir;
		
		if ( script_root_dir && (!script_root_dir.endsWith('/')))
			this.script_root_dir += '/';
	}
	
	// scripts loading
	promise_include(entry)	{
		var file = entry['file'];
		var posttreatment = entry['posttreatment'];
		
		var promise = ScriptLoader.createScriptLoadPromise(file, posttreatment);
		
		return promise;
	}
	
	deferForParentLoad(callback, loopnum) {
		if (!this.parentloader)
			return;
		
		console.log('defering within scriptloader ' + (this.loadername ? this.loadername : 'with no name') + ' for parent scriptloader ' + (this.parentloader.loadername ? this.parentloader.loadername : 'with no name'));
		
		if (!loopnum)
			loopnum = 0;
		
		var self = this;

		if (!this.parentloader.loadfinished) {
			loopnum++;
			//console.log("loop number " + loopnum);
			
			if (loopnum > 100)
				return;

			setTimeout(function() {self.deferForParentLoad(callback, loopnum);},100);
		}
		else {
			console.log('finished defering within scriptloader ' + (this.loadername ? this.loadername : 'with no name') + ' for parent scriptloader ' + (this.parentloader.loadername ? this.parentloader.loadername : 'with no name'));
			this.doScriptLoad(callback);
		}
		
	}
	
	doScriptLoad(callback) {
		console.log('starting load of all scripts for scriptloader ' + (this.loadername ? this.loadername : 'with no name'));
		
		var self = this;
		var promise = null;
		
		this.loadstarted = true;

		var num = 0; // needed to access scope from within function() in then
		
		if (!this.scripts.length){
			console.log('scriptloader ' + (self.loadername ? self.loadername : 'with no name') + ' had no script to load');
			
			this.loadfinished = true;
			
			if (callback)
				callback();
			
			return;
		}

		for (var i = 0; i < this.scripts.length; i++) {
		    
		    if (promise) {
		    	promise = promise.then(function () {num++; return self.promise_include(self.scripts[num]);})
		    }
		    else {
		    	promise = self.promise_include(this.scripts[i]);
		    }
		}
		
		if (promise) {
			promise.then(function () {
				self.loadfinished = true;
				
				console.log('load of all scripts finished for scriptloader ' + (self.loadername ? self.loadername : 'with no name'));

				if (callback)
					callback();
			});
		}
	}
	
	load_scripts(callback) {
		console.log('load of all scripts requested for scriptloader ' + (this.loadername ? this.loadername : 'with no name'));
		
		if (this.parentloader) {
			this.deferForParentLoad(callback);
		}
		else {
			this.doScriptLoad(callback);
		}
		
		
	}
	
	push_script(file, posttreatment) {
		console.log('push_script: ' + file + ' for loader ' + this.loadername);
		
		if (!browserload) {
			console.log('no automatic browser load triggered');
			//browserload = new BrowserLoad();
		}
		
		if (this.loadstarted)
			throw this.loadername + ' has started loading scripts. It is no longer possible to add scripts to this loader.';
			
		var entry = [];
		var filepath = file;
		
		if ((this.script_root_dir) && (file.startsWith('./'))) {
			filepath = this.script_root_dir;
			
			filepath += file;
		}
		
		entry['file'] = filepath;
		entry['posttreatment'] = posttreatment;
		
		this.scripts.push(entry);
	}
	
	getChildLoader(loadername) {
		var childloader = ScriptLoader.getScriptLoader(loadername, this);
		
		return childloader;
	}
	
	getChildrenLoaders() {
		var children = [];
		
		for (var name in scriptloadermap) {
		    if (!scriptloadermap[name]) continue;
		    
		    var loader = scriptloadermap[name];
		    
		    if (loader.parentloader && (loader.parentloader.loadername == this.loadername))
		    	children.push(loader);
		}	
		
		return children;
	}
	
	getParentLoader() {
		if (this.parentloader)
			return this.parentloader;
		else
			return this.getRootLoader();
	}
	
	getRootLoader() {
		return ScriptLoader.getRootScriptLoader();
	}
	
	getBootstrapObject() {
		return BootstrapObject;
	}
	
	registerEventListener(eventname, listener) {
		if (!eventname)
			return;
		
		if ((eventname in this.eventlisteners) === false) {
			this.eventlisteners[eventname] = [];
		}

		this.eventlisteners[eventname].push(listener);
	}

	signalEvent(eventname) {
		console.log('signalEvent called for event ' + eventname);
		if ((eventname in this.eventlisteners) === false)
			return;
		
		for (var i = 0; i < this.eventlisteners[eventname].length; i++) {
			var listener = this.eventlisteners[eventname][i];
			
			listener(eventname);
		}
	}
	
	// static
	static _relativepath(from, to) {
	    function trim(arr) {
	        var start = 0;
	        for (; start < arr.length; start++) {
	          if (arr[start] !== '') break;
	        }

	        var end = arr.length - 1;
	        for (; end >= 0; end--) {
	          if (arr[end] !== '') break;
	        }

	        if (start > end) return [];
	        return arr.slice(start, end - start + 1);
	      }

	      var fromParts = trim(from.split('/'));
	      var toParts = trim(to.split('/'));

	      var length = Math.min(fromParts.length, toParts.length);
	      var samePartsLength = length;
	      for (var i = 0; i < length; i++) {
	        if (fromParts[i] !== toParts[i]) {
	          samePartsLength = i;
	          break;
	        }
	      }

	      var outputParts = [];
	      for (var i = samePartsLength; i < fromParts.length; i++) {
	        outputParts.push('..');
	      }

	      outputParts = outputParts.concat(toParts.slice(samePartsLength));

	      return outputParts.join('/');
	}
	
	static _getServerName(url) {
		var javascriptenv = BootstrapObject.getJavascriptEnvironment();
		
		switch(javascriptenv) {
			case 'browser':
				var parser = document.createElement('a');
				parser.href = url;
				var servername = parser.origin;
				return servername;		

			case 'react-native':
				break;
				
			default:
				break;
		}
		
	}
	
	static _getDirName(url) {
		var javascriptenv = BootstrapObject.getJavascriptEnvironment();
		
		switch(javascriptenv) {
			case 'browser':
				var parser = document.createElement('a');
				parser.href = url;
				var pathname = parser.pathname;
				var dirname = pathname.substr(0, pathname.lastIndexOf( '/' )+1 );;
				return dirname;		

			case 'react-native':
				break;
				
			default:
				break;
		}

	}
	
	static _getPathName(url) {
		var javascriptenv = BootstrapObject.getJavascriptEnvironment();
		
		switch(javascriptenv) {
			case 'browser':
				var parser = document.createElement('a');
				parser.href = url;
				var pathname = parser.pathname;
				return pathname;		

			case 'react-native':
				break;
				
			default:
				break;
		}

	}
	
	static getDappdir() {
		return ScriptLoader.dapp_dir;
	}

	static setDappdir(dapp_dir) {
		ScriptLoader.dapp_dir = dapp_dir;
	}
	
	static __dirname() {
		var javascriptenv = BootstrapObject.getJavascriptEnvironment();
		
		switch(javascriptenv) {
			case 'browser':
				var scripts = document.getElementsByTagName('script');
				var scripturl = scripts[scripts.length-1].src;
				var scriptserver = ScriptLoader._getServerName(scripturl);
				var scriptpath = ScriptLoader._getPathName(scripturl);     
				
				var htmlpageurl= window.location.href;
				var htmlserver= ScriptLoader._getServerName(htmlpageurl);;
				var htmlpagepath = ScriptLoader._getPathName(htmlpageurl);
				
				return ScriptLoader._relativepath(htmlpagepath, scriptpath);

			case 'react-native':
				return '';
				
			default:
				break;
		}
	}
	
	static _performScriptLoad(source, posttreatment) {
		console.log('overload ScriptLoader._performScriptLoad to perform actual load of script: ' + source);
	}

	static createScriptLoadPromise(file, posttreatment) {
		//var self = ScriptLoader;
		var javascriptenv = BootstrapObject.getJavascriptEnvironment();
		
		switch(javascriptenv) {
			case 'browser':
				var promise = new Promise(function(resolve, reject) {
					console.log('starting load of script ' + file);
					
					if (!ScriptLoader.dapp_dir) {
						var scripts = document.getElementsByTagName('script');
						var scripturl = scripts[scripts.length-1].src;
						var scriptserver = ScriptLoader._getServerName(scripturl);
						var scriptpath = ScriptLoader._getPathName(scripturl);     
						
						var htmlpageurl= window.location.href;
						var htmlserver= ScriptLoader._getServerName(htmlpageurl);;
						var htmlpagepath = ScriptLoader._getPathName(htmlpageurl);
						
						if (scriptserver !=  htmlserver) {
							// loading scripts from a different server than the page
							ScriptLoader.dapp_dir = scriptserver + '/';
						}
						else {
							// same server, compute relative path between the page and scripts
							ScriptLoader.dapp_dir = ScriptLoader._relativepath(htmlpagepath, scriptpath);
							
							// add leading ./
							ScriptLoader.dapp_dir = './' + ScriptLoader.dapp_dir;
							
							// remove includes
							ScriptLoader.dapp_dir = ScriptLoader.dapp_dir.substring( 0, ScriptLoader.dapp_dir.indexOf( "includes" ) );
						}
						
					}
					
					var source;
					
					if (file.startsWith('/')) {
						// '/' means absolute (relative to server)
						//source = ScriptLoader.dapp_dir + '.' + file;
						source = file;
					}
					else if (file.startsWith('./')) {
						// './' means relative to dapp dir (not html page)
						source = ScriptLoader.dapp_dir + file;
					}
					else {
						// probably a full uri (e.g. http://)
						source = file;
					}
					
					var script  = document.createElement('script');
					script.src  = source;
					script.type = 'text/javascript';
					script.defer = true;

					script.onload = function(){
						console.log('script ' + file + ' is now loaded');
						
						if (posttreatment)
							posttreatment();
						
						return resolve(true);
					};

					document.getElementsByTagName('head').item(0).appendChild(script);
				});

				return promise;

			case 'react-native':
				console.log('asking (react-native) to load script: ' + file);
				
				if (!ScriptLoader.dapp_dir) {
					ScriptLoader.dapp_dir = "";
				}
				
				var promise = new Promise(function(resolve, reject) {
					ScriptLoader._performScriptLoad(file, posttreatment);
					resolve(true);
				});
				
				return promise;
				
			case 'nodejs':
				console.log('asking (nodejs) to load script: ' + file);
				
				if (!ScriptLoader.dapp_dir) {
					ScriptLoader.dapp_dir = "";
				}
				
				var promise = new Promise(function(resolve, reject) {
					ScriptLoader._performScriptLoad(file, posttreatment);
					resolve(true);
				});
				
				return promise;
				
			default:
				return Promise.resolve(false);
		}
		
		
	}
	
	static getRootScriptLoader() {
		if (scriptloadermap['rootloader'])
			return scriptloadermap['rootloader'];

		var rootscriptloader  = new ScriptLoader();
		
		scriptloadermap['rootloader'] = rootscriptloader;
		
		rootscriptloader.loadername = 'rootloader';

		rootscriptloader.loadstarted = true;
		rootscriptloader.loadfinished = true;
		
		return rootscriptloader;
	}
	
	static getScriptLoader(loadername, parentloader) {
		if (!loadername)
			throw 'script loaders need to have a name';
		
		if (loadername === 'rootloader')
			throw 'script loader name is reserved: ' + loadername;
		
		if (ScriptLoader.findScriptLoader(loadername))
			throw 'script loader ' + loadername + ' exists already, create under another name or use findScriptLoader to retrieve it';
		
		
		console.log('creating ScriptLoader ' + loadername + (parentloader ? ' with parent ' + parentloader.loadername : ' with no parent'));
		var scriptloader = new ScriptLoader();
		
		scriptloader.loadername = loadername;
		scriptloader.parentloader = parentloader;
		
		if ( parentloader && (parentloader.script_root_dir))
			scriptloader.setScriptRootDir(parentloader.script_root_dir);
		
		// put in the map
		scriptloadermap[loadername] = scriptloader;
		
		return scriptloader;
	}
	
	static findScriptLoader(loadername) {
		if (scriptloadermap[loadername])
			return scriptloadermap[loadername];
	}
	
	static reclaimScriptLoaderName(loadername) {
		if (!loadername)
			return;
		
		// change name of script loader witb same name
		// to be able re-using it
		var scriptloader = ScriptLoader.findScriptLoader(loadername);
		if (scriptloader) {
			var n = 1;
			var newname = loadername + '-' + n;
			
			while (ScriptLoader.findScriptLoader(newname)) {
				n++;
				newname = loadername + '-' + n;
			}
			
			scriptloadermap[newname] = scriptloader;
			scriptloadermap[loadername] = null;
		}
	}
	
	static getScriptLoaders() {
		var loaders = [];
		
		for (var name in scriptloadermap) {
		    if (!scriptloadermap[name]) continue;
		    
		    var loader = scriptloadermap[name];
		    
		    loaders.push(loader);
		}	
		
		return loaders;
	}
	
}

if ( typeof window !== 'undefined' && window ) { // if we are in browser and not node js (e.g. truffle)
	if (typeof window.simplestore !== 'undefined') {
		if (window.simplestore.nocreation === 'undefined')
			throw 'Hard conflict on use of window.simplestore, set window.simplestore.nocreation to avoid this!!!'
	}
	else {
		window.simplestore = {}; // files should store their classes in window.simplestore for environments like react native
	}
	
	window.simplestore.Bootstrap = Bootstrap;
	window.simplestore.ScriptLoader = ScriptLoader;
	
	var rootscriptloader = ScriptLoader.getRootScriptLoader();
	
	if ( (window.global_scope_no_load === undefined) || (window.global_scope_no_load === false)) {
		var bootstraploader = rootscriptloader.getChildLoader('bootstrap');
	
		bootstraploader.push_script(ScriptLoader.__dirname() + '/constants.js');
		bootstraploader.push_script(ScriptLoader.__dirname() + '/config.js');
	
		bootstraploader.push_script(ScriptLoader.__dirname() + '/modules/common/global.js');
	
	
		bootstraploader.load_scripts(function() {
			// signal end of bootstrap
			rootscriptloader.signalEvent('on_bootstrap_load_end');
						
			if ((window.dapp_browser_no_load === undefined) 
					|| (window.dapp_browser_no_load === false)){
				
				// load browser-load.js
				//var browserload = ScriptLoader.getScriptLoader('bootstrap');
				browserload = bootstraploader.getChildLoader('browserload');
	
				browserload.push_script('./js/src/browser-load.js');
	
	
				//perform load
				browserload.load_scripts();
			}
			
		});
	}
	
}
else if (typeof global !== 'undefined') {
	if (typeof global.simplestore === 'undefined') {
		console.log('creating global.simplestore in bootstrap');
		global.simplestore = {};
	}
	
	global.simplestore.Bootstrap = Bootstrap;
	global.simplestore.ScriptLoader = ScriptLoader;
}





