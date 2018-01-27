'use strict';

class Forms {
	
	constructor(global) {
		this.global = global;
	}
	
	//
	// Contracts
	//
	
	getContractListFormTabs() {
		var tabs = document.createElement("div");
		tabs.classList.add('div-form-tabs');
		
		var tabs = document.createElement("div");
		tabs.classList.add('div-form-tabs');

		var divtab1 = document.createElement("div");
		var divtab2 = document.createElement("div");
		
		tabs.appendChild(divtab1);
		tabs.appendChild(divtab2);
		
		var span1 = document.createElement("span");
		var span2 = document.createElement("span");
		
		divtab1.appendChild(span1);
		divtab2.appendChild(span2);

		var global = this.global;
		var controllers = this.global.getControllersObject();
		
		var handler_select_form = controllers.handleSelectContractForm;

		var tab1;
		var tab2;
		
		var tabtext1 = "Import contract";
		var tabtext2 = "Create contract";
		
		var Global = global.getGlobalClass();
		
		if (global.currentformband == Global.FORM_ADD_CONTRACT_ADDRESS) {
			tab1 = document.createTextNode(tabtext1);
			divtab1.classList.add('div-form-selected-tab');

			
			tab2 = Forms.createLink(tabtext2, tabtext2, "lnk_create_contract", ["create"]);
			tab2.onclick = handler_select_form;
			divtab2.classList.add('div-form-tab');
		}
		else {
			// default
			tab1 = Forms.createLink(tabtext1, tabtext1, "lnk_add_contract", ["add"]);
			tab1.onclick = handler_select_form;
			divtab1.classList.add('div-form-tab');

			tab2 = document.createTextNode(tabtext2);
			divtab2.classList.add('div-form-selected-tab');
		}

		span1.appendChild(tab1);
		span2.appendChild(tab2);
		
		return tabs;
	}
	
	getContractFormTabs() {
		var tabs = document.createElement("div");
		tabs.classList.add('div-form-tabs');
		
		var divtab1 = document.createElement("div");
		var divtab2 = document.createElement("div");
		
		tabs.appendChild(divtab1);
		tabs.appendChild(divtab2);
		
		tabs.appendChild(divtab1);
		tabs.appendChild(divtab2);
		
		var span1 = document.createElement("span");
		var span2 = document.createElement("span");
		
		divtab1.appendChild(span1);
		divtab2.appendChild(span2);
		
		var global = this.global;
		var controllers = this.global.getControllersObject();
		
		var handler_select_form = controllers.handleSelectContractForm;

		var tab1;
		var tab2;
		
		var tabtext1 = "Modify contract";
		var tabtext2 = "Deploy contract";
		
		var Global = global.getGlobalClass();
		
		if (global.currentformband == Global.FORM_MODIFY_CONTRACT) {
			tab1 = document.createTextNode(tabtext1);
			divtab1.classList.add('div-form-selected-tab');

			tab2 = Forms.createLink(tabtext2, tabtext2, "lnk_deploy_contract", ["deploy"]);
			tab2.onclick = handler_select_form;
			divtab2.classList.add('div-form-tab');
		}
		else {
			// default
			tab1 = Forms.createLink(tabtext1, tabtext1, "lnk_modify_contract", ["modify"]);
			tab1.onclick = handler_select_form;
			divtab1.classList.add('div-form-tab');
			
			tab2 = document.createTextNode(tabtext2);
			divtab2.classList.add('div-form-selected-tab');
		}

		span1.appendChild(tab1);
		span2.appendChild(tab2);
		
		return tabs;
	}
	
	displayAddContractToListForm() {

		// container (direct child of band)
		var formcontainer = document.createElement("div");
		formcontainer.classList.add('div-form-container');
		
		// tabs
		var tabs = this.getContractListFormTabs();
		formcontainer.appendChild(tabs);

		// then core of the form
		var form = document.createElement("div");
		form.classList.add('div-form');
		
		formcontainer.appendChild(form);
		
		var span1 = document.createElement("span");
		var span2 = document.createElement("span");
		var span3 = document.createElement("span");
		
		form.appendChild(span2);
		form.appendChild(span1);
		form.appendChild(span3);
		
		// address text box
		var label1 = document.createElement("Label");
		label1.innerHTML = "Enter address of a contract already deployed:";
		label1.setAttribute('for',"contractaddress");
		
		var textbox1 = document.createElement("input"); //input element, text
		textbox1.setAttribute('type',"text");
		textbox1.setAttribute('name',"contractaddress");
		textbox1.classList.add('form-textbox');

		// description text box
		var label2 = document.createElement("Label");
		label2.innerHTML = "Enter a title for this contract:";
		label2.setAttribute('for',"contractdescription");
		
		var textbox2 = document.createElement("input"); //input element, text
		textbox2.setAttribute('type',"text");
		textbox2.setAttribute('name',"contractdescription");
		textbox2.classList.add('form-textbox');

		// button
		var button = document.createElement("input"); //input element, Submit button
		button.setAttribute('type',"submit");
		button.setAttribute('value',"Add");
		button.classList.add('form-button');
		button.classList.add('btn-add_address');
		//button.className += " " + "btn-add_address";

		// event handler
		
		var app = this.global.getAppObject(); // app object
		
		var controllers = this.global.getControllersObject();
		var handler = controllers.handleAddDeployedContract;
		
		app.bindEvent('click', '.btn-add_address', handler);

		
		span1.appendChild(label1);
		span1.appendChild(textbox1);
		
		span2.appendChild(label2);
		span2.appendChild(textbox2);
		
		span3.appendChild(button);
		
		

		// set top level message
		app.setMessage('please enter an address in the edit box.');
		
		// and add this form in the form band
		app.addForm(formcontainer);
		
		return true;
	}
	
	displayCreateContractForm() {
		// container (direct child of band)
		var formcontainer = document.createElement("div");
		formcontainer.classList.add('div-form-container');
		
		// tabs
		var tabs = this.getContractListFormTabs();
		formcontainer.appendChild(tabs);

		// core of the form
		var form = document.createElement("div");
		form.classList.add('div-form');
		
		formcontainer.appendChild(form);
		
		var spanowner = document.createElement("span");
		var spanidentifier = document.createElement("span");
		var spanledgername = document.createElement("span");
		var spanledgerdescription = document.createElement("span");

		var spanbutton = document.createElement("span");

		// owner address text box
		var labelowner = document.createElement("Label");
		labelowner.innerHTML = "Enter address of owner, or leave blank:";
		labelowner.setAttribute('for',"owneraddress");
		
		var textboxowner = document.createElement("input"); //input element, text
		textboxowner.setAttribute('type',"text");
		textboxowner.setAttribute('name',"owneraddress");
		textboxowner.classList.add('form-textbox');

		// owner identifier text box
		var labelidentifier = document.createElement("Label");
		labelidentifier.innerHTML = "Enter identifier of owner (email, phone number,...):";
		labelidentifier.setAttribute('for',"owneridentifier");
		
		var textboxidentifier = document.createElement("input"); //input element, text
		textboxidentifier.setAttribute('type',"text");
		textboxidentifier.setAttribute('name',"owneridentifier");
		textboxidentifier.classList.add('form-textbox');

		// ledgername text box
		var labelledgername = document.createElement("Label");
		labelledgername.innerHTML = "Enter public title for this ledger (e.g. \"Distributed Stock Ledger\"):";
		labelledgername.setAttribute('for',"ledgername");
		
		var textboxledgername = document.createElement("input"); //input element, text
		textboxledgername.setAttribute('type',"text");
		textboxledgername.setAttribute('name',"ledgername");
		textboxledgername.classList.add('form-textbox');

		// ledgerdescription text box
		var labelledgerdescription = document.createElement("Label");
		labelledgerdescription.innerHTML = "Enter private description for this ledger:";
		labelledgerdescription.setAttribute('for',"ledgerdescription");
		
		var textboxledgerdescription = document.createElement("input"); //input element, text
		textboxledgerdescription.setAttribute('type',"text");
		textboxledgerdescription.setAttribute('name',"ledgerdescription");
		textboxledgerdescription.classList.add('form-textbox');

		
		// button
		var button = document.createElement("input"); //input element, Submit button
		button.setAttribute('type',"submit");
		button.setAttribute('value',"Create");
		button.classList.add('form-button');
		button.classList.add('btn-create_contract');
		//button.className += " " + "btn-create_contract";

		// event handler
		var app = this.global.getAppObject();
		var controllers = this.global.getControllersObject();
		var handler = controllers.handleCreateContract;
		
		app.bindEvent('click', '.btn-create_contract', handler);
		
		
		spanledgerdescription.appendChild(labelledgerdescription);
		spanledgerdescription.appendChild(textboxledgerdescription);

		spanowner.appendChild(labelowner);
		spanowner.appendChild(textboxowner);

		spanidentifier.appendChild(labelidentifier);
		spanidentifier.appendChild(textboxidentifier);

		spanledgername.appendChild(labelledgername);
		spanledgername.appendChild(textboxledgername);

		spanbutton.appendChild(button);

		
		form.appendChild(spanledgerdescription);
		form.appendChild(spanledgername);
		form.appendChild(spanowner);
		form.appendChild(spanidentifier);
		form.appendChild(spanbutton);
		
		// and this form in the form band

		// set top level message
		app.setMessage('please enter description that will be later used to create the contract on the blockchain.');

		
		// and add this form in the form band
		app.addForm(formcontainer);
		
		return true;
	}
	
