'use strict';

var ModuleControllers = class {
	
	constructor(module) {
		this.module = module;
	}
	
	getStakeholderDisplayName(address, contract) {
		var securitiesmodule = this.module;
		var global = securitiesmodule.global;
		var commonmodule = global.getModuleObject('common');
		var session = commonmodule.getSessionObject();
		
		var displayname = (session.isSessionAccountAddress(address) ? 'You' : address);
		
		if (displayname != 'You') {
			var ownsContract = session.ownsContract(contract);
			
			if (ownsContract) {
				// we can read the stakeholdername
				var stakeholder = contract.getChainStakeHolderFromAddress(address);
				
				if (stakeholder) {
					/*var contractowneraccount = contract.getOwnerAccount();
					
					if (contractowneraccount)
					displayname = contractowneraccount.aesDecryptString(stakeholder.getChainCocryptedIdentifier());*/
					
					displayname = session.decryptContractStakeHolderIdentifier(contract, stakeholder);
				}
			}
		}
		
	    return displayname;
	}
	

}

GlobalClass.registerModuleClass('securities', 'Controllers', ModuleControllers);