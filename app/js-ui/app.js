'use strict';

class App {
	//global: null,
	//web3Provider: null,
	//securities: [],
	constructor() {
		this.eventhandlers = [];
		
		this.currentmessage = null;

	}

	init() {
		console.log("Initializing app");
	  
		
		return this.initGlobal();
		
	}
	
	initGlobal() {
		// initializing web3 connection
		console.log("Initializing global object");
		// global objects
		//App.global = window.global;
		var global = this.getGlobalObject(); // do the creation
		
		// overload the global object
		global.app = this;
		global.getAppObject = function() {
			return this.app;
		};
		
		/*********************/
		/* for compatibility */
		/*********************/
		global.getGlobalClass = function() {
			return GlobalClass;
		}
		
		
		var commonmodule = global.getModuleObject('common');
		
		global.getSessionObject = function() {return commonmodule.getSessionObject();};

		global.getContractsObject = function(bForceRefresh) {return commonmodule.getContractsObject(bForceRefresh);};
		global.getAccountObject = function(address) {return commonmodule.getAccountObject(address);};
		global.createBlankAccountObject = function() {return commonmodule.createBlankAccountObject();};
		
		global.getWeb3ProviderUrl = function() {return commonmodule.getWeb3ProviderUrl();};
		global.getDefaultGasLimit = function() {return commonmodule.getDefaultGasLimit();};
		global.getDefaultGasPrice = function() {return commonmodule.getDefaultGasPrice();};
		
		global.useWalletAccount = function() {return commonmodule.useWalletAccount();};
		global.getWalletAccountAddress = function() {return commonmodule.getWalletAccountAddress();};
		global.useWalletAccountChallenge = function() {return commonmodule.useWalletAccountChallenge();};
		global.needToUnlockAccounts = function() {return commonmodule.needToUnlockAccounts();};
		//global.readLocalJson = function() {return commonmodule.readLocalJson();};
		//global.saveLocalJson = function(json) {return commonmodule.saveLocalJson(json);};
		global.saveContractObjects = function(contracts) {return commonmodule.getSessionObject().saveContractObjects(contracts);};
		
		global.areAddressesEqual = function(address1, address2) {return commonmodule.getSessionObject().areAddressesEqual(address1, address2);};
		
		
		var securitiesmodule = global.getModuleObject('securities');
		
		global.createBlankStockHolderObject = function(session, stockledger) {return securitiesmodule.createBlankStockHolderObject(session, stockledger);};
		global.createBlankStockIssuanceObject = function(session, stockledger) {return securitiesmodule.createBlankStockIssuanceObject(session, stockledger);};
		global.createBlankStockTransactionObject = function(session, stockledger) {return securitiesmodule.createBlankStockTransactionObject(session, stockledger);};
		
		global.getStakeholderDisplayName =  function(address, contract) {return securitiesmodule.getControllersObject().getStakeholderDisplayName(address, contract);};
		
		var mvcmodule = global.getModuleObject('mvc');

		global.getControllersObject = function() {return mvcmodule.getControllersObject();};
		global.getViewsObject = function() {return mvcmodule.getViewsObject();};
		global.getFormsObject = function() {return mvcmodule.getFormsObject();};
		global.getBreadCrumbsObject = function() {return mvcmodule.getBreadCrumbsObject();};
		
		global.getCurrentFormBand = function() {return mvcmodule.getCurrentFormBand();};
		global.setCurrentFormBand = function(value) {return mvcmodule.setCurrentFormBand(value);};
		global.getCurrentViewBand = function() {return mvcmodule.getCurrentViewBand();};
		global.setCurrentViewBand = function(value) {return mvcmodule.setCurrentViewBand(value);};
		
		global.resetNavigation = function() {return mvcmodule.resetNavigation();};
		global.getCurrentContract = function() {return mvcmodule.getCurrentContract();};
		global.setCurrentContract = function(contract) {return mvcmodule.setCurrentContract(contract);};
		global.getCurrentStakeHolder = function() {return mvcmodule.getCurrentStakeHolder();};
		global.setCurrentStakeHolder = function(stakeholder) {return mvcmodule.setCurrentStakeHolder(stakeholder);};
		global.getCurrentIssuance = function() {return mvcmodule.getCurrentIssuance();};
		global.setCurrentIssuance = function(issuance) {return mvcmodule.setCurrentIssuance(issuance);};
		global.getCurrentTransaction = function() {return mvcmodule.getCurrentTransaction();};
		global.setCurrentTransaction = function(transaction) {return mvcmodule.setCurrentTransaction(transaction);};
		
		/*********************/
		/* for compatibility */
		/*********************/
		
		return this.initAuthorizationAccess();
		
	}
	
