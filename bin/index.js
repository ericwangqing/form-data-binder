(function(){
  $(function(){
    var formManager, localRecoverierManager;
    formManager = require('form-manager');
    localRecoverierManager = require('local-recoverier-manager');
    window.testForm = formManager.create('form#parsed');
    return window.testRecover = localRecoverierManager.create('form#parsed');
  });
}).call(this);
