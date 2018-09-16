'use strict';

var scriptloadermap = Object.create(null);

class ScriptLoader {
	
	constructor() {
		this.loadername = null;
		this.parentloader = null;
		
		this.scripts = [];
		
		this.loadstarted = false;
		this.loadfinished = false;
	}
	
	// scripts loading
	static createScriptLoadPromise(file, posttreatment) {
		var promise = new Promise(function(resolve, reject) {
			console.log('starting load of script ' + file);
			var script  = document.createElement('script');
			script.src  = file;
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
		if (!browserload) {
			browserload = new BrowserLoad();
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
	
	// static
	static getScriptLoader(loadername, parentloader) {
		if (!loadername)
			throw 'script loaders need to have a name';
		
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

// load browser-load.js
var browserload = ScriptLoader.getScriptLoader('bootstrap');

browserload.push_script('./js/src/browser-load.js');


//perform load
browserload.load_scripts();

