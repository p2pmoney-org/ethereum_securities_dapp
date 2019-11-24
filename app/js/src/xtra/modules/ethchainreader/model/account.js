'use strict';


var Account = class {
	constructor(session, address) {
		this.session = session;
		this.address = address;
		
		this.balance = null;
		this.code = null;
		
		this.getClass = function() { return this.constructor.getClass()};
	}
		
	getAddress() {
		return this.address;
	}

	// sync, can be used after a _read
	isContract() {
		var code = this.code;
		
		if (code)
			return true;
		else
			return false;
	}

	// async
	_readAccount(callback) {
		var promises = [];
		var promise;
		var self = this;
		
		promise = this.getBalance(function (err, res) {
			if (err) {
				if (callback)
					callback(err, null);
				
				return null;
			}
			
			return res;
		});
		
		promises.push(promise);
		
		
		
		promise = this.getCode(function (err, res) {
			if (err) {
				if (callback)
					callback(err, null);
				
				return null;
			}
			
			return res;
		});
		
		promises.push(promise);
		
		
		// wait for all promises to resolve
		return Promise.all(promises).then(function(res) {
			if (!res) {
				if (callback)
					callback('could not get members of account', null);
				
				return null;
			}
			
			if (callback)
				callback(null, self);
			
			return self;
		});
		
	}
	
	getBalance(callback) {
		var Account = this.getClass();
		
		var self = this;
		
	    var global = Account.getGlobalObject();
	    var chainreadermodule = global.getModuleObject('ethchainreader');
	    
	    var accountaddr = this.address;
	    
	    var EthereumNodeAccess = chainreadermodule.getEthereumNodeAccess(this.session);
	    
	    return EthereumNodeAccess.web3_getBalance(accountaddr, function(err, res) {
			if (err) {
				if (callback)
					callback(err, null);
				
				return null;
			}
			
			self.balance = res;

			if (callback)
				callback(null, res);
			
			return res;
		});
	    
	    /*var web3 = chainreadermodule.getWeb3Instance();
		var promise = new Promise( function(resolve, reject) {
			return web3.eth.getBalance(accountaddr, function(err, res) {
				if (err) {
					if (callback)
						callback(err, null);
					
					return reject(null);
				}
				
				self.balance = res;

				if (callback)
					callback(null, res);
				
				return resolve(res);
			});
		});
		
		return promise;*/
	}

	getCode(callback) {
		var Account = this.getClass();
		
		var self = this;
		
	    var global = Account.getGlobalObject();
	    var chainreadermodule = global.getModuleObject('ethchainreader');
	    
	    var accountaddr = this.address;
	    
	    var EthereumNodeAccess = chainreadermodule.getEthereumNodeAccess(this.session);
	    
	    return EthereumNodeAccess.web3_getCode(accountaddr, function(err, res) {
			if (err) {
				if (callback)
					callback(err, null);
				
				return null;
			}
			
			self.code = res;

			if (callback)
				callback(null, res);
			
			return res;
	    });
	    
	    /*var web3 = chainreadermodule.getWeb3Instance();
		var promise = new Promise( function(resolve, reject) {
			return web3.eth.getCode(accountaddr, function(err, res) {
				if (err) {
					if (callback)
						callback(err, null);
					
					return reject(null);
				}
				
				self.code = res;

				if (callback)
					callback(null, res);
				
				return resolve(res);
			});
		});
		
		return promise;*/
	}
	
	// static
	static getAccount(session, accountaddr, callback) {
		var Account = this.getClass();

		var account = new Account(session, accountaddr);
		
		return account._readAccount( function (err, res) {
			if (err) {
				if (callback)
					callback(err, null);
				
				return null;
			}

			if (callback)
				callback(null, account);
			
			return account;
			
		});
		
	}
	
	static isNullAddress(address) {
		if (!address)
			return true;
		
		if (address == "0x0")
			return true;
		
		return false;
	}
}

if ( typeof GlobalClass !== 'undefined' && GlobalClass )
GlobalClass.registerModuleClass('ethchainreader', 'Account', Account);
else if (typeof window !== 'undefined') {
	let _GlobalClass = ( window && window.simplestore && window.simplestore.Global ? window.simplestore.Global : null);
	
	_GlobalClass.registerModuleClass('ethchainreader', 'Account', Account);
}
else if (typeof global !== 'undefined') {
	// we are in node js
	let _GlobalClass = ( global && global.simplestore && global.simplestore.Global ? global.simplestore.Global : null);
	
	_GlobalClass.registerModuleClass('ethchainreader', 'Account', Account);
}