'use strict';

var DAPPControllers = class {
	
	constructor(global) {
		this.global = global;
		this.app = null; // filled in registerControllers
		
		this.name = 'securities';
		
		// views
		var SecuritiesViews = global.getModuleObject('dapps').SecuritiesAngularViews;
		this.securitiesviews = new SecuritiesViews(global);
	}
	
	getAppObject() {
		return this.app;
	}
	
	getAngularControllers() {
		var mvcmodule = this.global.getModuleObject('mvc');
		
		return mvcmodule.getControllersObject();
	}
	
	registerControllers(app) {
		console.log("Controllers.registerControllers called for " + this.name);
		
		this.app = app;
		
		var global = this.global;
		
		var angular_app = app.getAngularApp();
		var controllers = this;

		
		//
		// registering controllers
		//
		
		
		//
		// Controllers for views
		//
		
		// templates
		
		// partials
		
		// list of stock ledgers
		angular_app.controller("StockLedgersViewCtrl",  ['$scope', function ($scope) {
			controllers.prepareStockLedgersView($scope);
		}]);
		
		// stock ledger view
		angular_app.controller("StockLedgerViewCtrl",  ['$scope', '$state', '$stateParams', function ($scope, $state, $stateParams) {
			controllers.prepareStockLedgerView($scope, $state, $stateParams);
		}]);
		
		// list of accounts
		angular_app.controller("AccountsViewCtrl",  ['$scope', '$state', '$stateParams', function ($scope, $state, $stateParams) {
			controllers.prepareAccountsView($scope, $state, $stateParams);
		}]);
		
		
		// list of shareholders
		angular_app.controller("ShareHoldersViewCtrl",  ['$scope', '$state', '$stateParams', function ($scope, $state, $stateParams) {
			controllers.prepareShareHoldersView($scope, $state, $stateParams);
		}]);
		
		// shareholder view
		angular_app.controller("ShareHolderViewCtrl",  ['$scope', '$state', '$stateParams', function ($scope, $state, $stateParams) {
			controllers.prepareShareHolderView($scope, $state, $stateParams);
		}]);
		
		// list of issuances
		angular_app.controller("IssuancesViewCtrl",  ['$scope', '$state', '$stateParams', function ($scope, $state, $stateParams) {
			controllers.prepareIssuancesView($scope, $state, $stateParams);
		}]);
		
		// issuance view
		angular_app.controller("IssuanceViewCtrl",  ['$scope', '$state', '$stateParams', function ($scope, $state, $stateParams) {
			controllers.prepareIssuanceView($scope, $state, $stateParams);
		}]);
		
		// list of transactions
		angular_app.controller("TransactionsViewCtrl",  ['$scope', '$state', '$stateParams', function ($scope, $state, $stateParams) {
			controllers.prepareTransactionsView($scope, $state, $stateParams);
		}]);
		
		// transaction view
		angular_app.controller("TransactionViewCtrl",  ['$scope', '$state', '$stateParams', function ($scope, $state, $stateParams) {
			controllers.prepareTransactionView($scope, $state, $stateParams);
		}]);
		
		
		//
		// Controllers for forms
		//
		
		// stock ledgers
		angular_app.controller("StockLedgerCreateFormCtrl", ['$scope', function ($scope) {
			controllers.prepareStockLedgerCreateForm($scope);
		}]);
		
		
		angular_app.controller("StockLedgerImportFormCtrl", ['$scope', function ($scope) {
			controllers.prepareStockLedgerImportForm($scope);
		}]);

		angular_app.controller("StockLedgerModifyFormCtrl", ['$scope', '$state', '$stateParams', function ($scope, $state, $stateParams) {
			controllers.prepareStockLedgerModifyForm($scope, $state, $stateParams);
		}]);
		
		angular_app.controller("StockLedgerDeployFormCtrl", ['$scope', '$state', '$stateParams', function ($scope, $state, $stateParams) {
			controllers.prepareStockLedgerDeployForm($scope, $state, $stateParams);
		}]);
		
		// accounts
		angular_app.controller("AccountCreateFormCtrl", ['$scope', '$state', '$stateParams', function ($scope, $state, $stateParams) {
			controllers.prepareAccountCreateForm($scope, $state, $stateParams);
		}]);
		
		
		// shareholders
		angular_app.controller("ShareHolderCreateFormCtrl", ['$scope', '$state', '$stateParams', function ($scope, $state, $stateParams) {
			controllers.prepareShareHolderCreateForm($scope, $state, $stateParams);
		}]);
		
		angular_app.controller("ShareHolderModifyFormCtrl", ['$scope', '$state', '$stateParams', function ($scope, $state, $stateParams) {
			controllers.prepareShareHolderModifyForm($scope, $state, $stateParams);
		}]);
		
		angular_app.controller("ShareHolderDeployFormCtrl", ['$scope', '$state', '$stateParams', function ($scope, $state, $stateParams) {
			controllers.prepareShareHolderDeployForm($scope, $state, $stateParams);
		}]);
		
		// issuances
		angular_app.controller("IssuanceCreateFormCtrl", ['$scope', '$state', '$stateParams', function ($scope, $state, $stateParams) {
			controllers.prepareIssuanceCreateForm($scope, $state, $stateParams);
		}]);
		
		angular_app.controller("IssuanceModifyFormCtrl", ['$scope', '$state', '$stateParams', function ($scope, $state, $stateParams) {
			controllers.prepareIssuanceModifyForm($scope, $state, $stateParams);
		}]);
		
		angular_app.controller("IssuanceDeployFormCtrl", ['$scope', '$state', '$stateParams', function ($scope, $state, $stateParams) {
			controllers.prepareIssuanceDeployForm($scope, $state, $stateParams);
		}]);
		
		// transactions
		angular_app.controller("TransactionCreateFormCtrl", ['$scope', '$state', '$stateParams', function ($scope, $state, $stateParams) {
			controllers.prepareTransactionCreateForm($scope, $state, $stateParams);
		}]);
		
		angular_app.controller("TransactionModifyFormCtrl", ['$scope', '$state', '$stateParams', function ($scope, $state, $stateParams) {
			controllers.prepareTransactionModifyForm($scope, $state, $stateParams);
		}]);
		
		angular_app.controller("TransactionDeployFormCtrl", ['$scope', '$state', '$stateParams', function ($scope, $state, $stateParams) {
			controllers.prepareTransactionDeployForm($scope, $state, $stateParams);
		}]);
		
		//
		// Handlers for requests (clicks, forms,..)
		//
		
		// stock ledgers
		angular_app.controller("StockLedgerRemoveRequestHandler", ['$scope','$state', '$stateParams', function ($scope, $state, $stateParams) {
			controllers.handleRemoveStockLedgerFromListRequest($scope, $state, $stateParams);
		}]);
		
	
		// shareholders
		angular_app.controller("ShareHolderRemoveRequestHandler", ['$scope','$state', '$stateParams', function ($scope, $state, $stateParams) {
			controllers.handleRemoveShareHolderFromListRequest($scope, $state, $stateParams);
		}]);
		
		
		// issuances
		angular_app.controller("IssuanceRemoveRequestHandler", ['$scope','$state', '$stateParams', function ($scope, $state, $stateParams) {
			controllers.handleRemoveIssuanceFromListRequest($scope, $state, $stateParams);
		}]);
		
		// transactions
		angular_app.controller("TransactionRemoveRequestHandler", ['$scope','$state', '$stateParams', function ($scope, $state, $stateParams) {
			controllers.handleRemoveTransactionFromListRequest($scope, $state, $stateParams);
		}]);
	}

	registerStates($stateProvider) {
		var global = this.global;
		
		$stateProvider
	    .state('home.stockledgers', {url: '/stockledgers', views: {'main@': {templateUrl: './dapps/securities/angular-ui/templates/stockledgers.html', controller: "PageRequestHandler",}},
	        ncyBreadcrumb: { label: global.t('Stock Ledgers') }})
	    .state('home.stockledgers.create', {url: '/create', views: {'main@': {templateUrl: './dapps/securities/angular-ui/templates/stockledger-create.html', controller: "PageRequestHandler",}},
	        ncyBreadcrumb: { label: global.t('Create') }})
	    .state('home.stockledgers.import', {url: '/import', views: {'main@': {templateUrl: './dapps/securities/angular-ui/templates/stockledger-import.html', controller: "PageRequestHandler",}},
	        ncyBreadcrumb: { label: global.t('Import') }})
	    .state('home.stockledgers.modify', {url: '/modify/:uuid', views: {'main@': {templateUrl: './dapps/securities/angular-ui/templates/stockledger-modify.html', controller: "PageRequestHandler",}},
	        ncyBreadcrumb: { label: global.t('Modify') }})
	    .state('home.stockledgers.deploy', {url: '/deploy/:uuid', views: {'main@': {templateUrl: './dapps/securities/angular-ui/templates/stockledger-deploy.html', controller: "PageRequestHandler",}},
	        ncyBreadcrumb: { label: global.t('Publish') }})
	    .state('home.stockledgers.view', {url: '/view/:uuid', views: {'main@': {templateUrl: './dapps/securities/angular-ui/templates/stockledger-view.html', controller: "PageRequestHandler",}},
	        ncyBreadcrumb: { label: global.t('View') }})
	    .state('home.stockledgers.delete', {url: '/delete/:uuid', views: {'main@': {controller: "StockLedgerRemoveRequestHandler",}},
	        ncyBreadcrumb: { label: global.t('Delete') }})
	    .state('home.stockledgers.accounts', {url: '/accounts/:uuid', views: {'main@': {templateUrl: './dapps/securities/angular-ui/templates/accounts.html', controller: "PageRequestHandler",}},
	        ncyBreadcrumb: { label: global.t('Accounts') }})
	    .state('home.stockledgers.shareholders', {url: '/shareholders/:uuid', views: {'main@': {templateUrl: './dapps/securities/angular-ui/templates/shareholders.html', controller: "PageRequestHandler",}},
	        ncyBreadcrumb: { label: global.t('Shareholders') }})
	    .state('home.stockledgers.shareholders.modify', {url: '/modify/:index', views: {'main@': {templateUrl: './dapps/securities/angular-ui/templates/shareholder-modify.html', controller: "PageRequestHandler",}},
	        ncyBreadcrumb: { label: global.t('Modify') }})
	    .state('home.stockledgers.shareholders.deploy', {url: '/deploy/:index', views: {'main@': {templateUrl: './dapps/securities/angular-ui/templates/shareholder-deploy.html', controller: "PageRequestHandler",}},
	        ncyBreadcrumb: { label: global.t('Publish') }})
	    .state('home.stockledgers.shareholders.view', {url: '/view/:index', views: {'main@': {templateUrl: './dapps/securities/angular-ui/templates/shareholder-view.html', controller: "PageRequestHandler",}},
	        ncyBreadcrumb: { label: global.t('View') }})
	    .state('home.stockledgers.shareholders.delete', {url: '/delete/:index', views: {'main@': {controller: "ShareHolderRemoveRequestHandler",}},
	        ncyBreadcrumb: { label: global.t('Delete') }})
	    .state('home.stockledgers.issuances', {url: '/issuances/:uuid', views: {'main@': {templateUrl: './dapps/securities/angular-ui/templates/issuances.html', controller: "PageRequestHandler",}},
	        ncyBreadcrumb: { label: global.t('Issuances') }})
	    .state('home.stockledgers.issuances.modify', {url: '/modify/:index', views: {'main@': {templateUrl: './dapps/securities/angular-ui/templates/issuance-modify.html', controller: "PageRequestHandler",}},
	        ncyBreadcrumb: { label: global.t('Modify') }})
	    .state('home.stockledgers.issuances.deploy', {url: '/deploy/:index', views: {'main@': {templateUrl: './dapps/securities/angular-ui/templates/issuance-deploy.html', controller: "PageRequestHandler",}},
	        ncyBreadcrumb: { label: global.t('Publish') }})
	    .state('home.stockledgers.issuances.view', {url: '/view/:index', views: {'main@': {templateUrl: './dapps/securities/angular-ui/templates/issuance-view.html', controller: "PageRequestHandler",}},
	        ncyBreadcrumb: { label: global.t('View') }})
	    .state('home.stockledgers.issuances.delete', {url: '/delete/:index', views: {'main@': {controller: "IssuanceRemoveRequestHandler",}},
	        ncyBreadcrumb: { label: global.t('Delete') }})
	    .state('home.stockledgers.transactions', {url: '/transactions/:uuid', views: {'main@': {templateUrl: './dapps/securities/angular-ui/templates/transactions.html', controller: "PageRequestHandler",}},
	        ncyBreadcrumb: { label: global.t('Transactions') }})
	    .state('home.stockledgers.transactions.modify', {url: '/modify/:index', views: {'main@': {templateUrl: './dapps/securities/angular-ui/templates/transaction-modify.html', controller: "PageRequestHandler",}},
	        ncyBreadcrumb: { label: global.t('Modify') }})
	    .state('home.stockledgers.transactions.deploy', {url: '/deploy/:index', views: {'main@': {templateUrl: './dapps/securities/angular-ui/templates/transaction-deploy.html', controller: "PageRequestHandler",}},
	        ncyBreadcrumb: { label: global.t('Publish') }})
	    .state('home.stockledgers.transactions.view', {url: '/view/:index', views: {'main@': {templateUrl: './dapps/securities/angular-ui/templates/transaction-view.html', controller: "PageRequestHandler",}},
	        ncyBreadcrumb: { label: global.t('View') }})
	    .state('home.stockledgers.transactions.delete', {url: '/delete/:index', views: {'main@': {controller: "TransactionRemoveRequestHandler",}},
	        ncyBreadcrumb: { label: global.t('Delete') }})
	}

	
	//
	// Requests
	//
	
	handleRemoveStockLedgerFromListRequest($scope, $state, $stateParams) {
		console.log("Controllers.handleRemoveStockLedgerFromListRequest called");
	    
		var self = this;
		var global = this.global;
		var app = this.getAppObject();

	    var contractuuid = $stateParams.uuid;

	    var global = this.global;
	    
		var commonmodule = global.getModuleObject('common');
		var session = commonmodule.getSessionObject();
	    
		var stockledgermodule = global.getModuleObject('securities');
		var stockledgercontrollers = stockledgermodule.getControllersObject();
		
		var stockledgercontract = stockledgercontrollers.getStockLedgerFromUUID(contractuuid);
		
		if (stockledgercontract) {
			if (confirm('Are you sure you want to remove "' + stockledgercontract.getLocalLedgerDescription() + '"?')) {
				stockledgercontrollers.removeStockLedgerObject(stockledgercontract);
				
				stockledgercontrollers.saveStockLedgers(function(err, res) {
					self.getAngularControllers().gotoStatePage('home.stockledgers');
				});
			}
			else {
				this.getAngularControllers().gotoStatePage('home.stockledgers');
			}
		}
		else {
			alert(contractuuid + 'not found');
			
			this.getAngularControllers().gotoStatePage('home.stockledgers');
		}
		
	}
		  
	handleRemoveShareHolderFromListRequest($scope, $state, $stateParams) {
		console.log("Controllers.handleRemoveShareHolderFromListRequest called");
	    
		var self = this;
		var global = this.global;
		var app = this.getAppObject();

	    var contractuuid = $stateParams.uuid;
		var stakeholderindex = $stateParams.index;

	    var global = this.global;
	    
		var commonmodule = global.getModuleObject('common');
		var session = commonmodule.getSessionObject();
	    
		var stockledgermodule = global.getModuleObject('securities');
		var stockledgercontrollers = stockledgermodule.getControllersObject();
		
		var stockledgercontract = stockledgercontrollers.getStockLedgerFromUUID(contractuuid);
		
		if (stockledgercontract) {
			var stakeholder = stockledgercontract.getStakeHolderFromKey(stakeholderindex);
			
			if (stakeholder) {
				if (confirm('Are you sure you want to remove "' + stakeholder.getLocalIdentifier() + '"?')) {
				    var contractuuid = $stateParams.uuid;
				    
					stockledgercontract.removeStakeHolderObject(stakeholder);

					stockledgercontrollers.saveStockLedgerObject(stockledgercontract, function(err, res) {
						var params = {uuid: contractuuid}
						self.getAngularControllers().gotoStatePage('home.stockledgers.shareholders', params);
					});

				}
				else {
					var params = {uuid: contractuuid}
					this.getAngularControllers().gotoStatePage('home.stockledgers.shareholders', params);
				}
			}
			else {
				alert('could not find share holder ' + stakeholderindex);
				
				var params = {uuid: contractuuid}
				this.getAngularControllers().gotoStatePage('home.stockledgers.shareholders', params);
			}
			
		}
		else {
			alert(contractuuid + 'not found');
			
			this.getAngularControllers().gotoStatePage('home.stockledgers');
		}
		
	}
		  
	handleRemoveIssuanceFromListRequest($scope, $state, $stateParams) {
		console.log("Controllers.handleRemoveIssuanceFromListRequest called");
	    
		var self = this;
		var global = this.global;
		var app = this.getAppObject();

	    var contractuuid = $stateParams.uuid;
		var issuanceindex = $stateParams.index;

	    var global = this.global;
	    
		var commonmodule = global.getModuleObject('common');
		var session = commonmodule.getSessionObject();
	    
		var stockledgermodule = global.getModuleObject('securities');
		var stockledgercontrollers = stockledgermodule.getControllersObject();
		
		var stockledgercontract = stockledgercontrollers.getStockLedgerFromUUID(contractuuid);
		
		if (stockledgercontract) {
			var issuance = stockledgercontract.getIssuanceFromKey(issuanceindex);
			
			if (issuance) {
				if (confirm('Are you sure you want to remove "' + issuance.getLocalName() + '"?')) {
				    var contractuuid = $stateParams.uuid;
				    
					stockledgercontract.removeIssuanceObject(issuance);

					stockledgercontrollers.saveStockLedgerObject(stockledgercontract, function(err, res) {
						var params = {uuid: contractuuid}
						self.getAngularControllers().gotoStatePage('home.stockledgers.issuances', params);
					});

				}
				else {
					var params = {uuid: contractuuid}
					this.getAngularControllers().gotoStatePage('home.stockledgers.issuances', params);
				}
			}
			else {
				alert('could not find issuance ' + issuanceindex);
				
				var params = {uuid: contractuuid}
				this.getAngularControllers().gotoStatePage('home.stockledgers.issuances', params);
			}
			
		}
		else {
			alert(contractuuid + 'not found');
			
			this.getAngularControllers().gotoStatePage('home.stockledgers');
		}
		
	}
		  

	handleRemoveTransactionFromListRequest($scope, $state, $stateParams) {
		console.log("Controllers.handleRemoveTransactionFromListRequest called");
	    
		var self = this;
		var global = this.global;
		var app = this.getAppObject();

	    var contractuuid = $stateParams.uuid;
		var transactionindex = $stateParams.index;

	    var global = this.global;
	    
		var commonmodule = global.getModuleObject('common');
		var session = commonmodule.getSessionObject();
	    
		var stockledgermodule = global.getModuleObject('securities');
		var stockledgercontrollers = stockledgermodule.getControllersObject();
		
		var stockledgercontract = stockledgercontrollers.getStockLedgerFromUUID(contractuuid);
		
		if (stockledgercontract) {
			var transaction = stockledgercontract.getTransactionFromKey(transactionindex);
			
			if (transaction) {
				if (confirm('Are you sure you want to remove transaction of "' + transaction.getLocalConsideration() + '"?')) {
				    var contractuuid = $stateParams.uuid;
				    
					stockledgercontract.removeTransactionObject(transaction);

					stockledgercontrollers.saveStockLedgerObject(stockledgercontract, function(err, res) {
						var params = {uuid: contractuuid}
						self.getAngularControllers().gotoStatePage('home.stockledgers.transactions', params);
					});

				}
				else {
					var params = {uuid: contractuuid}
					this.getAngularControllers().gotoStatePage('home.stockledgers.transactions', params);
				}
			}
			else {
				alert('could not find transaction ' + transactionindex);
				
				var params = {uuid: contractuuid}
				this.getAngularControllers().gotoStatePage('home.stockledgers.transactions', params);
			}
			
		}
		else {
			alert(contractuuid + 'not found');
			
			this.getAngularControllers().gotoStatePage('home.stockledgers');
		}
		
	}
		  
	
	//
	// Views
	//
	
	// templates elements
	
	_getViewStockLedgerArray($scope, views, contract) {
		var global = this.global;
		
		var stockledger = [];
		
		stockledger.index = contract.getContractIndex();
		stockledger.uuid = contract.getUUID();

		stockledger.isLocalOnly = contract.isLocalOnly();
		
		stockledger.status = contract.getStatus();
		stockledger.statusstring = views.getStockLedgerStatusString(contract);

		stockledger.localdescription = contract.getLocalDescription();
		stockledger.contractaddress = (contract.isLocalOnly() ? null: contract.getAddress());
		stockledger.contracttype = contract.getContractType();
		stockledger.owneraddress = contract.getLocalOwner();
		stockledger.owneridentifier = contract.getLocalOwnerIdentifier();
		

	    var writestatus = function (contract, stockledger) {
	    	var oldstatus = contract.getLiveStatus();
	    	
			return contract.checkStatus(function(err, res) {

				if (err)  {
					console.log('error in checkStatus ' + res);
				}
				
				var refresh = false;
		    	var newstatus = contract.getLiveStatus();

		    	if (newstatus != oldstatus) {
		    		stockledger.statusstring = views.getStockLedgerLiveStatusString(contract);
		    		stockledger.status = newstatus;
		    		
		    		refresh = true;
		    		
		    		// save token
		    		var stockledgermodule = global.getModuleObject('securities');
		    		
		    		var stockledgercontrollers = stockledgermodule.getControllersObject();
		    		
		    		stockledgercontrollers.saveStockLedgerObject(contract);
		    	}
				
				// tell scope a value has changed
				if (refresh)
				$scope.$apply();
			})			
			.catch(err => {
			    console.log('checkStatus error', err);
			});
		};
		
		
		// for local and on chain
		writestatus(contract, stockledger);
		
		return stockledger;
	}
	
	_getViewStockLedgersArray($scope, views, modelstockledgerarray) {
		var viewstockledgers = [];
		
		if (modelstockledgerarray) {
			for (var i = 0; i < modelstockledgerarray.length; i++) {
				var contract = modelstockledgerarray[i];
				
				if (contract) {
					var viewstockledger = this._getViewStockLedgerArray($scope, views, contract);
					
					viewstockledgers.push(viewstockledger);
				}
			}
		}
		
		return viewstockledgers;
	}
	
	prepareStockLedgersView($scope) {
		console.log("Controllers.prepareStockLedgersView called");
		
		var global = this.global;
		var self = this;
		var app = this.getAppObject();

		var commonmodule = global.getModuleObject('common');
		var session = commonmodule.getSessionObject();
		
		var views = this.securitiesviews;

		// local contracts
		// (in memory)
		var localstockledgers = [];
		
		var stockledgermodule = global.getModuleObject('securities');
		var localsecuritiesarray = stockledgermodule.getLocalStockLedgers(session, false);
		
		if (localsecuritiesarray) {
			localstockledgers = this._getViewStockLedgersArray($scope, views, localsecuritiesarray);
		}
		
		$scope.localstockledgers = localstockledgers;
		

		// chain contracts
		// (in memory)
		var chainstockledgers = [];
		
		var chainsecuritiesarray = stockledgermodule.getChainStockLedgers(session, false);
		
		if (chainsecuritiesarray) {
			chainstockledgers = this._getViewStockLedgersArray($scope, views, chainsecuritiesarray)
		}
		
		$scope.chainstockledgers = chainstockledgers;
		
		// refresh list to update both parts
		stockledgermodule.getStockLedgers(session, true, function(err, res) {
			
			// list of contracts has been refreshed
			
			// update local and chain lists
			$scope.localstockledgers = self._getViewStockLedgersArray($scope, views, stockledgermodule.getLocalStockLedgers(session, false));
			
			$scope.chainstockledgers = self._getViewStockLedgersArray($scope, views, stockledgermodule.getChainStockLedgers(session, false));
		
			// putting $apply in a deferred call to avoid determining if callback is called
			// from a promise or direct continuation of the code
			setTimeout(function() {
			    $scope.$apply();
			  }, 100);
		});
	}
	
	prepareStockLedgerView($scope, $state, $stateParams) {
		console.log("Controllers.prepareStockLedgerView called");
		
	    var contractuuid = $stateParams.uuid;

	    var global = this.global;
	    
		var commonmodule = global.getModuleObject('common');
		var session = commonmodule.getSessionObject();

		var stockledgermodule = global.getModuleObject('securities');
		
		var stockledgercontrollers = stockledgermodule.getControllersObject();
		var views = this.securitiesviews;
		
		var contract = stockledgercontrollers.getStockLedgerFromUUID(contractuuid);
		
		if (contract) {
			$scope.stockledgerindex = contract.getContractIndex();
			$scope.stockledgeruuid = contract.getUUID();
			$scope.isLocalOnly = contract.isLocalOnly();
			
			var isLocalOnly = contract.isLocalOnly();
			var isLocal = contract.isLocal();
			var isOnChain = contract.isOnChain();
			
			
			var statusstring = views.getStockLedgerStatusString(contract);
			var livestatusstring = views.getStockLedgerLiveStatusString(contract);

			var address = contract.getAddress();
			var localdescription = contract.getLocalDescription();
			var localowner = contract.getLocalOwner();
			var localowneridentifier = contract.getLocalOwnerIdentifier();

			var localowneraccount = session.getAccountObject(localowner);
			
			var localcreationdate = contract.getLocalCreationDate();
			var localsubmissiondate = (contract.getLocalSubmissionDate() ? contract.getLocalSubmissionDate() : (isLocalOnly ? global.t('not deployed yet') : global.t('imported')));
			
			
			// local part
			$scope.address = {
					text: address
			};	
			
			$scope.localdescription = {
					text: localdescription
			};	
			
			$scope.localowner = {
					text: localowner
			};	
			
			$scope.localowneridentifier = {
					text: localowneridentifier
			};	
			
			$scope.localcreationdate = {
					text: localcreationdate
			};	
			
			$scope.localsubmissiondate = {
					text: localsubmissiondate
			};	
			
			$scope.status = {
					text: statusstring
			};
			
			
			// chain part
			
			// name
			$scope.chainname = {
					text: (contract.isLocalOnly() ? global.t('not deployed yet') : global.t('loading...'))
			};
			
			var writename = function (contract) {
				return contract.getChainLedgerName(function(err, res) {
					if (res) $scope.chainname.text = res;
					
					if (err) $scope.chainname.text = global.t('not found');
					
					$scope.$apply();
				})
			};

			if (contract.isLocalOnly() == false)
				writename(contract);

			
			// live status
			$scope.livestatus = {
					text: livestatusstring
			};	
			
		    var writestatus = function(contract) {
		    	contract.checkStatus(function(err, res) {
		    		if (res) {
		    			$scope.livestatus.text = views.getStockLedgerLiveStatusString(contract);
		    		}
		    		
		    		if (err) $scope.livestatus.text = global.t('error');
		    		
					$scope.$apply();
		    	});
		    };
		    
		    if (!contract.isLocalOnly()) {
		    	writestatus(contract);
		    	
		    }
		    
		    // name
			$scope.chaindescription = {
					text: global.t('loading...')
			};	
			
			var writeledgerdescription = function (contract) {
				return contract.getChainLedgerDescription(function(err, res) {
					if (res) {
						if (session.isAnonymous()) {
							$scope.chaindescription.text = res;
						}
						else {
							if (session.isSessionAccountAddress(localowner)) {
								$scope.chaindescription.text = localowneraccount.aesDecryptString(res);
							}
							else {
								$scope.chaindescription.text = res;
							}
						}
					}
					
					if (err) $scope.chaindescription.text = global.t('not found');
		    		
					$scope.$apply();
				});
			};

			if (contract.isLocalOnly() == false)
				writeledgerdescription(contract);
			else
				$scope.chaindescription.text = global.t('not deployed yet');
			
			// account count
			$scope.accountcount = {
					text: global.t('loading...')
			};
			
			var writeaccountcount = function (contract) {
				return contract.getChainAccountCount(function(err, res) {
					if (res) $scope.accountcount.text = res;
					
					if (err) $scope.accountcount.text = global.t('not found');
					
					$scope.$apply();
				});
			};

			if (contract.isLocalOnly() == false)
				writeaccountcount(contract);
			else
				$scope.accountcount.text = global.t('not deployed yet');


			// shareholder count
			$scope.shareholdercount = {
					text: global.t('loading...')
			};
			
			var writeshareholdercount = function (contract) {
				return contract.getChainStakeHolderCount(function(err, res) {
					if (res) $scope.shareholdercount.text = res;
					
					if (err) $scope.shareholdercount.text = global.t('not found');
					
					$scope.$apply();
				});
			};

			if (contract.isLocalOnly() == false)
				writeshareholdercount(contract);
			else
				$scope.shareholdercount.text = global.t('not deployed yet');
			
			// issuance count
			$scope.issuancecount = {
					text: global.t('loading...')
			};
			
			var writeissuancecount = function (contract, link) {
				return contract.getChainIssuanceCount(function(err, res) {
					if (res) $scope.issuancecount.text = res;
					
					if (err) $scope.issuancecount.text = global.t('not found');
					
					$scope.$apply();
				});
			};

			if (contract.isLocalOnly() == false)
				writeissuancecount(contract);
			else
				$scope.issuancecount.text = global.t('not deployed yet');
			
			
			// transaction count
			$scope.transactioncount = {
					text: global.t('loading...')
			};
			
			var writetransactioncount = function (contract, link) {
				return contract.getChainTransactionCount(function(err, res) {
					if (res) $scope.transactioncount.text = res;
					
					if (err) $scope.transactioncount = global.t('not found');
					
					$scope.$apply();
				})
			};

			if (contract.isLocalOnly() == false)
				writetransactioncount(contract);
			else
				$scope.transactioncount = global.t('not deployed yet');
			
			
			// chainowner
			$scope.chainowner = {
					text: global.t('loading...')
			};
			
			var writeowner = function (contract, text) {
				return contract.getChainOwner(function(err, res) {
					if (res) {
						if (session.isAnonymous()) {
							$scope.chainowner.text = res;
						}
						else {
							if (session.isSessionAccountAddress(res)) {
								$scope.chainowner.text = global.t('You');
							}
							else {
								$scope.chainowner.text = res;
							}
						}
						
					}
					
					if (err) $scope.chainowner.text = global.t('not found');
					
					$scope.$apply();
				});
			};

			if (contract.isLocalOnly() == false)
				writeowner(contract);
			else
				$scope.chainowner.text = global.t('not deployed yet');

			
			// chain owner public rsa key
			$scope.chainownerrsapublickey = {
					text: global.t('loading...')
			};
			
			var writeownerpublickey = function (contract, text) {
				return contract.getChainOwnerPublicKey(function(err, res) {
					if (res) $scope.chainownerrsapublickey.text = views.showCondensedPublicKey(res);
					
					if (err) $scope.chainownerrsapublickey = global.t('not found');
					
					$scope.$apply();
				});
			};

			if (contract.isLocalOnly() == false)
				writeownerpublickey(contract);
			else
				$scope.chainownerrsapublickey = global.t('not deployed yet');
			
			// contract name
			$scope.chaincontractname = {
					text: global.t('loading...')
			};
			
			var writecontractname = function (contract, text) {
				return contract.getChainContractName(function(err, res) {
					if (res) $scope.chaincontractname.text = res;
					
					if (err) $scope.chaincontractname.text = global.t('not found');
					
					$scope.$apply();
				});
			};

			if (contract.isLocalOnly() == false)
				writecontractname(contract);
			else
				$scope.chaincontractname.text = global.t('not deployed yet');
			
			// contract version
			$scope.chaincontractversion = {
					text: global.t('loading...')
			};
			
			var writecontractversion = function (contract, text) {
				return contract.getChainContractVersion(function(err, res) {
					if (res) $scope.chaincontractversion.text = res;
					
					if (err) $scope.chaincontractversion.text = global.t('not found');
					
					$scope.$apply();
				});
			};

			if (contract.isLocalOnly() == false)
				writecontractversion(contract);
			else
				$scope.chaincontractversion.text = global.t('not deployed yet');
			
		
		}
		
	}	
	
	// accounts
	prepareAccountsView($scope, $state, $stateParams) {
		console.log("Controllers.prepareAccountsView called");
		
	    var contractuuid = $stateParams.uuid;

		var self = this;
	    var global = this.global;
		
	    var commonmodule = global.getModuleObject('common');
		var session = commonmodule.getSessionObject();
		
	    
	    // stockledger
	    var stockledgermodule = global.getModuleObject('securities');
		var stockledgercontrollers = stockledgermodule.getControllersObject();
		
		var stockledgercontract = stockledgercontrollers.getStockLedgerFromUUID(contractuuid);
		
		$scope.stockledgeruuid= (stockledgercontract ? stockledgercontract.getUUID() : null);

		//
	    // list
		//var mvcmodule = global.getModuleObject('mvc');
		var views = this.securitiesviews;
		
	    //

		// chain
		var chainaccounts = [];
		
		if (stockledgercontract) {
			
			var updatearray = function(contract, viewarray) {
				
				return contract.getChainAccountList(function(err, res) {
					
					if (res) {
						console.log('list is returned with ' + res.length + ' elements');
						var chainarray = res;
						
						// grow viewarray if chainarray is longer
						while(chainarray.length > viewarray.length) {
							var account = [];
							
							viewarray.push(account);
						}
						
						// in reverse order to have most recent on top
						for (var i = chainarray.length - 1; i >=0; i--) {
							var chainaccount = chainarray[i];
							var account = viewarray[i];
							
							if (chainaccount) {
								var accountaddress = chainaccount.getAddress();
								var isYou = session.isSessionAccountAddress(accountaddress)

								var chainaddress = (isYou ? global.t('You') : accountaddress);
								
								account.address = chainaddress;
								account.publicecekey = views.showCondensedPublicKey(chainaccount.getAesPublicKey());
								account.publicrsakey = views.showCondensedPublicKey(chainaccount.getRsaPublicKey());
							}
							
						}
						
						$scope.$apply();
					}
					
					if (err) console.log('error: ' + err);
				});
				
			};
			
			// create right number of lines and fill with loading
			stockledgercontract.getChainAccountCount(function(err, res) {
				var count = res;
				console.log('writing ' + count + ' lines with loading');
			
				for (var i=0; i < count; i++) {
					var account = [];
					
					account.address = global.t('loading...');
					account.publicecekey = global.t('loading...');
					account.publicrsakey = global.t('loading...');

					chainaccounts.push(account);
				}
			
				$scope.$apply();
			}).then(function(count) {
				// then update content of lines
				updatearray(stockledgercontract, chainaccounts);
			});
			
		}
		
		$scope.chainaccounts = chainaccounts;
	}
	
	// shareholdes
	_getShareHolderArray(views, stockledgermodule, session, stockledgercontract, shareholder) {
		var global = this.global;
		
		var holder = [];
		
		var ownsContract = stockledgermodule.ownsContract(stockledgercontract);

		var statusstring = views.getShareHolderStatusString(shareholder);
		
		var isLocalOnly = shareholder.isLocalOnly();
		var isLocal = shareholder.isLocal();
		var isOnChain = shareholder.isOnChain();
		
		var shareholderaddress = shareholder.getAddress();
		var isYou = session.isSessionAccountAddress(shareholderaddress);

		var chainidentifier = (isLocalOnly ? null : shareholder.getChainCocryptedIdentifier());
		var chainidentifierdisplay = (isOnChain==false ? global.t('local') : (isYou ? global.t('You') : ( ownsContract ? stockledgermodule.decryptContractStakeHolderIdentifier(stockledgercontract, shareholder) : global.t('crypted'))));
		
	    var local_label = (isLocalOnly ? global.t('local only') : global.t('local'));

	    holder.identifier = (isOnChain==false ? shareholder.getLocalIdentifier() : chainidentifierdisplay);
	    holder.statusstring = statusstring;
	    holder.address = (isOnChain==false ? local_label : shareholder.getAddress());
	    holder.publicrsakey = (isOnChain==false ? local_label : views.showCondensedPublicKey(shareholder.getChainRsaPubKey()));
	    holder.privatecryptedkey = (isOnChain==false ? local_label : views.showCondensedCryptedText(shareholder.getChainCocryptedPrivKey()));
	    holder.cryptedidentifier = (isOnChain==false ? local_label : views.showCondensedCryptedText(shareholder.getChainCocryptedIdentifier()));
		
	    holder.uuid = shareholder.getUUID();
	    holder.index = shareholder.getStakeHolderIndex();

	    return holder;
	}

		
	_getLocalShareHoldersArray(views, stockledgermodule, session, stockledgercontract) {
		var global = this.global;

		var localshareholders = [];
		
		
		if (stockledgercontract) {

			var localshareholdersarray = stockledgercontract.getLocalStakeHolders();
			console.log('localshareholdersarray count is ' + localshareholdersarray.length);
			
			for (var i=0; i < localshareholdersarray.length; i++) {
				var localshareholder = localshareholdersarray[i];
				
				var shareholder = this._getShareHolderArray(views, stockledgermodule, session, stockledgercontract, localshareholder);

				localshareholders.push(shareholder);
			}
		}
		
		return localshareholders;
	}
	
	prepareShareHoldersView($scope, $state, $stateParams) {
		console.log("Controllers.prepareShareHoldersView called");
		
	    var contractuuid = $stateParams.uuid;

		var self = this;
	    var global = this.global;
		
	    var commonmodule = global.getModuleObject('common');
		var session = commonmodule.getSessionObject();
		
	    
	    // stockledger
	    var stockledgermodule = global.getModuleObject('securities');
		var stockledgercontrollers = stockledgermodule.getControllersObject();
		
		var stockledgercontract = stockledgercontrollers.getStockLedgerFromUUID(contractuuid);
		
		$scope.stockledgeruuid= (stockledgercontract ? stockledgercontract.getUUID() : null);

		//
	    // list
		//var mvcmodule = global.getModuleObject('mvc');
		var views = this.securitiesviews;
		
	    //

		// local
		var localshareholders = this._getLocalShareHoldersArray(views, stockledgermodule, session, stockledgercontract);
		
		$scope.localshareholders = localshareholders;
		
		// chain
		var chainshareholders = [];
		
		if (stockledgercontract) {
			
			var updatearray = function(contract, viewarray) {
				
				return contract.getChainStakeHolderList(function(err, res) {
					
					if (res) {
						console.log('list is returned with ' + res.length + ' elements');
						var chainarray = res;
						
						// grow viewarray if chainarray is longer
						while(chainarray.length > viewarray.length) {
							var shareholder = [];
							
							viewarray.push(shareholder);
						}
						
						// in reverse order to have most recent on top
						for (var i = chainarray.length - 1; i >=0; i--) {
							var chainshareholder = chainarray[i];
							
							if (chainshareholder) {
								var shareholder = self._getShareHolderArray(views, stockledgermodule, session, stockledgercontract, chainshareholder);

								viewarray[i] = shareholder;
							}
							
						}
						
						$scope.$apply();
					}
					
					if (err) console.log('error: ' + err);
				});
				
			};
			
			// create right number of lines and fill with loading
			stockledgercontract.getChainStakeHolderCount(function(err, res) {
				var count = res;
				console.log('writing ' + count + ' lines with loading');
			
				for (var i=0; i < count; i++) {
					var shareholder = [];
					
					shareholder.identifier = global.t('loading...');
					shareholder.statusstring = global.t('loading...');
					shareholder.address = global.t('loading...');
					shareholder.publicrsakey = global.t('loading...');
					shareholder.privatecryptedkey = global.t('loading...');
					shareholder.cryptedidentifier = global.t('loading...');

				    chainshareholders.push(shareholder);
				}
			
				$scope.$apply();
			}).then(function(count) {
				// then update content of lines
				updatearray(stockledgercontract, chainshareholders);
			});
			
		}
		
		$scope.chainshareholders = chainshareholders;
	}
	
	prepareShareHolderView($scope, $state, $stateParams) {
		console.log("Controllers.prepareShareHolderView called");
		
	    var contractuuid = $stateParams.uuid;
	    var stakeholderindex = $stateParams.index;

		var self = this;
	    var global = this.global;
		
	    var commonmodule = global.getModuleObject('common');
		var session = commonmodule.getSessionObject();
		
		var views = this.securitiesviews;
	    
	    // stockledger
	    var stockledgermodule = global.getModuleObject('securities');
		var stockledgercontrollers = stockledgermodule.getControllersObject();
		
		var contract = stockledgercontrollers.getStockLedgerFromUUID(contractuuid);

		if (contract) {
			$scope.stockledgeruuid= (contract ? contract.getUUID() : null);
			
			var stakeholder = contract.getStakeHolderFromKey(stakeholderindex);
			
			if (stakeholder) {
				
				// shareholder
				var isLocalOnly = stakeholder.isLocalOnly();
			    var isLocal = stakeholder.isLocal();
			    var isOnChain = stakeholder.isOnChain();
			    
			    var ownsContract = stockledgermodule.ownsContract(contract); 
				
				var stakeholderaddress = stakeholder.getAddress();
				var isYou = session.isSessionAccountAddress(stakeholderaddress);
			    
				var statusstring = views.getShareHolderStatusString(stakeholder);
				var chainidentifier = (isOnChain==false ? global.t('local') : (ownsContract ? stockledgermodule.decryptContractStakeHolderIdentifier(contract, stakeholder) : (isYou ? stockledgermodule.decryptContractStakeHolderIdentifier(contract, stakeholder) + ' (You)' : 'crypted')));
			    var identifier = (isOnChain==false ? stakeholder.getLocalIdentifier() : chainidentifier);
			    
			    var localorderid = (isLocalOnly ? global.t('local only') : stakeholder.getLocalOrderId());
				var localcreationdate = stakeholder.getLocalCreationDate();
				var localsubmissiondate = (stakeholder.getLocalSubmissionDate() ? stakeholder.getLocalSubmissionDate() : (isLocalOnly ? global.t('not deployed yet') : global.t('imported')));

				
				// local part
				
				$scope.localidentifier = { text: identifier};
				$scope.localorderid = { text: localorderid};
				$scope.localcreationdate = { text: localcreationdate};
				$scope.localsubmissiondate = { text: localsubmissiondate};
				$scope.localstatus = { text: statusstring};
				
				// chain part
				
			    var local_label = (isLocalOnly ? 'local only' : 'local');
			    
				var chainaddress = (isLocalOnly ? null : stakeholder.getAddress());
				var chainaddressdisplay = (isOnChain==false ? (chainaddress ? chainaddress : local_label) : stakeholder.getAddress() + views.revealContractStakeHolderIdentifier(ownsContract, stockledgermodule, session, contract, stakeholder));
				
				var isauthentic = (isOnChain==false ? false : stakeholder.isAuthenticated());
				var isauthenticdisplay = (isOnChain==false ? local_label : stakeholder.isAuthenticated());
				
				var chainrsapubkey = (isOnChain==false ? null : stakeholder.getChainRsaPubKey());
				var chainrsapubkeydisplay = (isOnChain==false ? local_label : chainrsapubkey);
				
				//var chainprivkey = (isLocalOnly ? null : stakeholder.getChainCocryptedPrivKey());
				//var chainprivkeydisplay = (isLocalOnly ? 'local only' : views.showCondensedPrivateKey(stakeholder.getChainCocryptedPrivKey()) + (ownsContract ? '\xa0\xa0\xa0---->\xa0\xa0\xa0' + stockledgermodule.decryptContractStakeHolderPrivateKey(contract, stakeholder) : (isYou ? '\xa0\xa0\xa0---->\xa0\xa0\xa0' + stockledgermodule.decryptContractStakeHolderPrivateKey(contract, stakeholder) : '')));
				
				var cocryptedprivkey = (isOnChain==false ? null : stakeholder.getChainCocryptedPrivKey());
				var cocryptedprivkeydisplay = (isOnChain==false ? local_label : views.showCondensedPrivateKey(stakeholder.getChainCocryptedPrivKey()) + views.revealContractStakeHolderPrivateKey(ownsContract, stockledgermodule, session, contract, stakeholder));

			    var cocryptedidentifier = (isOnChain==false ? null : stakeholder.getChainCocryptedIdentifier());
			    var cocryptedidentifierdisplay = (isOnChain==false ? local_label : views.showCondensedCryptedText(cocryptedidentifier) + views.revealContractStakeHolderIdentifier(ownsContract, stockledgermodule, session, contract, stakeholder));
			    
			    var registrationdate = (isOnChain==false ? null : stakeholder.getChainRegistrationDate());
			    var registrationdatedisplay = (isOnChain==false ? local_label : registrationdate);
			    var registrationblockdate = (isOnChain==false ? null : stakeholder.getChainBlockDate());
			    var registrationblockdatedisplay = (isOnChain==false ? local_label : registrationblockdate);
			    
			    var creatoraddress = (isOnChain==false ? null : stakeholder.getChainCreatorAddress());
			    var creator = (isOnChain==false ? null : contract.getChainStakeHolderFromAddress(stakeholder.getChainCreatorAddress()));
			    var creatoraddressdisplay = (isOnChain==false ? local_label : creatoraddress + views.revealContractStakeHolderIdentifier(ownsContract, stockledgermodule, session, contract, creator));
			    
			    var crtcrypteddescription = (isOnChain==false ? null : stakeholder.getChainCreatorCryptedDescription());
			    var crtcrypteddescriptiondisplay = (isOnChain==false ? local_label : views.showCondensedCryptedText(crtcrypteddescription) + views.revealCreatorCryptedStakeHolderDescription(ownsContract, stockledgermodule, session, contract, stakeholder));
			    var crtcryptedidentifier = (isOnChain==false ? null : stakeholder.getChainCreatorCryptedIdentifier());
			    var crtcryptedidentifierdisplay = (isOnChain==false ? local_label : views.showCondensedCryptedText(crtcryptedidentifier) + views.revealCreatorCryptedStakeHolderIdentifier(ownsContract, stockledgermodule, session, contract, stakeholder));
		    
			    var shldrcrypteddescription = (isOnChain==false ? null : stakeholder.getChainStakeHolderCryptedDescription());
			    var shldrcrypteddescriptiondisplay = (isOnChain==false ? local_label : views.showCondensedCryptedText(shldrcrypteddescription) + views.revealStakeHolderCryptedStakeHolderDescription(ownsContract, stockledgermodule, session, contract, stakeholder));
			    var shldrcryptedidentifier = (isOnChain==false ? null : stakeholder.getChainStakeHolderCryptedIdentifier());
			    var shldrcryptedidentifierdisplay = (isOnChain==false ? local_label : views.showCondensedCryptedText(shldrcryptedidentifier) + views.revealStakeHolderCryptedStakeHolderIdentifier(ownsContract, stockledgermodule, session, contract, stakeholder));
			    
			    var orderid = (isOnChain==false ? null : stakeholder.getChainOrderId());
			    var orderiddisplay = (isOnChain==false ? local_label : orderid);
			    var signature = (isOnChain==false ? null : stakeholder.getChainSignature());
			    var signaturedisplay = (isOnChain==false ? local_label : signature);


			    // fill $scope
			    $scope.chainauthentication = { text: isauthenticdisplay};
				$scope.chainaccountaddress = { text: chainaddressdisplay};
				$scope.chainpublicrsakey = { text: chainrsapubkeydisplay};
				$scope.chaincocryptedprivatekey = { text: cocryptedprivkeydisplay};
				$scope.chaincocryptedidentifier = { text: cocryptedidentifierdisplay};
				$scope.chainregistrationdate = { text: registrationdatedisplay};
				$scope.chainblockdate = { text: registrationblockdatedisplay};
				$scope.chaincreator = { text: creatoraddressdisplay};
				$scope.chaincrtcrypteddescription = { text: crtcrypteddescriptiondisplay};
				$scope.chaincrtcryptedidentifier = { text: crtcryptedidentifierdisplay};
				$scope.chainshldrcrypteddescription = { text: shldrcrypteddescriptiondisplay};
				$scope.chainshldrcryptedidentifier = { text: shldrcryptedidentifierdisplay};
				$scope.chainorderid = { text: orderiddisplay};
				$scope.chainsignature = { text: signaturedisplay};
			}
		}




	}
	
	// issuances
	_getIssuanceArray(views, stockledgermodule, session, stockledgercontract, issuance) {
		var global = this.global;
		
		var issu = [];
		
		var ownsContract = stockledgermodule.ownsContract(stockledgercontract);

		var isLocalOnly = issuance.isLocalOnly();
		var isLocal = issuance.isLocal();
		var isOnChain = issuance.isOnChain();
		
		var chaindescription = (isOnChain==false ? global.t('local only') : ( ownsContract ? session.getSessionAccountObject(stockledgercontract.getSyncChainOwner()).aesDecryptString(issuance.getChainCocryptedDescription()) : global.t('crypted')));

		var statusstring = views.getIssuanceStatusString(issuance);
	    var local_label = (isLocalOnly ? global.t('local only') : global.t('local'));

	    issu.localdescription = (isOnChain==false ? issuance.getLocalDescription() : chaindescription);
	    issu.statusstring = statusstring;
	    issu.numberofshares = (isOnChain==false ? issuance.getLocalNumberOfShares() : issuance.getChainNumberOfShares());
	    issu.percentofcapital = (isOnChain==false ?  issuance.getLocalPercentOfCapital() : issuance.getChainPercentOfCapital());
	    issu.publicname = (isOnChain==false ? issuance.getLocalName() : issuance.getChainName());
	    issu.publiccode = (isOnChain==false  ? issuance.getLocalCode() : issuance.getChainCode());
	    issu.crypteddescription = (isOnChain==false ? local_label : issuance.getChainCocryptedDescription());
		
	    issu.uuid = issuance.getUUID();
	    issu.index = issuance.getIssuanceIndex();
		
	    return issu;
	}

		
	_getLocalIssuancesArray(views, stockledgermodule, session, stockledgercontract) {
		var global = this.global;

		var localissuances = [];
		
		
		if (stockledgercontract) {

			var localissuancesarray = stockledgercontract.getLocalIssuances();
			console.log('localissuancesarray count is ' + localissuancesarray.length);
			
			for (var i=0; i < localissuancesarray.length; i++) {
				var localissuance = localissuancesarray[i];
				
				var issuance = this._getIssuanceArray(views, stockledgermodule, session, stockledgercontract, localissuance);

				localissuances.push(issuance);
			}
		}
		
		return localissuances;
	}
	
	prepareIssuancesView($scope, $state, $stateParams) {
		console.log("Controllers.prepareIssuancesView called");
		
	    var contractuuid = $stateParams.uuid;

		var self = this;
	    var global = this.global;
		
	    var commonmodule = global.getModuleObject('common');
		var session = commonmodule.getSessionObject();
		
	    
	    // stockledger
	    var stockledgermodule = global.getModuleObject('securities');
		var stockledgercontrollers = stockledgermodule.getControllersObject();
		
		var stockledgercontract = stockledgercontrollers.getStockLedgerFromUUID(contractuuid);
		
		$scope.stockledgeruuid= (stockledgercontract ? stockledgercontract.getUUID() : null);

		//
	    // list
		//var mvcmodule = global.getModuleObject('mvc');
		var views = this.securitiesviews;
		
	    //

		// local
		var localissuances = this._getLocalIssuancesArray(views, stockledgermodule, session, stockledgercontract);
		
		$scope.localissuances = localissuances;
		
		// chain
		var chainissuances = [];
		
		if (stockledgercontract) {
			
			var updatearray = function(contract, viewarray) {
				
				return contract.getChainIssuanceList(function(err, res) {
					
					if (res) {
						console.log('list is returned with ' + res.length + ' elements');
						var chainarray = res;
						
						// grow viewarray if chainarray is longer
						while(chainarray.length > viewarray.length) {
							var issuance = [];
							
							viewarray.push(issuance);
						}
						
						// in reverse order to have most recent on top
						for (var i = chainarray.length - 1; i >=0; i--) {
							var chainissuance = chainarray[i];
							
							if (chainissuance) {
								var issuance = self._getIssuanceArray(views, stockledgermodule, session, stockledgercontract, chainissuance);

								viewarray[i] = issuance;
							}
							
						}
						
						$scope.$apply();
					}
					
					if (err) console.log('error: ' + err);
				});
				
			};
			
			// create right number of lines and fill with loading
			stockledgercontract.getChainIssuanceCount(function(err, res) {
				var count = res;
				console.log('writing ' + count + ' lines with loading');
			
				for (var i=0; i < count; i++) {
					var issuance = [];
					
					issuance.localdescription = global.t('loading...');
					issuance.statusstring = global.t('loading...');
					issuance.numberofshares = global.t('loading...');
					issuance.percentofcapital = global.t('loading...');
					issuance.publicname = global.t('loading...');
					issuance.publiccode = global.t('loading...');
					issuance.crypteddescription = global.t('loading...');

				    chainissuances.push(issuance);
				}
			
				$scope.$apply();
			}).then(function(count) {
				// then update content of lines
				updatearray(stockledgercontract, chainissuances);
			});
			
		}
		
		$scope.chainissuances = chainissuances;
	}

	prepareIssuanceView($scope, $state, $stateParams) {
		console.log("Controllers.prepareIssuanceView called");
		
	    var contractuuid = $stateParams.uuid;
	    var issuanceindex = $stateParams.index;

		var self = this;
	    var global = this.global;
		
	    var commonmodule = global.getModuleObject('common');
		var session = commonmodule.getSessionObject();
		
	    
	    // stockledger
	    var stockledgermodule = global.getModuleObject('securities');
		var stockledgercontrollers = stockledgermodule.getControllersObject();
		
		var views = this.securitiesviews;

		
		var contract = stockledgercontrollers.getStockLedgerFromUUID(contractuuid);

		if (contract) {
			$scope.stockledgerindex = contract.getContractIndex();
			$scope.stockledgeruuid = contract.getUUID();
			$scope.isLocalOnly = contract.isLocalOnly();
			
			var issuance = contract.getIssuanceFromKey(issuanceindex);
			
			if (issuance) {
			    //
			    // local data
			    //
			    var isLocalOnly = issuance.isLocalOnly();
			    var isLocal = issuance.isLocal();
			    var isOnChain = issuance.isOnChain();

			    var ownsContract = stockledgermodule.ownsContract(contract); 
			    
				var chaindescription = (isOnChain==false ? global.t('local') : ( ownsContract ? session.getSessionAccountObject(contract.getSyncChainOwner()).aesDecryptString(issuance.getChainCocryptedDescription()) : global.t('crypted')));

				var statusstring = views.getIssuanceStatusString(issuance);
			    var localname = (isOnChain==false ? issuance.getLocalName() : global.t('on chain'));
			    var localdescription = (isOnChain==false ? issuance.getLocalDescription() : chaindescription);
			    var localnumberofshares = (isOnChain==false ? issuance.getLocalNumberOfShares() : global.t('on chain'));
			    var localpercentofcapital = (isOnChain==false ? issuance.getLocalPercentOfCapital() : global.t('on chain'));

			    var localcode = (isOnChain==false ? (isLocalOnly ? issuance.getLocalCode() : global.t('deployed')) : global.t('on chain'));;
			    
			    var localorderid = (isOnChain==false ? (isLocalOnly ? global.t('local only') : issuance.getLocalOrderId()) : global.t('on chain'));
				var localcreationdate = issuance.getLocalCreationDate();
				var localsubmissiondate = (issuance.getLocalSubmissionDate() ? issuance.getLocalSubmissionDate() : (isLocalOnly ? global.t('not deployed yet') : global.t('imported')));
				
				$scope.localname = { text: localname};
				$scope.localdescription = { text: localdescription};
				$scope.localcode = { text: localcode};
				$scope.localnumberofshares = { text: localnumberofshares};
				$scope.localpercentofcapital = { text: localpercentofcapital};
				$scope.localorderid = { text: localorderid};
				$scope.localcreationdate = { text: localcreationdate};
				$scope.localsubmissiondate = { text: localsubmissiondate};
				$scope.localstatus = { text: statusstring};

			    //
			    // chain data
			    //
			    var local_label = (isLocalOnly ? global.t('local only') : global.t('local'));
			    
			    var contractowneraccount = (isOnChain==false ? null :contract.getSyncChainOwnerAccount());
			    
			    var orderid = issuance.getChainOrderId();
			    var signature = issuance.getChainSignature();
			    
			    var isauthentic = (isOnChain==false ? false : contractowneraccount.validateStringSignature(orderid, signature));
			    var isauthenticdisplay = (isOnChain==false ? local_label : isauthentic);
			    
			    var chainname = (isOnChain==false ? null : issuance.getChainName());
			    var chainnamedisplay = (isOnChain==false ? local_label : chainname);
			    
			    var chaincocrypteddescription = (isOnChain==false ? null : issuance.getChainCocryptedDescription());
			    var chaincocrypteddescriptiondisplay = (isOnChain==false ? local_label : issuance.getChainCocryptedDescription() + views.revealContractIssuanceDescription(ownsContract, stockledgermodule, session, contract, issuance));

			    var chainnumberofshares = (isOnChain==false ? null : issuance.getChainNumberOfShares());
			    var chainnumberofsharesdisplay = (isOnChain==false ? local_label : chainnumberofshares);

			    var chainpercentofcapital = (isOnChain==false ? null : issuance.getChainPercentOfCapital());
			    var chainpercentofcapitaldisplay = (isOnChain==false ? local_label : chainpercentofcapital);

			    var chaintype = (isOnChain==false ? null : issuance.getChainType());
			    var chaintypedisplay = (isOnChain==false ? local_label : chaintype);
			    
			    var chaincode = (isOnChain==false ? null : issuance.getChainCode());
			    var chaincodedisplay = (isOnChain==false ? local_label : chaincode);

			    var orderiddisplay = (isOnChain==false ? local_label : orderid);
			    var signaturedisplay = (isOnChain==false ? local_label : signature);

			    $scope.chainauthentication = { text: isauthenticdisplay};
			    $scope.chainname = { text: chainnamedisplay};
			    $scope.chaincocrypteddescription = { text: chaincocrypteddescriptiondisplay};
			    $scope.chaintype = { text: chaintypedisplay};
			    $scope.chaincode = { text: chaincodedisplay};
			    $scope.chainnumberofshares = { text: chainnumberofsharesdisplay};
			    $scope.chainpercentofcapital = { text: chainnumberofsharesdisplay};
			    $scope.chainorderid = { text: orderiddisplay};
			    $scope.chainsignature = { text: signaturedisplay};
			}
			
		}

	}
	

	// transactions
	_getTransactionArray(views, stockledgermodule, session, stockledgercontract, transaction) {
		var global = this.global;
		
		var tx = [];
		
		var ownsContract = stockledgermodule.ownsContract(stockledgercontract);

		var isLocalOnly = transaction.isLocalOnly();
		var isLocal = transaction.isLocal();
		var isOnChain = transaction.isOnChain();
		
		var statusstring = views.getTransactionStatusString(transaction);
	    var local_label = (isLocalOnly ? global.t('local only') : global.t('local'));

	    tx.orderid = (isOnChain==false ? transaction.getTransactionIndex() : transaction.getChainOrderId());
	    tx.statusstring = statusstring;

	    var chainfrom = (isOnChain==false ? transaction.getLocalFrom() : transaction.getChainFrom());
	    var chainfromdisplay = stockledgermodule.getControllersObject().getTransactionStakeholderDisplayName(chainfrom, transaction, stockledgercontract);
	    
	    var chainto = (isOnChain==false ? transaction.getLocalTo() : transaction.getChainTo());
	    var chaintodisplay = stockledgermodule.getControllersObject().getTransactionStakeholderDisplayName(chainto, transaction, stockledgercontract);

	    tx.from = chainfromdisplay;
	    tx.to = chaintodisplay;
	    
	    
	    tx.nature = (isOnChain==false ? '-' : transaction.getChainNature());
	    tx.issuancenumber = (isOnChain==false ? transaction.getLocalIssuanceNumber() : transaction.getChainIssuanceNumber());
	    tx.numberofshares = (isOnChain==false ? transaction.getLocalNumberOfShares() : transaction.getChainNumberOfShares());
	    tx.consideration = (isOnChain==false ? transaction.getLocalConsideration() : transaction.getChainConsideration());
	    tx.currency = (isOnChain==false ? transaction.getLocalCurrency() : transaction.getChainCurrency());
		
	    tx.uuid = transaction.getUUID();
	    tx.index = transaction.getTransactionIndex();
		
	    return tx;
	}

		
	_getLocalTransactionsArray(views, stockledgermodule, session, stockledgercontract) {
		var global = this.global;

		var localtransactions = [];
		
		if (stockledgercontract) {

			var localtransactionsarray = stockledgercontract.getLocalTransactions();
			console.log('localtransactionsarray count is ' + localtransactionsarray.length);
			
			for (var i=0; i < localtransactionsarray.length; i++) {
				var localtransaction = localtransactionsarray[i];
				
				var transaction = this._getTransactionArray(views, stockledgermodule, session, stockledgercontract, localtransaction);

				localtransactions.push(transaction);
			}
		}
		
		return localtransactions;
	}
	
	prepareTransactionsView($scope, $state, $stateParams) {
		console.log("Controllers.prepareTransactionsView called");
		
	    var contractuuid = $stateParams.uuid;

		var self = this;
	    var global = this.global;
		
	    var commonmodule = global.getModuleObject('common');
		var session = commonmodule.getSessionObject();
		
	    
	    // stockledger
	    var stockledgermodule = global.getModuleObject('securities');
		var stockledgercontrollers = stockledgermodule.getControllersObject();
		
		var stockledgercontract = stockledgercontrollers.getStockLedgerFromUUID(contractuuid);
		
		$scope.stockledgeruuid= (stockledgercontract ? stockledgercontract.getUUID() : null);

		//
	    // list
		//var mvcmodule = global.getModuleObject('mvc');
		var views = this.securitiesviews;
		
	    //

		// local
		var localtransactions = this._getLocalTransactionsArray(views, stockledgermodule, session, stockledgercontract);
		
		$scope.localtransactions = localtransactions;
		
		// chain
		var chaintransactions = [];
		
		if (stockledgercontract) {
			
			var updatearray = function(contract, viewarray) {
				
				return contract.getChainStakeHolderList()
				.then(function(res) {
					contract.getChainTransactionList(function(err, res) {
						if (res) {
							console.log('list is returned with ' + res.length + ' elements');
							var chainarray = res;
							
							// grow viewarray if chainarray is longer
							while(chainarray.length > viewarray.length) {
								var transaction = [];
								
								viewarray.push(transaction);
							}
							
							// in reverse order to have most recent on top
							for (var i = chainarray.length - 1; i >=0; i--) {
								var chaintransaction = chainarray[i];
								
								if (chaintransaction) {
									var transaction = self._getTransactionArray(views, stockledgermodule, session, stockledgercontract, chaintransaction);

									viewarray[i] = transaction;
								}
								
							}
							
							$scope.$apply();
						}
						
						if (err) console.log('error: ' + err);
					});
				});
					
				
			};
			
			// create right number of lines and fill with loading
			stockledgercontract.getChainTransactionCount(function(err, res) {
				var count = res;
				console.log('writing ' + count + ' lines with loading');
			
				for (var i=0; i < count; i++) {
					var tx = [];
					
				    tx.orderid = global.t('loading...');
				    tx.statusstring = global.t('loading...');
				    tx.from = global.t('loading...');
				    tx.to = global.t('loading...');
				    tx.nature = global.t('loading...');
				    tx.issuancenumber = global.t('loading...');
				    tx.numberofshares = global.t('loading...');
				    tx.consideration = global.t('loading...');
				    tx.currency = global.t('loading...');

				    chaintransactions.push(tx);
				}
			
				$scope.$apply();
			}).then(function(count) {
				// then update content of lines
				updatearray(stockledgercontract, chaintransactions);
			});
			
		}
		
		$scope.chaintransactions = chaintransactions;
	}

	prepareTransactionView($scope, $state, $stateParams) {
		console.log("Controllers.prepareTransactionView called");
		
	    var contractuuid = $stateParams.uuid;
	    var transactionindex = $stateParams.index;

		var self = this;
	    var global = this.global;
		
	    var commonmodule = global.getModuleObject('common');
		var session = commonmodule.getSessionObject();
		
	    
	    // stockledger
	    var stockledgermodule = global.getModuleObject('securities');
		var stockledgercontrollers = stockledgermodule.getControllersObject();
		
		var views = this.securitiesviews;
		

		var contract = stockledgercontrollers.getStockLedgerFromUUID(contractuuid);
		
		if (contract) {
			$scope.stockledgerindex = contract.getContractIndex();
			$scope.stockledgeruuid = contract.getUUID();
			$scope.isLocalOnly = contract.isLocalOnly();
			
			var transaction = contract.getTransactionFromKey(transactionindex);
			
			if (transaction) {
				
			    var isLocalOnly = transaction.isLocalOnly();
			    var isLocal = transaction.isLocal();
			    var isOnChain = transaction.isOnChain();

			    var ownsContract = stockledgermodule.ownsContract(contract);
			    
				var statusstring = views.getTransactionStatusString(transaction);
			    
			    //
			    // local data
			    //
				
			    var localfrom = (isOnChain==false ? transaction.getLocalFrom() : global.t('on chain'));
			    var localto = (isOnChain==false ? transaction.getLocalTo() : global.t('on chain'));
			    var localissuancenumber = (isOnChain==false ? transaction.getLocalIssuanceNumber() : global.t('on chain'));
			    var localnumberofshares = (isOnChain==false ? transaction.getLocalNumberOfShares() : global.t('on chain'));
			    var localconsideration = (isOnChain==false ? transaction.getLocalConsideration() : global.t('on chain'));
			    var localcurrency = (isOnChain==false ? transaction.getLocalCurrency() : global.t('on chain'));

			    var localorderid = (isOnChain==false ? (isLocalOnly ? global.t('local only') : transaction.getLocalOrderId()) : global.t('on chain'));
				var localcreationdate = transaction.getLocalCreationDate();
				var localsubmissiondate = (transaction.getLocalSubmissionDate() ? transaction.getLocalSubmissionDate() : (isLocalOnly ? global.t('not deployed yet') : global.t('imported')));

				$scope.localsender = { text: localfrom};
				$scope.localrecipient = { text: localto};
				$scope.localissuancenumber = { text: localissuancenumber};
				$scope.localnumberofshares = { text: localnumberofshares};
				$scope.localconsideration = { text: localconsideration};
				$scope.localcurrency = { text: localcurrency};
				$scope.localorderid = { text: localorderid};
				$scope.localcreationdate = { text: localcreationdate};
				$scope.localsubmissiondate = { text: statusstring};
				$scope.localstatus = { text: localsubmissiondate};

			    //
			    // chain data
			    //
			    var local_label = (isLocalOnly ? global.t('local only') : global.t('local'));
			    
			    var contractowneraccount = contract.getSyncChainOwnerAccount();
			    
			    var transactioncreatoraddress = transaction.getChainCreatorAddress();
			    var transactioncreatoraccount = session.getAccountObject(transactioncreatoraddress);
			    
			    var orderid = transaction.getChainOrderId();
			    var signature = transaction.getChainSignature();
			    
			    var isauthentic = (isOnChain==false ? false : ( transactioncreatoraccount ? transactioncreatoraccount.validateStringSignature(orderid, signature) : false));
			    var isauthenticdisplay = (isOnChain==false ? local_label : isauthentic);
			    
			    var chainfrom = (isOnChain==false ? transaction.getLocalFrom() : transaction.getChainFrom());
			    var chainfromstakeholder = (isOnChain==false ? null : contract.getChainStakeHolderFromAddress(chainfrom))
			    var chainfromdisplay = (isOnChain==false ? local_label : chainfrom + views.revealStakeHolderIdentifier(ownsContract, stockledgermodule, session, contract, chainfromstakeholder));
				    
			    var chainto = (isOnChain==false ? transaction.getLocalTo() : transaction.getChainTo());
			    var chaintostakeholder = (isOnChain==false ? null : contract.getChainStakeHolderFromAddress(chainto))
			    var chaintodisplay = (isOnChain==false ? local_label : chainto + views.revealStakeHolderIdentifier(ownsContract, stockledgermodule, session, contract, chaintostakeholder));
			    
			    var chainnature = (isOnChain==false ? -1 : transaction.getChainNature());
			    var chainnaturedisplay = (isOnChain==false ? local_label : chainnature);
			    
			    var chainissuancenumber = (isOnChain==false ? -1 : transaction.getChainIssuanceNumber());
			    var chainissuancenumberdisplay = (isOnChain==false ? local_label : chainissuancenumber);

			    var chainnumberofshares = (isOnChain==false ? -1 : transaction.getChainNumberOfShares());
			    var chainnumberofsharesdisplay = (isOnChain==false ? local_label : chainnumberofshares);

			    var chainconsideration = (isOnChain==false ? null : transaction.getChainConsideration());
			    var chainconsiderationdisplay = (isOnChain==false ? local_label : chainconsideration);
			    
			    var chaincurrency = (isOnChain==false ? null : transaction.getChainCurrency());
			    var chaincurrencydisplay = (isOnChain==false ? local_label : chaincurrency);

			    var chaincreatoraddress = (isOnChain==false ? null : transaction.getChainCreatorAddress());
			    var chaincreatorstakeholder = (isOnChain==false ? null : contract.getChainStakeHolderFromAddress(chaincreatoraddress))
			    var chaincreatoraddressdisplay = (isOnChain==false ? local_label : chaincreatoraddress + views.revealStakeHolderIdentifier(ownsContract, stockledgermodule, session, contract, chaincreatorstakeholder));

			    var orderiddisplay = (isOnChain==false ? local_label : orderid);
			    var signaturedisplay = (isOnChain==false ? local_label : signature);

			    var chaintransactiondate = (isOnChain==false ? null : transaction.getChainTransactionDate());
			    var chaintransactiondatedisplay = (isOnChain==false ? local_label : chaintransactiondate);
			    
			    var chainblockdate = (isOnChain==false ? null : transaction.getChainBlockDate());
			    var chainblockdatedisplay = (isOnChain==false ? local_label : chainblockdate);
			    

				$scope.chainauthentication = { text: isauthenticdisplay};
				$scope.chainsender = { text: chainfromdisplay};
				$scope.chainrecipient = { text: chaintodisplay};
				$scope.chainnature = { text: chainnaturedisplay};
				$scope.chainissuancenumber = { text: chainissuancenumberdisplay};
				$scope.chainnumberofshares = { text: chainnumberofsharesdisplay};
				$scope.chainconsideration = { text: chainconsiderationdisplay};
				$scope.chaincurrency = { text: chaincurrencydisplay};
				$scope.chaincreatoraddress = { text: chaincreatoraddressdisplay};
				$scope.chainorderid = { text: orderiddisplay};
				$scope.chainsignature = { text: signaturedisplay};
				$scope.chaintransactiondate = { text: chaintransactiondatedisplay};
				$scope.chainblocknumber = { text: chainblockdatedisplay};
			}

			

			
		}


	}
	

	//
	// Forms
	//
	
	// stock ledger creation
	prepareStockLedgerCreateForm($scope) {
		console.log("Controllers.prepareStockLedgerCreateForm called");

		var global = this.global;
		var self = this;
		  
		// filling fields
		$scope.description = {
				text: global.t('Enter description')
		};
		  
		// submit function
		$scope.handleSubmit = function(){
			self.handleStockLedgerCreateSubmit($scope);
		}
	}
	
	handleStockLedgerCreateSubmit($scope) {
		console.log("Controllers.handleStockLedgerCreateSubmit called");

		// fill data array
		var data = [];
		
		data['owneraddress'] = $scope.owneraddress.text;
		data['owneridentifier'] = $scope.owneridentifier.text;
		data['ledgername'] = $scope.ledgername.text;
		data['ledgerdescription'] = $scope.ledgerdescription.text;

		// call module controller
		var global = this.global;
		var stockledgermodule = global.getModuleObject('securities');
		
		var stockledgercontrollers = stockledgermodule.getControllersObject();
		
		// create (local) stockledger for these values
		var stockledger = stockledgercontrollers.createStockLedgerObject(data);
		
		// save stockledger
		var self = this;
		stockledgercontrollers.saveStockLedgerObject(stockledger, function(err, res) {
			self.getAngularControllers().gotoStatePage('home.stockledgers');
		});
		
	}
	
	// stock ledger import
	prepareStockLedgerImportForm($scope) {
		console.log("Controllers.prepareStockLedgerImportForm called");

		var global = this.global;
		var self = this;
		  
		// filling fields
		$scope.description = {
				text: global.t('Enter description')
		};
		  
		// submit function
		$scope.handleSubmit = function(){
			self.handleStockLedgerImportSubmit($scope);
		}
	}
	
	handleStockLedgerImportSubmit($scope) {
		console.log("Controllers.handleStockLedgerImportSubmit called");

		// fill data array
		var data = [];
		
		data['description'] = $scope.description.text;
		data['address'] = $scope.address.text;
		
		// call module controller
		var self = this;
		var global = this.global;
		var app = this.getAppObject();
		var stockledgermodule = global.getModuleObject('securities');
		
		var stockledgercontrollers = stockledgermodule.getControllersObject();
		
		// create (local) contract for these values
		var contract = stockledgercontrollers.createStockLedgerObject(data);
		
		// set local description
		contract.setLocalDescription(data['description']);
		
		if (contract) {
			// save contract
			stockledgercontrollers.saveStockLedgerObject(contract, function(err, res) {
				// start a promise chain, to collect name, symbol,..
				console.log("starting retrieving chain data");

				var promise = contract.getChainLedgerName(function(err, res) {
					var name = res;
					
					console.log("chain ledger name is " + res);
					
					contract.setLocalLedgerName(name);

					return res;
				})
				.then(function(res) {
					return contract.getChainOwner(function(err, res) {
						var owneraddress = res;
						
						console.log("owner address is " + res);
						
						contract.setLocalOwner(owneraddress);
						
						return res;
					})
				})
				.then( function (res) {
					
					console.log("deployed contract completely retrieved");

					app.setMessage("deployed contract completely retrieved");
					
					// save stockledger
					return stockledgercontrollers.saveStockLedgerObject(contract, function(err, res) {
						self.getAngularControllers().gotoStatePage('home.stockledgers');
					});
				});
			});
			
		}
		else {
			this.getAngularControllers().gotoStatePage('home.stockledgers');
		}
		
	}
	
	// stock ledger modification
	prepareStockLedgerModifyForm($scope, $state, $stateParams) {
		console.log("Controllers.prepareStockLedgerModifyForm called");
		
		var self = this;

	    var contractuuid = $stateParams.uuid;

		// call module controller
		var global = this.global;
		var stockledgermodule = global.getModuleObject('securities');
		
		var stockledgercontrollers = stockledgermodule.getControllersObject();
		
		var contract = stockledgercontrollers.getStockLedgerFromUUID(contractuuid);

		// filling fields
		var stockledger = [];
		
		$scope.stockledger = stockledger;
		
		if (contract) {
			stockledger.index = contract.getContractIndex();
			stockledger.uuid = contract.getUUID();
			
			stockledger.islocalonly = contract.isLocalOnly();
			
			var localdescription = contract.getLocalDescription();
			var owneraddress = contract.getLocalOwner();
			var owneridentifier = contract.getLocalOwnerIdentifier();
			var ledgername = contract.getLocalLedgerName();

			var address = contract.getAddress();

			$scope.ledgerdescription = {
					text: localdescription
			};
			  
			$scope.ledgername = {
					text: ledgername
			};
			  
			$scope.owneraddress = {
					text: owneraddress
			};
			  
			$scope.owneridentifier = {
					text: owneridentifier
			};
			  
			  
		}

		  
		// submit function
		$scope.handleSubmit = function(){
			self.handleStockLedgerModifySubmit($scope);
		}
	}

	handleStockLedgerModifySubmit($scope) {
		console.log("Controllers.handleStockLedgerModifySubmit called");
	    
		var contractuuid = $scope.stockledger.uuid;

		var data = [];
		
		data['owneraddress'] = $scope.owneraddress.text;
		data['owneridentifier'] = $scope.owneridentifier.text;
		data['ledgername'] = $scope.ledgername.text;
		data['ledgerdescription'] = $scope.ledgerdescription.text;
		
		var global = this.global;
		var stockledgermodule = global.getModuleObject('securities');
		
		var stockledgercontrollers = stockledgermodule.getControllersObject();
		
		// get (local) stockledger 
		var stockledger = stockledgercontrollers.getStockLedgerFromUUID(contractuuid);
		
		stockledger = stockledgercontrollers.modifyStockLedgerObject(stockledger, data);
		
		// save stockledger
		var self = this;
		
		stockledgercontrollers.saveStockLedgerObject(stockledger, function(err,res) {
			self.getAngularControllers().gotoStatePage('home.stockledgers');
		});
		
	}
	
	// stock ledger deployment
	_refreshWalletFormPart($scope, fromaccount) {
		var global = this.global;
		
		var commonmodule = global.getModuleObject('common');
		var commoncontrollers = commonmodule.getControllersObject();

		var session = commonmodule.getSessionObject();
		
		if (fromaccount) {
			$scope.from = { text: fromaccount.getAddress()};
			
			$scope.walletused = { text: fromaccount.getAddress()};
			
			if (session.isSessionAccount(fromaccount)) {
				$scope.walletused.issessionaccount = true;
				$scope.selectedfrom = fromaccount.getAddress();
			}
			else {
				$scope.walletused.issessionaccount = false;
				$scope.selectedfrom = null;
			}
		}
		else {
			$scope.selectedfrom = null;
		}
		

		// refresh divcue
		var divcue = document.getElementsByClassName('div-form-cue')[0];
		
		var values = commoncontrollers.getAccountTransferDefaultValues(session, fromaccount, divcue);
	}
	
	handleWalletChange($scope) {
		var accountaddress = $scope.walletused.text;

		console.log('wallet changed to ' + accountaddress);
		
		var global = this.global;
		
		var commonmodule = global.getModuleObject('common');
		var commoncontrollers = commonmodule.getControllersObject();

		var session = commonmodule.getSessionObject();

		try {
			var fromaccount = (session.isValidAddress(accountaddress) ? session.getAccountObject(accountaddress) : null);
		}
		catch(e) {
		}
		
		this._refreshWalletFormPart($scope, fromaccount);
	}
	
	handleWalletSelectChange($scope) {
		var accountuuid = $scope.selectedfrom;
		
		console.log('wallet select changed to ' + accountuuid);
		
		var global = this.global;
		
		var commonmodule = global.getModuleObject('common');
		var commoncontrollers = commonmodule.getControllersObject();

		var session = commonmodule.getSessionObject();
		
		var fromaccount = commoncontrollers.getSessionAccountObjectFromUUID(session, accountuuid)

		this._refreshWalletFormPart($scope, fromaccount);
	}
	
	_fillWalletLists($scope, session) {
		var global = this.global;
		var self = this;
		
		// session accounts
		var sessionaccountarray = session.getSessionAccountObjects();
		
		if (!$scope.session)
			$scope.session = {};

		if (sessionaccountarray && sessionaccountarray.length) {
			$scope.session.hassessionaccounts = true;
		}
		else {
			$scope.session.hassessionaccounts = false;
		}
		
		var sessionaccounts = [];
		
		var sessionaccount = [];
		sessionaccount['uuid'] = null;
		sessionaccount['address'] = null;
		sessionaccount['description'] = global.t('not in list');
		
		sessionaccounts.push(sessionaccount);

		
		for (var i = 0; i < (sessionaccountarray ? sessionaccountarray.length : 0); i++) {
			var accnt = sessionaccountarray[i];
			
			var address = accnt.getAddress();
			var shortaddress = (address ? address.substring(0,4) + '...' + address.substring(address.length - 4,address.length) : '...');
			
			var sessionaccount = [];
			
			sessionaccount['uuid'] = accnt.getAccountUUID();
			sessionaccount['address'] = accnt.getAddress();
			sessionaccount['description'] = shortaddress + ' - ' + accnt.getDescription();
			
			sessionaccounts.push(sessionaccount);
		}
			
			
		// change function
		$scope.handleWalletSelectChange = function(){
			self.handleWalletSelectChange($scope);
		}

		$scope.fromaccounts = sessionaccounts;

	}
	
	prepareStockLedgerDeployForm($scope, $state, $stateParams) {
		console.log("Controllers.prepareStockLedgerDeployForm called");
		
		var self = this;

	    var contractuuid = $stateParams.uuid;

		// call module controller
		var global = this.global;
		
		var commonmodule = global.getModuleObject('common');
		var commoncontrollers = commonmodule.getControllersObject();

		var session = commonmodule.getSessionObject();
		
		var stockledgermodule = global.getModuleObject('securities');
		var stockledgercontrollers = stockledgermodule.getControllersObject();
		
		var stockledgercontract = stockledgercontrollers.getStockLedgerFromUUID(contractuuid);
		

		// filling fields
		var stockledger = [];
		
		$scope.stockledger = stockledger;

		

		if (stockledgercontract) {
			stockledger.index = stockledgercontract.getContractIndex();
			stockledger.uuid = stockledgercontract.getUUID();
		}
		
		// prepare wallet part
		var mvcmodule = global.getModuleObject('mvc');
		var mvcontrollers = mvcmodule.getControllersObject();

		
		// fill wallet select
		this._fillWalletLists($scope, session);

		// edit and cue
		$scope.handleWalletChange = function(){
			self.handleWalletChange($scope);
		}

		mvcontrollers.prepareWalletFormPart(session, $scope, $state, $stateParams);
		this.handleWalletChange($scope);
		
		// call hooks
		var stockledgerdeployform = document.getElementById("StockLedgerDeployForm");
		
		angular.element(document).ready(function () {
			var result = [];
			
			var params = [];
			
			params.push($scope);
			params.push(stockledgerdeployform);

			var ret = global.invokeHooks('alterStockLedgerDeployForm_hook', result, params);
			
			if (ret && result && result.length) {
				console.log('StockLedgerDeployForm overload handled by a module');			
			}
	    });
		
		
		// submit function
		$scope.handleSubmit = function(){
			self.handleStockLedgerDeploySubmit($scope);
		}
	}
	
	handleStockLedgerDeploySubmit($scope) {
		console.log("Controllers.handleStockLedgerDeploySubmit called");
		
		var self = this;
		var global = this.global;
		var app = this.getAppObject();
		
		// call hooks
		var result = [];
		
		var params = [];
		
		params.push($scope);

		var ret = global.invokeHooks('handleStockLedgerDeploySubmit_hook', result, params);
		
		if (ret && result && result.length) {
			console.log('handleStockLedgerDeploySubmit overloaded by a module');			
		}
		else {
			
			var wallet = $scope.walletused.text;
			var password = $scope.password.text;
			
			var gaslimit = $scope.gaslimit.text;
			var gasPrice = $scope.gasprice.text;
			
			var contractuuid = $scope.stockledger.uuid;
			
			
			var commonmodule = global.getModuleObject('common');
			var contracts = commonmodule.getContractsObject();
			
			var stockledgermodule = global.getModuleObject('securities');
			var stockledgercontrollers = stockledgermodule.getControllersObject();


			var contract = contracts.getContractObjectFromUUID(contractuuid);
			
			if ((contract) && (contract.isLocalOnly())) {
				var session = commonmodule.getSessionObject();
				
				var owner = contract.getLocalOwner();
				var owningaccount = session.getAccountObject(owner);

				var payingaccount = session.getAccountObject(wallet);
				
				// check that current session impersonates the contract's owner
				if (!session.isSessionAccount(owningaccount)) {
					alert("You must be connected with the account of the contract's owner");
					console.log('owning account is ' + owner + ' session account is ' + session.getSessionUserIdentifier());
					return;
				}
				
				// unlock account
				payingaccount.unlock(password, 300) // 300s, but we can relock the account
				.then(function(res) {
					try {
						contract.deploy(payingaccount, owningaccount, gaslimit, gasPrice, function (err, res) {
							
							if (!err) {
								console.log('contract deployed at ' + res);
								
								app.setMessage("contract has been deployed at " + res);
							}
							else  {
								console.log('error deploying contract ' + err);
								
								app.setMessage('error deploying contract ' + err);
							}
								
							// save stockledger
							stockledgercontrollers.saveStockLedgerObject(contract, function(err, res) {
								self.getAngularControllers().gotoStatePage('home.stockledgers');
							});
						});
						
						app.setMessage("contract deployment created a pending transaction");
						
					}
					catch(e) {
						app.setMessage("Error: " + e);
					}
					

					app.refreshDisplay();
				});
				
			}
		}


	}
	

	// accounts
	
	prepareAccountCreateForm($scope, $state, $stateParams) {
		console.log("Controllers.prepareAccountCreateForm called");

		var global = this.global;
		var self = this;
		  
	    var contractuuid = $stateParams.uuid;

		// call module controller
		var global = this.global;
		
		var commonmodule = global.getModuleObject('common');
		var commoncontrollers = commonmodule.getControllersObject();

		var session = commonmodule.getSessionObject();
		
		var stockledgermodule = global.getModuleObject('securities');
		var stockledgercontrollers = stockledgermodule.getControllersObject();
		
		var stockledgercontract = stockledgercontrollers.getStockLedgerFromUUID(contractuuid);

		// filling fields
		var stockledger = [];
		
		$scope.stockledger = stockledger;

		

		if (stockledgercontract) {
			stockledger.index = stockledgercontract.getContractIndex();
			stockledger.uuid = stockledgercontract.getUUID();
		}
		
		// prepare wallet part
		var mvcmodule = global.getModuleObject('mvc');
		var mvcontrollers = mvcmodule.getControllersObject();

		// fill wallet select
		this._fillWalletLists($scope, session);

		// edit and cue
		$scope.handleWalletChange = function(){
			self.handleWalletChange($scope);
		}

		mvcontrollers.prepareWalletFormPart(session, $scope, $state, $stateParams);
		this.handleWalletChange($scope);
		
		// call hooks
		var accountdeployform = document.getElementById("AccountCreateForm");
		
		angular.element(document).ready(function () {
			var result = [];
			
			var params = [];
			
			params.push($scope);
			params.push(accountdeployform);

			var ret = global.invokeHooks('alterAccountCreateFormForm_hook', result, params);
			
			if (ret && result && result.length) {
				console.log('AccountCreateForm overload handled by a module');			
			}
	    });
		
		
		// generate a new key
		this.generatePrivateKey($scope);
		
		// submit function
		$scope.handleSubmit = function(){
			self.handleAccountCreateSubmit($scope);
		}
		
		$scope.generatePrivateKey = function(){
			self.generatePrivateKey($scope);
		}
	}
	
	generatePrivateKey($scope) {
		console.log("Controllers.generatePrivateKey called");
		
		var global = this.global;
		var commonmodule = global.getModuleObject('common');
		var session = commonmodule.getSessionObject();
		
		var privkey = session.generatePrivateKey();		
		
		var newaccount = commonmodule.createBlankAccountObject();
		newaccount.setPrivateKey(privkey);
		
		var address = newaccount.getAddress();

		$scope.address = {text: address};
		$scope.privatekey = {text: privkey};
	}
	
	handleAccountCreateSubmit($scope) {
		console.log("Controllers.handleAccountCreateSubmit called");

		var self = this;
		var global = this.global;
		var app = global.getAppObject();

		var commonmodule = global.getModuleObject('common');
		var commoncontrollers = commonmodule.getControllersObject();

		var session = commonmodule.getSessionObject();

		
		var contractuuid = $scope.stockledger.uuid;
		
		var address = $scope.address.text;
		var acctprivkey = $scope.privatekey.text;

		var wallet = $scope.walletused.text;
		var password = $scope.password.text;
		
		var gaslimit = $scope.gaslimit.text;
		var gasPrice = $scope.gasprice.text;
		
		// call hooks
		var result = [];
		
		var params = [];
		
		params.push($scope);

		var ret = global.invokeHooks('handleAccountCreateSubmit_hook', result, params);
		if (ret && result && result.length) {
			console.log('handleAccountCreateSubmit overloaded by a module');			
		}
		else {
			var commonmodule = global.getModuleObject('common');
			var contracts = commonmodule.getContractsObject();

			var stockledgermodule = global.getModuleObject('securities');
			
			var stockledgercontrollers = stockledgermodule.getControllersObject();
			
			var contract = stockledgercontrollers.getStockLedgerFromUUID(contractuuid);
			
			if (contract) {
				var data = [];
				
				data['address'] = address;
				data['privatekey'] = acctprivkey;
				
				var account = stockledgercontrollers.createAccount(contract, data);

				if (account.isPrivateKeyValid()) {
					
					// payer for registration
					var payingaccount = session.getAccountObject(wallet);
					
					// unlock account
					payingaccount.unlock(password, 300); // 300s, but we can relock the account
					
					var owneraccount = contract.getOwnerAccount();
					console.log("contract owner is " + owneraccount.getAddress());
					console.log("session address is " + session.getSessionUserIdentifier());
					
					
					contract.registerAccount(payingaccount, gaslimit, gasPrice, account, function (err, res) {
						if (!err) {
							console.log('account deployed at position ' + res);
							
							// save stockledger
							stockledgercontrollers.saveStockLedgerObject(contract, function(err, res) {
								var params = {uuid: contractuuid}
								self.getAngularControllers().gotoStatePage('home.stockledgers.view', params);
							});
							
							app.setMessage("account has been deployed at " + res);
							
							app.refreshDisplay();
						}
						else  {
							console.log('error deploying account ' + err);
						}
							
					});
					
					app.setMessage("account deployment created a pending transaction");
						
					app.refreshDisplay();
					
				}
				
			}
		}

		
		
	}
	
	
	
	// shareholders
	
	prepareShareHolderCreateForm($scope, $state, $stateParams) {
		var global = this.global;
		var self = this;
		
		console.log("Controllers.prepareShareHolderCreateForm called");

	    var contractuuid = $stateParams.uuid;

		// call module controller
		var commonmodule = global.getModuleObject('common');
		var commoncontrollers = commonmodule.getControllersObject();

		var session = commonmodule.getSessionObject();
		
		var stockledgermodule = global.getModuleObject('securities');
		var stockledgercontrollers = stockledgermodule.getControllersObject();
		
		var stockledgercontract = stockledgercontrollers.getStockLedgerFromUUID(contractuuid);

		// filling fields
		var stockledger = [];
		
		$scope.stockledger = stockledger;

		

		if (stockledgercontract) {
			stockledger.index = stockledgercontract.getContractIndex();
			stockledger.uuid = stockledgercontract.getUUID();
		}
		
		  
		// submit function
		$scope.handleSubmit = function(){
			self.handleShareHolderCreateSubmit($scope);
		}
	}
	
	handleShareHolderCreateSubmit($scope) {
		console.log("Controllers.handleShareHolderCreateSubmit called");

		var contractuuid = $scope.stockledger.uuid;

		// fill data array
		// call module controller
		var global = this.global;
		var app = this.getAppObject();

		var stockledgermodule = global.getModuleObject('securities');
		
		var stockledgercontrollers = stockledgermodule.getControllersObject();
		
		var contract = stockledgercontrollers.getStockLedgerFromUUID(contractuuid);
		
		if (contract) {
			var data = [];
			
			data['shldridentifier'] = $scope.shldridentifier.text;
			
			// create (local) shareholder for these values
			var shareholder = stockledgercontrollers.createShareHolder(contract, data);
			
			// save shareholder
			var self = this;
			
			shareholder.saveLocalJson(function(err, res) {
				app.refreshDisplay();
			});
			
		}
		
	}
	
	
	prepareShareHolderModifyForm($scope, $state, $stateParams) {
		console.log("Controllers.prepareShareHolderModifyForm called");
		
		var self = this;

	    var contractuuid = $stateParams.uuid;
	    var stakeholderindex = $stateParams.index;

		// call module controller
		var global = this.global;
		var stockledgermodule = global.getModuleObject('securities');
		
		var stockledgercontrollers = stockledgermodule.getControllersObject();
		
		var contract = stockledgercontrollers.getStockLedgerFromUUID(contractuuid);

		// filling fields
		var stockledger = [];
		
		stockledger.uuid = (contract ? contract.getUUID() : null);
		
		$scope.stockledgeruuid = stockledger.uuid;
		$scope.stockledger = stockledger;
		
		var shldr = [];
		$scope.shareholder = shldr;
		
		
		if (contract) {
			var stakeholder = contract.getStakeHolderFromKey(stakeholderindex);
			
			if (stakeholder) {
				var shldridentifier = stakeholder.getLocalIdentifier();
				var shldrindex = stakeholder.getStakeHolderIndex();
				
				shldr.islocalonly = stakeholder.isLocalOnly();
				shldr.identifier = shldridentifier;
				shldr.index = shldrindex;
				
				$scope.shldrindex = shldrindex;
				$scope.shldridentifier = {text: shldridentifier};
			}
			
		}
		  
		// submit function
		$scope.handleSubmit = function(){
			self.handleShareHolderModifySubmit($scope);
		}
	}

	handleShareHolderModifySubmit($scope) {
		var global = this.global;
		var self = this;
		
		var app = this.getAppObject();

		console.log("Controllers.handleShareHolderModifySubmit called");
	    
		var contractuuid = $scope.stockledger.uuid;
	    var stakeholderindex = $scope.shareholder.index;

		// fill data array
		// call module controller
		var data = [];
		
		var stockledgermodule = global.getModuleObject('securities');
		
		var stockledgercontrollers = stockledgermodule.getControllersObject();
		
		var contract = stockledgercontrollers.getStockLedgerFromUUID(contractuuid);
		
		if (contract) {
			var shareholder = contract.getStakeHolderFromKey(stakeholderindex);
			
			if (shareholder) {
				data['shldridentifier'] = $scope.shldridentifier.text;
				
				// create (local) shareholder for these values
				stockledgercontrollers.modifyShareHolder(shareholder, data);
				
				// save shareholder
				shareholder.saveLocalJson(function(err, res) {
					app.refreshDisplay();
				});
			}
			
		}
		
		
	}
	
	// shareholder deployment
	prepareShareHolderDeployForm($scope, $state, $stateParams) {
		console.log("Controllers.prepareShareHolderDeployForm called");
		
		var self = this;

	    var contractuuid = $stateParams.uuid;
	    var stakeholderindex = $stateParams.index;

		// call module controller
		var global = this.global;
		
		var commonmodule = global.getModuleObject('common');
		var commoncontrollers = commonmodule.getControllersObject();

		var session = commonmodule.getSessionObject();
		
		var stockledgermodule = global.getModuleObject('securities');
		var stockledgercontrollers = stockledgermodule.getControllersObject();
		
		var contract = stockledgercontrollers.getStockLedgerFromUUID(contractuuid);
		

		// filling fields
		var stockledger = [];
		
		$scope.stockledger = stockledger;

		var shldr = [];
		$scope.shareholder = shldr;
		
		if (contract) {
			stockledger.uuid = (contract ? contract.getUUID() : null);
			
			$scope.stockledgeruuid = stockledger.uuid;
			$scope.stockledger = stockledger;

			var stakeholder = contract.getStakeHolderFromKey(stakeholderindex);
			
			if (stakeholder) {
				var shldridentifier = stakeholder.getLocalIdentifier();
				var shldrindex = stakeholder.getStakeHolderIndex();
				
				shldr.islocalonly = stakeholder.isLocalOnly();
				shldr.identifier = shldridentifier;
				shldr.index = shldrindex;
				
				$scope.shldrindex = shldrindex;
				$scope.shldridentifier = {text: shldridentifier};
				$scope.shldraddress = {text: ""};
			}
			
		}
		
		// prepare wallet part
		var mvcmodule = global.getModuleObject('mvc');
		var mvcontrollers = mvcmodule.getControllersObject();

		// fill wallet select
		this._fillWalletLists($scope, session);

		// edit and cue
		$scope.handleWalletChange = function(){
			self.handleWalletChange($scope);
		}

		mvcontrollers.prepareWalletFormPart(session, $scope, $state, $stateParams);
		this.handleWalletChange($scope);

		
		// call hooks
		var shareholderdeployform = document.getElementById("ShareHolderDeployForm");
		
		angular.element(document).ready(function () {
			var result = [];
			
			var params = [];
			
			params.push($scope);
			params.push(shareholderdeployform);

			var ret = global.invokeHooks('alterShareHolderDeployForm_hook', result, params);
			
			if (ret && result && result.length) {
				console.log('ShareHolderDeployForm overload handled by a module');			
			}
	    });
		
		
		// submit function
		$scope.handleSubmit = function(){
			self.handleShareHolderDeploySubmit($scope);
		}
	}
	
	handleShareHolderDeploySubmit($scope) {
		console.log("Controllers.handleShareHolderDeploySubmit called");
		
		var self = this;
		var global = this.global;
		var app = this.getAppObject();
		
		// call hooks
		var result = [];
		
		var params = [];
		
		params.push($scope);

		var ret = global.invokeHooks('handleShareHolderDeploySubmit_hook', result, params);
		
		if (ret && result && result.length) {
			console.log('handleShareHolderDeploySubmit overloaded by a module');			
		}
		else {
			
			var wallet = $scope.walletused.text;
			var password = $scope.password.text;
			
			var gaslimit = $scope.gaslimit.text;
			var gasPrice = $scope.gasprice.text;
			
			var contractuuid = $scope.stockledger.uuid;
		    var stakeholderindex = $scope.shareholder.index;
			
			
			var commonmodule = global.getModuleObject('common');
			var contracts = commonmodule.getContractsObject();
			
			var stockledgermodule = global.getModuleObject('securities');
			var stockledgercontrollers = stockledgermodule.getControllersObject();


			var contract = contracts.getContractObjectFromUUID(contractuuid);
			
			if (contract) {
				var session = commonmodule.getSessionObject();
				
				var owner = contract.getLocalOwner();
				var owningaccount = session.getAccountObject(owner);

				var payingaccount = session.getAccountObject(wallet);
				
				// check that current session impersonates the contract's owner
				if (!session.isSessionAccount(owningaccount)) {
					alert("You must be connected with the account of the contract's owner");
					console.log('owning account is ' + owner + ' session account is ' + session.getSessionUserIdentifier());
					return;
				}
				
				// unlock account
				payingaccount.unlock(password, 300) // 300s, but we can relock the account
				.then(function(res) {
					try {
						var stakeholder = contract.getStakeHolderFromKey(stakeholderindex);
						
						if (stakeholder) {
							var data = [];

							data['shldridentifier'] = $scope.shldridentifier.text;
							
							// create (local) shareholder for these values
							stockledgercontrollers.modifyShareHolder(stakeholder, data);
							
							var shldridentifier = $scope.shldridentifier.text;
							var shldraddress = $scope.shldraddress.text;
							
							var shldrrsapubkey;
							var shldrprivkey;
							
							var owneraccount = contract.getOwnerAccount();
							console.log("contract owner is " + owneraccount.getAddress());
							console.log("session address is " + session.getSessionUserIdentifier());
							
							// check that current session is signed-in
							if (session.isAnonymous()) {
								alert("You must be signed-in to register a stakeholder");
								
								return;
							}
							
							// deploy
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
										
										
										
										if (!stockledgermodule.ownsContract(contract)) {
											/*var sessionaccountaddresses = session.getSessionAccountAddresses();
											var found = false;
											
											for (var i = 0; i < sessionaccountaddresses.length; i++) {
												var sessionaccountaddress = sessionaccountaddresses[i];
												if (!contract.getChainStakeHolderFromAddress(sessionaccountaddress))
													continue;
												else {
													found = true;
													break;
												}
											}*/
											
											if (!contract.isStakeHolder(session)) {
												alert("You must be signed as one of the shareholder of the contract to create new shareholders");
												
												return;									
											}

										}
										
										shldraddress = account.getAddress();
										shldrrsapubkey = account.getRsaPublicKey();
										
									}
									else {
										if (stockledgermodule.ownsContract(contract)) {
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
											
											// save shareholder
											stakeholder.saveLocalJson(function(err, res) {
												var params = {uuid: contractuuid}
												self.getAngularControllers().gotoStatePage('home.stockledgers.view', params);
											});
											
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
						}
						
					}
					catch(e) {
						app.setMessage("Error: " + e);
					}
					

					app.refreshDisplay();
				});
				
			}
		}


	}

	// issuances
	
	prepareIssuanceCreateForm($scope, $state, $stateParams) {
		var global = this.global;
		var self = this;
		
		console.log("Controllers.prepareIssuanceCreateForm called");

	    var contractuuid = $stateParams.uuid;

		// call module controller
		var commonmodule = global.getModuleObject('common');
		var commoncontrollers = commonmodule.getControllersObject();

		var session = commonmodule.getSessionObject();
		
		var stockledgermodule = global.getModuleObject('securities');
		var stockledgercontrollers = stockledgermodule.getControllersObject();
		
		var stockledgercontract = stockledgercontrollers.getStockLedgerFromUUID(contractuuid);

		// filling fields
		var stockledger = [];
		
		$scope.stockledger = stockledger;

		if (stockledgercontract) {
			stockledger.index = stockledgercontract.getContractIndex();
			stockledger.uuid = stockledgercontract.getUUID();
		}		  
		// submit function
		$scope.handleSubmit = function(){
			self.handleIssuanceCreateSubmit($scope);
		}
	}
	
	handleIssuanceCreateSubmit($scope) {
		console.log("Controllers.handleIssuanceCreateSubmit called");

		var contractuuid = $scope.stockledger.uuid;

		// fill data array
		// call module controller
		var global = this.global;
		var app = this.getAppObject();

		var stockledgermodule = global.getModuleObject('securities');
		
		var stockledgercontrollers = stockledgermodule.getControllersObject();
		
		var contract = stockledgercontrollers.getStockLedgerFromUUID(contractuuid);
		
		if (contract) {
			// fill data array
			var data = [];
			
			data['issuancename'] = $scope.issuancename.text;
			data['issuancedescription'] = $scope.issuancedescription.text;
			data['numberofshares'] = $scope.numberofshares.text;
			data['percentofcapital'] = $scope.percentofcapital.text;
			
			var issuance = stockledgercontrollers.createIssuance(contract, data);
			
			// save issuance
			var self = this;
			
			issuance.saveLocalJson(function(err, res) {
				app.refreshDisplay();
			});
		}
	}
	
	
	prepareIssuanceModifyForm($scope, $state, $stateParams) {
		console.log("Controllers.prepareIssuanceModifyForm called");
		
		var self = this;

	    var contractuuid = $stateParams.uuid;
	    var issuanceindex = $stateParams.index;

		// call module controller
		var global = this.global;
		var stockledgermodule = global.getModuleObject('securities');
		
		var stockledgercontrollers = stockledgermodule.getControllersObject();
		
		var contract = stockledgercontrollers.getStockLedgerFromUUID(contractuuid);

		// filling fields
		var stockledger = [];
		$scope.stockledger = stockledger;
		
		var issu = [];
		$scope.issuance = issu;
		
		if (contract) {
			stockledger.uuid = (contract ? contract.getUUID() : null);
			
			$scope.stockledgeruuid = stockledger.uuid;
			$scope.stockledger = stockledger;

			var issuance = contract.getIssuanceFromKey(issuanceindex);
			
			if (issuance) {
				var isLocalOnly = issuance.isLocalOnly();
				
			    var localname = issuance.getLocalName();
			    var localdescription = issuance.getLocalDescription();
			    var localnumberofshares = issuance.getLocalNumberOfShares();
			    var localpercentofcapital = issuance.getLocalPercentOfCapital();

				
				issu.islocalonly = isLocalOnly;
				issu.index = issuance.getIssuanceIndex();
				issu.uuid = issuance.getUUID();
				
				$scope.issuancename = {text: localname};
				$scope.issuancedescription = {text: localdescription};
				$scope.numberofshares = {text: localnumberofshares};
				$scope.percentofcapital = {text: localpercentofcapital};
			}
			
		}
		  
		// submit function
		$scope.handleSubmit = function(){
			self.handleIssuanceModifySubmit($scope);
		}
	}

	handleIssuanceModifySubmit($scope) {
		var global = this.global;
		var self = this;
		
		console.log("Controllers.handleIssuanceModifySubmit called");
	    
		var contractuuid = $scope.stockledger.uuid;
	    var issuanceindex = $scope.issuance.index;

	    
		// fill data array
		// call module controller
		var data = [];
		
		var stockledgermodule = global.getModuleObject('securities');
		
		var stockledgercontrollers = stockledgermodule.getControllersObject();
		
		var contract = stockledgercontrollers.getStockLedgerFromUUID(contractuuid);
		
		if (contract) {
			
			var issuance = contract.getIssuanceFromKey(issuanceindex);
			
			if (issuance) {
				data['issuancename'] = $scope.issuancename.text;
				data['issuancedescription'] = $scope.issuancedescription.text;
				data['numberofshares'] = $scope.numberofshares.text;
				data['percentofcapital'] = $scope.percentofcapital.text;
				
				stockledgercontrollers.modifyIssuance(issuance, data);
				
				// save issuance
				issuance.saveLocalJson(function(err, res) {
					app.refreshDisplay();
				});
			}
		}
		
		// save shareholder
		
		issuance.saveLocalJson(function(err, res) {
			app.refreshDisplay();
		});
		
	}
	
	// issuance deployment
	prepareIssuanceDeployForm($scope, $state, $stateParams) {
		console.log("Controllers.prepareIssuanceDeployForm called");
		
		var self = this;

	    var contractuuid = $stateParams.uuid;
	    var issuanceindex = $stateParams.index;

		// call module controller
		var global = this.global;
		
		var commonmodule = global.getModuleObject('common');
		var commoncontrollers = commonmodule.getControllersObject();

		var session = commonmodule.getSessionObject();
		
		var stockledgermodule = global.getModuleObject('securities');
		var stockledgercontrollers = stockledgermodule.getControllersObject();
		
		var contract = stockledgercontrollers.getStockLedgerFromUUID(contractuuid);

		// filling fields
		var stockledger = [];
		
		$scope.stockledger = stockledger;
		
		var issu = [];
		$scope.issuance = issu;
		
		if (contract) {
			stockledger.uuid = (contract ? contract.getUUID() : null);
			
			$scope.stockledgeruuid = stockledger.uuid;
			$scope.stockledger = stockledger;

			var issuance = contract.getIssuanceFromKey(issuanceindex);
			
			if (issuance) {
				var isLocalOnly = issuance.isLocalOnly();
				
			    var localname = issuance.getLocalName();
			    var localdescription = issuance.getLocalDescription();
			    var localnumberofshares = issuance.getLocalNumberOfShares();
			    var localpercentofcapital = issuance.getLocalPercentOfCapital();

				
				issu.islocalonly = isLocalOnly;
				issu.index = issuance.getIssuanceIndex();
				issu.uuid = issuance.getUUID();
				
				$scope.issuancename = {text: localname};
				$scope.issuancedescription = {text: localdescription};
				$scope.numberofshares = {text: localnumberofshares};
				$scope.percentofcapital = {text: localpercentofcapital};
			}
			
		}
		
		// prepare wallet part
		var mvcmodule = global.getModuleObject('mvc');
		var mvcontrollers = mvcmodule.getControllersObject();

		// fill wallet select
		this._fillWalletLists($scope, session);

		// edit and cue
		$scope.handleWalletChange = function(){
			self.handleWalletChange($scope);
		}

		mvcontrollers.prepareWalletFormPart(session, $scope, $state, $stateParams);
		this.handleWalletChange($scope);

		
		// call hooks
		var issuancedeployform = document.getElementById("IssuanceDeployForm");
		
		angular.element(document).ready(function () {
			var result = [];
			
			var params = [];
			
			params.push($scope);
			params.push(issuancedeployform);

			var ret = global.invokeHooks('alterIssuanceDeployForm_hook', result, params);
			
			if (ret && result && result.length) {
				console.log('IssuanceDeployForm overload handled by a module');			
			}
	    });
		
		
		// submit function
		$scope.handleSubmit = function(){
			self.handleIssuanceDeploySubmit($scope);
		}
	}
	
	handleIssuanceDeploySubmit($scope) {
		console.log("Controllers.handleIssuanceDeploySubmit called");
		
		var self = this;
		var global = this.global;
		var app = this.getAppObject();
		
		// call hooks
		var result = [];
		
		var params = [];
		
		params.push($scope);

		var ret = global.invokeHooks('handleIssuanceDeploySubmit_hook', result, params);
		
		if (ret && result && result.length) {
			console.log('handleIssuanceDeploySubmit overloaded by a module');			
		}
		else {
			
			var wallet = $scope.walletused.text;
			var password = $scope.password.text;
			
			var gaslimit = $scope.gaslimit.text;
			var gasPrice = $scope.gasprice.text;
			
			var contractuuid = $scope.stockledger.uuid;
		    var issuanceindex = $scope.issuance.index;
			
			
			var commonmodule = global.getModuleObject('common');
			var contracts = commonmodule.getContractsObject();
			
			var stockledgermodule = global.getModuleObject('securities');
			var stockledgercontrollers = stockledgermodule.getControllersObject();


			var contract = contracts.getContractObjectFromUUID(contractuuid);
			
			if (contract) {
				var session = commonmodule.getSessionObject();
				
				var owner = contract.getLocalOwner();
				var owningaccount = session.getAccountObject(owner);

				var payingaccount = session.getAccountObject(wallet);
				
				// check that current session impersonates the contract's owner
				if (!session.isSessionAccount(owningaccount)) {
					alert("You must be connected with the account of the contract's owner");
					console.log('owning account is ' + owner + ' session account is ' + session.getSessionUserIdentifier());
					return;
				}
				
				// unlock account
				payingaccount.unlock(password, 300) // 300s, but we can relock the account
				.then(function(res) {
					try {
						var issuance = contract.getIssuanceFromKey(issuanceindex);
						
						if (issuance) {
							var data = [];
							
							data['issuancename'] = $scope.issuancename.text;
							data['issuancedescription'] = $scope.issuancedescription.text;
							data['numberofshares'] = $scope.numberofshares.text;
							data['percentofcapital'] = $scope.percentofcapital.text;
							
							stockledgercontrollers.modifyIssuance(issuance, data);
							
							// deploy
							// check that current session impersonates the contract's owner
							var owneraccount = contract.getOwnerAccount();
							
							if (!session.isSessionAccount(owneraccount)) {
								alert("You must be connected with the account of the contract's owner");
								
								return;
							}
							
							contract.registerIssuance(payingaccount, gaslimit, gasPrice, issuance, function (err, res) {
								
								if (!err) {
									console.log('issuance deployed at position ' + res);
									
									// save issuance
									issuance.saveLocalJson(function(err, res) {
										var params = {uuid: contractuuid}
										self.getAngularControllers().gotoStatePage('home.stockledgers.view', params);
									});
									
									app.setMessage("issuance has been deployed at " + res);
									
									app.refreshDisplay();
								}
								else  {
									console.log('error deploying issuance ' + err);
								}
								
								app.setMessage("issuance deployment created a pending transaction");
								
								return;
							});

						}
					}
					catch(e) {
						app.setMessage("Error: " + e);
					}
					

					app.refreshDisplay();
				});
				
			}
		}


	}

	// transactions
	handleFromShareHolderSelectChange($scope) {
		
	    var contractuuid = $scope.stockledger.uuid;
	    var fromaddress = $scope.selectedshldrfrom;
		
		var global = this.global;
		
		var commonmodule = global.getModuleObject('common');
		var commoncontrollers = commonmodule.getControllersObject();

		var session = commonmodule.getSessionObject();
		
		var stockledgermodule = global.getModuleObject('securities');
		var stockledgercontrollers = stockledgermodule.getControllersObject();
		
		var stockledgercontract = stockledgercontrollers.getStockLedgerFromUUID(contractuuid);

		var fromshldr = stockledgermodule.getStockHolderObjectFromAddress(stockledgercontract, fromaddress);

		if (fromshldr) {
			$scope.fromuuid = fromshldr.getUUID();
			$scope.fromaddress = fromshldr.getAddress();
			console.log('picking from shareholder with ' + $scope.fromaddress + ' with uuid ' + $scope.fromuuid);
		}
	}
	
	handleToShareHolderSelectChange($scope) {
		
	    var contractuuid = $scope.stockledger.uuid;
	    var toaddress = $scope.selectedshldrto;
		
		var global = this.global;
		
		var commonmodule = global.getModuleObject('common');
		var commoncontrollers = commonmodule.getControllersObject();

		var session = commonmodule.getSessionObject();
		
		var stockledgermodule = global.getModuleObject('securities');
		var stockledgercontrollers = stockledgermodule.getControllersObject();
		
		var stockledgercontract = stockledgercontrollers.getStockLedgerFromUUID(contractuuid);

		var toshldr = stockledgermodule.getStockHolderObjectFromAddress(stockledgercontract, toaddress);

		if (toshldr) {
			$scope.touuid = toshldr.getUUID();
			$scope.toddress = toshldr.getAddress();
			console.log('picking to shareholder with ' + $scope.toaddress + ' with uuid ' + $scope.touuid);
		}
	}
	
	_fillContractShareHolderLists($scope, contract) {
		var self = this;
		var global = this.global;
		
		var commonmodule = global.getModuleObject('common');
		var commoncontrollers = commonmodule.getControllersObject();

		var session = commonmodule.getSessionObject();
		
		var stockledgermodule = global.getModuleObject('securities');
		var stockledgercontrollers = stockledgermodule.getControllersObject();
		
		
		// shareholders accounts
		var shldrs = [];
		
		contract.getChainStakeHolderList(function(err, res) {
			if (res) {
				console.log("retrieved a list of " + res.length + " stakeholders, filling dropdown ");
				
				for (var i = 0; i < res.length; i++) {
					var stakeholder = res[i];
		
					if (stakeholder) {
						var shldr = [];
						
						var address = stakeholder.getAddress();
						var shortaddress = (address ? address.substring(0,4) + '...' + address.substring(address.length - 4,address.length) : '...');
						
						var localidentifier = stakeholder.getLocalIdentifier();
						var localidentifierdisplayname = ( localidentifier && (localidentifier.length > 0) ? shortaddress + ' - ' + localidentifier : address);
						
						var stakeholderidentifier = stockledgercontrollers.getStakeholderDisplayName(address, contract);
						
						shldr['uuid'] = stakeholder.getUUID();
						shldr['address'] = address;
						shldr['description'] = stakeholderidentifier;
						
						shldrs.push(shldr);
						
					}
					
				}
				
				$scope.$apply();
			}
			
			if (err) {
				console.log(err);
			}
		});
			
		$scope.fromshldrs = shldrs;
		$scope.toshldrs = shldrs;
		
		// change functions
		$scope.handleFromChange = function(){
			self.handleFromShareHolderSelectChange($scope);
		}

		$scope.handleToChange = function(){
			self.handleToShareHolderSelectChange($scope);
		}

	}
	
	_fillContractIssuanceList($scope, contract) {
		var self = this;
		
		// shareholders accounts
		var issuances = [];
		
		contract.getChainIssuanceList(function(err, res) {
			if (res) {
				console.log("retrieved a list of " + res.length + " issuances, filling dropdown ");
				
				for (var i = 0; i < res.length; i++) {
					var chainissuance = res[i];
					
					if (chainissuance) {
						var issuance = [];
						
						issuance['number'] = chainissuance.getChainNumber();
						issuance['description'] = chainissuance.getChainName();
						
						issuances.push(issuance);
					}
		
				}
				
				$scope.$apply();
			}
			
			if (err) {
				console.log(err);
			}
		});
			
		$scope.issuances = issuances;

	}
	
	prepareTransactionCreateForm($scope, $state, $stateParams) {
		var global = this.global;
		var self = this;
		
		console.log("Controllers.prepareTransactionCreateForm called");

	    var contractuuid = $stateParams.uuid;

		// call module controller
		var commonmodule = global.getModuleObject('common');
		var commoncontrollers = commonmodule.getControllersObject();

		var session = commonmodule.getSessionObject();
		
		var stockledgermodule = global.getModuleObject('securities');
		var stockledgercontrollers = stockledgermodule.getControllersObject();
		
		var stockledgercontract = stockledgercontrollers.getStockLedgerFromUUID(contractuuid);

		// filling fields
		var stockledger = [];
		
		$scope.stockledger = stockledger;

		if (stockledgercontract) {
			stockledger.index = stockledgercontract.getContractIndex();
			stockledger.uuid = stockledgercontract.getUUID();
			
			// fill shareholder lists
			this._fillContractShareHolderLists($scope, stockledgercontract);
			
			// fill issuance list
			this._fillContractIssuanceList($scope, stockledgercontract);
			
		}
		
		// submit function
		$scope.handleSubmit = function(){
			self.handleTransactionCreateSubmit($scope);
		}
	}
	
	handleTransactionCreateSubmit($scope) {
		console.log("Controllers.handleTransactionCreateSubmit called");

		var contractuuid = $scope.stockledger.uuid;

		// fill data array
		// call module controller
		var global = this.global;
		var app = this.getAppObject();

		var stockledgermodule = global.getModuleObject('securities');
		
		var stockledgercontrollers = stockledgermodule.getControllersObject();
		
		var contract = stockledgercontrollers.getStockLedgerFromUUID(contractuuid);
		
		if (contract) {
			var data = [];
			
			data['from'] = $scope.selectedshldrfrom;
			data['to'] = $scope.selectedshldrto;
			data['issuancenumber'] = $scope.selectedissuancenumber;
			data['numberofshares'] = $scope.numberofshares.text;
			data['consideration'] = $scope.consideration.text;
			data['currency'] = $scope.currency.text;

			// create (local) shareholder for these values
			var transaction = stockledgercontrollers.createTransaction(contract, data);
			
			// save shareholder
			var self = this;
			
			transaction.saveLocalJson(function(err, res) {
				app.refreshDisplay();
			});
			
		}
		
	}
	
	
	prepareTransactionModifyForm($scope, $state, $stateParams) {
		var global = this.global;
		var self = this;

		console.log("Controllers.prepareTransactionModifyForm called");
		
	    var contractuuid = $stateParams.uuid;
	    var transactionindex = $stateParams.index;

		// call module controller
		var stockledgermodule = global.getModuleObject('securities');
		
		var stockledgercontrollers = stockledgermodule.getControllersObject();
		
		var contract = stockledgercontrollers.getStockLedgerFromUUID(contractuuid);

		// filling fields
		var stockledger = [];
		$scope.stockledger = stockledger;
		
		var tx = [];
		$scope.transaction = tx;
		
		if (contract) {
			stockledger.index = contract.getContractIndex();
			stockledger.uuid = contract.getUUID();
			
			
			var transaction = contract.getTransactionFromKey(transactionindex);
			
			if (transaction) {
				// fill shareholder lists
				this._fillContractShareHolderLists($scope, contract);
				
				// fill issuance list
				this._fillContractIssuanceList($scope, contract);
				

				var isLocalOnly = transaction.isLocalOnly();
				
				
			    var localfrom = transaction.getLocalFrom();
			    var localto = transaction.getLocalTo();
			    var localissuancenumber = transaction.getLocalIssuanceNumber();
			    var localnumberofshares = transaction.getLocalNumberOfShares();
			    var localconsideration = transaction.getLocalConsideration();
			    var localcurrency = transaction.getLocalCurrency();

			    tx.islocalonly = isLocalOnly;
			    tx.index = transaction.getTransactionIndex();
			    tx.uuid = transaction.getUUID();
				
				$scope.selectedshldrfrom = localfrom;
				$scope.selectedshldrto = localto;
				$scope.selectedissuancenumber = localissuancenumber;
				$scope.numberofshares = {text: localnumberofshares};
				$scope.consideration = {text: localconsideration};
				$scope.currency = {text: localcurrency};

			}
		}
		  
		// submit function
		$scope.handleSubmit = function(){
			self.handleTransactionModifySubmit($scope);
		}
	}

	handleTransactionModifySubmit($scope) {
		var self = this;
		var global = this.global;
		var app = this.getAppObject();
		
		console.log("Controllers.handleTransactionModifySubmit called");
	    
		var contractuuid = $scope.stockledger.uuid;
	    var transactionindex = $scope.transaction.index;

		// call module controller
		var stockledgermodule = global.getModuleObject('securities');
		
		var stockledgercontrollers = stockledgermodule.getControllersObject();
		
		var contract = stockledgercontrollers.getStockLedgerFromUUID(contractuuid);

		if (contract) {
			
			var transaction = contract.getTransactionFromKey(transactionindex);
			
			if (transaction) {
				var data = [];
				
				data['from'] = $scope.selectedshldrfrom;
				data['to'] = $scope.selectedshldrto;
				data['issuancenumber'] = $scope.selectedissuancenumber;
				data['numberofshares'] = $scope.numberofshares.text;
				data['consideration'] = $scope.consideration.text;
				data['currency'] = $scope.currency.text;

				stockledgercontrollers.modifyTransaction(transaction, data);
				
				// save issuance
				transaction.saveLocalJson(function(err, res) {
					app.refreshDisplay();
				});
			}
		}
		
		
	}
	
	// transaction deployment
	prepareTransactionDeployForm($scope, $state, $stateParams) {
		var global = this.global;
		var self = this;

		console.log("Controllers.prepareTransactionDeployForm called");
		
	    var contractuuid = $stateParams.uuid;
	    var transactionindex = $stateParams.index;

		// call module controller
		var commonmodule = global.getModuleObject('common');
		var commoncontrollers = commonmodule.getControllersObject();

		var session = commonmodule.getSessionObject();
		
		var stockledgermodule = global.getModuleObject('securities');
		
		var stockledgercontrollers = stockledgermodule.getControllersObject();
		
		var contract = stockledgercontrollers.getStockLedgerFromUUID(contractuuid);

		// filling fields
		var stockledger = [];
		$scope.stockledger = stockledger;
		
		var tx = [];
		$scope.transaction = tx;
		
		if (contract) {
			stockledger.index = contract.getContractIndex();
			stockledger.uuid = contract.getUUID();
			
			
			var transaction = contract.getTransactionFromKey(transactionindex);
			
			if (transaction) {
				// fill shareholder lists
				this._fillContractShareHolderLists($scope, contract);
				
				// fill issuance list
				this._fillContractIssuanceList($scope, contract);
				

				var isLocalOnly = transaction.isLocalOnly();
				
				
			    var localfrom = transaction.getLocalFrom();
			    var localto = transaction.getLocalTo();
			    var localissuancenumber = transaction.getLocalIssuanceNumber();
			    var localnumberofshares = transaction.getLocalNumberOfShares();
			    var localconsideration = transaction.getLocalConsideration();
			    var localcurrency = transaction.getLocalCurrency();

			    tx.islocalonly = isLocalOnly;
			    tx.index = transaction.getTransactionIndex();
			    tx.uuid = transaction.getUUID();
				
				$scope.selectedshldrfrom = localfrom;
				$scope.selectedshldrto = localto;
				$scope.selectedissuancenumber = localissuancenumber;
				$scope.numberofshares = {text: localnumberofshares};
				$scope.consideration = {text: localconsideration};
				$scope.currency = {text: localcurrency};

			}
		}
		
		// prepare wallet part
		var mvcmodule = global.getModuleObject('mvc');
		var mvcontrollers = mvcmodule.getControllersObject();

		// fill wallet select
		this._fillWalletLists($scope, session);

		// edit and cue
		$scope.handleWalletChange = function(){
			self.handleWalletChange($scope);
		}

		mvcontrollers.prepareWalletFormPart(session, $scope, $state, $stateParams);
		this.handleWalletChange($scope);

		
		// call hooks
		var transactiondeployform = document.getElementById("TransactionDeployForm");
		
		angular.element(document).ready(function () {
			var result = [];
			
			var params = [];
			
			params.push($scope);
			params.push(transactiondeployform);

			var ret = global.invokeHooks('alterTransactionDeployForm_hook', result, params);
			
			if (ret && result && result.length) {
				console.log('TransactionDeployForm overload handled by a module');			
			}
	    });
		
		
		// submit function
		$scope.handleSubmit = function(){
			self.handleTransactionDeploySubmit($scope);
		}
	}
	
	handleTransactionDeploySubmit($scope) {
		console.log("Controllers.handleTransactionDeploySubmit called");
		
		var self = this;
		var global = this.global;
		var app = this.getAppObject();
		
		// call hooks
		var result = [];
		
		var params = [];
		
		params.push($scope);

		var ret = global.invokeHooks('handleTransactionDeploySubmit_hook', result, params);
		
		if (ret && result && result.length) {
			console.log('handleTransactionDeploySubmit overloaded by a module');			
		}
		else {
			
			var wallet = $scope.walletused.text;
			var password = $scope.password.text;
			
			var gaslimit = $scope.gaslimit.text;
			var gasPrice = $scope.gasprice.text;
			
			var contractuuid = $scope.stockledger.uuid;
		    var transactionindex = $scope.transaction.index;
			
			
			var commonmodule = global.getModuleObject('common');
			var contracts = commonmodule.getContractsObject();
			
			var stockledgermodule = global.getModuleObject('securities');
			var stockledgercontrollers = stockledgermodule.getControllersObject();


			var contract = contracts.getContractObjectFromUUID(contractuuid);
			
			if (contract) {
				var session = commonmodule.getSessionObject();
				
				var owner = contract.getLocalOwner();
				var owningaccount = session.getAccountObject(owner);

				var payingaccount = session.getAccountObject(wallet);
				
				// check that current session is signed-in
				if (session.isAnonymous()) {
					alert("You must be signed-in to register a transaction");
					
					return;
				}
					
				
				// unlock account
				payingaccount.unlock(password, 300) // 300s, but we can relock the account
				.then(function(res) {
					try {
						var transaction = contract.getTransactionFromKey(transactionindex);
						
						if (transaction) {
							var data = [];
							
							data['from'] = $scope.selectedshldrfrom;
							data['to'] = $scope.selectedshldrto;
							data['issuancenumber'] = $scope.selectedissuancenumber;
							data['numberofshares'] = $scope.numberofshares.text;
							data['consideration'] = $scope.consideration.text;
							data['currency'] = $scope.currency.text;

							stockledgercontrollers.modifyTransaction(transaction, data);
							
							
							// nature depends from the current signed account
							// owner => 1 (transfer), shareholder =>11 (endorsement record)
							if (stockledgermodule.ownsContract(contract))
								transaction.setLocalNature(1); // transfer
							else
								transaction.setLocalNature(11); // record

							
							// deploy
							contract.registerTransaction(payingaccount, gaslimit, gasPrice, transaction, function (err, res) {
								
								if (!err) {
									console.log('transaction deployed at position ' + res);
									
									// save transaction
									transaction.saveLocalJson(function(err, res) {
										var params = {uuid: contractuuid}
										self.getAngularControllers().gotoStatePage('home.stockledgers.view', params);
									});
									
									app.setMessage("transaction has been deployed at " + res);
									
									app.refreshDisplay();
								}
								else  {
									console.log('error deploying transaction ' + err);
								}
									
							});
							
							app.setMessage("transaction deployment created a pending blockchain transaction");
						}
					}
					catch(e) {
						app.setMessage("Error: " + e);
					}
					

					app.refreshDisplay();
				});
				
			}
		}


	}
}

if ( typeof window !== 'undefined' && window )
GlobalClass.registerModuleClass('securities-dapp', 'SecuritiesAngularControllers', DAPPControllers);
else
module.exports = DAPPControllers; // we are in node js