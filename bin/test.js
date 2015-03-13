(function(){
  require(['app-engine', 'app-spec', 'form-manager'], function(appEngine, appSpec, formManager){
    return $(function(){
      var form;
      appEngine.run(appSpec);
      form = $('form#assignment').append(appEngine.widgets['create_assignment'].dom);
      return window.assignmentForm = formManager.create(form);
    });
  });
}).call(this);
