(function(){
  var detailSpecGenerator, root, ref$, slice$ = [].slice;
  detailSpecGenerator = function(){
    return {
      generate: function(arg$){
        var model, descriptions, styles, behaviors;
        this.name = arg$.name, this.label = arg$.label, this.folderable = arg$.folderable, model = arg$.model, descriptions = arg$.descriptions, styles = arg$.styles, behaviors = arg$.behaviors;
        this.clear();
        this.parseModel(model);
        this.parseDescriptions(this._description = descriptions);
        this.parseStyles(styles);
        this.parseBehaviors(behaviors);
        return this.createDetailSpec();
      },
      clear: function(){
        this.model = {};
        this.descriptions = {};
        this.styles = {
          rows: []
        };
        return this.behaviors = {};
      },
      createDetailSpec: function(){
        var spec, rowSpec;
        spec = {
          name: this.name,
          label: this.label,
          folderable: this.folderable
        };
        return spec.rows = (function(){
          var i$, ref$, len$, results$ = [];
          for (i$ = 0, len$ = (ref$ = this.styles.rows).length; i$ < len$; ++i$) {
            rowSpec = ref$[i$];
            results$.push(this.createRow(rowSpec));
          }
          return results$;
        }.call(this));
      },
      createRow: function(spec){
        var row, res$, i$, ref$, len$, rowSpec, fieldSpec;
        if (spec.multi) {
          row = {
            name: spec.name,
            label: spec.label,
            multi: spec.multi
          };
          res$ = [];
          for (i$ = 0, len$ = (ref$ = spec.rows).length; i$ < len$; ++i$) {
            rowSpec = ref$[i$];
            res$.push(this.createRow);
          }
          row.rows = res$;
        } else {
          row = {
            width: spec.width,
            height: spec.height,
            css: spec.css
          };
          res$ = [];
          for (i$ = 0, len$ = (ref$ = spec.fields).length; i$ < len$; ++i$) {
            fieldSpec = ref$[i$];
            res$.push(this.createField);
          }
          row.fields = res$;
        }
        return row;
      },
      createField: function(spec){
        var ref$;
        field.name = spec.name, field.width = spec.width, field.height = spec.height, field.css = spec.css;
        ref$ = this.model[spec.name], field.valid = ref$.valid, field.ref = ref$.ref, field.value = ref$.value, field.multi = ref$.multi, field.fieldType = ref$.fieldType;
        ref$ = this.descriptions[spec.name], field.label = ref$.label, field.placeholder = ref$.placeholder, field.tooltip = ref$.tooltip;
        return field;
      },
      parseModel: function(spec){
        this.deep = 0;
        this.path = '';
        this.ancestorDirectives = {};
        this._parseModel(spec);
      },
      _parseModel: function(spec){
        var key, value;
        for (key in spec) {
          value = spec[key];
          if (typeof value !== 'function') {
            if (this.isAttrNode(key, value)) {
              this.addModelSpec(key, value);
            } else if (key.indexOf('@') === 0) {
              this.pushAncestorDirectives(key, value);
              this.path = this.path + "[]";
              continue;
            } else {
              this.path = this.movePathDown(key);
              this.deep++;
              this._parseModel(value);
              this.popAncestorDirectives();
              this.deep--;
              this.path = this.movePathUp();
            }
          }
        }
      },
      movePathDown: function(key){
        if (this.path === '') {
          return key;
        } else {
          return this.path + "." + key;
        }
      },
      movePathUp: function(key){
        return slice$.call(this.path.split('.'), 0, -2 + 1 || 9e9).join('.');
      },
      isAttrNode: function(key, value){
        var i$, ref$, len$;
        if (key.indexOf('@') === 0) {
          return false;
        }
        if (value != null && typeof value === 'object') {
          for (i$ = 0, len$ = (ref$ = Object.keys(value)).length; i$ < len$; ++i$) {
            key = ref$[i$];
            if (key.indexOf('@') < 0) {
              return false;
            }
          }
          return true;
        } else {
          console.log("Some wrong, we are not supposed to be here!");
          return true;
        }
      },
      addModelSpec: function(key, directiveObj){
        var spec;
        spec = this.getDefaultSpec();
        return this.model[this.movePathDown(key)] = this.extendSpec(spec, directiveObj);
      },
      getDefaultSpec: function(){
        return {
          fieldType: 'input.text'
        };
      },
      extendSpec: function(spec, directiveObj){
        spec = {};
        this.addAncestorDirectives(spec);
        this.addDirectives(spec, directiveObj);
        return spec;
      },
      addAncestorDirectives: function(spec){
        var i$, ref$, len$, i;
        for (i$ = 0, len$ = (ref$ = (fn$.call(this))).length; i$ < len$; ++i$) {
          i = ref$[i$];
          this.addDirectives(spec, this.ancestorDirectives[i]);
        }
        function fn$(){
          var i$, to$, results$ = [];
          for (i$ = 0, to$ = this.deep; i$ <= to$; ++i$) {
            results$.push(i$);
          }
          return results$;
        }
      },
      addDirectives: function(spec, directiveObj){
        var i$, own$ = {}.hasOwnProperty;
        for (i$ in directiveObj) if (own$.call(directiveObj, i$)) {
          (fn$.call(this, i$, directiveObj[i$]));
        }
        spec;
        function fn$(key, directive){
          spec[this.getDirectiveKey(key)] = directive;
        }
      },
      getDirectiveKey: function(key){
        if (key[0] === '@') {
          return key.substr(1, key.length);
        } else {
          return key;
        }
      },
      pushAncestorDirectives: function(key, value){
        var ref$, key$;
        (ref$ = this.ancestorDirectives)[key$ = this.deep] || (ref$[key$] = {});
        this.ancestorDirectives[this.deep][key] = value;
      },
      popAncestorDirectives: function(){
        delete this.ancestorDirectives[this.deep];
      },
      parseDescriptions: function(descriptions){
        this.parseLabels(descriptions.labels);
        this.parsePlaceholders(descriptions.placeholders);
        this.parseTooltips(descriptions.tooltips);
      },
      parseLabels: function(labels){
        var i$, own$ = {}.hasOwnProperty;
        for (i$ in labels) if (own$.call(labels, i$)) {
          (fn$.call(this, i$, labels[i$]));
        }
        function fn$(key, label){
          this.descriptions[key].label = label;
        }
      },
      parsePlaceholders: function(placeholders){
        var i$, own$ = {}.hasOwnProperty;
        for (i$ in placeholders) if (own$.call(placeholders, i$)) {
          (fn$.call(this, i$, placeholders[i$]));
        }
        function fn$(keyOrLabel, placeholder){
          this.descriptions[this.getPathKey(keyOrLabel)].placeholder = placeholder;
        }
      },
      parseTooltips: function(tooltips){
        var i$, own$ = {}.hasOwnProperty;
        for (i$ in tooltips) if (own$.call(tooltips, i$)) {
          (fn$.call(this, i$, tooltips[i$]));
        }
        function fn$(keyOrLabel, tooltip){
          this.descriptions[this.getPathKey(keyOrLabel)].tooltip = tooltip;
        }
      },
      getPathKey: function(keyOrLabel){
        this.model[keyOrLabel] == null && this.findKey(this._descriptions, keyOrLabel);
      },
      findKey: function(targetValue, object){
        var i$, own$ = {}.hasOwnProperty, results$ = [];
        for (i$ in object) if (own$.call(object, i$)) {
          if (object[i$] === targetValue) {
            results$.push((fn$.call(this, i$, object[i$])));
          }
        }
        return results$;
        function fn$(key, value){
          return key;
        }
      },
      parseStyles: function(arg$){
        var type, rows, rowsCss, fieldsCss, i$, len$, index, row, rowSpec;
        type = arg$.type, rows = arg$.rows, rowsCss = arg$.rowsCss, fieldsCss = arg$.fieldsCss;
        if (type !== 'gridforms') {
          throw new Error('unrecognized layout type: #{type}');
        }
        for (i$ = 0, len$ = rows.length; i$ < len$; ++i$) {
          index = i$;
          row = rows[i$];
          rowSpec = this.parseRow(row, fieldsCss);
          if ((rowsCss != null ? rowsCss[index] : void 8) != null) {
            rowSpec.css = rowsCss[index];
          }
        }
      },
      parseRow: function(row, fieldCss){
        var rowSpec, name, last, fieldName;
        rowSpec = {};
        if (this.isMultiRows(row)) {
          rowSpec.name = name = this.getPathKey(row[0]);
          rowSpec.label = this.descriptions[name].label;
          rowSpec.multi = this.model[name].multi;
          return rowSpec.rows = (function(){
            var i$, ref$, len$, results$ = [];
            for (i$ = 0, len$ = (ref$ = slice$.call(row, 1, -1 + 1 || 9e9)).length; i$ < len$; ++i$) {
              rowSpec = ref$[i$];
              results$.push(this.parseRow);
            }
            return results$;
          }.call(this));
        } else {
          if (typeof (last = row[row.length - 1] === 'number')) {
            rowSpec.height = last;
            row = slice$.call(row, 0, -2 + 1 || 9e9);
          }
          return rowSpec.fields = (function(){
            var i$, ref$, len$, results$ = [];
            for (i$ = 0, len$ = (ref$ = row).length; i$ < len$; ++i$) {
              fieldName = ref$[i$];
              results$.push(this.parseField(fieldName, fieldCss));
            }
            return results$;
          }.call(this));
        }
      },
      parseField: function(name, fieldCss){
        var isWidthSpecified, ref$, _all_, width;
        if (isWidthSpecified = name[name.length - 2] === ')') {
          ref$ = name.match(/(^.+)\((\d+)\)$/), _all_ = ref$[0], name = ref$[1], width = ref$[2];
        }
        name = this.getPathKey(name);
        return {
          name: name,
          width: width,
          css: fieldCss[name]
        };
      }
    };
  };
  if (typeof define != 'undefined' && define !== null) {
    define('detail-spec-generator', [], detailSpecGenerator);
  } else {
    root = (ref$ = typeof module != 'undefined' && module !== null ? module.exports : void 8) != null ? ref$ : this;
    root.detailSpecGenerator = detailSpecGenerator();
  }
}).call(this);
