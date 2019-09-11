'use strict';

var Module = class {
	
	constructor() {
		this.name = 'account-encryption';
		
		this.global = null; // put by global on registration
		this.isready = false;
		this.isloading = false;
		
		this.ethereum_node_access_instance = null;
		
	}
	
	init() {
		console.log('module init called for ' + this.name);

		var global = this.global;
		
		this.isready = true;
	}
	
	// compulsory  module functions
	loadModule(parentscriptloader, callback) {
		console.log('loadModule called for module ' + this.name);

		if (this.isloading)
			return;
			
		this.isloading = true;

		var self = this;
		var global = this.global;
		
		var modulescriptloader = global.getScriptLoader('accountencryptionmoduleloader', parentscriptloader);

		var moduleroot = './includes/lib';

		if (global.isInBrowser()) {
			modulescriptloader.push_script( moduleroot + '/ethereumjs-all-2017-10-31.min.js');
			modulescriptloader.push_script( moduleroot + '/keythereum.min-1.0.2.js');
			modulescriptloader.push_script( moduleroot + '/bitcore.min-0.11.7.js');
			modulescriptloader.push_script( moduleroot + '/bitcore-ecies.min-0.9.2.js');
		}


		modulescriptloader.load_scripts(function() { self.init(); if (callback) callback(null, self); });
		
		return modulescriptloader;
	}
	
	isReady() {
		return this.isready;
	}

	hasLoadStarted() {
		return this.isloading;
	}

	// optional  module functions
	
	// objects
	getAccountEncryptionInstance(session, account) {
		if (!account)
			return;
		
		if (account.accountencryption)
			return account.accountencryption;
		
		console.log('instantiating AccountEncryption');
		
		var global = this.global;

		var result = [];
		var inputparams = [];
		
		inputparams.push(this);
		inputparams.push(session);
		inputparams.push(account);
		
		result[0] = new AccountEncryption(session, account);
		
		// call hook to let modify or replace instance
		var ret = global.invokeHooks('getAccountEncryptionInstance_hook', result, inputparams);
		
		if (ret && result[0]) {
			account.accountencryption = result[0];
		}
		else {
			account.accountencryption = new AccountEncryption(session, account);
		}
		
		return account.accountencryption;
	}
	
}

class AccountEncryption {
	constructor(session, account) {
		this.session = session;
		this.account = account;
	}
	
	isReady(callback) {
		var promise = new Promise(function (resolve, reject) {
			
			if (callback)
				callback(null, true);
			
			resolve(true);
		});
		
		return promise
	}
	
	// encryption
	getKeythereumClass() {
		if ( typeof window !== 'undefined' && window ) {
			if (window.keythereum !== 'undefined')
			return window.keythereum;
			else if (window.simplestore.keythereum !== 'undefined')
					return window.simplestore.keythereum;
		}
		else {
			throw 'nodejs not implemented';
			//return require('keythereum');
		}
	}
	
	getEthereumJsClass() {
		if ( typeof window !== 'undefined' && window ) {
			if (window.ethereumjs !== 'undefined')
			return window.ethereumjs;
			else if (window.simplestore.ethereumjs !== 'undefined')
				return window.simplestore.ethereumjs;
		}
		else {
			throw 'nodejs not implemented';
			/*var ethereumjs;
			
			ethereumjs = require('ethereum.js');
			ethereumjs.Util = require('ethereumjs-util');
			ethereumjs.Wallet = require('ethereumjs-wallet');

			return ethereumjs;*/
		}
	}
	
	setPrivateKey(privkey) {
		var account = this.account;
		account.private_key = privkey;
		
		if (!privkey)
			return;
		
		var ethereumjs = this.getEthereumJsClass();
		
		// ECE
		if (account.public_key == null) {
			//console.log('ethereumjs is ' + JSON.stringify(ethereumjs));
			
			account.public_key = '0x' + ethereumjs.Util.privateToPublic(account.private_key).toString('hex');
			
			console.log('aes public key is: ' + account.public_key );
			
			if (account.address != null) {
				// remove in session
				this.session.removeAccountObject(account);
			}
			
			account.address = '0x' + ethereumjs.Util.privateToAddress(account.private_key).toString('hex');
			
			console.log('address is: ' + account.address);
		}
		else {
			// check public key corresponds
			var public_key = '0x' + ethereumjs.Util.privateToPublic(account.private_key).toString('hex');
			
			if (public_key != account.public_key) {
				// overwrite
				account.public_key = public_key;
				
				if (account.address != null) {
					// remove in session
					this.session.removeAccountObject(account);
				}
				
				account.address = '0x' + ethereumjs.Util.privateToAddress(account.private_key).toString('hex');
			}
		}
		
		// RSA
		if (account.rsa_public_key == null) {
			account.rsa_public_key = this.getRsaPublicKeyFromPrivateKey(account.private_key);
			
			console.log('rsa public key is: ' + account.rsa_public_key );
		}
		else {
			// check rsa public key corresponds
			var rsa_public_key = this.getRsaPublicKeyFromPrivateKey(account.private_key);
			
			if (rsa_public_key != account.rsa_public_key) {
				// overwrite
				account.rsa_public_key = rsa_public_key;
				
				if (account.address != null) {
					// remove in session
					this.session.removeAccountObject(account);
				}
			}
			
		}
	}
	