	initAuthorizationAccess() {
		console.log("Cheking call from localhost browser");
		  
		var href = window.location.href;
		var hostname = window.location.hostname;
	  
		console.log("hostname is " + hostname);
	  
		if ((hostname != 'localhost') && (hostname != '127.0.0.1')) {
			var returnerror = true;
			
			if (window.Config) {
				// we check if we overloaded this security
				var allow_remote_access = window.Config.getXtraValue('allow_remote_access');
				console.log("allow_remote_access is " + allow_remote_access);
				console.log("xtraconfig keys " + Object.keys(window.Config.XtraConfig));
				
				if (allow_remote_access == 'enabled') {
					returnerror = false;
				}
			}
			
			if (returnerror) {
				console.log("remote access forbidden");
				window.alert("For security reasons, this app only allows localhost access.");
				window.location = "error.html";
				
				return;
				
			}
		}
		
		//return this.initWeb3();
		return this.initContracts();
	}
  
	/*	initWeb3() {
		// initializing web3 connection
		console.log("Initializing web3 connection");
		
		var global = this.getGlobalObject();
		
		console.log('web3 provider is  ' + global.getWeb3ProviderUrl());
		
		var web3Provider = global.getWeb3Instance();

		web3 = global.getWeb3Instance();
  
	    return this.initContracts();
	}*/

	initContracts() {
		var global = this.getGlobalObject();
		/*var contracts = global.getContractsObject();
		
		var jsonarray = global.readLocalJson();
		
		contracts.initContractObjects(jsonarray);*/
		
		var commonmodule = global.getModuleObject('common');
		var contracts = commonmodule.getContractsObject();
		
		return this.refreshDisplay();
	}
	
	// scripts
	include(file, callback)	{

	  var script  = document.createElement('script');
	  script.src  = file;
	  script.type = 'text/javascript';
	  script.defer = true;
	  script.onload = function(){
	        console.log('script ' + file + ' is now loaded');
	        if (callback)
	        	callback(null, script);
	        };

	  document.getElementsByTagName('head').item(0).appendChild(script);

	}
	
	// control

	bindEvent(event, selector, handler) {
		if ((this.eventhandlers[event]) && (this.eventhandlers[event][selector]))
			return; // to avoid adding multiple times the handler
		
		console.log("binding event " + event + " to selector " + selector);
		
		$(document).on(event, selector, handler);
		
		if (!this.eventhandlers[event])
			this.eventhandlers[event] = Object.create(null)
		
		this.eventhandlers[event][selector] = true;
	}
	
	unbindEvent(event, selector) {
		if ((this.eventhandlers[event]) && (this.eventhandlers[event][selector]))
			this.eventhandlers[event][selector] = false;

		$(document).off(event).on(event, selector, handler);
	}
	
	// top band
	
	setMessage(message) {
		this.currentmessage = message;
		
	}
	
	clearMessage() {
		this.currentmessage = null;
		
		this.clearMessageZone();
	}
	
	displayMessageZone() {
		var messageZone = document.getElementById("message-zone");
		
		if (this.currentmessage)
			messageZone.innerHTML = this.currentmessage;
		else 
			messageZone.innerHTML = "&nbsp;";
		
	}
	
	clearMessageZone() {
		var messageZone = document.getElementById("message-zone")
		
		messageZone.innerHTML = "&nbsp;";
		
	}
	
	// breadcrumb
	setBreadCrumbBand(breadcrumb) {
		var breadcrumbBand = document.getElementById("breadcrumb-band");
		
		breadcrumbBand.appendChild(breadcrumb);
		
	}
	
	clearBreadCrumbBand() {
		var breadcrumbBand = document.getElementById("breadcrumb-band");
		
		
		while (breadcrumbBand.firstChild) {
			breadcrumbBand.removeChild(breadcrumbBand.firstChild);
		}	
	}
	
	// form band, second band
	addForm(form) {
		var formband = document.getElementById("form-band");
		document.getElementById('form-band').appendChild(form);
	}
	
	getFormValue(formelementname) {
		var value = document.getElementsByName(formelementname)[0].value;
		
		return value;
	}
	
	clearFormBand() {
		var formband = document.getElementById("form-band");
		
		while (formband.firstChild) {
			formband.removeChild(formband.firstChild);
		}	
	}

	// view band, third band
	addView(view) {
		var formband = document.getElementById("view-band");
		document.getElementById('view-band').appendChild(view);
	}
	
	
	clearViewBand() {
		var viewband = document.getElementById("view-band");
		
		while (viewband.firstChild) {
			viewband.removeChild(viewband.firstChild);
		}	
		
	}
	
	getGlobalObject() {
		var global;
		
		try {
			global = window.Global.getGlobalObject();
		}
		catch(e) {
			// first call, we create global object now
			global = window.Global.createGlobalObject(this);
			
			// we add the necessary library classes
			//global.addClass('TruffleContract', TruffleContract);
			//global.addClass('Web3', Web3);
		}
		
		return global;
	}

	clearDisplay() {
		console.log("App.clearDisplay called");
		
		this.clearMessageZone();
		this.clearBreadCrumbBand();
		this.clearFormBand();
		this.clearViewBand();
		
		return;
	}
	
	refreshDisplay() {
		console.log("App.refreshDisplay called");
		var global = this.getGlobalObject()
		var controllers = global.getControllersObject();
		
		this.clearDisplay();
		
		controllers.displayCurrentPage();
		
		return;
	}
	
};

//
//bootstrap of App
//
var app = new App();

//initialization of App
app.init();


/*$(function() {
	  $(window).on('load', function() {
    App.init();
  });
});*/