	displayModifyContractForm(contract) {
		// container (direct child of band)
		var formcontainer = document.createElement("div");
		formcontainer.classList.add('div-form-container');
		
		// tabs
		var tabs = this.getContractFormTabs();
		formcontainer.appendChild(tabs);
		
		// core of the form
		var form = document.createElement("div");
		form.classList.add('div-form');
		
		formcontainer.appendChild(form);

		if (contract) {
			var contractindex = contract.getContractIndex();
			var localdescription = contract.getLocalDescription();

			var address = contract.getAddress();
			
			// common local and deployed
			var spanledgerdescription = document.createElement("span");

			form.appendChild(spanledgerdescription);
			
			// contract index hidden field
			var fieldcontractindex = document.createElement("input"); //input element, text
			fieldcontractindex.setAttribute('type',"hidden");
			fieldcontractindex.setAttribute('name',"contractindex");
			fieldcontractindex.value = contractindex;

			form.appendChild(fieldcontractindex);

			// ledgerdescription text box
			var labelledgerdescription = document.createElement("Label");
			labelledgerdescription.innerHTML = "Enter private description for this ledger:";
			labelledgerdescription.setAttribute('for',"ledgerdescription");
			
			var textboxledgerdescription = document.createElement("input"); //input element, text
			textboxledgerdescription.setAttribute('type',"text");
			textboxledgerdescription.setAttribute('name',"ledgerdescription");
			textboxledgerdescription.classList.add('form-textbox');
			textboxledgerdescription.value = localdescription;

			spanledgerdescription.appendChild(labelledgerdescription);
			spanledgerdescription.appendChild(textboxledgerdescription);

			if (contract.isLocalOnly()) {
				var owner = contract.getLocalOwner();
				var owneridentifier = contract.getLocalOwnerIdentifier();
				var ledgername = contract.getLocalLedgerName();
				
				// only local
				var spanledgername = document.createElement("span");
				var spanowner = document.createElement("span");
				var spanidentifier = document.createElement("span");
				
				// owner address text box
				var labelowner = document.createElement("Label");
				labelowner.innerHTML = "Enter address of owner, or leave blank:";
				labelowner.setAttribute('for',"owneraddress");
				
				var textboxowner = document.createElement("input"); //input element, text
				textboxowner.setAttribute('type',"text");
				textboxowner.setAttribute('name',"owneraddress");
				textboxowner.classList.add('form-textbox');
				textboxowner.value = owner;

				// owner identifier text box
				var labelidentifier = document.createElement("Label");
				labelidentifier.innerHTML = "Enter identifier of owner (email, phone number,...):";
				labelidentifier.setAttribute('for',"owneridentifier");
				
				var textboxidentifier = document.createElement("input"); //input element, text
				textboxidentifier.setAttribute('type',"text");
				textboxidentifier.setAttribute('name',"owneridentifier");
				textboxidentifier.classList.add('form-textbox');
				textboxidentifier.value = owneridentifier;

				// ledgername text box
				var labelledgername = document.createElement("Label");
				labelledgername.innerHTML = "Enter public title for this ledger:";
				labelledgername.setAttribute('for',"ledgername");
				
				var textboxledgername = document.createElement("input"); //input element, text
				textboxledgername.setAttribute('type',"text");
				textboxledgername.setAttribute('name',"ledgername");
				textboxledgername.classList.add('form-textbox');
				textboxledgername.value = ledgername;

				spanowner.appendChild(labelowner);
				spanowner.appendChild(textboxowner);

				spanidentifier.appendChild(labelidentifier);
				spanidentifier.appendChild(textboxidentifier);

				spanledgername.appendChild(labelledgername);
				spanledgername.appendChild(textboxledgername);

				form.appendChild(spanowner);
				form.appendChild(spanidentifier);
				form.appendChild(spanledgername);
			}
			
			
			// and finally the submit button
			var spanbutton = document.createElement("span");
			
			var button = document.createElement("input"); //input element, Submit button
			button.setAttribute('type',"submit");
			button.setAttribute('value',"Modify");
			button.classList.add('form-button');
			button.classList.add('btn-modify_contract');
			
			// event handler
			var app = this.global.getAppObject();
			var controllers = this.global.getControllersObject();
			var handler = controllers.handleModifyContract;
			
			app.bindEvent('click', '.btn-modify_contract', handler);
			
			spanbutton.appendChild(button);
			form.appendChild(spanbutton);
		}
		
		
		// and this form in the form band
		var app = this.global.getAppObject();

		app.addForm(formcontainer);
		
		return true;
	}
	
	displayDeployContractForm(contract) {
		// container (direct child of band)
		var formcontainer = document.createElement("div");
		formcontainer.classList.add('div-form-container');
		
		// tabs
		var tabs = this.getContractFormTabs();
		formcontainer.appendChild(tabs);
		
		// core of the form
		var form = document.createElement("div");
		form.classList.add('div-form');
		
		formcontainer.appendChild(form);

		if (contract) {
			
			var contractindex = contract.getContractIndex();
			var localdescription = contract.getLocalDescription();
			
			var gaslimit = 4712388;
			var gasPrice = 100000000000;
			
			var walletaddress = null;
			
			var global = this.global;
			var isLocalOnly = contract.isLocalOnly();
			
			if (global.useWalletAccount()) {
				// do we pay everything from a single wallet
				walletaddress = global.getWalletAccountAddress();
			}
			else {
				// or from the wallet of the owner of the contract
				walletaddress = contract.getLocalOwner();
			}
			
			if (walletaddress) {
				// we display the balance
				var wallet = global.getAccountObject(walletaddress);
				
				var divbalance = document.createElement("div");
				divbalance.classList.add('div-form-cue');
				
				/*var balance = wallet.getBalance();
				
				var balancetext = Forms.getEtherStringFromWei(balance);
				
				divbalance.innerHTML = 'The account ' + wallet.getAddress() + ' has ' + balancetext + ' Ether';*/
				
				Forms.writebalance(wallet, divbalance);
				
				formcontainer.appendChild(divbalance);
			}

			
			// contract index hidden field
			var fieldcontractindex = document.createElement("input"); //input element, text
			fieldcontractindex.setAttribute('type',"hidden");
			fieldcontractindex.setAttribute('name',"contractindex");
			fieldcontractindex.value = contractindex;

			form.appendChild(fieldcontractindex);

			// account wallet used
			var spanwallet = document.createElement("span");
			form.appendChild(spanwallet);

			var labelwallet = document.createElement("Label");
			labelwallet.innerHTML = "Wallet used:";
			labelwallet.setAttribute('for',"wallet");
			spanwallet.appendChild(labelwallet);
			
			var textboxwallet = document.createElement("input"); //input element, text
			textboxwallet.setAttribute('type',"text");
			textboxwallet.setAttribute('name',"wallet");
			textboxwallet.classList.add('form-textbox');
			textboxwallet.value = walletaddress;

			spanwallet.appendChild(textboxwallet);

			// account wallet password
			var spanpassword = document.createElement("span");
			form.appendChild(spanpassword);

			var labelpassword = document.createElement("Label");
			labelpassword.innerHTML = "Password:";
			labelpassword.setAttribute('for',"password");
			spanpassword.appendChild(labelpassword);
			
			var textboxpassword = document.createElement("input"); //input element, text
			textboxpassword.setAttribute('type',"password");
			textboxpassword.setAttribute('name',"password");
			textboxpassword.classList.add('form-textbox');

			spanpassword.appendChild(textboxpassword);

			// gas limit text box
			var spangas = document.createElement("span");
			form.appendChild(spangas);

			var labelgas = document.createElement("Label");
			labelgas.innerHTML = "Gas limit:";
			labelgas.setAttribute('for',"gaslimit");
			spangas.appendChild(labelgas);
			
			var textboxgas = document.createElement("input"); //input element, text
			textboxgas.setAttribute('type',"text");
			textboxgas.setAttribute('name',"gaslimit");
			textboxgas.classList.add('form-textbox');
			textboxgas.style = "width: 100px;";
			textboxgas.value = gaslimit;

			spangas.appendChild(textboxgas);
			
			// gas price text box
			var spangasprice = document.createElement("span");
			form.appendChild(spangasprice);

			var labelgasprice = document.createElement("Label");
			labelgasprice.innerHTML = "Gas price:";
			labelgasprice.setAttribute('for',"gasPrice");
			spangasprice.appendChild(labelgasprice);
			
			var textboxgasprice = document.createElement("input"); //input element, text
			textboxgasprice.setAttribute('type',"text");
			textboxgasprice.setAttribute('name',"gasPrice");
			textboxgasprice.classList.add('form-textbox');
			textboxgasprice.style = "width: 100px;";
			textboxgasprice.value = gasPrice;

			spangasprice.appendChild(textboxgasprice);
			
			// and finally the submit button
			var spanbutton = document.createElement("span");
			
			var button = document.createElement("input"); //input element, Submit button
			button.setAttribute('type',"submit");
			button.setAttribute('value',"Deploy");
			button.classList.add('form-button');
			button.classList.add('btn-deploy_contract');
			
			if (!isLocalOnly) {
				// already deployed, de-activate the form
				button.setAttribute('disabled',"disabled");
				button.disabled = true;
			}
			
			// event handler
			var app = this.global.getAppObject();
			var controllers = this.global.getControllersObject();
			var handler = controllers.handleDeployContract;
			
			app.bindEvent('click', '.btn-deploy_contract', handler);
			
			spanbutton.appendChild(button);
			form.appendChild(spanbutton);
		}
		
		
		// and this form in the form band
		var app = this.global.getAppObject();

		app.addForm(formcontainer);
		
		return true;
	}
	
	//
	// StakeHolders
	//
	
	getStakeHolderListFormTabs() {
		var tabs = document.createElement("div");
		tabs.classList.add('div-form-tabs');
		
		var tabs = document.createElement("div");
		tabs.classList.add('div-form-tabs');

		var divtab1 = document.createElement("div");
		
		tabs.appendChild(divtab1);
		
		var span1 = document.createElement("span");
		
		divtab1.appendChild(span1);

		var global = this.global;
		var controllers = this.global.getControllersObject();
		
		var handler_select_form = controllers.handleSelectContractForm;

		var tab1;
		
		var tabtext1 = "Create shareholder";
		
		var Global = global.getGlobalClass();
		
		if (global.currentformband == Global.FORM_CREATE_STAKEHOLDER) {
			tab1 = document.createTextNode(tabtext1);
			divtab1.classList.add('div-form-selected-tab');

		}
		else {
			// default
			tab1 = document.createTextNode(tabtext1);
			divtab1.classList.add('div-form-selected-tab');
		}

		span1.appendChild(tab1);
		
		return tabs;
	}
	
