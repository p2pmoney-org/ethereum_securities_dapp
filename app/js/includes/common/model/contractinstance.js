'use strict';

class ContractInstance {
	
	constructor(session, contractaddress, contractartifact) {
		
		this.session = session;
		this.address = contractaddress;
		
		this.contractartifact = contractartifact;

		// operation
		this.trufflecontract = null;
		this.loadtrufflecontractpromise = null;

		this.trufflecontractinstanceexists = null;
		this.trufflecontractinstance = null;
		this.trufflecontractinstancepromise = null;
	}
	
	
	getAddress() {
		return this.address;
	}
	
	setAddress(address) {
		this.address = address;
	}
	
	// initialization of truffle interface
	_loadTruffleContract(callback) {
		//var finished = false;
		var session = this.session;
		var self = this;
		
		var EthereumNodeAccess = session.getEthereumNodeAccessInstance();
		var loadpromise = EthereumNodeAccess.truffle_loadArtifact(this.contractartifact, function(data) {
			// Get the necessary contract artifact file and instantiate it with truffle-contract
			var ContractInstanceArtifact = data;
			
			self.trufflecontract = EthereumNodeAccess.truffle_loadContract(ContractInstanceArtifact);
			  
			//finished = true;
			console.log('contract json file read ');
			
			if (callback)
			callback(null, self.trufflecontract);
			
			return self.trufflecontract;
		});
		
		console.log("load promise is " + loadpromise);
		
		loadpromise.then(function() {
			console.log('load promise resolved ');
		});
		
		console.log('load promise on the backburner');
		
		return loadpromise
	}
	
	_getTruffleContractObject(callback) {
		// contract instance done
		if ((this.trufflecontractinstance) || (this.trufflecontractinstanceexists === false)) {
			// we already have an instance
			// or the address does not correspond to a contract on this network
			if (callback)  {
				if (this.trufflecontractinstanceexists === false)
					callback("no contract at this address " + this.address, null);
				else
					callback(null, this.trufflecontractinstance);
			}
			
			
			return Promise.resolve(this.trufflecontractinstance);
		}
		
		// contract instance promised
		var self = this;
		var session = this.session;
		var EthereumNodeAccess = session.getEthereumNodeAccessInstance();
		
		var handleaccept = function (instance) {
			console.log('handleaccept: truffle contract instantiation done for ' + self.address);
			
			
			if (!instance) {
				self.trufflecontractinstanceexists = false;
			}
			else {
				self.trufflecontractinstanceexists = true;
				self.trufflecontractinstance = instance;
			}

			return instance;
		};
		
		var handlereject = function (err) {
			if (err) {
				console.log('handlereject: error within promise: ' + err);
				self.trufflecontractinstanceexists = false;
			}
			else {
				console.log('handlereject: error within promise');
			}

			if (callback)
			callback('handlereject: error within promise: ' + err, null);
			
		};
		
		if (this.trufflecontractinstancepromise) {
			console.log('ContractInstance._getTruffleContractObject truffle contract instantiation promise already created, but not resolved yet');
			
			console.log('ContractInstance._getTruffleContractObject returning promise');

			return this.trufflecontractinstancepromise;
		}
		else {
			this.loadtrufflecontractpromise = this._loadTruffleContract(function(err, res) {
				console.log('load truffle contract resolved, ready to continue instantiation');
				return Promise.resolve(res);
			});
			
			this.trufflecontractinstancepromise = this.loadtrufflecontractpromise.then(function(trufflecontract) {
				console.log('ContractInstance._getTruffleContractObject load truffle contract resolved');
				try {
					console.log('ContractInstance._getTruffleContractObject calling trufflecontract.at()');
					var trufflenewpromise = EthereumNodeAccess.truffle_contract_at(self.trufflecontract, self.address)
					.then(function(res) {
						if (res)
							handleaccept(res);
						else
							handlereject('could not instantiate contract at ' + self.address);
						
						return res;
					}); // necessary to have a then to catch error in activate if contract not found at address
					
					return trufflenewpromise;
				}
				catch(e) {
					console.log('ContractInstance._getTruffleContractObject exception in trufflecontract.at(): ' + e);
					self.trufflecontractinstanceexists = false;
					return Promise.resolve(null);
				}
			})
			.then(function(res) {
				
				console.log('ContractInstance._getTruffleContractObject trufflecontract instantiation completed');

				if (callback)
					callback(null, self.trufflecontractinstance);
				 				
				return self.trufflecontractinstance;
			});
			
			console.log('ContractInstance._getTruffleContractObject truffle instantiation promise created for ' + self.address);
			
			return this.trufflecontractinstancepromise;
		}

	}
	
	activate(callback) {
		var self = this;
		
		var promiseinstance = this._getTruffleContractObject(function (err, res) {
			var trufflecontractinstance = res;
			
			if (!trufflecontractinstance) {
				if (callback)
				return callback("contract instance is null", null);
				
				return null;
			}

			return trufflecontractinstance;
			
		}).then(function (trufflecontractinstance) {

			if (callback)
			 callback(null, trufflecontractinstance);
		
			return trufflecontractinstance;
		}).catch((err) => {
			console.log('error within _getTruffleContractObject promise for ' + self.address + ' : ' + err);
			
			if (callback)
				 callback('error within _getTruffleContractObject promise for ' + self.address + ' : ' + err, null);

			Promise.resolve(null);
		});
		
		return promiseinstance;
			
	}
	
