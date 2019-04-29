class Config {
	
	static getWeb3ProviderUrl() {
		if (Config.config_overload_read == false)
			Config.readConfigOverload();
		
		return Config.web3provider_protocol + Config.web3provider_host + (Config.web3provider_port && Config.web3provider_port.toString().length ? ':' + Config.web3provider_port.toString() : '');
	}
	
	static getWeb3ProviderProtocol() {
		return Config.web3provider_protocol;
	}
	
	static getWeb3ProviderHost() {
		return Config.web3provider_host;
	}
	
	static getWeb3ProviderPort() {
		return Config.web3provider_port;
	}
	
	static getWeb3ProviderNetworkId() {
		return Config.web3provider_network_id;
	}
	
	static getDefaultGasLimit() {
		return Config.defaultGasLimit;
	}
	
	static getDefaultGasPrice() {
		return Config.defaultGasPrice;
	}
	
	static getWalletAccountAddress() {
		return Config.wallet_account;
	}
	
	static useWalletAccountChallenge() {
		return Config.wallet_account_challenge;
	}
	
	static needToUnlockAccounts() {
		return Config.need_to_unlock_accounts;
	}
	
	static getXtraValue(key) {
		if (!key)
			return;
		
		if ( typeof Config.XtraConfig !== 'undefined' && Config.XtraConfig) {
			if (!Config.XtraConfig.instance)
				Config.XtraConfig.instance = new Config.XtraConfig();
			
			if (Config.XtraConfig.instance[key])
			return Config.XtraConfig.instance[key];
		}
		else {
			console.log('Config.XtraConfig not defined')
		}
	}
}

/*********************/
/*      Web3         */
/********************/ 


Config.defaultGasLimit = 4712388;
Config.defaultGasPrice = 100000000000;

// default
/*
 * 
 * Config.web3provider_protocol = 'http://';
 * Config.web3provider_host = 'localhost';
 * Config.web3provider_port = 8545;
 * Config.web3provider_network_id = '*' // Match any network id
 * Config.need_to_unlock_accounts = true; // do we need to unlock (e.g. on geth) or pass-through development client (e.g. Ganache)
 * Config.wallet_account_challenge = true; 
 * Config.wallet_account = '0x0000000000000000000000000000000000000001'; // your test account
 * */


// Ganache
Config.web3provider_protocol = 'http://';
Config.web3provider_host = 'localhost';
Config.web3provider_port = 9547;
Config.web3provider_network_id = '*' // Match any network id
Config.need_to_unlock_accounts = false;
Config.wallet_account_challenge = true;
//Ganache 1.0.1
//Config.wallet_account = '0x6330A553Fc93768F612722BB8c2eC78aC90B3bbc';
//Ganache 1.1.0
Config.wallet_account = '0xfFA2808E37954fF5042a98103068b42f22f0f733';



// local Geth
/*Config.web3provider_protocol = 'http://';
Config.web3provider_host = 'localhost';
Config.web3provider_port = 8545;
Config.web3provider_network_id = '*' // Match any network id
Config.need_to_unlock_accounts = true; 
Config.wallet_account_challenge = true; 
Config.wallet_account = 'your_test_account';*/

// INFURA
/*Config.web3provider_protocol = 'https://';
Config.web3provider_host = 'rinkeby.infura.io/v3/your_infura_key'
Config.web3provider_port = '';
Config.web3provider_network_id = '*' // Match any network id
Config.need_to_unlock_accounts = true; 
Config.wallet_account_challenge = true; 
Config.wallet_account = 'your_test_account';*/



/********************/
/*   Export         */
/********************/ 
	
	
// export

if ( typeof window !== 'undefined' && window ) // if we are in browser and not node js (e.g. truffle)
window.Config = Config;
else
module.exports = Config; // we are in node js
