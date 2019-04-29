'use strict';

class StockLedgerContractInterface {
	
	constructor(session, contractaddress) {
		this.session = session;
		this.address = contractaddress;
		
		// operating variables
		this.finalized_init = null;
		
		this.contractinstance = null;
		
		var global = session.getGlobalObject();
		this.ethnodemodule = global.getModuleObject('ethnode');
	}
	
	getAddress() {
		if (this.address)
		return this.address;
		
		this.address = this.getContractInstance().getAddress();
		
		return this.address;
	}
	
	setAddress(address) {
		this.address = address;
	}
	
	getContractInstance() {
		if (this.contractinstance)
			return this.contractinstance;
		
		var session = this.session;
		var global = session.getGlobalObject();
		var ethnodemodule = global.getModuleObject('ethnode');
		
		this.contractinstance = ethnodemodule.getContractInstance(this.address, './contracts/StockLedger.json');
		
		return this.contractinstance;
	}
	
	validateInstanceDeployment(payingaccount, owningaccount, gas, gasPrice, callback) {
		// we check the account is unlocked
		if (payingaccount.isLocked())
			throw 'account ' + payingaccount.getAddress() + ' is locked, unable to deploy contract: ' + this.localledgerdescription;
		
		// we validate we are signed-in with the correct owning account
		var session = this.session;
		
		if (!session.isSessionAccount(owningaccount))
			throw 'account ' + owningaccount.getAddress() + ' is not currently signed-in';
		
		return true;
	}
	
	// contract api
	activateContractInstance(callback) {
		return this.getContractInstance().activate(callback);
	}
	
	deploy(contractowner, contractownerpublkey,	cryptedowneridentifier,	ledgername,	cryptedledgerdescription,
			payingaccount, owningaccount, gas, gasPrice,
			transactionuuid, callback) {
		var self = this;
		var session = this.session;

		var fromaddress = payingaccount.getAddress();
		
		console.log('StockLedgerContractInterface.deploy called for ' + this.localledgerdescription + " from " + fromaddress + " with gas limit " + gas + " and gasPrice " + gasPrice);
		
		
		// we validate the transaction
		if (!this.validateInstanceDeployment(payingaccount, owningaccount, gas, gasPrice, callback))
			return;
		
		var contractinstance = this.getContractInstance();
		
		/*var params = [];
		
		params.push(contractowner);
		params.push(contractownerpublkey);
		params.push(cryptedowneridentifier);
		params.push(ledgername);
		params.push(cryptedledgerdescription);

		var promise = contractinstance.contract_new(params, payingaccount, gas, gasPrice)*/
		var contracttransaction = contractinstance.getContractTransactionObject(payingaccount, gas, gasPrice);
		
		var args = [];
		
		args.push(contractowner);
		args.push(contractownerpublkey);
		args.push(cryptedowneridentifier);
		args.push(ledgername);
		args.push(cryptedledgerdescription);
		
		contracttransaction.setArguments(args);
		
		contracttransaction.setContractTransactionUUID(transactionuuid);
		
		var promise = contractinstance.contract_new_send(contracttransaction, function(err, res) {
			console.log('StockLedgerContractInterface.deploy callback called, result is: ' + res);
			
			if (callback)
				callback(null, res);
			
			return res;
		})
		.then(function(res) {
			console.log('StockLedgerContractInterface.deploy promise of deployment resolved, result is: ' + res);
			
			self.setAddress(contractinstance.getAddress());
			
			return res;
		});
		
		return promise;
	}
	
	// getters
	getContractName(callback){
		var self = this;
		var session = this.session;

		var contractinstance = this.getContractInstance();

		var promise = contractinstance.method_call("contract_name", [])
		.then(function(res) {
			if (callback)
				callback(null, res);
			
			return res;
		});
		
		return promise;
	}
	
	getContractVersion(callback){
		var self = this;
		var session = this.session;

		var contractinstance = this.getContractInstance();

		var promise = contractinstance.method_call("contract_version", [])
		.then(function(res) {
			if (callback)
				callback(null, res);
			
			return res;
		});
		
		return promise;
	}
	
	getNextOrderId(callback){
		var self = this;
		var session = this.session;

		var contractinstance = this.getContractInstance();

		var promise = contractinstance.method_call("next_orderid", [])
		.then(function(res) {
			if (callback)
				callback(null, res);
			
			return res;
		});
		
		return promise;
	}
	
