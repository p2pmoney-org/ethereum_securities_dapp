'use strict';


var Transaction = class {
	constructor(session) {
		this.session = session;
		
		this.hash= -1;
		this.sender = null;
		this.recipient = null;
		this.accountNonce = null;
		this.price = null;
		this.gasLimit = null;
		this.amount = null;
		this.block_id = null;
		this.time = null;
		this.newContract = null;
		
		this.isContractCreationTx = null;
		this.isContractCallTx = null;
		
		this.blockHash = null;
		this.parentHash = null;
		this.txIndex = null;
		this.gasUsed = null;
		this.type =	"tx";
		
		this.input = null;
		this.decoded_input = null;
		
		// original web3 data
		this.data = null;
		
		this.receiptdata = null;
		
		// objects
		this.block = null;
		this.sender_account = null;
		this.recipient_account = null;
		

		
		this.getClass = function() { return this.constructor.getClass()};
	}
	
	// sync
	_setData(data) {
		this.data = data;
		
		if (data == null)
			return;
		
	    var global = Transaction.getGlobalObject();
	    var chainreadermodule = global.getModuleObject('ethchainreader');
	    var Account = chainreadermodule.getAccountClass();
	    
	    var ethereumnodeaccessmodule = global.getModuleObject('ethereum-node-access');

		// objects
	    var block = this.block;
	    var sender_account = this.sender_account;
	    var recipient_account = this.recipient_account;

		
	    // block
		var blockid = this.data['blockNumber'];
		
		// fill members
		this.hash = this.data['hash'];
		
		this.sender = this.data['from'];
		this.recipient = this.data['to'];
		this.accountNonce = this.data['nonce'];
		this.price = parseInt(this.data['gasPrice']);
		this.gasLimit = this.data['gas'];
		this.amount = this.data['value'];
		this.block_id =  blockid;
		this.time = this.block.timestamp;
		this.newContract = (this.recipient ? 0 : 1);
		
		this.isContractCreationTx = (Account.isNullAddress(this.data['to']) ? true : false);
		this.isContractCallTx = (recipient_account && recipient_account.isContract() ? true : false);
		
		this.blockHash = this.data['blockHash'];
		this.parentHash = this.data['hash'];
		this.txIndex = this.data['transactionIndex'];
		this.type =	(this.recipient ? "tx" : "create");
		
		this.input = this.data['input'];
		
		// additional members (needing transactionreceipt)
		this.receiptdata = null; // we don't make the call now to avoid reading the receipts of all the transaction for a block
		
		this.gasUsed = null;
	
	}
	
	// async
	_initObjects(blocknumber, sender_address, recipient_address, callback) {
	    var global = Transaction.getGlobalObject();
	    var chainreadermodule = global.getModuleObject('ethchainreader');
	    var Account = chainreadermodule.getAccountClass();
	    var Block = chainreadermodule.getBlockClass();

	    var promises = [];
		var promise;
		
		var self = this;
		
		// block
		promise = Block.getBlock(this.session, blocknumber, function (err, res) {
			if (err) {
				if (callback)
					callback(err, null);
				
				return null;
			}
			
			var block = res;
			
			self.block = block;
			
			return block;
		});
		
		promises.push(promise);
		
		// sender
		promise = Account.getAccount(this.session, sender_address, function (err, res) {
			if (err) {
				if (callback)
					callback(err, null);
				
				return null;
			}
			
			var account = res;
			
			self.sender_account = account;
				
			return account;
		});
		
		promises.push(promise);
		
		// recipient
		if (!Account.isNullAddress(recipient_address)) {
			promise = Account.getAccount(this.session, recipient_address, function (err, res) {
				if (err) {
					if (callback)
						callback(err, null);
					
					return null;
				}
				
				var account = res;
				
				self.recipient_account = account;
				
				return account;
			});
			
			promises.push(promise);
		}
		
		// resolve all promises
		return Promise.all(promises).then(function(res) {
			if (!res) {
				if (callback)
					callback('could not initialize internal objects for transaction', null);
				
				return false;
			}
			
			if (callback)
				callback(null, true);
			
			return true;
		});
		
	}
	
	getTransactionReceiptData(callback) {
		var txhash = this.hash;
		var self = this;
		
	    var global = Transaction.getGlobalObject();
	    var chainreadermodule = global.getModuleObject('ethchainreader');
	    var Block = chainreadermodule.getBlockClass();
	    
	    var EthereumNodeAccess = chainreadermodule.getEthereumNodeAccess(this.session);
	    
	    return EthereumNodeAccess.web3_getTransactionReceipt(txhash, function(err, res) {
			
			if (err) {
				if (callback)
					callback(err, null);
				
				return null;
			}
			
			var receiptdata = res;
			
			self.receiptdata = receiptdata;
			
			if (callback)
				callback(null, receiptdata);
			
			return receiptdata;
		});
	    
	    /*var web3 = chainreadermodule.getWeb3Instance();
	    
		var promise = new Promise( function(resolve, reject) {
	    	return web3.eth.getTransactionReceipt(hash, function(err, res) {
			
				if (err) {
					if (callback)
						callback(err, null);
					
					return reject(null);
				}
				
				var receiptdata = res;
				
				self.receiptdata = receiptdata;
				
				if (callback)
					callback(null, receiptdata);
				
				return resolve(receiptdata);
			});
	    	
		});
		
		return promise;*/
	}

	
	// static
	static _createTransactionObject(session, data, callback) {
		var transaction = new Transaction(session);

		var blocknumber = data['blockNumber']
		var sender_address = data['from']
		var recipient_address = data['to']
		
		return transaction._initObjects(blocknumber, sender_address, recipient_address, function (err, res) {
			if (err) {
				if (callback)
					callback(err, null);
				
				return null;
			}
			
			var success = res;
			
			if (success) {
				transaction._setData(data);
				
				if (callback)
					callback(null, transaction);
				
				return transaction;
				
			}
			else {
				if (callback)
					callback('could not initialize block and account objects', null);
				
				return null;
				
			}
			
		});
		
	}
	
	static getTransaction(session, txhash, callback) {
		var Transaction = this.getClass();
		
	    var global = Transaction.getGlobalObject();
	    var chainreadermodule = global.getModuleObject('ethchainreader');
	    var Block = chainreadermodule.getBlockClass();
	    var EthereumNodeAccess = chainreadermodule.getEthereumNodeAccess(session);
	    
	    var promise = EthereumNodeAccess.web3_getTransaction(txhash, function(err, res) {
			if (err) {
				if (callback)
					callback(err, null);
				
				return null;
			}
			
			return res;
			
		})
	    
	    
	    /*var web3 = chainreadermodule.getWeb3Instance();
	    
		var promise = new Promise( function(resolve, reject) {
	    	return web3.eth.getTransaction(txhash, function(err, res) {
				if (err) {
					if (callback)
						callback(err, null);
					
					return reject(null);
				}
				
				return resolve(res);
				
			});
		})*/
		.then(function(res) {
			var data = res;
			
			return Transaction._createTransactionObject(session, data, function (err, res) {
				if (err) {
					if (callback)
						callback(err, null);
					
					return null;
				}
				
				var transaction = res;
				
				if (transaction) {
					if (callback)
						callback(null, transaction);
					
					return transaction;
					
				}
				else {
					if (callback)
						callback('could not create transaction object', null);
					
					return null;
					
				}
				
			});

		});

		return promise;
	}
	
	static getTransactionsFromJsonArray(session, jsonarray, callback) {
		var Transaction = this.getClass();
		
	    var global = Transaction.getGlobalObject();
	    var chainreadermodule = global.getModuleObject('ethchainreader');

	    var Account = chainreadermodule.getAccountClass();
	    var Block = chainreadermodule.getBlockClass();

	    var transactions = [];
		
	    var promises = [];
		var promise;

		// read json array
		for(var i = 0; i < jsonarray.length; i++) {
			promise = Transaction._createTransactionObject(session, jsonarray[i], function (err, res) {
				if (err) {
					if (callback)
						callback(err, null);
					
					return null;
				}
				
				var transaction = res;
				
				if (transaction)
					transactions.push(transaction);
				
			});
			
			promises.push(promise);
		}	
		
		// resolve all promises
		return Promise.all(promises).then(function(res) {
			if (!res) {
				if (callback)
					callback('could not get transaction array', null);
				
				return false;
			}
			
			if (callback)
				callback(null, transactions);
			
			return transactions;
		});
	}	
	

	
	
}

if ( typeof GlobalClass !== 'undefined' && GlobalClass )
GlobalClass.registerModuleClass('ethchainreader', 'Transaction', Transaction);
else if (typeof window !== 'undefined') {
	let _GlobalClass = ( window && window.simplestore && window.simplestore.Global ? window.simplestore.Global : null);
	
	_GlobalClass.registerModuleClass('ethchainreader', 'Transaction', Transaction);
}
else if (typeof global !== 'undefined') {
	// we are in node js
	let _GlobalClass = ( global && global.simplestore && global.simplestore.Global ? global.simplestore.Global : null);
	
	_GlobalClass.registerModuleClass('ethchainreader', 'Transaction', Transaction);
}