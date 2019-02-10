'use strict';


class Views {
	
	constructor(global) {
		this.global = global;
		
	}
	
	getLoginWidget() {
		console.log('Views.getLoginWidget called');
		
		var global = this.global;
		var session = global.getModuleObject('common').getSessionObject();

		console.log('is anonymous: ' + (session.isAnonymous() ? 'true' : 'false'));
		
		var message = global.t("You are about to login on another system");
		var logintext = (session.isAnonymous() ? global.t('Anonymous' ): session.getSessionUserIdentifier());
		console.log('login text is: ' + logintext);
		
		var loginlink;

		loginlink = "<a href='javascript:GlobalClass.getGlobalObject().getModuleObject(\"mvc\").getControllersObject().handleShowLoginBox(\"" 
			+ message 
			+ "\")' >"
			+ '{{useridentifier}}' 
			+ "</a>";

		var content = loginlink;
		//console.log('loginlink text is: ' + loginlink);
		
		return content;
	}
	
}

GlobalClass.registerModuleClass('mvc', 'Views', Views);
