'use strict';

class Views {
	
	constructor(global) {
		this.global = global;
	}
	
	//
	// Contracts
	//
	
	writeContractListLine(tr, linenumber, contract, handler_goto_contract_page, handler_remove_contract_from_list) {

		var address = contract.getAddress();
		var contracttype = contract.getContractType();
		var localdescription = contract.getLocalDescription();
		var owner = contract.getLocalOwner();
		var owneridentifier = contract.getLocalOwnerIdentifier();
		
		var td;
		var text;
		var link;
		
		// set line class
		if (contract.isLocalOnly()) {
			if (linenumber % 2 == 0)
				tr.classList.add('table-contract-list-tr-local-even');
			else
				tr.classList.add('table-contract-list-tr-local-odd');
		}
		else {
			if (linenumber % 2 == 0)
				tr.classList.add('table-contract-list-tr-chain-even');
			else
				tr.classList.add('table-contract-list-tr-chain-odd');
		}

		// local info
		
		// local description
	    td = document.createElement('td');
	    var params = [contract.getContractIndex()];
	    link = Views.createLink(localdescription,'contract at address ' + address, "lnk-contract_page", params);
	    link.onclick = handler_goto_contract_page;
		td.appendChild(link);
	    tr.appendChild(td);
	    
		// contracttype
		td = document.createElement('td');
		text = document.createTextNode(contracttype);
		td.appendChild(text);
	    tr.appendChild(td);
	    
		// contract address
		td = document.createElement('td');
		text = document.createTextNode((address ? address.toLowerCase() : 'local'));
		td.appendChild(text);
	    tr.appendChild(td);
	    
		// owner address
		td = document.createElement('td');
		text = document.createTextNode((owner ? owner.toLowerCase() : '-'));
		td.appendChild(text);
	    tr.appendChild(td);
	    
		// owner identifier
		td = document.createElement('td');
		text = document.createTextNode((owneridentifier ? owneridentifier : '-'));
		td.appendChild(text);
	    tr.appendChild(td);
	    
		// action
	    td = document.createElement('td');
	    var params = [contract.getContractIndex()];
	    link = Views.createLink('remove from list','remove contract from list, destroy if only local', "lnk-remove_contract", params);
	    link.onclick = handler_remove_contract_from_list;
		td.appendChild(link);
		td.classList.add('table-contract-list-action-td');
	    tr.appendChild(td);
		
	}
	
	writeContractListLines(contractarray, table, handler_goto_contract_page, handler_remove_contract_from_list) {
		if (!contractarray)
			return;
		
		// in reverse order to have most recent on top
	    for (var i = contractarray.length -1 ; i >= 0; i--) {
			var contract = contractarray[i];
			
			var tr = document.createElement('tr'); 

			this.writeContractListLine(tr, i, contract, handler_goto_contract_page, handler_remove_contract_from_list);

		    table.appendChild(tr);				
		}
		
	}
	
	displayContractList(contracts) {
		var app = this.global.getAppObject();

		var viewcontainer = document.createElement("div");
		viewcontainer.classList.add('div-view-container');
		
		// potential tabs
		
		// core of the view
		var view = document.createElement("div");
		view.classList.add('div-view');
		
		if (contracts) {
			var contractarray = contracts.getContractObjects();
			
			// top right refesh link
			var refreshdiv = document.createElement('div');
			refreshdiv.classList.add('div-refresh-list');
			
			var refreshlink = Views.createLink("Refresh list", "Refresh list", "lnk-refresh_list");
			
			refreshdiv.appendChild(refreshlink);			
			viewcontainer.appendChild(refreshdiv);			
			
			var controllers = this.global.getControllersObject();
			
			var handler_goto_contract_page = controllers.handleGotoContractPage;
			var handler_remove_contract_from_list = controllers.handleRemoveContractFromList;
			
			// add view to container after refresh div
			viewcontainer.appendChild(view);
			
			// event handler
			var handler_refresh_list = controllers.handleRefreshContractList;

			refreshlink.onclick = handler_refresh_list;
			
			
			
			
			// list of contracts

			if (contractarray) {
				var table = document.createElement("table");
			    table.classList.add('table-contract-list');
			    
				var tr = document.createElement('tr'); 
				var td;
				var text;
				var link;

				// heading
			    tr = document.createElement('tr');
			    
			    td = document.createElement('td');
			    text = document.createTextNode('description');
			    td.appendChild(text);
			    tr.appendChild(td);
			    
			    td = document.createElement('td');
			    text = document.createTextNode('contract type');
			    td.appendChild(text);
			    tr.appendChild(td);
			    
			    td = document.createElement('td');
			    text = document.createTextNode('contract address');
			    td.appendChild(text);
			    tr.appendChild(td);
			    
			    td = document.createElement('td');
			    text = document.createTextNode('owner address');
			    td.appendChild(text);
			    tr.appendChild(td);
			    
			    td = document.createElement('td');
			    text = document.createTextNode('owner identifier');
			    td.appendChild(text);
			    tr.appendChild(td);
			    
			    td = document.createElement('td');
			    text = document.createTextNode(''); // action column
			    td.appendChild(text);
			    tr.appendChild(td);
			    
			    table.appendChild(tr);
			    
				
				// show local contracts first 
			    var localcontractarray = contracts.getLocalOnlyContractObjects();
			    
			    this.writeContractListLines(localcontractarray, table, handler_goto_contract_page, handler_remove_contract_from_list);
				
				// then deployed contracts 
			    var chaincontractarray = contracts.getChainContractObjects();
			    
			    this.writeContractListLines(chaincontractarray, table, handler_goto_contract_page, handler_remove_contract_from_list);
				
				view.appendChild(table);
				
			}
		}
		
		app.addView(viewcontainer);		
	}
	
