'use strict';

class Controllers {
	
	constructor(global) {
		this.global = global;
		this.app = null; // filled in registerControllers
		
		this.name = 'angularjs-1.x';
		
		var dappsmodule = global.getModuleObject('dapps');
		this.dappscontrollers = (dappsmodule ? dappsmodule.getAngularControllers() : null);
	}
	
	getAppObject() {
		return this.app;
	}
	
	registerControllers(app) {
		this.app = app;
		
		var global = this.global;
		
		var angular_app = app.getAngularApp();
		var controllers = this;
		
		var dappscontrollers = this.dappscontrollers;
		
		//
		// registering controllers
		//
		
		
		//
		// Controllers for views
		//
		
		// templates
		
		// header
		angular_app.controller("HomeLinkCtrl",  ['$scope', function ($scope) {
			controllers.prepareHomeLink($scope);
		}]);

		angular_app.controller("LoginViewCtrl", ['$rootScope', '$scope', '$sce', '$timeout', '$injector', function ($rootScope, $scope, $sce, $timeout, $injector) {
			$scope.injectorforrefresh = $injector;
			controllers.prepareLoginView($rootScope, $scope, $sce, $timeout);
		}]);
		
		// home
		angular_app.controller("HomeViewCtrl",  ['$scope', function ($scope) {
			controllers.prepareHomeView($scope);
		}]);

		
		// menu bar
		angular_app.controller("MenuBarCtrl",  ['$scope', function ($scope) {
			controllers.preparMenuBarView($scope);
		}]);

		// partials
		
		// node info
		angular_app.controller("NodeInfoViewCtrl",  ['$scope', function ($scope) {
			controllers.prepareNodeInfoView($scope);
		}]);

		// account
		angular_app.controller("AccountViewCtrl",  ['$scope', function ($scope) {
			controllers.prepareAccountView($scope);
		}]);

		
		angular_app.controller("CryptoKeysViewCtrl",  ['$scope', '$state', '$stateParams', function ($scope, $state, $stateParams) {
			controllers.prepareCryptoKeysView($scope, $state, $stateParams);
		}]);
		
		angular_app.controller("EthAccountsViewCtrl",  ['$scope', '$state', '$stateParams', function ($scope, $state, $stateParams) {
			controllers.prepareEthAccountsView($scope, $state, $stateParams);
		}]);
		
		angular_app.controller("EthAccountViewCtrl",  ['$scope', '$state', '$stateParams', function ($scope, $state, $stateParams) {
			controllers.prepareEthAccountView($scope, $state, $stateParams);
		}]);
		
		angular_app.controller("TransactionHistoryViewCtrl",  ['$scope', '$state', '$stateParams', function ($scope, $state, $stateParams) {
			controllers.prepareTransactionHistoryView($scope, $state, $stateParams);
		}]);
		
		angular_app.controller("EthTransactionViewCtrl",  ['$scope', '$state', '$stateParams', function ($scope, $state, $stateParams) {
			controllers.prepareEthTransactionView($scope, $state, $stateParams);
		}]);
		
		
		//
		// Controllers for forms
		//
		
		angular_app.controller("LoginFormCtrl", ['$scope', function ($scope) {
			controllers.prepareLoginForm($scope);
		}]);
		
		angular_app.controller("LogoutFormCtrl", ['$scope', function ($scope) {
			controllers.prepareLogoutForm($scope);
		}]);
		
		
		angular_app.controller("ethAccountFormCtrl", ['$scope', function ($scope) {
			controllers.prepareEthAccountForm($scope);
		}]);
		
		angular_app.controller("ethAccountModifyFormCtrl", ['$scope', '$state', '$stateParams', function ($scope, $state, $stateParams) {
			controllers.prepareEthAccountModifyForm($scope, $state, $stateParams);
		}]);
		
		angular_app.controller("EtherTransferFormCtrl", ['$scope', function ($scope) {
			controllers.prepareEtherTransferForm($scope);
		}]);
		

		//
		// Handlers for requests (clicks, forms,..)
		//
		
		// pages
		angular_app.controller("PageRequestHandler", ['$rootScope','$scope','$location', function ($rootScope, $scope, $location) {
			controllers.handlePageRequest($rootScope, $scope, $location);
		}]);
		
		
		//
		// Getters for directives
		//
		
		angular_app.directive('loginLink', function () {
			return controllers.getLoginLink();
		});
		
		angular_app.directive('datetime', function () {
			return controllers.getDateTime();
		});
		
		// 
		// filters
		//
		angular_app.filter('transl', function() {
			return controllers.translate;
		});
		
		
		//
		// Registering controllers for DAPPs
		//
		for (var i = 0; i < (dappscontrollers ? dappscontrollers.length : 0); i++) {
			dappscontrollers[i].registerControllers(app);
		}
		
		
		//
		// registering states
		//
		
		this.registerStates();
	}
	
	registerStates() {
		var global = this.global;
		var app = this.app;
		
		var angular_app = app.getAngularApp();
		
		var dappscontrollers = this.dappscontrollers;
		
		var statearray = this.getStates();
		
		// get states of dapps controllers
		for (var i = 0; i < (dappscontrollers ? dappscontrollers.length : 0); i++) {
			if (dappscontrollers[i].getStates)
				var controllerstates = dappscontrollers[i].getStates();
			
				if (controllerstates)
				statearray = statearray.concat(controllerstates);
		}
		
		// invoke hook if a module wants to modify states before registration
		var result = [];
		
		var params = [];
		
		params.push(statearray);

		var ret = global.invokeHooks('alterAngularStates_hook', result, params);
		
		if (ret && result && result.length) {
			console.log('alterAngularStates_hook overload handled by a module');			
		}
		
		angular_app.config(['$stateProvider', function ($stateProvider) {
			for (var i = 0; i < statearray.length; i++) {
				var state = statearray[i];
				$stateProvider.state(...state);
			}
			/*controllers.registerStates($stateProvider);
			
			for (var i = 0; i < (dappscontrollers ? dappscontrollers.length : 0); i++) {
				if (dappscontrollers[i].registerStates)
					statearray = dappscontrollers[i].registerStates($stateProvider);
			}*/
		}]);
	}
	