	getLedgerName(callback){
		var self = this;
		var session = this.session;

		var contractinstance = this.getContractInstance();

		var promise = contractinstance.method_call("ledger_name", [])
		.then(function(res) {
			if (callback)
				callback(null, res);
			
			return res;
		});
		
		return promise;
	}
	
	getCoCryptedLedgerDescription(callback){
		var self = this;
		var session = this.session;

		var contractinstance = this.getContractInstance();

		var promise = contractinstance.method_call("cocrypted_ledger_description", [])
		.then(function(res) {
			if (callback)
				callback(null, res);
			
			return res;
		});
		
		return promise;
	}
	
	getOwner(callback){
		var self = this;
		var session = this.session;

		var contractinstance = this.getContractInstance();

		var promise = contractinstance.method_call("owner", [])
		.then(function(res) {
			if (callback)
				callback(null, res);
			
			return res;
		});
		
		return promise;
	}
	
	getOwnerPublicKey(callback){
		var self = this;
		var session = this.session;

		var contractinstance = this.getContractInstance();

		var promise = contractinstance.method_call("owner_pubkey", [])
		.then(function(res) {
			if (callback)
				callback(null, res);
			
			return res;
		});
		
		return promise;
	}
	

	// accounts
	registerAccount(_acct_address, _rsa_pubkey, _ece_pubkey, _cocrypted_acct_privkey,
			payingaccount, gas, gasPrice,
			transactionuuid, callback) {
		var self = this;
		var session = this.session;

		var fromaddress = payingaccount.getAddress();
		
		console.log('StockLedgerContractInterface.registerAccount called for ' + _acct_address + " from " + fromaddress + " with gas limit " + gas + " and gasPrice " + gasPrice);
		
		var contractinstance = this.getContractInstance();

		/*var params = [];
		
		params.push(_acct_address);
		params.push(_rsa_pubkey);
		params.push(_ece_pubkey);
		params.push(_cocrypted_acct_privkey);
		
		var value = null;
		var txdata = null;
		var nonce = null;*/
		
		var contracttransaction = contractinstance.getContractTransactionObject(payingaccount, gas, gasPrice);
		
		var args = [];

		args.push(_acct_address);
		args.push(_rsa_pubkey);
		args.push(_ece_pubkey);
		args.push(_cocrypted_acct_privkey);
		
		contracttransaction.setArguments(args);
		
		contracttransaction.setContractTransactionUUID(transactionuuid);

		contracttransaction.setMethodName('registerAccount');

		//var promise = contractinstance.method_sendTransaction('registerAccount', params, payingaccount, value, gas, gasPrice, txdata, nonce, callback)
		
		var promise = contractinstance.method_send(contracttransaction, callback)
		.then(function(res) {
			console.log('StockLedgerContractInterface.registerAccount promise of publish should be resolved');
			
			return res;
		});
		
		return promise;
	}
	
	getAccountCount(callback){
		var self = this;
		var session = this.session;

		var contractinstance = this.getContractInstance();

		var promise = contractinstance.method_call("getAccountCount", [])
		.then(function(res) {
			if (callback)
				callback(null, res);
			
			return res;
		});
		
		return promise;
	}
	
	getAccountAt(index, callback) {
		var self = this;
		var session = this.session;
		
		var contractinstance = this.getContractInstance();
		var params = [];
		
		params.push(index);
		
		var promise = contractinstance.method_call("getAccountAt", params)
		.then(function(res_array) {
			
			if (!res_array) {
				if (callback)
					callback('no result returned in getAccountAt', null);
				
				return;
			}
			
			var ret = [];
			ret['acct_address'] = (res_array && res_array[0] ? res_array[0] : null);
			ret['rsa_pubkey'] = (res_array && res_array[1] ? res_array[1] : null);
			ret['ece_pubkey'] = (res_array && res_array[2] ? res_array[2] : null);
			ret['cocrypted_acct_privkey'] = (res_array && res_array[3] ? res_array[3] : null);

			if (callback)
				callback(null, ret);
			
			return ret;
		});
		
		return promise
	}

