(function(){
  var pathDelimiter, pathValidationRegex, arrayKeyRegex, formData, root, ref$;
  pathDelimiter = '.';
  pathValidationRegex = /^[a-zA-Z0-9.[\]]+$/;
  arrayKeyRegex = /(.+)\[(\d+)\]$/;
  formData = {
    f2d: function(form, data){
      var nameValuePairs;
      data == null && (data = {});
      this.form = $(form);
      nameValuePairs = this.form.serializeArray();
      return this.buildData(nameValuePairs, data);
    },
    buildData: function(pairs, data){
      var i$, len$, ref$, name, value;
      for (i$ = 0, len$ = pairs.length; i$ < len$; ++i$) {
        ref$ = pairs[i$], name = ref$.name, value = ref$.value;
        this.setDataValue(name, value, data);
      }
      return data;
    },
    setDataValue: function(path, value, data){
      var keys, lastKey, i$, len$, key;
      path = path.trim();
      if (!pathValidationRegex.test(path)) {
        throw new Error("path: '" + path + "'' is invalid");
      }
      keys = path.split(pathDelimiter);
      lastKey = keys.pop();
      for (i$ = 0, len$ = keys.length; i$ < len$; ++i$) {
        key = keys[i$];
        data = this.setDataKey(data, key);
      }
      return this.setFinalValue(data, lastKey, value);
    },
    setDataKey: function(data, key){
      var matches, ref$, __all__, index;
      matches = key.match(arrayKeyRegex);
      if (!matches) {
        return (ref$ = data[key]) != null
          ? ref$
          : data[key] = {};
      } else {
        __all__ = matches[0], key = matches[1], index = matches[2];
        return this.setArrayValue(data, key, index, {});
      }
    },
    setFinalValue: function(data, key, value){
      var matches, __all__, index;
      matches = key.match(arrayKeyRegex);
      if (!matches) {
        if (data[key] != null) {
          throw new Error("value can't be set as " + value + " since it has already been set as: " + obj[attr]);
        }
        return data[key] = value;
      } else {
        __all__ = matches[0], key = matches[1], index = matches[2];
        return this.setArrayValue(data, key, index, value);
      }
    },
    setArrayValue: function(data, key, index, value){
      var array, ref$, i$, len$, i;
      if (data[key] != null && !Array.isArray(data[key])) {
        throw new Error(key + " of object: " + data + " should be an array");
      }
      array = (ref$ = data[key]) != null
        ? ref$
        : data[key] = [];
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
      var FormArrayContainer, container, amountOfArrayItemsNeedAdded, i$, ref$, len$, i, index, value, newPath;
      FormArrayContainer = require('form-array-container');
      container = this.form.find('[name="#{path}"]');
      if (!container.hasClass('array-container')) {
        throw new Error(path + " is an array but can't find its array-container");
      }
      container = new FormArrayContainer(container);
      amountOfArrayItemsNeedAdded = data.length - container.getLength();
      for (i$ = 0, len$ = (ref$ = (fn$())).length; i$ < len$; ++i$) {
        i = ref$[i$];
        container.addArrayItem();
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
          if (this.form.find('[name="#{new-path}"]').length === 0) {
            throw new Error("can't find " + newPath);
          }
          this.setFormWithData(value, newPath);
        }
      }
    }
  };
  if ((typeof define != 'undefined' && define !== null ? define.cmd : void 8) != null) {
    define('form-data', function(require, exports, module){
      var formArrayContainer;
      formArrayContainer = require('form-array-container');
      return formData;
    });
  } else {
    root = (ref$ = typeof module != 'undefined' && module !== null ? module.exports : void 8) != null ? ref$ : this;
    root.formData = formData;
  }
}).call(this);
