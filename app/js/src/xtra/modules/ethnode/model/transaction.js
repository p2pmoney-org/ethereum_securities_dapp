/**
 * 
 */
'use strict';

var Transaction = class {
	constructor(session, transactionuuid) {
		this.session = session;
		this.txhash = null;
		
		this.transactionuuid = transactionuuid;
		
		this.fromaddress = null;
		this.toaddress = null;
		
		this.value = null;
		
		this.creationdate = Date.now();
		
		this.status = null;
		
		this.web3providerurl = null;
	}
	
	getTransactionUUID() {
		return this.transactionuuid;
	}
	
	getTransactionHash() {
		return this.txhash;
	}
	
	setTransactionHash(txhash) {
		this.txhash = txhash;
	}
	
	getCreationDate() {
		return this.creationdate;
	}
	
	getFrom() {
		return this.fromaddress;
	}
	
	setFrom(fromaddress) {
		this.fromaddress = fromaddress;
	}
	
	getTo() {
		return this.toaddress;
	}
	
	setTo(toaddress) {
		this.toaddress = toaddress;
	}
	
	getValue() {
		return this.value;
	}
	
	setValue(value) {
		this.value = value;
	}
	
	setCreationDate(creationdate) {
		this.creationdate = creationdate;
	}
	
	getStatus() {
		return this.status;
	}
	
	setStatus(status) {
		this.status = status;
	}
	
	getWeb3ProviderUrl() {
		if (this.web3providerurl)
		return this.web3providerurl;
		
		// return default
		var global = this.session.getGlobalObject();
		var ethnodemodule = global.getModuleObject('ethnode');
		
		return ethnodemodule.getWeb3ProviderUrl();
	}
	
	setWeb3ProviderUrl(url) {
		this.web3providerurl = url;
	}
	
	// async
	findTransactionHash(callback) {
		var session = this.session;
		var global = session.getGlobalObject();
		var ethnodemodule = global.getModuleObject('ethnode');
		var web3providerurl = this.getWeb3ProviderUrl();
		var EthereumNodeAccess = ethnodemodule.getEthereumNodeAccessInstance(session, web3providerurl);
		
		var promise = EthereumNodeAccess.web3_findTransaction(this.transactionuuid, function(err, res) {
			
			if (callback)
				callback(err, res);
		});
		
		return promise;
	}
	
	/*getTransaction(callback) {
		return this.getEthTransaction();
	}*/
	
	getEthTransaction(callback) {
		var session = this.session;
		var global = session.getGlobalObject();
		var ethnodemodule = global.getModuleObject('ethnode');
		var web3providerurl = this.getWeb3ProviderUrl();
		var EthereumNodeAccess = ethnodemodule.getEthereumNodeAccessInstance(session, web3providerurl);
		
		var promise = EthereumNodeAccess.web3_getTransaction(this.txhash, function(err, res) {
			
			if (callback)
				callback(err, res);
		});
		
		return promise;
	}
	
	getEthTransactionReceipt(callback) {
		var session = this.session;
		var global = session.getGlobalObject();
		var ethnodemodule = global.getModuleObject('ethnode');
		var web3providerurl = this.getWeb3ProviderUrl();
		var EthereumNodeAccess = ethnodemodule.getEthereumNodeAccessInstance(session, web3providerurl);
		
		
		var promise = EthereumNodeAccess.web3_getTransactionReceipt(this.txhash, function(err, res) {
			
			if (callback)
				callback(err, res);
		});
		
		return promise;
	}
}

if ( typeof GlobalClass !== 'undefined' && GlobalClass )
	GlobalClass.registerModuleClass('ethnode', 'Transaction', Transaction);
else if (typeof window !== 'undefined') {
	let _GlobalClass = ( window && window.simplestore && window.simplestore.Global ? window.simplestore.Global : null);
	
	_GlobalClass.registerModuleClass('ethnode', 'Transaction', Transaction);
}
else if (typeof global !== 'undefined') {
	// we are in node js
	let _GlobalClass = ( global && global.simplestore && global.simplestore.Global ? global.simplestore.Global : null);
	
	_GlobalClass.registerModuleClass('ethnode', 'Transaction', Transaction);
}