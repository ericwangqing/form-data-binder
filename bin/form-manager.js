(function(){
  var restrictionRegex, Form, formManager, root, ref$, slice$ = [].slice;
  restrictionRegex = /\[(\d+).+([\d*]+)]/;
  Form = (function(){
    Form.displayName = 'Form';
    var prototype = Form.prototype, constructor = Form;
    function Form(selector, formData){
      this.formData = formData;
      this.form = $(selector);
      this.renderContainers();
    }
    prototype.renderContainers = function(){
      var i$, ref$, len$, container;
      for (i$ = 0, len$ = (ref$ = this.form.find('.a-plus.array-container')).length; i$ < len$; ++i$) {
        container = ref$[i$];
        container = new FormArrayContainer(container);
        container.init();
      }
    };
    prototype.on = function(eventName, cb){
      return this.form.on(eventName, function(event){
        var args;
        args = slice$.call(arguments, 1);
        return cb.apply(null, args);
      });
    };
    prototype.emit = function(eventName){
      var args, ref$;
      args = slice$.call(arguments, 1);
      return (ref$ = this.form).trigger.apply(ref$, [eventName].concat(slice$.call(args)));
    };
    prototype.f2d = function(data){
      return this.formData.f2d(this.form, data);
    };
    prototype.d2f = function(data){
      this.formData.d2f(data, this.form);
    };
    return Form;
  }());
  formManager = function(formData){
    formData == null && (formData = this.formData);
    return {
      create: function(selector){
        return new Form(selector, formData);
      }
    };
  };
  if (typeof define != 'undefined' && define !== null) {
    define('form-manager', ['form-data'], function(formData){
      return formManager(formData);
    });
  } else {
    root = (ref$ = typeof module != 'undefined' && module !== null ? module.exports : void 8) != null ? ref$ : this;
    root.formManager = formManager(root.formData);
  }
}).call(this);
