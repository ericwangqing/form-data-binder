(function(){
  var appearanceParser, root, ref$, slice$ = [].slice;
  appearanceParser = function(){
    return {
      parse: function(arg$, model, descriptions){
        var type, rows, rowsCss, fieldsCss, appearance, i$, len$, index, row, rowSpec;
        type = arg$.type, rows = arg$.rows, rowsCss = arg$.rowsCss, fieldsCss = arg$.fieldsCss;
        this.model = model;
        this.descriptions = descriptions;
        appearance = {
          rows: []
        };
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
          appearance.rows.push(rowSpec);
        }
        return appearance;
      },
      parseRow: function(row, fieldCss){
        var rowSpec, name, res$, i$, ref$, len$, last, fieldName;
        rowSpec = {};
        if (this.isMultiRows(row)) {
          rowSpec.name = name = this.descriptions.getPathKey(row[0]);
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
        name = this.descriptions.getPathKey(name);
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
    define('appearance-parser', [], appearanceParser);
  } else {
    root = (ref$ = typeof module != 'undefined' && module !== null ? module.exports : void 8) != null ? ref$ : this;
    root.appearanceParser = appearanceParser();
  }
}).call(this);
