(function(){
  var restrictionRegex, formManager, root, ref$;
  restrictionRegex = /\[(\d+).+([\d*]+)]/;
  define('Form', function(require, exports, module){
    var EventEmitter, FormArrayContainer, Form;
    EventEmitter = require('event-emitter');
    FormArrayContainer = require('form-array-container');
    return Form = (function(superclass){
      var prototype = extend$((import$(Form, superclass).displayName = 'Form', Form), superclass).prototype, constructor = Form;
      function Form(selector, formData){
        this.formData = formData;
        Form.superclass.call(this);
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
    }(EventEmitter));
  });
  formManager = function(formData){
    formData == null && (formData = this.formData);
    return {
      create: function(selector){
        var Form;
        Form = require('Form');
        return new Form(selector, formData);
      }
    };
  };
  if ((typeof define != 'undefined' && define !== null ? define.cmd : void 8) != null) {
    define('form-manager', function(require, exports, module){
      var Form, formData, formArrayContainer;
      Form = require('Form');
      formData = require('form-data');
      formArrayContainer = require('form-array-container');
      return formManager(formData);
    });
  } else {
    root = (ref$ = typeof module != 'undefined' && module !== null ? module.exports : void 8) != null ? ref$ : this;
    root.formManager = formManager(formData);
  }
  function extend$(sub, sup){
    function fun(){} fun.prototype = (sub.superclass = sup).prototype;
    (sub.prototype = new fun).constructor = sub;
    if (typeof sup.extended == 'function') sup.extended(sub);
    return sub;
  }
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