	displayContract(contract) {
		var app = this.global.getAppObject();

		var viewcontainer = document.createElement("div");
		viewcontainer.classList.add('div-view-container');
		
		// potential tabs
		
		// core of the view
		var view = document.createElement("div");
		view.classList.add('div-view');
		
		viewcontainer.appendChild(view);

		if (contract) {
			var session = this.global.getSessionObject();
			var controllers = this.global.getControllersObject();
			
			var address = contract.getAddress();
			var localdescription = contract.getLocalDescription();
			var localowner = contract.getLocalOwner();
			var localowneridentifier = contract.getLocalOwnerIdentifier();
			
			var localowneraccount = session.getAccountObject(localowner);
			
			var contractindex = contract.getContractIndex();
			
			// turn to lower case to look nicer
			address = (address ? address.toLowerCase() : null);
			localowner = (localowner ? localowner.toLowerCase() : null);
			
			var table = document.createElement("table");
		    table.classList.add('table-contract');

			view.appendChild(table);

			var tr;   
			var td;   
		    var text;
		    var link;
		    
		    // heading
		    
		    //
		    // local data
		    //

		    // description
		    tr = document.createElement('tr');
		    tr.classList.add('tr-local');
		    table.appendChild(tr);
		    
		    td = document.createElement('td');
		    td.classList.add('td-label');
		    text = document.createTextNode('Description is:');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    td.classList.add('td-value');
		    text =  document.createTextNode(localdescription);
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    // contract address
		    tr = document.createElement('tr');
		    tr.classList.add('tr-local');
		    table.appendChild(tr);
		    
		    td = document.createElement('td');
		    td.classList.add('td-label');
		    text = document.createTextNode('Contract address is:');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    td.classList.add('td-value');
		    text =  document.createTextNode((contract.isLocalOnly() == false ? address : 'local only'));
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    // owner address
		    tr = document.createElement('tr');
		    tr.classList.add('tr-local');
		    table.appendChild(tr);
		    
		    td = document.createElement('td');
		    td.classList.add('td-label');
		    text = document.createTextNode('Owner address is:');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    td.classList.add('td-value');
		    text =  document.createTextNode((localowner ? localowner : ''));
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    // owner identifier
		    tr = document.createElement('tr');
		    tr.classList.add('tr-local');
		    table.appendChild(tr);
		    
		    td = document.createElement('td');
		    td.classList.add('td-label');
		    text = document.createTextNode('Owner identifier is:');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    td.classList.add('td-value');
		    text =  document.createTextNode((localowneridentifier ? localowneridentifier : ''));
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    //
		    // chain data
		    //

		    // ledger name
		    tr = document.createElement('tr');
		    tr.classList.add('tr-chain');
		    table.appendChild(tr);
		    
		    td = document.createElement('td');
		    td.classList.add('td-label');
		    text = document.createTextNode('Ledger name is:');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    td.classList.add('td-value');
		    text =  document.createTextNode("loading...");
		    td.appendChild(text);
		    tr.appendChild(td);
		    

		    var writeledgername = function (contract, text) {
				return contract.getChainLedgerName(function(err, res) {
					if (res) text.nodeValue = res;
					
					if (err) text.nodeValue = 'not found';
				})
			};

			if (contract.isLocalOnly() == false)
				writeledgername(contract, text);
			else
				text.nodeValue = 'not deployed yet';
			
		    // ledger description
		    tr = document.createElement('tr');
		    tr.classList.add('tr-chain');
		    table.appendChild(tr);
		    
		    td = document.createElement('td');
		    td.classList.add('td-label');
		    text = document.createTextNode('Ledger description is:');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    td.classList.add('td-value');
		    text =  document.createTextNode("loading...");
		    td.appendChild(text);
		    tr.appendChild(td);
		    
			var writeledgerdescription = function (contract, text) {
				return contract.getChainLedgerDescription(function(err, res) {
					if (res) {
						if (session.isAnonymous()) {
							text.nodeValue = res;
						}
						else {
							if (session.isSessionAccountAddress(localowner)) {
								text.nodeValue = localowneraccount.aesDecryptString(res);
							}
							else {
								text.nodeValue = res;
							}
						}
					}
					
					if (err) text.nodeValue = 'not found';
				})
			};

			if (contract.isLocalOnly() == false)
				writeledgerdescription(contract, text);
			else
				text.nodeValue = 'not deployed yet';
			
		    // account count
		    tr = document.createElement('tr');
		    tr.classList.add('tr-chain');
		    table.appendChild(tr);
		    
		    td = document.createElement('td');
		    td.classList.add('td-label');
		    text = document.createTextNode('Number of accounts registered:');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    td.classList.add('td-value');
		    
			var handler_goto_account_list_page = controllers.handleGotoAccountListPage;
		    var params = [contractindex];
		    link = Views.createLink("loading...",'contract at address ' + address, "lnk-acct_list_page", params);
		    link.onclick = handler_goto_account_list_page;
			
		    td.appendChild(link);
		    tr.appendChild(td);
		    
			var writeaccountcount = function (contract, link) {
				return contract.getChainAccountCount(function(err, res) {
					if (res) Views.changeLinkText(link, res);
					
					if (err) Views.changeLinkText(link, 'not found');
				})
			};

			if (contract.isLocalOnly() == false)
				writeaccountcount(contract, link);
			else
				Views.changeLinkText(link, 'not deployed yet');
		
		
		    // shareholder count
		    tr = document.createElement('tr');
		    tr.classList.add('tr-chain');
		    table.appendChild(tr);
		    
		    td = document.createElement('td');
		    td.classList.add('td-label');
		    text = document.createTextNode('Number of shareholders registered:');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    td.classList.add('td-value');
		    
			var handler_goto_shareholder_list_page = controllers.handleGotoStakeHolderListPage;
		    var params = [contractindex];
		    link = Views.createLink("loading...",'contract at address ' + address, "lnk-shldr_list_page", params);
		    link.onclick = handler_goto_shareholder_list_page;
			
		    td.appendChild(link);
		    tr.appendChild(td);
		    
			var writeshareholdercount = function (contract, link) {
				return contract.getChainStakeHolderCount(function(err, res) {
					if (res) Views.changeLinkText(link, res);
					
					if (err) Views.changeLinkText(link, 'not found');
				})
			};

			if (contract.isLocalOnly() == false)
				writeshareholdercount(contract, link);
			else
				Views.changeLinkText(link, 'not deployed yet');
		
		
		    // issuance count
		    tr = document.createElement('tr');
		    tr.classList.add('tr-chain');
		    table.appendChild(tr);
		    
		    td = document.createElement('td');
		    td.classList.add('td-label');
		    text = document.createTextNode('Number of issuances:');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    td.classList.add('td-value');
		    
			var handler_goto_issuance_list_page = controllers.handleGotoIssuanceListPage;
		    var params = [contractindex];
		    link = Views.createLink("loading...",'contract at address ' + address, "lnk-issuance_list_page", params);
		    link.onclick = handler_goto_issuance_list_page;
			
		    td.appendChild(link);
		    tr.appendChild(td);
		    
			var writeissuancecount = function (contract, link) {
				return contract.getChainIssuanceCount(function(err, res) {
					if (res) Views.changeLinkText(link, res);
					
					if (err) Views.changeLinkText(link, 'not found');
				})
			};

			if (contract.isLocalOnly() == false)
				writeissuancecount(contract, link);
			else
				Views.changeLinkText(link, 'not deployed yet');
		
		    // transaction count
		    tr = document.createElement('tr');
		    tr.classList.add('tr-chain');
		    table.appendChild(tr);
		    
		    td = document.createElement('td');
		    td.classList.add('td-label');
		    text = document.createTextNode('Number of transactions registered:');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    td.classList.add('td-value');
		    
			var handler_goto_transaction_list_page = controllers.handleGotoTransactionListPage;
		    var params = [contractindex];
		    link = Views.createLink("loading...",'contract at address ' + address, "lnk-transaction_list_page", params);
		    link.onclick = handler_goto_transaction_list_page;
			
		    td.appendChild(link);
		    tr.appendChild(td);
		    
			var writetransactioncount = function (contract, link) {
				return contract.getChainTransactionCount(function(err, res) {
					if (res) Views.changeLinkText(link, res);
					
					if (err) Views.changeLinkText(link, 'not found');
				})
			};

			if (contract.isLocalOnly() == false)
				writetransactioncount(contract, link);
			else
				Views.changeLinkText(link, 'not deployed yet');
		
		    // chain owner
		    tr = document.createElement('tr');
		    tr.classList.add('tr-chain');
		    table.appendChild(tr);
		    
		    td = document.createElement('td');
		    td.classList.add('td-label');
		    text = document.createTextNode('Owner is:');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    td.classList.add('td-value');
		    text =  document.createTextNode("loading...");
		    td.appendChild(text);
		    tr.appendChild(td);
		    
			var writeowner = function (contract, text) {
				return contract.getChainOwner(function(err, res) {
					if (res) {
						if (session.isAnonymous()) {
							text.nodeValue = res;
						}
						else {
							if (session.isSessionAccountAddress(res)) {
								text.nodeValue = 'You';
							}
							else {
								text.nodeValue = res;
							}
						}
						
					}
					
					if (err) text.nodeValue = 'not found';
				})
			};

			if (contract.isLocalOnly() == false)
				writeowner(contract, text);
			else
				text.nodeValue = 'not deployed yet';
			
		    // chain owner public key
		    tr = document.createElement('tr');
		    tr.classList.add('tr-chain');
		    table.appendChild(tr);
		    
		    td = document.createElement('td');
		    td.classList.add('td-label');
		    text = document.createTextNode('Owner public key (rsa) is:');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    td.classList.add('td-value');
		    text =  document.createTextNode("loading...");
		    td.appendChild(text);
		    tr.appendChild(td);
		    
			var writeownerpublickey = function (contract, text) {
				return contract.getChainOwnerPublicKey(function(err, res) {
					if (res) text.nodeValue = Views.showCondensedPublicKey(res);
					
					if (err) text.nodeValue = 'not found';
				})
			};

			if (contract.isLocalOnly() == false)
				writeownerpublickey(contract, text);
			else
				text.nodeValue = 'not deployed yet';
			
		    // contract name
		    tr = document.createElement('tr');
		    tr.classList.add('tr-chain');
		    table.appendChild(tr);
		    
		    td = document.createElement('td');
		    td.classList.add('td-label');
		    text = document.createTextNode('Contract object name is:');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    td.classList.add('td-value');
		    text =  document.createTextNode("loading...");
		    td.appendChild(text);
		    tr.appendChild(td);
		    
			var writecontractname = function (contract, text) {
				return contract.getChainContractName(function(err, res) {
					if (res) text.nodeValue = res;
					
					if (err) text.nodeValue = 'not found';
				})
			};

			if (contract.isLocalOnly() == false)
				writecontractname(contract, text);
			else
				text.nodeValue = 'not deployed yet';
			
			
		    // contract version
		    tr = document.createElement('tr');
		    tr.classList.add('tr-chain');
		    table.appendChild(tr);
		    
		    td = document.createElement('td');
		    td.classList.add('td-label');
		    text = document.createTextNode('Contract version is:');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    td.classList.add('td-value');
		    text =  document.createTextNode("loading...");
		    td.appendChild(text);
		    tr.appendChild(td);
		    
			var writecontractversion = function (contract, text) {
				return contract.getChainContractVersion(function(err, res) {
					if (res) text.nodeValue = res;
					
					if (err) text.nodeValue = 'not found';
				})
			};

			if (contract.isLocalOnly() == false)
				writecontractversion(contract, text);
			else
				text.nodeValue = 'not deployed yet';
		
		
		}
	
		app.addView(viewcontainer);		
	}
	
	//
	// Accounts
	//
	writeContractAccountLines(table, contract, accountarray) {
		if (!accountarray)
			return;
		
		var session = this.global.getSessionObject();
		
		// in reverse order to have most recent on top
		var tr;   
		var td;   
	    var text;
	    var link;
	    var linenumber = 1;

	    for (var i = accountarray.length -1 ; i >= 0; i--) {
	    	console.log('writing line ' + i);
			var account = accountarray[i];
			var ownsContract = session.ownsContract(contract);
			
			var accountaddress = account.getAddress();
			var isYou = session.isSessionAccountAddress(accountaddress)
			
			tr = document.createElement('tr'); 

			// set line class
			if (linenumber % 2 == 0)
				tr.classList.add('table-stakeholder-list-tr-chain-even');
			else
				tr.classList.add('table-stakeholder-list-tr-chain-odd');
			
			var chainaddress = (isYou ? 'You' : accountaddress);
			
		    td = document.createElement('td');
			text = document.createTextNode(account.getAddress());
			td.appendChild(text);
		    tr.appendChild(td);

		    td = document.createElement('td');
			text = document.createTextNode(Views.showCondensedPublicKey(account.getAesPublicKey()));
			td.appendChild(text);
		    tr.appendChild(td);

		    td = document.createElement('td');
			text = document.createTextNode(Views.showCondensedPublicKey(account.getRsaPublicKey()));
			td.appendChild(text);
		    tr.appendChild(td);

		    tr.appendChild(td);

		    table.appendChild(tr);	
		    
		    linenumber++;
		}
		
	}
	
	displayContractAccounts(contract){
		var app = this.global.getAppObject();
		
		var self = this;

		var viewcontainer = document.createElement("div");
		viewcontainer.classList.add('div-view-container');
		
		// potential tabs
		
		// core of the view
		var view = document.createElement("div");
		view.classList.add('div-view');
		
		viewcontainer.appendChild(view);

		if (contract) {
			var controllers = this.global.getControllersObject();
			var table = document.createElement("table");
		    table.classList.add('table-account-list');
		    
		    view.appendChild(table);
			
			var tr = document.createElement('tr'); 
			var td;
			var text;
			var link;

			// heading
		    tr = document.createElement('tr');
		    
		    td = document.createElement('td');
		    text = document.createTextNode('Address');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    text = document.createTextNode('Public Key (ece)');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    text = document.createTextNode('Public Key (rsa)');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    table.appendChild(tr);
		    
			// lists


		    
		    // writing 1 line with waiting
		    tr = document.createElement('tr');
		    tr.classList.add('table-account-list-tr-chain-odd');
		    
		    td = document.createElement('td');
		    text = document.createTextNode('waiting...');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    text = document.createTextNode('waiting...');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    
		    td = document.createElement('td');
		    text = document.createTextNode('waiting...');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    

		    table.appendChild(tr);
		    
		    // chain accounts
		    var writelist = function (contract, table) {
				return contract.getChainAccountList(function(err, res) {
					console.log('call back from getChainAccountList, res is ' + res);
					if (res) {
						console.log('list is returned with ' + res.length + ' elements');
						
						Views.clearTable(table, 1);
						
						self.writeContractAccountLines(table, contract, res);
					}
					
					if (err) console.log('error: ' + err);
				});
			};
			
			contract.getChainAccountCount(function(err, res) {
				var count = res;
				console.log('writing ' + count + ' lines with loading');
				
				Views.clearTable(table, 1);
				
				for (var i = 0; i < count; i++) {
				    // loading
				    tr = document.createElement('tr');
				    
					if ((i +1) % 2 == 0)
						tr.classList.add('table-account-list-tr-chain-even');
					else
						tr.classList.add('table-account-list-tr-chain-odd');
					
				    td = document.createElement('td');
				    text = document.createTextNode('loading...');
				    td.appendChild(text);
				    tr.appendChild(td);
				    
				    td = document.createElement('td');
				    text = document.createTextNode('loading...');
				    td.appendChild(text);
				    tr.appendChild(td);
				    
				    td = document.createElement('td');
				    text = document.createTextNode('loading...');
				    td.appendChild(text);
				    tr.appendChild(td);
				    

				    table.appendChild(tr);

				}
				
				return count;
			}).then(function(res) {
				console.log('got the count of ' + res + ' and dummy lines created');
				console.log('asking now for the list of accounts, then writing the lines');
				
				writelist(contract, table);
			});
			

			
			
		}
	
		app.addView(viewcontainer);		
	}
		
	
	//
	// StakeHolders
	//
	
