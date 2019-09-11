'use strict';

var ContractTransaction = class {
	
	constructor(contractinstance, payingaccount, gas, gasPrice) {
		this.contractinstance = contractinstance;
		
		this.contracttransactionuuid = null;
		
		this.methodname = null;
		this.args = null;
		
		// ethereum transaction
		this.payingaccount = payingaccount;
		
		this.fromaccount = null;
		this.toaccount = null;
		
		this.value = null;
		
		this.gas = gas;
		this.gasPrice = gasPrice;
		
		this.data = null;
		
		this.nonce = null;
		
		this.ethereumtransaction = null;
	}
	
	getContractTransactionUUID() {
		return this.contracttransactionuuid;
	}
	
	setContractTransactionUUID(txuuid) {
		this.contracttransactionuuid = txuuid;
	}
	
	getEthereumTransactionObject() {
		if (!this.ethereumtransaction) {
			var contractinstance = this.contractinstance;
			var session = contractinstance.session;
			var global = session.getGlobalObject();
			var ethereumnodeaccessmodule = global.getModuleObject('ethereum-node-access');
			
			var fromaccount = this.getFromAccount();
			
			this.ethereumtransaction = ethereumnodeaccessmodule.getEthereumTransactionObject(session, fromaccount);
		}
		
		var txuuid = this.getContractTransactionUUID();
		
		var toaccount = this.getToAccount();
		var toaddress = (toaccount ? toaccount.getAddress() : null);
		
		var value = this.getValue();
		var gas = this.getGas();
		var gasPrice = this.getGasPrice();
		var data = this.getData();
		var nonce = this.getNonce();
	    
		this.ethereumtransaction.setTransactionUUID(txuuid);
		
		this.ethereumtransaction.setToAddress(toaddress);
		this.ethereumtransaction.setValue(value);
		this.ethereumtransaction.setGas(gas);
		this.ethereumtransaction.setGasPrice(gasPrice);
		this.ethereumtransaction.setData(data);
		this.ethereumtransaction.setNonce(nonce);
		
		return this.ethereumtransaction ;
	}
	
	getMethodName() {
		return this.methodname;
	}
	
	setMethodName(methodname) {
		this.methodname = methodname;
	}
	
	getArguments() {
		return this.args;
	}
	
	setArguments(args) {
		this.args = args;
	}
	
	getPayingAccount() {
		return this.payingaccount;
	}
	
	getFromAccount() {
		if (!this.fromaccount)
			return this.payingaccount;
	}
	
	setFromAccount(fromaccount) {
		this.fromaccount = fromaccount;
		
		this.ethereumtransaction = null;
	}
	
	getToAccount() {
		return this.toaccount;
	}
	
	setToAccount(toaccount) {
		return this.toaccount;
	}
	
	getValue() {
		return this.value;
	}
	
	setValue(value) {
		this.value = value;
	}
	
	getGas() {
		return this.gas;
	}
	
	setGas(gas) {
		this.gas = gas;
	}
	
	getGasPrice() {
		return this.gasPrice;
	}
	
	setGasPrice(gasprice) {
		this.gasPrice = gasprice;
	}
	
	getNonce() {
		return this.nonce;
	}
	
	setNonce(nonce) {
		this.nonce = nonce;
	}
	
	getData() {
		this.data;
	}
	
	setData(data) {
		this.data = data;
	}
	

}

