(function(){
  var restrictionRegex, Form, formManager, root, ref$, slice$ = [].slice;
  restrictionRegex = /\[(\d+).+([\d*]+)]/;
  Form = (function(){
    Form.displayName = 'Form';
    var prototype = Form.prototype, constructor = Form;
    function Form(selector, formData){
      var self;
      this.formData = formData;
      this.form = $(selector);
      self = this;
      this.form.find('.a-plus.array-container').each(function(){
        var container, ref$, min, max;
        ref$ = self.parseRestriction(container = $(this)), min = ref$.min, max = ref$.max;
        if (max > 1) {
          return self.insertAddingItemButton(container);
        }
      });
    }
    prototype.insertAddingItemButton = function(container){
      var button, this$ = this;
      button = $('<button class="a-plus add-array-item"> + </button> ');
      button.click(function(event){
        return this$.clickingButtonToAddArrayItem(container, button);
      });
      container.prepend(button);
    };
    prototype.clickingButtonToAddArrayItem = function(container, button){
      var length;
      if ((length = this.addArrayItem(container)) === container.aPlusRestriction.max) {
        $(button).hide();
      }
      return false;
    };
    prototype.addArrayItem = function(container){
      var this$ = this;
      return this.formData.addArrayItem(container, function(container, item){
        return this$.addItemBehavior(container, item);
      });
    };
    prototype.addItemBehavior = function(container, item){
      var length, this$ = this;
      $(item).find('button.a-plus.add-array-item').click(function(event){
        return this$.clickingButtonToAddArrayItem(container);
      });
      return length = this.updateIndexAndLength(container, item);
    };
    prototype.parseRestriction = function(){
      var parseNumber;
      parseNumber = function(number){
        if (number === '*') {
          return Infinity;
        } else {
          return parseInt(number);
        }
      };
      return function(container){
        var restriction, min, max, ref$, __all__;
        if (container.aPlusRestriction) {
          return container.aPlusRestriction;
        }
        restriction = container.attr('data-a-plus-restriction');
        if (!restriction) {
          [min = 0, max = Infinity];
        } else {
          ref$ = restriction.match(restrictionRegex), __all__ = ref$[0], min = ref$[1], max = ref$[2];
          [min = parseNumber(min), max = parseNumber(max)];
        }
        return container.aPlusRestriction = {
          restriction: restriction,
          min: min,
          max: max
        };
      };
    }();
    prototype.updateIndexAndLength = function(container, newItem){
      var newItemIndex, length;
      newItemIndex = parseInt(container.attr('data-a-plus-length'));
      this.updateItemIndex(newItem, newItemIndex);
      container.attr('data-a-plus-length', length = newItemIndex + 1);
      return length;
    };
    prototype.updateItemIndex = function(item, index){
      var oldItemName, newItemName, fields, i$, len$, field;
      oldItemName = $(item).attr('name') || $(item).children('[name]').attr('name');
      newItemName = slice$.call(oldItemName, 0, -4 + 1 || 9e9).join('') + ("[" + index + "]");
      fields = $(item).find('[name]');
      for (i$ = 0, len$ = fields.length; i$ < len$; ++i$) {
        field = fields[i$];
        this.updateName($(field), oldItemName, newItemName);
      }
      this.updateName(item, oldItemName, newItemName);
    };
    prototype.updateName = function(dom, oldItemName, newItemName){
      var oldName, newName;
      if (oldName = $(dom).attr('name')) {
        newName = oldName.replace(oldItemName, newItemName);
        $(dom).attr('name', newName);
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
  if (typeof define != 'undefined' && define !== null) {
    define('form-manger', [], function(formData){
      return formManger(formData);
    });
  } else {
    root = (ref$ = typeof module != 'undefined' && module !== null ? module.exports : void 8) != null ? ref$ : this;
    root.formManager = formManager(formData);
  }
}).call(this);
