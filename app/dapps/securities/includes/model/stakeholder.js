/**
 * 
 */
'use strict';

class StakeHolder{
	constructor(session, shldr_address) {
		this.session = session;
		this.address = shldr_address;
		
		this.uuid = null;

		this.status = Securities.STATUS_LOCAL;

		// local data
		this.local_shldr_identifier = null;
		
		this.local_shldr_privkey = null;
		
		this.local_orderid = null;
		
		this.local_creation_date = new Date().getTime();
		this.local_submission_date = null;
		

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
	    
		this.orderid = null; // unique, provided by contract
		this.signature = null; // signature of orderid with creator's private key

        
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
	
	getUUID() {
		if (this.uuid)
			return this.uuid;
		
		this.uuid = this.session.getUUID();
		
		return this.uuid;
	}
	
	isLocalOnly() {
		//return (this.position == -1)
		return ((this.status != Securities.STATUS_ON_CHAIN) && (this.local_orderid == null));
	}
	
	isLocal() {
		return (this.status != Securities.STATUS_ON_CHAIN);
	}
	
	isOnChain() {
		return (this.status == Securities.STATUS_ON_CHAIN);
	}
	
	getStatus() {
		return this.status;
	}
	
	setStatus(status) {
		switch(status) {
			case Securities.STATUS_LOST:
			case Securities.STATUS_NOT_FOUND:
			case Securities.STATUS_LOCAL:
			case Securities.STATUS_SENT:
			case Securities.STATUS_PENDING:
			case Securities.STATUS_DEPLOYED:
			case Securities.STATUS_CANCELLED:
			case Securities.STATUS_REJECTED:
			case Securities.STATUS_ON_CHAIN:
				this.status = status;
				break;
			default:
				// do not change for a unknown status
				break;
		}
	}
	
	getLocalJson() {
		var uuid = this.getUUID();
		var status = this.getStatus();
		var identifier = this.local_shldr_identifier;
		
		var identifier = this.local_shldr_identifier;

		var orderid = this.local_orderid;

		var creationdate= this.getLocalCreationDate();
		var submissiondate= this.getLocalSubmissionDate();

		var json = {uuid: uuid, status: status, 
				creationdate: creationdate, submissiondate: submissiondate, orderid: orderid, 
				identifier: identifier};
		
		return json;
	}
	
	copy(orgObj) {

		// blockchain data
		this.position = orgObj.position; 
		
		this.shldr_pubkey = orgObj.shldr_pubkey;
		
		this.shldr_rsa_pubkey = orgObj.shldr_rsa_pubkey;
		
		this.cocrypted_shldr_privkey = orgObj.cocrypted_shldr_privkey;
		this.cocrypted_shldr_identifier= orgObj.cocrypted_shldr_identifier;
	    
		this.registration_date = orgObj.registration_date; 
		this.block_date = orgObj.block_date; 
		
		this.replaced_by = orgObj.replaced_by; 
		this.replacement_date = orgObj.replacement_date; 
		this.replacement_block_date = orgObj.replacement_block_date; 
	    
		this.creator = orgObj.creator; 

		this.crtcrypted_shldr_description_string = orgObj.crtcrypted_shldr_description_string; 
		this.crtcrypted_shldr_identifier = orgObj.crtcrypted_shldr_identifier;
		
		this.shldrcrypted_shldr_description_string = orgObj.shldrcrypted_shldr_description_string; 
		this.shldrcrypted_shldr_identifier = orgObj.nullshldrcrypted_shldr_identifier;
	    
		this.orderid = orgObj.orderid; 
		this.signature = orgObj.signature; 
		
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
	
	getLocalOrderId() {
		return this.local_orderid;
	}
	
	setLocalOrderId(orderid) {
		this.local_orderid = orderid;
	}
	
	getLocalCreationDate() {
		return this.local_creation_date;
	}
	
	setLocalCreationDate(creation_date) {
		this.local_creation_date = creation_date;
	}
	
	getLocalSubmissionDate() {
		return this.local_submission_date;
	}
	
	setLocalSubmissionDate(submission_date) {
		this.local_submission_date = submission_date;
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
	static getStakeHoldersFromJsonArray(module, session, jsonarray) {
		var array = [];
		
		if (!jsonarray)
			return array;
		
		for (var i = 0; i < jsonarray.length; i++) {
			var identifier = jsonarray[i]['identifier'];
			var stakeholder = module.createBlankStakeHolderObject(session);
			
			if (jsonarray[i]["uuid"])
				stakeholder.uuid = jsonarray[i]["uuid"];
			
			stakeholder.setLocalIdentifier(identifier);
			
			array.push(stakeholder);
		}
		
		return array;
	}
	
}

if ( typeof GlobalClass !== 'undefined' && GlobalClass )
	GlobalClass.registerModuleClass('securities', 'StakeHolder', StakeHolder);
else
	module.exports = StakeHolder; // we are in node js
