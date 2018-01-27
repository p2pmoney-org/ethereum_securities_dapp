/**
 * 
 */
'use strict';

var GlobalClass;

class Contracts {
	
	constructor(session) {
		this.session = session;
		
		this.contractobjects = [];
	}
	
	initContractObjects(jsonarray) {
		if (!jsonarray)
			return;
		
		console.log("Contracts.initContractObjects called");

		for(var i = 0; i < jsonarray.length; i++) {
			var address = (jsonarray[i]['address'] ? jsonarray[i]['address'] : null);
			var contracttype = (jsonarray[i]['contracttype'] ? jsonarray[i]['contracttype'] : null);
			
			var contract;
			
			if (address)
				contract = this.getContractObject(address, contracttype);
			else
				contract = this.createBlankContractObject(contracttype)
			
			if (contract) {
				contract.initContract(jsonarray[i]);
				this.addContractObject(contract);
			}
		}	
		
	}
	
	getContractObjects() {
		return this.contractobjects;
	}
	
	getLocalOnlyContractObjects() {
		var array = [];
		
		for (var i = 0; i < this.contractobjects.length; i++) {
			var contract = this.contractobjects[i];
			
			if (contract.isLocalOnly())
				array.push(contract);
		}
		
		return array;
	}
	
	getChainContractObjects() {
		var array = [];
		
		for (var i = 0; i < this.contractobjects.length; i++) {
			var contract = this.contractobjects[i];
			
			if (!contract.isLocalOnly())
				array.push(contract);
		}
		
		return array;
	}
	
	getContractObjectsJson() {
		var json = [];
		
		for(var i = 0; i < this.contractobjects.length; i++) {
			var contract = this.contractobjects[i];
			
			var contractjson = contract.getLocalJson();
			
			json.push(contractjson);
		}
		
		return json;
	}
	
	
	// list functions
	addContractObject(contract) {
		if (!contract)
			return;
		
		console.log("Contracts.addContractObject called");
		
		// we could check contract is one of correct types
		var length = this.contractobjects.length;
		this.contractobjects.push(contract);
		
		var key = "key" + Math.floor((Math.random() * 1000) + 1) + "-index" + length;
		contract.setContractIndex(key);
	}
	
	removeContractObjectAt(i) {
		if (i > -1) {
			var contract = this.getContractObjectAt(i);
			
			if (contract) {
				contract.setContractIndex(null);
				this.contractobjects.splice(i, 1);
			}
		}
	}
	
	removeContractObject(contract) {
		if (!contract)
			return;
		
		var key = contract.getContractIndex();
		var pos = this.findContractObjectPos(key);
		
		this.removeContractObjectAt(pos);
	}
	
	getContractObjectFromKey(key) {
		var i = this.findContractObjectPos(key);
		
		return this.getContractObjectAt(i);
	}
	
	getContractObjectAt(i) {
		var length = this.contractobjects.length;
		
		if ((i >= 0) && (i < length))
			return this.contractobjects[i];
	}
	
	findContractObjectPos(key) {
		var length = this.contractobjects.length;
		
		for(var i = 0; i < length; i++) {
			var contract = this.contractobjects[i];
			
			var contractindex = contract.getContractIndex();
			
			if (contractindex == key)
			return i;
		}
		
		return -1;
	}
	
	// instantiation
	getContractObject(address, contracttype) {
		if (!address)
			return;
		
		if (!contracttype)
			return;
		
		var SessionClass = this.session.getSessionClass();
		var contract;
		
		if (contracttype == 'StockLedger') {
			contract = new SessionClass.StockLedger(this.session, address);
		}
		
		return contract;
	}
	
	createBlankContractObject(contracttype) {
		if (!contracttype)
			return;
		
		var SessionClass = this.session.getSessionClass();
		var contract;
		
		if (contracttype == 'StockLedger') {
			contract = new SessionClass.StockLedger(this.session, null);
		}
		
		return contract;
		
	}
	
}

if ( typeof GlobalClass !== 'undefined' && GlobalClass )
GlobalClass.Contracts = Contracts;
else
module.exports = Contracts; // we are in node js


