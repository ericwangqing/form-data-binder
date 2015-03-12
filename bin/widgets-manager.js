(function(){
  var widgetsManager, root, ref$;
  widgetsManager = function(createWidgetDomCreator, editWidgetDomCreator, viewWidgetDomCreator, listWidgetsDomCreator){
    return {
      createWidgetDom: function(spec){
        var dom;
        dom = (function(){
          switch (spec.type) {
          case 'create':
            return createWidgetDomCreator.create(spec);
          case 'edit':
            return editWidgetDomCreator.create(spec);
          case 'view':
            return viewWidgetDomCreator.create(spec);
          case 'list':
            return listWidgetsDomCreator.create(spec);
          default:
            throw new Error(spec.type + " widget dom creator not implemented");
          }
        }());
        if (spec.id) {
          dom.attr('id', spec.id);
        }
        if (spec['class']) {
          dom.attr('class', spec['class']);
        }
        return dom;
      }
    };
  };
  if (typeof define != 'undefined' && define !== null) {
    define(widgetsManager, ['create-widget-dom-creator', 'edit-widget-dom-creator', 'view-widget-dom-creator', 'list-widgets-dom-creator'], widgetsManager);
  } else {
    root = (ref$ = typeof module != 'undefined' && module !== null ? module.exports : void 8) != null ? ref$ : this;
    root.widgetsManager = widgetsManager(createWidgetDomCreator, editWidgetDomCreator, viewWidgetDomCreator, listWidgetsDomCreator);
  }
}).call(this);
