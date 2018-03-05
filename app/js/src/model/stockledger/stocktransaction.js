/**
 * 
 */
'use strict';

class StockTransaction {
	constructor(global) {
		this.global = global;
		
		// local data
		this.local_from = null
		this.local_to = null;

		this.local_nature = null; 

		this.local_issuancenumber = null; // 1 based
		
		this.local_numberofshares = null;
		
		this.local_consideration = null;
		this.local_currency = null;

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
	
	isLocalOnly() {
		return (this.position == -1)
	}
	
	getLocalJson() {
		var from = this.local_from;
		var to = this.local_to;
		
		var issuancenumber = this.local_issuancenumber;
		
		var numberofshares = this.local_numberofshares;
		
		var consideration = this.local_consideration;
		var currency = this.local_currency;
		
		var json = {from: from, to: to, issuancenumber: issuancenumber, numberofshares: numberofshares, consideration: consideration, currency: currency};
		
		return json;
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
	static getStockTransactionsFromJsonArray(global, jsonarray) {
		var array = [];
		
		if (!jsonarray)
			return array;
		
		for (var i = 0; i < jsonarray.length; i++) {
			var from = jsonarray[i]['from'];
			var to = jsonarray[i]['to'];
			var issuancenumber = jsonarray[i]['issuancenumber'];
			var numberofshares = jsonarray[i]['numberofshares'];
			var consideration = jsonarray[i]['consideration'];
			var currency = jsonarray[i]['currency'];

			var stocktransaction= global.createBlankStockTransactionObject();
			
			stocktransaction.setLocalFrom(from);
			stocktransaction.setLocalTo(to);
			stocktransaction.setLocalIssuanceNumber(issuancenumber);
			stocktransaction.setLocalNumberOfShares(numberofshares);
			stocktransaction.setLocalConsideration(consideration);
			stocktransaction.setLocalCurrency(currency);
			
			array.push(stocktransaction);
		}
		
		return array;
	}
}


if ( typeof GlobalClass !== 'undefined' && GlobalClass )
GlobalClass.StockTransaction = StockTransaction;
else
module.exports = StockTransaction; // we are in node js
