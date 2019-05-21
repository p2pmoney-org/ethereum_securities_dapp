'use strict';

var App = class {
	constructor() {

		this.angular_app = null;
		
		this.global = null;
	}
	
	
	// functions required for any app object (angular, react,..)
	refreshDisplay() {
		console.log("App.refreshDisplay called for dapp_app");
		
		
		// reload current state
		//var $injector = $scope.injectorforrefresh
		var $injector = this.getAngularInjector();
		
		if ($injector) {
			//console.log('injector properties ' + Object.getOwnPropertyNames($injector));
			
			var $state = $injector.get('$state');
			$state.reload();

			//window.location.reload();
			// forces a complete reload
		}
		
		
		return;
		
	}
	
	setMessage(message) {
		console.log('should set message somewhere: ' + message);
	}
	

	// initialization
	init(callback) {
		console.log('Initialization of dapp_app object');
		
		this.initGlobal(callback);
		
	}
	
	initGlobal(callback) {
		console.log("Initializing global object for dapp_app");

		// global objects
		this.global = GlobalClass.getGlobalObject();
		var global = this.global;
		var self = this;
		
		// overload global
		global.app = this;
		global.getAppObject = function() {
			return this.app;
		}
		
		var rootscriptloader = ScriptLoader.getRootScriptLoader();
		
		rootscriptloader.registerEventListener('on_angular_ui_load_end', function(eventname) {
			self.initAngularApp(callback);
			
		});
	}
	
	initAngularApp(callback) {
		console.log("Initializing angular app for dapp_app");
		
		var global = GlobalClass.getGlobalObject(); 
		//var session = global.getModuleObject('common').getSessionObject();
		
		
		// add modules dependencies
		
		//this.angular_app  = angular.module("angular_app", ['ui.bootstrap', 'ui.router','ncy-angular-breadcrumb']);
		//this.angular_app  = angular.module("angular_app", ['ui.bootstrap', 'ui.router', 'ngBreadCrumb']);
		//this.angular_app  = angular.module("angular_app", ['ngRoute']);
		
		var angular_modules = [];
		
		angular_modules.push('ui.bootstrap');
		angular_modules.push('ui.router');
		angular_modules.push('ncy-angular-breadcrumb');
		
		// invoke hook if a module wants to add other angular dependencies before activation
		var result = [];
		
		var params = [];
		
		params.push(angular_modules);

		var ret = global.invokeHooks('addAngularModule_hook', result, params);
		
		if (ret && result && result.length) {
			console.log('addAngularModule_hook overload handled by a module');			
		}
		
		// angular activation
		this.angular_app  = angular.module("angular_app", angular_modules);
		

		
		// setting app object in mvc module
		var mvcmodule = global.getModuleObject('mvc');
	
		mvcmodule.setAppObject(this);

		// registering controllers
		var controllers = mvcmodule.getControllersObject();
		
		controllers.registerControllers(this);
		
		
		// angular manual boostrap
		angular.element(document).ready(function() { 
			console.log('bootstrapping manually angular app');
			angular.bootstrap(document, ['angular_app']);
			
			var rootscriptloader = window.ScriptLoader.getRootScriptLoader();
			
			rootscriptloader.signalEvent('on_angular_ui_bootstrapped');
			
			if (callback)
				callback(null, true);
		});

	}
	
	// util
	getGlobalObject() {
		return this.global;
	}
	
	getAngularApp() {
		return this.angular_app;
	}
	
	getDappDir() {
		return (ScriptLoader.dapp_dir ? ScriptLoader.dapp_dir : '');
	}
	
	getHtmlUrl(relativepath) {
		return this.getDappDir() + relativepath;
	}
	

	// view functions
	getAngularInjector() {
		var $scope = angular.element(document.getElementById('login-link-div')).scope();
		
		if ($scope) {
			var $rootscope = ($scope.$root ? $scope.$root : $scope);
			
			console.log('scope is ' + ($scope.$root ? 'not ' : '') + ' root scope');
			
			var $injector = $scope.injectorforrefresh;
			
			return $injector;
		}
	}
	
	// loop
	loop() {
		if (! this.loopnum)
		this.loopnum = 0;
		
		console.log("loop number " + this.loopnum++);
		
	}
	
	run() {
		console.log("entering dapp_app run loop");
		
		this.angular_app.run(['$injector', '$timeout', function ($injector, $timeout) {
			var $state = $injector.get('$state');
			
			if ($state.current.name != 'home') {
				console.log("starting on page " + $state.current.name);
				//console.log("jumping to home");
				//$timeout(function() {$state.go('home');}, 200); // waiting to avoid 'The transition has been superseded...'
			}
		}]);
		
		// looping
		//var var_1 = window.setInterval(this.loop,5000);
	}

}

//
//bootstrap of App
//
var dapp_app = new App();

// initialization of App
dapp_app.init(function() {
	dapp_app.run();
});



/*
$(function() {
	  $(window).on('load', function() {
	    console.log("window on load called");
	  });
});*/
