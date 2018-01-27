Config = require('./app/js/src/config.js');
		
module.exports = {
  networks: {
	    development: {
	      host: Config.getWeb3ProviderHost(), // default 'localhost'
	      port: Config.getWeb3ProviderPort(), // default 9547
	      network_id: Config.getWeb3ProviderNetworkId() // default '*', Match any network id
	    }
	  }
};
