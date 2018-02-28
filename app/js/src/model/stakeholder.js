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
		
		this.shldr_rsa_pubkey = null;
		
		this.cocrypted_shldr_privkey = null; // asymmetric encryption with contract owner's public key
		this.cocrypted_shldr_identifier= null;
	    
		this.registration_date = null; // unix time
		this.block_date = null; // now in block number
		
		this.replaced_by = null; // in case, shareholder's private key is compromised or shareholder is registered after inscription by seller
		this.replacement_date = null; // unix time
		this.replacement_block_date = null; // now in block number
	    
		this.creator = null; // can be owner, or a seller of shares

		this.crtcrypted_shldr_description_string = null; // symmetric encryption with creator's private key
		this.crtcrypted_shldr_identifier = null;
		
		this.shldrcrypted_shldr_description_string = null; // asymmetric encryption with stakeholder's public key
		this.shldrcrypted_shldr_identifier= null;
	    
		this.orderid; // unique, provided by contract
		this.signature; // signature of orderid with creator's private key

        
        // operation variables
		this.stakeholderindex = null;

	}
	
	getAddress() {
		return this.address;
	}
	
	setAddress(address) {
		this.address = address;
	}
	
	getAccountObject() {
		if (!this.address)
			throw 'address missing in StakeHolder object to build an account object';
		
		var account = this.session.getAccountObject(this.address);
		
		if (this.local_shldr_privkey) {
			account.setPrivateKey(this.local_shldr_privkey);
		}
		else if (this.shldr_rsa_pubkey) {
			account.setRsaPublicKey(this.shldr_rsa_pubkey);
		}
		
		return account;
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
	
	getChainRsaPubKey() {
		return this.shldr_rsa_pubkey;
	}
	
	setChainRsaPubKey(pubkey) {
		this.shldr_rsa_pubkey = pubkey;
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
	
	getReplacedBy() {
		return this.replaced_by;
	}
	
	setReplacedBy(replaced_by) {
		this.replaced_by = replaced_by;
	}
	
	getReplacementDate() {
		return this.replacement_date;
	}
	
	setReplacementDate(replacement_date) {
		this.replacement_date = replacement_date;
	}
	
	getReplacementBlockDate() {
		return this.replacement_block_date;
	}
	
	setReplacementBlockDate(replacement_block_date) {
		this.replacement_block_date = replacement_block_date;
	}
	
	getChainCreatorAddress() {
		return this.creator;
	}
	
	setChainCreatorAddress(creator) {
		this.creator = creator;
	}
	
	getChainCreatorCryptedDescription() {
		return this.crtcrypted_shldr_description_string;
	}
	
	setChainCreatorCryptedDescription(crtcrypted_shldr_description_string) {
		this.crtcrypted_shldr_description_string = crtcrypted_shldr_description_string;
	}
	
	getChainCreatorCryptedIdentifier() {
		return this.crtcrypted_shldr_identifier;
	}
	
	setChainCreatorCryptedIdentifier(crtcrypted_shldr_identifier) {
		this.crtcrypted_shldr_identifier = crtcrypted_shldr_identifier;
	}
	
	getChainStakeHolderCryptedDescription() {
		return this.shldrcrypted_shldr_description_string;
	}
	
	setChainStakeHolderCryptedDescription(shldrcrypted_shldr_description_string) {
		this.shldrcrypted_shldr_description_string = shldrcrypted_shldr_description_string;
	}
	
	getChainStakeHolderCryptedIdentifier() {
		return this.shldrcrypted_shldr_identifier;
	}
	
	setChainStakeHolderCryptedIdentifier(shldrcrypted_shldr_identifier) {
		this.shldrcrypted_shldr_identifier = shldrcrypted_shldr_identifier;
	}
	
	
	getChainOrderId() {
		return this.orderid;
	}
	
	setChainOrderId(orderid) {
		this.orderid = orderid;
	}
	
	getChainSignature() {
		return this.signature;
	}
	
	setChainSignature(signature) {
		this.signature = signature;
	}
	
	isAuthenticated() {
		if (this.orderid == "1")
			return true; // seed account
		
		return this.session.validateStringSignature(this.creator, this.orderid, this.signature);
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
