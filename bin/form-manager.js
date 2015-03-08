(function(){
  var restrictionRegex, Form, formManager, root, ref$;
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
      var FormArrayContainer, i$, ref$, len$, container;
      FormArrayContainer = require('form-array-container');
      for (i$ = 0, len$ = (ref$ = this.form.find('.a-plus.array-container')).length; i$ < len$; ++i$) {
        container = ref$[i$];
        container = new FormArrayContainer(container);
        container.init();
      }
    };
    prototype.f2d = function(data){
      return this.formData.f2d(this.form, data);
    };
    prototype.d2f = function(data){
      var this$ = this;
      this.formData.d2f(data, this.form, function(container, item){
        return this$.addItemBehavior(container, item);
      });
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
  if ((typeof define != 'undefined' && define !== null ? define.cmd : void 8) != null) {
    define('form-manager', function(require, exports, module){
      var formData, formArrayContainer;
      formData = require('form-data');
      formArrayContainer = require('form-array-container');
      return formManager(formData);
    });
  } else {
    root = (ref$ = typeof module != 'undefined' && module !== null ? module.exports : void 8) != null ? ref$ : this;
    root.formManager = formManager(formData);
  }
}).call(this);
