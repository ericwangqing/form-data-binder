(function(){
  $(function(){
    window.testForm = formManager.create('form#parsed');
    return window.testRecover = localRecoverierManager.create('form#parsed');
  });
}).call(this);
