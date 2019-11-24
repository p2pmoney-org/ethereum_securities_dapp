'use strict';


class Views {
	
	constructor(global) {
		this.global = global;
		
	}
	
	getLoginWidget(session) {
		console.log('Views.getLoginWidget called');
		
		if (session instanceof Session !== true)
			throw 'must pass a session object as first parameter!';
		
		var global = this.global;
		var sessionuuid = session.getSessionUUID();

		console.log('is anonymous: ' + (session.isAnonymous() ? 'true' : 'false'));
		
		var message = global.t("You are about to login on another system");
		var logintext = (session.isAnonymous() ? global.t('Anonymous' ): session.getSessionUserIdentifier());
		console.log('login text is: ' + logintext);
		
		var loginlink;

		loginlink = "<a href='javascript:GlobalClass.getGlobalObject().getModuleObject(\"mvc\").getControllersObject().handleShowLoginBox(\"" 
//			+ sessionuuid + "\",\""
			+ message 
			+ "\")' >"
			+ '{{useridentifier}}' 
			+ "</a>";

		var content = loginlink;
		//console.log('loginlink text is: ' + loginlink);
		
		return content;
	}
	
	getReloadAppWidget() {
		console.log('Views.getReloadAppWidget called');
		
		var global = this.global;
		
		var reloadtext = global.t("Reload app");
		
		var reloadlink;

		reloadlink = "<a href='javascript:GlobalClass.getGlobalObject().getModuleObject(\"mvc\").getControllersObject().reloadApp()' >"
			+ reloadtext 
			+ "</a>";

		var content = reloadlink;
		
		return content;
	}
	
	getTransactionStatusString(transaction) {
		if (!transaction)
			return;
		
		var global = this.global;

		var status = transaction.getStatus();
		
		switch(status) {
			case 'undefined':
				return global.t('undefined');
			case 'started':
				return global.t('started');
			case 'completed':
				return global.t('committed');
			default:
				return status;
		}
	}
	
}

GlobalClass.registerModuleClass('mvc', 'Views', Views);
