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

if ( (typeof GlobalClass === 'undefined') || (!GlobalClass)) {var GlobalClass = ((typeof window !== 'undefined') && window && window.simplestore && window.simplestore.Global ? window.simplestore.Global : null);}

if ( typeof GlobalClass !== 'undefined' && GlobalClass )
GlobalClass.registerModuleClass('common', 'Controllers', ModuleControllers);