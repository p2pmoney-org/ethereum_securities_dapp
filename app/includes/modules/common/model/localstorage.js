/**
 * 
 */
'use strict';

var CacheStorage = class {
	constructor() {
		this.map = Object.create(null); // use a simple object to implement the map
	}
	
	getKeyJson(key) {
		if (key in this.map) {
			return this.map[key];
		} 
	}
	
	updateJson(key, json) {
		this.map[key] = json;
	}
	
	count() {
		return Object.keys(this.map).length;
	}
	
	empty() {
		this.map = Object.create(null);
	}
}

var LocalStorage = class {
	constructor(session) {
		this.session = session;
		
		this.storagemap = new CacheStorage();
	}
	
	getStorageAccessInstance() {
		return this.session.getStorageAccessInstance();
	}
	

	empty() {
		this.storagemap.empty();
	}
	
	keystostring(keys) {
		var key = '';
		
		for (var i =0; i < keys.length; i++) {
			key += (i > 0 ? '-' : '') + keys[i]
		}
		
		return key;
	}
	
	// update of cache
	_hasItemChildren(itemjson) {
		return (typeof itemjson === 'object')
	}
	
	_hasItemUUID(itemjson, uuid, uuidfieldname) {
		var fieldname = (uuidfieldname ? uuidfieldname : 'uuid');
		return (itemjson && itemjson[fieldname] && (itemjson[fieldname] == uuid));
	}
	
	_findJsonLeaf(parentjson, uuid, uuidfieldname) {
		if (!parentjson)
			return;
		
		var self = this;
		var fieldname = (uuidfieldname ? uuidfieldname : 'uuid');
		
		/*if (!this.loopcount) this.loopcount = 1;
		
		this.loopcount++; console.log('loop ' + this.loopcount);
		if (this.loopcount > 100) throw 'stop loop';*/

		var jsonkeys = Object.keys(parentjson);
		
		if (!jsonkeys)
			return;
		
		for (var i=0; i < jsonkeys.length; i++) {
			var key = jsonkeys[i];
			var itemjson = parentjson[key];
			//console.log('scanning key ' + key);
			//console.log('key value is ' + JSON.stringify(itemjson));
			
			if (this._hasItemUUID(itemjson, uuid, fieldname))
				return itemjson;
			else {
				// to avoid scanning strings
				if (this._hasItemChildren(itemjson)) {
					//console.log('deep diving in key ' + key);
					var jsonleaf = self._findJsonLeaf(itemjson, uuid, fieldname);
					
					if (jsonleaf)
						return jsonleaf;
				}
				else {
					//console.log('itemjson is ' + JSON.stringify(itemjson));
				}
			}
			
		};
		
	}
	
	getLocalJsonLeaf(keys, uuid, uuidfieldname) {
		var session = this.session;
		var fieldname = (uuidfieldname ? uuidfieldname : 'uuid');

		var localjson = this.readLocalJson(keys);
		
		console.log('searching in keys ' + JSON.stringify(keys) + ' ' + fieldname + ' ' + uuid);
		
		return this._findJsonLeaf(localjson, uuid, fieldname);
	}
	
	_replaceJsonLeaves(parentjson, uuid, uuidfieldname, childjson) {
		if (!parentjson)
			return;

		var self = this;
		var fieldname = (uuidfieldname ? uuidfieldname : 'uuid');
		
		Object.keys(parentjson).forEach(function(key) {
			
			if (self._hasItemUUID(parentjson[key], uuid, fieldname)) {
				console.log('replacing for key ' + key + ' json ' + JSON.stringify(parentjson[key]));
				console.log('by json ' + JSON.stringify(childjson));
				
				delete parentjson[key];
				parentjson[key] = childjson;
			}
			else {
				if (self._hasItemChildren(parentjson[key])) {
					self._replaceJsonLeaves(parentjson[key], uuid, childjson);
				}
			}
		});
	}
	
	updateLocalJsonLeaf(keys, uuid, json, uuidfieldname) {
		var fieldname = (uuidfieldname ? uuidfieldname : 'uuid');
		console.log('update json leaf with ' + fieldname + ' ' + uuid);

		var session = this.session;
		var localjson = this.readLocalJson(keys);
		//console.log('local json is ' + JSON.stringify(localjson));
		
		this._replaceJsonLeaves(localjson, uuid, fieldname, json);
		
	}
	
	insertLocalJsonLeaf(keys, parentuuid, collectionname, json, uuidfieldname) {
		var fieldname = (uuidfieldname ? uuidfieldname : 'uuid');
		var key = this.keystostring(keys);

		console.log('insert json leaf for key ' + key + ' under ' + fieldname + ' ' + parentuuid + ' with ' + fieldname + ' ' + json[fieldname] + ' for collection ' + collectionname);

		var session = this.session;
		var localjson = this.readLocalJson(keys);
		var collectionjsonarray;
		
		if (!localjson) {
			// no entry for these keys, insert an empty array for them
			localjson = [];
			this.storagemap.updateJson(key, localjson);
			
			// and the collection is
			if (collectionname) {
				localjson.collectionname = [];
				collectionjsonarray = localjson.collectionname;
			}
			else {
				collectionjsonarray = localjson;
			}
		}
		else {
			
			if (localjson.constructor !== Array) {
				var newlocaljson = [];
				
				for (var property in localjson) {
				    if (localjson.hasOwnProperty(property)) {
				    	newlocaljson.property = localjson.property;
				    }
				}
				
				localjson = newlocaljson;
				this.storagemap.updateJson(key, localjson);
			}
			
			if (parentuuid) {
				var parentjson = this._findJsonLeaf(localjson, parentuuid, fieldname);
			}
			else {
				var parentjson = localjson;
			}
			
			collectionjsonarray = (collectionname ? parentjson[collectionname] : parentjson);
		}
		
		var parentjson = (parentuuid ? this._findJsonLeaf(localjson, parentuuid, fieldname) : localjson);
		var collectionjsonarray = (collectionname ? parentjson[collectionname] : parentjson);
		
		if (collectionjsonarray.constructor !== Array) {
			// problematic, can't turn the object reference by collectionjsonarray into an array
			console.log('WARNING: json leaf is not an array, should not happen!');
			collectionjsonarray[0] = json;
		}
		else {
			collectionjsonarray.push(json);
		}
		
		
	}
	
	
	// read and save
	// (async methods)
	readLocalJson(keys, bForceRefresh, callback) {
		var self = this;
		var key = this.keystostring(keys);
		//var jsonstring = localStorage.getItem(key.toString());
		
		console.log("readLocalJson for key " + key.toString() + " with refresh flag " + bForceRefresh);
		
		var entry = this.storagemap.getKeyJson(key);
		
		if ((entry) && (!bForceRefresh) && (bForceRefresh != true)) {
			//console.log("readLocalJson json in cache for key " + key.toString() + " is " + JSON.stringify(entry));
			
			return entry;
		}
		
		var storageaccess = this.getStorageAccessInstance();
		var json;

		if (this.session.isAnonymous()) {
			json = storageaccess.readClientSideJson(keys);

			this.storagemap.updateJson(key, json);
			
			if (callback)
				callback(null, this.storagemap.getKeyJson(key));
		}
		else {
			// we return the information in cache
			// since we are sending a reference
			// json will be updated when callback is called
			
			// and start a new read to update the cache if necessary
			storageaccess.readUserJson(keys, function(err, res) {
				if (!err)
				self.storagemap.updateJson(key, res);
				
				if (callback)
					callback(null, self.storagemap.getKeyJson(key));
			})
			.catch(function (err) {
			     console.log("LocalStorage.readLocalJson promise rejected: " + err);
			});
		}
		
		//console.log("LocalStorage.readLocalJson: local storage json for key " + key.toString() + " is " + JSON.stringify(this.storagemap.getKeyJson(key)));
		
		return this.storagemap.getKeyJson(key);
	}
	
	saveLocalJson(keys, json, callback) {
		var storageaccess = this.getStorageAccessInstance();
		var key = this.keystostring(keys);
		
		//console.log("saveLocalJson: local storage json for key " + key.toString() + " is " + JSON.stringify(json));
		
		if (this.session.isAnonymous()) {
			storageaccess.saveClientSideJson(keys, json);
			
			this.storagemap.updateJson(key, json);
			
			if (callback)
				callback(null, json);
		}
		else {
			var self = this;
			
			storageaccess.saveUserJson(keys, json, function(err, res) {
				var returnedjson = res;
				
				// update cache now with the saved version
				self.storagemap.updateJson(key, returnedjson);
				
				if (callback)
					callback(null, returnedjson);
				
				return res;
			})
			.catch(function (err) {
			     console.log("LocalStorage.saveLocalJson promise rejected: " + err);
			});
		}

	}
	
	
}

if ( typeof GlobalClass !== 'undefined' && GlobalClass )
	GlobalClass.registerModuleClass('common', 'LocalStorage', LocalStorage);
else if (typeof window !== 'undefined') {
	let _GlobalClass = ( window && window.simplestore && window.simplestore.Global ? window.simplestore.Global : null);
	
	_GlobalClass.registerModuleClass('common', 'LocalStorage', LocalStorage);
}
else
	module.exports = LocalStorage; // we are in node js
