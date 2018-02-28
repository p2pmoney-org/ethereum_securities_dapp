'use strict';

class AccountEncryption {
	constructor(session, account) {
		this.session = session;
		this.account = account;
	}
	
	// encryption
	getKeythereumClass() {
		if ( typeof window !== 'undefined' && window ) {
			return keythereum;
		}
		else {
			return require('keythereum');
		}
	}
	
	getEthereumJsClass() {
		if ( typeof window !== 'undefined' && window ) {
			return window.ethereumjs;
		}
		else {
			var ethereumjs;
			
			ethereumjs = require('ethereum.js');
			ethereumjs.Util = require('ethereumjs-util');
			ethereumjs.Wallet = require('ethereumjs-wallet');

			return ethereumjs;
		}
	}
	
	setPrivateKey(privkey) {
		var account = this.account;
		account.private_key = privkey;
		
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
		return require('bitcore');
	}
	
	
	getBitcoreEcies() {
		return require('bitcore-ecies');
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
		
		var EthereumNodeAccess = this.session.getEthereumNodeAccessInstance();
		var web3 = EthereumNodeAccess.getWeb3Instance();
		var ethereumjs = this.getEthereumJsClass();
		
		var account_address = this.account.getAddress();
		
		//
		// signing
		//
		
		// web3.eth

		//var texthash = '8dfe9be33ccb1c830e048219729e8c01f54c768004d8dc035105629515feb38e';
		//var textHashBuffer = ethereumjs.Buffer.Buffer(texthash, 'hex');
		var textHashBuffer = ethereumjs.Util.sha256(plaintext);
		var texthash = textHashBuffer.toString('hex')
		
		console.log( 'text hash is: ', texthash);

		/*var eth_signature = web3.eth.sign(account_address, texthash);
		console.log( 'web3.eth signature is: ', eth_signature);*/

		// Util signing
		var priv_key = this.account.private_key.split('x')[1];
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
window.AccountEncryption = AccountEncryption;
else
module.exports = AccountEncryption; // we are in node js
