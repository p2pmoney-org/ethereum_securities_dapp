/**
 * 
 */
'use strict';

var RestConnection = class {
	constructor(session, rest_server_url, rest_server_api_path) {
		this.session = session;
		
		this.rest_server_url = rest_server_url;
		this.rest_server_api_path = rest_server_api_path;
	}
	
	rest_get(resource, callback) {
		console.log("RestConnection.rest_get called for resource " + resource);
		
		var session = this.session;
	    
		var xhttp = new XMLHttpRequest();
	    
	    var rest_server_url = this.rest_server_url;
	    var rest_server_api_path = this.rest_server_api_path;
	    var resource_url = rest_server_url + rest_server_api_path + resource;
	    
	    xhttp.open("GET", resource_url, true);
	    
	    xhttp.setRequestHeader("Content-type", "application/json");
	    xhttp.setRequestHeader("sessiontoken", session.getSessionUUID());
	    
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
	    
		var xhttp = new XMLHttpRequest();
	    
	    var rest_server_url = this.rest_server_url;
	    var rest_server_api_path = this.rest_server_api_path;
	    var resource_url = rest_server_url + rest_server_api_path + resource;
	    
	    xhttp.open("POST", resource_url, true);
	    
	    xhttp.setRequestHeader("Content-type", "application/json");
	    xhttp.setRequestHeader("sessiontoken", session.getSessionUUID());
	    
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
	    
		var xhttp = new XMLHttpRequest();
	    
	    var rest_server_url = this.rest_server_url;
	    var rest_server_api_path = this.rest_server_api_path;
	    var resource_url = rest_server_url + rest_server_api_path + resource;
	    
	    xhttp.open("PUT", resource_url, true);
	    
	    xhttp.setRequestHeader("Content-type", "application/json");
	    xhttp.setRequestHeader("sessiontoken", session.getSessionUUID());
	    
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
	    
		var xhttp = new XMLHttpRequest();
	    
	    var rest_server_url = this.rest_server_url;
	    var rest_server_api_path = this.rest_server_api_path;
	    var resource_url = rest_server_url + rest_server_api_path + resource;
	    
	    xhttp.open("DELETE", resource_url, true);
	    
	    xhttp.setRequestHeader("Content-type", "application/json");
	    xhttp.setRequestHeader("sessiontoken", session.getSessionUUID());
	    
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
else
	module.exports = RestConnection; // we are in node js
