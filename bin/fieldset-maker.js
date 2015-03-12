(function(){
  var fieldsetMaker, root, ref$, slice$ = [].slice;
  fieldsetMaker = function(util){
    return {
      make: function(spec){
        var fieldset, i$, ref$, len$, row;
        this.objectsDivsStack = [];
        this.formatName(spec);
        fieldset = $('<fieldset>').addClass(spec.name);
        if (spec.folderable) {
          this.makeFolderable();
        }
        for (i$ = 0, len$ = (ref$ = spec.rows).length; i$ < len$; ++i$) {
          row = ref$[i$];
          this.addRow(fieldset, row);
        }
        return fieldset;
      },
      formatName: function(obj){
        var key, value;
        for (key in obj) {
          value = obj[key];
          if (typeof value !== 'object') {
            if (key === 'name') {
              obj[key] = value.camelize().replace('[]', '[0]');
            }
          } else {
            this.formatName(value);
          }
        }
      },
      addRow: function(root, spec){
        var i$, ref$, len$, rowSpec, row, fieldSpec;
        if (spec.multi != null) {
          root = this.addRowArrayContainer(root, spec);
          for (i$ = 0, len$ = (ref$ = spec.rows).length; i$ < len$; ++i$) {
            rowSpec = ref$[i$];
            this.addRow(root, rowSpec);
          }
        } else {
          root.append(row = this.getDemensionContainer('row', spec));
          for (i$ = 0, len$ = (ref$ = spec.fields).length; i$ < len$; ++i$) {
            fieldSpec = ref$[i$];
            this.addField(row, fieldSpec);
          }
        }
      },
      getDemensionContainer: function(type, arg$){
        var width, height;
        width = arg$.width, height = arg$.height;
        width = width ? "data-" + type + "-span='" + width + "'" : '';
        height = height ? "data-" + type + "-height='" + height + "'" : '';
        return $("<div " + width + " " + height + ">");
      },
      addRowArrayContainer: function(root, spec){
        var item, rowObj;
        item = this.addArrayContainer(root, spec);
        item.append(rowObj = $('<div class="a-plus object">')).attr('name', spec.name + "[0]");
        return rowObj;
      },
      addArrayContainer: function(root, spec){
        var container, item;
        root.append(container = $('<div>').addClass('a-plus array-container').attr('name', spec.name).attr('data-a-plus-restriction', this.getMulti(spec.multi)).attr('data-a-plus-length', 1).append($('<label>').text(spec.label)).append(item = $('<div class="a-plus array-item">')));
        return item;
      },
      getMulti: function(multi){
        if (typeof multi === 'string') {
          return multi;
        } else {
          return "[" + multi[0] + ", " + multi[1] + "]";
        }
      },
      addField: function(row, spec){
        var root, isObject, field;
        root = (isObject = spec.name.indexOf('.') > 0) ? this.addObjectDiv(row, spec.name) : row;
        root.append(field = this.getDemensionContainer('field', spec));
        if (spec.multi) {
          this.addMultiValueField(field, spec);
        } else {
          this.addSingleValueField(field, spec);
        }
      },
      addSingleValueField: function(root, spec){
        var newRoot, refHiddenInput;
        root.append($('<label>').text(spec.label));
        if (spec.ref) {
          root.append(newRoot = $("<div class='a-plus object' name='" + spec.name + "'>"));
          root = newRoot;
          root.append(refHiddenInput = $("<input type='hidden' name='" + spec.name + "._id' />"));
        }
        root.append(this.getInput(spec).attr('name', this.getFieldName(spec)));
      },
      getFieldName: function(spec){
        var ref$, model, i$, middlePath, attr, name;
        if (spec.ref) {
          ref$ = spec.ref.split('.'), model = ref$[0], middlePath = 1 < (i$ = ref$.length - 1) ? slice$.call(ref$, 1, i$) : (i$ = 1, []), attr = ref$[i$];
          return name = spec.name + "." + attr;
        } else {
          return spec.name;
        }
      },
      addMultiValueField: function(root, spec){
        var item;
        item = this.addArrayContainer(root, spec);
        item.append(this.getInput(spec).attr('name', spec.name + '[0]'));
      },
      getInput: function(spec){
        var input;
        return input = this.getControl(spec.fieldType, spec.valid).attr('title', spec.tooltip).attr('placeholder', spec.placeholder);
      },
      getControl: function(fieldType, valid){
        var ref$, name, type, constrains, control, i$, len$, constrain;
        ref$ = fieldType.split('.'), name = ref$[0], type = ref$[1], constrains = slice$.call(ref$, 2);
        valid = this.getValidationDescriptions(valid);
        control = $("<" + name + " type='" + type + "' " + valid + " />");
        for (i$ = 0, len$ = constrains.length; i$ < len$; ++i$) {
          constrain = constrains[i$];
          this.addConstrain(control, constrain);
        }
        return control;
      },
      getValidationDescriptions: function(valid){
        var key, value;
        if (typeof valid === 'string') {
          return valid;
        }
        return (function(){
          var ref$, results$ = [];
          for (key in ref$ = valid) {
            value = ref$[key];
            results$.push(this.getValidationDescription(key, value));
          }
          return results$;
        }.call(this)).join(' ');
      },
      getValidationDescription: function(key, value){
        switch (key) {
        case 'min':
          return "data-parsley-minlength='" + value + "'";
        case 'required':
          if (value) {
            return 'required';
          } else {
            return '';
          }
          break;
        default:
          return '';
        }
      },
      addConstrain: function(control, constrain){
        switch (constrain) {
        case 'disabled':
          return control.attr('disabled', true);
        default:
          return console.log("constrain: " + constrain + " doesn't implemented yet.");
        }
      },
      addObjectDiv: function(row, name){
        var levels, ref$, rootDiv, levelsNeed, parent, i$, len$, level, levelName, current;
        levels = slice$.call(name.split('.'), 0, -2 + 1 || 9e9);
        ref$ = this.findRootDiv(row, levels), rootDiv = ref$[0], levelsNeed = ref$[1];
        if (levelsNeed >= levels.length) {
          return rootDiv;
        } else {
          parent = rootDiv;
          for (i$ = 0, len$ = (ref$ = (fn$())).length; i$ < len$; ++i$) {
            level = ref$[i$];
            levelName = this.getLevelName(levels, levelsNeed);
            parent.append(current = $("<div class='a-plus object' name='" + levelName + "'>"));
            parent = current;
          }
          return current;
        }
        function fn$(){
          var i$, to$, results$ = [];
          for (i$ = levelsNeed, to$ = levels.length - 1; i$ <= to$; ++i$) {
            results$.push(i$);
          }
          return results$;
        }
      },
      getLevelName: function(levels, index){
        var levelName;
        return levelName = slice$.call(levels, 0, index + 1 || 9e9).join('.');
      },
      findRootDiv: function(row, levels){
        var i$, len$, index, level, levelName, levelDivs, pre;
        for (i$ = 0, len$ = levels.length; i$ < len$; ++i$) {
          index = i$;
          level = levels[i$];
          levelName = this.getLevelName(levels, index);
          levelDivs = row.children("[name='" + levelName + "']");
          if (levelDivs.length === 0) {
            break;
          } else {
            pre = levelDivs;
          }
        }
        if (pre) {
          return [$(pre[0]), index + 1];
        } else {
          return [row, 0];
        }
      }
    };
  };
  if (typeof define != 'undefined' && define !== null) {
    define('fieldset-maker', ['util'], fieldsetMaker);
  } else {
    root = (ref$ = typeof module != 'undefined' && module !== null ? module.exports : void 8) != null ? ref$ : this;
    root.fieldsetMaker = fieldsetMaker();
  }
}).call(this);
