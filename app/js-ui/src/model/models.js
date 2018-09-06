'use strict';

class Models {
	
	static loadModule(module) {
		
	}
	
	static loadModules(parentscriptloader, callback) {
		console.log('Models.loadModule called');
		
		var global = GlobalClass.getGlobalObject();
		
		/* module loaders */
		
		// common
		var commonscriptloader = global.loadModule('common', parentscriptloader, function() {
			// securities
			var securitiesscriptloader = global.loadModule('securities', commonscriptloader, function() {
				console.log('finished loading Models');
				
				if (callback)
					callback(null, true);
			});
			
		});
		


		/****module loaders****/
		
	}

}

GlobalClass.registerModuleClass('mvc', 'Models', Models);