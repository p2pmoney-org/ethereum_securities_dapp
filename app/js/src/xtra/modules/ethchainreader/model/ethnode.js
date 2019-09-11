'use strict';


var EthereumNode = class {
	constructor(module) {
		this.module = module;
	}
	
	getHighestBlockNumber(callback) {
	    console.log("EthereumNode.getHighestBlockNumber called");
		var blocknumber;
		
	    var EthereumNodeAccess = this.module.getEthereumNodeAccess();
	    
	    return EthereumNodeAccess.web3_getBlockNumber(function(error, result) {
			
			if (!error) {
				blocknumber = result;
				
				if (callback)
					callback(null, blocknumber);
				
				return blocknumber;
			  } else {
				  blocknumber = -1;
				  
				  console.log('Web3 error: ' + error);
				  
				  if (callback)
					callback('Web3 error: ' + error, blocknumber);
			  }
		});
	    
		/*var web3 = this.module.getWeb3Instance();
		
		var promise =  web3.eth.getBlockNumber(function(error, result) {
			
			if (!error) {
				blocknumber = result;
				
				if (callback)
					callback(null, blocknumber);
				
				return blocknumber;
			  } else {
				  blocknumber = -1;
				  
				  console.log('Web3 error: ' + error);
				  
				  if (callback)
					callback('Web3 error: ' + error, blocknumber);
			  }
			});

		return promise;*/
	}
	
	getSyncingArray(callback) {
	    var syncing = null;
	    var EthereumNodeAccess = chainreadermodule.getEthereumNodeAccess();
	    
	    return EthereumNodeAccess.web3_isSyncing(function(error, result) {
			
			if (!error) {
				
				if(result !== false) {
					syncing = true;
					 
					var arr = [];

					for(var key in result){
					  arr[key] = result[key];
					}
					
					syncing = arr;
					
					console.log("node is syncing");
				}
				else {
					syncing = false;
					
					console.log("node is NOT syncing");
				}
				
		  } else {
			  syncing = null;
				
			  console.log('Web3 error: ' + error);
		  }
			
			if (callback)
				callback(error, syncing);
		});
	    
	    
	    /*var syncing = null;
		
		var finished = false;
		var promise =  web3.eth.isSyncing(function(error, result) {
			
			if (!error) {
				
				if(result !== false) {
					syncing = true;
					 
					var arr = [];

					for(var key in result){
					  arr[key] = result[key];
					}
					
					syncing = arr;
					
					console.log("node is syncing");
				}
				else {
					syncing = false;
					
					console.log("node is NOT syncing");
				}
				
				finished = true;
			  } else {
				  syncing = null;
					
				  console.log('Web3 error: ' + error);
				  finished = true;
			  }
			});

		return promise;*/
	}
	
}

if ( typeof GlobalClass !== 'undefined' && GlobalClass )
GlobalClass.registerModuleClass('ethchainreader', 'EthereumNode', EthereumNode);
else if (typeof window !== 'undefined') {
	let _GlobalClass = ( window && window.simplestore && window.simplestore.Global ? window.simplestore.Global : null);
	
	_GlobalClass.registerModuleClass('ethchainreader', 'EthereumNode', EthereumNode);
}
else
module.exports = EthereumNode; // we are in node js