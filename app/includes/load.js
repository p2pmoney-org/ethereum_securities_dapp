'use strict';

var rootscriptloader = ScriptLoader.getRootScriptLoader();
var corescriptloader = rootscriptloader.getChildLoader('coreloader');

corescriptloader.push_script('./includes/interface/cryptokey-encryption.js');
corescriptloader.push_script('./includes/interface/account-encryption.js');
corescriptloader.push_script('./includes/interface/storage-access.js');

//common
corescriptloader.push_script('./includes/modules/common/module.js');


corescriptloader.load_scripts(function () {
	// signal end of core framework load
	rootscriptloader.signalEvent('on_core_load_end');	
});