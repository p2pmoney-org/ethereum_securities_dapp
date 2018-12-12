'use strict';


var Transaction = class {
	constructor() {
		
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
	    var chainreadermodule = global.getModuleObject('chainreader');
	    var Account = chainreadermodule.getAccountClass();

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
		this.accountNonce = this.data['nonce']
		this.price = parseInt(this.data['gasPrice']);
		this.gasLimit = this.data['gas'];
		this.amount = 0;
		this.block_id =  blockid;
		this.time = this.block.timestamp;
		this.newContract = (this.recipient ? 0 : 1);
		
		this.isContractCreationTx = (Account.isNullAddress(this.data['to']) ? true : false);
		this.isContractCallTx = (recipient_account && recipient_account.isContract() ? true : false);
		
		this.blockHash = this.data['blockHash'];
		this.parentHash = this.data['hash'];
		this.txIndex = this.data['transactionIndex'];
		this.type =	(this.recipient ? "tx" : "create");
		
		// additional members (needing transactionreceipt)
		this.receiptdata = null; // we don't make the call now to avoid reading the receipts of all the transaction for a block
		
		this.gasUsed = null;
	
	}
	
	// async
	_initObjects(blocknumber, sender_address, recipient_address, callback) {
	    var global = Transaction.getGlobalObject();
	    var chainreadermodule = global.getModuleObject('chainreader');
	    var Account = chainreadermodule.getAccountClass();
	    var Block = chainreadermodule.getBlockClass();

	    var promises = [];
		var promise;
		
		var self = this;
		
		// block
		promise = Block.getBlock(blocknumber, function (err, res) {
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
		promise = Account.getAccount(sender_address, function (err, res) {
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
			promise = Account.getAccount(recipient_address, function (err, res) {
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
	    var chainreadermodule = global.getModuleObject('chainreader');
	    var Block = chainreadermodule.getBlockClass();
	    
	    var EthereumNodeAccess = chainreadermodule.getEthereumNodeAccess();
	    
	    return EthereumNodeAccess.web3_getTransactionReceipt(hash, function(err, res) {
			
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
	static _createTransactionObject(data, callback) {
		var transaction = new Transaction();

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
	
	static getTransaction(txahash, callback) {
		var Transaction = this.getClass();
		
	    var global = Transaction.getGlobalObject();
	    var chainreadermodule = global.getModuleObject('chainreader');
	    var Block = chainreadermodule.getBlockClass();
	    var EthereumNodeAccess = chainreadermodule.getEthereumNodeAccess();
	    
	    var promise = EthereumNodeAccess.web3_getTransaction(txahash, function(err, res) {
			if (err) {
				if (callback)
					callback(err, null);
				
				return null;
			}
			
			return res;
			
		})
	    
	    
	    /*var web3 = chainreadermodule.getWeb3Instance();
	    
		var promise = new Promise( function(resolve, reject) {
	    	return web3.eth.getTransaction(txahash, function(err, res) {
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
			
			return Transaction._createTransactionObject(data, function (err, res) {
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
	
	static getTransactionsFromJsonArray(jsonarray, callback) {
		var Transaction = this.getClass();
		
	    var global = Transaction.getGlobalObject();
	    var chainreadermodule = global.getModuleObject('chainreader');

	    var Account = chainreadermodule.getAccountClass();
	    var Block = chainreadermodule.getBlockClass();

	    var transactions = [];
		
	    var promises = [];
		var promise;

		// read json array
		for(var i = 0; i < jsonarray.length; i++) {
			promise = Transaction._createTransactionObject(jsonarray[i], function (err, res) {
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
GlobalClass.registerModuleClass('chainreader', 'Transaction', Transaction);
else
module.exports = Contract; // we are in node js