	writeContractStakeHolderLines(table, contract, stakeholderarray, handler_goto_stakeholder_page, handler_remove_stakeholder_from_list) {
		if (!stakeholderarray)
			return;
		
		var session = this.global.getSessionObject();
		
		// in reverse order to have most recent on top
		var tr;   
		var td;   
	    var text;
	    var link;
	    var linenumber = 1;

	    for (var i = stakeholderarray.length -1 ; i >= 0; i--) {
	    	console.log('writing line ' + i);
			var stakeholder = stakeholderarray[i];
			var isLocalOnly = stakeholder.isLocalOnly();
			var ownsContract = session.ownsContract(contract);
			
			var stakeholderaddress = stakeholder.getAddress();
			var isYou = session.isSessionAccountAddress(stakeholderaddress)
			
			tr = document.createElement('tr'); 

			// set line class
			if (isLocalOnly) {
				if (linenumber % 2 == 0)
					tr.classList.add('table-stakeholder-list-tr-local-even');
				else
					tr.classList.add('table-stakeholder-list-tr-local-odd');
			}
			else {
				if (linenumber % 2 == 0)
					tr.classList.add('table-stakeholder-list-tr-chain-even');
				else
					tr.classList.add('table-stakeholder-list-tr-chain-odd');
			}
			
			var chainidentifier = (isLocalOnly ? null : stakeholder.getChainCocryptedIdentifier());
			var chainidentifierdisplay = (isLocalOnly ? 'local' : (isYou ? 'You' : ( ownsContract ? session.decryptContractStakeHolderIdentifier(contract, stakeholder) : 'crypted')));
			
		    td = document.createElement('td');
			text = (isLocalOnly ? stakeholder.getLocalIdentifier() : chainidentifierdisplay);
		    var params = [contract.getContractIndex(), stakeholder.getStakeHolderIndex()];
		    link = Views.createLink(text,'StakeHolder from contract', "lnk-stakeholder_page", params);
		    link.onclick = handler_goto_stakeholder_page;
			td.appendChild(link);
		    tr.appendChild(td);

		    td = document.createElement('td');
			text = document.createTextNode((isLocalOnly ? 'local' : stakeholder.getAddress()));
			td.appendChild(text);
		    tr.appendChild(td);

		    td = document.createElement('td');
			text = document.createTextNode((isLocalOnly ? 'local' : Views.showCondensedPublicKey(stakeholder.getChainRsaPubKey())));
			td.appendChild(text);
		    tr.appendChild(td);

		    td = document.createElement('td');
			text = document.createTextNode((isLocalOnly ? 'local' : Views.showCondensedCryptedText(stakeholder.getChainCocryptedPrivKey())));
			td.appendChild(text);
		    tr.appendChild(td);

		    td = document.createElement('td');
			text = document.createTextNode((isLocalOnly ? 'local' : Views.showCondensedCryptedText(stakeholder.getChainCocryptedIdentifier())));
			td.appendChild(text);
		    tr.appendChild(td);

			// action
		    td = document.createElement('td');
		    var params = [contract.getContractIndex(), stakeholder.getStakeHolderIndex()];
		    
		    if (isLocalOnly) {
			    link = Views.createLink('remove from list','remove stakeholder from list', "lnk-remove_stakeholder", params);
			    link.onclick = handler_remove_stakeholder_from_list;
			    td.appendChild(link);
	    	
		    }
		    
			td.classList.add('table-stakeholder-list-action-td');
		    tr.appendChild(td);

		    table.appendChild(tr);	
		    
		    linenumber++;
		}
		
	}
	
	displayContractStakeHolders(contract){
		var app = this.global.getAppObject();
		
		var self = this;

		var viewcontainer = document.createElement("div");
		viewcontainer.classList.add('div-view-container');
		
		// potential tabs
		
		// core of the view
		var view = document.createElement("div");
		view.classList.add('div-view');
		
		viewcontainer.appendChild(view);

		if (contract) {
			var controllers = this.global.getControllersObject();
			var table = document.createElement("table");
		    table.classList.add('table-stakeholder-list');
		    
		    view.appendChild(table);
			
			var tr = document.createElement('tr'); 
			var td;
			var text;
			var link;

			// heading
		    tr = document.createElement('tr');
		    
		    td = document.createElement('td');
		    text = document.createTextNode('Identifier');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    text = document.createTextNode('Address');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    text = document.createTextNode('Public Key (rsa)');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    text = document.createTextNode('Private Key (crypted)');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    text = document.createTextNode('Identifier (crypted)');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    // action
		    td = document.createElement('td');
		    text = document.createTextNode('');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    table.appendChild(tr);
		    
			// lists
		    var handler_goto_stakeholder_page = controllers.handleGotoStakeHolderPage;
			var handler_remove_stakeholder_from_list = controllers.handleRemoveStakeHolderFromList;


		    // local stakeholder
		    var locallist = contract.getLocalStakeHolders();
		    var locallistlength = (locallist ? locallist.length : 0);
		    console.log('local list has ' + locallistlength + ' elements.');
		    
		    this.writeContractStakeHolderLines(table, contract, locallist, handler_goto_stakeholder_page, handler_remove_stakeholder_from_list);
		    
		    // writing 1 line after that with waiting
		    tr = document.createElement('tr');
		    tr.classList.add('table-stakeholder-list-tr-chain-odd');
		    
		    td = document.createElement('td');
		    text = document.createTextNode('waiting...');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    text = document.createTextNode('waiting...');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    
		    td = document.createElement('td');
		    text = document.createTextNode('waiting...');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    
		    td = document.createElement('td');
		    text = document.createTextNode('waiting...');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    text = document.createTextNode('waiting...');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    // action
		    td = document.createElement('td');
		    text = document.createTextNode('');
		    td.appendChild(text);
		    tr.appendChild(td);

		    table.appendChild(tr);
		    
		    // chain stakeholders
		    var writelist = function (contract, table) {
				return contract.getChainStakeHolderList(function(err, res) {
					if (res) {
						console.log('list is returned with ' + res.length + ' elements');
						
						Views.clearTable(table, locallistlength + 1);
						
						self.writeContractStakeHolderLines(table, contract, res, handler_goto_stakeholder_page, handler_remove_stakeholder_from_list);
					}
					
					if (err) console.log('error: ' + err);
				});
			};
			
			contract.getChainStakeHolderCount(function(err, res) {
				var count = res;
				console.log('writing ' + count + ' lines with loading');
				
				Views.clearTable(table, locallistlength + 1);
				
				for (var i = 0; i < count; i++) {
				    // loading
				    tr = document.createElement('tr');
				    
					if ((i +1) % 2 == 0)
						tr.classList.add('table-stakeholder-list-tr-chain-even');
					else
						tr.classList.add('table-stakeholder-list-tr-chain-odd');
					
				    td = document.createElement('td');
				    text = document.createTextNode('loading...');
				    td.appendChild(text);
				    tr.appendChild(td);
				    
				    td = document.createElement('td');
				    text = document.createTextNode('loading...');
				    td.appendChild(text);
				    tr.appendChild(td);
				    
				    td = document.createElement('td');
				    text = document.createTextNode('loading...');
				    td.appendChild(text);
				    tr.appendChild(td);
				    
				    td = document.createElement('td');
				    text = document.createTextNode('loading...');
				    td.appendChild(text);
				    tr.appendChild(td);
				    
				    td = document.createElement('td');
				    text = document.createTextNode('loading...');
				    td.appendChild(text);
				    tr.appendChild(td);
				    
				    
				    // action
				    td = document.createElement('td');
				    text = document.createTextNode('');
				    td.appendChild(text);
				    tr.appendChild(td);

				    table.appendChild(tr);

				}
				
				return count;
			}).then(function(res) {
				console.log('got the count of ' + res + ' and dummy lines created');
				console.log('asking now for the list of stakeholders, then writing the lines');
				
				writelist(contract, table);
			});
			

			
			
		}
	
		app.addView(viewcontainer);		
	}
		
