(function(){
  $(function(){
    var formManager, localRecoverier;
    formManager = require('form-manager');
    localRecoverier = require('local-recoverier');
    window.testForm = formManager.create('form#parsed');
    return localRecoverier.activate('form#parsed');
  });
}).call(this);