	setPublicKey(pubkey) {
		var account = this.account;

		if (account.private_key)
			throw 'you should not call directly setPublicKey if a private key has already been set';

		var ethereumjs = this.getEthereumJsClass();
		
		account.public_key = pubkey;
		
		if (account.address != null) {
			// remove in session
			this.session.removeAccountObject(account);
		}
		
		account.address = '0x' + ethereumjs.Util.publicToAddress(account.public_key).toString('hex');
	}
	
	// symmetric
	canDoAesEncryption() {
		if (this.account.private_key != null)
			return true;
		else
			return false;
	}
	
	canDoAesDecryption() {
		if (this.account.private_key != null)
			return true;
		else
			return false;
	}
	
	getAesCryptionParameters() {
		//var key = 'f06d69cdc7da0faffb1008270bca38f5';
		//var key = 'ae6ae8e5ccbfb04590405997ee2d52d2

		var key = this.account.private_key.substring(2, 34);
		//var rootiv = '6087dab2f9fdbbfaddc31a90ae6ae8e5ccbfb04590405997ee2d529735c1e6';
		var rootiv = '6087dab2f9fdbbfaddc31a90ae6ae8e5ccbfb04590405997ee2d529735c1e6aef54cde547';
		var iv = rootiv.substring(0,32);
		
		return {
			key: key,
			iv: iv,
			algo: 'aes-128-ctr'
		}
	}
	
	// symmetric encryption with the private key
	aesEncryptString(plaintext) {
		if (this.account.private_key == null)
			throw 'No private key set to encrypt string ' + plaintext;
		
		if (!plaintext)
			return plaintext;

		var keythereum = this.getKeythereumClass();
		
		/*console.log('typeof keythereum:',               (typeof keythereum));
		console.log('Object.keys(keythereum):',         Object.keys(keythereum));*/
		
		var cryptparams = this.getAesCryptionParameters();
		
		var key = cryptparams.key;
		var iv = cryptparams.iv; 
		var algo = cryptparams.algo;
		
		console.log('key is ' + key);
		console.log('iv is ' + iv);
		
		var plaintextbuf = keythereum.str2buf(plaintext, 'utf8');
		
		var ciphertext = '0x' + keythereum.encrypt(plaintextbuf, key, iv).toString('hex');//, algo);
		
		console.log('plaintext input is ' + plaintext);
		console.log('ciphertext is ' + ciphertext);
		
		var decipheredtext = this.aesDecryptString(ciphertext);
		
		console.log('deciphered text is ' + decipheredtext);
		
		
		return ciphertext;
	}
	
	aesDecryptString(cyphertext) {
		console.log('AccountEncryption.aesDecryptString called for ' + cyphertext);
		
		if (this.account.private_key == null)
			throw 'No private key set to decrypt string ' + cyphertext;
		
		if (!cyphertext)
			return cyphertext;

		var keythereum = this.getKeythereumClass();
		
		var cryptparams = this.getAesCryptionParameters();
		
		var key = cryptparams.key;
		var iv = cryptparams.iv; 
		var algo = cryptparams.algo;
		
		var cyphertextbuf = keythereum.str2buf(cyphertext.substring(2), 'hex');
		
		var plaintext = keythereum.decrypt(cyphertextbuf, key, iv).toString('utf8');
		
		console.log('plaintext is ' + plaintext);
		
		return plaintext;
	}
	
	// asymmetric encryption with the private/public key pair
	getBitcoreClass() {
		if ( typeof window !== 'undefined' && window ) {
			var bitcore = window.bitcore;
			
			if (bitcore)
			return bitcore;
			else {
				//throw 'window.bitcore not initialized';
				
				if (typeof window.simplestore.bitcore === 'undefined')
				window.simplestore.bitcore = bit_require('bitcore');
				
				return window.simplestore.bitcore;
			}
		}
		else {
			throw 'nodejs not implemented';
			//return require('bitcore');
		}
	}
	
	
	getBitcoreEcies() {
		if ( typeof window !== 'undefined' && window ) {
			var bitcore_ecies = window.bitcore_ecies;
			
			if (bitcore_ecies)
			return bitcore_ecies;
			else {
				//throw 'window.bitcore_ecies not initialized';

				if (typeof window.simplestore.bitcore_ecies === 'undefined')
				window.simplestore.bitcore_ecies = bit_require('bitcore_ecies');

				return window.simplestore.bitcore_ecies;
			}
		}
		else {
			throw 'nodejs not implemented';
			//return require('bitcore-ecies');
		}
	}
	
	
	canDoRsaEncryption() {
		if (this.account.rsa_public_key != null)
			return true;
		else
			return false;
	}
	