	displayContractStakeHolder(contract, stakeholder){
		var app = this.global.getAppObject();
		
		var self = this;

		var viewcontainer = document.createElement("div");
		viewcontainer.classList.add('div-view-container');
		
		// potential tabs
		
		// core of the view
		var view = document.createElement("div");
		view.classList.add('div-view');
		
		viewcontainer.appendChild(view);

		if ((contract) && (stakeholder)){
			var session = this.global.getSessionObject();
			var controllers = this.global.getControllersObject();
			
			
			var table = document.createElement("table");
		    table.classList.add('table-stakeholder');

			view.appendChild(table);

			var tr;   
			var td;   
		    var text;
		    var link;
		    
		    // heading
		    
		    //
		    // local data
		    //
		    var isLocalOnly = stakeholder.isLocalOnly();
		    var ownsContract = session.ownsContract(contract); 
			
			var stakeholderaddress = stakeholder.getAddress();
			var isYou = session.isSessionAccountAddress(stakeholderaddress);
		    
			var chainidentifier = (isLocalOnly ? 'local' : (ownsContract ? session.decryptContractStakeHolderIdentifier(contract, stakeholder) : (isYou ? session.decryptContractStakeHolderIdentifier(contract, stakeholder) + ' (You)' : 'crypted')));
		    var identifier = (isLocalOnly ? stakeholder.getLocalIdentifier() : chainidentifier);

		    // identifier
		    tr = document.createElement('tr');
		    tr.classList.add('tr-local');
		    table.appendChild(tr);
		    
		    td = document.createElement('td');
		    td.classList.add('td-label');
		    text = document.createTextNode('Identifier is:');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    td.classList.add('td-value');
		    text =  document.createTextNode(identifier);
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    
		    //
		    // chain data
		    //
			var chainaddress = (isLocalOnly ? null : stakeholder.getAddress());
			var chainaddressdisplay = (isLocalOnly ? 'local only' : stakeholder.getAddress() + Views.revealContractStakeHolderIdentifier(ownsContract, session, contract, stakeholder));
			
			var isauthentic = (isLocalOnly ? false : stakeholder.isAuthenticated());
			var isauthenticdisplay = (isLocalOnly ? 'local only' : stakeholder.isAuthenticated());
			
			var chainrsapubkey = (isLocalOnly ? null : stakeholder.getChainRsaPubKey());
			var chainrsapubkeydisplay = (isLocalOnly ? 'local only' : chainrsapubkey);
			
			//var chainprivkey = (isLocalOnly ? null : stakeholder.getChainCocryptedPrivKey());
			//var chainprivkeydisplay = (isLocalOnly ? 'local only' : Views.showCondensedPrivateKey(stakeholder.getChainCocryptedPrivKey()) + (ownsContract ? '\xa0\xa0\xa0---->\xa0\xa0\xa0' + session.decryptContractStakeHolderPrivateKey(contract, stakeholder) : (isYou ? '\xa0\xa0\xa0---->\xa0\xa0\xa0' + session.decryptContractStakeHolderPrivateKey(contract, stakeholder) : '')));
			
			var cocryptedprivkey = (isLocalOnly ? null : stakeholder.getChainCocryptedPrivKey());
			var cocryptedprivkeydisplay = (isLocalOnly ? 'local only' : Views.showCondensedPrivateKey(stakeholder.getChainCocryptedPrivKey()) + Views.revealContractStakeHolderPrivateKey(ownsContract, session, contract, stakeholder));

		    var cocryptedidentifier = (isLocalOnly ? null : stakeholder.getChainCocryptedIdentifier());
		    var cocryptedidentifierdisplay = (isLocalOnly ? 'local only' : Views.showCondensedCryptedText(cocryptedidentifier) + Views.revealContractStakeHolderIdentifier(ownsContract, session, contract, stakeholder));
		    
		    var registrationdate = (isLocalOnly ? null : stakeholder.getChainRegistrationDate());
		    var registrationdatedisplay = (isLocalOnly ? 'local only' : registrationdate);
		    var registrationblockdate = (isLocalOnly ? null : stakeholder.getChainBlockDate());
		    var registrationblockdatedisplay = (isLocalOnly ? 'local only' : registrationblockdate);
		    
		    var creatoraddress = (isLocalOnly ? null : stakeholder.getChainCreatorAddress());
		    var creator = (isLocalOnly ? null : contract.getChainStakeHolderFromAddress(stakeholder.getChainCreatorAddress()));
		    var creatoraddressdisplay = (isLocalOnly ? 'local only' : creatoraddress + Views.revealContractStakeHolderIdentifier(ownsContract, session, contract, creator));
		    
		    var crtcrypteddescription = (isLocalOnly ? null : stakeholder.getChainCreatorCryptedDescription());
		    var crtcrypteddescriptiondisplay = (isLocalOnly ? 'local only' : Views.showCondensedCryptedText(crtcrypteddescription) + Views.revealCreatorCryptedStakeHolderDescription(ownsContract, session, contract, stakeholder));
		    var crtcryptedidentifier = (isLocalOnly ? null : stakeholder.getChainCreatorCryptedIdentifier());
		    var crtcryptedidentifierdisplay = (isLocalOnly ? 'local only' : Views.showCondensedCryptedText(crtcryptedidentifier) + Views.revealCreatorCryptedStakeHolderIdentifier(ownsContract, session, contract, stakeholder));
	    
		    var shldrcrypteddescription = (isLocalOnly ? null : stakeholder.getChainStakeHolderCryptedDescription());
		    var shldrcrypteddescriptiondisplay = (isLocalOnly ? 'local only' : Views.showCondensedCryptedText(shldrcrypteddescription) + Views.revealStakeHolderCryptedStakeHolderDescription(ownsContract, session, contract, stakeholder));
		    var shldrcryptedidentifier = (isLocalOnly ? null : stakeholder.getChainStakeHolderCryptedIdentifier());
		    var shldrcryptedidentifierdisplay = (isLocalOnly ? 'local only' : Views.showCondensedCryptedText(shldrcryptedidentifier) + Views.revealStakeHolderCryptedStakeHolderIdentifier(ownsContract, session, contract, stakeholder));
		    
		    var orderid = (isLocalOnly ? null : stakeholder.getChainOrderId());
		    var orderiddisplay = (isLocalOnly ? 'local only' : orderid);
		    var signature = (isLocalOnly ? null : stakeholder.getChainSignature());
		    var signaturedisplay = (isLocalOnly ? 'local only' : signature);

		    
		    
		    // authentication
		    tr = document.createElement('tr');
		    tr.classList.add('tr-chain');
		    table.appendChild(tr);
		    
		    td = document.createElement('td');
		    td.classList.add('td-label');
		    text = document.createTextNode('Authentication is:');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    td.classList.add('td-value');
		    text =  document.createTextNode(isauthentic);
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    // addresss
		    tr = document.createElement('tr');
		    tr.classList.add('tr-chain');
		    table.appendChild(tr);
		    
		    td = document.createElement('td');
		    td.classList.add('td-label');
		    text = document.createTextNode('Account address is:');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    td.classList.add('td-value');
		    text =  document.createTextNode(chainaddressdisplay);
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    // public key(isLocalOnly ? 'local only' : 
		    tr = document.createElement('tr');
		    tr.classList.add('tr-chain');
		    table.appendChild(tr);
		    
		    td = document.createElement('td');
		    td.classList.add('td-label');
		    text = document.createTextNode('Public rsa key is:');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    td.classList.add('td-value');
		    text =  document.createTextNode(chainrsapubkeydisplay);
		    td.appendChild(text);
		    tr.appendChild(td);
		    

		    
		    
		    // company-crypted shareholder private key
		    tr = document.createElement('tr');
		    tr.classList.add('tr-chain');
		    table.appendChild(tr);
		    
		    td = document.createElement('td');
		    td.classList.add('td-label');
		    text = document.createTextNode('Private key (contract crypted) is:');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    td.classList.add('td-value');
		    text =  document.createTextNode(cocryptedprivkeydisplay);
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    // company-crypted identifier
		    tr = document.createElement('tr');
		    tr.classList.add('tr-chain');
		    table.appendChild(tr);
		    
		    td = document.createElement('td');
		    td.classList.add('td-label');
		    text = document.createTextNode('Identifier (contract crypted) is:');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    td.classList.add('td-value');
		    text =  document.createTextNode(cocryptedidentifierdisplay);
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    
		    // registration date
		    tr = document.createElement('tr');
		    tr.classList.add('tr-chain');
		    table.appendChild(tr);
		    
		    td = document.createElement('td');
		    td.classList.add('td-label');
		    text = document.createTextNode('Registration date is:');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    td.classList.add('td-value');
		    text =  document.createTextNode(registrationdatedisplay);
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    // registration block date
		    tr = document.createElement('tr');
		    tr.classList.add('tr-chain');
		    table.appendChild(tr);
		    
		    td = document.createElement('td');
		    td.classList.add('td-label');
		    text = document.createTextNode('Registration block date is:');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    td.classList.add('td-value');
		    text =  document.createTextNode(registrationblockdatedisplay);
		    td.appendChild(text);
		    tr.appendChild(td);
		    

		    // creator
		    tr = document.createElement('tr');
		    tr.classList.add('tr-chain');
		    table.appendChild(tr);
		    
		    td = document.createElement('td');
		    td.classList.add('td-label');
		    text = document.createTextNode((ownsContract || isYou ? 'Creator is:' : 'Creator address is:'));
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    td.classList.add('td-value');
		    text =  document.createTextNode(creatoraddressdisplay);
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    // creator crypted shareholder private key
		    tr = document.createElement('tr');
		    tr.classList.add('tr-chain');
		    table.appendChild(tr);
		    
		    td = document.createElement('td');
		    td.classList.add('td-label');
		    text = document.createTextNode('Description (creator crypted) is:');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    td.classList.add('td-value');
		    text =  document.createTextNode(crtcrypteddescriptiondisplay);
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    // creator crypted shareholder identifier
		    tr = document.createElement('tr');
		    tr.classList.add('tr-chain');
		    table.appendChild(tr);
		    
		    td = document.createElement('td');
		    td.classList.add('td-label');
		    text = document.createTextNode('Identifier (creator crypted) is:');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    td.classList.add('td-value');
		    text =  document.createTextNode(crtcryptedidentifierdisplay);
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    
		   
		    // shareholder crypted description
		    tr = document.createElement('tr');
		    tr.classList.add('tr-chain');
		    table.appendChild(tr);
		    
		    td = document.createElement('td');
		    td.classList.add('td-label');
		    text = document.createTextNode('Description (shareholder crypted) is:');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    td.classList.add('td-value');
		    text =  document.createTextNode(shldrcrypteddescriptiondisplay);
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    // shareholder crypted shareholder identifier
		    tr = document.createElement('tr');
		    tr.classList.add('tr-chain');
		    table.appendChild(tr);
		    
		    td = document.createElement('td');
		    td.classList.add('td-label');
		    text = document.createTextNode('Identifier (shareholder crypted) is:');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    td.classList.add('td-value');
		    text =  document.createTextNode(shldrcryptedidentifierdisplay);
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    
		    
		    
		    // order id
		    tr = document.createElement('tr');
		    tr.classList.add('tr-chain');
		    table.appendChild(tr);
		    
		    td = document.createElement('td');
		    td.classList.add('td-label');
		    text = document.createTextNode('Order id is:');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    td.classList.add('td-value');
		    text =  document.createTextNode(orderiddisplay);
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    // signature
		    tr = document.createElement('tr');
		    tr.classList.add('tr-chain');
		    table.appendChild(tr);
		    
		    td = document.createElement('td');
		    td.classList.add('td-label');
		    text = document.createTextNode('Digital signature is:');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    td.classList.add('td-value');
		    text =  document.createTextNode(signaturedisplay);
		    td.appendChild(text);
		    tr.appendChild(td);
		    
			
		}
	
		app.addView(viewcontainer);		
	}
		
	//
	// Issuances
	//
	