	// deployment
	validateInstanceDeployment(payingaccount, gas, gasPrice, callback) {
		// we check the account is unlocked
		if (payingaccount.isLocked())
			throw 'account ' + payingaccount.getAddress() + ' is locked, unable to deploy contract';
		
		return true;
	}
	
	contract_new(params, payingaccount, gas, gasPrice, callback) {
		var self = this;
		var session = this.session;
		var EthereumNodeAccess = session.getEthereumNodeAccessInstance();

		var fromaddress = payingaccount.getAddress();
		
		console.log('ContractInstance.contract_new called from ' + fromaddress + ' with gas limit ' + gas + ' and gasPrice ' + gasPrice);
		
		
		// we validate the transaction
		if (!this.validateInstanceDeployment(payingaccount, gas, gasPrice, callback))
			return;
		
		var promise = this._loadTruffleContract(function (err, res) {
			var trufflecontract = res;
			
			if (!trufflecontract) {
				callback("contract json not loaded", null);
				return;
			}

			return trufflecontract;
			
		}).then(function (res) {
			var callfunc = function(_contract) {
				
				var callparams = [];
				
				if (params) {
					for (var i = 0; i < params.length; i++) {
						callparams.push(params[i]);
					}
				}
				
				var txjson = {from: fromaddress, 
						gas: gas, 
						gasPrice: gasPrice
					};
				
				callparams.push(txjson);
				
				var promise2 = EthereumNodeAccess.truffle_contract_new(_contract, callparams)
							.then(instance => {
								
					if (!instance) {
						if (callback)
							callback('could not instantiate contract', null);
						
						return Promise.resolve(null);
					}
				    
					var contractaddress = instance.address;
					
					self.setAddress(instance.address);
					
					console.log('ContractInstance.contract_new contract has been submitted for deployment at  ' + contractaddress);
				    
				    if (callback)
				    	callback(null, contractaddress);
				    
				    return Promise.resolve(instance);
				}).catch(err => {
				    console.log('error', err);
				    
				    if (callback)
					    callback(err, null);
				});
				
				return promise2;
			}
		
			if (self.trufflecontract)
			return callfunc(self.trufflecontract);
			
			
		}).then(function(res) {
			console.log('ContractInstance.contract_new promise of deployment should be resolved');
		});
		
		return promise;
	}
	
	method_call(methodname, params, callback) {
		var self = this;
		var session = this.session;
		var EthereumNodeAccess = session.getEthereumNodeAccessInstance();
		
		var promise = this.activate(function (err, res) {
			if ((!res) && (callback))
				callback("contract did not finalize its initialization", null);

			return res;
			
		})
		.then(function (trufflecontractinstance) {
			var callfunc = function(instance) {
				var contractInstance = instance;
				
				var promise2 = EthereumNodeAccess.truffle_method_call(contractInstance, methodname, params)
				.then(function(res) {
			    	
			    	console.log('returning from method_call ' +  methodname + ' with return ' + res);
			    	
			    	if (callback)
						callback(null, res);
						
			    	return res;
			    });
			    
				return promise2;
			}
		
		
		
		 if (self.trufflecontractinstance)
		 return callfunc(self.trufflecontractinstance);
		
		});
		
		return promise;
		
	}
	
	validateTransactionSend(payingaccount, value, gas, gasPrice, txdata, nonce, callback) {
		// we check the account is unlocked
		if (payingaccount.isLocked())
			throw 'account ' + payingaccount.getAddress() + ' is locked, unable to send transaction';
		
		return true;
	}
	
	method_sendTransaction(methodname, params, payingaccount, value, gas, gasPrice, txdata, nonce, callback) {
		var self = this;
		var session = this.session;
		var EthereumNodeAccess = session.getEthereumNodeAccessInstance();

		var fromaddress = payingaccount.getAddress();
		
		console.log('ContractInstance.method_sendTransaction called from ' + fromaddress + ' with gas limit ' + gas + ' and gasPrice ' + gasPrice);

		// we validate the transaction
		if (!this.validateTransactionSend(payingaccount, value, gas, gasPrice, txdata, nonce, callback))
			return;

		var promise = this.activate(function (err, res) {
			if (!res)
				return callback("contract did not finalize its initialization", null);

			return res;
			
		})
		.then(function (trufflecontractinstance) {
			var callfunc = function(instance) {
				var contractInstance = instance;
				
				var callparams = [];
				
				if (params) {
					for (var i = 0; i < params.length; i++) {
						callparams.push(params[i]);
					}
				}
				
				var txjson = {from: fromaddress, 
						gas: gas, 
						gasPrice: gasPrice,
					};
				
				if (value)
					txjson.value = value;
				
				if (txdata)
					txjson.data = txdata;
				
				callparams.push(txjson);

				var promise2 = EthereumNodeAccess.truffle_method_sendTransaction(contractInstance, methodname, callparams, function(err, res) {
					if (err) {
						console.log('error in ContractInstance.method_sendTransaction: ' + err);
						
						if (callback)
							callback(err, null);
					}
				})
				.then(function(res) {
			    	
			    	console.log('returning from method_sendTransaction ' +  methodname + ' with return ' + res);
			    	
			    	if (callback)
						callback(null, res);
						
			    	return res;
			    });
			    
				return promise2;
				
			}
		
		
		
		 if (self.trufflecontractinstance)
		 return callfunc(self.trufflecontractinstance);
		
		});
		
		return promise;
		
	}
	
}

if ( typeof GlobalClass !== 'undefined' && GlobalClass )
	GlobalClass.registerModuleClass('common', 'ContractInstance', ContractInstance);
else
	module.exports = ContractIntance; // we are in node js