'use strict';

class Models {
	
	static loadModule(module) {
		
	}
	
	static loadModules(parentscriptloader, callback) {
		console.log('Models.loadModule called');
		
		var global = GlobalClass.getGlobalObject();
		
		/* module loaders 
		var commonmodule = global.getModuleObject('common');
		
		if (!commonmodule.hasLoadStarted()) {
			// common
			var commonscriptloader = global.loadModule('common', parentscriptloader, function() {
				// noticebook
				var noticebookscriptloader = global.loadModule('noticebook', commonscriptloader, function() {
					console.log('finished loading Models');
					
					if (callback)
						callback(null, true);
				});
				
			});
		
		}
		else {
			var noticebookmodule = global.getModuleObject('noticebook');
			
			if (!noticebookmodule.hasLoadStarted()) {
				var noticebookscriptloader = global.loadModule('noticebook', parentscriptloader, function() {
					console.log('finished loading Models');
					
					if (callback)
						callback(null, true);
				});			
				
			}
			else {
				if (callback)
					callback(null, true);
			}
		}
		
		


		module loaders****/
		
		if (callback)
			callback(null, true);
		
	}

}

GlobalClass.registerModuleClass('mvc', 'Models', Models);

