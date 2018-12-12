'use strict';

/*var TRUFFLE_BASE_ABI = [{
	      "constant": true,
	      "inputs": [],
	      "name": "contract_version",
	      "signature": "0xb32c65c8",
	      "outputs": [
	        {
	          "name": "",
	          "type": "uint256"
	        }
	      ],
	      "payable": false,
	      "stateMutability": "view",
	      "type": "function"
	    },
	    {
	      "constant": true,
	      "inputs": [],
	      "name": "contract_name",
	      "signature": "0xd9479692",
	      "outputs": [
	        {
	          "name": "",
	          "type": "string"
	        }
	      ],
	      "payable": false,
	      "stateMutability": "view",
	      "type": "function"
	    }
	  ];*/

var BASE_ABI = [{"constant":true,"inputs":[],"name":"contract_version","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"contract_name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"}];

var Contract = class {
	constructor(address) {
		this.address = address;
		this.abi = null;
		
		
		this.account = null;
		
		this.instance = null;
		
		this.getClass = function() { return this.constructor.getClass()};
	}
	
	getAccount() {
		return this.account;
	}
	
	getAbi() {
		return this.abi;
	}
	
	setAbi(abi) {
		this.abi = abi;
		
		// reset instance it created
		this.instance = null;
	}
	
	getMethodAbiDefinition(methodname) {
		var abi = this.getAbi();
		var abidef = null;
		
		if (!abi)
			return abidef;
		
		for (var i = 0; i < abi.length; i++) {
			var item = abi[i];
			var name = item.name;
			
			if (name == methodname) {
				abidef = item;
				
				break;
			}
		}
		
		return abidef;
	}
	
	dynamicMethodCall(abidef, params, callback) {
		var promise = this._getInstance()
		.then(function(instance) {
		    var global = Contract.getGlobalObject();
		    var chainreadermodule = global.getModuleObject('chainreader');
			
		    var EthereumNodeAccess = chainreadermodule.getEthereumNodeAccess();
		    
		    return EthereumNodeAccess._web3_contract_dynamicMethodCall(instance, abidef, params, function (err, res) {
				if (!res) {
					if (callback)
						callback('dynamic call returned null', null);
					
					return null;
				}
				
				if (callback)
					callback(null, res);
				
				return res;
				
			});		
		});
		
		return promise;
	}
	
	callReadMethod(methodname, methodparams, callback) {
		var value = null;
		
		var abidef = this.getMethodAbiDefinition(methodname);
		
		if (!abidef) {
			throw 'could not find method with name ' + methodname;
		}
		
		var constant = abidef.constant;
		var type = abidef.type;
		var payable = abidef.payable;
		var paramsnumber = abidef.inputs.length;
		var stateMutability = abidef.stateMutability;
		
		if (payable) {
			throw 'can not call a payable method: ' + methodname;
		}
		
		if (paramsnumber > methodparams.length) {
			throw 'not enough parameters have been passed for method: ' + paramsnumber;
		}
		
		var params = [];
		
		for (var i = 0; i < paramsnumber; i++) {
			// parameters have to be in the right order
			var param = methodparams[i].value;
			
			params.push(param);
		}
		
		// make call
		var promise = this.dynamicMethodCall(abidef, params)
		.then(function (res) {
			if (!res) {
				if (callback)
					callback('dynamic call returned null', null);
				
				return null;
			}
			
			if (callback)
				callback(null, res);
			
			return res;
		});
		
		return promise;
	}
	
	callGetter(abimethod, callback) {
		var promise = this._getInstance()
		.then(function(instance) {
			var constant = abimethod.constant;
			var name = abimethod.name;
			var type = abimethod.type;
			var payable = abimethod.payable;
			var stateMutability = abimethod.stateMutability;
			var signature = abimethod.signature;
			var value = null;
			
			if (abimethod.type === "function" && abimethod.inputs.length === 0 && abimethod.constant) {
				// simple gets
				var promise2 = this.callReadMethod(name, []).then(function (err, res) {
					if (err) {
						if (callback)
							callback(err, null);
						
						return null;
					}
					
					if (callback)
						callback(null, res);
					
					return resolve(res);
				});
				
				return promise2;
	          }		
			
		});
		
		return promise;
	}
	
	_getInstance(callback) {
		if (this.instance) {
			if (callback)
				callback(null, this.instance);
			
			return Promise.resolve(this.instance);
		}
		
		var abi = this.abi;
		var address = this.address;
		
		var Contract = this.getClass();
		
		var self = this;
		
	    var global = Contract.getGlobalObject();
	    var chainreadermodule = global.getModuleObject('chainreader');
	    
	    var EthereumNodeAccess = chainreadermodule.getEthereumNodeAccess();
	    
	    var promise = EthereumNodeAccess.web3_abi_load_at(abi, address, function(err, res)	 {
			var instance = res;
	    	self.instance = instance;
			
			return Promise.resolve(instance);
	    });
	    
	    return promise;
	}

	// static
	static getContract(address) {
		return new Contract(address);
	}
	
	static getContractName(address, callback) {
		
		var contract = new Contract(address);
		
		contract.setAbi(BASE_ABI);
		
		return contract.callReadMethod('contract_name', [], callback)
		.catch(function(err) {
		  console.log('error in Contract.getContractName: ' + err);
		  
		  return null;
		});
	}
	
	static getContractVersion(address, callback) {
		
		var contract = new Contract(address);
		
		contract.setAbi(BASE_ABI);
		
		return contract.callReadMethod('contract_version', [], callback)
		.catch(function(err) {
		  console.log('error in Contract.getContractVersion: ' + err);
		  
		  return null;
		});

	}
}


if ( typeof GlobalClass !== 'undefined' && GlobalClass )
GlobalClass.registerModuleClass('chainreader', 'Contract', Contract);
else
module.exports = Contract; // we are in node js