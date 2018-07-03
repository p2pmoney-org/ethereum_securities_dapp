'use strict';

var ModuleControllers = class {
	
	constructor(module) {
		this.module = module;
	}
	
	// contracts
	
	// contract
	getContractDeploymentDefaultValues(contract, divcue) {
		var values = [];
		
		if (contract) {
			
			var contractindex = contract.getContractIndex();
			var localdescription = contract.getLocalDescription();
			
			var module = this.module;

			var gaslimit = module.getDefaultGasLimit();
			var gasPrice = module.getDefaultGasPrice();
			
			values['gaslimit'] = gaslimit;
			values['gasprice'] = gasPrice;
			
			var walletaddress = null;
			
			var isLocalOnly = contract.isLocalOnly();
			
			if (module.useWalletAccount()) {
				// do we pay everything from a single wallet
				walletaddress = module.getWalletAccountAddress();
			}
			else {
				// or from the wallet of the owner of the contract
				walletaddress = contract.getLocalOwner();
			}
			
			if (walletaddress) {
				
				values['walletused'] = walletaddress;
				
				if (divcue) {
					// we display the balance in the div passed
					var wallet = module.getAccountObject(walletaddress);
					
					this.writebalance(wallet, divcue);
				}
			}
		}
		
		return values;
	}
	
	// hooks
	loginForm_hook(result, params) {
		console.log('common controllers loginForm_hook called');
		
		var field = [];
		
		field['name'] = 'user';
		field['type'] = 'text';
		
		//result.push(field);
		
		return true;
	}

	// utils
	getEtherStringFromWei(wei, decimal=2) {
		var ether = this.module.getEtherFromwei(wei);
		return ether.toFixed(decimal);
	}
	
	writebalance(wallet, divbalance) {
		console.log('spawning write of getBalance');
		var self = this;
		
		var res = wallet.getChainBalance(function(err, res) {
			if (!err) {
				var global = self.module.global;
				var balancetext = self.getEtherStringFromWei(res);
				
				divbalance.innerHTML = global.t('The account') + ' ' + wallet.getAddress() + ' ' + global.t('has') + ' ' + balancetext + ' ' + global.t('Ether');
			}
			else {
				console.log(err);
			}
		});
	}
}

GlobalClass.registerModuleClass('common', 'Controllers', ModuleControllers);