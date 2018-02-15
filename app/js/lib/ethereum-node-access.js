'use strict';

class EthereumNodeAccess {
	constructor(session) {
		this.session = session;
	}
	
	//
	// Web3
	//
	web3_getBalance(address) {
		var web3 = this.session.getWeb3Instance();
		var balance = web3.eth.getBalance(address);
		
		return balance;
	}
	
	web3_getBalance(address, callback) {
		var self = this
		var session = this.session;

		var promise = new Promise(function (resolve, reject) {
			try {
				var web3 = session.getWeb3Instance();
				
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
	truffle_loadArtifact(artifactpath, callback) {
		return this.session.loadArtifact(artifactpath, callback);

	}
	
	truffle_loadContract(artifact) {
		return this.session.getTruffleContractObject(artifact);
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
	
}

if ( typeof window !== 'undefined' && window ) // if we are in browser and not node js (e.g. truffle)
window.EthereumNodeAccess = EthereumNodeAccess;
else
module.exports = EthereumNodeAccess; // we are in node js

