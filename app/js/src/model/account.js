/**
 * 
 */
'use strict';

class AccountMap {
	constructor() {
		this.map = Object.create(null); // use a simple object to implement the map
	}
	
	getAccount(address) {
		var key = address.toString().toLowerCase();
		
		if (key in this.map) {
			return this.map[key];
		}
	}
	
	pushAccount(account) {
		var key = account.address.toString().toLowerCase();

		this.map[key] = account;
	}
	
	removeAccount(account) {
		var key = account.address.toString().toLowerCase();

		delete this.map[key];
	}
	
	count() {
		return Object.keys(this.map).length
	}
	
	empty() {
		this.map = Object.create(null);
	}
}


class Account{
	constructor(session, address) {
		this.session = session;
		this.address = address;
		
		this.lastunlock = null; // unix time
		this.lastunlockduration = null;
		
		// encryption
		this.public_key = null;
		this.private_key = null;
	}
	
	getAddress() {
		return this.address;
	}
	
	isValid() {
		if (this.address != null) {
			if (this.session.isValidAddress(this.address)) {
				return true;
			}
			else {
				return false;
			}
		}
		else {
			throw 'Account is not valid!';
		}
	}
	
	
	getPublicKey() {
		return this.public_key;
	}
	
	setPublicKey(pubkey) {
		this.public_key = pubkey;
	}
	
	getPrivateKey() {
		return this.private_key;
	}
	
	setPrivateKey(privkey) {
		this.private_key = privkey;
		
		if (this.public_key == null) {
			var ethereumjs = this.session.getEthereumJsInstance();
			
			//console.log('ethereumjs is ' + JSON.stringify(ethereumjs));
			
			this.public_key = '0x' + ethereumjs.Util.privateToPublic(this.private_key).toString('hex');
			
			console.log('public key is: ' + this.public_key );
			
			if (this.address != null) {
				// remove in session
				this.session.removeAccountObject(this);
			}
			
			this.address = '0x' + ethereumjs.Util.privateToAddress(this.private_key).toString('hex');
			
			
			console.log('address is: ' + this.address);
		}
		else {
			var ethereumjs = this.session.getEthereumJsInstance();

			// check public key corresponds
			var public_key = '0x' + ethereumjs.Util.privateToPublic(this.private_key).toString('hex');
			
			if (public_key != this.public_key) {
				// overwrite
				this.public_key = public_key;
				
				if (this.address != null) {
					// remove in session
					this.session.removeAccountObject(this);
				}
				
				this.address = '0x' + ethereumjs.Util.privateToAddress(this.private_key).toString('hex');
			}
		}
		
	}
	
	// operation
	unlock(password, duration) {
		if (this.session.needToUnlockAccounts() === false) 
			return;
		
		this.lastunlock = Date.now()/1000; // in seconds
		this.lastunlockduration = duration;
		
		console.log('Account.unlock called for ' + duration + ' seconds ');
		//console.log('Account.unlock called for ' + duration + ' seconds ' + password);
		
		var web3 = this.session.getWeb3Instance();
		
		var res = web3.personal.unlockAccount(this.address, password, duration);
		
		return res;
	}
	
	lock() {
		if (this.session.needToUnlockAccounts() === false) 
			return;
		
		this.lastunlock = null; // unix time
		this.lastunlockduration = null;
		
		var web3 = this.session.getWeb3Instance();
		
		web3.personal.lockAccount(this.address)
	}
	
	isLocked() {
		var session = this.session;
		
		if (session.needToUnlockAccounts() === false) 
			return false;
		
		if (this.lastunlock == null)
			return true;
		
		var now = Date.now()/1000; // in seconds
		
		if (now - this.lastunlock > this.lastunlockduration - 1) {
			this.lock();
			
			return true;
		}
	}
	
	getBalance() {
		var EthereumNodeAccess = this.session.getEthereumNodeAccessInstance();
		
		return EthereumNodeAccess.web3_getBalance(this.address);
	}
	
