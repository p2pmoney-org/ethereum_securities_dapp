'use strict';

class Constants {
	
	// status
	static get STATUS_LOCAL() { return 1;}	
	static get STATUS_DEPLOYED() { return 2;}	
	
	// forms
	static get FORM_ADD_CONTRACT_ADDRESS() { return 1;}	
	
	static get FORM_CREATE_CONTRACT() { return 2;}	// local
	static get FORM_MODIFY_CONTRACT() { return 3;}	
	
	static get FORM_DEPLOY_CONTRACT() { return 5;}	// blockchain
	static get FORM_UPDATE_CONTRACT() { return 6;}	
	
	static get FORM_DEPLOY_ACCOUNT() { return 8;}	
	
	static get FORM_CREATE_STAKEHOLDER() { return 10}	// local
	static get FORM_MODIFY_STAKEHOLDER() { return 11}	

	static get FORM_DEPLOY_STAKEHOLDER() { return 15}	
	
	static get FORM_CREATE_ISSUANCE() { return 20}	
	static get FORM_MODIFY_ISSUANCE() { return 21}	
	
	static get FORM_DEPLOY_ISSUANCE() { return 25}	
	
	static get FORM_CREATE_TRANSACTION() { return 30}// local
	static get FORM_MODIFY_TRANSACTION() { return 31}	

	static get FORM_DEPLOY_TRANSACTION() { return 35}	
	
	// views
	static get VIEW_CONTRACT_LIST() { return 1;}
	static get VIEW_CONTRACT() { return 5;}
	
	static get VIEW_CONTRACT_ACCOUNTS() { return 8;}
	
	static get VIEW_CONTRACT_STAKEHOLDERS() { return 10;}
	static get VIEW_CONTRACT_STAKEHOLDER() { return 15;}
	
	static get VIEW_CONTRACT_ISSUANCES() { return 20;}	
	static get VIEW_CONTRACT_ISSUANCE() { return 25;}	

	static get VIEW_CONTRACT_TRANSACTIONS() { return 30;}	
	static get VIEW_CONTRACT_TRANSACTION() { return 35;}
	
	static get ETHER_TO_WEI() { return 1000000000000000000;}
	
	
	// ether
	static getWeiFromEther(numofether) {
		var wei = numofether * Constants.ETHER_TO_WEI;

		return wei;
	}
	
	static getEtherFromwei(numofwei) {
		var ether = numofwei / Constants.ETHER_TO_WEI;

		return ether;
	}
}
