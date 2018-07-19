'use strict';


var Module = class {
	
	constructor() {
		this.name = 'mvc';
		
		this.global = null; // put by global on registration
		this.isready = false;
		this.isloading = false;
		
		// navigation
		this.currentformband = Constants.FORM_ADD_CONTRACT_ADDRESS;
		this.currentviewband = Constants.VIEW_CONTRACT_LIST;
		
		this.currentcontract = null;
		this.currentstakeholder = null;
		this.currentissuance = null;
		this.currenttransaction = null;
		
	}
	
	init() {
		console.log('module init called for ' + this.name);

		var global = this.global;
		
		// perform global scope final init
		global.finalizeGlobalScopeInit(function(res) {
			console.log("mvc module finished initialization of GlobalScope");
		});
		
		this.isready = true;
	}
	
	loadModule(parentscriptloader, callback) {
		console.log('loadModule called for module ' + this.name);

		if (this.isloading)
			return;
			
		this.isloading = true;

		var self = this;
		var global = this.global;
		var mvc = global.getModuleObject('mvc');
		
		var modulescriptloader = global.getScriptLoader('mvcmoduleloader', parentscriptloader);

		modulescriptloader.push_script('./js/src/control/controllers.js');
		
		modulescriptloader.push_script('./js/src/view/breadcrumbs.js');
		modulescriptloader.push_script('./js/src/view/forms.js');
		modulescriptloader.push_script('./js/src/view/views.js');
		
		modulescriptloader.push_script('./js/src/model/models.js');

		modulescriptloader.load_scripts(function() { 
									mvc.Models.loadModules(parentscriptloader, function() {
										self.init(); 
										if (callback) callback(null, self);
									}); 
								});
		
		return modulescriptloader;
	}
	
	isReady() {
		return this.isready;
	}
	
	hasLoadStarted() {
		return this.isloading;
	}

	
	// state
	
	// display
	getCurrentFormBand() {
		return this.currentformband;
	}
	
	setCurrentFormBand(value) {
		this.currentviewband = (value ? value : Constants.FORM_ADD_ADDRESS);

		this.currentformband = value;
	}
	
	getCurrentViewBand() {
		return this.currentviewband;
	}
	
	setCurrentViewBand(value) {
		this.currentviewband = (value ? value : Constants.VIEW_CONTRACT_LIST);
	}
	
	// navigation objects
	resetNavigation() {
		this.currentcontract = null;
		this.currentstakeholder = null;
		this.currentissuance = null;
		this.currenttransaction = null;
	}
	
	getCurrentContract() {
		return this.currentcontract;
	}
	
	setCurrentContract(contract) {
		this.currentcontract = contract;
	}
	
	getCurrentStakeHolder() {
		return this.currentstakeholder;
	}
	
	setCurrentStakeHolder(stakeholder) {
		this.currentstakeholder = stakeholder;
	}
	
	getCurrentIssuance() {
		return this.currentissuance;
	}
	
	setCurrentIssuance(issuance) {
		this.currentissuance = issuance;
	}
	
	getCurrentTransaction() {
		return this.currenttransaction;
	}
	
	setCurrentTransaction(transaction) {
		this.currenttransaction = transaction;
	}
	
	// mvc objects
	getControllersObject() {
		if (this.controllers)
			return this.controllers;
		
		var global = this.global;
		this.controllers = new this.Controllers(global);
		
		return this.controllers;
	}
	
	getViewsObject() {
		if (this.views)
			return this.views;
		
		var global = this.global;
		this.views = new this.Views(global);
		
		return this.views;
	}

	getFormsObject() {
		if (this.forms)
			return this.forms;
		
		var global = this.global;
		this.forms = new this.Forms(global);
		
		return this.forms;
	}

	getBreadCrumbsObject() {
		if (this.breadcrumbs)
			return this.breadcrumbs;
		
		var global = this.global;
		this.breadcrumbs = new this.BreadCrumbs(global);
		
		return this.breadcrumbs;
	}

}

GlobalClass.getGlobalObject().registerModuleObject(new Module());


//dependencies
//GlobalClass.getGlobalObject().registerModuleDepency('mvc', 'securities');