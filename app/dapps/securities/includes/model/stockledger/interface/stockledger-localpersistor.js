'use strict';

class StockLedgerLocalPersistor {
	
	constructor(session, contractuuid) {
		this.session = session;
		this.contractuuid = contractuuid;
		
		this.commonmodule = this.session.getGlobalObject().getModuleObject('common');
	}
	
	saveStockledgerJson(stockledger, callback) {
		var session = this.session;
		var keys = ['contracts'];
		
		var uuid = stockledger.getUUID();
		var json = stockledger.getLocalJson();
		
		var commonmodule = this.commonmodule;
		
		var jsonleaf = commonmodule.getLocalJsonLeaf(session, keys, uuid);
		
		if (jsonleaf) {
			commonmodule.updateLocalJsonLeaf(session, keys, uuid, json);
		}
		else {
			commonmodule.insertLocalJsonLeaf(session, keys, null, null, json);
		}
		
		// save contracts
		var contractsjson = commonmodule.readLocalJson(session, keys); // from cache, since no refresh
		
		commonmodule.saveLocalJson(session, keys, contractsjson, callback);
	}
	
	saveStockHolderJson(stockholder, callback) {
		var session = this.session;
		var keys = ['contracts'];
		
		var uuid = stockholder.getUUID();
		var json = stockholder.getLocalJson();
		
		var commonmodule = this.commonmodule;
		
		var jsonleaf = commonmodule.getLocalJsonLeaf(session, keys, uuid)
		
		if (jsonleaf) {
			commonmodule.updateLocalJsonLeaf(session, keys, uuid, json);
		}
		else {
			var parentuuid = stockholder.getStockLedgerObject().getUUID();
			commonmodule.insertLocalJsonLeaf(session, keys, parentuuid, 'stakeholders', json);
		}
		
		// save contracts
		var contractsjson = commonmodule.readLocalJson(session, keys); // from cache, since no refresh
		
		commonmodule.saveLocalJson(session, keys, contractsjson, callback);
	}
	
	saveStockIssuanceJson(stockissuance, callback) {
		var session = this.session;
		var keys = ['contracts'];
		
		var uuid = stockissuance.getUUID();
		var json = stockissuance.getLocalJson();
		
		var commonmodule = this.commonmodule;
		
		var jsonleaf = commonmodule.getLocalJsonLeaf(session, keys, uuid)
		
		if (jsonleaf) {
			commonmodule.updateLocalJsonLeaf(session, keys, uuid, json);
		}
		else {
			var parentuuid = stockissuance.getStockLedgerObject().getUUID();
			commonmodule.insertLocalJsonLeaf(session, keys, parentuuid, 'issuances', json);
		}
		
		// save contracts
		var contractsjson = commonmodule.readLocalJson(session, keys); // from cache, since no refresh
		
		commonmodule.saveLocalJson(session, keys, contractsjson, callback);
	}
	
	saveStockTransactionJson(stocktransaction, callback) {
		var session = this.session;
		var keys = ['contracts'];
		
		var uuid = stocktransaction.getUUID();
		var json = stocktransaction.getLocalJson();
		
		var commonmodule = this.commonmodule;
		
		var jsonleaf = commonmodule.getLocalJsonLeaf(session, keys, uuid)
		
		if (jsonleaf) {
			commonmodule.updateLocalJsonLeaf(session, keys, uuid, json);
		}
		else {
			var parentuuid = stocktransaction.getStockLedgerObject().getUUID();
			commonmodule.insertLocalJsonLeaf(session, keys, parentuuid, 'transactions', json);
		}
		
		// save contracts
		var contractsjson = commonmodule.readLocalJson(session, keys); // from cache, since no refresh
		
		commonmodule.saveLocalJson(session, keys, contractsjson, callback);
	}
	
}

if ( typeof GlobalClass !== 'undefined' && GlobalClass )
	GlobalClass.registerModuleClass('securities', 'StockLedgerLocalPersistor', StockLedgerLocalPersistor);
else
	module.exports = StockLedgerLocalPersistor; // we are in node js
