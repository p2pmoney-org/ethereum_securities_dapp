var rootscriptloader = window.ScriptLoader.getScriptLoader('rootloader');

//include all global js files here 
rootscriptloader.push_script('./js/src/config.js');
rootscriptloader.push_script('./js/src/constants.js');

rootscriptloader.push_script('./includes/modules/common/global.js');

rootscriptloader.push_script('./js/src/xtra/xtra-config.js');


// perform load
rootscriptloader.load_scripts();

//libs
var libscriptloader = rootscriptloader.getChildLoader('libloader');

//jquery
libscriptloader.push_script('./includes/lib/jquery-3.1.0.js');

libscriptloader.push_script('./includes/lib/bootstrap.min-3.3.7.js');

// interfaces to abstract access to standard libs
libscriptloader.push_script('./includes/interface/ethereum-node-access.js');
libscriptloader.push_script('./includes/interface/account-encryption.js');


//perform load
libscriptloader.load_scripts();

//modules
var modulescriptloader = libscriptloader.getChildLoader('moduleloader');

// common
modulescriptloader.push_script('./includes/modules/common/module.js');

// securities
modulescriptloader.push_script('./dapps/securities/includes/module.js');

//perform load
modulescriptloader.load_scripts();


//mvc
var mvcscriptloader = modulescriptloader.getChildLoader('mvcloader');

mvcscriptloader.push_script('./js-ui/src/module.js', 
	function() {
		var global = GlobalClass.getGlobalObject();	
		
		var allmodulesscriptloader = global.loadModule('mvc', modulescriptloader, function() {
			// and finally loading the app
			var appscriptloader = allmodulesscriptloader.getChildLoader('apploader');
			
			appscriptloader.push_script('./js-ui/app.js');

			//perform load
			appscriptloader.load_scripts();
		});
		
	});

//perform load
mvcscriptloader.load_scripts();



