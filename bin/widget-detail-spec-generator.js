(function(){
  var widgetDetailSpecGenerator, root, ref$;
  widgetDetailSpecGenerator = function(modelParser, descriptionsParser, appearanceParser){
    return {
      generate: function(spec, model, descriptions){
        var appearance, behaviors;
        this.model = model;
        this.descriptions = descriptions;
        this.type = spec.type, this.label = spec.label, this['class'] = spec['class'], this.folderable = spec.folderable, model = spec.model, descriptions = spec.descriptions, appearance = spec.appearance, behaviors = spec.behaviors;
        this.getWidgetName(model);
        this.parseDescriptions(descriptions);
        this.parseAppearance(appearance);
        this.parseBehaviors(behaviors);
        return this.createDetailSpec();
      },
      getWidgetName: function(modelName){
        this.name = this.type + "_" + modelName;
      },
      parseDescriptions: function(descriptions){
        if (descriptions != null) {
          this.descriptions = descriptionsParser.parse(descriptions, this.model, this.descriptions);
        }
      },
      parseBehaviors: function(behaviors){
        var i$, own$ = {}.hasOwnProperty;
        this.behaviors = {};
        for (i$ in behaviors) if (own$.call(behaviors, i$)) {
          (fn$.call(this, i$, behaviors[i$]));
        }
        function fn$(key, behavior){
          var name;
          name = this.descriptions.getPathKey(key);
          this.behaviors[name] = behavior;
        }
      },
      parseAppearance: function(appearance){
        this.appearance = appearanceParser.parse(appearance, this.model, this.descriptions);
      },
      createDetailSpec: function(){
        var spec, res$, i$, ref$, len$, rowSpec;
        spec = {
          type: this.type,
          'class': this['class'],
          name: this.name,
          label: this.label,
          folderable: this.folderable
        };
        res$ = [];
        for (i$ = 0, len$ = (ref$ = this.appearance.rows).length; i$ < len$; ++i$) {
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
      }
    };
  };
  if (typeof define != 'undefined' && define !== null) {
    define('widget-detail-spec-generator', ['model-parser', 'descriptions-parser', 'appearance-parser'], widgetDetailSpecGenerator);
  } else {
    root = (ref$ = typeof module != 'undefined' && module !== null ? module.exports : void 8) != null ? ref$ : this;
    root.widgetDetailSpecGenerator = widgetDetailSpecGenerator(modelParser, descriptionsParser, appearanceParser);
  }
}).call(this);
