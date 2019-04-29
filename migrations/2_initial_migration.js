

module.exports = function(deployer) {
	
	//
	// data
	//
	
	var owner_identifier = 'John Lennon';
	var owner_address = '0xf17f52151EbEF6C7334FAD080c5704D77216b732';
	var owner_aes_pubkey = '0xce7edc292d7b747fab2f23584bbafaffde5c8ff17cf689969614441e0527b90015ea9fee96aed6d9c0fc2fbe0bd1883dee223b3200246ff1e21976bdbc9a0fc8';
	var owner_rsa_pubkey = '0x02ce7edc292d7b747fab2f23584bbafaffde5c8ff17cf689969614441e0527b900';
	var owner_privkey = '0xae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f';
	
	// wallet
	var wallet_address = '0x627306090abaB3A6e1400e9345bC60c78a8BEf57';
	var wallet_password = '';
	
	var gaslimit = 4712388;
	var gasPrice = 100000000000;

	
	// contract 1
	var ledger_name1 = 'Share Register';
	var ledger_description1 = 'Strawberry fields llc';
	
	//var cocrypted_shldr_identifier1 = '29b88a823769';
	var cocrypted_shldr_identifier1 = '0x2ebe8e80126a096c59c1a7d7f6';
	var cocrypted_ledger_description1 = '0x17a5948f25650d774796e4def2fa6f6ebdaa204710';
	
	var shareholders1 = [ 'joe@mail.com', 'helene@mail.com', 'richard@example.com', 'meredith@example.com'];

	// contract 2
	var ledger_name2 = 'Stock Ledger';
	var ledger_description2 = 'Sergent Pepper Co';

	//var cocrypted_shldr_identifier2 = '29b88a823769';
	var cocrypted_shldr_identifier2 = '0x2ebe8e80126a096c59c1a7d7f6';
	var cocrypted_ledger_description2 = '0x17b4948937691c25658ab4c8feed2349a1';

	//0xae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f
	// Truffle deployer
	//
	
	var StockLedger = artifacts.require("StockLedger");
	deployer.deploy(StockLedger, owner_address, owner_rsa_pubkey, cocrypted_shldr_identifier1, ledger_name1, cocrypted_ledger_description1);
	deployer.deploy(StockLedger, owner_address, owner_rsa_pubkey, cocrypted_shldr_identifier2, ledger_name2, cocrypted_ledger_description2);

	
	//
	// ethereum_securities model
	//
/*
	var Global = require('../app/js/src/global.js');
	var Session = require('../app/js/src/model/session.js');
	
	var global = new Global(null);
	var session = global.getSessionObject();
	
	// paying account
	var payingaccount = global.getAccountObject(wallet_address);
	
	// unlock account
	payingaccount.unlock(wallet_password, 300); 
	
	// owning account
	var owningaccount = global.getAccountObject(owner_address);

	owningaccount.setPrivateKey(owner_privkey);
	
	session.impersonateAccount(owningaccount);
	
	// creation of contract objects
	var contracts = global.getModuleObject('ethnode').getContractsObject();
	var promises = [];
	var promise;
	var i;
	var stakeholder;
	var shldrprivkey;
	var account;
	
	// contract1

	// we create a blank stockledger object
	var contract1 = contracts.createBlankContractObject('StockLedger');

	// set parameters
	contract1.setLocalOwner(owner_address);
	contract1.setLocalOwnerIdentifier(owner_identifier);
	contract1.setLocalLedgerName(ledger_name1);
	contract1.setLocalLedgerDescription(ledger_description1);
	
	// deploy
	promise = contract1.deploy(payingaccount, owningaccount, gaslimit, gasPrice);
	promises.push(promise);
	
	promise = promise.then(function() {
		return contract1.finalizeInit(function() {
			console.log('truffle-migrate: initialization finalised');
		})
	})
	
	promise = promise.then(function() {
		// create shareholders
		for (i = 0; i < shareholders1.length; i++) {
			stakeholder = global.createBlankStakeHolderObject();
			
			console.log('truffle-migrate: creating shareholder ' + shareholders1[i]);
			stakeholder.setLocalIdentifier(shareholders1[i]);
			
			contract1.addLocalStakeHolder(stakeholder);	
			
			shldrprivkey = session.generatePrivateKey();
			
			account = session.getAccountObjectFromPrivateKey(shldrprivkey);
			stakeholder.setLocalPrivKey(account.getPrivateKey());
			stakeholder.setAddress(account.getAddress());
			stakeholder.setChainPubKey(account.getRsaPublicKey());
			
			promise = contract1.registerStakeHolder(payingaccount, gaslimit, gasPrice, stakeholder);
			promises.push(promise);
		}
		
	});
	promises.push(promise);
	
	
	// contract 2
	var contract2 = contracts.createBlankContractObject('StockLedger');

	contract2.setLocalOwner(owner_address);
	contract2.setLocalOwnerIdentifier(owner_identifier);
	contract2.setLocalLedgerName(ledger_name2);
	contract2.setLocalLedgerDescription(ledger_description2);
	
	promise = contract2.deploy(payingaccount, owningaccount, gaslimit, gasPrice);
	promises.push(promise);
	
	// wait for all the promises to resolve
	Promise.all(promises).then(function(arr) {
		console.log('truffle-migrate: returning from all promises' + arr);
		console.log('-----');
		console.log('-----');
		console.log('truffle-migrate: Contract successfully deployed at ' + contract1.getAddress());
		console.log('truffle-migrate: Contract successfully deployed at ' + contract2.getAddress());
	});
*/	
};