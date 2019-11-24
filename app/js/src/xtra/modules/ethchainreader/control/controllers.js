'use strict';

var ModuleControllers = class {
	
	constructor(module) {
		this.module = module;
	}


	getLastBlockData(callback) {
		var data = [];
		
		var chainreaderinterface = this.module.getChainReaderInterface();
		
		var promise = chainreaderinterface.getLatestBlock(function(err, res) {
			if (err) {
				if (callback)
					callback(err, null);
				
				return;
			}
			
			var block = res;
			
			data['block'] = res;
			
			data['blocknumber'] = block.getNumber();
			data['gasUsed'] = block.gasUsed;
			
			if (callback)
				callback(null, data);
			
			return data;
		});

		return promise
	}
	
	getTransactionContract(transaction, callback) {
		var chainreaderinterface = this.module.getChainReaderInterface();

		if (transaction.isContractCallTx) {
			var contractaddress = transaction.recipient;
			var promises = [];
			var promise;
			
			promise = chainreaderinterface.getContractName(contractaddress, function(err,res) {
				transaction.contractname = res;
				
				return res;
			});
			promises.push(promise);
			
			promise = chainreaderinterface.getContractVersion(contractaddress, function(err,res) {
				transaction.contractversion = res;
				
				return res;
			});
			promises.push(promise);
			
			return Promise.all(promises).then(function(res) {
				if (callback)
					callback(null, res);
				return res;
			});
		}
		
	}

	getLastTransactionData(callback) {
		var data = [];
		var chainreaderinterface = this.module.getChainReaderInterface();
		
		var promise = chainreaderinterface.getLatestBlock(function(err, res) {
			if (err) {
				if (callback)
					callback(err, null);
				
				return;
			}
			
			return res;
			
		})
		.then(function(res) {
			var block = res;
			
			if (block)
			return block.getTransactions(function(err, res) {
				if (err) {
					if (callback)
						callback(err, null);
					
					return;
				}
				
				if (callback)
					callback(null, res);
				
				return res;
				
			});
			
		});

		return promise
	}
}


if ( typeof GlobalClass !== 'undefined' && GlobalClass )
GlobalClass.registerModuleClass('ethchainreader', 'Controllers', ModuleControllers);
else if (typeof window !== 'undefined') {
	let _GlobalClass = ( window && window.simplestore && window.simplestore.Global ? window.simplestore.Global : null);
	
	_GlobalClass.registerModuleClass('ethchainreader', 'Controllers', ModuleControllers);
}
else if (typeof global !== 'undefined') {
	// we are in node js
	let _GlobalClass = ( global && global.simplestore && global.simplestore.Global ? global.simplestore.Global : null);
	
	_GlobalClass.registerModuleClass('ethchainreader', 'Controllers', ModuleControllers);
}