pragma solidity ^0.4.18;

contract StockLedger {
	// implementing the stock ledger (share register, share ledger,..)
	// for a SME

	string public contract_name;
	uint public contract_version;

	// company
	address public owner;
	string public owner_pubkey; // asymmetric public key (rsa)

	string public ledger_name;
	string public cocrypted_ledger_description;
	
	uint public creation_date; // unix time
	uint public creation_block_date; // now in block number
	
	address public replaced_by;
	uint public replacement_date; // unix time
	uint public replacement_block_date; // now in block number
	
	string public next_orderid;
	
	// account list (key pairs created for this contract)
	Account[] accounts;
	
	struct Account {
	    address acct_address;
	    
	    string rsa_pubkey;
	    string ece_pubkey;
	    
	    string cocrypted_acct_privkey; 
	}

 	// shareholder list
	ShareHolder[] shareholders;
	
	struct ShareHolder {
	    address shldr_address;
	    string shldr_pubkey; // asymmetric public key (rsa)
	    
	    string cocrypted_shldr_privkey; //  asymmetric encryption with owner's public key
	    string cocrypted_shldr_identifier; // string that can uniquely identify shareholder (e.g. email)
	    
	    uint registration_date; // unix time
	    uint block_date; // now in block number
	    
		address replacing; // in case, shareholder's private key is compromised or shareholder is registered after inscription by seller
	    
	    address creator; // can be owner, or a seller of shares

	    string crtcrypted_shldr_description_string; // symmetric encryption with creator's private key
	    string crtcrypted_shldr_identifier;
		
	    string shldrcrypted_shldr_description_string; // asymmetric encryption with shareholder's public key
	    string shldrcrypted_shldr_identifier;
		
		string orderid; // unique, provided by contract next_orderid
        string signature; // signature of orderid with creator's private key
	}

    // issuances
	Issuance[] issuances;
	
	struct Issuance {
	    uint numberofshares;
	    uint percentofcapital; // 20 000 represents 20% of capital for new shares
	    
	    uint issuance_date; // unix time
	    uint block_date; // now in block number
	    
	    string name;
	    string cocrypted_description; // symmetric encryption with owner's private key
	    
	    string issuance_type; // type of shares, options,..
	    string code; // code for issuance, could be ISIN code
	    
	    uint cancel_date; // unix time
	    uint cancel_block_date; // now in block number
	    
		string orderid; // unique, provided by contract next_orderid
        string signature; // signature of orderid with owner' address's private ke
        
	}
	
    // stock transactions
	StockTransaction[] public stocktransactions;

	struct StockTransaction {
		address from;
		address to;
		
		uint transactiondate; // unix time
		uint block_date; 
		
		uint8 nature; // 0 creation, 1 registered transfer (reserved to owner), 2 destruction, above 10 freely defined (e.g. 11 signed endorsement, 12 withdrawal/repurchase,..)
		
		uint issuanceindex; // issuance number is 1 based
        
		uint numberofshares;
		
		uint consideration;
		string currency;
		
		address creator;
		
		string orderid; // unique, provided by contract next_orderid
        string signature; // signature of orderid with from' address's private key
	}

	// constructor
	function StockLedger(address _owner, string _owner_pubkey, string _crtcrypted_owner_identifier, string _ledger_name, string _cocrypted_ledger_description) public {
		contract_name = "stockledger";
		contract_version = 20180101;
		
		replaced_by = address(0);
		
		owner = _owner;
		owner_pubkey = _owner_pubkey;
		
		ledger_name = _ledger_name;
		cocrypted_ledger_description = _cocrypted_ledger_description;
		
		shareholders.length = 1; // company as initial holder of shares
		
        ShareHolder storage __shldr = shareholders[0] ;
        
        __shldr.shldr_address = _owner;
        __shldr.shldr_pubkey = _owner_pubkey;
        __shldr.cocrypted_shldr_privkey = "0x"; // we do not store owner's private key
        __shldr.cocrypted_shldr_identifier = "0x";
        
        __shldr.replacing = 0x0;
        
        __shldr.creator = _owner;
        __shldr.crtcrypted_shldr_description_string = "0x"; 
        __shldr.crtcrypted_shldr_identifier = _crtcrypted_owner_identifier;
        
        __shldr.shldrcrypted_shldr_description_string = "0x";
        __shldr.shldrcrypted_shldr_identifier = "0x";
		
        __shldr.orderid = "1";
 		__shldr.signature = "0x";

		issuances.length = 0;
		
        stocktransactions.length = 0;
        
		next_orderid = newNextOrderId();
	}
	
	// contract life cycle
	function reclaimContractBalance() public payable returns (bool success) {
	    // if balance is positive, send ethers to owner
	    if (this.balance > 0) {
	        owner.transfer(this.balance);
	        
	        return true;
	    }
	    
	    return false;
	}
	

	// registered accounts (self registration)
	function registerAccount(address _acct_address, string _rsa_pubkey, string _ece_pubkey, string _cocrypted_acct_privkey) public payable returns (uint _acctindex) {
	    int _acct_number = this.findAccountNumber(_acct_address);
	    require(_acct_number == -1); // not already in the list

	    uint __current_number_of_accounts = accounts.length;

	    accounts.length = __current_number_of_accounts + 1; // grow the list
	    
        Account storage __acct = accounts[__current_number_of_accounts];
       
        __acct.acct_address = _acct_address;
        __acct.rsa_pubkey = _rsa_pubkey;
        __acct.ece_pubkey = _ece_pubkey;
        __acct.cocrypted_acct_privkey = _cocrypted_acct_privkey;
       
 	    _acctindex = __current_number_of_accounts;
	}

	function getAccountCount() public view returns (uint _count) {
	    _count = accounts.length;
	}
	
	function getAccountAt(uint _index) public view returns (address _acct_address, string _rsa_pubkey, string _ece_pubkey, string _cocrypted_acct_privkey) {
	    uint __current_number_of_accounts = accounts.length;
	    
	    require((_index >= 0) && (_index < __current_number_of_accounts));
	    
	    Account storage __acct = accounts[_index];
	    
        _acct_address = __acct.acct_address;
        _rsa_pubkey = __acct.rsa_pubkey;
        _ece_pubkey = __acct.ece_pubkey;
        _cocrypted_acct_privkey = __acct.cocrypted_acct_privkey;
    }
	
	function findAccountNumber(address _acct_address) public view returns (int _number) {
	    _number = -1;
	    
	    for (uint i = 0; i < accounts.length; i++) {
	        Account storage __acct = accounts[i];
	        
	        if (__acct.acct_address == _acct_address) {
	             _number = int(i);
	             
	             break;
	        }
	    }
	}
	
	// registered shareholders (registration by owner or sellers)
	function registerShareHolder(address _shldr_address, string _shldr_pubkey, 
								string _cocrypted_shldr_privkey, string _cocrypted_shldr_identifier, uint _registration_date, 
								address _creator, string _crtcrypted_shldr_description_string, string _crtcrypted_shldr_identifier, 
								string _orderid, string _signature,
								string _shldrcrypted_shldr_string, string _shldrcrypted_shldr_identifier) public payable returns (uint _shldrindex) {
	    // done by the owner of the ledger, or a shareholder selling their shares

	    require(stringsEqual(next_orderid, _orderid));
	    next_orderid = newNextOrderId();
	    
	    uint __current_number_of_shareholders = shareholders.length;
	    
	    /*
	    // COMPILER PROBLEMS 'stack is too deep'
	    int _acct_number = this.findAccountNumber(_shldr_address);
	    require(_acct_number != -1); // already in account list
	    
	    Account storage __acct = accounts[uint(_acct_number)];

	    int _shldr_number = this.findShareHolderNumber(_shldr_address);
	    require(_shldr_number == -1); // not already in the list
	    */
	    
	    shareholders.length = __current_number_of_shareholders + 1; // grow the list
	    
        ShareHolder storage __shldr = shareholders[__current_number_of_shareholders];
        
        __shldr.shldr_address = _shldr_address;
        __shldr.shldr_pubkey = _shldr_pubkey;
        
        __shldr.cocrypted_shldr_privkey = _cocrypted_shldr_privkey;
        __shldr.cocrypted_shldr_identifier = _cocrypted_shldr_identifier;

       
        __shldr.registration_date = _registration_date;
        __shldr.block_date = now;
        
        __shldr.replacing = 0x0;
        
        __shldr.creator = _creator;
        __shldr.crtcrypted_shldr_description_string = _crtcrypted_shldr_description_string;
        __shldr.crtcrypted_shldr_identifier = _crtcrypted_shldr_identifier;
		
        __shldr.orderid = _orderid;
        __shldr.signature = _signature;
        
         
        __shldr.shldrcrypted_shldr_description_string = _shldrcrypted_shldr_string;
        __shldr.shldrcrypted_shldr_identifier = _shldrcrypted_shldr_identifier;
        
        _shldrindex = __current_number_of_shareholders;
	}
	
	function getShareHolderCount() public view returns (uint _count) {
	    _count = shareholders.length;
	}
	
	function getShareHolderAt(uint _index) public view returns (address _shldr_address, string _shldr_pubkey, string _cocrypted_shldr_privkey, string _cocrypted_shldr_identifier, uint _registration_date, uint _block_date, 
	                                                            address _replacing) {
	    uint __current_number_of_shareholders = shareholders.length;
	    
	    require((_index >= 0) && (_index < __current_number_of_shareholders));
	    
	    ShareHolder storage __shldr = shareholders[_index];
	    
	    _shldr_address = __shldr.shldr_address;
	    _shldr_pubkey = __shldr.shldr_pubkey;
	    
	    _cocrypted_shldr_privkey = __shldr.cocrypted_shldr_privkey;
	    _cocrypted_shldr_identifier = __shldr.cocrypted_shldr_identifier;
	    
	    _registration_date = __shldr.registration_date; // unix time
	    _block_date = __shldr.block_date; // now in block number
	    
		_replacing = __shldr.replacing;

	}
	
	function getShareHolderExtraAt(uint _index) public view returns (address _creator, string _crtcrypted_shldr_description_string, string _crtcrypted_shldr_identifier, string _orderid, string _signature, string _shldrcrypted_shldr_description_string, string _shldrcrypted_shldr_identifier) {
	   // because of "Stack too deep, try using less variables."
	    uint __current_number_of_shareholders = shareholders.length;
	    
	    require((_index >= 0) && (_index < __current_number_of_shareholders));
	    
	    ShareHolder storage __shldr = shareholders[_index];
	    
         _creator = __shldr.creator;
        _crtcrypted_shldr_description_string = __shldr.crtcrypted_shldr_description_string;
        _crtcrypted_shldr_identifier = __shldr.crtcrypted_shldr_identifier;

        _shldrcrypted_shldr_description_string = __shldr.shldrcrypted_shldr_description_string;
        _shldrcrypted_shldr_identifier = __shldr.shldrcrypted_shldr_identifier;
		
		_orderid = __shldr.orderid;
		_signature = __shldr.signature;
	}
	
	/*function registerShareHolderReplacementAt(uint _index, address _shldr_address, string _shldr_pubkey, string _cocrypted_shldr_string,
											 string _cocrypted_shldr_identifier, 
											 uint _shldr_registration_date, address _creator, string _crtcrypted_shldr_description_string, string _crtcrypted_shldr_identifier, 
											 string _orderid, string _signature,
											 string _shldrcrypted_shldr_string, string _shldrcrypted_shldr_identifier) public payable returns (uint _shldrindex) {
	    // replace a shareholder entry by a linked entry (e.g. in case shareholder has lost their key or key has been stolen)
	    
	    require(stringsEqual(next_orderid, _orderid));
	    next_orderid = newNextOrderId();
	    
	    // COMPILER PROBLEMS 'stack is too deep'
	    ShareHolder storage __shldr = shareholders[_index];
	    
	    require((__shldr.creator == _creator) || (_creator == owner)); // can only by creator of original shareholder, or by owner
	    
	    _shldrindex = registerShareHolder(_shldr_address, _shldr_pubkey, _cocrypted_shldr_string, _cocrypted_shldr_identifier, _shldr_registration_date, _creator, _crtcrypted_shldr_description_string, _crtcrypted_shldr_identifier, _orderid, _signature, _shldrcrypted_shldr_string, _shldrcrypted_shldr_identifier);
	    
	    
	    ShareHolder storage __newshldr = shareholders[_shldrindex];
	    __shldr.replacing = __shldr.shldr_address;

	}*/
	
	function findShareHolderNumber(address _shldr_address) public view returns (int _number) {
	    _number = -1;
	    
	    for (uint i = 0; i < shareholders.length; i++) {
	        ShareHolder storage __shldr = shareholders[i];
	        
	        if (__shldr.shldr_address == _shldr_address) {
	             _number = int(i);
	             
	             break;
	        }
	    }
	}
	

	// issuances (registered by owner)
	function registerIssuance(string _name, string _cocrypted_description, uint _numberofshares, uint _percentofcapital, 
	                            uint _issuance_unixtime, string _orderid, string _signature,
	                            string _issuance_type, string _code) payable public returns (uint _issuancenumber) {
	    // done by the owner of the ledger

	    require(stringsEqual(next_orderid, _orderid));
	    next_orderid = newNextOrderId();
	    
	    uint __numberofissuances = issuances.length;
	    
   	    // add a new issuance
    	issuances.length = __numberofissuances + 1;
    	Issuance storage __issu = issuances[__numberofissuances];
	    
		
		__issu.name = _name;
		__issu.cocrypted_description = _cocrypted_description;
		
		__issu.numberofshares = _numberofshares;
		__issu.percentofcapital = _percentofcapital;
		
		__issu.issuance_type = _issuance_type;
		__issu.code = _code;
		
		__issu.issuance_date = _issuance_unixtime;
		__issu.block_date = now;

        __issu.orderid = _orderid;
        __issu.signature = _signature;

       // initial creation of shares
        uint __numberoftransactions = stocktransactions.length;
        stocktransactions.length = __numberoftransactions + 1;
        
        StockTransaction storage __txn = stocktransactions[__numberoftransactions];
        
        __txn.nature = 0;
        
        __txn.from = owner;
        __txn.to = owner;
        
        __txn.transactiondate = _issuance_unixtime;
        __txn.block_date = now;
        
        __txn.issuanceindex = __numberofissuances;
        
        __txn.creator = owner;
 
        __txn.orderid = _orderid;
        __txn.signature = _signature;
       
        __txn.numberofshares = _numberofshares;
        
        __txn.consideration = 0;
        __txn.currency = '-';

        _issuancenumber = __numberofissuances + 1;
	}
	
	function registerIssuanceResize(uint _issuancenumber, uint _newnumberofshares, string _orderid, uint _transactiondate, string _signature) payable public returns (uint _txnumber) {
	    // done by the owner of the ledger
	    
 	    require(stringsEqual(next_orderid, _orderid));
	    next_orderid = newNextOrderId();
	    
        uint __issuanceindex = _issuancenumber -1; // 1 based
 
        require(__issuanceindex < issuances.length); 	
        
        Issuance storage __issu = issuances[__issuanceindex];
        
        uint __current_numberofshares = __issu.numberofshares;
        
  	    require( _newnumberofshares != __current_numberofshares);
       
        uint __numberoftransactions = stocktransactions.length;
        StockTransaction storage __txn = stocktransactions[0];
        
       if (_newnumberofshares < __current_numberofshares) {
 	        // company must still detain sufficient shares
 	        // to allow the resize
 	        uint __owner_position = getShareHolderPosition(owner, _issuancenumber);
 	        
 	        require(__owner_position + _newnumberofshares >= __current_numberofshares);
 	        
           // destruction of shares
            stocktransactions.length = __numberoftransactions + 1;
            
            __txn = stocktransactions[__numberoftransactions];
            
            __txn.nature = 2; // destruction
            
            __txn.from = owner;
            __txn.to = owner;
            
            __txn.transactiondate = _transactiondate;
            __txn.block_date = now;
            
            __txn.issuanceindex = __issuanceindex;
            
            __txn.creator = owner;
            
            __txn.orderid = _orderid;
            __txn.signature = _signature;
            
            __txn.numberofshares = __current_numberofshares - _newnumberofshares;
            
            __txn.consideration = 0;
            __txn.currency = '-';
            
            _txnumber = __numberoftransactions;
           
        }
        else {
            // additional creation of shares
             stocktransactions.length = __numberoftransactions + 1;
            
            __txn = stocktransactions[__numberoftransactions];
            
            __txn.nature = 0;
            
            __txn.from = owner;
            __txn.to = owner;
            
            __txn.transactiondate = _transactiondate;
            __txn.block_date = now;
            
            __txn.issuanceindex = __issuanceindex; 
            
            __txn.creator = owner;
            
            __txn.orderid = _orderid;
            __txn.signature = _signature;
            
            __txn.numberofshares = _newnumberofshares - __current_numberofshares;
            
            __txn.consideration = 0;
            __txn.currency = '-';
            
            _txnumber = __numberoftransactions;
      }
	    
	}
	
	function getIssuanceAt(uint _index) public view returns (uint _numberofshares, uint _percentofcapital, uint _issuance_date,  uint _block_date, 
	                            string _name, string _cocrypted_description, uint _cancel_date, uint _cancel_block_date, string _orderid, string _signature) {
	    uint __current_number_of_issuances = issuances.length;
	    
	    require((_index >= 0) && (_index < __current_number_of_issuances));
	    
	    Issuance storage __issu = issuances[_index];
	    
 	    _numberofshares = __issu.numberofshares;
	    _percentofcapital = __issu.percentofcapital; // 20000 represents 20% of capital for new shares
	    
	    _issuance_date = __issu.issuance_date; // unix time
	    _block_date = __issu.block_date; // now in block number
	    
	    _name = __issu.name;
	    _cocrypted_description = __issu.cocrypted_description;
	    
	    _cancel_date = __issu.cancel_date; // unix time
	    _cancel_block_date = __issu.cancel_block_date; // now in block number
	    
	    _orderid = __issu.orderid;
	    _signature = __issu.signature;
	}
	
	function getIssuanceExtraAt(uint _index) public view returns (string _issuance_type, string _code) {
	    uint __current_number_of_issuances = issuances.length;

	    require((_index >= 0) && (_index < __current_number_of_issuances));
	    
	    Issuance storage __issu = issuances[_index];
	    
		_issuance_type = __issu.issuance_type;
		_code = __issu.code;
		
	 }
	                            
	function getIssuanceCount() public view returns (uint _count) {
	    _count = issuances.length;
	}
	
	function getShareHolderPosition(address _shldr_address, uint _issuancenumber) public view returns (uint _position) {
	    _position = 0;
	    
       uint __issuanceindex = _issuancenumber -1; // 1 based
       
       require(__issuanceindex < issuances.length); 

	    for (uint i = 0; i < stocktransactions.length; i++) {
	        StockTransaction storage __txn = stocktransactions[i];
	        
	        if (__txn.issuanceindex == __issuanceindex) {
	            
	            if (__txn.nature == 0) {
	                if ((_shldr_address == owner) && (__txn.to == _shldr_address)) {
	                   _position = _position + __txn.numberofshares; 
	                }
	            }
	            else if (__txn.nature == 1) {
   	                if (__txn.from == _shldr_address) {
    	                _position = _position - __txn.numberofshares;
    	            }
    	             
    	            if (__txn.to == _shldr_address) {
    	                _position = _position + __txn.numberofshares;
    	            }
	                
	            }

	        }
	    }
	    
	}
	
	function registerTransaction(uint _numberofshares, address _from, address _to, uint8 _nature, uint _issuancenumber, string _orderid, uint _transaction_unixtime, uint _consideration, string _currency, address _creator, string _signature) payable public returns (uint _txnumber) {
	    //require(tx.origin == owner); // done by the owner of the ledger
	    
	    require(stringsEqual(next_orderid, _orderid));
	    next_orderid = newNextOrderId();
	    
	    if (_nature <= 10) {
	        // 1 to 10 (creation, registered transfers, desctruction,..) reserved to owner
	        require(_creator == owner);
	        
	        // contract does not control position
	        // because it can not check authentication of transactions
 	    }
 	    else {
	        require(_creator == _from);
	        
	        // contract does not control short selling
	        // because it can not check authentication of  transactions
  	    }
	    
        uint __numberoftransactions = stocktransactions.length;
        stocktransactions.length = __numberoftransactions + 1;

        StockTransaction storage __txn = stocktransactions[__numberoftransactions];
        
        __txn.nature = _nature;
        
        __txn.from = _from;
        __txn.to = _to;
        
        __txn.transactiondate = _transaction_unixtime;
        __txn.block_date = now;
        
        uint __issuanceindex = _issuancenumber -1; // 1 based
        
        require(__issuanceindex < issuances.length); 
        __txn.issuanceindex = __issuanceindex; 
        
        __txn.creator = _creator;
        
        __txn.orderid = _orderid;
        __txn.signature= _signature;
        
        __txn.numberofshares = _numberofshares;
        
        __txn.consideration = _consideration;
        __txn.currency = _currency;

	    _txnumber = __numberoftransactions + 1;
	}
	
	function findTransaction(string _orderid) public view returns (int _txindex) {
	    _txindex = -1;
	    
	    for (uint i = 0; i < stocktransactions.length; i++) {
	        StockTransaction storage __txn = stocktransactions[i];
	        
	        if (stringsEqual(__txn.orderid, _orderid)) {
	             _txindex = int(i);
	             
	             break;
	        }
	    }
	    
	}
	
	function getTransactionAt(uint _index) public view returns (address _from, address _to,	uint _transactiondate, uint _block_date, uint8 _nature, uint _issuancenumber, string _orderid, uint _numberofshares, uint _consideration, string _currency, address _creator, string _signature) {
	    uint __current_number_of_transactions = stocktransactions.length;
	    
	    require((_index >= 0) && (_index <  __current_number_of_transactions));
	    
	    StockTransaction storage __txn = stocktransactions[_index];
	    
		_from = __txn.from;
		_to = __txn.to;
		
		_transactiondate = __txn.transactiondate; // unix time
		_block_date = __txn.block_date; 
		
		_nature = __txn.nature; // 0 creation, 1 transfer, 2 pledge, 3 redeem
		
		_issuancenumber = __txn.issuanceindex + 1; // number is 1 based
		
		
		_creator = __txn.creator; 
		_orderid = __txn.orderid; // unique, provided by caller
		_signature = __txn.signature;

		_numberofshares = __txn.numberofshares;
		
		_consideration = __txn.consideration;
		_currency = __txn.currency;
	}
	
	function getTransactionCount() public view returns (uint _count) {
	    _count = stocktransactions.length;
	}
	
	function newNextOrderId() internal view returns (string) {
	    string memory __time_string = uintToString (now);
	    
        uint __current_number_of_shareholders = shareholders.length;
        uint __numberofissuances = issuances.length;
        uint __numberoftransactions = stocktransactions.length;
	    
	    string memory __shldr_string = uintToString(__current_number_of_shareholders);
	    string memory __issu_string = uintToString(__numberofissuances);
	    string memory __txn_string = uintToString(__numberoftransactions);
	    
	    return strConcat(__time_string, "-", __shldr_string,__issu_string, __txn_string);
	}
	

    // utility	
	function stringsEqual(string storage _a, string memory _b) internal view returns (bool) {
		bytes storage a = bytes(_a);
		bytes memory b = bytes(_b);
		if (a.length != b.length)
			return false;
		// @todo unroll this loop
		for (uint i = 0; i < a.length; i ++)
			if (a[i] != b[i])
				return false;
		return true;
	}
	
	function strConcat(string _a, string _b, string _c, string _d, string _e) internal pure returns (string){
        bytes memory _ba = bytes(_a);
        bytes memory _bb = bytes(_b);
        bytes memory _bc = bytes(_c);
        bytes memory _bd = bytes(_d);
        bytes memory _be = bytes(_e);
        string memory abcde = new string(_ba.length + _bb.length + _bc.length + _bd.length + _be.length);
        bytes memory babcde = bytes(abcde);
        uint k = 0;
        for (uint i = 0; i < _ba.length; i++) babcde[k++] = _ba[i];
        for (i = 0; i < _bb.length; i++) babcde[k++] = _bb[i];
        for (i = 0; i < _bc.length; i++) babcde[k++] = _bc[i];
        for (i = 0; i < _bd.length; i++) babcde[k++] = _bd[i];
        for (i = 0; i < _be.length; i++) babcde[k++] = _be[i];
        return string(babcde);
    }
    
    function uintToString (uint _ui) internal pure returns (string) {
         if (_ui == 0) return "0";
        uint j = _ui;
        uint len;
        while (j != 0){
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len - 1;
        while (_ui != 0){
            bstr[k--] = byte(48 + _ui % 10);
            _ui /= 10;
        }
        return string(bstr);
    }

    function uintToBytes32(uint256 _ui) internal pure returns (bytes32) {
        return bytes32(_ui);
    }
    
    function bytes32ToString (bytes32 _data) internal pure returns (string) {
        bytes memory bytesString = new bytes(32);
        for (uint j=0; j<32; j++) {
            byte char = byte(bytes32(uint(_data) * 2 ** (8 * j)));
            if (char != 0) {
                bytesString[j] = char;
            }
        }
        return string(bytesString);
    }

}