	getStakeHolderFormTabs() {
		var tabs = document.createElement("div");
		tabs.classList.add('div-form-tabs');
		
		var divtab1 = document.createElement("div");
		var divtab2 = document.createElement("div");
		
		tabs.appendChild(divtab1);
		tabs.appendChild(divtab2);
		
		tabs.appendChild(divtab1);
		tabs.appendChild(divtab2);
		
		var span1 = document.createElement("span");
		var span2 = document.createElement("span");
		
		divtab1.appendChild(span1);
		divtab2.appendChild(span2);
		
		var global = this.global;
		var controllers = this.global.getControllersObject();
		
		var handler_select_form = controllers.handleSelectContractForm;

		var tab1;
		var tab2;
		
		var tabtext1 = "Modify shareholder";
		var tabtext2 = "Deploy shareholder";
		
		var Global = global.getGlobalClass();
		
		if (global.currentformband == Global.FORM_MODIFY_STAKEHOLDER) {
			tab1 = document.createTextNode(tabtext1);
			divtab1.classList.add('div-form-selected-tab');

			tab2 = Forms.createLink(tabtext2, tabtext2, "lnk_deploy_shldr", ["deploy_shldr"]);
			tab2.onclick = handler_select_form;
			divtab2.classList.add('div-form-tab');
		}
		else {
			// default
			tab1 = Forms.createLink(tabtext1, tabtext1, "lnk_modify_shldr", ["modify_shldr"]);
			tab1.onclick = handler_select_form;
			divtab1.classList.add('div-form-tab');
			
			tab2 = document.createTextNode(tabtext2);
			divtab2.classList.add('div-form-selected-tab');
		}

		span1.appendChild(tab1);
		span2.appendChild(tab2);
		
		return tabs;
	}
	
	displayCreateStakeHolderForm(contract) {
		// container (direct child of band)
		var formcontainer = document.createElement("div");
		formcontainer.classList.add('div-form-container');
		
		// tabs
		var tabs = this.getStakeHolderListFormTabs();
		formcontainer.appendChild(tabs);
		
		// core of the form
		var form = document.createElement("div");
		form.classList.add('div-form');
		
		formcontainer.appendChild(form);
		
		if (contract) {
			var contractindex = contract.getContractIndex();
			
			// contract index hidden field
			var fieldcontractindex = document.createElement("input"); //input element, text
			fieldcontractindex.setAttribute('type',"hidden");
			fieldcontractindex.setAttribute('name',"contractindex");
			fieldcontractindex.value = contractindex;
			
			form.appendChild(fieldcontractindex);

			
			var span;
			var label;
			var textbox;

			
			// shareholder identifier text box
			span = document.createElement("span");
			form.appendChild(span);

			label = document.createElement("Label");
			label.innerHTML = "Enter identifier of shareholder (email, phone number,...):";
			label.setAttribute('for',"shldridentifier");
			
			span.appendChild(label);
			
			textbox = document.createElement("input"); //input element, text
			textbox.setAttribute('type',"text");
			textbox.setAttribute('name',"shldridentifier");
			textbox.classList.add('form-textbox');
			
			span.appendChild(textbox);

			
			// button
			var spanbutton = document.createElement("span");
			form.appendChild(spanbutton);

			var button = document.createElement("input"); //input element, Submit button
			button.setAttribute('type',"submit");
			button.setAttribute('value',"Create");
			button.classList.add('form-button');
			button.classList.add('btn-create_stakeholder');

			// event handler
			var app = this.global.getAppObject();
			var controllers = this.global.getControllersObject();
			var handler = controllers.handleCreateStakeHolder;
			
			app.bindEvent('click', '.btn-create_stakeholder', handler);
			
			
			spanbutton.appendChild(button);
		}
		

		// set top level message
		app.setMessage('please enter a unique specific identifier to find the corresponding shareholder.');

		
		// and add this form in the form band
		app.addForm(formcontainer);
		
		return true;
	}

	displayModifyStakeHolderForm(contract, stakeholder) {
		// container (direct child of band)
		var formcontainer = document.createElement("div");
		formcontainer.classList.add('div-form-container');
		
		// tabs
		var tabs = this.getStakeHolderFormTabs();
		formcontainer.appendChild(tabs);
		
		// core of the form
		var form = document.createElement("div");
		form.classList.add('div-form');
		
		formcontainer.appendChild(form);
		
		var span;
		var label;
		var textbox;
		
		if ((contract) && (stakeholder)) {
			var contractindex = contract.getContractIndex();
			var stakeholderindex = stakeholder.getStakeHolderIndex();
			
			// contract index hidden field
			var fieldcontractindex = document.createElement("input"); //input element, text
			fieldcontractindex.setAttribute('type',"hidden");
			fieldcontractindex.setAttribute('name',"contractindex");
			fieldcontractindex.value = contractindex;
			
			form.appendChild(fieldcontractindex);
			
			// stakeholder index hidden field
			var fieldstakeholderindex = document.createElement("input"); //input element, text
			fieldstakeholderindex.setAttribute('type',"hidden");
			fieldstakeholderindex.setAttribute('name',"stakeholderindex");
			fieldstakeholderindex.value = stakeholderindex;
			
			form.appendChild(fieldstakeholderindex);
			
			
			var isLocalOnly = stakeholder.isLocalOnly();
			var identifier = stakeholder.getLocalIdentifier();
			
			
			// shareholder identifier text box
			span = document.createElement("span");
			form.appendChild(span);

			label = document.createElement("Label");
			label.innerHTML = "Enter identifier of shareholder (email, phone number,...):";
			label.setAttribute('for',"shldridentifier");
			
			span.appendChild(label);
			
			textbox = document.createElement("input"); //input element, text
			textbox.setAttribute('type',"text");
			textbox.setAttribute('name',"shldridentifier");
			textbox.classList.add('form-textbox');
			textbox.value = identifier
			
			span.appendChild(textbox);


			
			// button
			var spanbutton = document.createElement("span");
			form.appendChild(spanbutton);

			var button = document.createElement("input"); //input element, Submit button
			button.setAttribute('type',"submit");
			button.setAttribute('value',"Modify");
			button.classList.add('form-button');
			button.classList.add('btn-modify_stakeholder');
			
			if (!isLocalOnly) {
				// already deployed, de-activate the form
				button.setAttribute('disabled',"disabled");
				button.disabled = true;
			}

			// event handler
			var app = this.global.getAppObject();
			var controllers = this.global.getControllersObject();
			var handler = controllers.handleModifyStakeHolder;
			
			app.bindEvent('click', '.btn-modify_stakeholder', handler);
			
			
			spanbutton.appendChild(button);
		}

		
		// set top level message
		app.setMessage('please enter a unique specific identifier to find the corresponding shareholder.');

		
		// and add this form in the form band
		app.addForm(formcontainer);
		
		return true;
		
		// and this form in the form band
		var app = this.global.getAppObject();
	
		app.addForm(formcontainer);
		
		return true;
		
	}
	

