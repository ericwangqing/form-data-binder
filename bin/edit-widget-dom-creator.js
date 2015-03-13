(function(){
  var editWidgetDomCreator, root, ref$;
  editWidgetDomCreator = function(util){
    return {
      create: function(spec){}
    };
  };
  if (typeof define != 'undefined' && define !== null) {
    define('edit-widget-dom-creator', ['util'], editWidgetDomCreator);
  } else {
    root = (ref$ = typeof module != 'undefined' && module !== null ? module.exports : void 8) != null ? ref$ : this;
    root.editWidgetDomCreator = editWidgetDomCreator();
  }
}).call(this);
