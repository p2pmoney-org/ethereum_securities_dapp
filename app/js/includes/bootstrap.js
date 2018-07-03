'use strict';

class ScriptLoader {
	
	constructor() {
		this.loadername = null;
		this.parentloader = null;
		
		this.scripts = [];
		
		this.loadfinished = false;
	}
	
	// scripts loading
	promise_include(entry)	{
		var file = entry['file'];
		var posttreatment = entry['posttreatment'];
		
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

		var num = 0; // needed to access scope from within function() in then

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
		var scriptloader = new ScriptLoader();
		
		scriptloader.loadername = loadername;
		scriptloader.parentloader = parentloader;
		
		return scriptloader;
	}
	
}

if ( typeof window !== 'undefined' && window ) // if we are in browser and not node js (e.g. truffle)
window.ScriptLoader = ScriptLoader;
else
module.exports = ScriptLoader; // we are in node js

// load browser-load.js
var browserload = ScriptLoader.getScriptLoader('bootstap');

browserload.push_script('./js/src/browser-load.js');


//perform load
browserload.load_scripts();

