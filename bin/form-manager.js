(function(){
  var SmartForm, smartFormManager, root, ref$;
  SmartForm = (function(){
    SmartForm.displayName = 'SmartForm';
    var prototype = SmartForm.prototype, constructor = SmartForm;
    function SmartForm(form, isEditable, workingMode, formData, addDomBehaviors){
      this.form = form;
      this.isEditable = isEditable;
      this.workingMode = workingMode;
      this.formData = formData;
      this.addDomBehaviors = addDomBehaviors;
      this.unrenderedForm = this.form.clone();
    }
    prototype.activate = function(needSaveCurrent){
      needSaveCurrent == null && (needSaveCurrent = true);
      if (!this.specBehaviors) {
        console.warn("spec-behaviors 没有设定！");
      }
      this.renderForm(this.form);
      if (this.isEditable) {
        if (needSaveCurrent) {
          this.saveCurrent();
        }
      } else {
        this.form.find('input, select, textarea').attr('disabled', 'disabled');
        this.form.find('.button').hide();
      }
    };
    prototype.saveCurrent = function(){
      this.data = this.f2d();
    };
    prototype.clear = function(){
      var newForm, needSaveCurrent;
      newForm = this.unrenderedForm.clone();
      this.form.replaceWith(newForm);
      this.form = newForm;
      this.activate(needSaveCurrent = false);
    };
    prototype.reset = function(){
      this.d2f(this.data);
    };
    prototype.renderForm = function(dom){
      var this$ = this;
      FormArrayContainer.afterRenderCb.push(function(dom){
        this$.addInputFieldsBehaviors(dom);
      });
      FormArrayContainer.renderContainer(this.form, this.isEditable);
    };
    prototype.addInputFieldsBehaviors = function(dom){
      var self, attrPath, ref$, behaviors, targets, own$ = {}.hasOwnProperty;
      self = this;
      for (attrPath in ref$ = this.specBehaviors) if (own$.call(ref$, attrPath)) {
        behaviors = ref$[attrPath];
        targets = this.getDomContainTarget(dom, attrPath);
        targets.each(fn$);
      }
      function fn$(){
        var i$, ref$, len$, behavior, results$ = [];
        for (i$ = 0, len$ = (ref$ = behaviors).length; i$ < len$; ++i$) {
          behavior = ref$[i$];
          results$.push(behavior.act(this, self.workingMode));
        }
        return results$;
      }
    };
    prototype.getDomContainTarget = function(dom, attrPath){
      var self;
      self = this;
      return dom.find('[name]').filter(function(){
        return self.stripIndexNumberInName($(this).attr('name')) === attrPath;
      });
    };
    prototype.stripIndexNumberInName = function(name){
      return name.replace(/\[\d+\]/g, '[]');
    };
    prototype.f2d = function(data){
      return this.formData.f2d(this.form, data);
    };
    prototype.d2f = function(data){
      this.generateFormWithData(data);
      return this.formData.d2f(data, this.form);
    };
    prototype.generateFormWithData = function(data){
      var i, container, name, value;
      this.clear();
      i = 0;
      FormArrayContainer.containers = [];
      FormArrayContainer.renderContainer(this.form, this.isEditable);
      while (i < FormArrayContainer.containers.length) {
        container = FormArrayContainer.containers[i];
        name = container.name;
        console.log('container name: ', name);
        value = eval("data." + name);
        if (Array.isArray(value)) {
          while (container.getLength() < value.length) {
            container.addArrayItem();
          }
        }
        i++;
      }
    };
    return SmartForm;
  }());
  smartFormManager = function(formData){
    return {
      create: function(dom, type, addDomBehaviors){
        var workingMode, isEditable;
        addDomBehaviors == null && (addDomBehaviors = function(){});
        workingMode = type;
        isEditable = type !== 'view';
        return new SmartForm($(dom), isEditable, workingMode, formData, addDomBehaviors);
      }
    };
  };
  if (typeof define != 'undefined' && define !== null) {
    define('form-manager', ['form-data'], smartFormManager);
  } else {
    root = (ref$ = typeof module != 'undefined' && module !== null ? module.exports : void 8) != null ? ref$ : this;
    root.formManager = smartFormManager(formData);
  }
}).call(this);
