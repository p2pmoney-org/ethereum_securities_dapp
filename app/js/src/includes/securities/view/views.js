'use strict';

var ModuleViews = class {
	
	constructor(module) {
		this.module = module;
	}
	
	getSecuritiesStatusString(obj) {
		var securitiesmodule = this.module;
		var global = securitiesmodule.global;
		var status = obj.getStatus();
		
		switch(status) {
			case Securities.STATUS_LOST:
				return global.t('lost');
			case Securities.STATUS_NOT_FOUND:
				return global.t('not found');
			case Securities.STATUS_UNKOWN:
				return global.t('unknown');
			case Securities.STATUS_LOCAL:
				return global.t('local only');
			case Securities.STATUS_SENT:
				return global.t('sent');
			case Securities.STATUS_PENDING:
				return global.t('pending');
			case Securities.STATUS_DEPLOYED:
				return global.t('deployed');
			case Securities.STATUS_CANCELLED:
				return global.t('cancelled');
			case Securities.STATUS_REJECTED:
				return global.t('rejected');
			case Securities.STATUS_ON_CHAIN:
				return global.t('on chain');
			default:
				return global.t('unknown');
		}
		
	}
	
}

GlobalClass.registerModuleClass('securities', 'Views', ModuleViews);