	/*registerStates($stateProvider) {
		var global = this.global;
		var app = this.app;
		
		$stateProvider
	    .state('root', { url: '/', views: {'main@': {templateUrl: app.getHtmlUrl('./angular-ui/templates/home.html'), controller: "PageRequestHandler", } },
	          ncyBreadcrumb: { label: global.t('Home page') } })
	    .state('home', { url: '/home', views: {'main@': {templateUrl: app.getHtmlUrl('./angular-ui/templates/home.html'), controller: "PageRequestHandler", } },
	          ncyBreadcrumb: { label: global.t('Home page') } })
	    .state('home.about', {url: '/about', views: {'main@': {templateUrl: app.getHtmlUrl('./angular-ui/templates/about.html'), controller: "PageRequestHandler",}},
	        ncyBreadcrumb: { label: global.t('About') }})
	    .state('home.account', {url: '/account', views: {'main@': {templateUrl: app.getHtmlUrl('./angular-ui/templates/account.html'), controller: "PageRequestHandler",}},
	        ncyBreadcrumb: { label: global.t('Account') }})
	    .state('home.account.eth-accounts', {url: '/account/eth-accounts', views: {'main@': {templateUrl: app.getHtmlUrl('./angular-ui/templates/eth-accounts.html'), controller: "PageRequestHandler",}},
	        ncyBreadcrumb: { label: global.t('Ethereum Accounts') }})
	    .state('home.account.eth-accounts.view', {url: '/account/eth-accounts/view/:uuid', views: {'main@': {templateUrl: app.getHtmlUrl('./angular-ui/templates/eth-account.html'), controller: "PageRequestHandler",}},
	        ncyBreadcrumb: { label: global.t('View') }})
	    .state('home.account.cryptokeys', {url: '/account/cryptokeys', views: {'main@': {templateUrl: app.getHtmlUrl('./angular-ui/templates/cryptokeys.html'), controller: "PageRequestHandler",}},
	        ncyBreadcrumb: { label: global.t('Crypto Keys') }})
	    .state('home.account.transfer', {url: '/account/transfer', views: {'main@': {templateUrl: app.getHtmlUrl('./angular-ui/templates/ether-transfer.html'), controller: "PageRequestHandler",}},
	        ncyBreadcrumb: { label: global.t('Transfer') }})
	    .state('home.account.transaction-history', {url: '/account/txhistory', views: {'main@': {templateUrl: app.getHtmlUrl('./angular-ui/templates/transaction-history.html'), controller: "PageRequestHandler",}},
	        ncyBreadcrumb: { label: global.t('Tx History') }})
	    .state('home.account.transaction-history.tx', {url: '/tx/:uuid', views: {'main@': {templateUrl: app.getHtmlUrl('./angular-ui/templates/transaction-view.html'), controller: "PageRequestHandler",}},
	        ncyBreadcrumb: { label: global.t('Tx') }})
	    .state('home.login', {url: '/login', views: {'main@': {templateUrl: app.getHtmlUrl('./angular-ui/templates/login.html'), controller: "PageRequestHandler",}},
	        ncyBreadcrumb: { label: global.t('Login') }})
	    .state('home.logout', {url: '/logout', views: {'main@': {templateUrl: app.getHtmlUrl('./angular-ui/templates/logout.html'), controller: "PageRequestHandler",}},
	        ncyBreadcrumb: { label: global.t('Logout') }})
		
	}*/
	
	getStates() {
		var statearray = [];
		
		var global = this.global;
		var app = this.app;

		statearray
	    .push(['root', { url: '/', views: {'main@': {templateUrl: app.getHtmlUrl('./angular-ui/templates/home.html'), controller: "PageRequestHandler", } },
	          ncyBreadcrumb: { label: global.t('Home page') } }]);
		statearray
	    .push(['home', { url: '/home', views: {'main@': {templateUrl: app.getHtmlUrl('./angular-ui/templates/home.html'), controller: "PageRequestHandler", } },
	          ncyBreadcrumb: { label: global.t('Home page') } }]);
  		statearray
	    .push(['home.about', {url: '/about', views: {'main@': {templateUrl: app.getHtmlUrl('./angular-ui/templates/about.html'), controller: "PageRequestHandler",}},
	        ncyBreadcrumb: { label: global.t('About') }}]);
	  	statearray
	    .push(['home.account', {url: '/account', views: {'main@': {templateUrl: app.getHtmlUrl('./angular-ui/templates/account.html'), controller: "PageRequestHandler",}},
	        ncyBreadcrumb: { label: global.t('Account') }}]);
	  	statearray
	    .push(['home.account.eth-accounts', {url: '/account/eth-accounts', views: {'main@': {templateUrl: app.getHtmlUrl('./angular-ui/templates/eth-accounts.html'), controller: "PageRequestHandler",}},
	        ncyBreadcrumb: { label: global.t('Ethereum Accounts') }}]);
	  	statearray
	    .push(['home.account.eth-accounts.view', {url: '/account/eth-accounts/view/:uuid', views: {'main@': {templateUrl: app.getHtmlUrl('./angular-ui/templates/eth-account.html'), controller: "PageRequestHandler",}},
	        ncyBreadcrumb: { label: global.t('View') }}]);
	  	statearray
	    .push(['home.account.cryptokeys', {url: '/account/cryptokeys', views: {'main@': {templateUrl: app.getHtmlUrl('./angular-ui/templates/cryptokeys.html'), controller: "PageRequestHandler",}},
	        ncyBreadcrumb: { label: global.t('Crypto Keys') }}]);
	  	statearray
	    .push(['home.account.transfer', {url: '/account/transfer', views: {'main@': {templateUrl: app.getHtmlUrl('./angular-ui/templates/ether-transfer.html'), controller: "PageRequestHandler",}},
	        ncyBreadcrumb: { label: global.t('Transfer') }}]);
	  	statearray
	    .push(['home.account.transaction-history', {url: '/account/txhistory', views: {'main@': {templateUrl: app.getHtmlUrl('./angular-ui/templates/transaction-history.html'), controller: "PageRequestHandler",}},
	        ncyBreadcrumb: { label: global.t('Tx History') }}]);
	  	statearray
	    .push(['home.account.transaction-history.tx', {url: '/tx/:uuid', views: {'main@': {templateUrl: app.getHtmlUrl('./angular-ui/templates/transaction-view.html'), controller: "PageRequestHandler",}},
	        ncyBreadcrumb: { label: global.t('Tx') }}]);
	  	statearray
	    .push(['home.login', {url: '/login', views: {'main@': {templateUrl: app.getHtmlUrl('./angular-ui/templates/login.html'), controller: "PageRequestHandler",}},
	        ncyBreadcrumb: { label: global.t('Login') }}]);
	  	statearray
	    .push(['home.logout', {url: '/logout', views: {'main@': {templateUrl: app.getHtmlUrl('./angular-ui/templates/logout.html'), controller: "PageRequestHandler",}},
	        ncyBreadcrumb: { label: global.t('Logout') }}]);

	     return  statearray; 
	}
	
	
	//
	// Commands
	//
	
