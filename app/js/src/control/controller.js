'use strict';



class Controllers {
	
	constructor(global) {
		this.global = global;
	}
	
	//
	// navigation
	//
	gotoHome() {
		console.log("Controllers.gotoHome called");
		
		var global = this.global;
		
		var Global = global.getGlobalClass();
		
		global.setCurrentFormBand(Global.FORM_ADD_CONTRACT_ADDRESS);
		global.setCurrentViewBand(Global.VIEW_CONTRACT_LIST);
		
		this.displayCurrentPage() 
	}
	
	gotoContractPage(contract) {
		console.log("Controllers.gotoContractPage called");
		
		var global = this.global;
		
		var Global = global.getGlobalClass();
		
		if (contract) {
			global.setCurrentFormBand(Global.FORM_MODIFY_CONTRACT);
			global.setCurrentViewBand(Global.VIEW_CONTRACT);
		}
		else {
			return this.gotoHome();
		}
		
		global.resetNavigation();
		global.setCurrentContract(contract);
		
		this.displayCurrentPage() 
	}
	
	// accounts
	gotoContractAccountListPage(contract) {
		console.log("Controllers.gotoContractAccountListPage called");
		
		var global = this.global;
		
		var Global = global.getGlobalClass();
		
		if (contract) {
			global.setCurrentFormBand(Global.FORM_DEPLOY_ACCOUNT);
			global.setCurrentViewBand(Global.VIEW_CONTRACT_ACCOUNTS);
		}
		else {
			return this.gotoHome();
		}
		
		global.resetNavigation();
		global.setCurrentContract(contract);
		
		this.displayCurrentPage() 
	}
	
	// stakeholders
	gotoContractStakeHolderListPage(contract) {
		console.log("Controllers.gotoContractStakeHolderListPage called");
		
		var global = this.global;
		
		var Global = global.getGlobalClass();
		
		if (contract) {
			global.setCurrentFormBand(Global.FORM_CREATE_STAKEHOLDER);
			global.setCurrentViewBand(Global.VIEW_CONTRACT_STAKEHOLDERS);
		}
		else {
			return this.gotoHome();
		}
		
		global.resetNavigation();
		global.setCurrentContract(contract);
		
		this.displayCurrentPage() 
	}
	
	gotoContractStakeHolderPage(contract, stakeholder) {
		console.log("Controllers.gotoContractStakeHolderPage called");
		
		var global = this.global;
		
		var Global = global.getGlobalClass();
		
		if (contract) {
			global.setCurrentFormBand(Global.FORM_MODIFY_STAKEHOLDER);
			global.setCurrentViewBand(Global.VIEW_CONTRACT_STAKEHOLDER);
		}
		else {
			return this.gotoHome();
		}
		
		global.resetNavigation();
		global.setCurrentContract(contract);
		global.setCurrentStakeHolder(stakeholder);
		
		this.displayCurrentPage() 
	}
	
	// issuances
	gotoContractIssuanceListPage(contract) {
		console.log("Controllers.gotoContractIssuanceListPage called");
		
		var global = this.global;
		
		var Global = global.getGlobalClass();
		
		if (contract) {
			global.setCurrentFormBand(Global.FORM_CREATE_ISSUANCE);
			global.setCurrentViewBand(Global.VIEW_CONTRACT_ISSUANCES);
		}
		else {
			return this.gotoHome();
		}
		
		global.resetNavigation();
		global.setCurrentContract(contract);
		
		this.displayCurrentPage() 
	}
	
	gotoContractIssuancePage(contract, issuance) {
		console.log("Controllers.gotoContractIssuancePage called");
		
		var global = this.global;
		
		var Global = global.getGlobalClass();
		
		if (contract) {
			global.setCurrentFormBand(Global.FORM_MODIFY_ISSUANCE);
			global.setCurrentViewBand(Global.VIEW_CONTRACT_ISSUANCE);
		}
		else {
			return this.gotoHome();
		}
		
		global.resetNavigation();
		global.setCurrentContract(contract);
		global.setCurrentIssuance(issuance);
		
		this.displayCurrentPage() 
	}

	// transactions
	gotoContractTransactionListPage(contract) {
		console.log("Controllers.gotoContractTransactionListPage called");
		
		var global = this.global;
		
		var Global = global.getGlobalClass();
		
		if (contract) {
			global.setCurrentFormBand(Global.FORM_CREATE_TRANSACTION);
			global.setCurrentViewBand(Global.VIEW_CONTRACT_TRANSACTIONS);
		}
		else {
			return this.gotoHome();
		}
		
		global.resetNavigation();
		global.setCurrentContract(contract);
		
		this.displayCurrentPage() 
	}
	
