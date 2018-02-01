function include(file)
{

  var script  = document.createElement('script');
  script.src  = file;
  script.type = 'text/javascript';
  script.defer = true;

  document.getElementsByTagName('head').item(0).appendChild(script);

}

// include all necessary lib js files here 
include('./js/lib/bootstrap.min.js');
include('./js/lib/web3.min.js');
include('./js/lib/truffle-contract.js');
include('./js/lib/ethereumjs-all-2017-10-31.min.js');
include('./js/lib/keythereum.min.js');

include('./js/lib/ethereum-node-access.js');

