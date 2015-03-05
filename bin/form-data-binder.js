(function(){
  var pathDelimiter, pathValidationRegex, restrictionRegex, FormDataBinder, root, ref$, slice$ = [].slice;
  pathDelimiter = '.';
  pathValidationRegex = /^[a-zA-Z0-9.[\]]+$/;
  restrictionRegex = /\[(\d+).+([\d*]+)]/;
  FormDataBinder = (function(){
    FormDataBinder.displayName = 'FormDataBinder';
    var prototype = FormDataBinder.prototype, constructor = FormDataBinder;
    function FormDataBinder(selector){
      this.parse(this.form = $(selector));
    }
    prototype.parse = function(){
      var self;
      self = this;
      this.form.find('.a-plus.array-container').each(function(){
        var container, ref$, min, max;
        ref$ = self.parseRestriction(container = $(this)), min = ref$.min, max = ref$.max;
        if (max > 1) {
          return self.insertAddingItemButton(container);
        }
      });
      this.isParsed = true;
    };
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
      var item, newItem, length, this$ = this;
      item = container.find('.array-item').get(0);
      newItem = $(item).clone();
      $(newItem).find('button.a-plus.add-array-item').click(function(event){
        return this$.clickingButtonToAddArrayItem(container);
      });
      $(container).append(newItem);
      return length = this.updateIndexAndLength(container, newItem);
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
      var self, oldItemName, newItemName;
      self = this;
      oldItemName = $(item).attr('name') || $(item).children('[name]').attr('name');
      newItemName = slice$.call(oldItemName, 0, -4 + 1 || 9e9).join('') + ("[" + index + "]");
      $(item).find('[name]').each(function(){
        return self.updateName(this, oldItemName, newItemName);
      });
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
      var nameValuePairs;
      data == null && (data = {});
      if (!this.isParsed) {
        this.initial(this.form);
      }
      nameValuePairs = this.form.serializeArray();
      return this.buildData(nameValuePairs, data);
    };
    prototype.buildData = function(pairs, data){
      var i$, len$, pair;
      for (i$ = 0, len$ = pairs.length; i$ < len$; ++i$) {
        pair = pairs[i$];
        this.setDataValue(pair.name, pair.value, data);
      }
      return data;
    };
    prototype.setDataValue = function(path, value, data){
      var levels, obj, i$, len$, i, level, matches, __all__, attr, index, results$ = [];
      path = path.trim();
      if (!pathValidationRegex.test(path)) {
        throw new Error("path: '" + path + "'' is invalid");
      }
      levels = path.split(pathDelimiter);
      obj = data;
      for (i$ = 0, len$ = levels.length; i$ < len$; ++i$) {
        i = i$;
        level = levels[i$];
        matches = level.match(/(.+)\[(\d+)\]$/);
        if (!matches) {
          results$.push(obj = this.setObjectValue(obj, level, value, this.getNextLevel(levels, i)));
        } else {
          __all__ = matches[0], attr = matches[1], index = matches[2];
          results$.push(obj = this.setArrayValue(obj, attr, index, value, this.getNextLevel(levels, i)));
        }
      }
      return results$;
    };
    prototype.getNextLevel = function(levels, i){
      if (i === levels.length - 1) {
        return null;
      } else {
        return {};
      }
    };
    prototype.setObjectValue = function(obj, attr, value, nextLevel){
      if (nextLevel) {
        return obj[attr] || (obj[attr] = nextLevel);
      } else {
        if (obj[attr] != null) {
          throw new Error("value can't be set as " + value + " since it has already been set as: " + obj[attr]);
        }
        return obj[attr] = value;
      }
    };
    prototype.setArrayValue = function(obj, attr, index, value, nextLevel){
      var ref$;
      if (nextLevel) {
        return this.setArrayValueToIndex(obj, attr, index, nextLevel);
      } else {
        if (((ref$ = obj[attr]) != null ? ref$[index] : void 8) != null) {
          throw new Error("value can't be set as " + value + " since it has already been set as: " + obj[attr][index]);
        }
        return this.setArrayValueToIndex(obj, attr, index, value);
      }
    };
    prototype.setArrayValueToIndex = function(obj, attr, index, value){
      var array, i$, ref$, len$, i;
      if (obj[attr] != null && !Array.isArray(obj[attr])) {
        throw new Error(attr + " of object: " + obj + " should be an array");
      }
      array = obj[attr] || (obj[attr] = []);
      for (i$ = 0, len$ = (ref$ = (fn$())).length; i$ < len$; ++i$) {
        i = ref$[i$];
        if (typeof array[i] === 'undefined') {
          array[i] = null;
        }
      }
      return array[index] || (array[index] = value);
      function fn$(){
        var i$, to$, results$ = [];
        for (i$ = 0, to$ = index - 1; i$ <= to$; ++i$) {
          results$.push(i$);
        }
        return results$;
      }
    };
    prototype.d2f = function(data){
      if (!this.isParsed) {
        this.initial(this.form);
      }
      this.setFormWithData(data, '');
    };
    prototype.setFormWithData = function(data, path){
      if (Array.isArray(data)) {
        this.setFromWithArray(data, path);
      } else {
        this.setFormWithObject(data, path);
      }
    };
    prototype.setFromWithArray = function(data, path){
      var container, amountOfArrayItemsNeedAdded, button, i$, ref$, len$, i, index, value, newPath;
      container = this.form.find("[name=\"" + path + "\"]");
      if (!container.hasClass('array-container')) {
        throw new Error(path + " is an array but can't find its array-container");
      }
      amountOfArrayItemsNeedAdded = data.length - parseInt(container.attr('data-a-plus-length'));
      button = $(container).children('button.a-plus.add-array-item');
      for (i$ = 0, len$ = (ref$ = (fn$())).length; i$ < len$; ++i$) {
        i = ref$[i$];
        this.addArrayItem(container);
      }
      for (i$ = 0, len$ = data.length; i$ < len$; ++i$) {
        index = i$;
        value = data[i$];
        newPath = path + "[" + index + "]";
        if (this.form.find("[name=\"" + newPath + "\"]").length === 0) {
          throw new Error("can't find " + newPath);
        }
        this.setFormWithData(value, newPath);
      }
      function fn$(){
        var i$, to$, results$ = [];
        for (i$ = 1, to$ = amountOfArrayItemsNeedAdded; i$ <= to$; ++i$) {
          results$.push(i$);
        }
        return results$;
      }
    };
    prototype.setFormWithObject = function(data, path){
      var key, value, newPath;
      if (typeof data !== 'object') {
        this.form.find("[name=\"" + path + "\"]").val(data);
      } else {
        for (key in data) {
          value = data[key];
          newPath = path === ''
            ? key
            : path + "." + key;
          if (this.form.find("[name=\"" + newPath + "\"]").length === 0) {
            throw new Error("can't find " + newPath);
          }
          this.setFormWithData(value, newPath);
        }
      }
    };
    return FormDataBinder;
  }());
  if (typeof define != 'undefined' && define !== null) {
    define('form-data-binder', [], function(){
      return FormDataBinder;
    });
  } else {
    root = (ref$ = typeof module != 'undefined' && module !== null ? module.exports : void 8) != null ? ref$ : this;
    root.FormDataBinder = FormDataBinder;
  }
}).call(this);