	gotoContractTransactionPage(contract, transaction) {
		console.log("Controllers.gotoContractTransactionPage called");
		
		var global = this.global;
		
		var Global = global.getGlobalClass();
		
		if (contract) {
			global.setCurrentFormBand(Global.FORM_MODIFY_TRANSACTION);
			global.setCurrentViewBand(Global.VIEW_CONTRACT_TRANSACTION);
		}
		else {
			return this.gotoHome();
		}
		
		global.resetNavigation();
		global.setCurrentContract(contract);
		global.setCurrentTransaction(transaction);
		
		this.displayCurrentPage() 
	}
	
	
	//
	// display
	//
	displayCurrentPage() {
		console.log("Controllers.displayCurrentPage called");
		
		var global = this.global;
		var app = global.getAppObject();
		
		var Global = global.getGlobalClass();
		
		app.clearDisplay();
		
		// top band
		app.displayMessageZone();
		
		// bread crumb
		var breadcrumbs = global.getBreadCrumbsObject();
		
		breadcrumbs.displayCurrent();
		
		// form band
		var forms = global.getFormsObject();

		var currentformband = global.getCurrentFormBand();
		
		console.log("currentformband is: " + currentformband);

		if (currentformband == Global.FORM_ADD_CONTRACT_ADDRESS) {
			forms.displayAddContractToListForm();
		}
		else if (currentformband == Global.FORM_CREATE_CONTRACT) {
			// modify 
			var contract = global.getCurrentContract();
			forms.displayCreateContractForm(contract);
		}
		else if (currentformband == Global.FORM_MODIFY_CONTRACT) {
			// modify 
			var contract = global.getCurrentContract();
			forms.displayModifyContractForm(contract);
		}
		else if (currentformband == Global.FORM_DEPLOY_CONTRACT) {
			// deploy 
			var contract = global.getCurrentContract();
			forms.displayDeployContractForm(contract);
		}
		else if (currentformband == Global.FORM_CREATE_STAKEHOLDER) {
			// create 
			var contract = global.getCurrentContract();
			forms.displayCreateStakeHolderForm(contract);
		}
		else if (currentformband == Global.FORM_MODIFY_STAKEHOLDER) {
			// modify 
			var contract = global.getCurrentContract();
			var stakeholder = global.getCurrentStakeHolder();
			forms.displayModifyStakeHolderForm(contract, stakeholder);
		}
		else if (currentformband == Global.FORM_DEPLOY_ACCOUNT) {
			// deploy 
			var contract = global.getCurrentContract();
			forms.displayDeployAccountForm(contract);
		}
		else if (currentformband == Global.FORM_DEPLOY_STAKEHOLDER) {
			// deploy 
			var contract = global.getCurrentContract();
			var stakeholder = global.getCurrentStakeHolder();
			forms.displayDeployStakeHolderForm(contract, stakeholder);
		}
		else if (currentformband == Global.FORM_CREATE_ISSUANCE) {
			// create 
			var contract = global.getCurrentContract();
			forms.displayCreateIssuanceForm(contract);
		}
		else if (currentformband == Global.FORM_MODIFY_ISSUANCE) {
			// modify 
			var contract = global.getCurrentContract();
			var issuance = global.getCurrentIssuance();
			forms.displayModifyIssuanceForm(contract, issuance);
		}
		else if (currentformband == Global.FORM_DEPLOY_ISSUANCE) {
			// deploy 
			var contract = global.getCurrentContract();
			var issuance = global.getCurrentIssuance();
			forms.displayDeployIssuanceForm(contract, issuance);
		}
		else if (currentformband == Global.FORM_CREATE_TRANSACTION) {
			// create 
			var contract = global.getCurrentContract();
			forms.displayCreateTransactionForm(contract);
		}
		else if (currentformband == Global.FORM_MODIFY_TRANSACTION) {
			// modify 
			var contract = global.getCurrentContract();
			var transaction = global.getCurrentTransaction();
			forms.displayModifyTransactionForm(contract, transaction);
		}
		else if (currentformband == Global.FORM_DEPLOY_TRANSACTION) {
			// deploy 
			var contract = global.getCurrentContract();
			var transaction = global.getCurrentTransaction();
			forms.displayDeployTransactionForm(contract, transaction);
		}
		else {
			// default
			forms.displayAddContractToListForm();
		}
		
		
		var views = global.getViewsObject();
		var currentviewband = global.getCurrentViewBand();
		
		console.log("currentviewband is: " + currentviewband);

		if (currentviewband == Global.VIEW_CONTRACT_LIST) {
			var contracts = global.getContractsObject();
			views.displayContractList(contracts);
		}
		else if (currentviewband == Global.VIEW_CONTRACT) {	
			// view of the contract
			var contract = global.getCurrentContract();
			views.displayContract(contract);
		}
		else if (currentviewband == Global.VIEW_CONTRACT_ACCOUNTS) {	
			// view of the account list
			var contract = global.getCurrentContract();
			views.displayContractAccounts(contract);
		}
		else if (currentviewband == Global.VIEW_CONTRACT_STAKEHOLDERS) {	
			// view of the stakeholder list
			var contract = global.getCurrentContract();
			views.displayContractStakeHolders(contract);
		}
		else if (currentviewband == Global.VIEW_CONTRACT_STAKEHOLDER) {	
			// view of the stakeholder
			var contract = global.getCurrentContract();
			var stakeholder = global.getCurrentStakeHolder();
			views.displayContractStakeHolder(contract,stakeholder);
		}
		else if (currentviewband == Global.VIEW_CONTRACT_ISSUANCES) {	
			// view of the contract
			var contract = global.getCurrentContract();
			views.displayContractIssuances(contract);
		}
		else if (currentviewband == Global.VIEW_CONTRACT_ISSUANCE) {	
			// view of the stakeholder
			var contract = global.getCurrentContract();
			var issuance = global.getCurrentIssuance();
			views.displayContractIssuance(contract, issuance);
		}
		else if (currentviewband == Global.VIEW_CONTRACT_TRANSACTIONS) {	
			// view of the contract
			var contract = global.getCurrentContract();
			views.displayContractTransactions(contract);
		}
		else if (currentviewband == Global.VIEW_CONTRACT_TRANSACTION) {	
			// view of the stakeholder
			var contract = global.getCurrentContract();
			var transaction = global.getCurrentTransaction();
			views.displayContractTransaction(contract, transaction);
		}
		else {	
			// default
			var contracts = global.getContractsObject();
			views.displayContractList(contracts);
		}
		
	}
	

	// event handlers
	
	// navigation
	handleGotoHome() {
		console.log("Controllers.handleGotoHome called");
		
		var global = Controllers.getGlobalClass().getGlobalObject();
		var app = global.getAppObject();
		var controllers = global.getControllersObject();

		global.resetNavigation();
		app.clearDisplay();
		
		controllers.gotoHome();
	}
	
	//
	// Identification
	//
	handleDisplayIdentificationBox() {
		console.log("Controllers.handleDisplayIdentificationBox called");

		// watch-out, 'this' is defined as the context
		// of the calling object from event listener
		var global = Controllers.getGlobalClass().getGlobalObject();
		var app = global.getAppObject();
		var session = global.getSessionObject();

		var privatekey = prompt("Please enter your private key. It will be kept in memory until a refresh in your browser.", "");

		if (privatekey != null) {
			
			var sessionaccount = global.createBlankAccountObject();
			
			sessionaccount.setPrivateKey(privatekey);
			
			session.impersonateAccount(sessionaccount);
			
			app.refreshDisplay();
		}	
		
	}
	
	handleIdentificationSwitch() {
		console.log("Controllers.handleDisplayIdentificationBox called");

		// watch-out, 'this' is defined as the context
		// of the calling object from event listener
		var global = Controllers.getGlobalClass().getGlobalObject();
		var controllers = global.getControllersObject();
		var app = global.getAppObject();
		var session = global.getSessionObject();
		
		var sessionaccount = session.getSessionAccountObject();
		
		if (sessionaccount != null) {
			if (confirm('Do you want to disconnect your account?')) {
				session.disconnectAccount();
				
				app.refreshDisplay();
				
			} else {
			    // Do nothing!
			}			
		}
		else {
			controllers.handleDisplayIdentificationBox()
		}

	}
	