	// for any type of controller (angular or other)
	translate(string) {
		// 'this' is not defined
		var global = GlobalClass.getGlobalObject();
		
		return global.t(string);
	}
	
	dapp_url(path) {
		var app = this.app;
		
		return app.getHtmlUrl(path);
	}
	
	gotoHome() {
		this.gotoStatePage('home');
	}
	
	gotoLoginPage() {
		this.gotoStatePage('home.login');
	}
	
	refreshPage() {
		this.getAppObject().refreshDisplay();
	}
	
	// specific to angular
	gotoStatePage(pagestate, params) {
		console.log("Controllers.gotoStatePage called for: " + pagestate);

		var global = this.global;
		var app = this.getAppObject();
		var angular_app = app.getAngularApp();
		
		var gonow = function () {
			var $injector = app.getAngularInjector();
			
			if ($injector) {
				var $state = $injector.get('$state');
				
				if ($state.current.name != pagestate) {
					console.log("current state is " + $state.current.name);
					console.log("jumping to " + pagestate);
					
					$state.go(pagestate, params);
				}
			}
		};
		
		gonow();
	}
	
	//
	// Requests
	//
	
	handlePageRequest($rootScope, $scope, $location) {
		console.log("Controllers.handlePageRequest called with location: " + JSON.stringify($location));
		  
		$scope.message = "your location is " + $location.hash();
		  
		var global = this.global;
		var session = global.getModuleObject('common').getSessionObject();
		console.log('is anonymous: ' + (session.isAnonymous() ? 'true' : 'false'));
		
		$rootScope.global = global; // to give access to global object from anywhere in the view
		
		var controllers = this;
		$rootScope.utils = {};
		$rootScope.utils.dapp_url = function(path) {return controllers.dapp_url(path);};
		
		$rootScope.session = {};
		$rootScope.session.isanonymous = session.isAnonymous();
		$rootScope.session.sessionuuid = session.getSessionUUID();
		
		$rootScope.useridentifier = (session.isAnonymous() ? global.t('Anonymous' ): session.getSessionUserIdentifier());
		
		var now = new Date(); // get the current time
        $rootScope.globaldate = now.toISOString();
        
        // DAPPs
        var dappscontrollers = this.dappscontrollers;
		for (var i = 0; i < (dappscontrollers ? dappscontrollers.length : 0); i++) {
			if (dappscontrollers[i].handlePageRequest)
			dappscontrollers[i].handlePageRequest($rootScope, $scope, $location);
		}
	}
	
	//
	// Views
	//
	
	_apply($scope) {
		setTimeout(function() {
		    $scope.$apply();
		  }, 100);
	}
	
	// templates elements
	
	prepareHomeLink($scope) {
		console.log("Controllers.prepareHomeLinkView called");
		
		/*var d = new Date();
		var homeLink = document.getElementById("home-link");

		var href = homeLink.getAttribute("href")
		homeLink.setAttribute("href",href + "?t="+d.getTime());*/
		
	}
	
	prepareLoginView($rootScope, $scope, $sce, $timeout) {
		console.log("Controllers.prepareloginView called with $sce: " + JSON.stringify($sce));
		
		var global = this.global;
		var views = global.getModuleObject('mvc').getViewsObject();
		
		// test login link content
		var content = views.getLoginWidget();

		$scope.content = $sce.trustAsHtml(content);	
		
		// test on timestamp
 		var now = new Date(); // get the current time
        var nowtime = now.getTime();
    	$scope.clock = nowtime;
        $scope.date = now.toISOString();
        $rootScope.globaldate = now.toISOString();
        $rootScope.globaldate2 = now.toISOString();
        
        console.log('$scope.$id is ' + $scope.$id);
        console.log('$scope.date is ' + $scope.date);
        // end test
	}
	
	preparMenuBarView($scope) {
		console.log("Controllers.preparMenuBarView called");
		
		var global = this.global;
		
		var menuitems = [];
		
		$scope.menuitems = menuitems;
		
		var result = [];
		
		var params = [];
		
		params.push($scope);
		params.push(menuitems);

		var ret = global.invokeHooks('alterMenuBar_hook', result, params);
		
		if (ret && result && result.length) {
			console.log('menubar overload handled by a module');			
		}
	}

	// partials
	
	prepareHomeView($scope) {
		console.log("Controllers.prepareHomeView called");
		
		var global = this.global;
		var message = global.t("Hello, AngularJS");
		
		$scope.message = message;	
	}
	
