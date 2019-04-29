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
	
	// async
	findTransactionHash(callback) {
		var session = this.session;
		var global = session.getGlobalObject();
		var ethnodemodule = global.getModuleObject('ethnode');
		var EthereumNodeAccess = ethnodemodule.getEthereumNodeAccessInstance();
		
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
		var EthereumNodeAccess = ethnodemodule.getEthereumNodeAccessInstance();
		
		
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
		var EthereumNodeAccess = ethnodemodule.getEthereumNodeAccessInstance();
		
		
		var promise = EthereumNodeAccess.web3_getTransactionReceipt(this.txhash, function(err, res) {
			
			if (callback)
				callback(err, res);
		});
		
		return promise;
	}
}

if ( typeof GlobalClass !== 'undefined' && GlobalClass )
	GlobalClass.registerModuleClass('ethnode', 'Transaction', Transaction);
else
	module.exports = Transaction; // we are in node js