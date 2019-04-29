'use strict';

var DAPPViews = class {
	
	constructor(global) {
		this.global = global;
		
		this.name = 'securities';
		
	}
	
	getStockLedgerStatusString(obj) {
		var global = this.global;
		var status = obj.getStatus();
		
		return this._getStatusString(obj, status)
	}

	
	getStockLedgerLiveStatusString(obj) {
		var global = this.global;
		var status = obj.getLiveStatus();
		
		return this._getStatusString(obj, status)
	}

	
	_getStatusString(obj, status) {
		var global = this.global;
		
		if (!this.Contracts) {
			// Contracts class
			var commonmodule = this.global.getModuleObject('common');
			var ethnodemodule = global.getModuleObject('ethnode');
			
			this.Contracts = ethnodemodule.Contracts;
		}
		
		switch(status) {
			case this.Contracts.STATUS_LOST:
				return global.t('lost');
			case this.Contracts.STATUS_NOT_FOUND:
				return global.t('not found');
			case this.Contracts.STATUS_UNKOWN:
				return global.t('unknown');
			case this.Contracts.STATUS_LOCAL:
				return global.t('local');
			case this.Contracts.STATUS_SENT:
				return global.t('sent');
			case this.Contracts.STATUS_PENDING:
				return global.t('pending');
			case this.Contracts.STATUS_DEPLOYED:
				return global.t('deployed');
			case this.Contracts.STATUS_CANCELLED:
				return global.t('cancelled');
			case this.Contracts.STATUS_REJECTED:
				return global.t('rejected');
			case this.Contracts.STATUS_ON_CHAIN:
				return global.t('on chain');
			default:
				return global.t('undefined');
		}
		
	}
	
	getShareHolderStatusString(obj) {
		var global = this.global;
		var status = obj.getStatus();
		
		return this._getStatusString(obj, status)
	}

	getIssuanceStatusString(obj) {
		var global = this.global;
		var status = obj.getStatus();
		
		return this._getStatusString(obj, status)
	}

	getTransactionStatusString(obj) {
		var global = this.global;
		var status = obj.getStatus();
		
		return this._getStatusString(obj, status)
	}

	
	
	// show and reveal
	showCondensedPublicKey(pubkey) {
		return (pubkey ? pubkey.substring(0, 16) + ".........." + pubkey.substr(pubkey.length - 8) : null);
	}
	
	showCondensedPrivateKey(privkey) {
		return (privkey ? privkey.substring(0, 16) + ".........." + privkey.substr(privkey.length - 8) : null);
	}
	
	showCondensedCryptedText(cryptedtext) {
		return (cryptedtext ? cryptedtext.substring(0, 16) + ".........." + cryptedtext.substr(cryptedtext.length - 8) : null);
	}
	
	revealContractIssuanceDescription(ownsContract, securitiesmodule, session, contract, issuance) {
		if (ownsContract) {
			return '\xa0\xa0\xa0---->\xa0\xa0\xa0' + session.getSessionAccountObject(contract.getSyncChainOwner()).aesDecryptString(issuance.getChainCocryptedDescription()) ;
		}
		else {
			return '';
		}
	}
	
	revealStakeHolderIdentifier(ownsContract, securitiesmodule, session, contract, stakeholder) {
		if (ownsContract) {
			return this.revealContractStakeHolderIdentifier(ownsContract, securitiesmodule, session, contract, stakeholder);
		}
		else {
			var stkldraddress = stakeholder.getAddress();
			var isYou = session.isSessionAccountAddress(stkldraddress);
			
			if (isYou) {
				return this.revealStakeHolderCryptedStakeHolderIdentifier(ownsContract, securitiesmodule, session, contract, stakeholder);
			}
			else {
				var creatoraddress = stakeholder.getChainCreatorAddress();
				var areYouCreator = session.isSessionAccountAddress(creatoraddress);
				
				if (areYouCreator) {
					return this.revealCreatorCryptedStakeHolderIdentifier(ownsContract, securitiesmodule, session, contract, stakeholder);
				}
				else {
					return '';
				}
			}
			
		}
	}

	
	revealContractStakeHolderIdentifier(ownsContract, securitiesmodule, session, contract, stakeholder) {
		var stakeholderaddress = stakeholder.getAddress();
		var isYou = session.isSessionAccountAddress(stakeholderaddress);
		
		if (isYou) {
			return '\xa0\xa0\xa0---->\xa0\xa0\xa0You';
		}
		else {
			if (ownsContract) {
				// global.getStakeholderDisplayName(chainto, contract)
				return '\xa0\xa0\xa0---->\xa0\xa0\xa0' + securitiesmodule.decryptContractStakeHolderIdentifier(contract, stakeholder);
			}
			else {
				return '';
			}
		}
	}
	
	revealContractStakeHolderPrivateKey(ownsContract, securitiesmodule, session, contract, stakeholder) {
		if (ownsContract) {
			return '\xa0\xa0\xa0---->\xa0\xa0\xa0' + securitiesmodule.decryptContractStakeHolderPrivateKey(contract, stakeholder);
		}
		else {
			return '';
		}
	}
	
	revealCreatorCryptedStakeHolderDescription(ownsContract, securitiesmodule, session, contract, stakeholder) {
		if (ownsContract)
			return '\xa0\xa0\xa0---->\xa0\xa0\xa0' + securitiesmodule.decryptCreatorStakeHolderDescription(contract, stakeholder);
		else {
			var creatoraddress = stakeholder.getChainCreatorAddress();
			var isYou = session.isSessionAccountAddress(creatoraddress);
			
			if (isYou) {
				return '\xa0\xa0\xa0---->\xa0\xa0\xa0' + securitiesmodule.decryptCreatorStakeHolderDescription(contract, stakeholder);
			}
			else {
				return '';
			}
		}
	}
	
	revealCreatorCryptedStakeHolderIdentifier(ownsContract, securitiesmodule, session, contract, stakeholder) {
		if (ownsContract)
			return '\xa0\xa0\xa0---->\xa0\xa0\xa0' + securitiesmodule.decryptCreatorStakeHolderIdentifier(contract, stakeholder);
		else {
			var creatoraddress = stakeholder.getChainCreatorAddress();
			var isYou = session.isSessionAccountAddress(creatoraddress);
			
			if (isYou) {
				return '\xa0\xa0\xa0---->\xa0\xa0\xa0' + securitiesmodule.decryptCreatorStakeHolderIdentifier(contract, stakeholder);
			}
			else {
				return '';
			}
		}
	}
	
	revealStakeHolderCryptedStakeHolderDescription(ownsContract, securitiesmodule, session, contract, stakeholder) {
		if (ownsContract)
			return '\xa0\xa0\xa0---->\xa0\xa0\xa0' + securitiesmodule.decryptStakeHolderStakeHolderDescription(contract, stakeholder);
		else {
			var stakeholderaddress = stakeholder.getAddress();
			var isYou = session.isSessionAccountAddress(stakeholderaddress);
			
			if (isYou) {
				return '\xa0\xa0\xa0---->\xa0\xa0\xa0' + securitiesmodule.decryptStakeHolderStakeHolderDescription(contract, stakeholder);
			}
			else {
				return '';
			}
		}
	}
	
	revealStakeHolderCryptedStakeHolderIdentifier(ownsContract, securitiesmodule, session, contract, stakeholder) {
		if (ownsContract)
			return '\xa0\xa0\xa0---->\xa0\xa0\xa0' + securitiesmodule.decryptStakeHolderStakeHolderIdentifier(contract, stakeholder);
		else {
			var stakeholderaddress = stakeholder.getAddress();
			var isYou = session.isSessionAccountAddress(stakeholderaddress);
			
			if (isYou) {
				return '\xa0\xa0\xa0---->\xa0\xa0\xa0' + securitiesmodule.decryptStakeHolderStakeHolderIdentifier(contract, stakeholder);
			}
			else {
				return '';
			}
		}
	}

	
}

if ( typeof window !== 'undefined' && window )
GlobalClass.registerModuleClass('dapps', 'SecuritiesAngularViews', DAPPViews);
else
module.exports = DAPPViews; // we are in node js