	// stakeholders
	registerStakeHolder(_shldr_address, _shldr_rsa_pubkey, _cocrypted_shldr_privkey, _cocrypted_shldr_identifier, 
			_registration_date,	_creatoraddress, _crtcrypted_shldr_description_string, _crtcrypted_shldr_identifier,
			_orderid, _signature, _shldrcrypted_shldr_description_string, _shldrcrypted_shldr_identifier,
			payingaccount, gas, gasPrice,
			transactionuuid, callback) {
		
		var self = this;
		var session = this.session;

		var fromaddress = payingaccount.getAddress();
		
		console.log('StockLedgerContractInterface.registerStakeHolder called for ' + _orderid + " from " + fromaddress + " with gas limit " + gas + " and gasPrice " + gasPrice);
		
		var contractinstance = this.getContractInstance();

		/*var params = [];
		
		params.push(_shldr_address);
		params.push(_shldr_rsa_pubkey);
		params.push(_cocrypted_shldr_privkey);
		params.push(_cocrypted_shldr_identifier);
		params.push(_registration_date);
		params.push(_creatoraddress);
		params.push(_crtcrypted_shldr_description_string);
		params.push(_crtcrypted_shldr_identifier);
		params.push(_orderid);
		params.push(_signature);
		params.push(_shldrcrypted_shldr_description_string);
		params.push(_shldrcrypted_shldr_identifier);

		var value = null;
		var txdata = "orderid=" + _orderid;
		var nonce = null;*/
		
		var contracttransaction = contractinstance.getContractTransactionObject(payingaccount, gas, gasPrice);
		
		var args = [];

		args.push(_shldr_address);
		args.push(_shldr_rsa_pubkey);
		args.push(_cocrypted_shldr_privkey);
		args.push(_cocrypted_shldr_identifier);
		args.push(_registration_date);
		args.push(_creatoraddress);
		args.push(_crtcrypted_shldr_description_string);
		args.push(_crtcrypted_shldr_identifier);
		args.push(_orderid);
		args.push(_signature);
		args.push(_shldrcrypted_shldr_description_string);
		args.push(_shldrcrypted_shldr_identifier);

		contracttransaction.setArguments(args);
		
		contracttransaction.setData("orderid=" + _orderid);
		
		contracttransaction.setContractTransactionUUID(transactionuuid);

		contracttransaction.setMethodName('registerShareHolder');
		
		//var promise = contractinstance.method_sendTransaction('registerShareHolder', params, payingaccount, value, gas, gasPrice, txdata, nonce, callback)
		var promise = contractinstance.method_send(contracttransaction, callback)
		.then(function(res) {
			console.log('StockLedgerContractInterface.registerStakeHolder promise of publish should be resolved');
			
			return res;
		});
		
	}
	
	getShareHolderCount(callback){
		var self = this;
		var session = this.session;

		var contractinstance = this.getContractInstance();

		var promise = contractinstance.method_call("getShareHolderCount", [])
		.then(function(res) {
			if (callback)
				callback(null, res);
			
			return res;
		});
		
		return promise;
	}
	
	getShareHolderAt(index, callback) {
		var self = this;
		var session = this.session;
		
		var contractinstance = this.getContractInstance();
		var params = [];
		
		params.push(index);
		
		var promise = contractinstance.method_call("getShareHolderAt", params)
		.then(function(res_array) {
			
			if (!res_array) {
				if (callback)
					callback('no result returned in getShareHolderAt', null);
				
				return;
			}
			
			var ret = [];
			ret['address'] = (res_array && res_array[0] ? res_array[0] : null);
			ret['shldr_rsa_pubkey'] = (res_array && res_array[1] ? res_array[1] : null);
			ret['cocrypted_shldr_privkey'] = (res_array && res_array[2] ? res_array[2] : null);
			ret['cocrypted_shldr_identifier'] = (res_array && res_array[3] ? res_array[3] : null);
			ret['registration_date'] = (res_array && res_array[4] ? res_array[4] : null);
			ret['block_date'] = (res_array && res_array[5] ? res_array[5] : null);

			if (callback)
				callback(null, ret);
			
			return ret;
		});
		
		return promise
	}

