(function(){
  var Descriptions, descriptionsParser, root, ref$;
  Descriptions = (function(){
    Descriptions.displayName = 'Descriptions';
    var prototype = Descriptions.prototype, constructor = Descriptions;
    function Descriptions(__model__){
      this.__model__ = __model__;
    }
    prototype.parse = function(descriptions){
      this.parseLabels(descriptions.labels);
      this.parsePlaceholders(descriptions.placeholders);
      this.parseTooltips(descriptions.tooltips);
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
      parse: function(descriptions, model){
        return new Descriptions(model).parse(descriptions);
      }
    };
  };
  if (typeof define != 'undefined' && define !== null) {
    define('descriptions-parser', ['model-parser'], descriptionsParser);
  } else {
    root = (ref$ = typeof module != 'undefined' && module !== null ? module.exports : void 8) != null ? ref$ : this;
    root.descriptionsParser = descriptionsParser(modelParser);
  }
}).call(this);
