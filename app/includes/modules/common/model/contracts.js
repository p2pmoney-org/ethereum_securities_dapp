/**
 * 
 */
'use strict';

var GlobalClass;

var Contracts = class {
	
	// "constants"
	static get STATUS_LOST() { return -100;}	

	static get STATUS_NOT_FOUND() { return -20;}	
	static get STATUS_UNKOWN() { return -10;}	

	static get STATUS_LOCAL() { return 1;}
	
	static get STATUS_SENT() { return 10;}	
	static get STATUS_PENDING() { return 100;}	
	
	static get STATUS_DEPLOYED() { return 200;}	
	static get STATUS_CANCELLED() { return 300;}	
	static get STATUS_REJECTED() { return 400;}	
	
	static get STATUS_ON_CHAIN() { return 1000;}
	
	static checkStatus(contract, chaintestfunction, contractinstance, callback) {
		var self = contract;
		
		var promise = new Promise(function (resolve, reject) {
			if (self.address == null) {
				var status = self.getStatus();
				var callbacknow = true;
				
				switch(status) {
					case self.Contracts.STATUS_LOCAL:
					case self.Contracts.STATUS_LOST:
					case self.Contracts.STATUS_CANCELLED:
					case self.Contracts.STATUS_REJECTED:
						self.livestatus = self.Contracts.STATUS_LOCAL;
						break; // pure local
					
					case self.Contracts.STATUS_SENT:
					case self.Contracts.STATUS_PENDING: {
						// check if we can find address from our uuid
						var transactionuuid = self.getUUID();
						callbacknow = false;
						
						//var contractinstance = self.getContractInterface().getContractInstance();
						
						contractinstance.findAddressFromUUID(transactionuuid, function(err, res) {
							if (res) {
								var address = res;
								console.log('found address ' + address + ' for transaction ' + transactionuuid);
								
								self.setAddress(address);
								self.setStatus(self.Contracts.STATUS_DEPLOYED);
								self.livestatus = self.Contracts.STATUS_ON_CHAIN;

								status = self.getStatus();
								
								if (callback)
									callback(null, status);
							}
							else {
								self.livestatus = status;
							}
							
							contractinstance.setStatus(self.livestatus);
						});
					}
						break; // in the process
					
					case self.Contracts.STATUS_DEPLOYED: {
						// abnormal since we don't have an address
						console.log('Abnormal status for ' + self.getUUID());

						// check if we can find address from our uuid
						var transactionuuid = self.getUUID();
						callbacknow = false;
						
						//var contractinstance = self.getContractInterface().getContractInstance();
						
						contractinstance.findAddressFromUUID(transactionuuid, function(err, res) {
							if (res) {
								var address = res;
								console.log('found address ' + address + ' for transaction ' + transactionuuid);
								
								self.setAddress(address);
								self.livestatus = self.Contracts.STATUS_ON_CHAIN;
								
								if (callback)
									callback(null, status);
							}
							else {
								self.livestatus = self.Contracts.STATUS_NOT_FOUND;
							}
							
							contractinstance.setStatus(self.livestatus);
						});
					}
						break; // reached a chain
						
					case self.Contracts.STATUS_NOT_FOUND:
					case self.Contracts.STATUS_ON_CHAIN:
						// abnormal since this is not a saved status
						console.log('Abnormal status for ' + self.getUUID());
						self.setStatus(self.Contracts.STATUS_LOST);
						self.livestatus = status;
						break; // live status only flags
					
					default:
						break;
				}
				
				if ((callback) && (callbacknow))
					callback(null, status);
				
				resolve(status);
				
				return status;
			}
			else {
				// check to see if this address is a token contract
				// on the current block chain
				chaintestfunction(function(err, res) {
					var currentstatus = self.getStatus();
					
					// has been deployed
					// but not on this blockchain
					switch(currentstatus) {
						case self.Contracts.STATUS_LOCAL:
						case self.Contracts.STATUS_LOST:
						case self.Contracts.STATUS_CANCELLED:
						case self.Contracts.STATUS_REJECTED: {
							// abnormal since we have an address
							console.log('Abnormal status for ' + self.getUUID());
							if ((err) || (!res)) {
								self.setStatus(self.Contracts.STATUS_DEPLOYED);
								self.livestatus = self.Contracts.STATUS_NOT_FOUND;
							}
							else {
								self.setStatus(self.Contracts.STATUS_DEPLOYED);
								self.livestatus = self.Contracts.STATUS_ON_CHAIN;
							}
						}
							break; // pure local

						case self.Contracts.STATUS_SENT:
						case self.Contracts.STATUS_PENDING: {
							// abnormal
							console.log('Abnormal status for ' + self.getUUID());
							if (res) {
								self.setStatus(self.Contracts.STATUS_DEPLOYED);
								self.livestatus = self.Contracts.STATUS_ON_CHAIN;
							}
							else{
								self.livestatus = currentstatus;
							}
						}
							break; // in the process

						case self.Contracts.STATUS_DEPLOYED: {
							 // reached a chain, somewhere
							if (res) {
								// found on this blockchain
								self.livestatus = self.Contracts.STATUS_ON_CHAIN;
							}
							else {
								self.livestatus = self.Contracts.STATUS_NOT_FOUND;
							}
						}
							break;
						
						case self.Contracts.STATUS_NOT_FOUND:
						case self.Contracts.STATUS_ON_CHAIN: {
							// abnormal since this is a live status flag
							console.log('Abnormal status for ' + self.getUUID());
							
							self.setStatus(self.Contracts.STATUS_DEPLOYED);
							self.livestatus = currentstatus;
						}
							break;
						
						default:
							self.setStatus(self.Contracts.STATUS_UNKOWN);
							break;
					}


					var status = self.getStatus();
					
					if (contractinstance)
					contractinstance.setStatus(self.livestatus);

					if (callback)
						callback(null, status);
					
					resolve(status);

					return status;
				});
			}
			
		});
		
		return promise;
		
	}

	// object part
	constructor(session) {
		this.session = session;
		
		this.contractclasses = []; // contracttype -> class for instantiation
		
		this.contractobjects = []; // array of contract objects
	}
	
	initContractObjects(jsonarray) {
		if (!jsonarray)
			return;
		
		console.log("Contracts.initContractObjects called");
		
		if (this.contractobjects.length) {
			// we empty the array
			this.flushContractObjects();
		}

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
			else {
				console.log("contract type not handled: " + contracttype);
				console.log('handled types ' + Object.getOwnPropertyNames(this.contractclasses));
			}
		}	
		
	}
	
	flushContractObjects() {
		// we empty the array
		this.contractobjects = [];
	}
	
	getContractObjects(filter) {
		return this.getContractObjectsArray(filter);
	}
	
	getContractObjectsArray(filter) {
		if (!filter) {
			return this.contractobjects; 
		}
		else {
			var array = [];
			
			for (var i = 0; i < this.contractobjects.length; i++) {
				var contract = this.contractobjects[i];
				
				if (filter.indexOf(contract.getContractType()) != -1)
					array.push(contract);
			}
			
			return array;
		}
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
		
		var contractuuid = contract.getUUID();
		
		console.log("Contracts.addContractObject called for contract with uuid " + contractuuid);
		
		if (this._findContractObjectPosFromUUID(contractuuid) != -1) {
			throw 'trying to add a contract with duplicate uuid ' + contractuuid;
		}
		
		// we could check contract is one of correct types
		
		// create transient contractindex
		var length = this.contractobjects.length;
		
		var key = "key" + Math.floor((Math.random() * 1000) + 1) + "-index" + length;
		contract.setContractIndex(key);
		
		// add to array
		this.contractobjects.push(contract);
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
		var pos = this._findContractObjectPosFromKey(key);
		
		this.removeContractObjectAt(pos);
	}
	
	getContractObjectFromUUID(uuid) {
		var i = this._findContractObjectPosFromUUID(uuid);
		
		return this.getContractObjectAt(i);
	}
	
	_findContractObjectPosFromUUID(uuid) {
		var length = this.contractobjects.length;
		
		for(var i = 0; i < length; i++) {
			var contract = this.contractobjects[i];
			
			var contractuuid = contract.getUUID();
			
			if (contractuuid == uuid)
			return i;
		}
		
		return -1;
	}
	
	getContractObjectFromKey(key) {
		var i = this._findContractObjectPosFromKey(key);
		
		return this.getContractObjectAt(i);
	}
	
	getContractObjectAt(i) {
		var length = this.contractobjects.length;
		
		if ((i >= 0) && (i < length))
			return this.contractobjects[i];
	}
	
	_findContractObjectPosFromKey(key) {
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
	registerContractClass(contracttype, contractclass) {
		console.log('Contracts.registerContractClass called for type ' + contracttype);
		
		var key = contracttype.toString().toLowerCase();
		this.contractclasses[key] = contractclass;
	}
	
	getContractClass(contracttype) {
		var key = contracttype.toString().toLowerCase();
		return this.contractclasses[key];
	}
	
	getContractObject(address, contracttype) {
		if (!address)
			return;
		
		if (!contracttype)
			return;
		
		var contract;
		
		var contractclass = this.getContractClass(contracttype);
		
		if (contractclass) {
			contract = new contractclass(this.session, address);
			
			if (!contract.getAddress)
				throw 'contract class for type ' + contracttype + ' must implement getAddress method';
			
			if (!contract.getUUID)
				throw 'contract class for type ' + contracttype + ' must implement getUUID method';
			
			if (!contract.getContractType)
				throw 'contract class for type ' + contracttype + ' must implement getContractType method';
			
			if (!contract.getLocalJson)
				throw 'contract class for type ' + contracttype + ' must implement getLocalJson method';
			
			if (!contract.getContractIndex)
				throw 'contract class for type ' + contracttype + ' must implement getContractIndex method';
			
			if (!contract.setContractIndex)
				throw 'contract class for type ' + contracttype + ' must implement setContractIndex method';
		}
		
		return contract;
	}
	
	createBlankContractObject(contracttype) {
		if (!contracttype)
			return;
		
		var contract;
		
		var contractclass = this.getContractClass(contracttype);
		
		if (contractclass) {
			contract = new contractclass(this.session, null);
		}
		
		return contract;
	}
	
}

if ( typeof GlobalClass !== 'undefined' && GlobalClass )
GlobalClass.registerModuleClass('common', 'Contracts', Contracts);
else
module.exports = Contracts; // we are in node js


