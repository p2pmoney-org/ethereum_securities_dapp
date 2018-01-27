/**
 * 
 */
'use strict';

class StakeHolder{
	constructor(session, shldr_address) {
		this.session = session;
		this.address = shldr_address;
		
		// local data
		this.local_shldr_identifier = null;
		
		this.local_shldr_privkey = null;
		

		// blockchain data
		this.position = -1; // position in contract internal struct array
		
		this.shldr_pubkey = null;
		
		this.cocrypted_shldr_privkey = null;
		this.cocrypted_shldr_identifier= null;
	    
		this.registration_date = null; // unix time
		this.block_date = null; // now in block number
		
		// operation variables
		this.stakeholderindex = null;

	}
	
	getAddress() {
		return this.address;
	}
	
	setAddress(address) {
		this.address = address;
	}
	
	isLocalOnly() {
		return (this.position == -1)
	}
	
	getLocalJson() {
		var identifier = this.local_shldr_identifier;
		
		var json = {identifier: identifier};
		
		return json;
	}
	
	getStakeHolderIndex() {
		return this.stakeholderindex;
	}
	
	setStakeHolderIndex(index) {
		this.stakeholderindex = index;
	}
	
	// local data
	getLocalIdentifier() {
		return this.local_shldr_identifier;
	}
	
	setLocalIdentifier(identifier) {
		this.local_shldr_identifier = identifier;
	}
	
	getLocalPrivKey() {
		return this.local_shldr_privkey;
	}
	
	setLocalPrivKey(privkey) {
		this.local_shldr_privkey = privkey;
	}
	
	// chain data
	getChainPosition() {
		return this.position;
	}
	
	setChainPosition(pos) {
		this.position = pos;
	}
	
	getChainPubKey() {
		return this.shldr_pubkey;
	}
	
	setChainPubKey(pubkey) {
		this.shldr_pubkey = pubkey;
	}
	
	getChainCocryptedPrivKey() {
		return this.cocrypted_shldr_privkey;
	}
	
	setChainCocryptedPrivKey(cocryptedprivkey) {
		this.cocrypted_shldr_privkey = cocryptedprivkey;
	}
	
	getChainCocryptedIdentifier() {
		return this.cocrypted_shldr_identifier;
	}
	
	setChainCocryptedIdentifier(cocrypted_identifier) {
		this.cocrypted_shldr_identifier = cocrypted_identifier;
	}
	
	getChainRegistrationDate() {
		return this.registration_date;
	}
	
	setChainRegistrationDate(regdate) {
		this.registration_date = regdate;
	}
	
	getChainBlockDate() {
		return this.block_date;
	}
	
	setChainBlockDate(block_date) {
		this.block_date = block_date;
	}
	
	// static
	static getStakeHoldersFromJsonArray(session, jsonarray) {
		var array = [];
		
		if (!jsonarray)
			return array;
		
		for (var i = 0; i < jsonarray.length; i++) {
			var identifier = jsonarray[i]['identifier'];
			var stakeholder = session.createBlankStakeHolderObject();
			
			stakeholder.setLocalIdentifier(identifier);
			
			array.push(stakeholder);
		}
		
		return array;
	}
	
}

if ( typeof GlobalClass !== 'undefined' && GlobalClass )
GlobalClass.StakeHolder = StakeHolder;
else
module.exports = StakeHolder; // we are in node js