	prepareNodeInfoView($scope) {
		console.log("Controllers.prepareNodeInfoView called");
		
		var global = this.global;
		var commonmodule = global.getModuleObject('common');
		
		var session = commonmodule.getSessionObject();
		var ethereumnodeaccess = session.getEthereumNodeAccessInstance();
		
		var nodeinfo = [];
		
		nodeinfo.islistening = global.t('loading');
		nodeinfo.networkid = global.t('loading');
		nodeinfo.peercount = global.t('loading');
		nodeinfo.issyncing = global.t('loading');
		nodeinfo.currentblock = global.t('loading');
		nodeinfo.highestblock = global.t('loading');
		
		var writenodeinfo = function(nodeinfo) {
			/*ethereumnodeaccess.web3_isListening(function(err, res) {
				nodeinfo.islistening = res;
				
				// tell scope a value has changed
				$scope.$apply();
			});
			
			ethereumnodeaccess.web3_getNetworkId(function(err, res) {
				nodeinfo.networkid = res;
				
				// tell scope a value has changed
				$scope.$apply();
			});
			
			ethereumnodeaccess.web3_getPeerCount(function(err, res) {
				nodeinfo.peercount = res;
				
				// tell scope a value has changed
				$scope.$apply();
			});
			
			ethereumnodeaccess.web3_isSyncing(function(err, res) {
				if (res !== false)
					nodeinfo.issyncing = true;
				else
					nodeinfo.issyncing = false;
				
				// tell scope a value has changed
				$scope.$apply();
			});*/
			
			ethereumnodeaccess.web3_getNodeInfo(function(err, info) {
				console.log('returning from web3_getNodeInfo');
				
				if (info) {
					nodeinfo.islistening = info.islistening;
					nodeinfo.networkid = info.networkid;
					nodeinfo.peercount = info.peercount;
					nodeinfo.issyncing = info.issyncing;
					nodeinfo.currentblock = info.currentblock;
					nodeinfo.highestblock = info.highestblock;
				}
				else {
					nodeinfo.islistening = global.t('not available');
					nodeinfo.networkid = global.t('not available');
					nodeinfo.peercount = global.t('not available');
					nodeinfo.issyncing = global.t('not available');
					nodeinfo.currentblock = global.t('not available');
					nodeinfo.highestblock = global.t('not available');
				}

				
				// tell scope a value has changed
				$scope.$apply();
			});
		};
		
		writenodeinfo(nodeinfo);
		
		
		$scope.nodeinfo = nodeinfo;
		
	}
	
	prepareAccountView($scope) {
		console.log("Controllers.prepareAccountView called");
		
		var global = this.global;
		var commonmodule = global.getModuleObject('common');
		
		var session = commonmodule.getSessionObject();
		
		if (!session.isAnonymous()) {
			var user = session.getSessionUserObject();
			
			$scope.username = user.getUserName();
			
			$scope.useremail = user.getUserEmail();
			
			$scope.useruuid = user.getUserUUID();
		}
		
	}
	
	prepareCryptoKeysView($scope, $state, $stateParams) {
		console.log("Controllers.prepareCryptoKeysView called");
		
		var global = this.global;
		var self = this;
		
		var commonmodule = global.getModuleObject('common');
		var session = commonmodule.getSessionObject();
		
		
		var cryptokeys = [];
		
		var cryptokeyarray = session.getSessionCryptoKeyObjects(true, function(err, keyarray) {
			if (keyarray) {
				// empty array
				while(cryptokeys.length > 0) { cryptokeys.pop();}
				
				for (var i = 0; i < keyarray.length; i++) {
					var cryptokeyobj = keyarray[i];
					
					if (cryptokeyobj) {
						var cryptokey = [];
						
						cryptokey['uuid'] = cryptokeyobj.getKeyUUID();

						cryptokey['description'] = cryptokeyobj.getDescription();
						cryptokey['address'] = cryptokeyobj.getAddress();
						cryptokey['public_key'] = cryptokeyobj.getPublicKey();
						
						cryptokeys.push(cryptokey);
					}
				}
			}
			
			// putting $apply in a deferred call to avoid determining if callback is called
			// from a promise or direct continuation of the code
			self._apply($scope);
		});
		
		if (cryptokeyarray) {
			for (var i = 0; i < cryptokeyarray.length; i++) {
				var cryptokeyobj = cryptokeyarray[i];
				
				if (cryptokeyobj) {
					var cryptokey = [];
					
					cryptokey['uuid'] = cryptokeyobj.getKeyUUID();

					cryptokey['description'] = cryptokeyobj.getDescription();
					cryptokey['address'] = cryptokeyobj.getAddress();
					cryptokey['public_key'] = cryptokeyobj.getPublicKey();
					
					cryptokeys.push(cryptokey);
				}
			}
		}
		
		$scope.cryptokeys = cryptokeys;
	}
	
	prepareEthAccountsView($scope, $state, $stateParams) {
		console.log("Controllers.prepareEthAccountsView called");
		
		var global = this.global;
		var self = this;

		var commonmodule = global.getModuleObject('common');
		var commoncontrollers = commonmodule.getControllersObject();

		var session = commonmodule.getSessionObject();
		
		
		var ethaccounts = [];
		
		$scope.ethaccounts = ethaccounts;
		
		// get list of all accounts (third party and personal)
		session.getAccountObjects(true, function(err, accntarray) {
			// empty array
			while(ethaccounts.length > 0) { ethaccounts.pop();}

			if (accntarray) {
				for (var i = 0; i < accntarray.length; i++) {
					var account = accntarray[i];
					
					if (account) {
						var ethaccount = [];
						
						ethaccount['uuid'] = account.getAccountUUID();

						ethaccount['description'] = (account.getDescription() !== null ? account.getDescription() : account.getAddress());
						ethaccount['type'] = (account.getPrivateKey() !== null ? global.t('personal') : global.t('3rd party'));
						ethaccount['address'] = account.getAddress();
						ethaccount['public_key'] = account.getPublicKey();
						ethaccount['rsa_public_key'] = account.getRsaPublicKey();

						ethaccount['balance'] = global.t('loading');
						
						// write ether balance for this account
						var writebalance = function(ethaccount, account) {
							account.getChainBalance(function(err, res) {
								if (err) {
									ethaccount['balance'] = global.t('error');
								}
								else {
									var etherbalance = commoncontrollers.getEtherStringFromWei(res);
									ethaccount['balance'] = etherbalance + ' ETH';
								}
								
								// tell scope a value has changed
								$scope.$apply();
							});
						};
						
						writebalance(ethaccount, account);

						ethaccounts.push(ethaccount);
					}
				}
			}
			
			
			// putting $apply in a deferred call to avoid determining if callback is called
			// from a promise or direct continuation of the code
			self._apply($scope);
		});
		
	}
	
