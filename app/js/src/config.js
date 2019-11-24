/********************************/
/*   Ethereum dapp functions    */
/********************************/

var _globalscope;

if ( typeof window !== 'undefined' && window ) {
	// we are in the browser
	_globalscope = window;
}
else if ( typeof global !== 'undefined' && global ) {
	_globalscope = global;
}

if (_globalscope.simplestore.Config) {
	console.log('config.js not already loaded');
}


_globalscope.simplestore.Config.getWeb3ProviderUrl = function() {
	var Config = _globalscope.simplestore.Config;
	
	if (Config.config_overload_read == false)
		Config.readConfigOverload();
	
	var web3providerurl = Config.web3provider_protocol + Config.web3provider_host + (Config.web3provider_port && Config.web3provider_port.toString().length ? ':' + Config.web3provider_port.toString() : '');
	
	// we look in Config.valuemap to see if value is overloaded
	var web3_provider_full_url = (Config && (Config.get)  && (Config.get('web3_provider_full_url')) ? Config.get('web3_provider_full_url') : null);
	
	if (web3_provider_full_url) {
		web3providerurl = web3_provider_full_url
	}

	return web3providerurl;
};

_globalscope.simplestore.Config.getWeb3ProviderProtocol = function() {
	var Config = _globalscope.simplestore.Config;
	
	return Config.web3provider_protocol;
};

_globalscope.simplestore.Config.getWeb3ProviderHost = function() {
	var Config = _globalscope.simplestore.Config;
	
	return Config.web3provider_host;
};

_globalscope.simplestore.Config.getWeb3ProviderPort = function() {
	return Config.web3provider_port;
};

_globalscope.simplestore.Config.getWeb3ProviderNetworkId = function() {
	var Config = _globalscope.simplestore.Config;
	
	return Config.web3provider_network_id;
};

_globalscope.simplestore.Config.getDefaultGasLimit = function() {
	var Config = _globalscope.simplestore.Config;
	
	var defaultlimit = Config.defaultGasLimit;
	
	// we look in Config.valuemap to see if value is overloaded
	var defaultgaslimit = (Config && (Config.get)  && (Config.get('defaultgaslimit')) ? Config.get('defaultgaslimit') : null);
	
	if (defaultgaslimit) {
		defaultlimit = defaultgaslimit
	}
	
	return defaultlimit;
};

_globalscope.simplestore.Config.getDefaultGasPrice = function() {
	var Config = _globalscope.simplestore.Config;
	
	var defaultprice = Config.defaultGasPrice;
	
	
	// we look in Config.valuemap to see if value is overloaded
	var defaultgasprice = (Config && (Config.get)  && (Config.get('defaultgasprice')) ? Config.get('defaultgasprice') : null);
	
	if (defaultgasprice) {
		defaultprice = defaultgasprice
	}

	return defaultprice;
};

_globalscope.simplestore.Config.getWalletAccountAddress = function() {
	var Config = _globalscope.simplestore.Config;
	
	var walletaccountaddress = Config.wallet_account;
	
	// we look in Config.valuemap to see if value is overloaded
	var wallet_account = (Config && (Config.get)  && (Config.get('wallet_account')) ? Config.get('wallet_account') : null);
	
	if (wallet_account) {
		walletaccountaddress = wallet_account
	}
	
	return walletaccountaddress;
};

_globalscope.simplestore.Config.useWalletAccountChallenge = function() {
	var Config = _globalscope.simplestore.Config;
	
	var walletaccountchallenge = Config.wallet_account_challenge;
	
	// we look in Config.valuemap to see if value is overloaded
	var wallet_account_challenge = (Config && (Config.get)  && (Config.get('wallet_account_challenge')) ? Config.get('wallet_account_challenge') : null);
	
	if (wallet_account_challenge) {
		walletaccountchallenge = wallet_account_challenge
	}

	return walletaccountchallenge;
};

_globalscope.simplestore.Config.needToUnlockAccounts = function() {
	var Config = _globalscope.simplestore.Config;
	
	var needtounlockaccounts = Config.need_to_unlock_accounts;
	
	// we look in Config.valuemap to see if value is overloaded
	var need_to_unlock_accounts = (Config && (Config.get)  && (Config.get('need_to_unlock_accounts')) ? Config.get('need_to_unlock_accounts') : null);
	
	if (need_to_unlock_accounts) {
		needtounlockaccounts = need_to_unlock_accounts
	}
	
	return needtounlockaccounts;
};
	

/*********************/
/*      Web3         */
/********************/ 


_globalscope.simplestore.Config.defaultGasLimit = 4712388;
_globalscope.simplestore.Config.defaultGasPrice = 100000000000;

// default
/*
 * 
 * _globalscope.simplestore.Config.web3provider_protocol = 'http://';
 * _globalscope.simplestore.Config.web3provider_host = 'localhost';
 * _globalscope.simplestore.Config.web3provider_port = 8545;
 * _globalscope.simplestore.Config.web3provider_network_id = '*' // Match any network id
 * _globalscope.simplestore.Config.need_to_unlock_accounts = true; // do we need to unlock (e.g. on geth) or pass-through development client (e.g. Ganache)
 * _globalscope.simplestore.Config.wallet_account_challenge = true; 
 * _globalscope.simplestore.Config.wallet_account = '0x0000000000000000000000000000000000000001'; // your test account
 * */


// Ganache
_globalscope.simplestore.Config.web3provider_protocol = 'http://';
_globalscope.simplestore.Config.web3provider_host = 'localhost';
_globalscope.simplestore.Config.web3provider_port = 9547;
_globalscope.simplestore.Config.web3provider_network_id = '*' // Match any network id
_globalscope.simplestore.Config.need_to_unlock_accounts = false;
_globalscope.simplestore.Config.wallet_account_challenge = true;
//Ganache 1.0.1
//_globalscope.simplestore.Config.wallet_account = '0x6330A553Fc93768F612722BB8c2eC78aC90B3bbc';
//Ganache 1.1.0
_globalscope.simplestore.Config.wallet_account = '0xfFA2808E37954fF5042a98103068b42f22f0f733';



// local Geth
/*_globalscope.simplestore.Config.web3provider_protocol = 'http://';
_globalscope.simplestore.Config.web3provider_host = 'localhost';
_globalscope.simplestore.Config.web3provider_port = 8545;
_globalscope.simplestore.Config.web3provider_network_id = '*' // Match any network id
_globalscope.simplestore.Config.need_to_unlock_accounts = true; 
_globalscope.simplestore.Config.wallet_account_challenge = true; 
_globalscope.simplestore.Config.wallet_account = 'your_test_account';*/

// INFURA
/*_globalscope.simplestore.Config.web3provider_protocol = 'https://';
_globalscope.simplestore.Config.web3provider_host = 'rinkeby.infura.io/v3/your_infura_key'
_globalscope.simplestore.Config.web3provider_port = '';
_globalscope.simplestore.Config.web3provider_network_id = '*' // Match any network id
_globalscope.simplestore.Config.need_to_unlock_accounts = true; 
_globalscope.simplestore.Config.wallet_account_challenge = true; 
_globalscope.simplestore.Config.wallet_account = 'your_test_account';*/