var ContractInstance = class {
	
	constructor(session, contractaddress, contractartifact) {
		
		this.session = session;
		this.address = contractaddress;
		
		this.contractartifact = contractartifact;
		
		// Contracts class
		var global = session.getGlobalObject();
		var commonmodule = global.getModuleObject('common');
		var ethnodemodule = global.getModuleObject('ethnode');
		
		this.Contracts = ethnodemodule.Contracts;
		
		this.ethnodemodule = global.getModuleObject('ethnode');


		// operation
		this.livestatus = this.Contracts.STATUS_ON_CHAIN;
		
		this.trufflecontract = null;
		this.loadtrufflecontractpromise = null;

		this.trufflecontractinstanceexists = null;
		this.trufflecontractinstance = null;
		this.trufflecontractinstancepromise = null;
	}
	
	getStatus() {
		return this.livestatus;
	}
	
	setStatus(status) {
		this.livestatus = status;
	}
	
	
	getAddress() {
		return this.address;
	}
	
	setAddress(address) {
		this.address = address;
	}
	
	// initialization of truffle interface
	_loadTruffleContract(callback) {
		var session = this.session;
		var self = this;
		var ethnodemodule = this.ethnodemodule;
		
		var EthereumNodeAccess = ethnodemodule.getEthereumNodeAccessInstance();
		var loadpromise = EthereumNodeAccess.truffle_loadArtifact(this.contractartifact, function(data) {
			// Get the necessary contract artifact file and instantiate it with truffle-contract
			var ContractInstanceArtifact = data;
			
			self.trufflecontract = EthereumNodeAccess.truffle_loadContract(ContractInstanceArtifact);
			  
			console.log('contract json file read ');
			
			if (callback)
			callback(null, self.trufflecontract);
			
			return self.trufflecontract;
		});
		
		loadpromise.catch(function (err) {
		     console.log("load artifact promise rejected: " + err);
		});
		
		loadpromise.then(function() {
			console.log('load artifact promise resolved ');
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
		var ethnodemodule = this.ethnodemodule;
		
		var EthereumNodeAccess = ethnodemodule.getEthereumNodeAccessInstance();
		
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
	
	_loadWeb3Contract(callback) {
		var session = this.session;
		var self = this;
		var ethnodemodule = this.ethnodemodule;
		
		
		var EthereumNodeAccess = ethnodemodule.getEthereumNodeAccessInstance();
		var loadpromise = EthereumNodeAccess.web3_loadArtifact(this.contractartifact, function(contract_artifact) {
			return contract_artifact;
		})
		.then(function(contract_artifact) {
			var web3contract = EthereumNodeAccess.web3_loadContract(contract_artifact);
			
			self.web3contract = web3contract;
			
			if (callback)
				callback(null, web3contract);
			
			return web3contract;
			
		});
		
		return loadpromise
	}
	
	_getWeb3ContractObject(callback) {
		var session = this.session;
		var self = this;
		var ethnodemodule = this.ethnodemodule;
		
		
		var EthereumNodeAccess = ethnodemodule.getEthereumNodeAccessInstance();
		
		var abi = this.web3contract.getAbi();
		var address = this.address;

		var promise = EthereumNodeAccess.web3_contract_load_at(abi, address, function(err, res) {
			if (res) {
				self.webcontractinstance = res;

				if (callback)
					callback(null, self.webcontractinstance );
				
				return self.webcontractinstance;
			}
			else {
				console.log('error in ContractInstance._getWeb3ContractObject: ' + err);
				
				if (callback)
					callback('error in ContractInstance._getWeb3ContractObject: ' + err, null);
			}
		});
		
		return promise;
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
	
	getContractTransactionObject(payingaccount, gas, gasPrice) {
		return new ContractTransaction(this, payingaccount, gas, gasPrice);
	}
	
	// deployment
	validateInstanceDeployment(payingaccount, gas, gasPrice, callback) {
		var session = this.session;
		var ethnodemodule = this.ethnodemodule;

		// we check the account is unlocked
		if (ethnodemodule.isAccountLocked(payingaccount))
			throw 'account ' + payingaccount.getAddress() + ' is locked, unable to deploy contract';
		
		return true;
	}
	
	contract_new_send(contracttransaction, callback) {
		var self = this;
		var session = this.session;
		var ethnodemodule = this.ethnodemodule;
		
		var EthereumNodeAccess = ethnodemodule.getEthereumNodeAccessInstance();

		var payingaccount = contracttransaction.getPayingAccount();
		var gas = contracttransaction.getGas();
		var gasPrice = contracttransaction.getGasPrice();
		var fromaddress = payingaccount.getAddress();
		
		console.log('ContractInstance.contract_new_send called from ' + fromaddress + ' with gas limit ' + gas + ' and gasPrice ' + gasPrice);
		
		
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
				var params = contracttransaction.getArguments();
				
				if (params) {
					for (var i = 0; i < params.length; i++) {
						callparams.push(params[i]);
					}
				}
				
				var ethereumtransaction = contracttransaction.getEthereumTransactionObject();
				
				callparams.push(ethereumtransaction);
				
				var promise2 = EthereumNodeAccess.web3_contract_new(_contract, callparams, function(err, res) {
					var transactionHash = res;
					console.log('ContractInstance.contract_new_send contract has been submitted for deployment; transaction hash is ' + transactionHash);
				    
					if (callback)
				    	callback(null, transactionHash);
				    
				})
				.then(instance => {
								
					if (!instance) {
						if (callback)
							callback('could not instantiate contract', null);
						
						return Promise.resolve(null);
					}
				    
					var contractaddress = instance.address;
					
					self.setAddress(instance.address);
					
					console.log('ContractInstance.contract_new_send contract has been deployed at  ' + contractaddress);
				    
				    return Promise.resolve(contractaddress);
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
			console.log('ContractInstance.contract_new_send promise of deployment resolved, result is: ' + res);
			
			return res
		});
		
		return promise;
		
	}
	
	contract_new(params, payingaccount, gas, gasPrice, callback) {
		var self = this;
		var session = this.session;
		var ethnodemodule = this.ethnodemodule;
		
		var EthereumNodeAccess = ethnodemodule.getEthereumNodeAccessInstance();

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
				    
				    return Promise.resolve(contractaddress);
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
			console.log('ContractInstance.contract_new promise of deployment resolved, result is: ' + res);
			
			return res
		});
		
		return promise;
	}
	
	method_call(methodname, params, callback) {
		var self = this;
		var session = this.session;
		var ethnodemodule = this.ethnodemodule;
		
		var EthereumNodeAccess = ethnodemodule.getEthereumNodeAccessInstance();
		
		var promise = this.activate(function (err, res) {
			if ((!res) && (callback))
				callback("contract did not finalize its initialization", null);

			return res;
			
		})
		.then(function (trufflecontractinstance) {
			var callfunc = function(instance) {
				var contractInstance = instance;
				
				var promise2;
				
				if (self.getStatus() === self.Contracts.STATUS_ON_CHAIN) {
					promise2 = EthereumNodeAccess.truffle_method_call(contractInstance, methodname, params)
					.then(function(res) {
				    	
				    	console.log('returning from method_call ' +  methodname + ' with return ' + res);
				    	
				    	if (callback)
							callback(null, res);
							
				    	return res;
				    });
				}
				else {
					promise2 = Promise.reject('contract not found on chain');
				}
			    
				return promise2;
			}
		
		
		
		 if (self.trufflecontractinstance)
		 return callfunc(self.trufflecontractinstance);
		
		})
		.catch(function (err) {
		     console.log("ContractInstance.method_call promise rejected: " + err);
		});

		
		return promise;
		
	}
	
	validateTransactionSend(payingaccount, value, gas, gasPrice, txdata, nonce, callback) {
		var session = this.session;
		var ethnodemodule = this.ethnodemodule;

		// we check the account is unlocked
		if (ethnodemodule.isAccountLocked(payingaccount))
			throw 'account ' + payingaccount.getAddress() + ' is locked, unable to send transaction';
		
		return true;
	}
	
	method_send(contracttransaction, callback) {
		var self = this;
		var session = this.session;
		var ethnodemodule = this.ethnodemodule;
		
		var EthereumNodeAccess = ethnodemodule.getEthereumNodeAccessInstance();
		
		var methodname = contracttransaction.getMethodName();
		
		if (methodname == 'new') {
			return this.contract_new_send(contracttransaction, callback);
		}

		var payingaccount = contracttransaction.getPayingAccount();
		var gas = contracttransaction.getGas();
		var gasPrice = contracttransaction.getGasPrice();
		var fromaddress = payingaccount.getAddress();
		
		var value = contracttransaction.getValue();
		
		var txdata = contracttransaction.getData();
		var nonce = contracttransaction.getNonce();
		
		
		console.log('ContractInstance.method_sendTransaction called from ' + fromaddress + ' with gas limit ' + gas + ' and gasPrice ' + gasPrice);

		// we validate the transaction
		if (!this.validateTransactionSend(payingaccount, value, gas, gasPrice, txdata, nonce, callback))
			return;
		
		// we send a standard transaction and account is unlocked
		var promise = this.activate(function (err, res) {
			if (!res)
				return callback("contract did not finalize its initialization", null);

			return res;
			
		})
		.then(function (trufflecontractinstance) {
			var callfunc = function(instance) {
				var contractInstance = instance;
				
				var callparams = [];
				var params = contracttransaction.getArguments();
				
				if (params) {
					for (var i = 0; i < params.length; i++) {
						callparams.push(params[i]);
					}
				}
				
				var ethereumtransaction = contracttransaction.getEthereumTransactionObject();
				
				callparams.push(ethereumtransaction);

				var promise2 = EthereumNodeAccess.web3_method_sendTransaction(contractInstance, methodname, callparams, function(err, res) {
					if (err) {
						console.log('error in ContractInstance.method_send: ' + err);
						
						if (callback)
							callback(err, null);
					}
					else {
						
						return res;
					}
					
				})
				.then(function(res) {
			    	
			    	console.log('returning from method_send ' +  methodname + ' with return ' + res);
			    	
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

	
	method_sendTransaction(methodname, params, payingaccount, value, gas, gasPrice, txdata, nonce, callback) {
		var self = this;
		var session = this.session;
		var ethnodemodule = this.ethnodemodule;
		
		var EthereumNodeAccess = ethnodemodule.getEthereumNodeAccessInstance();

		var fromaddress = payingaccount.getAddress();
		
		console.log('ContractInstance.method_sendTransaction called from ' + fromaddress + ' with gas limit ' + gas + ' and gasPrice ' + gasPrice);

		// we validate the transaction
		if (!this.validateTransactionSend(payingaccount, value, gas, gasPrice, txdata, nonce, callback))
			return;
		
		// we send a standard transaction and account is unlocked
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
				
				if (nonce)
					txjson.nonce = nonce;
				
				callparams.push(txjson);

				var promise2 = EthereumNodeAccess.truffle_method_sendTransaction(contractInstance, methodname, callparams, function(err, res) {
					if (err) {
						console.log('error in ContractInstance.method_sendTransaction: ' + err);
						
						if (callback)
							callback(err, null);
					}
					else {
						
						return res;
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
	
	findAddressFromUUID(transactionuuid, callback) {
		var self = this;
		var session = this.session;
		var ethnodemodule = this.ethnodemodule;
		
		var EthereumNodeAccess = ethnodemodule.getEthereumNodeAccessInstance();

		var promise = EthereumNodeAccess.web3_findTransaction(transactionuuid)
		.then(function(res) {
			var transactionHash = res['hash'];
			console.log('found transaction hash ' + transactionHash);
			
			return EthereumNodeAccess.web3_getTransactionReceipt(transactionHash);
		})
		.then(function(receipt) {
			var contractAddress = receipt['contractAddress'];
			console.log('found contract deployed at ' + contractAddress);
			
			if (callback)
				callback(null, contractAddress);
			
			return contractAddress;
		}).catch(function (err) {
		     console.log("findAddressFromUUID promise rejected: " + err);
		});
		
		return promise;
	}
	
}

if ( typeof GlobalClass !== 'undefined' && GlobalClass )
	GlobalClass.registerModuleClass('ethnode', 'ContractInstance', ContractInstance);
else if (typeof window !== 'undefined') {
	let _GlobalClass = ( window && window.simplestore && window.simplestore.Global ? window.simplestore.Global : null);
	
	_GlobalClass.registerModuleClass('ethnode', 'ContractInstance', ContractInstance);
}
else
	module.exports = ContractIntance; // we are in node js