	prepareEthAccountView($scope, $state, $stateParams) {
		console.log("Controllers.prepareEthAccountView called");
		
	    var accountuuid = $stateParams.uuid;

		var global = this.global;
		var self = this;
		var app = this.getAppObject();
		
		var commonmodule = global.getModuleObject('common');
		var commoncontrollers = commonmodule.getControllersObject();
		
		var session = commonmodule.getSessionObject();

		var account = commoncontrollers.getAccountObjectFromUUID(session, accountuuid);

		var ethaccount = [];
		
		if (account) {
			ethaccount['uuid'] = account.getAccountUUID();

			ethaccount['description'] = (account.getDescription() !== null ? account.getDescription() : account.getAddress());
			ethaccount['type'] = (account.getPrivateKey() !== null ? global.t('personal') : global.t('3rd party'));
			ethaccount['address'] = account.getAddress();
			ethaccount['public_key'] = account.getPublicKey();
			ethaccount['rsa_public_key'] = account.getRsaPublicKey();
			
		}
		
		$scope.ethaccount = ethaccount;
	}
	
	
	prepareTransactionHistoryView($scope, $state, $stateParams) {
		console.log("Controllers.prepareEthAccountsView called");
		
		var global = this.global;
		var self = this;
		
		var commonmodule = global.getModuleObject('common');
		var session = commonmodule.getSessionObject();
		
		var views = global.getModuleObject('mvc').getViewsObject();

		var transactions = [];
		
		commonmodule.getTransactionList(function(err, transactionarray) {
			
			if (transactionarray) {
				
				for (var i = 0; i < transactionarray.length; i++) {
					var tx = transactionarray[i];
					var transaction = [];
					
					transaction.uuid = tx.getTransactionUUID();
					
					transaction.unixdate = new Date(tx.getCreationDate()).getTime() / 1000;
					transaction.date = global.formatDate(new Date(tx.getCreationDate()), 'YYYY-mm-dd HH:MM:SS');
					transaction.transactionuuid = tx.getTransactionUUID();
					transaction.transactionhash = tx.getTransactionHash();
					transaction.from = tx.getFrom();
					transaction.to = tx.getTo();
					transaction.ethervalue = parseFloat(tx.getValue());
					transaction.value = ( transaction.ethervalue ? transaction.ethervalue.toFixed(2) + ' Ether' : '');
					transaction.status = views.getTransactionStatusString(tx);
					
					transactions.push(transaction);
				}
				
				// sort descending order
				transactions.sort(function(a,b) {return (b.unixdate - a.unixdate);});
				
				// putting $apply in a deferred call to avoid determining if callback is called
				// from a promise or direct continuation of the code
				self._apply($scope);
			}
			
			return transactionarray;
			
		});

		$scope.transactions = transactions;
	}
	
	prepareEthTransactionView($scope, $state, $stateParams) {
		console.log("Controllers.prepareEthTransactionView called");
		
	    var transactionuuid = $stateParams.uuid;

		var global = this.global;
		var self = this;
		var app = this.getAppObject();
		
		var commonmodule = global.getModuleObject('common');
		var commoncontrollers = commonmodule.getControllersObject();
		
		var session = commonmodule.getSessionObject();

		var views = global.getModuleObject('mvc').getViewsObject();

		var transaction = [];
		
		$scope.transaction = transaction;
		
		transaction.uuid = global.t('loading...');
		
		transaction.date = global.t('loading...');
		transaction.from = global.t('loading...');
		transaction.to = global.t('loading...');
		transaction.value = global.t('loading...');
		transaction.status = global.t('loading...');

		transaction.transactionhash = global.t('loading...');
		
		transaction.gaslimit = global.t('loading...');
		transaction.gasprice = global.t('loading...');

		transaction.blocknumber = global.t('loading...');
		transaction.gasused = global.t('loading...');
		transaction.cost = global.t('loading...');
		transaction.chainstatus = global.t('loading...');

		
		commoncontrollers.getTransactionObjectFromUUID(session, transactionuuid, function (err, tx) {
			if (tx) {
				transaction.uuid = tx.getTransactionUUID();
				
				transaction.unixdate = new Date(tx.getCreationDate()).getTime() / 1000;
				transaction.date = global.formatDate(new Date(tx.getCreationDate()), 'YYYY-mm-dd HH:MM:SS');
				transaction.from = tx.getFrom();
				transaction.to = tx.getTo();
				transaction.ethervalue = parseFloat(tx.getValue());
				transaction.value = ( transaction.ethervalue ? transaction.ethervalue.toFixed(2) + ' Ether' : '');
				transaction.status = views.getTransactionStatusString(tx);
				
				transaction.transactionhash = tx.getTransactionHash();
				
				tx.getEthTransaction(function(err, ethtx) {
					
					if (ethtx) {
						transaction.gaslimit = ethtx.gas;
						transaction.gasprice = commoncontrollers.getEtherStringFromWei(ethtx.gasPrice, 8) + ' Ether';

						tx.getEthTransactionReceipt(function(err, ethtxreceipt) {
							
							if (ethtxreceipt) {
								transaction.blocknumber = ethtxreceipt.blockNumber;
								transaction.gasused = ethtxreceipt.gasUsed;
								transaction.cost = commoncontrollers.getEtherStringFromWei(ethtx.gasPrice * ethtxreceipt.gasUsed, 8) + ' Ether';
								transaction.chainstatus = (ethtxreceipt.status ? global.t('success') : global.t('fail'));
							}
							else {
								transaction.blocknumber = global.t('no receipt on chain');
								transaction.gasused = global.t('no receipt on chain');
								transaction.cost = global.t('no receipt on chain');
								transaction.chainstatus = global.t('no receipt on chain');
							}
							
							$scope.$apply();
						});
						
					}
					else {
						transaction.gaslimit = global.t('no transaction on chain');
						transaction.gasprice = global.t('no transaction on chain');

						transaction.blocknumber = global.t('no transaction on chain');
						transaction.gasused = global.t('no transaction on chain');
						transaction.cost = global.t('no transaction on chain');
						transaction.chainstatus = global.t('no transaction on chain');
					}
					
					$scope.$apply();
				});

				
			}
			else {
				transaction.uuid = global.t('not found');
				transaction.transactionhash = global.t('not found');
				
				transaction.date = global.t('not found');
				transaction.from = global.t('not found');
				transaction.to = global.t('not found');
				transaction.value = global.t('not found');
				transaction.status = global.t('not found');
				
				transaction.gaslimit = global.t('not found');
				transaction.gasprice = global.t('not found');

				transaction.blocknumber = global.t('not found');
				transaction.gasused = global.t('not found');
				transaction.cost = global.t('not found');
				transaction.chainstatus = global.t('not found');
			}
			
			$scope.$apply();
		});
		
		
	}
	
	
	//
	// Forms
	//
	
