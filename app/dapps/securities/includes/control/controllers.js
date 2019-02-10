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
		
		var isYou = session.isSessionAccountAddress(address);
		var displayname = address;
		
		if (isYou) {
			displayname = global.t('You' );
		}
		else {
			var ownsContract = securitiesmodule.ownsContract(contract);
			
			if (ownsContract) {
				// we can read the stakeholdername
				var stakeholder = contract.getChainStakeHolderFromAddress(address);
				
				if (stakeholder) {
					/*var contractowneraccount = contract.getOwnerAccount();
					
					if (contractowneraccount)
					displayname = contractowneraccount.aesDecryptString(stakeholder.getChainCocryptedIdentifier());*/
					
					displayname = securitiesmodule.decryptContractStakeHolderIdentifier(contract, stakeholder);
				}
			}
		}
		
	    return displayname;
	}
	
	getTransactionStakeholderDisplayName(address, transaction, contract) {
		var securitiesmodule = this.module;
		var global = securitiesmodule.global;
		var commonmodule = global.getModuleObject('common');
		var session = commonmodule.getSessionObject();

		var isCreator = securitiesmodule.isTransactionCreator(transaction);
		
		var displayname = address;
		
		if (isCreator) {
			var transactiontoaddress = transaction.getChainTo();
			
			if (session.areAddressesEqual(address, transactiontoaddress)) {
				var stakeholder = contract.getChainStakeHolderFromAddress(transactiontoaddress);
				
				// in case we created it
				displayname = securitiesmodule.decryptCreatorStakeHolderIdentifier(contract, stakeholder);
			}
			else {
				displayname = this.getStakeholderDisplayName(address, contract);
			}
		}
		else {
			displayname = this.getStakeholderDisplayName(address, contract);
		}
		
		return displayname;
	}

	
	
	//
	// synchronous functions
	//
	
	// stock ledgers
	createStockLedgerObject(data) {
		console.log("Controllers.createStockLedgerObject called");
		
		var address = (data && data['address'] ? data['address'] : null);

		var owneraddress = (data && data['owneraddress'] ? data['owneraddress'] : null);
		var owneridentifier = (data && data['owneridentifier'] ? data['owneridentifier'] : null);
		var ledgername = (data && data['ledgername'] ? data['ledgername'] : null);
		var ledgerdescription = (data && data['ledgerdescription'] ? data['ledgerdescription'] : null);

		var module = this.module;
		var global = module.global;
		var session = global.getModuleObject('common').getSessionObject();
		
		var contracts = session.getContractsObject();
		
		
		var contract = contracts.createBlankContractObject('StockLedger');
		
		contract.setAddress(address);

		contract.setLocalOwner(owneraddress);
		contract.setLocalOwnerIdentifier(owneridentifier);
		contract.setLocalLedgerName(ledgername);
		contract.setLocalLedgerDescription(ledgerdescription);
		
		return contract;
	}
	
	modifyStockLedgerObject(contract, data) {
		console.log("Controllers.modifyStockLedgerObject called");
		
		var address = (data && data['address'] ? data['address'] : null);

		var owneraddress = (data && data['owneraddress'] ? data['owneraddress'] : null);
		var owneridentifier = (data && data['owneridentifier'] ? data['owneridentifier'] : null);
		var ledgername = (data && data['ledgername'] ? data['ledgername'] : null);
		var ledgerdescription = (data && data['ledgerdescription'] ? data['ledgerdescription'] : null);


		var module = this.module;
		var global = module.global;
		var session = global.getModuleObject('common').getSessionObject();
		
		var contracts = session.getContractsObject();
		
		
		contract.setAddress(address);

		contract.setLocalOwner(owneraddress);
		contract.setLocalOwnerIdentifier(owneridentifier);
		contract.setLocalLedgerName(ledgername);
		contract.setLocalLedgerDescription(ledgerdescription);
		
		return contract;
	}
	
	removeStockLedgerObject(contract) {
		if (!contract)
			return;
		
		var module = this.module;
		var global = module.global;
		
		var commonmodule = global.getModuleObject('common');
		var session = commonmodule.getSessionObject();
		
		var contracts = session.getContractsObject();

		contracts.removeContractObject(contract);
	}
		

	getStockLedgerFromKey(contractindex) {
		console.log("Controllers.getStockLedgerFromKey called with index: " + contractindex);

		var module = this.module;
		var global = module.global;
		var session = global.getModuleObject('common').getSessionObject();
		
		var contracts = session.getContractsObject();
		
		
		var contract = contracts.getContractObjectFromKey(contractindex);
		
		return contract;
	}
	
	getStockLedgerFromUUID(contractuuid) {
		console.log("Controllers.getStockLedgerFromUUID called with uuid: " + contractuuid);

		var module = this.module;
		var global = module.global;
		var session = global.getModuleObject('common').getSessionObject();
		
		var contracts = session.getContractsObject();
		
		
		var contract = contracts.getContractObjectFromUUID(contractuuid);
		
		return contract;
	}
	

	// accounts
	createAccount(contract, data) {
		console.log("Controllers.createAccount called");
		
		var module = this.module;
		var global = module.global;
		var session = global.getModuleObject('common').getSessionObject();
		
		var address = (data && data['address'] ? data['address'] : null);
		var privatekey = (data && data['privatekey'] ? data['privatekey'] : null);

		var account = session.createBlankAccountObject();
		
		if (session.isValidPrivateKey(privatekey)) {
			
			account.setPrivateKey(privatekey);
		}
		
		return account;
	}

	// accounts
	createShareHolder(contract, data) {
		console.log("Controllers.createShareHolder called");
		
		var module = this.module;
		var global = module.global;
		var session = global.getModuleObject('common').getSessionObject();
		
		var stockledgermodule = global.getModuleObject('securities');
		
		if (contract) {
			var shldridentifier = (data && data['shldridentifier'] ? data['shldridentifier'] : null);
			
			if ((shldridentifier) && (shldridentifier.length > 0)) {
				var stakeholder = stockledgermodule.createBlankStockHolderObject(session, contract);
				
				stakeholder.setLocalIdentifier(shldridentifier);
				
				contract.addLocalStakeHolder(stakeholder);
			}
		}
		
		return stakeholder;
	}

	modifyShareHolder(shareholder, data) {
		console.log("Controllers.modifyShareHolder called");
		
		var module = this.module;
		var global = module.global;
		var session = global.getModuleObject('common').getSessionObject();
		
		var stockledgermodule = global.getModuleObject('securities');
		
		if (shareholder) {
			var shldridentifier = (data && data['shldridentifier'] ? data['shldridentifier'] : null);
			
			if ((shldridentifier) && (shldridentifier.length > 0)) {
				
				shareholder.setLocalIdentifier(shldridentifier);
			}
		}
		
		return shareholder;
	}

	removeShareHolder(contract, shareholder) {
		console.log("Controllers.removeShareHolder called");
		
		var module = this.module;
		var global = module.global;

		if (shareholder && contract) {
			contract.removeStakeHolderObject(stakeholder);
		}
	}
	
	// issuances
	createIssuance(contract, data) {
		console.log("Controllers.createIssuance called");
		
		var module = this.module;
		var global = module.global;
		var session = global.getModuleObject('common').getSessionObject();
		
		var stockledgermodule = global.getModuleObject('securities');
		
		if (contract) {
			
			var issuancename = (data && data['issuancename'] ? data['issuancename'] : null);
			var issuancedescription = (data && data['issuancedescription'] ? data['issuancedescription'] : null);
			var numberofshares = (data && data['numberofshares'] ? data['numberofshares'] : null);
			var percentofcapital = (data && data['percentofcapital'] ? data['percentofcapital'] : null);
			
			
			var issuance = stockledgermodule.createBlankStockIssuanceObject(session, contract);
			
			issuance.setLocalName(issuancename);
			issuance.setLocalDescription(issuancedescription);
			issuance.setLocalNumberOfShares(numberofshares);
			issuance.setLocalPercentOfCapital(percentofcapital);
			
			contract.addLocalIssuance(issuance);
		}
		
		return issuance;
	}

	modifyIssuance(issuance, data) {
		console.log("Controllers.modifyIssuance called");
		
		var module = this.module;
		var global = module.global;
		var session = global.getModuleObject('common').getSessionObject();
		
		var stockledgermodule = global.getModuleObject('securities');
		
		if (issuance) {
			var issuancename = (data && data['issuancename'] ? data['issuancename'] : null);
			var issuancedescription = (data && data['issuancedescription'] ? data['issuancedescription'] : null);
			var numberofshares = (data && data['numberofshares'] ? data['numberofshares'] : null);
			var percentofcapital = (data && data['percentofcapital'] ? data['percentofcapital'] : null);
			
			
			issuance.setLocalName(issuancename);
			issuance.setLocalDescription(issuancedescription);
			issuance.setLocalNumberOfShares(numberofshares);
			issuance.setLocalPercentOfCapital(percentofcapital);
			
		}
		
		return issuance;
	}

	removeIssuance(contract, issuance) {
		console.log("Controllers.removeIssuance called");
		
		var module = this.module;
		var global = module.global;

		if (issuance && contract) {
			contract.removeIssuanceObject(issuance);
		}
	}

	// transactions
	createTransaction(contract, data) {
		console.log("Controllers.createTransaction called");
		
		var module = this.module;
		var global = module.global;
		var session = global.getModuleObject('common').getSessionObject();
		
		var stockledgermodule = global.getModuleObject('securities');
		
		if (contract) {
			
			var from = (data && data['from'] ? data['from'] : null);
			var to = (data && data['to'] ? data['to'] : null);
			var issuancenumber = (data && data['issuancenumber'] ? data['issuancenumber'] : null);
			var numberofshares = (data && data['numberofshares'] ? data['numberofshares'] : null);
			var consideration = (data && data['consideration'] ? data['consideration'] : null);
			var currency = (data && data['currency'] ? data['currency'] : null);
			
			
			var transaction = stockledgermodule.createBlankStockTransactionObject(session, contract);
			
			transaction.setLocalFrom(from);
			transaction.setLocalTo(to);
			transaction.setLocalIssuanceNumber(issuancenumber);
			transaction.setLocalNumberOfShares(numberofshares);
			transaction.setLocalConsideration(consideration);
			transaction.setLocalCurrency(currency);
			
			contract.addLocalTransaction(transaction);
		}
		
		return transaction;
	}

	modifyTransaction(transaction, data) {
		console.log("Controllers.modifyTransaction called");
		
		var module = this.module;
		var global = module.global;
		var session = global.getModuleObject('common').getSessionObject();
		
		var stockledgermodule = global.getModuleObject('securities');
		
		if (transaction) {
			var from = (data && data['from'] ? data['from'] : null);
			var to = (data && data['to'] ? data['to'] : null);
			var issuancenumber = (data && data['issuancenumber'] ? data['issuancenumber'] : null);
			var numberofshares = (data && data['numberofshares'] ? data['numberofshares'] : null);
			var consideration = (data && data['consideration'] ? data['consideration'] : null);
			var currency = (data && data['currency'] ? data['currency'] : null);
			
			transaction.setLocalFrom(from);
			transaction.setLocalTo(to);
			transaction.setLocalIssuanceNumber(issuancenumber);
			transaction.setLocalNumberOfShares(numberofshares);
			transaction.setLocalConsideration(consideration);
			transaction.setLocalCurrency(currency);
			
		}
		
		return transaction;
	}

	removeTransaction(contract, removeTransaction) {
		console.log("Controllers.removeTransaction called");
		
		var module = this.module;
		var global = module.global;

		if (removeTransaction && contract) {
			contract.removeTransactionObject(removeTransaction);
		}
	}


	
	//
	// asynchronous functions
	//
	
	
	// (note: only function with a callback do a save, others just modify data in memory)
	saveStockLedgerObject(contract, callback) {
		if (!contract)
			return;
		
		console.log("Controllers.saveStockLedgerObject called for contract uuid " + contract.getUUID());

		var module = this.module;
		var global = module.global;
		
		var commonmodule = global.getModuleObject('common');
		var session = commonmodule.getSessionObject();
		
		var contracts = session.getContractsObject();
		
		var contractindex = contract.getContractIndex();
		var contractuuid = contract.getUUID();
		
		contract.saveLocalJson(function(err, res) {
			if (callback)
				callback(err, contracts);
		});
		
	}

	saveStockLedgers(callback) {
		console.log("Controllers.saveStockLedgers called");
		
		var module = this.module;
		var global = module.global;
		
		var commonmodule = global.getModuleObject('common');
		var session = commonmodule.getSessionObject();
		
		var contracts = session.getContractsObject();

		session.saveContractObjects(contracts, function(err, res) {
			console.log('saveStockLedgers returning from save');
			if (callback)
				callback(err, contracts);
		});
	}
	
	
	
}

GlobalClass.registerModuleClass('securities', 'Controllers', ModuleControllers);