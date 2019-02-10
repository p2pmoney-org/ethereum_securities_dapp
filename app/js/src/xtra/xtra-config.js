// additional js variables for overload on standard dapp
/**
 * 
 */
'use strict';

class XtraConfig {
	
	constructor() {
		// add xtra values that could be accessed
		// via Config.getXtraValue(key)
	}
}

//export

if ( typeof window !== 'undefined' && window ) // if we are in browser and not node js (e.g. truffle)
window.Config.XtraConfig = XtraConfig;