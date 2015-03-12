(function(){
  var models, modelParser, root, ref$, slice$ = [].slice;
  models = {};
  modelParser = function(){
    return {
      parse: function(name, spec){
        this.model = {
          __name__: name
        };
        this.deep = 0;
        this.path = '';
        this._parse(spec);
        return this.model;
      },
      _parse: function(spec){
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
            this._parse(value);
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
          return this.model[fullAttrPath].fieldType = this.getFieldTypeByAttrName(fullAttrPath);
        }
      },
      getFieldTypeByAttrName: function(attr){
        var last;
        if (this.model[attr].type != null) {
          return "input." + this.model[attr].type;
        }
        last = function(start, end){
          return attr.substr(attr.length - start, attr.length - end).toLowerCase();
        };
        switch (false) {
        case attr !== '_id':
          return 'input.hidden';
        case last(4, 1) !== 'time':
          return 'input.datetime-local';
        case last(5, 1) !== 'count':
          return 'input.number';
        case last(6, 1) !== 'amount':
          return 'input.number';
        default:
          return 'input.text';
        }
      },
      isDirective: function(key){
        return key.indexOf('@') === 0;
      },
      getDirectiveKey: function(key){
        if (key[0] === '@') {
          return key.substr(1, key.length);
        } else {
          return key;
        }
      }
    };
  };
  if (typeof define != 'undefined' && define !== null) {
    define('model-parser', [], modelParser);
  } else {
    root = (ref$ = typeof module != 'undefined' && module !== null ? module.exports : void 8) != null ? ref$ : this;
    root.modelParser = modelParser();
  }
}).call(this);
