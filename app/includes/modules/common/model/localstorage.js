/**
 * 
 */
'use strict';

var LocalStorage = class {
	constructor(session) {
		this.session = session;
	}
	
	keystostring(keys) {
		var key = '';
		
		for (var i =0; i < keys.length; i++) {
			key += (i > 0 ? '-' : '') + keys[i]
		}
		
		return key;
	}
	
	readLocalJson(keys) {
		var key = this.keystostring(keys);
		var jsonstring = localStorage.getItem(key.toString());
		
		//console.log("local storage json for key " + key.toString() + " is " + jsonstring);
		
		var json = JSON.parse(jsonstring);
		
		return json;
	}
	
	saveLocalJson(keys, json) {
		var key = this.keystostring(keys);
		localStorage.setItem(key, JSON.stringify(json));
	}
	
	
}

if ( typeof GlobalClass !== 'undefined' && GlobalClass )
	GlobalClass.registerModuleClass('common', 'LocalStorage', LocalStorage);
else
	module.exports = LocalStorage; // we are in node js
