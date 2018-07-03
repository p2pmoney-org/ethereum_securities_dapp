'use strict';


class BreadCrumbs {
	
	constructor(global) {
		this.global = global;
	}
	
	displayCurrent() {
		var global = this.global;
		var app = this.global.getAppObject();

		var controllers = this.global.getControllersObject();

		var breadcrumbcontainerdiv = document.createElement('div');
		breadcrumbcontainerdiv.classList.add('div-breadcrumbs-container');
		
		// bread crumbs
		var breadcrumbdiv = document.createElement('div');
		breadcrumbdiv.classList.add('div-breadcrumbs');
		
		breadcrumbcontainerdiv.appendChild(breadcrumbdiv);
		
		var spanhome = document.createElement('span'); 
	
		var homelink = BreadCrumbs.createLink("Home", "Go to home", "lnk-home", ["home"]);
		var handler_breadcrumb_nav = controllers.handleGotoHome;
		
		homelink.onclick = handler_breadcrumb_nav;
		
		spanhome.appendChild(homelink);

		breadcrumbdiv.appendChild(spanhome);
		
		var contract = global.getCurrentContract();
		
		var span;
		var text;
		var link;
		var params;
		
		if (contract) {
			var spanseparator = document.createElement('span');
			var separatortext = document.createTextNode('>');
			
			spanseparator.appendChild(separatortext);
			
			breadcrumbdiv.appendChild(spanseparator);
			
			// contract
			var spancontract = document.createElement('span'); 
			var controllers = this.global.getControllersObject();
			
			var handler_goto_contract_page = controllers.handleGotoContractPage;
			var address = contract.getAddress();
			
		    params = [contract.getContractIndex()];
		    link = BreadCrumbs.createLink('Contract','Goto contract at address ' + address, "lnk-contract_page", params);
		    link.onclick = handler_goto_contract_page;
		    spancontract.appendChild(link);
		    
			breadcrumbdiv.appendChild(spancontract);
			
			var stakeholder = global.getCurrentStakeHolder();
			var issuance = global.getCurrentIssuance();
			var transaction = global.getCurrentTransaction();
			
			if (stakeholder) {
				spanseparator = document.createElement('span');
				separatortext = document.createTextNode('>');
				
				spanseparator.appendChild(separatortext);
				
				breadcrumbdiv.appendChild(spanseparator);
				
				// stakeholder
				var spanstakeholder = document.createElement('span'); 
				var controllers = this.global.getControllersObject();
				
				var handler_goto_stakeholder_page = controllers.handleGotoStakeHolderPage;
				
			    var params = [contract.getContractIndex(), stakeholder.getStakeHolderIndex()];
			    var label = (contract.getContractType() == 'StockLedger' ? 'ShareHolder' : 'StakeHolder');
			    link = BreadCrumbs.createLink(label,'Goto stakeholder from contract address ' + address, "lnk-stakeholder_page", params);
			    link.onclick = handler_goto_stakeholder_page;
			    spanstakeholder.appendChild(link);
			    
				breadcrumbdiv.appendChild(spanstakeholder);
				
			}
			else if (issuance) {
				spanseparator = document.createElement('span');
				separatortext = document.createTextNode('>');
				link;
				
				spanseparator.appendChild(separatortext);
				
				breadcrumbdiv.appendChild(spanseparator);
				
				// issuance
				var spanissuance = document.createElement('span'); 
				var controllers = this.global.getControllersObject();
				
				var handler_goto_issuance_page = controllers.handleGotoIssuancePage;
				
			    var params = [contract.getContractIndex(), issuance.getIssuanceIndex()];
			    var label = (contract.getContractType() == 'StockLedger' ? 'Stock Issuance' : 'Issuance');
			    link = BreadCrumbs.createLink(label,'Goto issuance from contract address ' + address, "lnk-issuance_page", params);
			    link.onclick = handler_goto_issuance_page;
			    spanissuance.appendChild(link);
			    
				breadcrumbdiv.appendChild(spanissuance);
				
			}
			else if (transaction) {
				spanseparator = document.createElement('span');
				separatortext = document.createTextNode('>');
				link;
				
				spanseparator.appendChild(separatortext);
				
				breadcrumbdiv.appendChild(spanseparator);
				
				// issuance
				var spantransaction = document.createElement('span'); 
				var controllers = this.global.getControllersObject();
				
				var handler_goto_transaction_page = controllers.handleGotoTransactionPage;
				
			    var params = [contract.getContractIndex(), transaction.getTransactionIndex()];
			    var label = (contract.getContractType() == 'StockLedger' ? 'Stock Transaction' : 'Transaction');
			    link = BreadCrumbs.createLink(label,'Goto transaction from contract address ' + address, "lnk-transaction_page", params);
			    link.onclick = handler_goto_transaction_page;
			    spantransaction.appendChild(link);
			    
				breadcrumbdiv.appendChild(spantransaction);
				
			}

		}
		
		// identity
		var session = global.getSessionObject();
		
		// bread crumbs
		var identitydiv = document.createElement('div');
		identitydiv.classList.add('div-identity');
		
		breadcrumbcontainerdiv.appendChild(identitydiv);
		
		var handler_display_identification_box = controllers.handleIdentificationSwitch;

		var identity = (session.isAnonymous() ? 'Anonymous' : session.getSessionAccountAddress());
		var message = (session.isAnonymous() ? 'Identify with your private key' : 'Check your details');
		
		span = document.createElement('span'); 
		
	    link = BreadCrumbs.createLink(identity,message, "lnk-identification_box", params);
	    link.onclick = handler_display_identification_box;
		
		span.appendChild(link);
		identitydiv.appendChild(span);
	

		
		app.setBreadCrumbBand(breadcrumbcontainerdiv);		
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
}

//GlobalClass.BreadCrumbs = BreadCrumbs;
GlobalClass.registerModuleClass('mvc', 'BreadCrumbs', BreadCrumbs);