	canDoRsaDecryption() {
		if (this.account.private_key != null)
			return true;
		else
			return false;
	}
	
	getRsaWifFromPrivateKey(privatekey) {
		return privatekey.split('x')[1];
	}
	
	getRsaPublicKeyFromPrivateKey(privateKey) {
	    var bitcore = this.getBitcoreClass();

	    var wif_key = this.getRsaWifFromPrivateKey(privateKey);
		var privateKey = new bitcore.PrivateKey(wif_key);
		var rsa_public_key = '0x' + privateKey.toPublicKey().toString('hex');

		return rsa_public_key;
	}
	
	getRsaPublicKey(account) {
		if (!account)
			throw 'Null account passed to getRsaPublicKey';
		
		var rsaPubKey = account.getRsaPublicKey();
		
		if (rsaPubKey)
			return rsaPubKey;
		else {
			if (account.private_key) {
				// in case rsa public key has not been computed (should not happen)
				console.log('SHOULD NOT HAPPEN: no rsa public key, but account has a private key');
			    var bitcore = this.getBitcoreClass();

			    var accountwif = this.getRsaWifFromPrivateKey(account.private_key);
				var accountPrivateKey = new bitcore.PrivateKey(accountwif);
				
				return '0x' + accountPrivateKey.toPublicKey().toString('hex');
			}
			else {
				throw 'account has not private key to compute rsa public key';
			}
		}
	}
	
	rsaEncryptString(plaintext, recipientaccount) {
		console.log('AccountEncryption.rsaEncryptString called for ' + plaintext);
		
	    var bitcore = this.getBitcoreClass();
	    var ECIES = this.getBitcoreEcies();

	    // sender, this account
	    //var senderwif = 'Kxr9tQED9H44gCmp6HAdmemAzU3n84H3dGkuWTKvE23JgHMW8gct';
	    var senderwif = this.getRsaWifFromPrivateKey(this.account.private_key);
		var senderPrivateKey = new bitcore.PrivateKey(senderwif);
		
		// recipient
	    //var recipientwif = 'Kxr9tQED9H44gCmp6HAdmemAzU3n84H3dGkuWTKvE23JgHMW8gct';
	    //var recipientwif = this.getRsaWifFromPrivateKey(recipientaccount.private_key);
		//var recipientPrivateKey = new bitcore.PrivateKey(recipientwif);
		//var recipientPublicKey = recipientPrivateKey.toPublicKey();
		var rsapubkey = this.getRsaPublicKey(recipientaccount);
		var recipientPublicKey = new bitcore.PublicKey(rsapubkey.substring(2));

		// encryption
		var encryptor = new ECIES()
	      .privateKey(senderPrivateKey)
	      .publicKey(recipientPublicKey);

	    var encrypted = '0x' + encryptor.encrypt(plaintext).toString('hex');
	    
	    // test decrypt
	    /*var decrypted = recipientaccount.rsaDecryptString(encrypted, this.account);
	    
	    console.log('plaintext is ' + plaintext);
	    console.log('encrypted text is ' + encrypted);
	    console.log('decrypted text is ' + decrypted);*/

	    
	    return encrypted;
	}
	
	rsaDecryptString(cyphertext, senderaccount) {
		console.log('AccountEncryption.rsaDecryptString called for ' + cyphertext);
		
		var hexcypertext = cyphertext.substring(2);
		
		if (hexcypertext.length == 0)
			return '';

	    var bitcore = this.getBitcoreClass();
	    var ECIES = this.getBitcoreEcies();
		var ethereumjs = this.getEthereumJsClass();
	    
	    // sender
	    //var senderwif = 'Kxr9tQED9H44gCmp6HAdmemAzU3n84H3dGkuWTKvE23JgHMW8gct';
	    //var senderwif = this.getRsaWifFromPrivateKey(senderaccount.private_key);
		//var senderPrivateKey = new bitcore.PrivateKey(senderwif);
		//var senderPublicKey = senderPrivateKey.toPublicKey();
		var rsapubkey = this.getRsaPublicKey(senderaccount);
		var senderPublicKey = new bitcore.PublicKey(rsapubkey.substring(2));

		// recipient, this account
	    //var recipientwif = 'Kxr9tQED9H44gCmp6HAdmemAzU3n84H3dGkuWTKvE23JgHMW8gct';
	    var recipientwif = this.getRsaWifFromPrivateKey(this.account.private_key);
		var recipientPrivateKey = new bitcore.PrivateKey(recipientwif);

		var decryptor = new ECIES()
	      .privateKey(recipientPrivateKey)
	      .publicKey(senderPublicKey);
		
		var cypherbuf = ethereumjs.Buffer.Buffer(hexcypertext, 'hex');

	    var plaintext = decryptor.decrypt(cypherbuf).toString('utf8');

	    return plaintext;
	}
	
