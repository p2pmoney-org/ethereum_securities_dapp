'use strict';

var ModuleControllers = class {
	
	constructor(module) {
		this.module = module;
	}

	// session
	getSessionTransferDefaultValues(session, divcue) {
		var values = [];
		
		var ethnodemodule = this.module;
		
		var global = ethnodemodule.global;
		var commonmodule = global.getModuleObject('common');

		var gaslimit = ethnodemodule.getDefaultGasLimit();
		var gasPrice = ethnodemodule.getDefaultGasPrice();
		
		values['gaslimit'] = gaslimit;
		values['gasprice'] = gasPrice;
		
		var walletaddress = null;
		
		if (session) {
			var sessionaccount = session.getMainSessionAccountObject();
			
			if (sessionaccount) {
				walletaddress = sessionaccount.getAddress();
			}
			else {
				if (ethnodemodule.useWalletAccount()) {
					// do we pay everything from a single wallet
					walletaddress = ethnodemodule.getWalletAccountAddress();
				}
				else {
					console.log('not using wallet account');
					console.log('wallet address is ' + ethnodemodule.getWalletAccountAddress());
				}
			}
			
			if (walletaddress) {
				
				values['walletused'] = walletaddress;
				
				if (divcue) {
					// we display the balance in the div passed
					var wallet = commonmodule.getAccountObject(walletaddress);
					
					this.writebalance(wallet, divcue);
				}
			}
		}
	
		
		return values;
	}
	
	getAccountTransferDefaultValues(session, fromaccount, divcue) {
		var values = [];
		
		var ethnodemodule = this.module;
		
		var global = ethnodemodule.global;
		var commonmodule = global.getModuleObject('common');

		var gaslimit = ethnodemodule.getDefaultGasLimit();
		var gasPrice = ethnodemodule.getDefaultGasPrice();
		
		values['gaslimit'] = gaslimit;
		values['gasprice'] = gasPrice;
		
		var walletaddress = null;
		
		if (session) {
			/*var sessionaccount = session.getMainSessionAccountObject();
			
			if (sessionaccount) {
				walletaddress = sessionaccount.getAddress();
			}
			else {
				if (ethnodemodule.useWalletAccount()) {
					// do we pay everything from a single wallet
					walletaddress = ethnodemodule.getWalletAccountAddress();
				}
				else {
					console.log('not using wallet account');
					console.log('wallet address is ' + ethnodemodule.getWalletAccountAddress());
				}
			}*/
			
			// ether transfers does not support "in name of" transactions
			// we necessarily use fromaccount as wallet
			walletaddress = (fromaccount ? fromaccount.getAddress() : null);

			if (walletaddress) {
				
				values['walletused'] = walletaddress;
				
				if (divcue) {
					// we display the balance in the div passed
					var wallet = commonmodule.getAccountObject(walletaddress);
					
					this.writebalance(wallet, divcue);
				}
			}
		}
	
		
		return values;
	}
	// transactions
	getTransactionObjectFromUUID(session, transactionuuid, callback) {
		var ethnodemodule = this.module;
		
		var global = ethnodemodule.global;
		var commonmodule = global.getModuleObject('common');


		ethnodemodule.getTransactionList(function(err, transactionarray) {
			var transaction = null;
			
			if (transactionarray) {
				
				for (var i = 0; i < transactionarray.length; i++) {
					var tx = transactionarray[i];
					
					if (tx && (tx.getTransactionUUID() == transactionuuid)) {
						transaction = tx;
						
						break;
					}
				}
				
			}
			
			
			if (callback)
				callback((transaction ? null : 'could not find transaction with uuid ' + transactionuuid), transaction);
		});
	}
	
	
	// contracts
	
	// deployment
	getContractDeploymentDefaultValues(contract, divcue) {
		var values = [];
		
		if (contract) {
			
			var contractindex = contract.getContractIndex();
			var localdescription = contract.getLocalDescription();
			
			var ethnodemodule = this.module;
			
			var global = ethnodemodule.global;
			var commonmodule = global.getModuleObject('common');

			var gaslimit = ethnodemodule.getDefaultGasLimit();
			var gasPrice = ethnodemodule.getDefaultGasPrice();
			
			values['gaslimit'] = gaslimit;
			values['gasprice'] = gasPrice;
			
			var walletaddress = null;
			
			var isLocalOnly = contract.isLocalOnly();
			
			if (ethnodemodule.useWalletAccount()) {
				// do we pay everything from a single wallet
				walletaddress = ethnodemodule.getWalletAccountAddress();
			}
			else {
				// or from the wallet of the owner of the contract
				walletaddress = contract.getLocalOwner();
			}
			
			if (walletaddress) {
				
				values['walletused'] = walletaddress;
				
				if (divcue) {
					// we display the balance in the div passed
					var wallet = commonmodule.getAccountObject(walletaddress);
					
					this.writebalance(wallet, divcue);
				}
			}
		}
		
		return values;
	}

	// utils
	getEtherStringFromWei(wei, decimal=2) {
		var ether = this.module.getEtherFromwei(wei);
		return ether.toFixed(decimal);
	}
	
	writebalance(wallet, divbalance) {
		console.log('spawning write of getBalance');
		var self = this;
		var ethnodemodule = this.module;
		
		divbalance.currentwalletaddress = wallet.getAddress();
		
		var res = ethnodemodule.getChainAccountBalance(wallet, function(err, res) {
			if (!err) {
				if (divbalance.currentwalletaddress.toLowerCase()  == wallet.getAddress().toLowerCase()) {
					// we write the balance, if indeed we are the current wallet selected for the div
					var global = self.module.global;
					var balancetext = self.getEtherStringFromWei(res);
					
					console.log('writebalance ether balance is ' + balancetext);
					divbalance.innerHTML = global.t('The account') + ' ' + wallet.getAddress() + ' ' + global.t('has') + ' ' + balancetext + ' ' + global.t('Ether');
				}
			}
			else {
				console.log(err);
			}
		});
	}
}

GlobalClass.registerModuleClass('ethnode', 'Controllers', ModuleControllers);