'use strict';

class StockLedgerLocalPersistor {
	
	constructor(session, contractuuid) {
		this.session = session;
		this.contractuuid = contractuuid;
		
		this.commonmodule = this.session.getGlobalObject().getModuleObject('common');
	}
	
	saveStockledgerJson(stockledger) {
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
	}
	
	saveStockHolderJson(stockholder) {
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
	}
	
	saveStockIssuanceJson(stockissuance) {
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
	}
	
	saveStockTransactionJson(stocktransaction) {
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
	}
	
}

if ( typeof GlobalClass !== 'undefined' && GlobalClass )
	GlobalClass.registerModuleClass('securities', 'StockLedgerLocalPersistor', StockLedgerLocalPersistor);
else
	module.exports = StockLedgerLocalPersistor; // we are in node js
