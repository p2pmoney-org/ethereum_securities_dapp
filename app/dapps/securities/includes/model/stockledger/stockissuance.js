/**
 * 
 */
'use strict';

class StockIssuance{
	constructor(session, stockledger) {
		this.session = session;
		this.stockledger = stockledger;
		
		this.uuid = null;

		this.status = Securities.STATUS_LOCAL;

		// local data
		this.local_issuance_name = null;
		this.local_issuance_description = null;
		
		this.local_code = null;
		
		this.local_numberofshares = null;
		this.local_percentofcapital = null;
		
		this.local_orderid = null;

		this.local_creation_date = new Date().getTime();
		this.local_submission_date = null;
		

		// blockchain data
		this.position = -1; // position in contract internal struct array

		this.numberofshares = null;
		this.percentofcapital = null;
		
		this.issuance_date = null; // unix time
		this.block_date = null; // now in block number
	    
		this.name = null;
		this.cocrypted_description = null;
		
		this.type = 'stock';
		this.code = null;
		
		this.cancel_date = null; // unix time
		this.cancel_block_date = null; // now in block number
		
		this.orderid = null; // unique, provided by contract
		this.signature = null; 

    	// operation variables
		this.issuanceindex = null;
	}
	
	getSessionObject() {
		return this.session;
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
	
	initFromLocalJson(json) {
		var status = (json['status'] ? json['status'] : Securities.STATUS_LOCAL);
		
		var name = json['name'];
		var description = json['description'];
		var numberofshares = json['numberofshares'];
		var percentofcapital = json['percentofcapital'];
		var code = json['code'];

		if (json["uuid"])
			this.uuid = json["uuid"];
		
		var orderid = (json['orderid'] ? json['orderid'] : null);

		this.setStatus(status);

		this.setLocalName(name);
		this.setLocalDescription(description);
		this.setLocalNumberOfShares(numberofshares);
		this.setLocalPercentOfCapital(percentofcapital);
		
		this.setLocalCode(code);
		
		this.setLocalOrderId(orderid);
		
		if (json["creationdate"])
			this.setLocalCreationDate(json["creationdate"]);
			
		if (json["submissiondate"])
			this.setLocalSubmissionDate(json["submissiondate"]);
			
	}
	
	getLocalJson() {
		var uuid = this.getUUID();
		var status = this.getStatus();
		var name = this.local_issuance_name;
		var description = this.local_issuance_description;
		var numberofshares = this.local_numberofshares;
		var percentofcapital = this.local_percentofcapital;

		var code = this.local_code;
		
		var orderid = this.local_orderid;

		var creationdate= this.getLocalCreationDate();
		var submissiondate= this.getLocalSubmissionDate();

		var json = {uuid: uuid, status: status, 
				creationdate: creationdate, submissiondate: submissiondate, orderid: orderid, 
				name: name,	description: description, numberofshares: numberofshares, percentofcapital: percentofcapital, code: code};
		
		return json;
	}
	
	copy(orgObj) {
		
		// blockchain data
		this.position = orgObj.position;

		this.numberofshares = orgObj.numberofshares;
		this.percentofcapital = orgObj.percentofcapital;
		
		this.issuance_date = orgObj.issuance_date; 
		this.block_date = orgObj.block_date; 
	    
		this.name = orgObj.name;
		this.cocrypted_description = orgObj.cocrypted_description;
		
		this.type = orgObj.type;
		this.code = orgObj.code;
		
		this.cancel_date = orgObj.cancel_date; 
		this.cancel_block_date = orgObj.cancel_block_date; 
		
		this.orderid = orgObj.orderid; 
		this.signature = orgObj.signature; 
	}
	
	saveLocalJson(callback) {
		var persistor = this.getStockLedgerObject().getContractLocalPersistor();
		
		persistor.saveStockIssuanceJson(this, callback);
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
	
	getLocalCode() {
		return this.local_code;
	}
	
	setLocalCode(local_code) {
		this.local_code = local_code;
	}
	
	getLocalOrderId() {
		return this.local_orderid;
	}
	
	setLocalOrderId(orderid) {
		this.local_orderid = orderid;
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

	getChainType() {
		return this.type;
	}
	
	setChainType(type) {
		this.type = type;
	}

	getChainCode() {
		return this.code;
	}
	
	setChainCode(code) {
		this.code = code;
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
	static getStockIssuancesFromJsonArray(module, session, stockledger, jsonarray) {
		var array = [];
		
		if (!jsonarray)
			return array;
		
		for (var i = 0; i < jsonarray.length; i++) {
			if (!jsonarray[i])
				continue;
			
			var stockissuance = module.createBlankStockIssuanceObject(session, stockledger);
			
			stockissuance.initFromLocalJson(jsonarray[i]);
			
			array.push(stockissuance);
		}
		
		return array;
	}
}


if ( typeof GlobalClass !== 'undefined' && GlobalClass )
	GlobalClass.registerModuleClass('securities', 'StockIssuance', StockIssuance);
else
	module.exports = StockIssuance; // we are in node js

