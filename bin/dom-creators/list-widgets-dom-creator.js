(function(){
  var listWidgetsDomCreator, root, ref$;
  listWidgetsDomCreator = function(util){
    return {
      create: function(spec){}
    };
  };
  if (typeof define != 'undefined' && define !== null) {
    define('list-widgets-dom-creator', ['util'], listWidgetsDomCreator);
  } else {
    root = (ref$ = typeof module != 'undefined' && module !== null ? module.exports : void 8) != null ? ref$ : this;
    root.listWidgetsDomCreator = listWidgetsDomCreator();
  }
}).call(this);
