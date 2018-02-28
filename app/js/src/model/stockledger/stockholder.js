/**
 * 
 */
'use strict';

class StockHolder extends StakeHolder {
	constructor(session) {
		super(session);
	}
	
	// functions on share position



	// static
	static getStockHoldersFromJsonArray(session, jsonarray) {
		var array = [];
		
		if (!jsonarray)
			return array;
		
		for (var i = 0; i < jsonarray.length; i++) {
			var identifier = jsonarray[i]['identifier'];
			var stockholder = session.createBlankStockHolderObject();
			
			stockholder.setLocalIdentifier(identifier);
			
			array.push(stockholder);
		}
		
		return array;
	}
}

if ( typeof GlobalClass !== 'undefined' && GlobalClass )
	GlobalClass.StockHolder = StockHolder;
else
	module.exports = StockHolder; // we are in node js