	displayDeployStakeHolderForm(contract, stakeholder) {
		// container (direct child of band)
		var formcontainer = document.createElement("div");
		formcontainer.classList.add('div-form-container');
		
		// tabs
		var tabs = this.getStakeHolderFormTabs();
		formcontainer.appendChild(tabs);
		
		// core of the form
		var form = document.createElement("div");
		form.classList.add('div-form');
		
		formcontainer.appendChild(form);
		
		var span;
		var label;
		var textbox;
		
		if ((contract) && (stakeholder)) {
			var contractindex = contract.getContractIndex();
			var stakeholderindex = stakeholder.getStakeHolderIndex();
			
			// contract index hidden field
			var fieldcontractindex = document.createElement("input"); //input element, text
			fieldcontractindex.setAttribute('type',"hidden");
			fieldcontractindex.setAttribute('name',"contractindex");
			fieldcontractindex.value = contractindex;
			
			form.appendChild(fieldcontractindex);
			
			// stakeholder index hidden field
			var fieldstakeholderindex = document.createElement("input"); //input element, text
			fieldstakeholderindex.setAttribute('type',"hidden");
			fieldstakeholderindex.setAttribute('name',"stakeholderindex");
			fieldstakeholderindex.value = stakeholderindex;
			
			form.appendChild(fieldstakeholderindex);
			
			// control inputs
			var isLocalOnly = stakeholder.isLocalOnly();
			
			var shldridentifier = stakeholder.getLocalIdentifier();

			// shareholder identifier text box
			span = document.createElement("span");
			form.appendChild(span);

			label = document.createElement("Label");
			label.innerHTML = "Enter identifier of shareholder (email, phone number,...):";
			label.setAttribute('for',"shldridentifier");
			
			span.appendChild(label);
			
			textbox = document.createElement("input"); //input element, text
			textbox.setAttribute('type',"text");
			textbox.setAttribute('name',"shldridentifier");
			textbox.classList.add('form-textbox');
			textbox.value = shldridentifier;
			
			span.appendChild(textbox);

			// shareholder address text box
/*			span = document.createElement("span");
			form.appendChild(span);

			label = document.createElement("Label");
			label.innerHTML = "Enter address of shareholder, or leave blank:";
			label.setAttribute('for',"shldraddress");
			
			span.appendChild(label);
			
			textbox = document.createElement("input"); //input element, text
			textbox.setAttribute('type',"text");
			textbox.setAttribute('name',"shldraddress");
			textbox.classList.add('form-textbox');
			
			span.appendChild(textbox);

			// public key text box
			span = document.createElement("span");
			form.appendChild(span);

			label = document.createElement("Label");
			label.innerHTML = "Enter public key of shareholder, or leave blank:";
			label.setAttribute('for',"shldrpubkey");
			
			span.appendChild(label);
			
			textbox = document.createElement("input"); //input element, text
			textbox.setAttribute('type',"text");
			textbox.setAttribute('name',"shldrpubkey");
			textbox.classList.add('form-textbox');
			
			span.appendChild(textbox);*/


			// private key text box
			span = document.createElement("span");
			form.appendChild(span);

			label = document.createElement("Label");
			label.innerHTML = "Enter private key of shareholder, or leave blank:";
			label.setAttribute('for',"shldrprivkey");
			
			span.appendChild(label);
			
			textbox = document.createElement("input"); //input element, text
			textbox.setAttribute('type',"text");
			textbox.setAttribute('name',"shldrprivkey");
			textbox.classList.add('form-textbox');
			
			span.appendChild(textbox);
			
			//
			// wallet
			//
			var gaslimit = 4712388;
			var gasPrice = 100000000000;
			
			var walletaddress = null;
			
			var global = this.global;
			
			if (global.useWalletAccount()) {
				// do we pay everything from a single wallet
				walletaddress = global.getWalletAccountAddress();
			}
			else {
				// or from the wallet of the owner of the contract
				walletaddress = contract.getLocalOwner();
			}
			
			if (walletaddress) {
				// we display the balance
				var wallet = global.getAccountObject(walletaddress);
				
				var divbalance = document.createElement("div");
				divbalance.classList.add('div-form-cue');
				
				/*var balance = wallet.getBalance();
				
				var balancetext = Forms.getEtherStringFromWei(balance);
				
				divbalance.innerHTML = 'The account ' + wallet.getAddress() + ' has ' + balancetext + ' Ether';*/
				
				Forms.writebalance(wallet, divbalance);
				
				formcontainer.appendChild(divbalance);
			}

			// account wallet used
			span = document.createElement("span");
			form.appendChild(span);

			label = document.createElement("Label");
			label.innerHTML = "Wallet used:";
			label.setAttribute('for',"wallet");
			span.appendChild(label);
			
			textbox = document.createElement("input"); //input element, text
			textbox.setAttribute('type',"text");
			textbox.setAttribute('name',"wallet");
			textbox.classList.add('form-textbox');
			textbox.value = walletaddress;

			span.appendChild(textbox);

			// account wallet password
			span = document.createElement("span");
			form.appendChild(span);

			label = document.createElement("Label");
			label.innerHTML = "Password:";
			label.setAttribute('for',"password");
			span.appendChild(label);
			
			textbox = document.createElement("input"); //input element, text
			textbox.setAttribute('type',"password");
			textbox.setAttribute('name',"password");
			textbox.classList.add('form-textbox');

			span.appendChild(textbox);

			// gas limit text box
			span = document.createElement("span");
			form.appendChild(span);

			label = document.createElement("Label");
			label.innerHTML = "Gas limit:";
			label.setAttribute('for',"gaslimit");
			span.appendChild(label);
			
			textbox = document.createElement("input"); //input element, text
			textbox.setAttribute('type',"text");
			textbox.setAttribute('name',"gaslimit");
			textbox.classList.add('form-textbox');
			textbox.style = "width: 100px;";
			textbox.value = gaslimit;

			span.appendChild(textbox);
			
			// gas price text box
			span = document.createElement("span");
			form.appendChild(span);

			label = document.createElement("Label");
			label.innerHTML = "Gas price:";
			label.setAttribute('for',"gasPrice");
			span.appendChild(label);
			
			textbox = document.createElement("input"); //input element, text
			textbox.setAttribute('type',"text");
			textbox.setAttribute('name',"gasPrice");
			textbox.classList.add('form-textbox');
			textbox.style = "width: 100px;";
			textbox.value = gasPrice;

			span.appendChild(textbox);
			
			// button
			var spanbutton = document.createElement("span");
			form.appendChild(spanbutton);

			var button = document.createElement("input"); //input element, Submit button
			button.setAttribute('type',"submit");
			button.setAttribute('value',"Deploy");
			button.classList.add('form-button');
			button.classList.add('btn-deploy_stakeholder');

			if (!isLocalOnly) {
				// already deployed, de-activate the form
				button.setAttribute('disabled',"disabled");
				button.disabled = true;
			}

			// event handler
			var app = this.global.getAppObject();
			var controllers = this.global.getControllersObject();
			var handler = controllers.handleDeployStakeHolder;
			
			app.bindEvent('click', '.btn-deploy_stakeholder', handler);
			
			
			spanbutton.appendChild(button);

			
			// and this form in the form band

			// set top level message
			app.setMessage('please enter stakeholder elements that will be deployed on the blockchain.');
			
		}

		
		// and add this form in the form band
		app.addForm(formcontainer);
		
		return true;
	}
	
	//
	// Issuances
	//
	
	getIssuanceListFormTabs() {
		var tabs = document.createElement("div");
		tabs.classList.add('div-form-tabs');
		
		var tabs = document.createElement("div");
		tabs.classList.add('div-form-tabs');

		var divtab1 = document.createElement("div");
		
		tabs.appendChild(divtab1);
		
		var span1 = document.createElement("span");
		
		divtab1.appendChild(span1);

		var global = this.global;
		var controllers = this.global.getControllersObject();
		
		var handler_select_form = controllers.handleSelectContractForm;

		var tab1;
		
		var tabtext1 = "Create issuance";
		
		var Global = global.getGlobalClass();
		
		if (global.currentformband == Global.FORM_CREATE_ISSUANCE) {
			tab1 = document.createTextNode(tabtext1);
			divtab1.classList.add('div-form-selected-tab');

		}
		else {
			// default
			tab1 = document.createTextNode(tabtext1);
			divtab1.classList.add('div-form-selected-tab');
		}

		span1.appendChild(tab1);
		
		return tabs;
	}
	
	getIssuanceFormTabs() {
		var tabs = document.createElement("div");
		tabs.classList.add('div-form-tabs');
		
		var divtab1 = document.createElement("div");
		var divtab2 = document.createElement("div");
		
		tabs.appendChild(divtab1);
		tabs.appendChild(divtab2);
		
		tabs.appendChild(divtab1);
		tabs.appendChild(divtab2);
		
		var span1 = document.createElement("span");
		var span2 = document.createElement("span");
		
		divtab1.appendChild(span1);
		divtab2.appendChild(span2);
		
		var global = this.global;
		var controllers = this.global.getControllersObject();
		
		var handler_select_form = controllers.handleSelectContractForm;

		var tab1;
		var tab2;
		
		var tabtext1 = "Modify issuance";
		var tabtext2 = "Deploy issuance";
		
		var Global = global.getGlobalClass();
		
		if (global.currentformband == Global.FORM_MODIFY_ISSUANCE) {
			tab1 = document.createTextNode(tabtext1);
			divtab1.classList.add('div-form-selected-tab');

			tab2 = Forms.createLink(tabtext2, tabtext2, "lnk_deploy_issuance", ["deploy_issuance"]);
			tab2.onclick = handler_select_form;
			divtab2.classList.add('div-form-tab');
		}
		else {
			// default
			tab1 = Forms.createLink(tabtext1, tabtext1, "lnk_modify_issuance", ["modify_issuance"]);
			tab1.onclick = handler_select_form;
			divtab1.classList.add('div-form-tab');
			
			tab2 = document.createTextNode(tabtext2);
			divtab2.classList.add('div-form-selected-tab');
		}

		span1.appendChild(tab1);
		span2.appendChild(tab2);
		
		return tabs;
	}
	
	displayCreateIssuanceForm(contract) {
		// container (direct child of band)
		var formcontainer = document.createElement("div");
		formcontainer.classList.add('div-form-container');
		
		// tabs
		var tabs = this.getIssuanceListFormTabs();
		formcontainer.appendChild(tabs);
		
		// core of the form
		var form = document.createElement("div");
		form.classList.add('div-form');
		
		formcontainer.appendChild(form);
		
		if (contract) {
			var contractindex = contract.getContractIndex();
			
			// contract index hidden field
			var fieldcontractindex = document.createElement("input"); //input element, text
			fieldcontractindex.setAttribute('type',"hidden");
			fieldcontractindex.setAttribute('name',"contractindex");
			fieldcontractindex.value = contractindex;
			
			form.appendChild(fieldcontractindex);

			
			var span;
			var label;
			var textbox;

			
			// name text box
			span = document.createElement("span");
			form.appendChild(span);

			label = document.createElement("Label");
			label.innerHTML = "Enter public name of issuance:";
			label.setAttribute('for',"issuancename");
			
			span.appendChild(label);
			
			textbox = document.createElement("input"); //input element, text
			textbox.setAttribute('type',"text");
			textbox.setAttribute('name',"issuancename");
			textbox.classList.add('form-textbox');
			
			span.appendChild(textbox);

			// description text box
			span = document.createElement("span");
			form.appendChild(span);

			label = document.createElement("Label");
			label.innerHTML = "Enter private description of issuance:";
			label.setAttribute('for',"issuancedescription");
			
			span.appendChild(label);
			
			textbox = document.createElement("input"); //input element, text
			textbox.setAttribute('type',"text");
			textbox.setAttribute('name',"issuancedescription");
			textbox.classList.add('form-textbox');
			
			span.appendChild(textbox);

			// number of shares
			span = document.createElement("span");
			form.appendChild(span);

			label = document.createElement("Label");
			label.innerHTML = "Enter number of shares issued in this issuance:";
			label.setAttribute('for',"numberofshares");
			
			span.appendChild(label);
			
			textbox = document.createElement("input"); //input element, text
			textbox.setAttribute('type',"text");
			textbox.setAttribute('name',"numberofshares");
			textbox.classList.add('form-textbox');
			
			span.appendChild(textbox);

			// percent of capital
			span = document.createElement("span");
			form.appendChild(span);

			label = document.createElement("Label");
			label.innerHTML = "Enter percent of final capital of this issuance (20 000 = 20%):";
			label.setAttribute('for',"percentofcapital");
			
			span.appendChild(label);
			
			textbox = document.createElement("input"); //input element, text
			textbox.setAttribute('type',"text");
			textbox.setAttribute('name',"percentofcapital");
			textbox.classList.add('form-textbox');
			
			span.appendChild(textbox);

			
			// button
			var spanbutton = document.createElement("span");
			form.appendChild(spanbutton);

			var button = document.createElement("input"); //input element, Submit button
			button.setAttribute('type',"submit");
			button.setAttribute('value',"Create");
			button.classList.add('form-button');
			button.classList.add('btn-create_issuance');

			// event handler
			var app = this.global.getAppObject();
			var controllers = this.global.getControllersObject();
			var handler = controllers.handleCreateIssuance;
			
			app.bindEvent('click', '.btn-create_issuance', handler);
			
			
			spanbutton.appendChild(button);
		}
		

		// set top level message
		app.setMessage('please enter a unique specific identifier to find the corresponding shareholder.');

		
		// and add this form in the form band
		app.addForm(formcontainer);
		
		return true;
	}
	
