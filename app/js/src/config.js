class Config {
	
	static getWeb3ProviderUrl() {
		if (Config.config_overload_read == false)
			Config.readConfigOverload();
		
		return Config.web3provider_protocol + Config.web3provider_host + ':' + Config.web3provider_port;
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
	
	static getWalletAccountAddress() {
		return Config.wallet_account;
	}
	
	static useWalletAccountChallenge() {
		return Config.wallet_account_challenge;
	}
	
	static needToUnlockAccounts() {
		return Config.need_to_unlock_accounts;
	}
	
};


/*********************/
/*      Web3         */
/********************/ 

Config.web3provider_protocol = 'http://';
Config.web3provider_host = 'localhost';

// default
// Config.web3provider_port = 8545;
//Config.need_to_unlock_accounts = true; // do we need to unlock (e.g. on geth) or pass-through development client (e.g. Ganache)
//Config.wallet_account_challenge = true; 
//Config.wallet_account = '0x0000000000000000000000000000000000000001';


// Ganache
Config.web3provider_port = 9547;
Config.need_to_unlock_accounts = false;
Config.wallet_account_challenge = true;
Config.wallet_account = '0x6330A553Fc93768F612722BB8c2eC78aC90B3bbc';


// Geth
/*Config.web3provider_port = 8545;
Config.need_to_unlock_accounts = true; 
Config.wallet_account_challenge = true; 
Config.wallet_account = '0x00add2103FC5817a61838be0B34A77fB6063fE60';*/


Config.web3provider_network_id = '*' // Match any network id

	
	
/********************/
/*   Export         */
/********************/ 
	
	
// export

if ( typeof window !== 'undefined' && window ) // if we are in browser and not node js (e.g. truffle)
window.Config = Config;
else
module.exports = Config; // we are in node js