	writeContractIssuanceLines(table, contract, issuancearray, handler_goto_issuance_page, handler_remove_issuance_from_list) {
		if (!issuancearray)
			return;
		
		var session = this.global.getSessionObject();
		
		// in reverse order to have most recent on top
		var tr;   
		var td;   
	    var text;
	    var link;
	    var linenumber = 1;

	    for (var i = issuancearray.length -1 ; i >= 0; i--) {
	    	console.log('writing line ' + i);
			var issuance = issuancearray[i];
			
			var isLocalOnly = issuance.isLocalOnly();
			var ownsContract = session.ownsContract(contract);
			
			tr = document.createElement('tr'); 

			// set line class
			if (isLocalOnly) {
				if (linenumber % 2 == 0)
					tr.classList.add('table-issuance-list-tr-local-even');
				else
					tr.classList.add('table-issuance-list-tr-local-odd');
			}
			else {
				if (linenumber % 2 == 0)
					tr.classList.add('table-issuance-list-tr-chain-even');
				else
					tr.classList.add('table-issuance-list-tr-chain-odd');
			}
			
		    // description
			var chaindescription = ( ownsContract ? session.getSessionAccountObject().aesDecryptString(issuance.getChainCocryptedDescription()) : 'crypted');

			td = document.createElement('td');
			text = (isLocalOnly ? issuance.getLocalDescription() : chaindescription);
		    var params = [contract.getContractIndex(), issuance.getIssuanceIndex()];
		    link = Views.createLink(text,'Issuance from contract', "lnk-issuance_page", params);
		    link.onclick = handler_goto_issuance_page;
			td.appendChild(link);
		    tr.appendChild(td);

		    // number of shares
		    td = document.createElement('td');
			text = document.createTextNode((isLocalOnly ? issuance.getLocalNumberOfShares() : issuance.getChainNumberOfShares()));
			td.appendChild(text);
		    tr.appendChild(td);

		    // percent of capital
		    td = document.createElement('td');
			text = document.createTextNode((isLocalOnly ?  issuance.getLocalPercentOfCapital() : issuance.getChainPercentOfCapital()));
			td.appendChild(text);
		    tr.appendChild(td);

		    // name
		    td = document.createElement('td');
			text = document.createTextNode((isLocalOnly ? issuance.getLocalName() : issuance.getChainName()));
			td.appendChild(text);
		    tr.appendChild(td);

		    // code
		    td = document.createElement('td');
			text = document.createTextNode((isLocalOnly ? issuance.getLocalCode() : issuance.getChainCode()));
			td.appendChild(text);
		    tr.appendChild(td);

		    // cocrypted description
		    td = document.createElement('td');
			text = document.createTextNode((isLocalOnly ? 'local' : issuance.getChainCocryptedDescription()));
			td.appendChild(text);
		    tr.appendChild(td);

			// action
		    td = document.createElement('td');
		    var params = [contract.getContractIndex(), issuance.getIssuanceIndex()];
		    
		    if (isLocalOnly) {
			    link = Views.createLink('remove from list','remove issuance from list', "lnk-remove_issuance", params);
			    link.onclick = handler_remove_issuance_from_list;
			    td.appendChild(link);
	    	
		    }
		    
			td.classList.add('table-issuance-list-action-td');
		    tr.appendChild(td);

		    table.appendChild(tr);	
		    
		    linenumber++;
		}
		
	}
	
	displayContractIssuances(contract) {
		var app = this.global.getAppObject();

		var self = this;

		var viewcontainer = document.createElement("div");
		viewcontainer.classList.add('div-view-container');
		
		// potential tabs
		
		// core of the view
		var view = document.createElement("div");
		view.classList.add('div-view');
		
		viewcontainer.appendChild(view);

		if (contract) {
			var session = this.global.getSessionObject();
			var controllers = this.global.getControllersObject();
			var table = document.createElement("table");
		    table.classList.add('table-issuance-list');
		    
		    view.appendChild(table);
			
			var tr = document.createElement('tr'); 
			var td;
			var text;
			var link;

			// heading
		    tr = document.createElement('tr');
		    
		    td = document.createElement('td');
		    text = document.createTextNode('Description');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    text = document.createTextNode('Number of shares');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    text = document.createTextNode('Percent of capital');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    text = document.createTextNode('Name (public)');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    text = document.createTextNode('Code (public)');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    text = document.createTextNode('Chain description (crypted)');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    // action
		    td = document.createElement('td');
		    text = document.createTextNode('');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    table.appendChild(tr);
		    
			// lists
		    var handler_goto_issuance_page = controllers.handleGotoIssuancePage;
			var handler_remove_issuance_from_list = controllers.handleRemoveIssuanceFromList;


		    // local stakeholder
		    var locallist = contract.getLocalIssuances();
		    var locallistlength = (locallist ? locallist.length : 0);
		    console.log('local list has ' + locallistlength + ' elements.');
		    
		    this.writeContractIssuanceLines(table, contract, locallist, handler_goto_issuance_page, handler_remove_issuance_from_list);
		    
		    // writing 1 line after that with waiting
		    tr = document.createElement('tr');
		    tr.classList.add('table-issuance-list-tr-chain-odd');
		    
		    td = document.createElement('td');
		    text = document.createTextNode('waiting...');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    text = document.createTextNode('waiting...');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    
		    td = document.createElement('td');
		    text = document.createTextNode('waiting...');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    
		    td = document.createElement('td');
		    text = document.createTextNode('waiting...');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    text = document.createTextNode('waiting...');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    text = document.createTextNode('waiting...');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    // action
		    td = document.createElement('td');
		    text = document.createTextNode('');
		    td.appendChild(text);
		    tr.appendChild(td);

		    table.appendChild(tr);
		    
		    // chain issuances
		    var writelist = function (contract, table) {
				return contract.getChainIssuanceList(function(err, res) {
					if (res) {
						console.log('list is returned with ' + res.length + ' elements');
						
						Views.clearTable(table, locallistlength + 1);
						
						self.writeContractIssuanceLines(table, contract, res, handler_goto_issuance_page, handler_remove_issuance_from_list);
					}
					
					if (err) console.log('error: ' + err);
				});
			};
			
			contract.getChainIssuanceCount(function(err, res) {
				var count = res;
				console.log('writing ' + count + ' lines with loading');
				
				Views.clearTable(table, locallistlength + 1);
				
				for (var i = 0; i < count; i++) {
				    // loading
				    tr = document.createElement('tr');
				    
					if ((i +1) % 2 == 0)
						tr.classList.add('table-issuance-list-tr-chain-even');
					else
						tr.classList.add('table-issuance-list-tr-chain-odd');
					
				    td = document.createElement('td');
				    text = document.createTextNode('loading...');
				    td.appendChild(text);
				    tr.appendChild(td);
				    
				    td = document.createElement('td');
				    text = document.createTextNode('loading...');
				    td.appendChild(text);
				    tr.appendChild(td);
				    
				    td = document.createElement('td');
				    text = document.createTextNode('loading...');
				    td.appendChild(text);
				    tr.appendChild(td);
				    
				    td = document.createElement('td');
				    text = document.createTextNode('loading...');
				    td.appendChild(text);
				    tr.appendChild(td);
				    
				    td = document.createElement('td');
				    text = document.createTextNode('loading...');
				    td.appendChild(text);
				    tr.appendChild(td);
				    
				    td = document.createElement('td');
				    text = document.createTextNode('loading...');
				    td.appendChild(text);
				    tr.appendChild(td);
				    
				    
				    // action
				    td = document.createElement('td');
				    text = document.createTextNode('');
				    td.appendChild(text);
				    tr.appendChild(td);

				    table.appendChild(tr);

				}
				
				return count;
			}).then(function(res) {
				console.log('got the count of ' + res + ' and dummy lines created');
				console.log('asking now for the list of issuances, then writing the lines');
				
				writelist(contract, table);
			});
			

			
			
		}
	
		app.addView(viewcontainer);		
		
	}
	
