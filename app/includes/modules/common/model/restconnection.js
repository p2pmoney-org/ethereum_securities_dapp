/**
 * 
 */
'use strict';

var RestConnection = class {
	constructor(session, rest_server_url, rest_server_api_path) {
		this.session = session;
		
		this.rest_server_url = rest_server_url;
		this.rest_server_api_path = rest_server_api_path;
		
		this.header = Object.create(null);
	}
	
	getRestCallUrl() {
	    var rest_server_url = this.rest_server_url;
	    var rest_server_api_path = this.rest_server_api_path;
		
	    return rest_server_url + rest_server_api_path ;
	}
	
	addToHeader(keyvalue) {
		this.header[keyvalue.key] = keyvalue.value;
	}
	
	_setRequestHeader(xhttp) {
	    xhttp.setRequestHeader("Content-type", "application/json");
	    xhttp.setRequestHeader("sessiontoken", this.session.getSessionUUID());
		
	    for (var key in this.header) {
		    xhttp.setRequestHeader(key, this.header[key]);
	    }
	}
	
	_createXMLHttpRequest(method, resource) {
		var xhttp = new XMLHttpRequest();
		
	    var rest_call_url = this.getRestCallUrl();
	    var resource_url = rest_call_url + resource;
	    
		// allow Set-Cookie for CORS calls
		//xhttp.withCredentials = true;
		
	    xhttp.open(method, resource_url, true);

		this._setRequestHeader(xhttp);
	    
	    return xhttp;
	}
	
	rest_get(resource, callback) {
		console.log("RestConnection.rest_get called for resource " + resource);
		
		var session = this.session;
	    
		var xhttp = this._createXMLHttpRequest("GET", resource);
		
	    xhttp.send();
	    
	    xhttp.onload = function(e) {
		    if (xhttp.status == 200) {
			    //console.log('response text is ' + xhttp.responseText);
			    
		    	if (callback) {
			    	var jsonresponse = JSON.parse(xhttp.responseText);
			    		    		
			    	if (jsonresponse['status'] && (jsonresponse['status'] == '1')) {
			    		//console.log('RestConnection.rest_get response is ' + JSON.stringify(jsonresponse));
			    		callback(null, jsonresponse);
			    	}
			    	else {
			    		callback((jsonresponse['error'] ? jsonresponse['error'] : 'unknown error'), null);
			    	}
		    	}
		    }
		    else {
		    	if (callback)
		    		callback(xhttp.statusText, null);	
			}
	    	
	    };
	    
	    xhttp.onerror = function (e) {
	    	console.error('rest error is ' + xhttp.statusText);
	    	
	    	if (callback)
	    		callback(xhttp.statusText, null);	
	    };
	    
	}
	
	rest_post(resource, postdata, callback) {
		console.log("RestConnection.rest_post called for resource " + resource);
		
		var session = this.session;
	    
		var xhttp = this._createXMLHttpRequest("POST", resource);
		
	    xhttp.send(JSON.stringify(postdata));
	    
	    xhttp.onload = function(e) {
		    if ((xhttp.status == 200) ||  (xhttp.status == 201)) {
			    //console.log('response text is ' + xhttp.responseText);
		    	
		    	if (callback) {
			    	var jsonresponse = JSON.parse(xhttp.responseText);
			    		    		
			    	if (jsonresponse['status'] && (jsonresponse['status'] == '1')) {
			    		//console.log('RestConnection.rest_post response is ' + JSON.stringify(jsonresponse));
			    		callback(null, jsonresponse);
			    	}
			    	else  {
			    		callback((jsonresponse['error'] ? jsonresponse['error'] : 'unknown error'), null);
			    	}
		    	}
		    }
		    else {
		    	if (callback)
		    		callback(xhttp.statusText, null);	
			}
	    	
	    };
	    
	    xhttp.onerror = function (e) {
	    	console.error('rest error is ' + xhttp.statusText);
	    	
	    	if (callback)
	    		callback(xhttp.statusText, null);	
	    };
	    
	}
	
	rest_put(resource, postdata, callback) {
		console.log("RestConnection.rest_put called for resource " + resource);
		
		var session = this.session;
	    
		var xhttp = this._createXMLHttpRequest("PUT", resource);
		
	    xhttp.send(JSON.stringify(postdata));
	    
	    xhttp.onload = function(e) {
		    if ((xhttp.status == 200) ||  (xhttp.status == 201)){
			    //console.log('response text is ' + xhttp.responseText);
		    	if (callback) {
			    	var jsonresponse = JSON.parse(xhttp.responseText);
			    		    		
			    	if (jsonresponse['status'] && (jsonresponse['status'] == '1')) {
			    		//console.log('RestConnection.rest_put response is ' + JSON.stringify(jsonresponse));
			    		callback(null, jsonresponse);
			    	}
			    	else  {
			    		callback((jsonresponse['error'] ? jsonresponse['error'] : 'unknown error'), null);
			    	}
		    	}
		    }
		    else {
		    	if (callback)
		    		callback(xhttp.statusText, null);	
			}
	    	
	    };
	    
	    xhttp.onerror = function (e) {
	    	console.error('rest error is ' + xhttp.statusText);
	    	
	    	if (callback)
	    		callback(xhttp.statusText, null);	
	    };
	    
	}
	
	rest_delete(resource, callback) {
		console.log("RestConnection.rest_delete called for resource " + resource);
		
		var session = this.session;
	    
		var xhttp = this._createXMLHttpRequest("DELETE", resource);
		
	    xhttp.send();
	    
	    xhttp.onload = function(e) {
		    if (xhttp.status == 200) {
			    //console.log('response text is ' + xhttp.responseText);
			    
		    	if (callback) {
			    	var jsonresponse = JSON.parse(xhttp.responseText);
			    		    		
			    	if (jsonresponse['status'] && (jsonresponse['status'] == '1')) {
			    		callback(null, jsonresponse);
			    	}
			    	else {
			    		callback((jsonresponse['error'] ? jsonresponse['error'] : 'unknown error'), null);
			    	}
		    	}
		    }
		    else {
		    	if (callback)
		    		callback(xhttp.statusText, null);	
			}
	    	
	    };
	    
	    xhttp.onerror = function (e) {
	    	console.error('rest error is ' + xhttp.statusText);
	    	
	    	if (callback)
	    		callback(xhttp.statusText, null);	
	    };
	    
	}
}

if ( typeof GlobalClass !== 'undefined' && GlobalClass )
	GlobalClass.registerModuleClass('common', 'RestConnection', RestConnection);
else if (typeof window !== 'undefined') {
	let _GlobalClass = ( window && window.simplestore && window.simplestore.Global ? window.simplestore.Global : null);
	
	_GlobalClass.registerModuleClass('common', 'RestConnection', RestConnection);
}
else if (typeof global !== 'undefined') {
	// we are in node js
	let _GlobalClass = ( global && global.simplestore && global.simplestore.Global ? global.simplestore.Global : null);
	
	_GlobalClass.registerModuleClass('common', 'RestConnection', RestConnection);
}