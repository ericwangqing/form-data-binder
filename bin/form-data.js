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
        nameValuePairs = this.getNameValuePairs();
        return this.buildData(nameValuePairs, data);
      },
      getNameValuePairs: function(){
        var result;
        result = [];
        this.form.find('[name][type!=checkbox]').each(function(){
          var value;
          if (this.tagName.toLowerCase() !== 'div') {
            value = $(this).val();
            if (value != null) {
              return result.push({
                name: $(this).attr('name'),
                value: value
              });
            }
          }
        });
        return result = result.concat(this.getCheckboxValue());
      },
      getCheckboxValue: function(){
        var result, name, value;
        result = {};
        this.form.find('[type=checkbox]').each(function(){
          var $checkbox, key$;
          $checkbox = $(this);
          if ($checkbox.is(':checked')) {
            return (result[key$ = $checkbox.attr('name')] || (result[key$] = [])).push($checkbox.attr('value'));
          }
        });
        return result = (function(){
          var ref$, own$ = {}.hasOwnProperty, results$ = [];
          for (name in ref$ = result) if (own$.call(ref$, name)) {
            value = ref$[name];
            results$.push({
              name: name,
              value: value.join(',')
            });
          }
          return results$;
        }());
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
        var levels, i$, len$, i, level, matches, __all__, attr, index, results$ = [];
        path = path.trim();
        levels = path.split(pathDelimiter);
        for (i$ = 0, len$ = levels.length; i$ < len$; ++i$) {
          i = i$;
          level = levels[i$];
          matches = level.match(/(.+)\[(\d+)\]$/);
          if (!matches) {
            results$.push(data = this.setObjectValue(data, level, value, this.getNextLevel(levels, i)));
          } else {
            __all__ = matches[0], attr = matches[1], index = matches[2];
            results$.push(data = this.setArrayValue(data, attr, index, value, this.getNextLevel(levels, i)));
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
        if ((obj != null ? obj[attr] : void 8) != null && !nextLevel) {
          throw new Error("value can't be set as " + value + " since it has already been set as: " + obj[attr]);
        }
        return obj[attr] = nextLevel || value;
      },
      setArrayValue: function(obj, attr, index, value, nextLevel){
        var ref$;
        if (((ref$ = obj[attr]) != null ? ref$[index] : void 8) != null && !nextLevel) {
          throw new Error("value can't be set as " + value + " since it has already been set as: " + obj[attr][index]);
        }
        value = nextLevel || value;
        return this.setArrayValueToIndex(obj, attr, index, value);
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
      d2f: function(data, form){
        this.form = form;
        this.setFormWithData(data, '');
      },
      setFormWithData: function(data, path){
        if (Array.isArray(data)) {
          if (this.isThirdPartyWidget(path)) {
            this.setFieldValue(data, path);
          } else {
            this.setFormWithArray(data, path);
          }
        } else if (typeof data === 'object') {
          this.setFormWithObject(data, path);
        } else {
          this.setFieldValue(data, path);
        }
      },
      setFormWithArray: function(data, path){
        var container, i$, len$, index, value, newPath;
        container = this.form.find("[name=\"" + path + "\"]");
        if (container.length === 0) {
          console.warn("can't find " + path);
        }
        if (!container.hasClass('array-container')) {
          console.warn(path + " is an array but can't find its array-container");
        }
        for (i$ = 0, len$ = data.length; i$ < len$; ++i$) {
          index = i$;
          value = data[i$];
          newPath = path + "[" + index + "]";
          this.setFormWithData(value, newPath);
        }
      },
      setFormWithObject: function(data, path){
        var key, value, newPath;
        if (data == null) {
          return;
        }
        for (key in data) {
          value = data[key];
          newPath = path === ''
            ? key
            : path + "." + key;
          this.setFormWithData(value, newPath);
        }
      },
      setFieldValue: function(data, path){
        var $control;
        $control = this.form.find("[name='" + path + "']");
        if ($control.length === 0) {
          return console.warn("can't find " + path);
        }
        if ($control.is('select')) {
          this.setSelectValue($control, data);
        } else if ($control.is('[type=checkbox]')) {
          this.setCheckboxValue($control, data);
        } else {
          $control.val(data);
        }
      },
      isThirdPartyWidget: function(path){
        this.form.find("[name='" + path + "']").is('input select');
        return false;
      },
      setSelectValue: function(select, data){
        var selectizer;
        selectizer = select.selectize()[0].selectize;
        selectizer.clear();
        selectizer['@set-value'](data);
      },
      setCheckboxValue: function(checkbox, data){
        checkbox.trigger('set-value', data);
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