	displayContractIssuance(contract, issuance){
		var app = this.global.getAppObject();
		
		var self = this;

		var viewcontainer = document.createElement("div");
		viewcontainer.classList.add('div-view-container');
		
		// potential tabs
		
		// core of the view
		var view = document.createElement("div");
		view.classList.add('div-view');
		
		viewcontainer.appendChild(view);

		if ((contract) && (issuance)){
			var session = this.global.getSessionObject();
			var controllers = this.global.getControllersObject();
			
			
			var table = document.createElement("table");
		    table.classList.add('table-issuance');

			view.appendChild(table);

			var tr;   
			var td;   
		    var text;
		    var link;
		    
		    // heading
		    
		    //
		    // local data
		    //
		    var isLocalOnly = issuance.isLocalOnly();
		    var ownsContract = session.ownsContract(contract); 
		    
		    var localname = (isLocalOnly ? issuance.getLocalName() : 'deployed');
			var chaindescription = ( ownsContract ? session.getSessionAccountObject().aesDecryptString(issuance.getChainCocryptedDescription()) : 'crypted');
		    var localdescription = (isLocalOnly ? issuance.getLocalDescription() : chaindescription);
		    var localnumberofshares = (isLocalOnly ? issuance.getLocalNumberOfShares() : 'deployed');
		    var localpercentofcapital = (isLocalOnly ? issuance.getLocalPercentOfCapital() : 'deployed');

		    var localcode = (isLocalOnly ? issuance.getLocalCode() : 'deployed');

		    // name
		    tr = document.createElement('tr');
		    tr.classList.add('tr-local');
		    table.appendChild(tr);
		    
		    td = document.createElement('td');
		    td.classList.add('td-label');
		    text = document.createTextNode('Name is:');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    td.classList.add('td-value');
		    text =  document.createTextNode(localname);
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    // description
		    tr = document.createElement('tr');
		    tr.classList.add('tr-local');
		    table.appendChild(tr);
		    
		    td = document.createElement('td');
		    td.classList.add('td-label');
		    text = document.createTextNode('Description is:');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    td.classList.add('td-value');
		    text =  document.createTextNode(localdescription);
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    // code
		    tr = document.createElement('tr');
		    tr.classList.add('tr-local');
		    table.appendChild(tr);
		    
		    td = document.createElement('td');
		    td.classList.add('td-label');
		    text = document.createTextNode('Code is:');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    td.classList.add('td-value');
		    text =  document.createTextNode(localcode);
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    // numberofshares
		    tr = document.createElement('tr');
		    tr.classList.add('tr-local');
		    table.appendChild(tr);
		    
		    td = document.createElement('td');
		    td.classList.add('td-label');
		    text = document.createTextNode('Number of shares is:');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    td.classList.add('td-value');
		    text =  document.createTextNode(localnumberofshares);
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    
		    // percent of capital
		    tr = document.createElement('tr');
		    tr.classList.add('tr-local');
		    table.appendChild(tr);
		    
		    td = document.createElement('td');
		    td.classList.add('td-label');
		    text = document.createTextNode('Percent of capital is:');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    td.classList.add('td-value');
		    text =  document.createTextNode(localpercentofcapital);
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    
		    //
		    // chain data
		    //
		    
		    var contractowneraccount = contract.getSyncChainOwnerAccount();
		    
		    var orderid = issuance.getChainOrderId();
		    var signature = issuance.getChainSignature();
		    
		    var isauthentic = (isLocalOnly ? false : contractowneraccount.validateStringSignature(orderid, signature));
		    var isauthenticdisplay = (isLocalOnly ? 'local only' : isauthentic);
		    
		    var chainname = (isLocalOnly ? null : issuance.getChainName());
		    var chainnamedisplay = (isLocalOnly ? 'local only' : chainname);
		    
		    var chaincocrypteddescription = (isLocalOnly ? null : issuance.getChainCocryptedDescription());
		    var chaincocrypteddescriptiondisplay = (isLocalOnly ? 'local only' : issuance.getChainCocryptedDescription() + Views.revealContractIssuanceDescription(ownsContract, session, contract, issuance));

		    var chainnumberofshares = (isLocalOnly ? null : issuance.getChainNumberOfShares());
		    var chainnumberofsharesdisplay = (isLocalOnly ? 'local only' : chainnumberofshares);

		    var chainpercentofcapital = (isLocalOnly ? null : issuance.getChainPercentOfCapital());
		    var chainpercentofcapitaldisplay = (isLocalOnly ? 'local only' : chainpercentofcapital);

		    var chaintype = (isLocalOnly ? null : issuance.getChainType());
		    var chaintypedisplay = (isLocalOnly ? 'local only' : chaintype);
		    
		    var chaincode = (isLocalOnly ? null : issuance.getChainCode());
		    var chaincodedisplay = (isLocalOnly ? 'local only' : chaincode);

		    var orderiddisplay = (isLocalOnly ? 'local only' : orderid);
		    var signaturedisplay = (isLocalOnly ? 'local only' : signature);

		    // authentication
		    tr = document.createElement('tr');
		    tr.classList.add('tr-chain');
		    table.appendChild(tr);
		    
		    td = document.createElement('td');
		    td.classList.add('td-label');
		    text = document.createTextNode('Authentication is:');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    td.classList.add('td-value');
		    text =  document.createTextNode(isauthenticdisplay);
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    // name
		    tr = document.createElement('tr');
		    tr.classList.add('tr-chain');
		    table.appendChild(tr);
		    
		    td = document.createElement('td');
		    td.classList.add('td-label');
		    text = document.createTextNode('Name is:');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    td.classList.add('td-value');
		    text =  document.createTextNode(chainnamedisplay);
		    td.appendChild(text);
		    tr.appendChild(td);

		    // company-crypted private description
		    tr = document.createElement('tr');
		    tr.classList.add('tr-chain');
		    table.appendChild(tr);
		    
		    td = document.createElement('td');
		    td.classList.add('td-label');
		    text = document.createTextNode('Description (crypted) is:');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    td.classList.add('td-value');
		    text =  document.createTextNode(chaincocrypteddescriptiondisplay);
		    td.appendChild(text);
		    tr.appendChild(td);
		    

		    // type
		    tr = document.createElement('tr');
		    tr.classList.add('tr-chain');
		    table.appendChild(tr);
		    
		    td = document.createElement('td');
		    td.classList.add('td-label');
		    text = document.createTextNode('Type is:');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    td.classList.add('td-value');
		    text =  document.createTextNode(chaintypedisplay);
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    // code
		    tr = document.createElement('tr');
		    tr.classList.add('tr-chain');
		    table.appendChild(tr);
		    
		    td = document.createElement('td');
		    td.classList.add('td-label');
		    text = document.createTextNode('Code is:');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    td.classList.add('td-value');
		    text =  document.createTextNode(chaincodedisplay);
		    td.appendChild(text);
		    tr.appendChild(td);
		    

		    
		    // number of shares
		    tr = document.createElement('tr');
		    tr.classList.add('tr-chain');
		    table.appendChild(tr);
		    
		    td = document.createElement('td');
		    td.classList.add('td-label');
		    text = document.createTextNode('Number of shares is:');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    td.classList.add('td-value');
		    text =  document.createTextNode(chainnumberofsharesdisplay);
		    td.appendChild(text);
		    tr.appendChild(td);
		    

		    // percent of capital
		    tr = document.createElement('tr');
		    tr.classList.add('tr-chain');
		    table.appendChild(tr);
		    
		    td = document.createElement('td');
		    td.classList.add('td-label');
		    text = document.createTextNode('Percent of capital is:');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    td.classList.add('td-value');
		    text =  document.createTextNode(chainpercentofcapitaldisplay);
		    td.appendChild(text);
		    tr.appendChild(td);
			
		    // order id
		    tr = document.createElement('tr');
		    tr.classList.add('tr-chain');
		    table.appendChild(tr);
		    
		    td = document.createElement('td');
		    td.classList.add('td-label');
		    text = document.createTextNode('Order id is:');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    td.classList.add('td-value');
		    text =  document.createTextNode(orderiddisplay);
		    td.appendChild(text);
		    tr.appendChild(td);

		    // signature
		    tr = document.createElement('tr');
		    tr.classList.add('tr-chain');
		    table.appendChild(tr);
		    
		    td = document.createElement('td');
		    td.classList.add('td-label');
		    text = document.createTextNode('Signature is:');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    td.classList.add('td-value');
		    text =  document.createTextNode(signaturedisplay);
		    td.appendChild(text);
		    tr.appendChild(td);

		}
	
		app.addView(viewcontainer);		
	}
	
	//
	// Transactions
	//
	
	writeContractTransactionLines(table, contract, transactionarray, handler_goto_transaction_page, handler_remove_transaction_from_list) {
		if (!transactionarray)
			return;
		
		var global = this.global;
		var session = this.global.getSessionObject();

		// in reverse order to have most recent on top
		var tr;   
		var td;   
	    var text;
	    var link;
	    var linenumber = 1;

		var ownsContract = session.ownsContract(contract);
		var contractowneraccount = (ownsContract ? contract.getOwnerAccount() : null);

	    for (var i = transactionarray.length -1 ; i >= 0; i--) {
	    	console.log('writing line ' + i);
			var transaction = transactionarray[i];
			var isLocalOnly = transaction.isLocalOnly();
			
			tr = document.createElement('tr'); 

			// set line class
			if (isLocalOnly) {
				if (linenumber % 2 == 0)
					tr.classList.add('table-transaction-list-tr-local-even');
				else
					tr.classList.add('table-transaction-list-tr-local-odd');
			}
			else {
				if (linenumber % 2 == 0)
					tr.classList.add('table-transaction-list-tr-chain-even');
				else
					tr.classList.add('table-transaction-list-tr-chain-odd');
			}
			
		    // oderid
			td = document.createElement('td');
			text = (isLocalOnly ? transaction.getTransactionIndex() : transaction.getChainOrderId());
		    var params = [contract.getContractIndex(), transaction.getTransactionIndex()];
		    link = Views.createLink(text,'Transaction from contract', "lnk-transaction_page", params);
		    link.onclick = handler_goto_transaction_page;
			td.appendChild(link);
		    tr.appendChild(td);

		    // from
		    td = document.createElement('td');
		    var chainfrom = (isLocalOnly ? transaction.getLocalFrom() : transaction.getChainFrom());
		    var chainfromdisplay = global.getStakeholderDisplayName(chainfrom, contract);
			
		    text = document.createTextNode(chainfromdisplay);
			td.appendChild(text);
		    tr.appendChild(td);


		    // to
		    td = document.createElement('td');
		    var chainto = (isLocalOnly ? transaction.getLocalTo() : transaction.getChainTo());
		    var chaintodisplay = global.getStakeholderDisplayName(chainto, contract);
			
		    text = document.createTextNode(chaintodisplay);
			td.appendChild(text);
		    tr.appendChild(td);

		    // nature
		    td = document.createElement('td');
			text = document.createTextNode((isLocalOnly ? '-' : transaction.getChainNature()));
			td.appendChild(text);
		    tr.appendChild(td);

		    // issuance number
		    td = document.createElement('td');
			text = document.createTextNode((isLocalOnly ? transaction.getLocalIssuanceNumber() : transaction.getChainIssuanceNumber()));
			td.appendChild(text);
		    tr.appendChild(td);

		    // numberofshares
		    td = document.createElement('td');
			text = document.createTextNode((isLocalOnly ? transaction.getLocalNumberOfShares() : transaction.getChainNumberOfShares()));
			td.appendChild(text);
		    tr.appendChild(td);

		    // consideration
		    td = document.createElement('td');
			text = document.createTextNode((isLocalOnly ? transaction.getLocalConsideration() : transaction.getChainConsideration()));
			td.appendChild(text);
		    tr.appendChild(td);

		    // currency
		    td = document.createElement('td');
			text = document.createTextNode((isLocalOnly ? transaction.getLocalCurrency() : transaction.getChainCurrency()));
			td.appendChild(text);
		    tr.appendChild(td);



			// action
		    td = document.createElement('td');
		    var params = [contract.getContractIndex(), transaction.getTransactionIndex()];
		    
		    if (isLocalOnly) {
			    link = Views.createLink('remove from list','remove transaction from list', "lnk-remove_transaction", params);
			    link.onclick = handler_remove_transaction_from_list;
			    td.appendChild(link);
	    	
		    }
		    
			td.classList.add('table-transaction-list-action-td');
		    tr.appendChild(td);

		    table.appendChild(tr);	
		    
		    linenumber++;
		}
		
	}
	
