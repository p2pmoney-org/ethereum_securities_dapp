'use strict';

class EthereumNodeAccess {
	constructor(session) {
		this.session = session;
		
		this.web3providerurl = null;
		this.web3instance = null;
	}
	
	//
	// Web3
	//
	getWeb3Class() {
		if ( typeof window !== 'undefined' && window ) {
			return Web3;
		}
		else {
			return require('web3');
		}
	}
	
	getWeb3Provider() {
		var Web3 = this.getWeb3Class();

		var web3providerurl = this.session.getWeb3ProviderUrl();
		var web3Provider = new Web3.providers.HttpProvider(web3providerurl);

		return web3Provider;
	}
	
	getWeb3Instance() {
		if (this.web3instance)
			return this.web3instance;
		
		var Web3 = this.getWeb3Class();
		var web3Provider = this.getWeb3Provider();
		  
		this.web3instance = new Web3(web3Provider);		
		
		console.log("web3 instance created");
		
		return this.web3instance;
	}
	
	web3_getBalance(address) {
		var web3 = this.getWeb3Instance();
		var balance = web3.eth.getBalance(address);
		
		return balance;
	}
	
	web3_getBalance(address, callback) {
		var self = this
		var session = this.session;

		var promise = new Promise(function (resolve, reject) {
			try {
				var web3 = self.getWeb3Instance();
				
				return web3.eth.getBalance(address, function(err, balance) {
					if (!err) {
						if (callback)
							callback(null, balance);
						
						return resolve(balance);
						
					}
					else {
						reject('web3 error: ' + err);
					}
				
				});
				
				
			}
			catch(e) {
				reject('web3 exception: ' + e);
			}
			
		});
		
		return promise
	}

	//
	// Truffle
	//
	getTruffleContractClass() {
		if ( typeof window !== 'undefined' && window ) {
			return TruffleContract;
		}
		else {
			return require('truffle-contract');
		}
	}
	
	getTruffleContractObject(contractartifact) {
		
		var TruffleContract = this.getTruffleContractClass();
		
		var trufflecontract = TruffleContract(contractartifact);
	  
		trufflecontract.setProvider(this.getWeb3Provider());
		
		return trufflecontract;
	}
	
	truffle_loadArtifact(artifactpath, callback) {
		return this.session.loadArtifact(artifactpath, callback);

	}
	
	truffle_loadContract(artifact) {
		return this.getTruffleContractObject(artifact);
	}
	
	truffle_contract_at(trufflecontract, address) {
		return trufflecontract.at(address);
	}

	truffle_contract_new(trufflecontract, params) {
		return trufflecontract.new(...params);
	}

	truffle_method_call(constractinstance, methodname, params) {
		var funcname = constractinstance[methodname];
		//console.log('contractinstance ' + Object.keys(constractinstance));
		//console.log('funcname is ' + funcname);
		
		return funcname.call(...params);
	}
	
	truffle_method_sendTransaction(constractinstance, methodname, params) {
		var funcname = constractinstance[methodname];
		
		return funcname.sendTransaction(...params);
	}
	
	// uuid
	guid() {
		  function s4() {
		    return Math.floor((1 + Math.random()) * 0x10000)
		      .toString(16)
		      .substring(1);
		  }
		  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
		    s4() + '-' + s4() + s4() + s4();
	}

	
}

if ( typeof window !== 'undefined' && window ) // if we are in browser and not node js (e.g. truffle)
window.EthereumNodeAccess = EthereumNodeAccess;
else
module.exports = EthereumNodeAccess; // we are in node js