	displayModifyIssuanceForm(contract, issuance) {
		// container (direct child of band)
		var formcontainer = document.createElement("div");
		formcontainer.classList.add('div-form-container');
		
		// tabs
		var tabs = this.getIssuanceFormTabs();
		formcontainer.appendChild(tabs);
		
		// core of the form
		var form = document.createElement("div");
		form.classList.add('div-form');
		
		formcontainer.appendChild(form);
		
		var span;
		var label;
		var textbox;
		
		if ((contract) && (issuance)) {
			var contractindex = contract.getContractIndex();
			var issuanceindex = issuance.getIssuanceIndex();
			
			// contract index hidden field
			var fieldcontractindex = document.createElement("input"); //input element, text
			fieldcontractindex.setAttribute('type',"hidden");
			fieldcontractindex.setAttribute('name',"contractindex");
			fieldcontractindex.value = contractindex;
			
			form.appendChild(fieldcontractindex);
			
			// issuance index hidden field
			var fieldissuanceindex = document.createElement("input"); //input element, text
			fieldissuanceindex.setAttribute('type',"hidden");
			fieldissuanceindex.setAttribute('name',"issuanceindex");
			fieldissuanceindex.value = issuanceindex;
			
			form.appendChild(fieldissuanceindex);
			
			
			var isLocalOnly = issuance.isLocalOnly();
			
		    var localname = issuance.getLocalName();
		    var localdescription = issuance.getLocalDescription();
		    var localnumberofshares = issuance.getLocalNumberOfShares();
		    var localpercentofcapital = issuance.getLocalPercentOfCapital();

		    var span;
			var label;
			var textbox;

			
			// name text box
			span = document.createElement("span");
			form.appendChild(span);

			label = document.createElement("Label");
			label.innerHTML = "Enter public name of issuance:";
			label.setAttribute('for',"issuancename");
			
			span.appendChild(label);
			
			textbox = document.createElement("input"); //input element, text
			textbox.setAttribute('type',"text");
			textbox.setAttribute('name',"issuancename");
			textbox.classList.add('form-textbox');
			textbox.value = localname;
			
			span.appendChild(textbox);

			// description text box
			span = document.createElement("span");
			form.appendChild(span);

			label = document.createElement("Label");
			label.innerHTML = "Enter private description of issuance:";
			label.setAttribute('for',"issuancedescription");
			
			span.appendChild(label);
			
			textbox = document.createElement("input"); //input element, text
			textbox.setAttribute('type',"text");
			textbox.setAttribute('name',"issuancedescription");
			textbox.classList.add('form-textbox');
			textbox.value = localdescription;
			
			span.appendChild(textbox);

			// number of shares
			span = document.createElement("span");
			form.appendChild(span);

			label = document.createElement("Label");
			label.innerHTML = "Enter number of shares issued in this issuance:";
			label.setAttribute('for',"numberofshares");
			
			span.appendChild(label);
			
			textbox = document.createElement("input"); //input element, text
			textbox.setAttribute('type',"text");
			textbox.setAttribute('name',"numberofshares");
			textbox.classList.add('form-textbox');
			textbox.value = localnumberofshares;
			
			span.appendChild(textbox);

			// percent of capital
			span = document.createElement("span");
			form.appendChild(span);

			label = document.createElement("Label");
			label.innerHTML = "Enter percent of final capital of this issuance (20 000 = 20%):";
			label.setAttribute('for',"percentofcapital");
			
			span.appendChild(label);
			
			textbox = document.createElement("input"); //input element, text
			textbox.setAttribute('type',"text");
			textbox.setAttribute('name',"percentofcapital");
			textbox.classList.add('form-textbox');
			textbox.value = localpercentofcapital;
			
			span.appendChild(textbox);


			
			// button
			var spanbutton = document.createElement("span");
			form.appendChild(spanbutton);

			var button = document.createElement("input"); //input element, Submit button
			button.setAttribute('type',"submit");
			button.setAttribute('value',"Modify");
			button.classList.add('form-button');
			button.classList.add('btn-modify_issuance');
			
			if (!isLocalOnly) {
				// already deployed, de-activate the form
				button.setAttribute('disabled',"disabled");
				button.disabled = true;
			}

			// event handler
			var app = this.global.getAppObject();
			var controllers = this.global.getControllersObject();
			var handler = controllers.handleModifyIssuance;
			
			app.bindEvent('click', '.btn-modify_issuance', handler);
			
			
			spanbutton.appendChild(button);
		}

		
		// set top level message
		app.setMessage('you can modify parameters of this issuance until its deployment.');

		
		// and add this form in the form band
		app.addForm(formcontainer);
		
		return true;
		
		// and this form in the form band
		var app = this.global.getAppObject();
	
		app.addForm(formcontainer);
		
		return true;
		
	}
	

	displayDeployIssuanceForm(contract, issuance) {
		// container (direct child of band)
		var formcontainer = document.createElement("div");
		formcontainer.classList.add('div-form-container');
		
		// tabs
		var tabs = this.getIssuanceFormTabs();
		formcontainer.appendChild(tabs);
		
		// core of the form
		var form = document.createElement("div");
		form.classList.add('div-form');
		
		formcontainer.appendChild(form);
		
		var span;
		var label;
		var textbox;
		
		if ((contract) && (issuance)) {
			var contractindex = contract.getContractIndex();
			var issuanceindex = issuance.getIssuanceIndex();
			
			// contract index hidden field
			var fieldcontractindex = document.createElement("input"); //input element, text
			fieldcontractindex.setAttribute('type',"hidden");
			fieldcontractindex.setAttribute('name',"contractindex");
			fieldcontractindex.value = contractindex;
			
			form.appendChild(fieldcontractindex);
			
			// issuance index hidden field
			var fieldissuanceindex = document.createElement("input"); //input element, text
			fieldissuanceindex.setAttribute('type',"hidden");
			fieldissuanceindex.setAttribute('name',"issuanceindex");
			fieldissuanceindex.value = issuanceindex;
			
			form.appendChild(fieldissuanceindex);

			
			// control inputs
			var isLocalOnly = issuance.isLocalOnly();
			
		    var localname = issuance.getLocalName();
		    var localdescription = issuance.getLocalDescription();
		    var localnumberofshares = issuance.getLocalNumberOfShares();
		    var localpercentofcapital = issuance.getLocalPercentOfCapital();

		    var span;
			var label;
			var textbox;

			
			// name text box
			span = document.createElement("span");
			form.appendChild(span);

			label = document.createElement("Label");
			label.innerHTML = "Enter public name of issuance:";
			label.setAttribute('for',"issuancename");
			
			span.appendChild(label);
			
			textbox = document.createElement("input"); //input element, text
			textbox.setAttribute('type',"text");
			textbox.setAttribute('name',"issuancename");
			textbox.classList.add('form-textbox');
			textbox.value = localname;
			
			span.appendChild(textbox);

			// description text box
			span = document.createElement("span");
			form.appendChild(span);

			label = document.createElement("Label");
			label.innerHTML = "Enter private description of issuance:";
			label.setAttribute('for',"issuancedescription");
			
			span.appendChild(label);
			
			textbox = document.createElement("input"); //input element, text
			textbox.setAttribute('type',"text");
			textbox.setAttribute('name',"issuancedescription");
			textbox.classList.add('form-textbox');
			textbox.value = localdescription;
			
			span.appendChild(textbox);

			// number of shares
			span = document.createElement("span");
			form.appendChild(span);

			label = document.createElement("Label");
			label.innerHTML = "Enter number of shares issued in this issuance:";
			label.setAttribute('for',"numberofshares");
			
			span.appendChild(label);
			
			textbox = document.createElement("input"); //input element, text
			textbox.setAttribute('type',"text");
			textbox.setAttribute('name',"numberofshares");
			textbox.classList.add('form-textbox');
			textbox.value = localnumberofshares;
			
			span.appendChild(textbox);

			// percent of capital
			span = document.createElement("span");
			form.appendChild(span);

			label = document.createElement("Label");
			label.innerHTML = "Enter percent of final capital of this issuance (20 000 = 20%):";
			label.setAttribute('for',"percentofcapital");
			
			span.appendChild(label);
			
			textbox = document.createElement("input"); //input element, text
			textbox.setAttribute('type',"text");
			textbox.setAttribute('name',"percentofcapital");
			textbox.classList.add('form-textbox');
			textbox.value = localpercentofcapital;
			
			span.appendChild(textbox);

			
			//
			// wallet
			//
			var gaslimit = 4712388;
			var gasPrice = 100000000000;
			
			var walletaddress = null;
			
			var global = this.global;
			
			if (global.useWalletAccount()) {
				// do we pay everything from a single wallet
				walletaddress = global.getWalletAccountAddress();
			}
			else {
				// or from the wallet of the owner of the contract
				walletaddress = contract.getLocalOwner();
			}
			
			if (walletaddress) {
				// we display the balance
				var wallet = global.getAccountObject(walletaddress);
				
				var divbalance = document.createElement("div");
				divbalance.classList.add('div-form-cue');
				
				/*var balance = wallet.getBalance();
				
				var balancetext = Forms.getEtherStringFromWei(balance);
				
				divbalance.innerHTML = 'The account ' + wallet.getAddress() + ' has ' + balancetext + ' Ether';*/
				
				Forms.writebalance(wallet, divbalance);
				
				formcontainer.appendChild(divbalance);
			}

			// account wallet used
			span = document.createElement("span");
			form.appendChild(span);

			label = document.createElement("Label");
			label.innerHTML = "Wallet used:";
			label.setAttribute('for',"wallet");
			span.appendChild(label);
			
			textbox = document.createElement("input"); //input element, text
			textbox.setAttribute('type',"text");
			textbox.setAttribute('name',"wallet");
			textbox.classList.add('form-textbox');
			textbox.value = walletaddress;

			span.appendChild(textbox);

			// account wallet password
			span = document.createElement("span");
			form.appendChild(span);

			label = document.createElement("Label");
			label.innerHTML = "Password:";
			label.setAttribute('for',"password");
			span.appendChild(label);
			
			textbox = document.createElement("input"); //input element, text
			textbox.setAttribute('type',"password");
			textbox.setAttribute('name',"password");
			textbox.classList.add('form-textbox');

			span.appendChild(textbox);

			// gas limit text box
			span = document.createElement("span");
			form.appendChild(span);

			label = document.createElement("Label");
			label.innerHTML = "Gas limit:";
			label.setAttribute('for',"gaslimit");
			span.appendChild(label);
			
			textbox = document.createElement("input"); //input element, text
			textbox.setAttribute('type',"text");
			textbox.setAttribute('name',"gaslimit");
			textbox.classList.add('form-textbox');
			textbox.style = "width: 100px;";
			textbox.value = gaslimit;

			span.appendChild(textbox);
			
			// gas price text box
			span = document.createElement("span");
			form.appendChild(span);

			label = document.createElement("Label");
			label.innerHTML = "Gas price:";
			label.setAttribute('for',"gasPrice");
			span.appendChild(label);
			
			textbox = document.createElement("input"); //input element, text
			textbox.setAttribute('type',"text");
			textbox.setAttribute('name',"gasPrice");
			textbox.classList.add('form-textbox');
			textbox.style = "width: 100px;";
			textbox.value = gasPrice;

			span.appendChild(textbox);
			
			// button
			var spanbutton = document.createElement("span");
			form.appendChild(spanbutton);

			var button = document.createElement("input"); //input element, Submit button
			button.setAttribute('type',"submit");
			button.setAttribute('value',"Deploy");
			button.classList.add('form-button');
			button.classList.add('btn-deploy_issuance');

			if (!isLocalOnly) {
				// already deployed, de-activate the form
				button.setAttribute('disabled',"disabled");
				button.disabled = true;
			}

			// event handler
			var app = this.global.getAppObject();
			var controllers = this.global.getControllersObject();
			var handler = controllers.handleDeployIssuance;
			
			app.bindEvent('click', '.btn-deploy_issuance', handler);
			
			
			spanbutton.appendChild(button);

			
			// and this form in the form band

			// set top level message
			app.setMessage('please enter the final elements that will be deployed on the blockchain.');
			
		}

		
		// and add this form in the form band
		app.addForm(formcontainer);
		
		return true;
	}
	