	//
	// Contracts
	//

	// forms
	handleAddDeployedContract() {
		console.log("Controllers.handleAddDeployedContract called");
		
		// watch-out, 'this' is defined as the context
		// of the calling object from event listener
		var global = Controllers.getGlobalClass().getGlobalObject();
		var app = global.getAppObject();
		var contracts = global.getContractsObject();
		
		// read value in text box
		var address = app.getFormValue("contractaddress");
		var description = app.getFormValue("contractdescription");
		console.log("address is " + address);
		console.log("description is " + description);
		
		// we add a stockledger object
		var contract = contracts.getContractObject(address, 'StockLedger');
		
		
		if (contract) {
			contract.setLocalDescription(description);
			
			contracts.addContractObject(contract);
			
			global.saveContractObjects(contracts);
			
			app.setMessage("deployed contract added, collecting chain data");
			
			// start a promise chain, to collect owner, chain ledger description,..
			console.log("starting retrieving chain data");

			var owner;
			var promise = contract.getChainOwner(function(err, res) {
				owner = res;
				
				console.log("chain owner is " + res);
				
				return contract.getChainContractName(function(err, res) {
					return res;
				}).then(function(chaincontractname) {
					console.log("chain contract name is " + chaincontractname);
					console.log("chain owner is now " + owner);
					
					contract.setLocalOwner(owner);
					
					global.saveContractObjects(contracts);
					
					console.log("deployed contract completely retrieved");

					app.setMessage("deployed contract completely retrieved");
				});
			});
		}
		
		
		
		return;
	}
	
	handleCreateContract() {
		console.log("Controllers.handleCreateContract called");
		
		// watch-out, 'this' is defined as the context
		// of the calling object from event listener
		var global = Controllers.getGlobalClass().getGlobalObject();
		var app = global.getAppObject();
		var contracts = global.getContractsObject();

		// we create a blank stockledger object
		var contract = contracts.createBlankContractObject('StockLedger');
		
		var owneraddress = app.getFormValue("owneraddress");
		var owneridentifier = app.getFormValue("owneridentifier");
		var ledgername = app.getFormValue("ledgername");
		var ledgerdescription = app.getFormValue("ledgerdescription");
		console.log('description is ' + ledgerdescription);
		
		contract.setLocalOwner(owneraddress);
		contract.setLocalOwnerIdentifier(owneridentifier);
		contract.setLocalLedgerName(ledgername);
		contract.setLocalLedgerDescription(ledgerdescription);
		
		contracts.addContractObject(contract);
		
		global.saveContractObjects(contracts);
		
		app.setMessage("contract definition added");
		
		app.refreshDisplay();
	}
	
	handleModifyContract() {
		// watch-out, 'this' is defined as the context
		// of the calling object from event listener
		var global = Controllers.getGlobalClass().getGlobalObject();
		var app = global.getAppObject();
		var contracts = global.getContractsObject();

		var contractindex = app.getFormValue("contractindex");

		console.log("Controllers.handleModifyContract called for contract with index " + contractindex);
		
		var contract = contracts.getContractObjectFromKey(contractindex);
		
		if (contract) {
			var ledgerdescription = app.getFormValue("ledgerdescription");
			
			contract.setLocalDescription(ledgerdescription);
			
			if (contract.isLocalOnly()) {
				var owneraddress = app.getFormValue("owneraddress");
				var owneridentifier = app.getFormValue("owneridentifier");
				var ledgername = app.getFormValue("ledgername");
				
				contract.setLocalOwner(owneraddress);
				contract.setLocalOwnerIdentifier(owneridentifier);
				contract.setLocalLedgerName(ledgername);
			}
			
			global.saveContractObjects(contracts);
			
			app.setMessage("contract definition modified");

			app.refreshDisplay();
		}
		
	}
	
	handleDeployContract() {
		// watch-out, 'this' is defined as the context
		// of the calling object from event listener
		var global = Controllers.getGlobalClass().getGlobalObject();
		var app = global.getAppObject();
		var contracts = global.getContractsObject();

		var contractindex = app.getFormValue("contractindex");

		console.log("Controllers.handleDeployContract called for contract with index " + contractindex);
		
		var contract = contracts.getContractObjectFromKey(contractindex);
		
		if ((contract) && (contract.isLocalOnly())) {
			
			var session = global.getSessionObject();
			
			var owner = contract.getLocalOwner();
			var owningaccount = global.getAccountObject(owner);
			
			var wallet = app.getFormValue("wallet");
			var password = app.getFormValue("password");
			
			var gaslimit = app.getFormValue("gaslimit");
			var gasPrice = app.getFormValue("gasPrice");
			
			var payingaccount = global.getAccountObject(wallet);
			
			// unlock account
			payingaccount.unlock(password, 300); // 300s, but we can relock the account
			
			// check that current session impersonates the contract's owner
			
			if (!session.isSessionAccount(owningaccount)) {
				alert("You must be connected with the account of the contract's owner");
				console.log('owning account is ' + owner + ' session account is ' + session.getSessionAccountAddress());
				return;
			}
			
			try {
				contract.deploy(payingaccount, owningaccount, gaslimit, gasPrice, function (err, res) {
					
					if (!err) {
						console.log('contract deployed at ' + res);
						
						//contract.setAddress(res);
						
						// save local address
						global.saveContractObjects(contracts);
						
						app.setMessage("contract has been deployed at " + res);
					}
					else  {
						console.log('error deploying contract ' + err);
					}
						
				});
				
				app.setMessage("contract deployment created a pending transaction");
				
			}
			catch(e) {
				app.setMessage("Error: " + e);
			}
			

			app.refreshDisplay();
		}
		
	}
	
