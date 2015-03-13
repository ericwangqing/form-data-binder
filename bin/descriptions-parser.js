(function(){
  var Descriptions, descriptionsParser, root, ref$;
  Descriptions = (function(){
    Descriptions.displayName = 'Descriptions';
    var prototype = Descriptions.prototype, constructor = Descriptions;
    function Descriptions(__model__){
      this.__model__ = __model__;
    }
    prototype.parse = function(descriptions, oldDescriptions){
      if (descriptions) {
        this.parseLabels(descriptions.labels);
        this.parsePlaceholders(descriptions.placeholders);
        this.parseTooltips(descriptions.tooltips);
      }
      if (oldDescriptions) {
        import$(this, oldDescriptions);
      }
      return this;
    };
    prototype.parseLabels = function(labels){
      var i$, own$ = {}.hasOwnProperty;
      for (i$ in labels) if (own$.call(labels, i$)) {
        (fn$.call(this, i$, labels[i$]));
      }
      function fn$(key, label){
        key = key.camelize();
        this.set('label', key, label);
      }
    };
    prototype.parsePlaceholders = function(placeholders){
      var i$, own$ = {}.hasOwnProperty;
      for (i$ in placeholders) if (own$.call(placeholders, i$)) {
        (fn$.call(this, i$, placeholders[i$]));
      }
      function fn$(keyOrLabel, placeholder){
        this.set('placeholder', keyOrLabel, placeholder);
      }
    };
    prototype.parseTooltips = function(tooltips){
      var i$, own$ = {}.hasOwnProperty;
      for (i$ in tooltips) if (own$.call(tooltips, i$)) {
        (fn$.call(this, i$, tooltips[i$]));
      }
      function fn$(keyOrLabel, tooltip){
        this.set('tooltip', keyOrLabel, tooltip);
      }
    };
    prototype.set = function(attr, keyOrLabel, value){
      var key;
      key = attr === 'label'
        ? keyOrLabel
        : this.getPathKey(keyOrLabel);
      this[key] || (this[key] = {});
      return this[key][attr] = value;
    };
    prototype.getPathKey = function(keyOrLabel){
      var key;
      key = keyOrLabel.camelize();
      if (this.__model__[keyOrLabel]) {
        return key;
      } else {
        return this.findKey(keyOrLabel);
      }
    };
    prototype.findKey = function(label){
      var key, description;
      for (key in this) {
        description = this[key];
        if (key !== '__model__' && description.label === label) {
          return key;
        }
      }
    };
    return Descriptions;
  }());
  descriptionsParser = function(){
    return {
      parse: function(model, descriptions, oldDescriptions){
        return new Descriptions(model).parse(descriptions, oldDescriptions);
      }
    };
  };
  if (typeof define != 'undefined' && define !== null) {
    define('descriptions-parser', ['model-parser', 'util'], descriptionsParser);
  } else {
    root = (ref$ = typeof module != 'undefined' && module !== null ? module.exports : void 8) != null ? ref$ : this;
    root.descriptionsParser = descriptionsParser(modelParser);
  }
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