	//
	// Transactions
	//

	getTransactionListFormTabs() {
		var tabs = document.createElement("div");
		tabs.classList.add('div-form-tabs');
		
		var tabs = document.createElement("div");
		tabs.classList.add('div-form-tabs');

		var divtab1 = document.createElement("div");
		
		tabs.appendChild(divtab1);
		
		var span1 = document.createElement("span");
		
		divtab1.appendChild(span1);

		var global = this.global;
		var controllers = this.global.getControllersObject();
		
		var handler_select_form = controllers.handleSelectContractForm;

		var tab1;
		
		var tabtext1 = "Create transaction";
		
		var Global = global.getGlobalClass();
		
		if (global.currentformband == Global.FORM_CREATE_TRANSACTION) {
			tab1 = document.createTextNode(tabtext1);
			divtab1.classList.add('div-form-selected-tab');

		}
		else {
			// default
			tab1 = document.createTextNode(tabtext1);
			divtab1.classList.add('div-form-selected-tab');
		}

		span1.appendChild(tab1);
		
		return tabs;
	}
	
	getTransactionFormTabs() {
		var tabs = document.createElement("div");
		tabs.classList.add('div-form-tabs');
		
		var divtab1 = document.createElement("div");
		var divtab2 = document.createElement("div");
		
		tabs.appendChild(divtab1);
		tabs.appendChild(divtab2);
		
		tabs.appendChild(divtab1);
		tabs.appendChild(divtab2);
		
		var span1 = document.createElement("span");
		var span2 = document.createElement("span");
		
		divtab1.appendChild(span1);
		divtab2.appendChild(span2);
		
		var global = this.global;
		var controllers = this.global.getControllersObject();
		
		var handler_select_form = controllers.handleSelectContractForm;

		var tab1;
		var tab2;
		
		var tabtext1 = "Modify transaction";
		var tabtext2 = "Deploy transaction";
		
		var Global = global.getGlobalClass();
		
		if (global.currentformband == Global.FORM_MODIFY_TRANSACTION) {
			tab1 = document.createTextNode(tabtext1);
			divtab1.classList.add('div-form-selected-tab');

			tab2 = Forms.createLink(tabtext2, tabtext2, "lnk_deploy_transaction", ["deploy_transaction"]);
			tab2.onclick = handler_select_form;
			divtab2.classList.add('div-form-tab');
		}
		else {
			// default
			tab1 = Forms.createLink(tabtext1, tabtext1, "lnk_modify_transaction", ["modify_transaction"]);
			tab1.onclick = handler_select_form;
			divtab1.classList.add('div-form-tab');
			
			tab2 = document.createTextNode(tabtext2);
			divtab2.classList.add('div-form-selected-tab');
		}

		span1.appendChild(tab1);
		span2.appendChild(tab2);
		
		return tabs;
	}
	
	displayCreateTransactionForm(contract) {
		var global = this.global;
		
		// container (direct child of band)
		var formcontainer = document.createElement("div");
		formcontainer.classList.add('div-form-container');
		
		// tabs
		var tabs = this.getTransactionListFormTabs();
		formcontainer.appendChild(tabs);
		
		// core of the form
		var form = document.createElement("div");
		form.classList.add('div-form');
		
		formcontainer.appendChild(form);
		
		if (contract) {
			var session = this.global.getSessionObject();
			var ownsContract = session.ownsContract(contract);
			
			var contractindex = contract.getContractIndex();
			
			// contract index hidden field
			var fieldcontractindex = document.createElement("input"); //input element, text
			fieldcontractindex.setAttribute('type',"hidden");
			fieldcontractindex.setAttribute('name',"contractindex");
			fieldcontractindex.value = contractindex;
			
			form.appendChild(fieldcontractindex);

			
			var span;
			var label;
			var textbox;
			var selectbox;

			
			// from drop down
			span = document.createElement("span");
			form.appendChild(span);

			label = document.createElement("Label");
			label.innerHTML = "From:";
			label.setAttribute('for',"from");
			
			span.appendChild(label);
			
			selectbox = document.createElement('select'); //drop down list
			selectbox.setAttribute('name',"from");
			selectbox.setAttribute('id',"from");
			selectbox.classList.add('form-select');
			
			span.appendChild(selectbox);
			
			// fill with values
			var fillstakeholderselect = function (contract, selectbox) {
				return contract.getChainStakeHolderList(function(err, res) {
					if (res) {
						console.log("retrieved a list of " + res.length + " stakeholders, filling dropdown ");
						for (var i = 0; i < res.length; i++) {
							var stakeholder = res[i];
				
						    var option = document.createElement('option');
						    var stakeholderaddress = stakeholder.getAddress();
						    var stakeholderidentifier = global.getStakeholderDisplayName(stakeholderaddress, contract);
						    
						    option.setAttribute('value', stakeholderaddress);
						    option.textContent = stakeholderidentifier;
						    selectbox.appendChild(option);
						}					
					}
					
					if (err) {
						console.log(err);
					}
				})
			};
			
			fillstakeholderselect(contract, selectbox);

			// to drop down
			span = document.createElement("span");
			form.appendChild(span);

			label = document.createElement("Label");
			label.innerHTML = "To:";
			label.setAttribute('for',"to");
			
			span.appendChild(label);
			
			selectbox = document.createElement('select'); //drop down list
			selectbox.setAttribute('name',"to");
			selectbox.setAttribute('id',"to");
			selectbox.classList.add('form-select');
			
			span.appendChild(selectbox);
			
			// fill with values
			fillstakeholderselect(contract, selectbox);
			
			
			// issuance drop down
			span = document.createElement("span");
			form.appendChild(span);

			label = document.createElement("Label");
			label.innerHTML = "Issuance:";
			label.setAttribute('for',"issuancenumber");
			
			span.appendChild(label);
			
			selectbox = document.createElement('select'); //drop down list
			selectbox.setAttribute('name',"issuancenumber");
			selectbox.setAttribute('id',"issuancenumber");
			selectbox.classList.add('form-select');
			
			span.appendChild(selectbox);
			
			// fill with values
			var fillissuanceselect = function (contract, selectbox) {
				return contract.getChainIssuanceList(function(err, res) {
					if (res) {
						console.log("retrieved a list of " + res.length + " issuances, filling dropdown ");
						for (var i = 0; i < res.length; i++) {
							var issuance = res[i];
				
						    var option = document.createElement('option');
						    option.setAttribute('value', issuance.getChainNumber());
						    option.textContent = issuance.getChainNumber();
						    selectbox.appendChild(option);
						}					
					}
					
					if (err) {
						console.log(err);
					}
				})
			};
			
			fillissuanceselect(contract, selectbox);
			

			// number of shares
			span = document.createElement("span");
			form.appendChild(span);

			label = document.createElement("Label");
			label.innerHTML = "Enter number of shares transferred:";
			label.setAttribute('for',"numberofshares");
			
			span.appendChild(label);
			
			textbox = document.createElement("input"); //input element, text
			textbox.setAttribute('type',"text");
			textbox.setAttribute('name',"numberofshares");
			textbox.classList.add('form-textbox');
			
			span.appendChild(textbox);

			// consideration
			span = document.createElement("span");
			form.appendChild(span);

			label = document.createElement("Label");
			label.innerHTML = "Enter the total amount:";
			label.setAttribute('for',"consideration");
			
			span.appendChild(label);
			
			textbox = document.createElement("input"); //input element, text
			textbox.setAttribute('type',"text");
			textbox.setAttribute('name',"consideration");
			textbox.classList.add('form-textbox');
			textbox.style = "width: 250px;";
			
			span.appendChild(textbox);

			// currency
			span = document.createElement("span");
			form.appendChild(span);

			label = document.createElement("Label");
			label.innerHTML = "Enter currency (e.g. EUR, USD,..):";
			label.setAttribute('for',"currency");
			
			span.appendChild(label);
			
			textbox = document.createElement("input"); //input element, text
			textbox.setAttribute('type',"text");
			textbox.setAttribute('name',"currency");
			textbox.classList.add('form-textbox');
			textbox.style = "width: 100px;";
			
			span.appendChild(textbox);

			
			// button
			var spanbutton = document.createElement("span");
			form.appendChild(spanbutton);

			var button = document.createElement("input"); //input element, Submit button
			button.setAttribute('type',"submit");
			button.setAttribute('value',"Create");
			button.classList.add('form-button');
			button.classList.add('btn-create_transaction');

			// event handler
			var app = this.global.getAppObject();
			var controllers = this.global.getControllersObject();
			var handler = controllers.handleCreateTransaction;
			
			app.bindEvent('click', '.btn-create_transaction', handler);
			
			
			spanbutton.appendChild(button);
		}
		

		// set top level message
		app.setMessage('please enter a unique specific identifier to find the corresponding shareholder.');

		
		// and add this form in the form band
		app.addForm(formcontainer);
		
		return true;
	}
	
