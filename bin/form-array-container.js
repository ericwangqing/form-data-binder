(function(){
  var restrictionRegex, FormArrayContainer, root, ref$;
  restrictionRegex = /\[(\d+).+([\d*]+)\]/;
  FormArrayContainer = (function(){
    FormArrayContainer.displayName = 'FormArrayContainer';
    var prototype = FormArrayContainer.prototype, constructor = FormArrayContainer;
    FormArrayContainer.containers = [];
    FormArrayContainer.afterRenderCb = [];
    FormArrayContainer.renderContainer = function(dom, isEditable){
      var $dom, containers, i$, len$, container, ref$, cb;
      $dom = $(dom);
      containers = $dom.find('.a-plus.array-container');
      for (i$ = 0, len$ = containers.length; i$ < len$; ++i$) {
        container = containers[i$];
        container = new this(container, isEditable);
        this.containers.push(container);
        container.render();
      }
      for (i$ = 0, len$ = (ref$ = this.afterRenderCb).length; i$ < len$; ++i$) {
        cb = ref$[i$];
        cb($dom);
      }
    };
    function FormArrayContainer(container, isEditable){
      this.isEditable = isEditable;
      this.container = $(container);
      this.name = this.container.attr('name');
    }
    prototype.render = function(){
      var ref$;
      if (!this.isEditable) {
        this.saveTemplate();
      } else {
        ref$ = this.parseRestriction(), this.min = ref$.min, this.max = ref$.max;
        this.insertAddingItemButton();
        this.insertRemovingItemButtons();
        this.addEventToAddRemoveButton();
        this.saveTemplate();
        this.addUpToMiniumItems();
        this.showOrHideAddingRemovingButtons();
      }
    };
    prototype.insertAddingItemButton = function(){
      var $addButton, noAddButton;
      $addButton = this.container.children('.a-plus.add-array-item');
      if (noAddButton = $addButton.length === 0) {
        $addButton = $('<i>').addClass('plus icon a-plus add-array-item');
        this.container.prepend($addButton);
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
    prototype.insertRemovingItemButton = function($item){
      var $removeButton, noRemoveButton;
      $removeButton = $item.children('.a-plus.remove-array-item');
      if (noRemoveButton = $removeButton.length === 0) {
        $removeButton = $('<i>').addClass('remove icon a-plus remove-array-item');
        $item.prepend($removeButton);
      }
    };
    prototype.saveTemplate = function(){
      this.template = $(this.getArrayItem().get(0)).clone();
      this.template.removeClass('array-item');
      this.renameAttr(this.template, 'name', '__name__');
    };
    prototype.addUpToMiniumItems = function(){
      while (this.getLength() < this.min) {
        this.addArrayItem();
      }
    };
    prototype.addArrayItem = function(){
      var $newItem;
      $newItem = this.getItemFromTemplate();
      this.container.append($newItem);
      this.increaseIndexAndLength($newItem);
      this.showOrHideAddingRemovingButtons();
      constructor.renderContainer($newItem, this.isEditable);
    };
    prototype.addEventToAddRemoveButton = function(){
      var self;
      self = this;
      this.container.children('.a-plus.add-array-item').click(function(){
        self.clickingButtonToAddArrayItem(this);
        return false;
      });
      this.getArrayItem().children('.a-plus.remove-array-item').click(function(){
        self.clickingButtonToRemoveArrayItem(this);
        return false;
      });
    };
    prototype.clickingButtonToAddArrayItem = function(button){
      this.addArrayItem();
    };
    prototype.clickingButtonToRemoveArrayItem = function(button){
      $(button).closest('.a-plus.array-item').remove();
      this.decreaseIndexAndLength();
      this.showOrHideAddingRemovingButtons();
    };
    prototype.increaseIndexAndLength = function($newItem){
      var newItemIndex;
      newItemIndex = this.getLength();
      this.updateItemIndex($newItem, newItemIndex);
      this.setLength(newItemIndex + 1);
    };
    prototype.decreaseIndexAndLength = function(){
      var $items, i$, len$, index, item;
      $items = this.getArrayItem();
      for (i$ = 0, len$ = $items.length; i$ < len$; ++i$) {
        index = i$;
        item = $items[i$];
        this.updateItemIndex($(item), index);
      }
      this.setLength(this.getLength() - 1);
    };
    prototype.updateItemIndex = function($item, index){
      var oldItemName, newItemName, fields, i$, len$, field;
      oldItemName = $item.attr('name') || $item.children('[name]').attr('name');
      newItemName = oldItemName.match(/(.*)\[\d*\]$/)[1] + ("[" + index + "]");
      fields = $item.find('[name]');
      for (i$ = 0, len$ = fields.length; i$ < len$; ++i$) {
        field = fields[i$];
        this.updateName($(field), oldItemName, newItemName);
      }
      this.updateName($item, oldItemName, newItemName);
    };
    prototype.updateName = function(dom, oldItemName, newItemName){
      var oldName, newName;
      if (oldName = $(dom).attr('name')) {
        newName = oldName.replace(oldItemName, newItemName);
        $(dom).attr('name', newName);
      }
    };
    prototype.showOrHideAddingRemovingButtons = function(){
      var length, adds, removes;
      length = this.getLength();
      adds = this.container.children('.a-plus.add-array-item');
      removes = this.getArrayItem().children('.a-plus.remove-array-item');
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
    prototype.getLength = function(){
      return parseInt(this.container.attr('data-a-plus-length'));
    };
    prototype.setLength = function(length){
      this.container.attr('data-a-plus-length', length);
    };
    prototype.getArrayItem = function(){
      return this.container.children('.a-plus.array-item');
    };
    prototype.renameAttr = function(dom, oldName, newName){
      $(dom).find("[" + oldName + "]").each(function(){
        var $item;
        $item = $(this);
        $item.attr(newName, $item.attr(oldName));
        $item.removeAttr(oldName);
      });
    };
    prototype.getItemFromTemplate = function(){
      var self, $item;
      self = this;
      $item = this.template.clone().addClass('array-item');
      this.renameAttr($item, '__name__', 'name');
      $item.children('.a-plus.remove-array-item').click(function(){
        self.clickingButtonToRemoveArrayItem(this);
        return false;
      });
      return $item;
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
