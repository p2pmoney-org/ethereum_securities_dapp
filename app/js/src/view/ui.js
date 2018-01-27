function include(file)
{

  var script  = document.createElement('script');
  script.src  = file;
  script.type = 'text/javascript';
  script.defer = true;

  document.getElementsByTagName('head').item(0).appendChild(script);

}

// include all necessary view js files here 
include('./js/src/view/breadcrumbs.js');
include('./js/src/view/forms.js');
include('./js/src/view/views.js');