	getShareHolderExtraAt(index, callback) {
		var self = this;
		var session = this.session;
		
		var contractinstance = this.getContractInstance();
		var params = [];
		
		params.push(index);
		
		var promise = contractinstance.method_call("getShareHolderExtraAt", params)
		.then(function(res_array) {
			
			if (!res_array) {
				if (callback)
					callback('no result returned in getShareHolderExtraAt', null);
				
				return;
			}
			
			var ret = [];
			ret['creator'] = (res_array && res_array[0] ? res_array[0] : null);
			ret['crtcrypted_shldr_description_string'] = (res_array && res_array[1] ? res_array[1] : null);
			ret['crtcrypted_shldr_identifier'] = (res_array && res_array[2] ? res_array[2] : null);
			ret['orderid'] = (res_array && res_array[3] ? res_array[3] : null);
			ret['signature'] = (res_array && res_array[4] ? res_array[4] : null);
			ret['shldrcrypted_shldr_description'] = (res_array && res_array[5] ? res_array[5] : null);
			ret['shldrcrypted_shldr_identifier'] = (res_array && res_array[6] ? res_array[6] : null);

			if (callback)
				callback(null, ret);
			
			return ret;
		});
		
		return promise
	}

	// issuances
	registerIssuance(_name, _cocrypted_issuance_description, _numberofshares, _percentofcapital, 
			_registration_date, _orderid, _signature, _type, _code,
			payingaccount, gas, gasPrice,
			transactionuuid, callback) {
		var self = this;
		var session = this.session;
		
		var fromaddress = payingaccount.getAddress();
		
		console.log('StockLedgerContractInterface.registerIssuance called for ' + _name + " from " + fromaddress + " with gas limit " + gas + " and gasPrice " + gasPrice);
		
		var contractinstance = this.getContractInstance();

		/*var params = [];
		
		params.push(_name);
		params.push(_cocrypted_issuance_description);
		params.push(_numberofshares);
		params.push(_percentofcapital);
		params.push(_registration_date);
		params.push(_orderid);
		params.push(_signature);
		params.push(_type);
		params.push(_code);

		var value = null;
		var txdata = "orderid=" + _orderid;
		var nonce = null;*/
		
		var contracttransaction = contractinstance.getContractTransactionObject(payingaccount, gas, gasPrice);
		
		var args = [];

		args.push(_name);
		args.push(_cocrypted_issuance_description);
		args.push(_numberofshares);
		args.push(_percentofcapital);
		args.push(_registration_date);
		args.push(_orderid);
		args.push(_signature);
		args.push(_type);
		args.push(_code);

		contracttransaction.setArguments(args);
		
		contracttransaction.setData("orderid=" + _orderid);
		
		contracttransaction.setContractTransactionUUID(transactionuuid);

		contracttransaction.setMethodName('registerIssuance');
		
		//var promise = contractinstance.method_sendTransaction('registerIssuance', params, payingaccount, value, gas, gasPrice, txdata, nonce, callback)
		var promise = contractinstance.method_send(contracttransaction, callback)
		.then(function(res) {
			console.log('StockLedgerContractInterface.registerIssuance promise of publish should be resolved');
			
			return res;
		});
	}
	
	getIssuanceCount(callback){
		var self = this;
		var session = this.session;

		var contractinstance = this.getContractInstance();

		var promise = contractinstance.method_call("getIssuanceCount", [])
		.then(function(res) {
			if (callback)
				callback(null, res);
			
			return res;
		});
		
		return promise;
	}
	
	getIssuanceAt(index, callback) {
		var self = this;
		var session = this.session;
		
		var contractinstance = this.getContractInstance();
		var params = [];
		
		params.push(index);
		
		var promise = contractinstance.method_call("getIssuanceAt", params)
		.then(function(res_array) {
			
			if (!res_array) {
				if (callback)
					callback('no result returned in getIssuanceAt', null);
				
				return;
			}
			
			var ret = [];
	    	ret['numberofshares'] = res_array[0];
	    	ret['percentofcapital'] = res_array[1]; 
	    	ret['issuance_date'] = res_array[2]; 
	    	ret['block_date'] = res_array[3]; 
	    	ret['name'] = res_array[4]; 
	    	ret['cocrypted_description'] = res_array[5]; 
	    	ret['cancel_date'] = res_array[6]; 
	    	ret['cancel_block_date'] = res_array[7];
	    	
	    	ret['orderid'] = res_array[8]; 
	    	ret['signature'] = res_array[9]; 

			if (callback)
				callback(null, ret);
			
			return ret;
		});
		
		return promise
	}