	// form
	handleSelectContractForm(){
		// watch-out, 'this' is defined as the context
		// of the calling object from event listener
		var global = Controllers.getGlobalClass().getGlobalObject();
		var app = global.getAppObject();

		var choice = this.getAttribute("param0");
		
		console.log("Controllers.handleSelectContractForm called for choice " + choice);

		if (choice == "create") {
			global.setCurrentFormBand(Global.FORM_CREATE_CONTRACT);
			global.setCurrentViewBand(Global.VIEW_CONTRACT_LIST);
		}
		else if (choice == "add") {
			global.setCurrentFormBand(Global.FORM_ADD_CONTRACT_ADDRESS);
			global.setCurrentViewBand(Global.VIEW_CONTRACT_LIST);
		}
		else if (choice == "modify") {
			global.setCurrentFormBand(Global.FORM_MODIFY_CONTRACT);
			global.setCurrentViewBand(Global.VIEW_CONTRACT);
		}
		else if (choice == "deploy") {
			global.setCurrentFormBand(Global.FORM_DEPLOY_CONTRACT);
			global.setCurrentViewBand(Global.VIEW_CONTRACT);
		}
		else if (choice == "deploy_shldr") {
			global.setCurrentFormBand(Global.FORM_DEPLOY_STAKEHOLDER);
			global.setCurrentViewBand(Global.VIEW_CONTRACT_STAKEHOLDER);
		}
		else if (choice == "modify_shldr") {
			global.setCurrentFormBand(Global.FORM_MODIFY_STAKEHOLDER);
			global.setCurrentViewBand(Global.VIEW_CONTRACT_STAKEHOLDER);
		}
		else if (choice == "deploy_issuance") {
			global.setCurrentFormBand(Global.FORM_DEPLOY_ISSUANCE);
			global.setCurrentViewBand(Global.VIEW_CONTRACT_ISSUANCE);
		}
		else if (choice == "modify_issuance") {
			global.setCurrentFormBand(Global.FORM_MODIFY_ISSUANCE);
			global.setCurrentViewBand(Global.VIEW_CONTRACT_ISSUANCE);
		}
		else if (choice == "deploy_transaction") {
			global.setCurrentFormBand(Global.FORM_DEPLOY_TRANSACTION);
			global.setCurrentViewBand(Global.VIEW_CONTRACT_TRANSACTION);
		}
		else if (choice == "modify_transaction") {
			global.setCurrentFormBand(Global.FORM_MODIFY_TRANSACTION);
			global.setCurrentViewBand(Global.VIEW_CONTRACT_TRANSACTION);
		}
		else {
			global.setCurrentFormBand(Global.FORM_ADD_CONTRACT_ADDRESS);
			global.setCurrentViewBand(Global.VIEW_CONTRACT_LIST);
		}

		app.refreshDisplay();
	}
	
	// views
	handleRefreshContractList() {
		console.log("Controllers.handleRefreshContractList called");

		var global = Controllers.getGlobalClass().getGlobalObject();
		var app = global.getAppObject();

		app.refreshDisplay();
		
		return;
	}
	
	handleRemoveContractFromList() {
		
		// watch-out, 'this' is defined as the context
		// of the calling object from event listener
		var global = Controllers.getGlobalClass().getGlobalObject();
		var app = global.getAppObject();
		var contracts = global.getContractsObject();

		var index = this.getAttribute("param0");
		var contracts = global.getContractsObject();
		
		console.log("Controllers.handleRemoveContractFromList called for contract index " + index);
		
		var contract = contracts.getContractObjectFromKey(index);
		
		contracts.removeContractObject(contract);

		global.saveContractObjects(contracts);

		app.refreshDisplay();
		
		return;
	}
	
	// navigation
	handleGotoContractPage() {
		// watch-out, 'this' is defined as the context
		// of the calling object from event listener
		var global = Controllers.getGlobalClass().getGlobalObject();
		var app = global.getAppObject();

		var index = this.getAttribute("param0");
		var contracts = global.getContractsObject();
		var contract = contracts.getContractObjectFromKey(index);
		
		console.log("Controllers.handleGotoContractPage called for contract " + contract.getAddress());

		var controllers = global.getControllersObject();
		
		global.setCurrentFormBand(Global.FORM_MODIFY_CONTRACT_ADDRESS);

		controllers.gotoContractPage(contract);
	}
	
	
	//
	// Accounts
	//
	
	// forms
	handleDeployAccount() {
		// watch-out, 'this' is defined as the context
		// of the calling object from event listener
		var global = Controllers.getGlobalClass().getGlobalObject();
		var session = global.getSessionObject();
		
		var app = global.getAppObject();
		var contracts = global.getContractsObject();

		var contractindex = app.getFormValue("contractindex");

		console.log("Controllers.handleDeployAccount called for contract with index " + contractindex);
		
		var contract = contracts.getContractObjectFromKey(contractindex);
		
		if (contract) {
			
			var acctprivkey = app.getFormValue("acctprivkey");
			
			var account = session.createBlankAccountObject();

			if (session.isValidPrivateKey(acctprivkey)) {
				
				account.setPrivateKey(acctprivkey);
				
				
				// payer for registration
				var wallet = app.getFormValue("wallet");
				var password = app.getFormValue("password");
				
				var gaslimit = app.getFormValue("gaslimit");
				var gasPrice = app.getFormValue("gasPrice");
				
				var payingaccount = global.getAccountObject(wallet);
				
				// unlock account
				payingaccount.unlock(password, 300); // 300s, but we can relock the account
				
				contract.finalizeInit(function(success) {
					
					if (!success) {
						
						app.setMessage("could not finalize the reading of the contract");
						
						return;
					}
					
					var owneraccount = contract.getOwnerAccount();
					console.log("contract owner is " + owneraccount.getAddress());
					console.log("session address is " + session.getSessionAccountAddress());
					
					
					contract.registerAccount(payingaccount, gaslimit, gasPrice, account, function (err, res) {
						if (!err) {
							console.log('account deployed at position ' + res);
							
							global.saveContractObjects(contracts);
							
							app.setMessage("account has been deployed at " + res);
							
							app.refreshDisplay();
						}
						else  {
							console.log('error deploying account ' + err);
						}
							
					});
					
					app.setMessage("account deployment created a pending transaction");
					
					return;

				});
					
					
					
				app.refreshDisplay();
				
			}
		}
		
	}
	
	
	
	//
	// StakeHolders
	//
	
	// forms
	handleCreateStakeHolder() {
		// watch-out, 'this' is defined as the context
		// of the calling object from event listener
		var global = Controllers.getGlobalClass().getGlobalObject();
		var app = global.getAppObject();
		var contracts = global.getContractsObject();

		var contractindex = app.getFormValue("contractindex");

		console.log("Controllers.handleCreateStakeHolder called for contract with index " + contractindex);
		
		var contract = contracts.getContractObjectFromKey(contractindex);
		
		if (contract) {
			var shldridentifier = app.getFormValue("shldridentifier");
			
			if ((shldridentifier) && (shldridentifier.length > 0)) {
				var stakeholder = global.createBlankStakeHolderObject();
				
				stakeholder.setLocalIdentifier(shldridentifier);
				
				contract.addLocalStakeHolder(stakeholder);
				
				global.saveContractObjects(contracts);
			}
		}
		
		app.setMessage("shareholder added, you have to register him/her on the blockchain before transfering securities");
		
		app.refreshDisplay();
		
	}
	
