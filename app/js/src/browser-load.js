var rootscriptloader = window.ScriptLoader.getScriptLoader('rootloader');

//include all global js files here 
rootscriptloader.push_script('./js/src/config.js');
rootscriptloader.push_script('./js/src/constants.js');
rootscriptloader.push_script('./js/includes/common/global.js');
rootscriptloader.push_script('./js/src/xtra/xtra-config.js');


// perform load
rootscriptloader.load_scripts();

//libs
var libscriptloader = rootscriptloader.getChildLoader('libloader');

//jquery
libscriptloader.push_script('./js/lib/jquery-3.1.0.js');

libscriptloader.push_script('./js/lib/bootstrap.min-3.3.7.js');

libscriptloader.push_script('./js/lib/web3-0.20.3.js');
libscriptloader.push_script('./js/lib/truffle-contract-1.1.11.js');

libscriptloader.push_script('./js/lib/ethereumjs-all-2017-10-31.min.js');
libscriptloader.push_script('./js/lib/keythereum.min.js');
libscriptloader.push_script('./js/lib/bitcore.min.js');
libscriptloader.push_script('./js/lib/bitcore-ecies.min.js');

// interfaces to abstract the previous libs
libscriptloader.push_script('./js/lib/ethereum-node-access.js');
libscriptloader.push_script('./js/lib/account-encryption.js');


//perform load
libscriptloader.load_scripts();

//modules
var modulescriptloader = libscriptloader.getChildLoader('moduleloader');

// common
modulescriptloader.push_script('./js/includes/common/module.js');

// securities
modulescriptloader.push_script('./js/src/includes/securities/module.js');

//perform load
modulescriptloader.load_scripts();


//mvc
var mvcscriptloader = modulescriptloader.getChildLoader('mvcloader');

mvcscriptloader.push_script('./js/src/module.js', 
	function() {
		var global = GlobalClass.getGlobalObject();	
		
		var allmodulesscriptloader = global.loadModule('mvc', modulescriptloader, function() {
			// and finally loading the app
			var appscriptloader = allmodulesscriptloader.getChildLoader('apploader');
			
			appscriptloader.push_script('./js/app.js');

			//perform load
			appscriptloader.load_scripts();
		});
		
	});

//perform load
mvcscriptloader.load_scripts();