	// encryption
	canDoAesEncryption() {
		if (this.private_key != null)
			return true;
		else
			return false;
	}
	
	canDoAesDecryption() {
		if (this.private_key != null)
			return true;
		else
			return false;
	}
	
	getAesCryptionParameters() {
		//var key = 'f06d69cdc7da0faffb1008270bca38f5';
		//var key = 'ae6ae8e5ccbfb04590405997ee2d52d2

		var key = this.private_key.substring(2, 34);
		//var rootiv = '6087dab2f9fdbbfaddc31a90ae6ae8e5ccbfb04590405997ee2d529735c1e6';
		var rootiv = '6087dab2f9fdbbfaddc31a90ae6ae8e5ccbfb04590405997ee2d529735c1e6aef54cde547';
		var iv = rootiv.substring(0,32);
		
		return {
			key: key,
			iv: iv,
			algo: 'aes-128-ctr'
		}
	}
	
	encryptString(plaintext) {
		return this.aesEncryptString(plaintext);
	}
	
	decryptString(ciphertext) {
		return this.aesDecryptString(ciphertext);
	}
	
	// symmetric encryption with the private key
	aesEncryptString(plaintext) {
		if (this.private_key == null)
			throw 'No private key set to encrypt string ' + plaintext;
		
		if (!plaintext)
			return plaintext;

		var keythereum = this.session.getKeythereumInstance();
		
		/*console.log('typeof keythereum:',               (typeof keythereum));
		console.log('Object.keys(keythereum):',         Object.keys(keythereum));*/
		
		var cryptparams = this.getAesCryptionParameters();
		
		var key = cryptparams.key;
		var iv = cryptparams.iv; 
		var algo = cryptparams.algo;
		
		console.log('key is ' + key);
		console.log('iv is ' + iv);
		
		var plaintextbuf = keythereum.str2buf(plaintext, 'utf8');
		
		var ciphertext = keythereum.encrypt(plaintextbuf, key, iv).toString('hex');//, algo);
		
		console.log('plaintext input is ' + plaintext);
		console.log('ciphertext is ' + ciphertext);
		
		var decipheredtext = this.aesDecryptString(ciphertext);
		
		console.log('deciphered text is ' + decipheredtext);
		
		
		return ciphertext;
	}
	
	aesDecryptString(cyphertext) {
		console.log('Session.aesDecryptString called for ' + cyphertext);
		
		if (this.private_key == null)
			throw 'No private key set to decrypt string ' + cyphertext;
		
		if (!cyphertext)
			return cyphertext;

		var keythereum = this.session.getKeythereumInstance();
		
		var cryptparams = this.getAesCryptionParameters();
		
		var key = cryptparams.key;
		var iv = cryptparams.iv; 
		var algo = cryptparams.algo;
		
		var cyphertextbuf = keythereum.str2buf(cyphertext, 'hex');
		
		var plaintext = keythereum.decrypt(cyphertextbuf, key, iv).toString('utf8');
		
		console.log('plaintext is ' + plaintext);
		
		return plaintext;
	}
	
	// asymmetric encryption with the private/public key pair
	canDoRsaEncryption() {
		if (this.public_key != null)
			return true;
		else
			return false;
	}
	
	canDoRsaDecryption() {
		if (this.private_key != null)
			return true;
		else
			return false;
	}
	
	rsaEncryptString(plaintext) {
		return plaintext;
	}
	
	rsaDecryptString(cyphertext) {
		return cyphertext;
	}
	
