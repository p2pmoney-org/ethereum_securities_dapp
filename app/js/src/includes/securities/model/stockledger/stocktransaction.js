/**
 * 
 */
'use strict';

class StockTransaction {
	constructor(session, stockledger) {
		this.session = session;
		this.stockledger = stockledger;
		
		this.uuid = null;

		this.status = Securities.STATUS_LOCAL;

		// local data
		this.local_from = null
		this.local_to = null;

		this.local_nature = null; 

		this.local_issuancenumber = null; // 1 based
		
		this.local_numberofshares = null;
		
		this.local_consideration = null;
		this.local_currency = null;
		
		this.local_orderid = null;

		this.local_creation_date = new Date().getTime();
		this.local_submission_date = null;
		

		// blockchain data
		this.position = -1; // position in contract internal struct array

		this.from = null;
		this.to = null;
		
		this.transactiondate = null; // unix time
		this.block_date = null; 
		
		this.nature = null; // 0 creation, 1 registered transfer, 2 shareholder record (e.g. signed endorsement)

		this.issuancenumber = null; // 1 based
		
		this.creator = null; // can be owner, or a seller of shares

		this.orderid = null; // unique, provided by contract
		this.signature = null; 

    	this.numberofshares = null;
		
		this.consideration = null;
		this.currency = null;
		
		// operations
		this.transactionindex = null;

	}
	
	getStockLedgerObject() {
		return this.stockledger;
	}
	
	getUUID() {
		if (this.uuid)
			return this.uuid;
		
		this.uuid = this.session.getUUID();
		
		return this.uuid;
	}
	
	isLocalOnly() {
		//return (this.position == -1)
		return ((this.status != Securities.STATUS_ON_CHAIN) && (this.local_orderid == null));
	}
	
	isLocal() {
		return (this.status != Securities.STATUS_ON_CHAIN);
	}
	
	isOnChain() {
		return (this.status == Securities.STATUS_ON_CHAIN);
	}
	
	getStatus() {
		return this.status;
	}
	
	setStatus(status) {
		switch(status) {
			case Securities.STATUS_LOST:
			case Securities.STATUS_NOT_FOUND:
			case Securities.STATUS_LOCAL:
			case Securities.STATUS_SENT:
			case Securities.STATUS_PENDING:
			case Securities.STATUS_DEPLOYED:
			case Securities.STATUS_CANCELLED:
			case Securities.STATUS_REJECTED:
			case Securities.STATUS_ON_CHAIN:
				this.status = status;
				break;
			default:
				// do not change for a unknown status
				break;
		}
	}
	
	getLocalJson() {
		var uuid = this.getUUID();
		var status = this.getStatus();

		var from = this.local_from;
		var to = this.local_to;
		
		var issuancenumber = this.local_issuancenumber;
		
		var numberofshares = this.local_numberofshares;
		
		var consideration = this.local_consideration;
		var currency = this.local_currency;
		
		var orderid = this.local_orderid;
		
		var creationdate= this.getLocalCreationDate();
		var submissiondate= this.getLocalSubmissionDate();

		var json = {uuid: uuid, status: status, 
				creationdate: creationdate, submissiondate: submissiondate, orderid: orderid, 
				from: from, to: to, issuancenumber: issuancenumber, numberofshares: numberofshares, consideration: consideration, currency: currency};
		
		return json;
	}
	
	copy(orgObj) {

		// blockchain data
		this.position = orgObj.position; 

		this.from = orgObj.from;
		this.to = orgObj.to;
		
		this.transactiondate = orgObj.transactiondate; 
		this.block_date = orgObj.block_date; 
		
		this.nature = orgObj.nature; 

		this.issuancenumber = orgObj.issuancenumber; 
		
		this.creator = orgObj.creator; 

		this.orderid = orgObj.orderid; 
		this.signature = orgObj.signature; 

    	this.numberofshares = orgObj.numberofshares;
		
		this.consideration = orgObj.consideration;
		this.currency = orgObj.currency;
	}
		
	initFromLocalJson(json) {
		var status = (json['status'] ? json['status'] : Securities.STATUS_LOCAL);
		
		var from = json['from'];
		var to = json['to'];
		var issuancenumber = json['issuancenumber'];
		var numberofshares = json['numberofshares'];
		var consideration = json['consideration'];
		var currency = json['currency'];

		if (json["uuid"])
			this.uuid = json["uuid"];
		
		var orderid = (json['orderid'] ? json['orderid'] : null);

		this.setStatus(status);

		this.setLocalFrom(from);
		this.setLocalTo(to);
		this.setLocalIssuanceNumber(issuancenumber);
		this.setLocalNumberOfShares(numberofshares);
		this.setLocalConsideration(consideration);
		this.setLocalCurrency(currency);
		
		this.setLocalOrderId(orderid);
		
		if (json["creationdate"])
			this.setLocalCreationDate(json["creationdate"]);
			
		if (json["submissiondate"])
			this.setLocalSubmissionDate(json["submissiondate"]);
			
	}

