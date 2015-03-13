app-engine = (model-parser, descriptions-parser, widget-detail-spec-generator, widgets-manager)-> window.b-plus-app-engine =
  run: (@app-spec)->
    @parse-models!
    @parse-descriptions!
    @parse-widgets!

    @create-widgets!
    @start-app-state-machine!

  parse-models: !->
    @models =  {}
    [@models[name] = model-parser.parse name, model for name, model of @app-spec.models]

  parse-descriptions: !->
    @descriptions = {}
    [@descriptions[model-name] = descriptions-parser.parse @models[model-name], descriptions for model-name, descriptions of @app-spec.descriptions]

  parse-widgets: !->
    @widgets-detail-specs = {}
    for spec in @app-spec.widgets
      model = @models[spec.model] ; model-descriptions = @descriptions[spec.model]
      descriptions = descriptions-parser.parse model, spec.descriptions, model-descriptions
      widget-detail-spec = widget-detail-spec-generator.generate spec, model, descriptions
      @widgets-detail-specs[widget-detail-spec.name] = widget-detail-spec

  create-widgets: !-> # TODO: 按照widget-detail-spec create dom，按照@app-spec.runtime.states-widgets，利用widget-detail-spec里面对应的manager，生成a+ widget，并bind-data
    @widgets = {}
    for name, spec of @widgets-detail-specs
      @widgets[name] = dom: widgets-manager.create-widget-dom spec

  start-app-state-machine: !-> # TODO: 按照@app-spec.states, transitions启动状态机，开始应用




if define? # a+运行时
  define 'app-engine', ['model-parser', 'descriptions-parser', 'widget-detail-spec-generator', 'widgets-manager'], app-engine 
else # 独立运行
  root = module?.exports ? @
  root.app-engine = app-engine model-parser, descriptions-parser, widget-detail-spec-generator, widgets-manager
