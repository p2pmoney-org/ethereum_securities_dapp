'use strict';

var ModuleControllers = class {
	
	constructor(module) {
		this.module = module;
	}
	

	// account
	getAccountObjectFromUUID(session, accountuuid) {
		var accountobjects = session.getAccountObjects();
		
		for (var i = 0; i < accountobjects.length; i++) {
			var accountobject = accountobjects[i];
			
			if (accountobject.getAccountUUID() == accountuuid)
				return accountobject;
		}
	}
	
	getSessionAccountObjectFromUUID(session, accountuuid) {
		var accountobjects = session.getSessionAccountObjects();
		
		for (var i = 0; i < accountobjects.length; i++) {
			var accountobject = accountobjects[i];
			
			if (accountobject.getAccountUUID() == accountuuid)
				return accountobject;
		}
	}
	
	
	// hooks

}

GlobalClass.registerModuleClass('common', 'Controllers', ModuleControllers);