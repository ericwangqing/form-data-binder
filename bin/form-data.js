(function(){
  var pathDelimiter, pathValidationRegex, formData, root, ref$;
  pathDelimiter = '.';
  pathValidationRegex = /^[_a-zA-Z0-9.[\]]+$/;
  formData = function(){
    return {
      f2d: function(form, data){
        var nameValuePairs;
        data == null && (data = {});
        this.form = $(form);
        nameValuePairs = this.form.serializeArray();
        return this.buildData(nameValuePairs, data);
      },
      buildData: function(pairs, data){
        var i$, len$, pair;
        for (i$ = 0, len$ = pairs.length; i$ < len$; ++i$) {
          pair = pairs[i$];
          this.setDataValue(pair.name, pair.value, data);
        }
        return data;
      },
      setDataValue: function(path, value, data){
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
      },
      getNextLevel: function(levels, i){
        if (i === levels.length - 1) {
          return null;
        } else {
          return {};
        }
      },
      setObjectValue: function(obj, attr, value, nextLevel){
        if (nextLevel) {
          return obj[attr] || (obj[attr] = nextLevel);
        } else {
          if (obj[attr] != null) {
            throw new Error("value can't be set as " + value + " since it has already been set as: " + obj[attr]);
          }
          return obj[attr] = value;
        }
      },
      setArrayValue: function(obj, attr, index, value, nextLevel){
        var ref$;
        if (nextLevel) {
          return this.setArrayValueToIndex(obj, attr, index, nextLevel);
        } else {
          if (((ref$ = obj[attr]) != null ? ref$[index] : void 8) != null) {
            throw new Error("value can't be set as " + value + " since it has already been set as: " + obj[attr][index]);
          }
          return this.setArrayValueToIndex(obj, attr, index, value);
        }
      },
      setArrayValueToIndex: function(obj, attr, index, value){
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
      },
      d2f: function(data, form, itemBehaviorAdder){
        this.itemBehaviorAdder = itemBehaviorAdder;
        if (form) {
          this.form = $(form);
        }
        this.setFormWithData(data, '');
      },
      setFormWithData: function(data, path){
        if (Array.isArray(data)) {
          this.setFormWithArray(data, path);
        } else {
          this.setFormWithObject(data, path);
        }
      },
      setFormWithArray: function(data, path){
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
      },
      addArrayItem: function(container, itemBehaviorAdder){
        var item, newItem;
        item = container.find('.array-item').get(0);
        newItem = $(item).clone();
        $(container).append(newItem);
        if (itemBehaviorAdder) {
          this.itemBehaviorAdder = itemBehaviorAdder;
        }
        if (this.itemBehaviorAdder) {
          return this.itemBehaviorAdder(container, newItem);
        }
      },
      setFormWithObject: function(data, path){
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
      }
    };
  };
  if (typeof define != 'undefined' && define !== null) {
    define('form-data', [], formData);
  } else {
    root = (ref$ = typeof module != 'undefined' && module !== null ? module.exports : void 8) != null ? ref$ : this;
    root.formData = formData();
  }
}).call(this);
