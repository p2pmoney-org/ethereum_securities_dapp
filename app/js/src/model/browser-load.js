function include(file)
{

  var script  = document.createElement('script');
  script.src  = file;
  script.type = 'text/javascript';
  script.defer = true;

  document.getElementsByTagName('head').item(0).appendChild(script);

}

// include all necessary model js files here 
include('./js/src/model/contracts.js');
include('./js/src/model/account.js');
include('./js/src/model/stakeholder.js');
include('./js/src/model/stocktransaction.js');
include('./js/src/model/stockissuance.js');
include('./js/src/model/stockledger.js');

include('./js/src/model/session.js'); // should be last
