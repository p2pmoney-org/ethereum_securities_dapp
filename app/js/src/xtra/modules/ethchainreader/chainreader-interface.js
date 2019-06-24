/**
 * 
 */
'use strict';

var ChainReaderInterface = class {
	constructor(module) {
		this.module = module
		this.global = module.global;
	}
	
	// api
	

	// sync
	getContract(address) {
		var Contract = this.module.getContractClass();
		
		return Contract.getContract(address);
	}
	
	// async
	getCurrentBlockNumber(callback) {
		var ethnode = this.module.getEthereumNodeObject();
		
		return ethnode.getHighestBlockNumber(callback);
	}
	
	getLatestBlock(callback) {
		var Block = this.module.getBlockClass();
		
		return Block.getLatestBlock(callback);
	}
	
	getLatestTransactions(callback) {
		var Block = this.module.getBlockClass();
		
		var promise = Block.getLatestBlock()
		.then(function(res) {
			var block = res;
			
			return block.getTransactions(callback);
		});
		
		return promise;
	}
	
	getContractName(address, callback) {
		var Contract = this.module.getContractClass();
		
		return Contract.getContractName(address, callback);
	}
	
	getContractVersion(address, callback) {
		var Contract = this.module.getContractClass();
		
		return Contract.getContractVersion(address, callback);
	}
	
}

if ( typeof GlobalClass !== 'undefined' && GlobalClass )
GlobalClass.registerModuleClass('ethchainreader', 'ChainReaderInterface', ChainReaderInterface);
else
module.exports = Session; // we are in node js