	displayModifyTransactionForm(contract, transaction) {
		
		var global = this.global;
		
		// container (direct child of band)
		var formcontainer = document.createElement("div");
		formcontainer.classList.add('div-form-container');
		
		// tabs
		var tabs = this.getTransactionFormTabs();
		formcontainer.appendChild(tabs);
		
		// core of the form
		var form = document.createElement("div");
		form.classList.add('div-form');
		
		formcontainer.appendChild(form);
		
		
		if ((contract) && (transaction)) {
			var session = this.global.getSessionObject();
			var ownsContract = session.ownsContract(contract);
			
			var contractindex = contract.getContractIndex();
			var transactionindex = transaction.getTransactionIndex();
			
			// contract index hidden field
			var fieldcontractindex = document.createElement("input"); //input element, text
			fieldcontractindex.setAttribute('type',"hidden");
			fieldcontractindex.setAttribute('name',"contractindex");
			fieldcontractindex.value = contractindex;
			
			form.appendChild(fieldcontractindex);
			
			// issuance index hidden field
			var fieldtransactionindex = document.createElement("input"); //input element, text
			fieldtransactionindex.setAttribute('type',"hidden");
			fieldtransactionindex.setAttribute('name',"transactionindex");
			fieldtransactionindex.value = transactionindex;
			
			form.appendChild(fieldtransactionindex);
			
			
			var isLocalOnly = transaction.isLocalOnly();
			
		    var localfrom = transaction.getLocalFrom();
		    var localto = transaction.getLocalTo();
		    var localissuancenumber = transaction.getLocalIssuanceNumber();
		    var localnumberofshares = transaction.getLocalNumberOfShares();
		    var localconsideration = transaction.getLocalConsideration();
		    var localcurrency = transaction.getLocalCurrency();

			var span;
			var label;
			var textbox;
			var selectbox;

			
			// from drop down
			span = document.createElement("span");
			form.appendChild(span);

			label = document.createElement("Label");
			label.innerHTML = "From:";
			label.setAttribute('for',"from");
			
			span.appendChild(label);
			
			selectbox = document.createElement('select'); //drop down list
			selectbox.setAttribute('name',"from");
			selectbox.setAttribute('id',"from");
			selectbox.classList.add('form-select');
			
			span.appendChild(selectbox);
			
			// fill with values
			var fillstakeholderselect = function (contract, selectbox, selectedvalue) {
				return contract.getChainStakeHolderList(function(err, res) {
					if (res) {
						console.log("retrieved a list of " + res.length + " stakeholders, filling dropdown ");
						
						for (var i = 0; i < res.length; i++) {
							var stakeholder = res[i];
				
							var option = document.createElement('option');
						    var stakeholderaddress = stakeholder.getAddress();
						    var stakeholderidentifier = global.getStakeholderDisplayName(stakeholderaddress, contract);
						    
						    option.setAttribute('value', stakeholderaddress);
						    option.textContent = stakeholderidentifier;
						    
						    if (global.areAddressesEqual(stakeholderaddress, selectedvalue)) {
						    	selectbox.selectedIndex = i;
						    	option.selected = 'selected';
						    }
						    
						    selectbox.appendChild(option);
						}					
					}
					
					if (err) {
						console.log(err);
					}
				})
			};
			
			fillstakeholderselect(contract, selectbox, localfrom);

			// to drop down
			span = document.createElement("span");
			form.appendChild(span);

			label = document.createElement("Label");
			label.innerHTML = "To:";
			label.setAttribute('for',"to");
			
			span.appendChild(label);
			
			selectbox = document.createElement('select'); //drop down list
			selectbox.setAttribute('name',"to");
			selectbox.setAttribute('id',"to");
			selectbox.classList.add('form-select');
			
			span.appendChild(selectbox);
			
			// fill with values
			fillstakeholderselect(contract, selectbox, localto);
			
			
			// issuance drop down
			span = document.createElement("span");
			form.appendChild(span);

			label = document.createElement("Label");
			label.innerHTML = "Issuance:";
			label.setAttribute('for',"issuancenumber");
			
			span.appendChild(label);
			
			selectbox = document.createElement('select'); //drop down list
			selectbox.setAttribute('name',"issuancenumber");
			selectbox.setAttribute('id',"issuancenumber");
			selectbox.classList.add('form-select');
			
			span.appendChild(selectbox);
			
			// fill with values
			var fillissuanceselect = function (contract, selectbox, selectedvalue) {
				return contract.getChainIssuanceList(function(err, res) {
					if (res) {
						console.log("retrieved a list of " + res.length + " issuances, filling dropdown ");
						
						for (var i = 0; i < res.length; i++) {
							var issuance = res[i];
				
						    var issuancenumber = issuance.getChainNumber();
							var option = document.createElement('option');
						    option.setAttribute('value', issuancenumber);
						    option.textContent = issuancenumber;
						    
						    if (issuancenumber == selectedvalue) {
						    	selectbox.selectedIndex = i;
						    	option.selected = 'selected';
						    }
						    
						    selectbox.appendChild(option);
						}					
					}
					
					if (err) {
						console.log(err);
					}
				})
			};
			
			fillissuanceselect(contract, selectbox, localissuancenumber);
			

			// number of shares
			span = document.createElement("span");
			form.appendChild(span);

			label = document.createElement("Label");
			label.innerHTML = "Enter number of shares transferred:";
			label.setAttribute('for',"numberofshares");
			
			span.appendChild(label);
			
			textbox = document.createElement("input"); //input element, text
			textbox.setAttribute('type',"text");
			textbox.setAttribute('name',"numberofshares");
			textbox.classList.add('form-textbox');
			textbox.value = localnumberofshares;
			
			span.appendChild(textbox);

			// consideration
			span = document.createElement("span");
			form.appendChild(span);

			label = document.createElement("Label");
			label.innerHTML = "Enter the total amount:";
			label.setAttribute('for',"consideration");
			
			span.appendChild(label);
			
			textbox = document.createElement("input"); //input element, text
			textbox.setAttribute('type',"text");
			textbox.setAttribute('name',"consideration");
			textbox.classList.add('form-textbox');
			textbox.style = "width: 250px;";
			textbox.value = localconsideration;
			
			span.appendChild(textbox);

			// currency
			span = document.createElement("span");
			form.appendChild(span);

			label = document.createElement("Label");
			label.innerHTML = "Enter currency (e.g. EUR, USD,..):";
			label.setAttribute('for',"currency");
			
			span.appendChild(label);
			
			textbox = document.createElement("input"); //input element, text
			textbox.setAttribute('type',"text");
			textbox.setAttribute('name',"currency");
			textbox.classList.add('form-textbox');
			textbox.style = "width: 100px;";
			textbox.value = localcurrency;
			
			span.appendChild(textbox);


			
			// button
			var spanbutton = document.createElement("span");
			form.appendChild(spanbutton);

			var button = document.createElement("input"); //input element, Submit button
			button.setAttribute('type',"submit");
			button.setAttribute('value',"Modify");
			button.classList.add('form-button');
			button.classList.add('btn-modify_transaction');
			
			if (!isLocalOnly) {
				// already deployed, de-activate the form
				button.setAttribute('disabled',"disabled");
				button.disabled = true;
			}

			// event handler
			var app = this.global.getAppObject();
			var controllers = this.global.getControllersObject();
			var handler = controllers.handleModifyTransaction;
			
			app.bindEvent('click', '.btn-modify_transaction', handler);
			
			
			spanbutton.appendChild(button);
		}

		
		// set top level message
		app.setMessage('you can modify parameters of this transaction until its deployment.');

		
		// and add this form in the form band
		app.addForm(formcontainer);
		
		return true;
		
		// and this form in the form band
		var app = this.global.getAppObject();
	
		app.addForm(formcontainer);
		
		return true;
		
	}
	

