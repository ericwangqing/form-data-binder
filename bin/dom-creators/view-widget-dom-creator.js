(function(){
  var viewWidgetDomCreator, root, ref$;
  viewWidgetDomCreator = function(util){
    return {
      create: function(spec){}
    };
  };
  if (typeof define != 'undefined' && define !== null) {
    define('view-widget-dom-creator', ['util'], viewWidgetDomCreator);
  } else {
    root = (ref$ = typeof module != 'undefined' && module !== null ? module.exports : void 8) != null ? ref$ : this;
    root.viewWidgetDomCreator = viewWidgetDomCreator();
  }
}).call(this);
