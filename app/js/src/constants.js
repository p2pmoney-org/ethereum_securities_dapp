'use strict';

class Constants {
	
	static push(key, value) {
		if (!Constants.valuemap) {
			Constants.valuemap = Object.create(null);
		}
		
		var keystring = key.toString().trim().toLowerCase();
		
		if (!Constants.valuemap[keystring]) {
			Constants.valuemap[keystring] = value;
		}
		else {
			if (Array.isArray(Constants.valuemap[keystring]) === false) {
				var array = [];
				array.push(Constants.valuemap[keystring]);
				Constants.valuemap[keystring] = array;
			}
			
			Constants.valuemap[keystring].push(value);
		}
	}
	
	static _areEqual(value1, value2) {
		return JSON.stringify(value1) == JSON.stringify(value2);
	}
	
	static remove(key, value) {
		if (!Constants.valuemap) {
			Constants.valuemap = Object.create(null);
		}
		
		var keystring = key.toString().trim().toLowerCase();
		
		if (Constants.valuemap[keystring]) {
			if (Array.isArray(Constants.valuemap[keystring]) === true) {
				var oldarray = Constants.valuemap[keystring];
				var newarray = [];
				
				// go through array and skip same value
				for (var i = 0; i < oldarray.length; i++) {
					if (Constants._areEqual(oldarray[i], value) === false)
						newarray.push(oldarray[i]);
				}

				Constants.valuemap[keystring] = newarray;
			}
			else {
				if (Constants._areEqual(Constants.valuemap[keystring], value) === true)
					delete Constants.valuemap[keystring];
			}
			
		}
	}
	
	static get(key) {
		if (!Constants.valuemap) {
			Constants.valuemap = Object.create(null);
		}

		var keystring = key.toString().trim().toLowerCase();

		return Constants.valuemap[keystring];
	}
	
}

//export
if ( typeof window !== 'undefined' && window ) // if we are in browser and not node js (e.g. truffle)
window.Constants = Constants;
else
module.exports = Constants; // we are in node js
