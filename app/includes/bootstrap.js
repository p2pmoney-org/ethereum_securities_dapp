'use strict';

class Bootstrap {
	constructor() {
		this.execution_env = 'prod';
		
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

class ScriptLoader {
	
	constructor() {
		this.loadername = null;
		this.parentloader = null;
		
		this.scripts = [];
		
		this.loadstarted = false;
		this.loadfinished = false;
		
		this.eventlisteners = Object.create(null);; // map events to arrays of listeners
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
		
		entry['file'] = file;
		entry['posttreatment'] = posttreatment;
		
		this.scripts.push(entry);
	}
	
	getChildLoader(loadername) {
		return ScriptLoader.getScriptLoader(loadername, this);
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
		var parser = document.createElement('a');
		parser.href = url;
		var servername = parser.origin;
		return servername;		
	}
	
	static _getPathName(url) {
		var parser = document.createElement('a');
		parser.href = url;
		var pathname = parser.pathname;
		return pathname;		
	}
	
	static getDappdir() {
		return ScriptLoader.dapp_dir;
	}

	static setDappdir(dapp_dir) {
		ScriptLoader.dapp_dir = dapp_dir;
	}

	static createScriptLoadPromise(file, posttreatment) {
		//var self = ScriptLoader;
		
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
			
			var script  = document.createElement('script');
			script.src  = ScriptLoader.dapp_dir + file;
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
		
		// put in the map
		scriptloadermap[loadername] = scriptloader;
		
		return scriptloader;
	}
	
	static findScriptLoader(loadername) {
		if (scriptloadermap[loadername])
			return scriptloadermap[loadername];
	}
	
}

if ( typeof window !== 'undefined' && window ) // if we are in browser and not node js (e.g. truffle)
window.ScriptLoader = ScriptLoader;
else
module.exports = ScriptLoader; // we are in node js

if (window.dapp_browser_no_load === undefined) {
	// load browser-load.js
	var browserload = ScriptLoader.getScriptLoader('bootstrap');

	browserload.push_script('./js/src/browser-load.js');


	//perform load
	browserload.load_scripts();
}

