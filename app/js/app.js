App = {
	//global: null,
	//web3Provider: null,
	//securities: [],

	init: function() {
		console.log("Initializing app");
	  
		
		return App.initGlobal();
		
	},
	
	initGlobal: function() {
		// initializing web3 connection
		console.log("Initializing global object");
		// global objects
		//App.global = window.global;
		var global = this.getGlobalObject(); // do the creation
		
		return App.initAuthorizationAccess();
		
	},
	
	initAuthorizationAccess: function() {
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
		
		return App.initWeb3();
	},
  
	initWeb3: function() {
		// initializing web3 connection
		console.log("Initializing web3 connection");
		
		var global = this.getGlobalObject();
		
		console.log('web3 provider is  ' + global.getWeb3ProviderUrl());
		
/*		var web3Provider = global.getWeb3Instance();

		web3 = global.getWeb3Instance();*/
  
	    return App.initContracts();
	},

	initContracts: function() {
		var global = this.getGlobalObject();
		var contracts = global.getContractsObject();
		
		var jsonarray = global.readLocalJson();
		
		contracts.initContractObjects(jsonarray);
	
		
		return App.refreshDisplay();
	},
	
	// scripts
	include: function(file, callback)
	{

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

	},
	
	// control
	eventhandlers: [],

	bindEvent: function(event, selector, handler) {
		if ((App.eventhandlers[event]) && (App.eventhandlers[event][selector]))
			return; // to avoid adding multiple times the handler
		
		console.log("binding event " + event + " to selector " + selector);
		
		$(document).on(event, selector, handler);
		
		if (!App.eventhandlers[event])
			App.eventhandlers[event] = Object.create(null)
		
		App.eventhandlers[event][selector] = true;
	},
	
	unbindEvent: function(event, selector) {
		if ((App.eventhandlers[event]) && (App.eventhandlers[event][selector]))
			App.eventhandlers[event][selector] = false;

		$(document).off(event).on(event, selector, handler);
	},
	
	// top band
	currentmessage: null,
	
	setMessage: function(message) {
		this.currentmessage = message;
		
	},
	
	clearMessage() {
		this.currentmessage = null;
		
		this.clearMessageZone();
	},
	
	displayMessageZone() {
		var messageZone = document.getElementById("message-zone");
		
		if (this.currentmessage)
			messageZone.innerHTML = this.currentmessage;
		else 
			messageZone.innerHTML = "&nbsp;";
		
	},
	
	clearMessageZone: function() {
		var messageZone = document.getElementById("message-zone")
		
		messageZone.innerHTML = "&nbsp;";
		
	},
	
	// breadcrumb
	setBreadCrumbBand: function(breadcrumb) {
		var breadcrumbBand = document.getElementById("breadcrumb-band");
		
		breadcrumbBand.appendChild(breadcrumb);
		
	},
	
	clearBreadCrumbBand: function() {
		var breadcrumbBand = document.getElementById("breadcrumb-band");
		
		
		while (breadcrumbBand.firstChild) {
			breadcrumbBand.removeChild(breadcrumbBand.firstChild);
		}	
	},
	
	// form band, second band
	addForm: function(form) {
		var formband = document.getElementById("form-band");
		document.getElementById('form-band').appendChild(form);
	},
	
	getFormValue: function(formelementname) {
		var value = document.getElementsByName(formelementname)[0].value;
		
		return value;
	},
	
	clearFormBand: function() {
		var formband = document.getElementById("form-band");
		
		while (formband.firstChild) {
			formband.removeChild(formband.firstChild);
		}	
	},

	// view band, third band
	addView: function(view) {
		var formband = document.getElementById("view-band");
		document.getElementById('view-band').appendChild(view);
	},
	
	
	clearViewBand: function() {
		var viewband = document.getElementById("view-band");
		
		while (viewband.firstChild) {
			viewband.removeChild(viewband.firstChild);
		}	
		
	},
	
	getGlobalObject: function() {
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
	},

	clearDisplay: function() {
		console.log("App.clearDisplay called");
		var global = this.getGlobalObject()
		var controllers = global.getControllersObject();
		
		App.clearMessageZone();
		App.clearBreadCrumbBand();
		App.clearFormBand();
		App.clearViewBand();
		
		return;
	},
	
	refreshDisplay: function() {
		console.log("App.refreshDisplay called");
		var global = this.getGlobalObject()
		var controllers = global.getControllersObject();
		
		this.clearDisplay();
		
		controllers.displayCurrentPage();
		
		return;
	},
	
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
