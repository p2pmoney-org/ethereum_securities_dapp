'use strict';


var User = class {
	constructor(session) {
		this.session = session;
		
		this.useruuid = null;
		
		this.username = null;
		this.useremail = null;
		
		var global = session.getGlobalObject();
		var commonmodule = global.getModuleObject('common');

		this.accountmap = new commonmodule.AccountMap();

		this.getClass = function() { return this.constructor.getClass()};
	}
	
	getUserUUID() {
		return this.useruuid;
	}
	
	setUserUUID(useruuid) {
		this.useruuid = useruuid;
	}
	
	getUserName() {
		return this.username;
	}
	
	setUserName(username) {
		this.username = username;
	}
	
	getUserEmail() {
		return this.useremail;
	}
	
	setUserEmail(useremail) {
		this.useremail = useremail;
	}
	
	// user's private keys
	getAccountObjects() {
		return this.accountmap.getAccountArray();
	}
	
	getAccountObject(address) {
		if (!address)
			return;
		
		var key = address.toString();
		var mapvalue = this.accountmap.getAccount(key);
		
		var account;
		
		if (mapvalue !== undefined) {
			// is already in map
			account = mapvalue;
		}
		else {
			account = this.getAccountObject(address);
			
			// put in map
			this.accountmap.pushAccount(account);
		}
		
		return account;
	}
	
	getAccountObjectFromPrivateKey(privkey) {
		var account = this.createBlankAccountObject();
		
		account.setPrivateKey(privkey);
		
		this.addAccountObject(account);
		
		return account;
	}
	
	addAccountObject(account) {
		account.setOwner(this);

		this.accountmap.pushAccount(account);
	}
	
	removeAccountObject(account) {
		this.accountmap.removeAccount(account);
		
		account.setOwner(null);
	}
	

	isEqual(user) {
		var useruuid1 = this.useruuid;
		var useruuid2 = (user ? user.useruuid : null);
		
		if ( useruuid1 && useruuid2 && (useruuid1 == useruuid2))
			return true;
		else
			return false;
	}
}

if ( typeof GlobalClass !== 'undefined' && GlobalClass )
GlobalClass.registerModuleClass('common', 'User', User);
else if (typeof window !== 'undefined') {
	let _GlobalClass = ( window && window.simplestore && window.simplestore.Global ? window.simplestore.Global : null);
	
	_GlobalClass.registerModuleClass('common', 'User', User);
}
else
module.exports = User; // we are in node js