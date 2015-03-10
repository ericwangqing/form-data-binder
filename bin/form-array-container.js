(function(){
  var restrictionRegex, FormArrayContainer, root, ref$, slice$ = [].slice;
  restrictionRegex = /\[(\d+).+([\d*]+)]/;
  FormArrayContainer = (function(){
    FormArrayContainer.displayName = 'FormArrayContainer';
    var prototype = FormArrayContainer.prototype, constructor = FormArrayContainer;
    function FormArrayContainer(container){
      this.container = $(container);
    }
    prototype.init = function(){
      var ref$;
      ref$ = this.parseRestriction(), this.min = ref$.min, this.max = ref$.max;
      this.insertAddingItemButton();
      this.insertRemovingItemButtons();
      this.addUpToMiniumItems();
      this.showOrHideAddingRemovingButtons();
    };
    prototype.addUpToMiniumItems = function(){
      var length, i$, ref$, len$, i;
      length = this.getLength();
      if (length < this.min && this.min > 1) {
        for (i$ = 0, len$ = (ref$ = (fn$())).length; i$ < len$; ++i$) {
          i = ref$[i$];
          this.addArrayItem();
        }
      }
      function fn$(){
        var i$, to$, results$ = [];
        for (i$ = length, to$ = min; i$ <= to$; ++i$) {
          results$.push(i$);
        }
        return results$;
      }
    };
    prototype.insertAddingItemButton = function(){
      var addButton, noAddButton, this$ = this;
      addButton = this.container.children('button.a-plus.add-array-item');
      if (noAddButton = addButton.length === 0) {
        addButton = $('<button>').addClass('a-plus add-array-item').html(' + ');
      }
      addButton.click(function(event){
        this$.clickingButtonToAddArrayItem();
        return false;
      });
      if (noAddButton) {
        this.container.prepend(addButton);
      }
    };
    prototype.clickingButtonToAddArrayItem = function(){
      var item;
      if (this.getLength() === 0) {
        item = this.getArrayItem();
        this.changeFieldsName(item.show(), 'name');
        this.setLength(1);
      } else {
        this.addArrayItem();
      }
      this.showOrHideAddingRemovingButtons();
    };
    prototype.addArrayItem = function(afterItemAdd){
      var item, newItem;
      item = this.getArrayItem().get(0);
      newItem = $(item).clone();
      this.cleanArrayItemInContainer(newItem);
      this.increaseIndexAndLength(newItem);
      this.insertRemovingItemButton(newItem);
      this.container.append(newItem);
      if (typeof afterItemAdd === 'function') {
        afterItemAdd(this.container, newItem);
      }
    };
    prototype.cleanArrayItemInContainer = function(item){
      var i$, ref$, len$, container, arrayItem, j$, ref1$, len1$, i;
      for (i$ = 0, len$ = (ref$ = item.find('.array-container')).length; i$ < len$; ++i$) {
        container = ref$[i$];
        container = new FormArrayContainer(container);
        arrayItem = container.getArrayItem();
        if (arrayItem.length > 1) {
          for (j$ = 0, len1$ = (ref1$ = (fn$())).length; j$ < len1$; ++j$) {
            i = ref1$[j$];
            arrayItem[i].remove();
          }
        }
        container.setLength(1);
        container.init();
      }
      return item.find('input').val('');
      function fn$(){
        var i$, to$, results$ = [];
        for (i$ = 1, to$ = arrayItem.length - 1; i$ <= to$; ++i$) {
          results$.push(i$);
        }
        return results$;
      }
    };
    prototype.insertRemovingItemButtons = function(){
      var items, i$, len$, item;
      items = this.getArrayItem();
      for (i$ = 0, len$ = items.length; i$ < len$; ++i$) {
        item = items[i$];
        this.insertRemovingItemButton($(item));
      }
    };
    prototype.insertRemovingItemButton = function(item){
      var removeButton, noRemoveButton, this$ = this;
      removeButton = item.children('button.a-plus.remove-array-item');
      if (noRemoveButton = removeButton.length === 0) {
        removeButton = $('<button>').addClass('a-plus remove-array-item').html(' × ');
      }
      removeButton.click(function(event){
        this$.clickingButtonToRemoveArrayItem(event.target);
        return false;
      });
      if (noRemoveButton) {
        item.prepend(removeButton);
      }
    };
    prototype.clickingButtonToRemoveArrayItem = function(button){
      var item;
      item = $(button).closest('.a-plus.array-item');
      if (this.getLength() > 1) {
        item.remove();
        this.decreaseIndexAndLength();
      } else {
        this.changeFieldsName(item.hide(), '_name_');
        this.setLength(0);
      }
      this.showOrHideAddingRemovingButtons();
    };
    prototype.increaseIndexAndLength = function(newItem){
      var newItemIndex;
      newItemIndex = this.getLength();
      this.updateItemIndex(newItem, newItemIndex);
      this.setLength(newItemIndex + 1);
    };
    prototype.decreaseIndexAndLength = function(){
      var items, i$, len$, index, item;
      items = this.getArrayItem();
      for (i$ = 0, len$ = items.length; i$ < len$; ++i$) {
        index = i$;
        item = items[i$];
        this.updateItemIndex(item, index);
      }
      this.setLength(this.getLength() - 1);
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
    prototype.showOrHideAddingRemovingButtons = function(){
      var length, removes, adds;
      length = this.getLength();
      removes = this.container.children('.array-item').children('button.a-plus.remove-array-item');
      adds = this.container.children('button.a-plus.add-array-item');
      switch (false) {
      case length !== this.min:
        removes.hide();
        adds.show();
        break;
      case !(this.min < length && length < this.max):
        removes.show();
        adds.show();
        break;
      case length !== this.max:
        removes.show();
        adds.hide();
      }
    };
    prototype.changeFieldsName = function(item, _to){
      var from;
      from = _to === '_name_' ? 'name' : '_name_';
      item.find("[" + from + "]").each(function(){
        return $(this).attr(_to, $(this).attr(from)).removeAttr(from);
      });
    };
    prototype.getLength = function(){
      return parseInt(this.container.attr('data-a-plus-length'));
    };
    prototype.setLength = function(length){
      this.container.attr('data-a-plus-length', length);
    };
    prototype.getArrayItem = function(){
      return this.container.children('.a-plus.array-item');
    };
    prototype.parseRestriction = function(){
      var restriction, ref$, __all__, min, max;
      restriction = this.container.attr('data-a-plus-restriction') || '[0, *]';
      ref$ = restriction.match(restrictionRegex), __all__ = ref$[0], min = ref$[1], max = ref$[2];
      min = this.parseNumber(min);
      max = this.parseNumber(max);
      return {
        restriction: restriction,
        min: min,
        max: max
      };
    };
    prototype.parseNumber = function(number){
      if (number === '*') {
        return Infinity;
      } else {
        return parseInt(number);
      }
    };
    return FormArrayContainer;
  }());
  if (typeof define != 'undefined' && define !== null) {
    define('Form-array-container', [], function(){
      return FormArrayContainer;
    });
  } else {
    root = (ref$ = typeof module != 'undefined' && module !== null ? module.exports : void 8) != null ? ref$ : this;
    root.FormArrayContainer = FormArrayContainer;
  }
}).call(this);