	displayContractTransactions(contract) {
		var app = this.global.getAppObject();

		var self = this;

		var viewcontainer = document.createElement("div");
		viewcontainer.classList.add('div-view-container');
		
		// potential tabs
		
		// core of the view
		var view = document.createElement("div");
		view.classList.add('div-view');
		
		viewcontainer.appendChild(view);

		if (contract) {
			var controllers = this.global.getControllersObject();
			var table = document.createElement("table");
		    table.classList.add('table-transaction-list');
		    
		    view.appendChild(table);
			
			var session = this.global.getSessionObject();
		    
			var tr = document.createElement('tr'); 
			var td;
			var text;
			var link;

			// heading
		    tr = document.createElement('tr');
		    
		    td = document.createElement('td');
		    text = document.createTextNode('OrderId');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    text = document.createTextNode('From');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    text = document.createTextNode('To');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    text = document.createTextNode('Nature');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    text = document.createTextNode('Issuance number');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    text = document.createTextNode('Number of shares');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    // consideration and currency crypted?
		    td = document.createElement('td');
		    text = document.createTextNode('Consideration');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    text = document.createTextNode('Currency');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    // action
		    td = document.createElement('td');
		    text = document.createTextNode('');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    table.appendChild(tr);
		    
			// lists
		    var handler_goto_transaction_page = controllers.handleGotoTransactionPage;
			var handler_remove_transaction_from_list = controllers.handleRemoveTransactionFromList;


		    // local transaction
		    var locallist = contract.getLocalTransactions();
		    var locallistlength = (locallist ? locallist.length : 0);
		    console.log('local list has ' + locallistlength + ' elements.');
		    
		    this.writeContractTransactionLines(table, contract, locallist, handler_goto_transaction_page, handler_remove_transaction_from_list);
		    
		    // writing 1 line after that with waiting
		    tr = document.createElement('tr');
		    tr.classList.add('table-transaction-list-tr-chain-odd');
		    
		    td = document.createElement('td');
		    text = document.createTextNode('waiting...');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    text = document.createTextNode('waiting...');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    text = document.createTextNode('waiting...');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    text = document.createTextNode('waiting...');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    
		    td = document.createElement('td');
		    text = document.createTextNode('waiting...');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    
		    td = document.createElement('td');
		    text = document.createTextNode('waiting...');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    text = document.createTextNode('waiting...');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    text = document.createTextNode('waiting...');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    // action
		    td = document.createElement('td');
		    text = document.createTextNode('');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    table.appendChild(tr);
		    
		    // chain transactions
		    var writelist = function (contract, table) {
				return contract.getChainTransactionList(function(err, res) {
					if (res) {
						console.log('list is returned with ' + res.length + ' elements');
						
						Views.clearTable(table, locallistlength + 1);
						
						self.writeContractTransactionLines(table, contract, res, handler_goto_transaction_page, handler_remove_transaction_from_list);
					}
					
					if (err) console.log('error: ' + err);
				});
			};
			
			contract.getChainTransactionCount(function(err, res) {
				var count = res;
				console.log('writing ' + count + ' lines with loading');
				
				Views.clearTable(table, locallistlength + 1);
				
				for (var i = 0; i < count; i++) {
				    // loading
				    tr = document.createElement('tr');
				    
					if ((i +1) % 2 == 0)
						tr.classList.add('table-transaction-list-tr-chain-even');
					else
						tr.classList.add('table-transaction-list-tr-chain-odd');
					
				    td = document.createElement('td');
				    text = document.createTextNode('loading...');
				    td.appendChild(text);
				    tr.appendChild(td);
				    
				    td = document.createElement('td');
				    text = document.createTextNode('loading...');
				    td.appendChild(text);
				    tr.appendChild(td);
				    
				    td = document.createElement('td');
				    text = document.createTextNode('loading...');
				    td.appendChild(text);
				    tr.appendChild(td);
				    
				    td = document.createElement('td');
				    text = document.createTextNode('loading...');
				    td.appendChild(text);
				    tr.appendChild(td);
				    
				    td = document.createElement('td');
				    text = document.createTextNode('loading...');
				    td.appendChild(text);
				    tr.appendChild(td);
				    
				    td = document.createElement('td');
				    text = document.createTextNode('loading...');
				    td.appendChild(text);
				    tr.appendChild(td);
				    
				    td = document.createElement('td');
				    text = document.createTextNode('loading...');
				    td.appendChild(text);
				    tr.appendChild(td);
				    
				    td = document.createElement('td');
				    text = document.createTextNode('loading...');
				    td.appendChild(text);
				    tr.appendChild(td);
				    
				    // action
				    td = document.createElement('td');
				    text = document.createTextNode('');
				    td.appendChild(text);
				    tr.appendChild(td);

				    table.appendChild(tr);

				}
				
				return count;
			}).then(function(res) {
				console.log('got the count of ' + res + ' and dummy lines created');
				console.log('asking now for the list of transactions, then writing the lines');
				
				writelist(contract, table);
			});
			

			
			
		}
	
		app.addView(viewcontainer);		
		
	}
	
	displayContractTransaction(contract, transaction) {
		var app = this.global.getAppObject();
		
		var self = this;

		var viewcontainer = document.createElement("div");
		viewcontainer.classList.add('div-view-container');
		
		// potential tabs
		
		// core of the view
		var view = document.createElement("div");
		view.classList.add('div-view');
		
		viewcontainer.appendChild(view);

		if ((contract) && (transaction)){
			var global = this.global;
			var session = this.global.getSessionObject();

			var controllers = this.global.getControllersObject();
			
			
			var table = document.createElement("table");
		    table.classList.add('table-transaction');

			view.appendChild(table);

			var tr;   
			var td;   
		    var text;
		    var link;
		    
		    // heading
		    var isLocalOnly = transaction.isLocalOnly();
			var ownsContract = session.ownsContract(contract);
		    
		    
		    //
		    // local data
		    //
			
		    var localfrom = (isLocalOnly ? transaction.getLocalFrom() : 'deployed');
		    var localto = (isLocalOnly ? transaction.getLocalTo() : 'deployed');
		    var localissuancenumber = (isLocalOnly ? transaction.getLocalIssuanceNumber() : 'deployed');
		    var localnumberofshares = (isLocalOnly ? transaction.getLocalNumberOfShares() : 'deployed');
		    var localconsideration = (isLocalOnly ? transaction.getLocalConsideration() : 'deployed');
		    var localcurrency = (isLocalOnly ? transaction.getLocalCurrency() : 'deployed');

		    // from
		    tr = document.createElement('tr');
		    tr.classList.add('tr-local');
		    table.appendChild(tr);
		    
		    td = document.createElement('td');
		    td.classList.add('td-label');
		    text = document.createTextNode('Sender is:');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    td.classList.add('td-value');
		    text =  document.createTextNode(localfrom);
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    // to
		    tr = document.createElement('tr');
		    tr.classList.add('tr-local');
		    table.appendChild(tr);
		    
		    td = document.createElement('td');
		    td.classList.add('td-label');
		    text = document.createTextNode('Recipient is:');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    td.classList.add('td-value');
		    text =  document.createTextNode(localto);
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    // issuance number
		    tr = document.createElement('tr');
		    tr.classList.add('tr-local');
		    table.appendChild(tr);
		    
		    td = document.createElement('td');
		    td.classList.add('td-label');
		    text = document.createTextNode('Issuance number is:');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    td.classList.add('td-value');
		    text =  document.createTextNode(localissuancenumber);
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    // numberofshares
		    tr = document.createElement('tr');
		    tr.classList.add('tr-local');
		    table.appendChild(tr);
		    
		    td = document.createElement('td');
		    td.classList.add('td-label');
		    text = document.createTextNode('Number of shares is:');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    td.classList.add('td-value');
		    text =  document.createTextNode(localnumberofshares);
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    
		    // consideration
		    tr = document.createElement('tr');
		    tr.classList.add('tr-local');
		    table.appendChild(tr);
		    
		    td = document.createElement('td');
		    td.classList.add('td-label');
		    text = document.createTextNode('Consideration is:');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    td.classList.add('td-value');
		    text =  document.createTextNode(localconsideration);
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    // currency
		    tr = document.createElement('tr');
		    tr.classList.add('tr-local');
		    table.appendChild(tr);
		    
		    td = document.createElement('td');
		    td.classList.add('td-label');
		    text = document.createTextNode('Currency is:');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    td.classList.add('td-value');
		    text =  document.createTextNode(localcurrency);
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    
		    
		    //
		    // chain data
		    //
		    
		    var contractowneraccount = contract.getSyncChainOwnerAccount();
		    
		    var transactioncreatoraddress = transaction.getChainCreatorAddress();
		    var transactioncreatoraccount = session.getAccountObject(transactioncreatoraddress);
		    
		    var orderid = transaction.getChainOrderId();
		    var signature = transaction.getChainSignature();
		    
		    var isauthentic = (isLocalOnly ? false : ( transactioncreatoraccount ? transactioncreatoraccount.validateStringSignature(orderid, signature) : false));
		    var isauthenticdisplay = (isLocalOnly ? 'local only' : isauthentic);
		    
		    var chainfrom = (isLocalOnly ? transaction.getLocalFrom() : transaction.getChainFrom());
		    var chainfromstakeholder = (isLocalOnly ? null : contract.getChainStakeHolderFromAddress(chainfrom))
		    var chainfromdisplay = (isLocalOnly ? 'local only' : chainfrom + Views.revealStakeHolderIdentifier(ownsContract, session, contract, chainfromstakeholder));
			    
		    var chainto = (isLocalOnly ? transaction.getLocalTo() : transaction.getChainTo());
		    var chaintostakeholder = (isLocalOnly ? null : contract.getChainStakeHolderFromAddress(chainto))
		    var chaintodisplay = (isLocalOnly ? 'local only' : chainto + Views.revealStakeHolderIdentifier(ownsContract, session, contract, chaintostakeholder));
		    
		    var chainnature = (isLocalOnly ? -1 : transaction.getChainNature());
		    var chainnaturedisplay = (isLocalOnly ? 'local only' : chainnature);
		    
		    var chainissuancenumber = (isLocalOnly ? -1 : transaction.getChainIssuanceNumber());
		    var chainissuancenumberdisplay = (isLocalOnly ? 'local only' : chainissuancenumber);

		    var chainnumberofshares = (isLocalOnly ? -1 : transaction.getChainNumberOfShares());
		    var chainnumberofsharesdisplay = (isLocalOnly ? 'local only' : chainnumberofshares);

		    var chainconsideration = (isLocalOnly ? null : transaction.getChainConsideration());
		    var chainconsiderationdisplay = (isLocalOnly ? 'local only' : chainconsideration);
		    
		    var chaincurrency = (isLocalOnly ? null : transaction.getChainCurrency());
		    var chaincurrencydisplay = (isLocalOnly ? 'local only' : chaincurrency);

		    var chaincreatoraddress = (isLocalOnly ? null : transaction.getChainCreatorAddress());
		    var chaincreatorstakeholder = (isLocalOnly ? null : contract.getChainStakeHolderFromAddress(chaincreatoraddress))
		    var chaincreatoraddressdisplay = (isLocalOnly ? 'local only' : chaincreatoraddress + Views.revealStakeHolderIdentifier(ownsContract, session, contract, chaincreatorstakeholder));

		    var orderiddisplay = (isLocalOnly ? 'local only' : orderid);
		    var signaturedisplay = (isLocalOnly ? 'local only' : signature);

		    var chaintransactiondate = (isLocalOnly ? null : transaction.getChainTransactionDate());
		    var chaintransactiondatedisplay = (isLocalOnly ? 'local only' : chaintransactiondate);
		    
		    var chainblockdate = (isLocalOnly ? null : transaction.getChainBlockDate());
		    var chainblockdatedisplay = (isLocalOnly ? 'local only' : chainblockdate);
		    

		    // authentication
		    tr = document.createElement('tr');
		    tr.classList.add('tr-chain');
		    table.appendChild(tr);
		    
		    td = document.createElement('td');
		    td.classList.add('td-label');
		    text = document.createTextNode('Authentication is:');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    td.classList.add('td-value');
		    text =  document.createTextNode(isauthenticdisplay);
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    // from
		    tr = document.createElement('tr');
		    tr.classList.add('tr-chain');
		    table.appendChild(tr);
		    
		    td = document.createElement('td');
		    td.classList.add('td-label');
		    text = document.createTextNode('Sender is:');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    td.classList.add('td-value');
		    text =  document.createTextNode(chainfromdisplay);
		    td.appendChild(text);
		    tr.appendChild(td);

		    // to
		    tr = document.createElement('tr');
		    tr.classList.add('tr-chain');
		    table.appendChild(tr);
		    
		    td = document.createElement('td');
		    td.classList.add('td-label');
		    text = document.createTextNode('Recipient is:');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    td.classList.add('td-value');
		    text =  document.createTextNode(chaintodisplay);
		    td.appendChild(text);
		    tr.appendChild(td);

		    // nature
		    tr = document.createElement('tr');
		    tr.classList.add('tr-chain');
		    table.appendChild(tr);
		    
		    td = document.createElement('td');
		    td.classList.add('td-label');
		    text = document.createTextNode('Nature is:');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    td.classList.add('td-value');
		    text =  document.createTextNode(chainnaturedisplay);
		    td.appendChild(text);
		    tr.appendChild(td);

		    // issuance number
		    tr = document.createElement('tr');
		    tr.classList.add('tr-chain');
		    table.appendChild(tr);
		    
		    td = document.createElement('td');
		    td.classList.add('td-label');
		    text = document.createTextNode('Issuance number is:');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    td.classList.add('td-value');
		    text =  document.createTextNode(chainissuancenumberdisplay);
		    td.appendChild(text);
		    tr.appendChild(td);


		    // number of shares
		    tr = document.createElement('tr');
		    tr.classList.add('tr-chain');
		    table.appendChild(tr);
		    
		    td = document.createElement('td');
		    td.classList.add('td-label');
		    text = document.createTextNode('Number of shares is:');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    td.classList.add('td-value');
		    text =  document.createTextNode(chainnumberofsharesdisplay);
		    td.appendChild(text);
		    tr.appendChild(td);
		    

		    // consideration
		    tr = document.createElement('tr');
		    tr.classList.add('tr-chain');
		    table.appendChild(tr);
		    
		    td = document.createElement('td');
		    td.classList.add('td-label');
		    text = document.createTextNode('Consideration is:');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    td.classList.add('td-value');
		    text =  document.createTextNode(chainconsiderationdisplay);
		    td.appendChild(text);
		    tr.appendChild(td);

		    // currency
		    tr = document.createElement('tr');
		    tr.classList.add('tr-chain');
		    table.appendChild(tr);
		    
		    td = document.createElement('td');
		    td.classList.add('td-label');
		    text = document.createTextNode('Currency is:');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    td.classList.add('td-value');
		    text =  document.createTextNode(chaincurrencydisplay);
		    td.appendChild(text);
		    tr.appendChild(td);

		    // creator
		    tr = document.createElement('tr');
		    tr.classList.add('tr-chain');
		    table.appendChild(tr);
		    
		    td = document.createElement('td');
		    td.classList.add('td-label');
		    text = document.createTextNode('Creator address is:');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    td.classList.add('td-value');
		    text =  document.createTextNode(chaincreatoraddressdisplay);
		    td.appendChild(text);
		    tr.appendChild(td);

		    // order id
		    tr = document.createElement('tr');
		    tr.classList.add('tr-chain');
		    table.appendChild(tr);
		    
		    td = document.createElement('td');
		    td.classList.add('td-label');
		    text = document.createTextNode('Order id is:');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    td.classList.add('td-value');
		    text =  document.createTextNode(orderiddisplay);
		    td.appendChild(text);
		    tr.appendChild(td);

		    // signature
		    tr = document.createElement('tr');
		    tr.classList.add('tr-chain');
		    table.appendChild(tr);
		    
		    td = document.createElement('td');
		    td.classList.add('td-label');
		    text = document.createTextNode('Signature is:');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    td.classList.add('td-value');
		    text =  document.createTextNode(signaturedisplay);
		    td.appendChild(text);
		    tr.appendChild(td);

		    // transaction date
		    tr = document.createElement('tr');
		    tr.classList.add('tr-chain');
		    table.appendChild(tr);
		    
		    td = document.createElement('td');
		    td.classList.add('td-label');
		    text = document.createTextNode('Transaction date is:');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    td.classList.add('td-value');
		    text =  document.createTextNode(chaintransactiondatedisplay);
		    td.appendChild(text);
		    tr.appendChild(td);

		    // block date
		    tr = document.createElement('tr');
		    tr.classList.add('tr-chain');
		    table.appendChild(tr);
		    
		    td = document.createElement('td');
		    td.classList.add('td-label');
		    text = document.createTextNode('Block number is:');
		    td.appendChild(text);
		    tr.appendChild(td);
		    
		    td = document.createElement('td');
		    td.classList.add('td-value');
		    text =  document.createTextNode(chainblockdatedisplay);
		    td.appendChild(text);
		    tr.appendChild(td);

			
		}
	
		app.addView(viewcontainer);		
	}
	
	
	// static
	static createLink(text, title, lnk_id, params) {
		var link = document.createElement('a');
		var linkText = document.createTextNode(text);
		link.appendChild(linkText);
		link.title = title;
		link.id = lnk_id;
		link.style = "cursor:pointer;";
		link.href = "javascript:void(0)";
		
		if (params) {
			for (var i = 0; i < params.length; i++) {
				link.setAttribute('param'+ i, params[i]);
			}
		}
		
		return link;
	}
	
