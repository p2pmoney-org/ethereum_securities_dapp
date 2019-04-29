var bootstrapobject = Bootstrap.getBootstrapObject();
var rootscriptloader = ScriptLoader.getRootScriptLoader();

//include all global js files here 
var globalscriptloader = rootscriptloader.getChildLoader('globalloader');

globalscriptloader.push_script('./js/src/config.js');
globalscriptloader.push_script('./js/src/constants.js');

globalscriptloader.push_script('./includes/modules/common/global.js');

globalscriptloader.push_script('./js/src/xtra/xtra-config.js');


// perform load
globalscriptloader.load_scripts();


//libs
var libscriptloader = rootscriptloader.getChildLoader('libloader');

//jquery
libscriptloader.push_script('./includes/lib/jquery-3.1.0.js');

libscriptloader.push_script('./includes/lib/bootstrap.min-3.3.7.js');

// interfaces to abstract access to standard libs
libscriptloader.push_script('./includes/interface/ethereum-node-access.js');
libscriptloader.push_script('./includes/interface/cryptokey-encryption.js');
libscriptloader.push_script('./includes/interface/account-encryption.js');
libscriptloader.push_script('./includes/interface/storage-access.js');


//perform load
libscriptloader.load_scripts();



// includes modules
var modulescriptloader = libscriptloader.getChildLoader('moduleloader');
var dappsscriptloader = modulescriptloader.getChildLoader('dappmodulesloader');

// common
modulescriptloader.push_script('./includes/modules/common/module.js');
//ethereum node
modulescriptloader.push_script('./includes/modules/ethnode/module.js');
//ethereum chain reader
modulescriptloader.push_script('./includes/modules/ethchainreader/module.js');

// let /dapps/module push scripts in 'dappmodulesloader' then load them
modulescriptloader.push_script('./dapps/module.js', function () {
	console.log('dapps module loaded');
});



//perform includes module load
modulescriptloader.load_scripts(function () {
	var global = GlobalClass.getGlobalObject();	
	
	// load common module now
	global.loadModule('common', modulescriptloader, function() {
		rootscriptloader.signalEvent('on_common_module_load_end');
		
		// loading dapps pushed in 'dappmodulesloader'
		dappsscriptloader.load_scripts(function() {
			
			global.loadModule('dapps', modulescriptloader, function() {
				rootscriptloader.signalEvent('on_dapps_module_load_end');
			});
			
		});
	});

	
	
});


//mvc
rootscriptloader.registerEventListener('on_dapps_module_load_end', function(eventname) {
	var mvcui = bootstrapobject.getMvcUI();
	
	if (mvcui == 'angularjs-1.x') {
		var mvcscriptloader = dappsscriptloader.getChildLoader('mvcloader');

		mvcscriptloader.push_script('./angular-ui/js/src/module.js', 
			function() {
				var global = GlobalClass.getGlobalObject();	
				
				var allmodulesscriptloader = global.loadModule('mvc', modulescriptloader, function() {
					// and finally loading the app
					var appscriptloader = allmodulesscriptloader.getChildLoader('apploader');
					
					appscriptloader.push_script('./angular-ui/js/app.js');

					//perform load
					appscriptloader.load_scripts(function() {
						// signal end of mvc module
						rootscriptloader.signalEvent('on_mvc_module_load_end');
					});
					
				});
		});


		//perform load
		mvcscriptloader.load_scripts();
	}
});



// signal end of browser load
rootscriptloader.signalEvent('on_browser_load_end');