	handleModifyStakeHolder() {
		// watch-out, 'this' is defined as the context
		// of the calling object from event listener
		var global = Controllers.getGlobalClass().getGlobalObject();
		var app = global.getAppObject();
		var contracts = global.getContractsObject();

		var contractindex = app.getFormValue("contractindex");

		console.log("Controllers.handleModifyStakeHolder called for contract with index " + contractindex);
		
		var contract = contracts.getContractObjectFromKey(contractindex);
		
		if (contract) {
			
			var stakeholderindex = app.getFormValue("stakeholderindex");
			
			var stakeholder = contract.getStakeHolderFromKey(stakeholderindex);

			if (stakeholder) {
				
				if (stakeholder.isLocalOnly()) {
					var identifier = app.getFormValue("shldridentifier");
					
					stakeholder.setLocalIdentifier(identifier);
				}
				
				global.saveContractObjects(contracts);
				
				app.setMessage("shareholder definition modified");
				
			}
			

			app.refreshDisplay();
		}
		
	}
	
	handleDeployStakeHolder() {
		// watch-out, 'this' is defined as the context
		// of the calling object from event listener
		var global = Controllers.getGlobalClass().getGlobalObject();
		var app = global.getAppObject();
		var contracts = global.getContractsObject();

		var contractindex = app.getFormValue("contractindex");

		console.log("Controllers.handleDeployStakeHolder called for contract with index " + contractindex);
		
		var contract = contracts.getContractObjectFromKey(contractindex);
		
		if (contract) {
			
			var stakeholderindex = app.getFormValue("stakeholderindex");
			
			var stakeholder = contract.getStakeHolderFromKey(stakeholderindex);

			if ((stakeholder) && (stakeholder.isLocalOnly())) {
				
				var session = global.getSessionObject();
				
				// stakeholder data
				var shldridentifier = app.getFormValue("shldridentifier");
				
				var shldraddress = app.getFormValue("shldraddress");
				//var shldrpubkey = app.getFormValue("shldrpubkey");
				//var shldrprivkey = app.getFormValue("shldrprivkey");
				
				//var shldraddress;
				var shldrrsapubkey;
				var shldrprivkey;
				
				/*try {
					if ((shldrprivkey) && (!session.isValidPrivateKey(shldrprivkey))) {
						// isValidPrivateKey thows error if not valid
						shldrprivkey = null;
					}
					
				}
				catch(e) {
					console.log("error: " + e);
					console.log("private key submited is not valid " + shldrprivkey);
					shldrprivkey = null;
				}
				
				
				if (!shldrprivkey) {
					// generate private key
					shldrprivkey = session.generatePrivateKey();
					
					console.log("generated private key: " + shldrprivkey);
				}
				
				// get public key and address from private key
				var account = session.getAccountObjectFromPrivateKey(shldrprivkey);
				
				shldraddress = account.getAddress();
				shldrpubkey = account.getRsaPublicKey();

				
				stakeholder.setLocalIdentifier(shldridentifier);
				stakeholder.setLocalPrivKey(shldrprivkey);
				stakeholder.setAddress(shldraddress);
				stakeholder.setChainPubKey(shldrpubkey);*/
				
				// payer for registration
				var wallet = app.getFormValue("wallet");
				var password = app.getFormValue("password");
				
				var gaslimit = app.getFormValue("gaslimit");
				var gasPrice = app.getFormValue("gasPrice");
				
				var payingaccount = global.getAccountObject(wallet);
				
				// unlock account
				payingaccount.unlock(password, 300); // 300s, but we can relock the account
				
				contract.finalizeInit(function(success) {
					
					if (!success) {
						
						app.setMessage("could not finalize the reading of the contract");
						
						return;
					}
					
					var owneraccount = contract.getOwnerAccount();
					console.log("contract owner is " + owneraccount.getAddress());
					console.log("session address is " + session.getSessionAccountAddress());
					
					// check that current session is signed-in
					if (session.isAnonymous()) {
						alert("You must be signed-in to register a stakeholder");
						
						return;
					}
					
					var loadpromise;
					
					if ((shldraddress) && (session.isValidAddress(shldraddress))) {
						
						// we must load the lists to know if the address corresponds to a registered
						// account and if current session is a shareholder
						loadpromise = contract.loadChainAccountsAndStakeHolders(function(err, res) {
							if (!err) {
								console.log('loading contract\'s account and stakeholder lists finished successfully');
								
								return Promise.resolve(res);
							}
							else {
								console.log('error while loading lists: ' + err);
								
								return Promise.resolve(false);
							}
						});
					}
					else {
						loadpromise = Promise.resolve(true);
					}
					
					loadpromise.then(function(res) {
						console.log('load promise resolved with res = ' + res);
						
						if (res) {
							
							if ((shldraddress) && (session.isValidAddress(shldraddress))) {
								var account = contract.getChainAccountFromAddress(shldraddress);
								
								if (!account) {
									alert("Address provided must correspond to an account registered in the contract: " + shldraddress);
									
									return;									
								}
								
								
								
								if (!session.ownsContract(contract)) {
									var sessionaccountaddress = session.getSessionAccountAddress();
									
									if (!contract.getChainStakeHolderFromAddress(sessionaccountaddress)) {
										alert("You must be signed as one of the shareholder of the contract to create new shareholders");
										
										return;									
									}

								}
								
								shldraddress = account.getAddress();
								shldrrsapubkey = account.getRsaPublicKey();
								
							}
							else {
								if (session.ownsContract(contract)) {
									// generate private key
									shldrprivkey = session.generatePrivateKey();
									
									console.log("generated private key: " + shldrprivkey);
									
									var account = session.getAccountObjectFromPrivateKey(shldrprivkey);

									shldraddress = account.getAddress();
									shldrrsapubkey = account.getRsaPublicKey();
									
								}
								else {
									alert("You must be signed as the owner of the contract to register a shareholder without providing an address");
									
									return;									
									
								}
							}
							
							stakeholder.setLocalIdentifier(shldridentifier);
							
							stakeholder.setAddress(shldraddress);
							stakeholder.setChainRsaPubKey(shldrrsapubkey);
							
							if (shldrprivkey)
							stakeholder.setLocalPrivKey(shldrprivkey);
							
							
							contract.registerStakeHolder(payingaccount, gaslimit, gasPrice, stakeholder, function (err, res) {
								if (!err) {
									console.log('shareholder deployed at position ' + res);
									
									global.saveContractObjects(contracts);
									
									app.setMessage("shareholder has been deployed at " + res);
									
									app.refreshDisplay();
								}
								else  {
									console.log('error deploying shareholder ' + err);
								}
									
							});
							
						}
						else {
							console.log('problem loading lists prevents to register stakeholder');
						}
						
					});
						
					
					
					app.setMessage("shareholder deployment created a pending transaction");
					
					return;

				});
					
					
					
				app.refreshDisplay();
				
			}
		}
		
	}
	
