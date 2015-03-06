(function(){
  var restrictionRegex, Form, formManager, root, ref$, slice$ = [].slice;
  restrictionRegex = /\[(\d+).+([\d*]+)]/;
  Form = (function(){
    Form.displayName = 'Form';
    var prototype = Form.prototype, constructor = Form;
    function Form(selector, formData){
      var self, containers;
      this.formData = formData;
      this.form = $(selector);
      self = this;
      containers = this.form.find('.a-plus.array-container');
      this.renderContainers(containers);
    }
    prototype.renderContainers = function(containers){
      var i$, len$, container, ref$, min, max;
      for (i$ = 0, len$ = containers.length; i$ < len$; ++i$) {
        container = containers[i$];
        container = $(container);
        ref$ = this.parseRestriction(container), min = ref$.min, max = ref$.max;
        this.insertAddingItemButton(container);
        this.insertRemovingItemButton(container);
        this.addUpToMiniumItems(container);
        this.showOrHideAddingRemovingButtons(container);
      }
    };
    prototype.addUpToMiniumItems = function(container){
      var ref$, min, max, i$, len$, i;
      ref$ = this.parseRestriction(container), min = ref$.min, max = ref$.max;
      if (min > 1) {
        for (i$ = 0, len$ = (ref$ = (fn$())).length; i$ < len$; ++i$) {
          i = ref$[i$];
          this.addArrayItem(container);
        }
      }
      function fn$(){
        var i$, to$, results$ = [];
        for (i$ = 1, to$ = min; i$ <= to$; ++i$) {
          results$.push(i$);
        }
        return results$;
      }
    };
    prototype.showOrHideAddingRemovingButtons = function(container){
      var length, ref$, max, min, removes, adds;
      length = parseInt(container.attr('data-a-plus-length'));
      ref$ = this.parseRestriction(container), max = ref$.max, min = ref$.min;
      removes = container.children('.array-item').children('button.a-plus.remove-array-item');
      adds = container.children('button.a-plus.add-array-item');
      switch (false) {
      case length !== min:
        removes.hide();
        adds.show();
        break;
      case !(min < length && length < max):
        removes.show();
        adds.show();
        break;
      case length !== max:
        removes.show();
        adds.hide();
      }
    };
    prototype.insertAddingItemButton = function(container){
      var self, button;
      self = this;
      button = $('<button class="a-plus add-array-item"> + </button> ');
      button.click(function(event){
        return self.clickingButtonToAddArrayItem(this);
      });
      container.prepend(button);
    };
    prototype.insertRemovingItemButton = function(container){
      var items, i$, len$, item;
      items = container.children('.a-plus.array-item');
      for (i$ = 0, len$ = items.length; i$ < len$; ++i$) {
        item = items[i$];
        this.addClickingToRemoveThisItem(container, item);
      }
    };
    prototype.clickingButtonToAddArrayItem = function(button){
      var container, length, item;
      container = $(button).closest('.array-container');
      length = parseInt(container.attr('data-a-plus-length'));
      if (length === 0) {
        item = container.children('.array-item');
        this.changeFieldsName(item.show(), 'name');
        container.attr('data-a-plus-length', 1);
      } else {
        this.addArrayItem(container);
      }
      this.showOrHideAddingRemovingButtons(container);
      return false;
    };
    prototype.addArrayItem = function(container){
      var this$ = this;
      this.formData.addArrayItem(container, function(container, item){
        this$.addItemBehavior(container, item);
      });
    };
    prototype.addItemBehavior = function(container, item){
      this.addClickingToRemoveItemForThisAndNestedChildren(container, item);
      this.addClickingToAddItemForNestedChildren(container, item);
    };
    prototype.addClickingToRemoveThisItem = function(container, item){
      var self, button;
      self = this;
      button = $('<button class="a-plus remove-array-item"> × </button> ');
      button.click(function(event){
        return self.clickingButtonToRemoveArrayItem(this);
      });
      return $(item).prepend(button);
    };
    prototype.addClickingToRemoveItemForThisAndNestedChildren = function(container, item){
      var self, button;
      self = this;
      button = $(item).find('button.a-plus.remove-array-item');
      return button.click(function(event){
        return self.clickingButtonToRemoveArrayItem(this);
      });
    };
    prototype.clickingButtonToRemoveArrayItem = function(button){
      var item, container, length;
      item = $(button).closest('.array-item');
      container = $(button).closest('.array-container');
      length = parseInt(container.attr('data-a-plus-length'));
      if (length > 1) {
        item.remove();
        this.decreaseIndexAndLength(container);
      } else {
        this.changeFieldsName(item.hide(), '_name_');
        container.attr('data-a-plus-length', 0);
      }
      this.showOrHideAddingRemovingButtons(container);
      return false;
    };
    prototype.changeFieldsName = function(item, _to){
      var from;
      from = _to === '_name_' ? 'name' : '_name_';
      return item.find("[" + from + "]").each(function(){
        return $(this).attr(_to, $(this).attr(from)).removeAttr(from);
      });
    };
    prototype.decreaseIndexAndLength = function(container){
      var items, i$, len$, index, item, length;
      items = container.children('.a-plus.array-item');
      for (i$ = 0, len$ = items.length; i$ < len$; ++i$) {
        index = i$;
        item = items[i$];
        this.updateItemIndex(item, index);
      }
      length = container.attr('data-a-plus-length') - 1;
      container.attr('data-a-plus-length', length);
    };
    prototype.addClickingToAddItemForNestedChildren = function(container, item){
      var self, button, length;
      self = this;
      button = $(item).find('button.a-plus.add-array-item');
      button.click(function(event){
        return self.clickingButtonToAddArrayItem(this);
      });
      return length = this.increaseIndexAndLength(container, item);
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
        restriction = container.attr('data-a-plus-restriction');
        if (!restriction) {
          [min = 0, max = Infinity];
        } else {
          ref$ = restriction.match(restrictionRegex), __all__ = ref$[0], min = ref$[1], max = ref$[2];
          [min = parseNumber(min), max = parseNumber(max)];
        }
        return {
          restriction: restriction,
          min: min,
          max: max
        };
      };
    }();
    prototype.increaseIndexAndLength = function(container, newItem){
      var newItemIndex, length;
      newItemIndex = parseInt(container.attr('data-a-plus-length'));
      this.updateItemIndex(newItem, newItemIndex);
      container.attr('data-a-plus-length', length = newItemIndex + 1);
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
