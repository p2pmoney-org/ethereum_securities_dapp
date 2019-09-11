class Config {
	
	static push(key, value) {
		if (!Config.valuemap) {
			Config.valuemap = Object.create(null);
		}
		
		var keystring = key.toString().trim().toLowerCase();
		
		if (!Config.valuemap[keystring]) {
			Config.valuemap[keystring] = value;
		}
		else {
			if (Array.isArray(Config.valuemap[keystring]) === false) {
				var array = [];
				array.push(Config.valuemap[keystring]);
				Config.valuemap[keystring] = array;
			}
			
			Config.valuemap[keystring].push(value);
		}
	}
	
	static _areEqual(value1, value2) {
		return JSON.stringify(value1) == JSON.stringify(value2);
	}
	
	static remove(key, value) {
		if (!Config.valuemap) {
			Config.valuemap = Object.create(null);
		}
		
		var keystring = key.toString().trim().toLowerCase();
		
		if (Config.valuemap[keystring]) {
			if (Array.isArray(Config.valuemap[keystring]) === true) {
				var oldarray = Config.valuemap[keystring];
				var newarray = [];
				
				// go through array and skip same value
				for (var i = 0; i < oldarray.length; i++) {
					if (Config._areEqual(oldarray[i], value) === false)
						newarray.push(oldarray[i]);
				}

				Config.valuemap[keystring] = newarray;
			}
			else {
				if (Config._areEqual(Config.valuemap[keystring], value) === true)
					delete Config.valuemap[keystring];
			}
			
		}
	}
	
	static get(key) {
		if (!Config.valuemap) {
			Config.valuemap = Object.create(null);
		}

		var keystring = key.toString().trim().toLowerCase();

		return Config.valuemap[keystring];
	}
	
	static getValue(key) {
		var val = Config[key];
		
		// look if key is overloaded in Config.valuemap
		var newval = (Config && (Config.get)  && (Config.get(key)) ? Config.get(key) : null);
		
		if (newval)
			val = newval;
		
		return vale;
	}
	
	
	static getXtraValue(key) {
		if (!key)
			return;
		
		var val;
		
		if ( typeof Config.XtraConfig !== 'undefined' && Config.XtraConfig) {
			if (!Config.XtraConfig.instance)
				Config.XtraConfig.instance = new Config.XtraConfig();
			
			if (Config.XtraConfig.instance[key])
			val = Config.XtraConfig.instance[key];
			
			// look if key is overloaded in Config.valuemap
			var newval = (Config && (Config.get)  && (Config.get(key)) ? Config.get(key) : null);
			
			if (newval)
				val = newval;
		}
		else {
			console.log('Config.XtraConfig not defined')
		}
		
		return val;
	}
}

/********************/
/*   Export         */
/********************/ 
	
	
// export

if ( typeof window !== 'undefined' && window ) // if we are in browser and not node js (e.g. truffle)
window.simplestore.Config = Config;
else
module.exports = Config; // we are in node js