	saveLocalJson() {
		var persistor = this.getStockLedgerObject().getContractLocalPersistor();
		
		persistor.saveStockTransactionJson(this);
	}
	
		
	getTransactionIndex() {
		return this.transactionindex;
	}
	
	setTransactionIndex(index) {
		this.transactionindex = index;
	}
	
	// local data
	getLocalFrom() {
		return this.local_from;
	}
	
	setLocalFrom(from) {
		this.local_from = from;
	}
	
	getLocalTo() {
		return this.local_to;
	}
	
	setLocalTo(to) {
		this.local_to = to;
	}
	
	getLocalNature() {
		return this.local_nature;
	}
	
	setLocalNature(nature) {
		this.local_nature = nature;
	}
	
	getLocalIssuanceNumber() {
		return this.local_issuancenumber;
	}
	
	setLocalIssuanceNumber(number) {
		if (number < 1)
			throw 'Issuance number are 1 based';
		
		this.local_issuancenumber = number;
	}
	
	getLocalNumberOfShares() {
		return this.local_numberofshares;
	}
	
	setLocalNumberOfShares(numberofshares) {
		this.local_numberofshares = numberofshares;
	}
	
	getLocalConsideration() {
		return this.local_consideration;
	}
	
	setLocalConsideration(consideration) {
		this.local_consideration = consideration;
	}
	
	getLocalCurrency() {
		return this.local_currency;
	}
	
	setLocalCurrency(currency) {
		this.local_currency = currency;
	}
	
	getLocalOrderId() {
		return this.local_orderid;
	}
	
	setLocalOrderId(orderid) {
		this.local_orderid = orderid;
	}
	
	getLocalCreationDate() {
		return this.local_creation_date;
	}
	
	setLocalCreationDate(creation_date) {
		this.local_creation_date = creation_date;
	}
	
	getLocalSubmissionDate() {
		return this.local_submission_date;
	}
	
	setLocalSubmissionDate(submission_date) {
		this.local_submission_date = submission_date;
	}
	
	// chain data
	getChainPosition() {
		return this.position;
	}
	
	setChainPosition(pos) {
		this.position = pos;
	}
	
	getChainFrom() {
		return this.from;
	}
	
	setChainFrom(from) {
		this.from = from;
	}
	
	getChainTo() {
		return this.to;
	}
	
	setChainTo(to) {
		this.to = to;
	}
	
	getChainTransactionDate() {
		return this.transactiondate;
	}
	
	setChainTransactionDate(date) {
		this.transactiondate = date;
	}
	
	getChainBlockDate() {
		return this.blockdate;
	}
	
	setChainBlockDate(date) {
		this.blockdate = date;
	}
	
	getChainNature() {
		return this.nature;
	}
	
	setChainNature(nature) {
		this.nature = nature;
	}
	
	getChainIssuanceNumber() {
		return this.issuancenumber;
	}
	
	setChainIssuanceNumber(issuancenumber) {
		this.issuancenumber = issuancenumber;
	}
	
	getChainNumberOfShares() {
		return this.numberofshares;
	}
	
	setChainNumberOfShares(numberofshares) {
		this.numberofshares = numberofshares;
	}
	
	getChainConsideration() {
		return this.consideration;
	}
	
	setChainConsideration(consideration) {
		this.consideration = consideration;
	}
	
	getChainCurrency() {
		return this.currency;
	}
	
	setChainCurrency(currency) {
		this.currency = currency;
	}
	
	getChainCreatorAddress() {
		return this.creator;
	}
	
	setChainCreatorAddress(creator) {
		this.creator = creator;
	}
	
	getChainOrderId() {
		return this.orderid;
	}
	
	setChainOrderId(orderid) {
		this.orderid = orderid;
	}
	
	getChainSignature() {
		return this.signature;
	}
	
	setChainSignature(signature) {
		this.signature = signature;
	}

	// static
	static getStockTransactionsFromJsonArray(module, session, stockledger, jsonarray) {
		var array = [];
		
		if (!jsonarray)
			return array;
		
		for (var i = 0; i < jsonarray.length; i++) {
			var stocktransaction= module.createBlankStockTransactionObject(session, stockledger);
			
			stocktransaction.initFromLocalJson(jsonarray[i]);
			
			array.push(stocktransaction);
		}
		
		return array;
	}
}


if ( typeof GlobalClass !== 'undefined' && GlobalClass )
	GlobalClass.registerModuleClass('securities', 'StockTransaction', StockTransaction);
else
	module.exports = StockTransaction; // we are in node js