	getIssuanceExtraAt(index, callback) {
		var self = this;
		var session = this.session;
		
		var contractinstance = this.getContractInstance();
		var params = [];
		
		params.push(index);
		
		var promise = contractinstance.method_call("getIssuanceExtraAt", params)
		.then(function(res_array) {
			
			if (!res_array) {
				if (callback)
					callback('no result returned in getIssuanceExtraAt', null);
				
				return;
			}
			
			var ret = [];
			ret['type'] = res_array[0];
			ret['code'] = res_array[1]; 

			if (callback)
				callback(null, ret);
			
			return ret;
		});
		
		return promise
	}

	// transactions
	registerTransaction(_numberofshares, _from, _to, _nature, _issuancenumber, _orderid, 
			_registration_date, _consideration, _currency, _creatoraddress, _signature,
			payingaccount, gas, gasPrice,
			transactionuuid, callback) {
		var self = this;
		var session = this.session;
		
		var fromaddress = payingaccount.getAddress();
		
		console.log('StockLedger.registerTransaction called for ' + _numberofshares + " shares from " + fromaddress + " with gas limit " + gas + " and gasPrice " + gasPrice);
		
		var contractinstance = this.getContractInstance();

		/*var params = [];
		
		params.push(_numberofshares);
		params.push(_from);
		params.push(_to);
		params.push(_nature);
		params.push(_issuancenumber);
		params.push(_orderid);
		params.push(_registration_date);
		params.push(_consideration);
		params.push(_currency);
		params.push(_creatoraddress);
		params.push(_signature);

		var value = null;
		var txdata = "orderid=" + _orderid;
		var nonce = null;*/
		
		var contracttransaction = contractinstance.getContractTransactionObject(payingaccount, gas, gasPrice);
		
		var args = [];

		args.push(_numberofshares);
		args.push(_from);
		args.push(_to);
		args.push(_nature);
		args.push(_issuancenumber);
		args.push(_orderid);
		args.push(_registration_date);
		args.push(_consideration);
		args.push(_currency);
		args.push(_creatoraddress);
		args.push(_signature);

		contracttransaction.setArguments(args);
		
		contracttransaction.setData("orderid=" + _orderid);
		
		contracttransaction.setContractTransactionUUID(transactionuuid);

		contracttransaction.setMethodName('registerTransaction');
		
		//var promise = contractinstance.method_sendTransaction('registerTransaction', params, payingaccount, value, gas, gasPrice, txdata, nonce, callback)
		var promise = contractinstance.method_send(contracttransaction, callback)
		.then(function(res) {
			console.log('StockLedgerContractInterface.registerTransaction promise of publish should be resolved');
			
			return res;
		});
	}
	
	getTransactionCount(callback){
		var self = this;
		var session = this.session;

		var contractinstance = this.getContractInstance();

		var promise = contractinstance.method_call("getTransactionCount", [])
		.then(function(res) {
			if (callback)
				callback(null, res);
			
			return res;
		});
		
		return promise;
	}
	
	getTransactionAt(index, callback) {
		var self = this;
		var session = this.session;
		
		var contractinstance = this.getContractInstance();
		var params = [];
		
		params.push(index);
		
		var promise = contractinstance.method_call("getTransactionAt", params)
		.then(function(res_array) {
			
			if (!res_array) {
				if (callback)
					callback('no result returned in getTransactionAt', null);
				
				return;
			}
			
			var ret = [];
	    	ret['from'] = res_array[0];
	    	ret['to'] = res_array[1];
			
	    	ret['transactiondate'] = res_array[2]; // unix time
	    	ret['block_date'] = res_array[3]; 
			
	    	ret['nature'] = res_array[4]; // 0 creation, 1 registered transfer, 2 shareholder record (e.g. signed endorsement)
			
	    	ret['issuancenumber'] = res_array[5]; // 1 based
	    	ret['orderid'] = res_array[6]; // unique, provided by caller

	    	ret['numberofshares'] = res_array[7];
			
	    	ret['consideration'] = res_array[8];
	    	ret['currency'] = res_array[9];
	    	
	    	ret['creator'] = res_array[10];
	    	ret['signature'] = res_array[11];

			if (callback)
				callback(null, ret);
			
			return ret;
		});
		
		return promise
	}

}


if ( typeof GlobalClass !== 'undefined' && GlobalClass )
	GlobalClass.registerModuleClass('securities', 'StockLedgerContractInterface', StockLedgerContractInterface);
else
	module.exports = StockLedgerContractInterface; // we are in node js