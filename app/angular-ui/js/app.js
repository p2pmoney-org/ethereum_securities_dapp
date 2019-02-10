'use strict';

class App {
	constructor() {
		this.angular_app = null;
		
		this.global = null;
	}
	
	init() {
		console.log('initialization of App object');
		
		this.initGlobal();
		
	}
	
	initGlobal() {
		console.log("Initializing global object");

		// global objects
		this.global = GlobalClass.getGlobalObject();
		var global = this.global;
		
		// overload global
		global.app = this;
		global.getAppObject = function() {
			return this.app;
		}
		
		this.initAngularApp();
	}
	
	initAngularApp() {
		console.log("Initializing angular app");
		
		var global = GlobalClass.getGlobalObject(); 
		//var session = global.getModuleObject('common').getSessionObject();
		
		this.angular_app  = angular.module("angular_app", ['ui.bootstrap', 'ui.router','ncy-angular-breadcrumb']);
		//this.angular_app  = angular.module("angular_app", ['ui.bootstrap', 'ui.router', 'ngBreadCrumb']);
		//this.angular_app  = angular.module("angular_app", ['ngRoute']);

		
		var angular_app = this.angular_app;
		
	
		// registering controllers
		var controllers = global.getModuleObject('mvc').getControllersObject();
		
		controllers.registerControllers(app);
		
		
		// manual boostrap
		angular.element(document).ready(function() { angular.bootstrap(document, ['angular_app']);});

	}
	
	// util
	getGlobalObject() {
		return this.global;
	}
	getAngularApp() {
		return this.angular_app;
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
	
	refreshDisplay() {
		console.log("App.refreshDisplay called");
		
		
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
	

	// loop
	loop() {
		if (! this.loopnum)
		this.loopnum = 0;
		
		console.log("loop number " + this.loopnum++);
		
	}
	
	run() {
		console.log("entering run loop");
		
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
var app = new App();

// initialization of App
app.init();

app.run();


/*
$(function() {
	  $(window).on('load', function() {
	    console.log("window on load called");
	  });
});*/
