(function(){
  var detailSpecGenerator, root, ref$, slice$ = [].slice;
  detailSpecGenerator = function(){
    return {
      generate: function(arg$){
        var model, descriptions, styles, behaviors;
        this.name = arg$.name, this.label = arg$.label, this.folderable = arg$.folderable, model = arg$.model, descriptions = arg$.descriptions, styles = arg$.styles, behaviors = arg$.behaviors;
        this.clear();
        this.parseModel(model);
        this.parseDescriptions(this._descriptions = descriptions);
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
        var spec, res$, i$, ref$, len$, rowSpec;
        spec = {
          name: this.name,
          label: this.label,
          folderable: this.folderable
        };
        res$ = [];
        for (i$ = 0, len$ = (ref$ = this.styles.rows).length; i$ < len$; ++i$) {
          rowSpec = ref$[i$];
          res$.push(this.createRow(rowSpec));
        }
        spec.rows = res$;
        return spec;
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
            res$.push(this.createRow(rowSpec));
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
            res$.push(this.createField(fieldSpec));
          }
          row.fields = res$;
        }
        return row;
      },
      createField: function(spec){
        var field, ref$;
        field = {};
        field.name = spec.name, field.width = spec.width, field.css = spec.css;
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
        var key, value, ref$;
        for (key in spec) {
          value = spec[key];
          if (typeof value === 'function' || this.isDirective(key)) {
            continue;
          }
          this.addModelSpec(key, value);
          this.path = this.movePathDown(key);
          if (((ref$ = this.model[this.path]) != null ? ref$.multi : void 8) != null) {
            this.path = this.path + "[]";
          }
          if (value) {
            this._parseModel(value);
          }
          this.path = this.movePathUp();
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
      addModelSpec: function(attr, obj){
        var allDirectiveKeys, fullAttrPath, key, value, ref$;
        allDirectiveKeys = true;
        fullAttrPath = this.movePathDown(attr);
        for (key in obj) {
          value = obj[key];
          if (!this.isDirective(key)) {
            allDirectiveKeys = false;
            continue;
          }
          (ref$ = this.model)[fullAttrPath] || (ref$[fullAttrPath] = {});
          this.model[fullAttrPath][this.getDirectiveKey(key)] = value;
        }
        if (allDirectiveKeys && !((ref$ = this.model[fullAttrPath]) != null && ref$.fieldType)) {
          (ref$ = this.model)[fullAttrPath] || (ref$[fullAttrPath] = {});
          return this.model[fullAttrPath].fieldType = 'input.text';
        }
      },
      isDirective: function(key){
        return key.indexOf('@') === 0;
      },
      getDefaultSpec: function(){
        return {
          fieldType: 'input.text'
        };
      },
      extendSpec: function(spec, directiveObj){
        spec = {};
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
          var ref$;
          key = key.camelize();
          (ref$ = this.descriptions)[key] || (ref$[key] = {});
          this.descriptions[key].label = label;
        }
      },
      parsePlaceholders: function(placeholders){
        var i$, own$ = {}.hasOwnProperty;
        for (i$ in placeholders) if (own$.call(placeholders, i$)) {
          (fn$.call(this, i$, placeholders[i$]));
        }
        function fn$(keyOrLabel, placeholder){
          var ref$, key$;
          (ref$ = this.descriptions)[key$ = this.getPathKey(keyOrLabel)] || (ref$[key$] = {});
          this.descriptions[this.getPathKey(keyOrLabel)].placeholder = placeholder;
        }
      },
      parseTooltips: function(tooltips){
        var i$, own$ = {}.hasOwnProperty;
        for (i$ in tooltips) if (own$.call(tooltips, i$)) {
          (fn$.call(this, i$, tooltips[i$]));
        }
        function fn$(keyOrLabel, tooltip){
          var ref$, key$;
          (ref$ = this.descriptions)[key$ = this.getPathKey(keyOrLabel)] || (ref$[key$] = {});
          this.descriptions[this.getPathKey(keyOrLabel)].tooltip = tooltip;
        }
      },
      getPathKey: function(keyOrLabel){
        var key;
        key = keyOrLabel.camelize();
        if (this.model[keyOrLabel]) {
          return key;
        } else {
          return this.findKey(keyOrLabel);
        }
      },
      findKey: function(label){
        var key, ref$, description;
        for (key in ref$ = this.descriptions) {
          description = ref$[key];
          if (description.label === label) {
            return key;
          }
        }
      },
      parseBehaviors: function(behaviors){
        var i$, own$ = {}.hasOwnProperty;
        for (i$ in behaviors) if (own$.call(behaviors, i$)) {
          (fn$.call(this, i$, behaviors[i$]));
        }
        function fn$(key, behavior){
          var name;
          name = this.getPathKey(key);
          this.behaviors[name] = behavior;
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
          this.styles.rows.push(rowSpec);
        }
      },
      parseRow: function(row, fieldCss){
        var rowSpec, name, res$, i$, ref$, len$, last, fieldName;
        rowSpec = {};
        if (this.isMultiRows(row)) {
          rowSpec.name = name = this.getPathKey(row[0]);
          rowSpec.label = this.descriptions[name].label;
          rowSpec.multi = this.model[name].multi;
          res$ = [];
          for (i$ = 0, len$ = (ref$ = slice$.call(row, 1, -1 + 1 || 9e9)).length; i$ < len$; ++i$) {
            row = ref$[i$];
            res$.push(this.parseRow(row, fieldCss));
          }
          rowSpec.rows = res$;
        } else {
          if (typeof (last = row[row.length - 1]) === 'number') {
            rowSpec.height = last;
            row = slice$.call(row, 0, -2 + 1 || 9e9);
          } else {
            rowSpec.height = 1;
          }
          res$ = [];
          for (i$ = 0, len$ = row.length; i$ < len$; ++i$) {
            fieldName = row[i$];
            res$.push(this.parseField(fieldName, fieldCss));
          }
          rowSpec.fields = res$;
          rowSpec.width = rowSpec.fields.reduce(function(pre, field){
            return pre + field.width;
          }, 0);
        }
        return rowSpec;
      },
      isMultiRows: function(row){
        return row.length >= 2 && Array.isArray(row[1]);
      },
      parseField: function(name, fieldCss){
        var isWidthSpecified, ref$, _all_, width;
        if (isWidthSpecified = name[name.length - 1] === ')') {
          ref$ = name.match(/(^.+)\((\d+)\)$/), _all_ = ref$[0], name = ref$[1], width = ref$[2];
        }
        name = this.getPathKey(name);
        width = width != null ? parseInt(width) : 1;
        return {
          name: name,
          width: width,
          css: fieldCss != null ? fieldCss[name] : void 8
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