	// views
	handleRemoveStakeHolderFromList() {
		// watch-out, 'this' is defined as the context
		// of the calling object from event listener
		var global = Controllers.getGlobalClass().getGlobalObject();
		var app = global.getAppObject();
		var contracts = global.getContractsObject();

		var contractindex = this.getAttribute("param0");
		var stakeholderindex = this.getAttribute("param1");

		var contracts = global.getContractsObject();
		
		console.log("Controllers.handleRemoveStakeHolderFromList called for contract index " + contractindex);
		
		var contract = contracts.getContractObjectFromKey(contractindex);
		

		if (contract) {
			var stakeholder = contract.getStakeHolderFromKey(stakeholderindex);
			
			contract.removeStakeHolderObject(stakeholder);

			global.saveContractObjects(contracts);

			app.refreshDisplay();
		}
		
	}

	
	// navigation
	handleGotoAccountListPage() {
		// watch-out, 'this' is defined as the context
		// of the calling object from event listener
		var global = Controllers.getGlobalClass().getGlobalObject();
		var app = global.getAppObject();

		var contractindex = this.getAttribute("param0");
		
		if (!contractindex) {
			// we look if we are not called from a button click
			contractindex = app.getFormValue("contractindex");
		}

		console.log("Controllers.handleGotoAccountListPage called for contract index " + contractindex);
		
		var contracts = global.getContractsObject();
		var contract = contracts.getContractObjectFromKey(contractindex);

		var controllers = global.getControllersObject();

		controllers.gotoContractAccountListPage(contract);
		
	}
	
	handleGotoStakeHolderListPage() {
		// watch-out, 'this' is defined as the context
		// of the calling object from event listener
		var global = Controllers.getGlobalClass().getGlobalObject();
		var app = global.getAppObject();

		var contractindex = this.getAttribute("param0");

		console.log("Controllers.handleGotoStakeHolderListPage called for contract index " + contractindex);
		
		var contracts = global.getContractsObject();
		var contract = contracts.getContractObjectFromKey(contractindex);

		var controllers = global.getControllersObject();

		controllers.gotoContractStakeHolderListPage(contract);
		
	}
	
	handleGotoStakeHolderPage() {
		// watch-out, 'this' is defined as the context
		// of the calling object from event listener
		var global = Controllers.getGlobalClass().getGlobalObject();
		var app = global.getAppObject();

		var contractindex = this.getAttribute("param0");
		var stakeholderindex = this.getAttribute("param1");

		console.log("Controllers.handleGotoStakeHolderPage called for contract index " + contractindex + " and stakeholderindex " + stakeholderindex);
		
		var contracts = global.getContractsObject();
		var contract = contracts.getContractObjectFromKey(contractindex);

		var controllers = global.getControllersObject();

		if (contract) {
			var stakeholder = contract.getStakeHolderFromKey(stakeholderindex);
			console.log("Controllers.handleGotoStakeHolderPage called for stakeholderindex " + stakeholderindex);			
			controllers.gotoContractStakeHolderPage(contract, stakeholder);
		}
		
	}
	
	//
	// Issuances
	//
	
	// forms
	handleCreateIssuance() {
		// watch-out, 'this' is defined as the context
		// of the calling object from event listener
		var global = Controllers.getGlobalClass().getGlobalObject();
		var app = global.getAppObject();
		var contracts = global.getContractsObject();

		var contractindex = app.getFormValue("contractindex");

		console.log("Controllers.handleCreateIssuance called for contract with index " + contractindex);
		
		var contract = contracts.getContractObjectFromKey(contractindex);
		
		if (contract) {
			var issuancename = app.getFormValue("issuancename");
			var issuancedescription = app.getFormValue("issuancedescription");
			var numberofshares = app.getFormValue("numberofshares");
			var percentofcapital = app.getFormValue("percentofcapital");
			
			
			var issuance = global.createBlankStockIssuanceObject();
			
			issuance.setLocalName(issuancename);
			issuance.setLocalDescription(issuancedescription);
			issuance.setLocalNumberOfShares(numberofshares);
			issuance.setLocalPercentOfCapital(percentofcapital);
			
			contract.addLocalIssuance(issuance);
			
			global.saveContractObjects(contracts);
		}

		app.setMessage("issuance added, you have to register it on the blockchain before transfering securities");
		
		app.refreshDisplay();
		
	}
	
	handleModifyIssuance() {
		// watch-out, 'this' is defined as the context
		// of the calling object from event listener
		var global = Controllers.getGlobalClass().getGlobalObject();
		var app = global.getAppObject();
		var contracts = global.getContractsObject();

		var contractindex = app.getFormValue("contractindex");
		var issuanceindex = app.getFormValue("issuanceindex");

		var contracts = global.getContractsObject();
		
		console.log("Controllers.handleModifyIssuance called for contract index " + contractindex + " and issuance index " + issuanceindex);
		
		var contract = contracts.getContractObjectFromKey(contractindex);
		

		if (contract) {
			var issuance = contract.getIssuanceFromKey(issuanceindex);
			
			if (issuance) {
				console.log("modifying issuance with index " + issuanceindex);
				
				var issuancename = app.getFormValue("issuancename");
				var issuancedescription = app.getFormValue("issuancedescription");
				var numberofshares = app.getFormValue("numberofshares");
				var percentofcapital = app.getFormValue("percentofcapital");
				
				
				issuance.setLocalName(issuancename);
				issuance.setLocalDescription(issuancedescription);
				issuance.setLocalNumberOfShares(numberofshares);
				issuance.setLocalPercentOfCapital(percentofcapital);

				global.saveContractObjects(contracts);

				app.setMessage("issuance has been modified");

				app.refreshDisplay();
				
			}
			
		}
		
	}

