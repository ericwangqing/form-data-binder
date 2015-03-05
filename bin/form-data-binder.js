(function(){
  var pathDelimiter, pathValidationRegex, formDataBinder, root, ref$;
  pathDelimiter = '.';
  pathValidationRegex = /^[a-zA-Z0-9.[\]]+$/;
  formDataBinder = {
    f2d: function(selector, data){
      var nameValuePairs;
      data == null && (data = {});
      nameValuePairs = $(selector).serializeArray();
      return this.buildData(nameValuePairs, data);
    },
    buildData: function(pairs, data){
      var i$, len$, pair;
      for (i$ = 0, len$ = pairs.length; i$ < len$; ++i$) {
        pair = pairs[i$];
        this.setValue(pair.name, pair.value, data);
      }
      return data;
    },
    setValue: function(path, value, data){
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
    }
  };
  if (typeof define != 'undefined' && define !== null) {
    define('form-data-binder', [], function(){
      return formDataBinder;
    });
  } else {
    root = (ref$ = typeof module != 'undefined' && module !== null ? module.exports : void 8) != null ? ref$ : this;
    root.formDataBinder = formDataBinder;
  }
}).call(this);
