/**
 * 
 */
'use strict';

var Web3Provider = class {
	constructor(session, web3providerurl, ethereumnodeaccessinstance) {
		this.session = session;
		this.web3providerurl = web3providerurl;
		
		this.uuid = session.guid();
		
		
		this.ethereumnodeaccessinstance = ethereumnodeaccessinstance;
	}
	
	getUUID() {
		return this.uuid;
	}
	
	getWeb3ProviderUrl() {
		return this.web3providerurl;
	}
	
	getEthereumNodeAccessInstance() {
		if (this.ethereumnodeaccessinstance.web3providerurl != this.web3providerurl)
			throw 'ethereum node access object is no longer set with the correct url';
		
		return this.ethereumnodeaccessinstance;
	}

}

if ( typeof GlobalClass !== 'undefined' && GlobalClass )
	GlobalClass.registerModuleClass('ethnode', 'Web3Provider', Web3Provider);
else if (typeof window !== 'undefined') {
	let _GlobalClass = ( window && window.simplestore && window.simplestore.Global ? window.simplestore.Global : null);
	
	_GlobalClass.registerModuleClass('ethnode', 'Web3Provider', Web3Provider);
}
else if (typeof global !== 'undefined') {
	// we are in node js
	let _GlobalClass = ( global && global.simplestore && global.simplestore.Global ? global.simplestore.Global : null);
	
	_GlobalClass.registerModuleClass('ethnode', 'Web3Provider', Web3Provider);
}