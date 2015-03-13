require ['app-engine', 'app-spec', 'form-manager'], (app-engine, app-spec, form-manager)->
  $ -> 
    # window.detail-spec = widget-detail-spec-generator.generate widget-spec
    # console.log detail-spec
    # form = $ 'form#assignment' .append widgets-manager.create-widget-dom detail-spec
    # window.assignment-form = form-manager.create form
    app-engine.run app-spec

    form = $ 'form#assignment' .append app-engine.widgets['create_assignment'].dom
    window.assignment-form = form-manager.create form