	static changeLinkText(link, text) {
		for (var i = 0; i < link.childNodes.length; i++) {
			var childnode = link.childNodes[i];
			
			if ((childnode) && (childnode.nodeType == 3)) {
				childnode.nodeValue = text;
			}
		}
	}
	
	static clearTable(table, start) {
		var rows = table.rows;
		var num = rows.length;
	  
		/*for (var i = start; i < num; i++ ) {
			table.deleteRow(i);
		}*/
		
		console.log('clear table after ' + start);
		
		var i = num - 1;
		
		while( i >= start) {
			table.deleteRow(i);
			i = table.rows.length - 1;
		}
		
	}
	
	static showCondensedPublicKey(pubkey) {
		return (pubkey ? pubkey.substring(0, 16) + ".........." + pubkey.substr(pubkey.length - 8) : null);
	}
	
	static showCondensedPrivateKey(privkey) {
		return (privkey ? privkey.substring(0, 16) + ".........." + privkey.substr(privkey.length - 8) : null);
	}
	
	static showCondensedCryptedText(cryptedtext) {
		return (cryptedtext ? cryptedtext.substring(0, 16) + ".........." + cryptedtext.substr(cryptedtext.length - 8) : null);
	}
	
	static revealContractIssuanceDescription(ownsContract, session, contract, issuance) {
		if (ownsContract) {
			return '\xa0\xa0\xa0---->\xa0\xa0\xa0' + session.getSessionAccountObject().aesDecryptString(issuance.getChainCocryptedDescription()) ;
		}
		else {
			return '';
		}
	}
	
	static revealStakeHolderIdentifier(ownsContract, session, contract, stakeholder) {
		if (ownsContract) {
			return Views.revealContractStakeHolderIdentifier(ownsContract, session, contract, stakeholder);
		}
		else {
			var stkldraddress = stakeholder.getAddress();
			var isYou = session.isSessionAccountAddress(stkldraddress);
			
			if (isYou) {
				return Views.revealStakeHolderCryptedStakeHolderIdentifier(ownsContract, session, contract, stakeholder);
			}
			else {
				var creatoraddress = stakeholder.getChainCreatorAddress();
				var areYouCreator = session.isSessionAccountAddress(creatoraddress);
				
				if (areYouCreator) {
					return Views.revealCreatorCryptedStakeHolderIdentifier(ownsContract, session, contract, stakeholder);
				}
				else {
					return '';
				}
			}
			
		}
	}

	
	static revealContractStakeHolderIdentifier(ownsContract, session, contract, stakeholder) {
		if (ownsContract) {
			// global.getStakeholderDisplayName(chainto, contract)
			return '\xa0\xa0\xa0---->\xa0\xa0\xa0' + session.decryptContractStakeHolderIdentifier(contract, stakeholder);
		}
		else {
			var stakeholderaddress = stakeholder.getAddress();
			var isYou = session.isSessionAccountAddress(stakeholderaddress);
			
			if (isYou) {
				return '\xa0\xa0\xa0---->\xa0\xa0\xa0You';
			}
			else {
				return '';
			}
		}
	}
	
	static revealContractStakeHolderPrivateKey(ownsContract, session, contract, stakeholder) {
		if (ownsContract) {
			return '\xa0\xa0\xa0---->\xa0\xa0\xa0' + session.decryptContractStakeHolderPrivateKey(contract, stakeholder);
		}
		else {
			return '';
		}
	}
	
	static revealCreatorCryptedStakeHolderDescription(ownsContract, session, contract, stakeholder) {
		if (ownsContract)
			return '\xa0\xa0\xa0---->\xa0\xa0\xa0' + session.decryptCreatorStakeHolderDescription(contract, stakeholder);
		else {
			var creatoraddress = stakeholder.getChainCreatorAddress();
			var isYou = session.isSessionAccountAddress(creatoraddress);
			
			if (isYou) {
				return '\xa0\xa0\xa0---->\xa0\xa0\xa0' + session.decryptCreatorStakeHolderDescription(contract, stakeholder);
			}
			else {
				return '';
			}
		}
	}
	
	static revealCreatorCryptedStakeHolderIdentifier(ownsContract, session, contract, stakeholder) {
		if (ownsContract)
			return '\xa0\xa0\xa0---->\xa0\xa0\xa0' + session.decryptCreatorStakeHolderIdentifier(contract, stakeholder);
		else {
			var creatoraddress = stakeholder.getChainCreatorAddress();
			var isYou = session.isSessionAccountAddress(creatoraddress);
			
			if (isYou) {
				return '\xa0\xa0\xa0---->\xa0\xa0\xa0' + session.decryptCreatorStakeHolderIdentifier(contract, stakeholder);
			}
			else {
				return '';
			}
		}
	}
	
	static revealStakeHolderCryptedStakeHolderDescription(ownsContract, session, contract, stakeholder) {
		if (ownsContract)
			return '\xa0\xa0\xa0---->\xa0\xa0\xa0' + session.decryptStakeHolderStakeHolderDescription(contract, stakeholder);
		else {
			var stakeholderaddress = stakeholder.getAddress();
			var isYou = session.isSessionAccountAddress(stakeholderaddress);
			
			if (isYou) {
				return '\xa0\xa0\xa0---->\xa0\xa0\xa0' + session.decryptStakeHolderStakeHolderDescription(contract, stakeholder);
			}
			else {
				return '';
			}
		}
	}
	
	static revealStakeHolderCryptedStakeHolderIdentifier(ownsContract, session, contract, stakeholder) {
		if (ownsContract)
			return '\xa0\xa0\xa0---->\xa0\xa0\xa0' + session.decryptStakeHolderStakeHolderIdentifier(contract, stakeholder);
		else {
			var stakeholderaddress = stakeholder.getAddress();
			var isYou = session.isSessionAccountAddress(stakeholderaddress);
			
			if (isYou) {
				return '\xa0\xa0\xa0---->\xa0\xa0\xa0' + session.decryptStakeHolderStakeHolderIdentifier(contract, stakeholder);
			}
			else {
				return '';
			}
		}
	}
	
	
}

GlobalClass.Views = Views;