	// signature
	signString(plaintext) {
		
		console.log('creating signature for text '+ plaintext);
		
		var ethereumjs = this.getEthereumJsClass();
		
		var account_address = this.account.getAddress();
		
		//
		// signing
		//
		

		var textHashBuffer = ethereumjs.Util.sha256(plaintext);
		var texthash = textHashBuffer.toString('hex')
		
		console.log( 'text hash is: ', texthash);

		// Util signing
		var priv_key = this.account.private_key.split('x')[1];
		var priv_key_Buffer = ethereumjs.Buffer.Buffer(priv_key, 'hex')
		var util_signature =  ethereumjs.Util.ecsign(textHashBuffer, priv_key_Buffer);
		

		console.log( 'ethereumjs.Util signature is: ', util_signature);
		
		var signature = ethereumjs.Util.toRpcSig(util_signature.v, util_signature.r, util_signature.s);
		
		console.log('signature is: ', signature);
		
		console.log('Account.validateStringSignature returns ' + this.validateStringSignature(plaintext, signature));
		
		return signature; 
	}
	
	validateStringSignature(plaintext, signature) {
		if (signature) {
			var ethereumjs = this.getEthereumJsClass();
			
			var account_address = this.account.getAddress();

			var textHashBuffer = ethereumjs.Util.sha256(plaintext);
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
	
	// utils
	isValidAddress(address) {
		var ethereumjs = this.getEthereumJsClass();
		
		if (ethereumjs.Util.isValidAddress(address)){
			return true;
		}
		else {
			throw address + ' is not a valid address!';
		}
	}

	isValidPublicKey(pubkey) {
		var ethereumjs = this.getEthereumJsClass();
		
		var pubkeystr = pubkey.substring(2); // remove leading '0x'
		var pubkeybuf = ethereumjs.Buffer.Buffer(pubkeystr, 'hex'); 
		
		if (ethereumjs.Util.isValidPublic(pubkeybuf)){
			return true;
		}
		else {
			throw pubkey + ' is not a valid public key!';
		}
	}
	
	isValidPrivateKey(privkey) {
		var ethereumjs = this.getEthereumJsClass();
		
		/*console.log('typeof ethereumjs:',               (typeof ethereumjs));
		console.log('Object.keys(ethereumjs):',         Object.keys(ethereumjs));
		console.log('typeof ethereumjs.Tx:',            (typeof ethereumjs.Tx));
		console.log('typeof ethereumjs.RLP:',           (typeof ethereumjs.RLP));
		console.log('typeof ethereumjs.Util:',          (typeof ethereumjs.Util));
		console.log('typeof ethereumjs.Buffer:',        (typeof ethereumjs.Buffer));
		console.log('typeof ethereumjs.Buffer.Buffer:', (typeof ethereumjs.Buffer.Buffer));*/
		
		var privkeystr = privkey.substring(2); // remove leading '0x'
		var privkeybuf = ethereumjs.Buffer.Buffer(privkeystr, 'hex'); 
		
		if (ethereumjs.Util.isValidPrivate(privkeybuf)){
			return true;
		}
		else {
			throw privkey + ' is not a valid private key!';
		}
	}
	
	generatePrivateKey() {
		var ethereumjs = this.getEthereumJsClass();

		var accountPassword="123456";
		var key = ethereumjs.Wallet.generate(accountPassword);
		return '0x' + key._privKey.toString('hex');		
	}

	
}

if ( typeof window !== 'undefined' && window ) // if we are in browser and not node js (e.g. truffle)
window.simplestore.AccountEncryption = AccountEncryption;
else
module.exports = AccountEncryption; // we are in node js

if ( typeof GlobalClass !== 'undefined' && GlobalClass )
GlobalClass.getGlobalObject().registerModuleObject(new Module());
else if (typeof window !== 'undefined') {
	let _GlobalClass = ( window && window.simplestore && window.simplestore.Global ? window.simplestore.Global : null);
	
	_GlobalClass.getGlobalObject().registerModuleObject(new Module());
}
