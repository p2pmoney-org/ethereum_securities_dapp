/**
 * 
 */
'use strict';

class StockIssuance{
	constructor(session) {
		this.session = session;
		
		// local data
		this.local_issuance_name = null;
		this.local_issuance_description = null;
		
		this.local_numberofshares = null;
		this.local_percentofcapital = null;

		// blockchain data
		this.position = -1; // position in contract internal struct array

		this.numberofshares = null;
		this.percentofcapital = null;
		
		this.issuance_date = null; // unix time
		this.block_date = null; // now in block number
	    
		this.name = null;
		this.cocrypted_description = null;
		
		this.cancel_date = null; // unix time
		this.cancel_block_date = null; // now in block number
		
		// operation variables
		this.issuanceindex = null;
	}
	
	isLocalOnly() {
		return (this.position == -1)
	}
	
	getLocalJson() {
		var name = this.local_issuance_name;
		var description = this.local_issuance_description;
		var numberofshares = this.local_numberofshares;
		var percentofcapital = this.local_percentofcapital;
		
		var json = {name: name, description: description, numberofshares: numberofshares, percentofcapital: percentofcapital};
		
		return json;
	}
	
	getIssuanceIndex() {
		return this.issuanceindex;
	}
	
	setIssuanceIndex(index) {
		this.issuanceindex = index;
	}
	
	// local data
	getLocalName() {
		return this.local_issuance_name;
	}
	
	setLocalName(name) {
		this.local_issuance_name = name;
	}
	
	getLocalDescription() {
		return this.local_issuance_description;
	}
	
	setLocalDescription(description) {
		this.local_issuance_description = description;
	}
	
	getLocalNumberOfShares() {
		return this.local_numberofshares;
	}
	
	setLocalNumberOfShares(numberofshares) {
		this.local_numberofshares = numberofshares;
	}
	
	getLocalPercentOfCapital() {
		return this.local_percentofcapital;
	}
	
	setLocalPercentOfCapital(percentofcapital) {
		this.local_percentofcapital = percentofcapital;
	}
	
	// chain data
	getChainPosition() {
		return this.position;
	}
	
	setChainPosition(pos) {
		this.position = pos;
	}
	
	getChainNumber() {
		return this.position + 1; // 1 based
	}
	
	getChainNumberOfShares() {
		return this.numberofshares;
	}
	
	setChainNumberOfShares(numberofshares) {
		this.numberofshares = numberofshares;
	}

	getChainPercentOfCapital() {
		return this.percentofcapital;
	}
	
	setChainPercentOfCapital(percentofcapital) {
		this.percentofcapital = percentofcapital;
	}

	getChainIssuanceDate() {
		return this.issuance_date;
	}
	
	setChainIssuanceDate(issuance_date) {
		this.issuance_date = issuance_date;
	}

	getChainIssuanceBlockDate() {
		return this.block_date;
	}
	
	setChainIssuanceBlockDate(block_date) {
		this.block_date = block_date;
	}

	getChainName() {
		return this.name;
	}
	
	setChainName(name) {
		this.name = name;
	}

	getChainCocryptedDescription() {
		return this.cocrypted_description;
	}
	
	setChainCocryptedDescription(cocrypted_description) {
		this.cocrypted_description = cocrypted_description;
	}

	getChainCancelDate() {
		return this.cancel_date;
	}
	
	setChainCancelDate(cancel_date) {
		this.cancel_date = cancel_date;
	}

	getChainCancelBlockDate() {
		return this.cancel_block_date;
	}
	
	setChainCancelBlockDate(cancel_block_date) {
		this.cancel_block_date = cancel_block_date;
	}

	
	
	// static
	static getStockIssuancesFromJsonArray(session, jsonarray) {
		var array = [];
		
		if (!jsonarray)
			return array;
		
		for (var i = 0; i < jsonarray.length; i++) {
			var name = jsonarray[i]['name'];
			var description = jsonarray[i]['description'];
			var numberofshares = jsonarray[i]['numberofshares'];
			var percentofcapital = jsonarray[i]['percentofcapital'];

			var stockissuance = session.createBlankStockIssuanceObject();
			
			stockissuance.setLocalName(name);
			stockissuance.setLocalDescription(description);
			stockissuance.setLocalNumberOfShares(numberofshares);
			stockissuance.setLocalPercentOfCapital(percentofcapital);
			
			array.push(stockissuance);
		}
		
		return array;
	}
}


if ( typeof GlobalClass !== 'undefined' && GlobalClass )
GlobalClass.StockIssuance = StockIssuance;
else
module.exports = StockIssuance; // we are in node js
