(function(){
  require(['widget-detail-spec-generator', 'widgets-manager', 'widget-spec', 'form-manager', 'util'], function(widgetDetailSpecGenerator, widgetsManager, widgetSpec, formManager, util){
    return $(function(){
      var form;
      window.detailSpec = widgetDetailSpecGenerator.generate(widgetSpec);
      console.log(detailSpec);
      form = $('form#assignment').append(widgetsManager.createWidgetDom(detailSpec));
      return window.assignmentForm = formManager.create(form);
    });
  });
}).call(this);
