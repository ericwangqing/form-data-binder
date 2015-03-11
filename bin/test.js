(function(){
  $(function(){
    var detailSpec, form;
    detailSpec = detailSpecGenerator.generate(widgetSpec);
    console.log(detailSpec);
    form = $('form#assignment').append(fieldsetMaker.make(spec));
    return window.assignmentForm = formManager.create(form);
  });
}).call(this);