	displayDeployTransactionForm(contract, transaction) {
		var global = this.global;
		
		// container (direct child of band)
		var formcontainer = document.createElement("div");
		formcontainer.classList.add('div-form-container');
		
		// tabs
		var tabs = this.getTransactionFormTabs();
		formcontainer.appendChild(tabs);
		
		// core of the form
		var form = document.createElement("div");
		form.classList.add('div-form');
		
		formcontainer.appendChild(form);
		
		var span;
		var label;
		var textbox;
		var selectbox;
		
		if ((contract) && (transaction)) {
			var session = this.global.getSessionObject();
			var ownsContract = session.ownsContract(contract);
			
			var contractindex = contract.getContractIndex();
			var transactionindex = transaction.getTransactionIndex();
			
			// contract index hidden field
			var fieldcontractindex = document.createElement("input"); //input element, text
			fieldcontractindex.setAttribute('type',"hidden");
			fieldcontractindex.setAttribute('name',"contractindex");
			fieldcontractindex.value = contractindex;
			
			form.appendChild(fieldcontractindex);
			
			// issuance index hidden field
			var fieldtransactionindex = document.createElement("input"); //input element, text
			fieldtransactionindex.setAttribute('type',"hidden");
			fieldtransactionindex.setAttribute('name',"transactionindex");
			fieldtransactionindex.value = transactionindex;
			
			form.appendChild(fieldtransactionindex);
			
			
			var isLocalOnly = transaction.isLocalOnly();
			
		    var localfrom = transaction.getLocalFrom();
		    var localto = transaction.getLocalTo();
		    var localissuancenumber = transaction.getLocalIssuanceNumber();
		    var localnumberofshares = transaction.getLocalNumberOfShares();
		    var localconsideration = transaction.getLocalConsideration();
		    var localcurrency = transaction.getLocalCurrency();

			var span;
			var label;
			var textbox;
			var selectbox;

			
			// from drop down
			span = document.createElement("span");
			form.appendChild(span);

			label = document.createElement("Label");
			label.innerHTML = "From:";
			label.setAttribute('for',"from");
			
			span.appendChild(label);
			
			selectbox = document.createElement('select'); //drop down list
			selectbox.setAttribute('name',"from");
			selectbox.setAttribute('id',"from");
			selectbox.classList.add('form-select');
			
			span.appendChild(selectbox);
			
			// fill with values
			var fillstakeholderselect = function (contract, selectbox, selectedvalue) {
				return contract.getChainStakeHolderList(function(err, res) {
					if (res) {
						console.log("retrieved a list of " + res.length + " stakeholders, filling dropdown ");

						for (var i = 0; i < res.length; i++) {
							var stakeholder = res[i];
				
							var option = document.createElement('option');
						    var stakeholderaddress = stakeholder.getAddress();
						    var stakeholderidentifier = global.getStakeholderDisplayName(stakeholderaddress, contract);
						    
						    option.setAttribute('value', stakeholderaddress);
						    option.textContent = stakeholderidentifier;
						    
						    if (global.areAddressesEqual(stakeholderaddress, selectedvalue)) {
						    	selectbox.selectedIndex = i;
						    	option.selected = 'selected';
						    }
						    
						    selectbox.appendChild(option);
						}					
					}
					
					if (err) {
						console.log(err);
					}
				})
			};
			
			fillstakeholderselect(contract, selectbox, localfrom);

			// to drop down
			span = document.createElement("span");
			form.appendChild(span);

			label = document.createElement("Label");
			label.innerHTML = "To:";
			label.setAttribute('for',"to");
			
			span.appendChild(label);
			
			selectbox = document.createElement('select'); //drop down list
			selectbox.setAttribute('name',"to");
			selectbox.setAttribute('id',"to");
			selectbox.classList.add('form-select');
			
			span.appendChild(selectbox);
			
			// fill with values
			fillstakeholderselect(contract, selectbox, localto);
			
			
			// issuance drop down
			span = document.createElement("span");
			form.appendChild(span);

			label = document.createElement("Label");
			label.innerHTML = "Issuance:";
			label.setAttribute('for',"issuancenumber");
			
			span.appendChild(label);
			
			selectbox = document.createElement('select'); //drop down list
			selectbox.setAttribute('name',"issuancenumber");
			selectbox.setAttribute('id',"issuancenumber");
			selectbox.classList.add('form-select');
			
			span.appendChild(selectbox);
			
			// fill with values
			var fillissuanceselect = function (contract, selectbox, selectedvalue) {
				return contract.getChainIssuanceList(function(err, res) {
					if (res) {
						console.log("retrieved a list of " + res.length + " issuances, filling dropdown ");

						for (var i = 0; i < res.length; i++) {
							var issuance = res[i];
				
						    var issuancenumber = issuance.getChainNumber();
							var option = document.createElement('option');
						    option.setAttribute('value', issuancenumber);
						    option.textContent = issuancenumber;
						    
						    if (issuancenumber == selectedvalue) {
						    	selectbox.selectedIndex = i;
						    	option.selected = 'selected';
						    }
						    
						    selectbox.appendChild(option);
						}					
					}
					
					if (err) {
						console.log(err);
					}
				})
			};
			
			fillissuanceselect(contract, selectbox, localissuancenumber);
			

			// number of shares
			span = document.createElement("span");
			form.appendChild(span);

			label = document.createElement("Label");
			label.innerHTML = "Enter number of shares transferred:";
			label.setAttribute('for',"numberofshares");
			
			span.appendChild(label);
			
			textbox = document.createElement("input"); //input element, text
			textbox.setAttribute('type',"text");
			textbox.setAttribute('name',"numberofshares");
			textbox.classList.add('form-textbox');
			textbox.value = localnumberofshares;
			
			span.appendChild(textbox);

			// consideration
			span = document.createElement("span");
			form.appendChild(span);

			label = document.createElement("Label");
			label.innerHTML = "Enter the total amount:";
			label.setAttribute('for',"consideration");
			
			span.appendChild(label);
			
			textbox = document.createElement("input"); //input element, text
			textbox.setAttribute('type',"text");
			textbox.setAttribute('name',"consideration");
			textbox.classList.add('form-textbox');
			textbox.style = "width: 250px;";
			textbox.value = localconsideration;
			
			span.appendChild(textbox);

			// currency
			span = document.createElement("span");
			form.appendChild(span);

			label = document.createElement("Label");
			label.innerHTML = "Enter currency (e.g. EUR, USD,..):";
			label.setAttribute('for',"currency");
			
			span.appendChild(label);
			
			textbox = document.createElement("input"); //input element, text
			textbox.setAttribute('type',"text");
			textbox.setAttribute('name',"currency");
			textbox.classList.add('form-textbox');
			textbox.style = "width: 100px;";
			textbox.value = localcurrency;
			
			span.appendChild(textbox);

			
			//
			// wallet
			//
			var gaslimit = 4712388;
			var gasPrice = 100000000000;
			
			var walletaddress = null;
			
			var global = this.global;
			
			if (global.useWalletAccount()) {
				// do we pay everything from a single wallet
				walletaddress = global.getWalletAccountAddress();
			}
			else {
				// or from the wallet of the owner of the contract
				walletaddress = contract.getLocalOwner();
			}
			
			if (walletaddress) {
				// we display the balance
				var wallet = global.getAccountObject(walletaddress);
				
				var divbalance = document.createElement("div");
				divbalance.classList.add('div-form-cue');
				
				/*var balance = wallet.getBalance();
				
				var balancetext = Forms.getEtherStringFromWei(balance);
				
				divbalance.innerHTML = 'The account ' + wallet.getAddress() + ' has ' + balancetext + ' Ether';*/
				
				Forms.writebalance(wallet, divbalance);
				
				formcontainer.appendChild(divbalance);
			}

			// account wallet used
			span = document.createElement("span");
			form.appendChild(span);

			label = document.createElement("Label");
			label.innerHTML = "Wallet used:";
			label.setAttribute('for',"wallet");
			span.appendChild(label);
			
			textbox = document.createElement("input"); //input element, text
			textbox.setAttribute('type',"text");
			textbox.setAttribute('name',"wallet");
			textbox.classList.add('form-textbox');
			textbox.value = walletaddress;

			span.appendChild(textbox);

			// account wallet password
			span = document.createElement("span");
			form.appendChild(span);

			label = document.createElement("Label");
			label.innerHTML = "Password:";
			label.setAttribute('for',"password");
			span.appendChild(label);
			
			textbox = document.createElement("input"); //input element, text
			textbox.setAttribute('type',"password");
			textbox.setAttribute('name',"password");
			textbox.classList.add('form-textbox');

			span.appendChild(textbox);

			// gas limit text box
			span = document.createElement("span");
			form.appendChild(span);

			label = document.createElement("Label");
			label.innerHTML = "Gas limit:";
			label.setAttribute('for',"gaslimit");
			span.appendChild(label);
			
			textbox = document.createElement("input"); //input element, text
			textbox.setAttribute('type',"text");
			textbox.setAttribute('name',"gaslimit");
			textbox.classList.add('form-textbox');
			textbox.style = "width: 100px;";
			textbox.value = gaslimit;

			span.appendChild(textbox);
			
			// gas price text box
			span = document.createElement("span");
			form.appendChild(span);

			label = document.createElement("Label");
			label.innerHTML = "Gas price:";
			label.setAttribute('for',"gasPrice");
			span.appendChild(label);
			
			textbox = document.createElement("input"); //input element, text
			textbox.setAttribute('type',"text");
			textbox.setAttribute('name',"gasPrice");
			textbox.classList.add('form-textbox');
			textbox.style = "width: 100px;";
			textbox.value = gasPrice;

			span.appendChild(textbox);
			
			// button
			var spanbutton = document.createElement("span");
			form.appendChild(spanbutton);

			var button = document.createElement("input"); //input element, Submit button
			button.setAttribute('type',"submit");
			button.setAttribute('value',"Deploy");
			button.classList.add('form-button');
			button.classList.add('btn-deploy_transaction');

			if (!isLocalOnly) {
				// already deployed, de-activate the form
				button.setAttribute('disabled',"disabled");
				button.disabled = true;
			}

			// event handler
			var app = this.global.getAppObject();
			var controllers = this.global.getControllersObject();
			var handler = controllers.handleDeployTransaction;
			
			app.bindEvent('click', '.btn-deploy_transaction', handler);
			
			
			spanbutton.appendChild(button);

			
			// and this form in the form band

			// set top level message
			app.setMessage('please enter the final elements that will be deployed on the blockchain.');
			
		}

		
		// and add this form in the form band
		app.addForm(formcontainer);
		
		return true;
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
	
	static getEtherStringFromWei(wei, decimal) {
		var ether = GlobalClass.getEtherFromwei(wei);
		return ether.toFixed(decimal);
	}
	
	static writebalance(wallet, divbalance) {
		console.log('spawning write of getBalance');
		var res = wallet.getChainBalance(function(err, res) {
			if (!err) {
				var balancetext = Forms.getEtherStringFromWei(res);
				
				divbalance.innerHTML = 'The account ' + wallet.getAddress() + ' has ' + balancetext + ' Ether';
			}
			else {
				console.log(err);
			}
		});
	}
	
}

GlobalClass.Forms = Forms;