	handleDeployIssuance() {
		// watch-out, 'this' is defined as the context
		// of the calling object from event listener
		var global = Controllers.getGlobalClass().getGlobalObject();
		var app = global.getAppObject();
		var contracts = global.getContractsObject();

		var contractindex = app.getFormValue("contractindex");
		var issuanceindex = app.getFormValue("issuanceindex");

		var contracts = global.getContractsObject();
		
		console.log("Controllers.handleDeployIssuance called for contract index " + contractindex + " and issuance index " + issuanceindex);
		
		var contract = contracts.getContractObjectFromKey(contractindex);
		

		if (contract) {
			var issuance = contract.getIssuanceFromKey(issuanceindex);
			
			if (issuance) {
				
				var session = global.getSessionObject();

				var issuancename = app.getFormValue("issuancename");
				var issuancedescription = app.getFormValue("issuancedescription");
				var numberofshares = app.getFormValue("numberofshares");
				var percentofcapital = app.getFormValue("percentofcapital");
				
				
				issuance.setLocalName(issuancename);
				issuance.setLocalDescription(issuancedescription);
				issuance.setLocalNumberOfShares(numberofshares);
				issuance.setLocalPercentOfCapital(percentofcapital);

				// payer for registration
				var wallet = app.getFormValue("wallet");
				var password = app.getFormValue("password");
				
				var gaslimit = app.getFormValue("gaslimit");
				var gasPrice = app.getFormValue("gasPrice");
				
				var payingaccount = global.getAccountObject(wallet);
				
				// unlock account
				payingaccount.unlock(password, 300); // 300s, but we can relock the account
				
				contract.finalizeInit(function(success) {
					
					if (!success) {
						
						app.setMessage("could not finalize the reading of the contract");
						
						return;
					}
					
					// check that current session impersonates the contract's owner
					var owneraccount = contract.getOwnerAccount();
					
					if (!session.isSessionAccount(owneraccount)) {
						alert("You must be connected with the account of the contract's owner");
						
						return;
					}
					
					contract.registerIssuance(payingaccount, gaslimit, gasPrice, issuance, function (err, res) {
						
						if (!err) {
							console.log('issuance deployed at position ' + res);
							
							global.saveContractObjects(contracts);
							
							app.setMessage("issuance has been deployed at " + res);
							
							app.refreshDisplay();
						}
						else  {
							console.log('error deploying issuance ' + err);
						}
						
						app.setMessage("issuance deployment created a pending transaction");
						
						return;
					});
				
				});

				app.refreshDisplay();
			}

		}
		
	}

	
	// views
	handleRemoveIssuanceFromList() {
		// watch-out, 'this' is defined as the context
		// of the calling object from event listener
		var global = Controllers.getGlobalClass().getGlobalObject();
		var app = global.getAppObject();
		var contracts = global.getContractsObject();

		var contractindex = this.getAttribute("param0");
		var issuanceindex = this.getAttribute("param1");

		var contracts = global.getContractsObject();
		
		console.log("Controllers.handleRemoveIssuanceFromList called for contract index " + contractindex);
		
		var contract = contracts.getContractObjectFromKey(contractindex);
		

		if (contract) {
			var issuance = contract.getIssuanceFromKey(issuanceindex);
			
			contract.removeIssuanceObject(issuance);

			global.saveContractObjects(contracts);

			app.refreshDisplay();
		}
		
	}

	
	// navigation
	handleGotoIssuanceListPage() {
		// watch-out, 'this' is defined as the context
		// of the calling object from event listener
		var global = Controllers.getGlobalClass().getGlobalObject();
		var app = global.getAppObject();

		var contractindex = this.getAttribute("param0");

		console.log("Controllers.handleGotoIssuanceListPage called for contract index " + contractindex);
		
		var contracts = global.getContractsObject();
		var contract = contracts.getContractObjectFromKey(contractindex);

		var controllers = global.getControllersObject();

		controllers.gotoContractIssuanceListPage(contract);
		
	}
	
	handleGotoIssuancePage() {
		// watch-out, 'this' is defined as the context
		// of the calling object from event listener
		var global = Controllers.getGlobalClass().getGlobalObject();
		var app = global.getAppObject();

		var contractindex = this.getAttribute("param0");
		var issuanceindex = this.getAttribute("param1");

		console.log("Controllers.handleGotoIssuancePage called for contract index " + contractindex + " and issuanceindex " + issuanceindex);
		
		var contracts = global.getContractsObject();
		var contract = contracts.getContractObjectFromKey(contractindex);

		var controllers = global.getControllersObject();

		if (contract) {
			var issuance = contract.getIssuanceFromKey(issuanceindex);
			controllers.gotoContractIssuancePage(contract, issuance);
		}
		
	}
	
	//
	// Transactions
	//
	
	handleCreateTransaction() {
		// watch-out, 'this' is defined as the context
		// of the calling object from event listener
		var global = Controllers.getGlobalClass().getGlobalObject();
		var app = global.getAppObject();
		var contracts = global.getContractsObject();

		var contractindex = app.getFormValue("contractindex");

		console.log("Controllers.handleCreateTransaction called for contract with index " + contractindex);
		
		var contract = contracts.getContractObjectFromKey(contractindex);
		
		if (contract) {
			var from = app.getFormValue("from");
			var to = app.getFormValue("to");
			var issuancenumber = app.getFormValue("issuancenumber");
			var numberofshares = app.getFormValue("numberofshares");
			var consideration = app.getFormValue("consideration");
			var currency = app.getFormValue("currency");
			
			
			var transaction = global.createBlankStockTransactionObject();
			
			transaction.setLocalFrom(from);
			transaction.setLocalTo(to);
			transaction.setLocalIssuanceNumber(issuancenumber);
			transaction.setLocalNumberOfShares(numberofshares);
			transaction.setLocalConsideration(consideration);
			transaction.setLocalCurrency(currency);
			
			contract.addLocalTransaction(transaction);
			
			global.saveContractObjects(contracts);
		}

		app.setMessage("transaction added, you have to register it on the blockchain to make it permanent");
		
		app.refreshDisplay();
		
	}
	
