(function(){
  $(function(){
    var form;
    form = $('form#assignment').append(fieldsetMaker.make(spec));
    return window.assignmentForm = formManager.create(form);
  });
}).call(this);
