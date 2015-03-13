widgets-manager = (create-widget-dom-creator, edit-widget-dom-creator, view-widget-dom-creator, list-widgets-dom-creator)->
  create-widget-dom: (spec)->
    dom = switch spec.type
    | 'create'  =>  create-widget-dom-creator.create spec
    | 'edit'    =>  edit-widget-dom-creator.create spec
    | 'view'    =>  view-widget-dom-creator.create spec
    | 'list'    =>  list-widgets-dom-creator.create spec
    | otherwise =>  throw new Error "#{spec.type} widget dom creator not implemented"
    dom.attr 'id', spec.id if spec.id
    dom.attr 'class', spec.class if spec.class
    dom




if define? # AMD
  define 'widgets-manager', ['create-widget-dom-creator', 'edit-widget-dom-creator', 'view-widget-dom-creator', 'list-widgets-dom-creator'], widgets-manager 
else # other
  root = module?.exports ? @
  root.widgets-manager = widgets-manager create-widget-dom-creator, edit-widget-dom-creator, view-widget-dom-creator, list-widgets-dom-creator


