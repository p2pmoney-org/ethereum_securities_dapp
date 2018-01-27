pragma solidity ^0.4.18;

contract StockLedger {
	// implementing the stock ledger (share register, share ledger,..)
	// for a SME

	string public contract_name;
	uint public contract_version;

	// company
	address public owner;
	string public owner_pubkey;

	string public ledger_name;
	string public cocrypted_ledger_description;
	
	uint creation_date; // unix time
	uint creation_block_date; // now in block number
	
	address public replaced_by;
	uint replacement_date; // unix time
	uint replacement_block_date; // now in block number

 	// shareholders list
	ShareHolder[] shareholders;
	
	struct ShareHolder {
	    address shldr_address;
	    string shldr_pubkey;
	    
	    string cocrypted_shldr_privkey;
	    string cocrypted_shldr_identifier;
	    
	    uint registration_date; // unix time
	    uint block_date; // now in block number
	    
		address replaced_by;
		uint replacement_date; // unix time
		uint replacement_block_date; // now in block number
	}

    // issuances
	Issuance[] issuances;
	
	struct Issuance {
	    uint numberofshares;
	    uint percentofcapital; // 20 000 represents 20% of capital for new shares
	    
	    uint issuance_date; // unix time
	    uint block_date; // now in block number
	    
	    string name;
	    string cocrypted_description;
	    
	    uint cancel_date; // unix time
	    uint cancel_block_date; // now in block number
	}
	
    // stock transactions
	StockTransaction[] public stocktransactions;

	struct StockTransaction {
		address from;
		address to;
		
		uint transactiondate; // unix time
		uint block_date; 
		
		uint8 nature; // 0 creation, 1 registered transfer, 2 signed endorsement, 3 withdrawal/repurchase
		
		uint issuanceindex; // issuance number is 1 based
		string orderid; // unique, provided by caller

		uint numberofshares;
		
		uint consideration;
		string currency;
	}

	function StockLedger(address _owner, string _owner_pubkey, string _cocrypted_owner_identifier, string _ledger_name, string _cocrypted_ledger_description) public {
		contract_name = "stockledger";
		contract_version = 20180101;
		
		replaced_by = address(0);
		
		owner = _owner;
		owner_pubkey = _owner_pubkey;
		
		ledger_name = _ledger_name;
		cocrypted_ledger_description = _cocrypted_ledger_description;
		
		shareholders.length = 1; // company as initial holder of shares
		
        ShareHolder storage shldr = shareholders[0] ;
        
        shldr.shldr_address = _owner;
        shldr.shldr_pubkey = _owner_pubkey;
        shldr.cocrypted_shldr_privkey = "0x"; // we do not store owner's private key
        shldr.cocrypted_shldr_identifier = _cocrypted_owner_identifier;
        
		issuances.length = 0;
		
        stocktransactions.length = 0;
	}
	
	function registerShareHolder(address _shldr_address, string _shldr_pubkey, string _cocrypted_shldr_privkey, string _cocrypted_shldr_identifier, uint _registration_date) public payable returns (uint _shldrindex) {
	    uint __current_number_of_shareholders = shareholders.length;
	    
	    int _shldr_number = this.findShareHolderNumber(_shldr_address);
	    
	    require(_shldr_number == -1); // not already in the list
	    
	    shareholders.length = __current_number_of_shareholders + 1; // grow the list
	    
        ShareHolder storage __shldr = shareholders[__current_number_of_shareholders];
        
        __shldr.shldr_address = _shldr_address;
        __shldr.shldr_pubkey = _shldr_pubkey;
        
        __shldr.cocrypted_shldr_privkey = _cocrypted_shldr_privkey;
        __shldr.cocrypted_shldr_identifier = _cocrypted_shldr_identifier;
        
        __shldr.registration_date = _registration_date;
        __shldr.block_date = now;
        
        _shldrindex = __current_number_of_shareholders;
	}
	
	function getShareHolderCount() public view returns (uint _count) {
	    _count = shareholders.length;
	}
	
	function getShareHolderAt(uint _index) public view returns (address _shldr_address, string _shldr_pubkey, string _cocrypted_shldr_privkey, string _cocrypted_shldr_identifier, uint _registration_date, uint _block_date, address _replaced_by, uint _replacement_date, uint _replacement_block_date) {
	    uint __current_number_of_shareholders = shareholders.length;
	    
	    require((_index >= 0) && (_index < __current_number_of_shareholders));
	    
	    ShareHolder storage __shldr = shareholders[_index];
	    
	    _shldr_address = __shldr.shldr_address;
	    _shldr_pubkey = __shldr.shldr_pubkey;
	    
	    _cocrypted_shldr_privkey = __shldr.cocrypted_shldr_privkey;
	    _cocrypted_shldr_identifier = __shldr.cocrypted_shldr_identifier;
	    
	    _registration_date = __shldr.registration_date; // unix time
	    _block_date = __shldr.block_date; // now in block number
	    
		_replaced_by = __shldr.replaced_by;
		_replacement_date = __shldr.replacement_date; // unix time
		_replacement_block_date = __shldr.replacement_block_date; // now in block number
	}
	
	function registerShareHolderReplacementAt(uint _index, address _shldr_address, string _shldr_pubkey, string _shldr_cocrypted_shldr_key, string _shldr_cocrypted_shldr_identifier, uint _shldr_registration_date) public payable returns (uint _shldrindex) {
	    // replace a shareholder entry by a linked entry (e.g. in case shareholder has lost their key or key has been stolen)
	    _shldrindex = registerShareHolder(_shldr_address, _shldr_pubkey, _shldr_cocrypted_shldr_key, _shldr_cocrypted_shldr_identifier, _shldr_registration_date);
	    
	    ShareHolder storage __shldr = shareholders[_index];
	    
	    __shldr.replaced_by = _shldr_address;
	    __shldr.replacement_date = _shldr_registration_date;
	    __shldr.replacement_block_date = now;
	    
	}
	
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

	function registerIssuance(string _name, string _cocrypted_description, uint _numberofshares, uint _percentofcapital, uint _issuance_unixtime, string _orderid) payable public returns (uint _issuancenumber) {
	    //require(msg.sender == owner);

	    uint __numberofissuances = issuances.length;
	    
   	    // add a new issuance
    	issuances.length = __numberofissuances + 1;
    	Issuance storage __issu = issuances[__numberofissuances];
	    
		
		__issu.name = _name;
		__issu.cocrypted_description = _cocrypted_description;
		
		__issu.numberofshares = _numberofshares;
		__issu.percentofcapital = _percentofcapital;
		
		__issu.issuance_date = _issuance_unixtime;
		__issu.block_date = now;

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
        __txn.orderid = _orderid;
        
        __txn.numberofshares = _numberofshares;
        
        __txn.consideration = 0;
        __txn.currency = '-';

        _issuancenumber = __numberofissuances + 1;
	}
	
	function registerIssuanceResize(uint _issuancenumber, uint _newnumberofshares, string _orderid, uint _transactiondate) payable public returns (uint _txnumber) {
	    //require(msg.sender == owner);
	    
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
            
            __txn.nature = 3;
            
            __txn.from = owner;
            __txn.to = owner;
            
            __txn.transactiondate = _transactiondate;
            __txn.block_date = now;
            
            __txn.issuanceindex = __issuanceindex; 
            __txn.orderid = _orderid;
            
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
            __txn.orderid = _orderid;
            
            __txn.numberofshares = _newnumberofshares - __current_numberofshares;
            
            __txn.consideration = 0;
            __txn.currency = '-';
            
            _txnumber = __numberoftransactions;
      }
	    
	}
	
	function getIssuanceAt(uint _index) public view returns (uint _numberofshares, uint _percentofcapital, uint _issuance_date,  uint _block_date, string _name, string _cocrypted_description, uint _cancel_date, uint _cancel_block_date) {
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
	            else if (__txn.nature == 2) {
  	                // shares are committed in a recorded transaction
  	                if (__txn.from == _shldr_address) {
    	                _position = _position - __txn.numberofshares;
    	            }
   	             
    	            if (__txn.to == _shldr_address) {
    	                _position = _position + __txn.numberofshares;
    	            }
	            }
	            else if (__txn.nature == 3) {
   	                if ((_shldr_address == owner) && (__txn.to == _shldr_address)) {
    	                _position = _position + __txn.numberofshares;
    	            }
	                
	            }
	            
	        }
	    }
	    
	}
	
	function registerTransaction(uint _numberofshares, address _from, address _to, uint8 _nature, uint _issuancenumber, string _orderid, uint _transaction_unixtime, uint _consideration, string _currency) payable public returns (uint _txnumber) {
	    //require(msg.sender == owner);
	    
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
        __txn.orderid = _orderid;
        
        // check sender has enough share of this issuance
        uint __shldr_position = getShareHolderPosition(_from, _issuancenumber);
        require (__shldr_position >= _numberofshares);
        
        __txn.numberofshares = _numberofshares;
        
        __txn.consideration = _consideration;
        __txn.currency = _currency;

	    _txnumber = __numberoftransactions + 1;
	}
	
	function recordTransfer(uint _numberofshares, address _from, address _to, uint _issuancenumber, string _orderid, uint _transaction_unixtime, uint _consideration, string _currency) payable public returns (uint _txnumber) {
	    //require(msg.sender == _from); // done by the owner of the shares
	    
        uint __numberoftransactions = stocktransactions.length;
        stocktransactions.length = __numberoftransactions + 1;

        StockTransaction storage __txn = stocktransactions[__numberoftransactions];
        
        __txn.nature = 2; // endorsement
        
        __txn.from = _from;
        __txn.to = _to;
        
        __txn.transactiondate = _transaction_unixtime;
        __txn.block_date = now;
        
         uint __issuanceindex = _issuancenumber -1; // 1 based
        
        
        require(__issuanceindex < issuances.length); 
        __txn.issuanceindex = __issuanceindex; 
        __txn.orderid = _orderid;
        
        // check sender has enough share of this issuance
        uint __shldr_position = getShareHolderPosition(_from, _issuancenumber);
        require (__shldr_position >= _numberofshares);
        
        __txn.numberofshares = _numberofshares;
        
        __txn.consideration = _consideration;
        __txn.currency = _currency;

	    _txnumber = __numberoftransactions + 1;
	}
	
	function registerTransfer(uint _tranfertxnnumber, string _orderid, uint _transaction_unixtime) payable public returns (uint _txnumber) {
	    //require(msg.sender == owner); // done by the owner of the ledger
	    
        uint __numberoftransactions = stocktransactions.length;
	   
	    require((_tranfertxnnumber >= 0) && (_tranfertxnnumber < __numberoftransactions));
	    
	    StockTransaction storage __recordedtx = stocktransactions[_tranfertxnnumber];
	    
	    require(__recordedtx.nature == 2);
	    
         // check sender has still enough share of this issuance
        uint __shldr_position = getShareHolderPosition(__recordedtx.from, __recordedtx.issuanceindex);
        require (__shldr_position >= __recordedtx.numberofshares);
        
        // grow array
        stocktransactions.length = __numberoftransactions + 1;

        StockTransaction storage __txn = stocktransactions[__numberoftransactions];
        
        __txn.nature = 1;
        
        __txn.from = __recordedtx.from;
        __txn.to = __recordedtx.to;
        
        __txn.transactiondate = _transaction_unixtime;
        __txn.block_date = now;
        
        
        __txn.issuanceindex = __recordedtx.issuanceindex; 
        __txn.orderid = _orderid;
        
        __txn.numberofshares = __recordedtx.numberofshares;
        
        __txn.consideration = __recordedtx.consideration;
        __txn.currency = __recordedtx.currency;

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
	
	function getTransactionAt(uint _index) public view returns (address _from, address _to,	uint _transactiondate, uint _block_date, uint8 _nature, uint _issuancenumber, string _orderid, uint _numberofshares, uint _consideration, string _currency) {
	    uint __current_number_of_transactions = stocktransactions.length;
	    
	    require((_index >= 0) && (_index <  __current_number_of_transactions));
	    
	    StockTransaction storage __txn = stocktransactions[_index];
	    
		_from = __txn.from;
		_to = __txn.to;
		
		_transactiondate = __txn.transactiondate; // unix time
		_block_date = __txn.block_date; 
		
		_nature = __txn.nature; // 0 creation, 1 transfer, 2 pledge, 3 redeem
		
		_issuancenumber = __txn.issuanceindex + 1; // number is 1 based
		_orderid = __txn.orderid; // unique, provided by caller

		_numberofshares = __txn.numberofshares;
		
		_consideration = __txn.consideration;
		_currency = __txn.currency;
	}
	
	function getTransactionCount() public view returns (uint _count) {
	    _count = stocktransactions.length;
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


}