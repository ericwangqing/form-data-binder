require ['widget-detail-spec-generator', 'widgets-manager', 'widget-spec', 'form-manager', 'util'], (widget-detail-spec-generator, widgets-manager, widget-spec, form-manager, util)->
  $ -> 
    window.detail-spec = widget-detail-spec-generator.generate widget-spec
    console.log detail-spec
    form = $ 'form#assignment' .append widgets-manager.create-widget-dom detail-spec
    window.assignment-form = form-manager.create form