	// signature
	signString(text) {
		
		console.log('creating signature for text '+ text);
		
		var web3 = this.session.getWeb3Instance();
		var ethereumjs = this.session.getEthereumJsInstance();
		
		var account_address = this.getAddress();
		
		//
		// signing
		//
		
		// web3.eth

		//var texthash = '8dfe9be33ccb1c830e048219729e8c01f54c768004d8dc035105629515feb38e';
		//var textHashBuffer = ethereumjs.Buffer.Buffer(texthash, 'hex');
		var textHashBuffer = ethereumjs.Util.sha256(text);
		var texthash = textHashBuffer.toString('hex')
		
		console.log( 'text hash is: ', texthash);

		/*var eth_signature = web3.eth.sign(account_address, texthash);
		console.log( 'web3.eth signature is: ', eth_signature);*/

		// Util signing
		var priv_key = this.private_key.split('x')[1];
		//var priv_key = '3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1';
		var priv_key_Buffer = ethereumjs.Buffer.Buffer(priv_key, 'hex')
		var util_signature =  ethereumjs.Util.ecsign(textHashBuffer, priv_key_Buffer);
		
		console.log( 'ethereumjs.Util signature is: ', util_signature);

		/*
		//
		// recover
		//
		
		// web3.eth recover
		var sign = eth_signature.split('x')[1];

		var r = ethereumjs.Buffer.Buffer(sign.substring(0, 64), 'hex')
		var s = ethereumjs.Buffer.Buffer(sign.substring(64, 128), 'hex')
		//var v = ethereumjs.Buffer.Buffer((parseInt(sign.substring(128, 130)) + 27).toString());
		var v = (parseInt(sign.substring(128, 130)) + 27);
		
		
		//console.log('r s v : ', r, s , v)

		// console.log('v: ', v)

		var eth_pub = ethereumjs.Util.ecrecover(textHashBuffer, v, r, s);
		
		console.log('eth recovered pub key is: ',   '0x' + eth_pub.toString('hex'));

		var eth_recoveredAddress = '0x' + ethereumjs.Util.pubToAddress(eth_pub).toString('hex');
		
		
		// Util recover
		var util_pub = ethereumjs.Util.ecrecover(textHashBuffer, util_signature.v, util_signature.r, util_signature.s);
		
		console.log('util recovered pub key is: ',   '0x' + util_pub.toString('hex'));
	
		var util_recoveredAddress = '0x' + ethereumjs.Util.pubToAddress(util_pub).toString('hex');

		console.log('account_address is: ',   account_address);
		console.log('eth_recoveredAddress is: ',   eth_recoveredAddress);
		console.log('util_recoveredAddress is: ',   util_recoveredAddress);

		console.log( 'isMatch: ', util_recoveredAddress === account_address );	
		*/
		
		var signature = ethereumjs.Util.toRpcSig(util_signature.v, util_signature.r, util_signature.s);
		
		console.log('signature is: ', signature);
		
		console.log('Account.validateStringSignature returns ' + this.validateStringSignature(text, signature));
		
		return signature; 
	}
	
	validateStringSignature(text, signature) {
		if (signature) {
			var ethereumjs = this.session.getEthereumJsInstance();
			
			var account_address = this.getAddress();

			var textHashBuffer = ethereumjs.Util.sha256(text);
			var texthash = textHashBuffer.toString('hex')

			var sig = ethereumjs.Util.fromRpcSig(signature);
			
			console.log('signature is: ', signature);
			console.log('sig.r sig.s sig.v ', sig.r, sig.s, sig.v);
			
			var util_pub = ethereumjs.Util.ecrecover(textHashBuffer, sig.v, sig.r, sig.s);
			var util_recoveredAddress = '0x' + ethereumjs.Util.pubToAddress(util_pub).toString('hex');
			
			return (util_recoveredAddress === account_address);
		}
		else
			return false;
	}
	
	// chain async
	getChainBalance(callback) {
		var EthereumNodeAccess = this.session.getEthereumNodeAccessInstance();
		
		return EthereumNodeAccess.web3_getBalance(this.address, callback);
	}
	
	
	// static
	static getAccountObject(session, address) {
		return session.getAccountObject(address);
	}
	
	static getWalletAccountObject(session) {
		return session.getWalletAccountObject();
	}
	
}

if ( typeof window !== 'undefined' && window )
GlobalClass.Account = Account;
else
module.exports = Account; // we are in node js

if ( typeof window !== 'undefined' && window )
GlobalClass.AccountMap = AccountMap;
else
Account.AccountMap = AccountMap; // we are in node js
