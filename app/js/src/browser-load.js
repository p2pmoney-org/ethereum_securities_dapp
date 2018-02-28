function promise_include(file)
{

	var promise = new Promise(function(resolve, reject) {
		console.log('starting load of script ' + file);
		var script  = document.createElement('script');
		script.src  = file;
		script.type = 'text/javascript';
		script.defer = true;

		script.onload = function(){
			console.log('script ' + file + ' is now loaded');
			return resolve(true);
		};

		document.getElementsByTagName('head').item(0).appendChild(script);
	});

	return promise;
}

/*function chain_include(promise, file) {
	return promise.then(promise_include(file));
}
*/

//include all global js files here 
promise_include('./js/src/config.js')
.then(promise_include('./js/src/global.js'))


.then(promise_include('./js/src/xtra/xtra-config.js'))

//include all necessary view js files here 
.then(promise_include('./js/src/control/controller.js'))

//include all necessary view js files here 
.then(promise_include('./js/src/view/breadcrumbs.js'))
.then(promise_include('./js/src/view/forms.js'))
.then(promise_include( './js/src/view/views.js'))

// include all necessary model js files here 
.then(promise_include('./js/src/model/contracts.js'))
.then(promise_include('./js/src/model/account.js'))
.then(promise_include('./js/src/model/stakeholder.js'))

.then(promise_include('./js/src/model/stockledger/stocktransaction.js'))
.then(promise_include('./js/src/model/stockledger/stockissuance.js'))
.then(promise_include('./js/src/model/stockledger/stockholder.js'))
.then(promise_include('./js/src/model/stockledger/stockledger.js'))

.then(promise_include('./js/src/model/session.js')); // should be last