	handleModifyTransaction() {
		// watch-out, 'this' is defined as the context
		// of the calling object from event listener
		var global = Controllers.getGlobalClass().getGlobalObject();
		var app = global.getAppObject();
		var contracts = global.getContractsObject();

		var contractindex = app.getFormValue("contractindex");
		var transactionindex = app.getFormValue("transactionindex");

		var contracts = global.getContractsObject();
		
		console.log("Controllers.handleModifyTransaction called for contract index " + contractindex + " and transaction index " + transactionindex);
		
		var contract = contracts.getContractObjectFromKey(contractindex);
		

		if (contract) {
			var transaction = contract.getTransactionFromKey(transactionindex);
			
			if (transaction) {
				console.log("modifying transaction with index " + transactionindex);
				
				var from = app.getFormValue("from");
				var to = app.getFormValue("to");
				var issuancenumber = app.getFormValue("issuancenumber");
				var numberofshares = app.getFormValue("numberofshares");
				var consideration = app.getFormValue("consideration");
				var currency = app.getFormValue("currency");
				
				
				transaction.setLocalFrom(from);
				transaction.setLocalTo(to);
				transaction.setLocalIssuanceNumber(issuancenumber);
				transaction.setLocalNumberOfShares(numberofshares);
				transaction.setLocalConsideration(consideration);
				transaction.setLocalCurrency(currency);

				global.saveContractObjects(contracts);

				app.setMessage("transaction has been modified");

				app.refreshDisplay();
				
			}
			
		}
		
	}

	handleDeployTransaction() {
		// watch-out, 'this' is defined as the context
		// of the calling object from event listener
		var global = Controllers.getGlobalClass().getGlobalObject();
		var app = global.getAppObject();
		var session = global.getSessionObject();
		
		var contracts = global.getContractsObject();

		var contractindex = app.getFormValue("contractindex");
		var transactionindex = app.getFormValue("transactionindex");

		var contracts = global.getContractsObject();
		
		console.log("Controllers.handleDeployTransaction called for contract index " + contractindex + " and transaction index " + transactionindex);
		
		var contract = contracts.getContractObjectFromKey(contractindex);
		

		if (contract) {
			var transaction = contract.getTransactionFromKey(transactionindex);
			
			if (transaction) {
				console.log("deploying transaction with index " + transactionindex);
				

				var from = app.getFormValue("from");
				var to = app.getFormValue("to");
				var issuancenumber = app.getFormValue("issuancenumber");
				var numberofshares = app.getFormValue("numberofshares");
				var consideration = app.getFormValue("consideration");
				var currency = app.getFormValue("currency");
				
				
				transaction.setLocalFrom(from);
				transaction.setLocalTo(to);
				transaction.setLocalIssuanceNumber(issuancenumber);
				transaction.setLocalNumberOfShares(numberofshares);
				transaction.setLocalConsideration(consideration);
				transaction.setLocalCurrency(currency);
				
				// nature depends from the current signed account
				// owner => 1 (transfer), shareholder =>11 (endorsement record)
				if (session.ownsContract(contract))
						transaction.setLocalNature(1); // transfer
				else
					transaction.setLocalNature(11); // record

				// payer for registration
				var wallet = app.getFormValue("wallet");
				var password = app.getFormValue("password");
				
				var gaslimit = app.getFormValue("gaslimit");
				var gasPrice = app.getFormValue("gasPrice");
				
				var payingaccount = global.getAccountObject(wallet);
				
				// unlock account
				payingaccount.unlock(password, 300); // 300s, but we can relock the account
				
				// check that current session is signed-in
				if (session.isAnonymous()) {
					alert("You must be signed-in to register a transaction");
					
					return;
				}
					
				contract.registerTransaction(payingaccount, gaslimit, gasPrice, transaction, function (err, res) {
					
					if (!err) {
						console.log('transaction deployed at position ' + res);
						
						global.saveContractObjects(contracts);
						
						app.setMessage("transaction has been deployed at " + res);
						
						app.refreshDisplay();
					}
					else  {
						console.log('error deploying transaction ' + err);
					}
						
				});
				
				app.setMessage("transaction deployment created a pending blockchain transaction");
			}


			app.refreshDisplay();
		}
		
	}

	
	// views
	handleRemoveTransactionFromList() {
		// watch-out, 'this' is defined as the context
		// of the calling object from event listener
		var global = Controllers.getGlobalClass().getGlobalObject();
		var app = global.getAppObject();
		var contracts = global.getContractsObject();

		var contractindex = this.getAttribute("param0");
		var transactionindex = this.getAttribute("param1");

		var contracts = global.getContractsObject();
		
		console.log("Controllers.handleRemoveTransactionFromList called for contract index " + contractindex);
		
		var contract = contracts.getContractObjectFromKey(contractindex);
		

		if (contract) {
			var transaction = contract.getTransactionFromKey(transactionindex);
			
			contract.removeTransactionObject(transaction);

			global.saveContractObjects(contracts);

			app.refreshDisplay();
		}
		
	}

	
	// navigation
	handleGotoTransactionListPage() {
		// watch-out, 'this' is defined as the context
		// of the calling object from event listener
		var global = Controllers.getGlobalClass().getGlobalObject();
		var app = global.getAppObject();

		var contractindex = this.getAttribute("param0");

		console.log("Controllers.handleGotoTransactionListPage called for contract index " + contractindex);
		
		var contracts = global.getContractsObject();
		var contract = contracts.getContractObjectFromKey(contractindex);

		var controllers = global.getControllersObject();

		controllers.gotoContractTransactionListPage(contract);
		
	}
	
	handleGotoTransactionPage() {
		// watch-out, 'this' is defined as the context
		// of the calling object from event listener
		var global = Controllers.getGlobalClass().getGlobalObject();
		var app = global.getAppObject();

		var contractindex = this.getAttribute("param0");
		var transactionindex = this.getAttribute("param1");

		console.log("Controllers.handleGotoTransactionPage called for contract index " + contractindex + " and transactionindex " + transactionindex);
		
		var contracts = global.getContractsObject();
		var contract = contracts.getContractObjectFromKey(contractindex);

		var controllers = global.getControllersObject();

		if (contract) {
			var transaction = contract.getTransactionFromKey(transactionindex);
			controllers.gotoContractTransactionPage(contract, transaction);
		}
		
	}
	
	// static
	static getGlobalClass() {
		return GlobalClass;
	}
	
	static setGlobalClass(globalclass) {
		GlobalClass = globalclass;
	}
	
}

GlobalClass.Controllers = Controllers;