	// login
	prepareLoginForm($scope) {
		console.log("Controllers.prepareLoginForm called");

		var global = this.global;
		var self = this;
		
		var loginform = document.getElementById("loginForm");
		
		angular.element(document).ready(function () {
			var result = [];
			
			var params = [];
			
			params.push($scope);
			params.push(loginform);

			var ret = global.invokeHooks('alterLoginForm_hook', result, params);
			
			if (ret && result && result.length) {
				console.log('loginform overload handled by a module');			
			}
	    });
		
		
		// submit function
		$scope.handleSubmit = function(){
			self.handleLoginSubmit($scope);
		}
	}
	
	handleLoginSubmit($scope) {
		console.log("Controllers.handleLoginSubmit called");
		
		var global = this.global;
		var app = this.getAppObject();
		var session = global.getModuleObject('common').getSessionObject();
		

		var result = [];
		
		var params = [];
		
		params.push($scope);

		var ret = global.invokeHooks('handleLoginSubmit_hook', result, params);
		
		if (ret && result && result.length) {
			console.log('handleLoginSubmit overloaded by a module');			
		}
		else {
			var privatekey = $scope.privatekey.text;
			
			this._impersonatePrivateKey(privatekey);
			
			var storagemodule = global.getModuleObject('storage-access');
			var storageaccess = storagemodule.getStorageAccessInstance(session);
			
			storageaccess.account_session_keys( function(err, res) {
				
				if (res && res['keys']) {
					var keys = res['keys'];
					
					session.readSessionAccountFromKeys(keys);
				}
		
				app.refreshDisplay();
			});
			}

		this.gotoHome();

	}
	
	// logout
	prepareLogoutForm($scope) {
		console.log("Controllers.prepareLogoutForm called");

		var global = this.global;
		var self = this;
		
		var logoutform = document.getElementById("logoutForm");
		
		angular.element(document).ready(function () {
			var result = [];
			
			var params = [];
			
			params.push($scope);
			params.push(logoutform);

			var ret = global.invokeHooks('alterLogoutForm_hook', result, params);
			
			if (ret && result && result.length) {
				console.log('logoutform overload handled by a module');			
			}
			
		});
		
		// submit function
		$scope.handleSubmit = function(){
			self.handleLogoutSubmit($scope);
		}
	}
	
	handleLogoutSubmit($scope) {
		console.log("Controllers.handleLogoutSubmit called");
		
		var global = this.global;
		
		// warn of logout
		var result = [];
		
		var params = [];
		
		params.push($scope);

		var ret = global.invokeHooks('handleLogoutSubmit_hook', result, params);
		
		// but log out anyway
		this._logout();
		
		this.gotoHome();
	}
	
	_logout() {
		var global = this.global;
		var app = this.getAppObject();
		var session = global.getModuleObject('common').getSessionObject();
		
		session.disconnectUser();
		
		app.refreshDisplay();
		
	}

	//
	// ethereum accounts
	//
	
