'use strict';

class StockLedgerContractInterface {
	
	constructor(session, contractaddress) {
		this.session = session;
		this.address = contractaddress;
		
		// operating variables
		this.finalized_init = null;
		
		this.contractinstance = null;
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
		
		this.contractinstance = this.session.getContractInstance(this.address, './contracts/StockLedger.json');
		
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
			payingaccount, owningaccount, gas, gasPrice, callback) {
		var self = this;
		var session = this.session;

		var fromaddress = payingaccount.getAddress();
		
		console.log('StockLedgerContractInterface.deploy called for ' + this.localledgerdescription + " from " + fromaddress + " with gas limit " + gas + " and gasPrice " + gasPrice);
		
		
		// we validate the transaction
		if (!this.validateInstanceDeployment(payingaccount, owningaccount, gas, gasPrice, callback))
			return;
		
		var contractinstance = this.getContractInstance();
		
		var params = [];
		
		params.push(contractowner);
		params.push(contractownerpublkey);
		params.push(cryptedowneridentifier);
		params.push(ledgername);
		params.push(cryptedledgerdescription);

		var promise = contractinstance.contract_new(params, payingaccount, gas, gasPrice)
		.then(function(res) {
			console.log('StockLedgerContractInterface.deploy promise of deployment should be resolved');
			
			self.setAddress(contractinstance.getAddress());
			
			if (callback)
				callback(null, res);
			
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
			payingaccount, gas, gasPrice, callback) {
		var self = this;
		var session = this.session;

		var fromaddress = payingaccount.getAddress();
		
		console.log('StockLedgerContractInterface.registerAccount called for ' + _acct_address + " from " + fromaddress + " with gas limit " + gas + " and gasPrice " + gasPrice);
		
		var contractinstance = this.getContractInstance();

		var params = [];
		
		params.push(_acct_address);
		params.push(_rsa_pubkey);
		params.push(_ece_pubkey);
		params.push(_cocrypted_acct_privkey);
		
		var value = null;
		var txdata = null;
		var nonce = null;
		
		var promise = contractinstance.method_sendTransaction('registerAccount', params, payingaccount, value, gas, gasPrice, txdata, nonce, callback)
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
		.then(function(res) {
			
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
			payingaccount, gas, gasPrice, callback) {
		
		var self = this;
		var session = this.session;

		var fromaddress = payingaccount.getAddress();
		
		console.log('StockLedgerContractInterface.registerStakeHolder called for ' + _orderid + " from " + fromaddress + " with gas limit " + gas + " and gasPrice " + gasPrice);
		
		var contractinstance = this.getContractInstance();

		var params = [];
		
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
		var nonce = null;
		
		var promise = contractinstance.method_sendTransaction('registerShareHolder', params, payingaccount, value, gas, gasPrice, txdata, nonce, callback)
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
		.then(function(res) {
			
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
		.then(function(res) {
			
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
			payingaccount, gas, gasPrice, callback) {
		var self = this;
		var session = this.session;
		
		var fromaddress = payingaccount.getAddress();
		
		console.log('StockLedgerContractInterface.registerIssuance called for ' + _name + " from " + fromaddress + " with gas limit " + gas + " and gasPrice " + gasPrice);
		
		var contractinstance = this.getContractInstance();

		var params = [];
		
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
		var nonce = null;
		
		var promise = contractinstance.method_sendTransaction('registerIssuance', params, payingaccount, value, gas, gasPrice, txdata, nonce, callback)
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
		.then(function(res) {
			
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
		.then(function(res) {
			
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
			payingaccount, gas, gasPrice, callback) {
		var self = this;
		var session = this.session;
		
		var fromaddress = payingaccount.getAddress();
		
		console.log('StockLedger.registerTransaction called for ' + _numberofshares + " shares from " + fromaddress + " with gas limit " + gas + " and gasPrice " + gasPrice);
		
		var contractinstance = this.getContractInstance();

		var params = [];
		
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
		var nonce = null;
		
		var promise = contractinstance.method_sendTransaction('registerTransaction', params, payingaccount, value, gas, gasPrice, txdata, nonce, callback)
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
		.then(function(res) {
			
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