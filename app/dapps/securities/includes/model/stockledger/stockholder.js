/**
 * 
 */
'use strict';

class StockHolder extends StakeHolder {
	constructor(session, stockledger, address) {
		super(session, address);
		
		this.stockledger = stockledger;
	}
	
	copy(orgObj) {
		StakeHolder.prototype.copy.call(this, orgObj); // to keep this context
		
		this.stockledger = orgObj.stockledger;
	}
	
	getStockLedgerObject() {
		return this.stockledger;
	}
	
	initFromLocalJson(json) {
		var identifier = json['identifier'];
		var orderid = json['orderid'];
		
		var status = (json['status'] ? json['status'] : Securities.STATUS_LOCAL);
		
		if (json["uuid"])
			this.uuid = json["uuid"];
		
		this.setStatus(status);
		this.setLocalIdentifier(identifier);
		this.setLocalOrderId(orderid);
		
		if (json["creationdate"])
			this.setLocalCreationDate(json["creationdate"]);
			
		if (json["submissiondate"])
			this.setLocalSubmissionDate(json["submissiondate"]);
			
	}

	saveLocalJson(callback) {
		var persistor = this.getStockLedgerObject().getContractLocalPersistor();
		
		persistor.saveStockHolderJson(this, callback);
	}
	
		
	// functions on share position



	// static
	static getStockHoldersFromJsonArray(module, session, stockledger, jsonarray) {
		var array = [];
		
		if (!jsonarray)
			return array;
		
		for (var i = 0; i < jsonarray.length; i++) {
			if (!jsonarray[i])
				continue;
			
			var stockholder = module.createBlankStockHolderObject(session, stockledger);
			
			stockholder.initFromLocalJson(jsonarray[i]);
			
			array.push(stockholder);
		}
		
		return array;
	}
}

if ( typeof GlobalClass !== 'undefined' && GlobalClass )
	GlobalClass.registerModuleClass('securities', 'StockHolder', StockHolder);
else
	module.exports = StockHolder; // we are in node js