	// add/import
	prepareEthAccountForm($scope) {
		console.log("Controllers.prepareEthAccountForm called");

		var global = this.global;
		var self = this;
		
		
		// submit function
		$scope.handleSubmit = function(){
			self.handleEthAccountSubmit($scope);
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
		
		$scope.privatekey = {text: privkey};
	}
	
	handleEthAccountSubmit($scope) {
		console.log("Controllers.handleEthAccountSubmit called");
		
		var global = this.global;
		var app = this.getAppObject();
		
		var commonmodule = global.getModuleObject('common');
		var session = commonmodule.getSessionObject();
		var sessionuser = session.getSessionUserObject();
		
		
		var sessionaccount = global.getModuleObject('common').createBlankAccountObject();
		
		
		var description = $scope.description.text;
		
		if ($scope.privatekey && $scope.privatekey.text && ($scope.privatekey.text.length > 0)) {
			var privatekey = $scope.privatekey.text;
			
			sessionaccount.setPrivateKey(privatekey);
			sessionaccount.setDescription(description);
			
			if (sessionuser) {
				sessionaccount.setOwner(sessionuser);
			}
			
			session.addAccountObject(sessionaccount);
		}
		else if ($scope.address && $scope.address.text && ($scope.address.text.length > 0)) {
			var address = $scope.address.text;
			
			sessionaccount.setAddress(address);
			sessionaccount.setDescription(description);
			
			session.addAccountObject(sessionaccount);
		}
		
		// we save this account
		var storagemodule = global.getModuleObject('storage-access');
		var storageaccess = storagemodule.getStorageAccessInstance(session);
		
		storageaccess.user_add_account(sessionuser, sessionaccount, function() {
			app.refreshDisplay();
		});

        app.refreshDisplay();
	}
	
	// modify
	prepareEthAccountModifyForm($scope, $state, $stateParams) {
		console.log("Controllers.prepareEthAccountModifyForm called");
		
	    var accountuuid = $stateParams.uuid;


		var global = this.global;
		var self = this;
		var app = this.getAppObject();
		
		var commonmodule = global.getModuleObject('common');
		var commoncontrollers = commonmodule.getControllersObject();
		
		var session = commonmodule.getSessionObject();

		var accountobject = commoncontrollers.getAccountObjectFromUUID(session, accountuuid);

		
		// filling fields
		$scope.accountuuid = accountuuid;

		$scope.description = {
				text: (accountobject ? accountobject.getDescription() : null)
		};
		
		
		// calling hooks
		var form = document.getElementById("modifyEthAccountForm");
		
		angular.element(document).ready(function () {
			var result = [];
			
			var params = [];
			
			params.push($scope);
			params.push(form);

			var ret = global.invokeHooks('alterModifyEthAccountForm_hook', result, params);
			
			if (ret && result && result.length) {
				console.log('modifyEthAccountForm overload handled by a module');			
			}
	    });
		
		// submit function
		$scope.handleSubmit = function(){
			self.handleEthAccountModifySubmit($scope);
		}
	}
	
	handleEthAccountModifySubmit($scope) {
		console.log("Controllers.handleEthAccountModifySubmit called");
		
		
		var accountuuid = $scope.accountuuid;
		var description = $scope.description.text;

		
		var global = this.global;
		var app = this.getAppObject();
		
		var commonmodule = global.getModuleObject('common');
		var commoncontrollers = commonmodule.getControllersObject();

		var session = commonmodule.getSessionObject();
		var sessionuser = session.getSessionUserObject();
		
		// call hooks
		var result = [];
		
		var params = [];
		
		params.push($scope);

		var ret = global.invokeHooks('handleEthAccountModifySubmit_hook', result, params);
		
		if (ret && result && result.length) {
			console.log('handleEthAccountModifySubmit_hook overloaded by a module');			
		}
		else {
			var accountobject = commoncontrollers.getAccountObjectFromUUID(session, accountuuid);
			
			if (accountobject) {
				accountobject.setDescription(description);
				
				// we save this account
				var storagemodule = global.getModuleObject('storage-access');
				var storageaccess = storagemodule.getStorageAccessInstance(session);
				
				storageaccess.user_update_account(sessionuser, accountobject, function() {
					app.refreshDisplay();
				});
			}
			
		}
		

        app.refreshDisplay();
	}
	


	// ether tranfer
	handleFromAccountSelectChange($scope) {
		var accountuuid = $scope.selectedfrom;
		
		var global = this.global;
		
		var commonmodule = global.getModuleObject('common');
		var commoncontrollers = commonmodule.getControllersObject();

		var session = commonmodule.getSessionObject();
		
		var fromaccount = commoncontrollers.getSessionAccountObjectFromUUID(session, accountuuid)

		if (fromaccount) {
			$scope.from = { text: fromaccount.getAddress()};
			
			$scope.walletused = { text: fromaccount.getAddress()};
			
			// refresh divcue
			var divcue = document.getElementsByClassName('div-form-cue')[0];
			
			var values = commoncontrollers.getAccountTransferDefaultValues(session, fromaccount, divcue);
		}
	}
	
	handleToAccountSelectChange($scope) {
		var accountuuid = $scope.selectedto;
		
		var global = this.global;
		
		var commonmodule = global.getModuleObject('common');
		var commoncontrollers = commonmodule.getControllersObject();

		var session = commonmodule.getSessionObject();
		
		var account = commoncontrollers.getAccountObjectFromUUID(session, accountuuid)

		if (account) {
			$scope.to = { text: account.getAddress()};
		}
	}
	
	_getAccountArrays($scope, session) {
		var self = this;
		
		// all accounts
		var accountarray = session.getAccountObjects();
		
		var accounts = [];
		
		for (var i = 0; i < (accountarray ? accountarray.length : 0); i++) {
			var accnt = accountarray[i];
			
			var address = accnt.getAddress();
			var description = accnt.getDescription();

			var shortaddress = (address ? (description ? address.substring(0,4) + '...' + address.substring(address.length - 4,address.length) : address) : '...');
			
			var account = [];
			
			account['uuid'] = accnt.getAccountUUID();
			account['address'] = accnt.getAddress();
			account['description'] = (description ? shortaddress + ' - ' + description : shortaddress);
			
			accounts.push(account);
		}
			
			
		// change function
		$scope.handleToChange = function(){
			self.handleToAccountSelectChange($scope);
		}

		$scope.toaccounts = accounts;
		
		// session accounts
		var sessionaccountarray = session.getSessionAccountObjects();
		
		var sessionaccounts = [];
		
		for (var i = 0; i < (sessionaccountarray ? sessionaccountarray.length : 0); i++) {
			var accnt = sessionaccountarray[i];
			
			var address = accnt.getAddress();
			var description = accnt.getDescription();
			
			var shortaddress = (address ? (description ? address.substring(0,4) + '...' + address.substring(address.length - 4,address.length) : address) : '...');
			
			var sessionaccount = [];
			
			sessionaccount['uuid'] = accnt.getAccountUUID();
			sessionaccount['address'] = accnt.getAddress();
			sessionaccount['description'] = (description ? shortaddress + ' - ' + description : shortaddress);
			
			sessionaccounts.push(sessionaccount);
		}
			
			
		// change function
		$scope.handleFromChange = function(){
			self.handleFromAccountSelectChange($scope);
		}

		$scope.fromaccounts = sessionaccounts;

	}

	prepareEtherTransferForm($scope) {
		console.log("Controllers.prepareEtherTransferForm called");

		var self = this;

		// call module controller
		var global = this.global;
		
		var commonmodule = global.getModuleObject('common');
		var commoncontrollers = commonmodule.getControllersObject();

		var session = commonmodule.getSessionObject();
		
		// fill account list
		this._getAccountArrays($scope, session);
		
		// display default transfer values (gaslimit, gasprice, default account,;;°
		var fromaccount;
		var divcue = document.getElementsByClassName('div-form-cue')[0];
		
		if ($scope.walletused && $scope.walletused.text) {
			// already set or modified via a select change
			fromaccount = session.getSessionAccountObject($scope.walletused.text);
		}
		
		if (fromaccount) {
			var values = commoncontrollers.getAccountTransferDefaultValues(session, fromaccount, divcue);
		}
		else {
			var values = commoncontrollers.getSessionTransferDefaultValues(session, divcue);
		}
		
		// filling fields
		
		$scope.walletused = {
				text: (values['walletused'] ? values['walletused'] : null)
		};
		
		$scope.password = {
				text: null
		};
		
		$scope.gaslimit = {
				text: (values['gaslimit'] ? values['gaslimit'] : null)
		};
		
		$scope.gasprice = {
				text: (values['gasprice'] ? values['gasprice'] : null)
		};

		// calling hooks
		var ethertransferform = document.getElementById("etherTransferForm");
		
		angular.element(document).ready(function () {
			var result = [];
			
			var params = [];
			
			params.push($scope);
			params.push(ethertransferform);

			var ret = global.invokeHooks('alterEtherTransferForm_hook', result, params);
			
			if (ret && result && result.length) {
				console.log('etherTransferForm overload handled by a module');			
			}
	    });
		
		// submit function
		$scope.handleSubmit = function(){
			self.handleEtherTransferSubmit($scope);
		}
	}
	
	handleEtherTransferSubmit($scope) {
		console.log("Controllers.handleEtherTransferSubmit called");
		
		var global = this.global;
		var app = this.getAppObject();
		var commonmodule = global.getModuleObject('common');
		var session = commonmodule.getSessionObject();

		// call hooks
		var result = [];
		
		var params = [];
		
		params.push($scope);

		var ret = global.invokeHooks('handleEtherTransferSubmit_hook', result, params);
		
		if (ret && result && result.length) {
			console.log('handleEtherTransferSubmit overloaded by a module');			
		}
		else {
			var fromaddress = $scope.walletused.text;
			var toaddress = $scope.to.text;
			
			var amount = $scope.amount.text;
			
			var password = $scope.password.text;
			
			var gaslimit = $scope.gaslimit.text;
			var gasPrice = $scope.gasprice.text;
			
			
			var commonmodule = global.getModuleObject('common');
			var session = commonmodule.getSessionObject();
			
			var payingaccount = session.getAccountObject(fromaddress);
			
			// unlock account
			payingaccount.unlock(password, 300); // 300s, but we can relock the account
			
			try {
				var toaccount = session.getAccountObject(toaddress);
				var transactionuuid = session.guid();

				payingaccount.transferAmount(toaccount, amount, gaslimit, gasPrice,  transactionuuid, function (err, res) {
					
					if (!err) {
						console.log('transfer registered at ' + res);
						
						app.setMessage("transfer has been registered at " + res);
					}
					else  {
						console.log('error transfering ethers ' + err);
					}
						
				});
				
				app.setMessage("ether transfercreated a pending transaction");
				
			}
			catch(e) {
				app.setMessage("Error: " + e);
			}		
		}
	}


	
	//
	// directives
	//
	
	_impersonatePrivateKey(privatekey) {
		var global = this.global;
		var app = this.getAppObject();
		
		var session = global.getModuleObject('common').getSessionObject();

		if (privatekey != null) {
			
			// we add this private key as one of the session's account to perform transactions
			var sessionaccount = global.getModuleObject('common').createBlankAccountObject();
			
			sessionaccount.setPrivateKey(privatekey);
			
			var address = sessionaccount.getAddress();
			sessionaccount.setAccountUUID(address);
			
			session.impersonateAccount(sessionaccount);
			
			console.log('is anonymous: ' + (session.isAnonymous() ? 'true' : 'false'));
			
			// we add this privatekey as one of the crypto key to save data
			var sessioncryptokey = global.getModuleObject('common').createBlankCryptoKeyObject();
			
			sessioncryptokey.setPrivateKey(privatekey);
			
			var address = sessioncryptokey.getAddress();
			sessioncryptokey.setKeyUUID(address);
			
			
			session.addCryptoKeyObject(sessioncryptokey);

			

	        app.refreshDisplay();
		}	
		
	}
	
	//
	// utilities
	//
	prepareWalletFormPart(session, $scope, $state, $stateParams) {
		var global = session.getGlobalObject();
		
		var commonmodule = global.getModuleObject('common');
		var commoncontrollers = commonmodule.getControllersObject();

		var divcue = document.getElementsByClassName('div-form-cue')[0];
		
		var values = commoncontrollers.getSessionTransferDefaultValues(session, divcue);
		
		if (!session.isAnonymous()) {
			
			// we remove the password edit box
			var passwordspan = document.getElementById('password-span');
			
			if ( passwordspan ) {
				//passwordspan.parentNode.removeChild(passwordspan);
			}
		}

		$scope.walletused = {
				text: (values['walletused'] ? values['walletused'] : null)
		};
		
		$scope.password = {
				text: null
		};
		
		$scope.gaslimit = {
				text: (values['gaslimit'] ? values['gaslimit'] : null)
		};
		
		$scope.gasprice = {
				text: (values['gasprice'] ? values['gasprice'] : null)
		};

		
	}
	
	showLoginBox(message) {
		console.log("Controllers.showLoginBox called with message: " + JSON.stringify(message));

		var global = this.global;
		//var app = this.getAppObject();
		
		//var session = global.getModuleObject('common').getSessionObject();
		
		var result = []; // description of the form entries
		
		var ret = global.invokeHooks('loginForm_hook', result);
		
		if (ret && result && result.length) {
			// build a form
			var message = 'result length = ' + result.length;
			
			for (var i=0; i < result.length; i++) {
				var field = result[i];
				
				message += ' field '+ i + ' has name ' + field['name'] + ' of type ' + field['name'];
				
			}
			
			alert(message);
		}
		else {
			// standard prompt asking for private key
			var privatekey = prompt(global.t("Please enter your private key. It will be kept in memory until a refresh in your browser."), "");

			this._impersonatePrivateKey(privatekey);
		}

	}
	
	handleShowLoginBox(message) {
		console.log("Controllers.handleShowLoginBox called with message: " + JSON.stringify(message));
		
		var promptbox = false;
		
		var global = this.global;
		var app = this.getAppObject();
		
		var session = global.getModuleObject('common').getSessionObject();

		var sessionuser = session.getSessionUserObject();
		
		if (sessionuser != null) {
			if (promptbox) {
				if (confirm('Do you want to disconnect your account?')) {
					session.disconnectUser();
					
					app.refreshDisplay();
					
				} else {
				    // Do nothing!
				}			
			}
			else {
				this.gotoStatePage('home.logout');
			}
		}
		else {
			if (promptbox) {
				var result = [];
				
				var params = [];
				
				params.push(message);
				
				var ret = global.invokeHooks('handleShowLoginBox_hook', result, params);
				
				if (ret && result && result.length) {
					console.log('login box handled by a module');
				}
				else {
					this.showLoginBox(message);
				}
			}
			else {
				this.gotoStatePage('home.login');
			}

			
		}

	}
	
	getLoginLink(){  
		console.log("Controllers.getLoginLink called");
		
		var global = this.global;
		var views = global.getModuleObject('mvc').getViewsObject();
		

		var loginwidget = views.getLoginWidget();
		
		return {
	        restrict: 'E',
	        template: loginwidget
	    }	
	}
	
	getDateTime(){  
		console.log("Controllers.getDateTime called");
		var d = new Date();
		var time = d.getTime();
		
		console.log('time is now ' + time);
		return {
	        restrict: 'E',
	        template: '<div>' + time + '</div>'
	    }	
	}

}

GlobalClass.registerModuleClass('mvc', 'Controllers', Controllers);


