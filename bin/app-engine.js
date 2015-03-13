(function(){
  var appEngine, root, ref$;
  appEngine = function(modelParser, descriptionsParser, widgetDetailSpecGenerator, widgetsManager){
    return window.bPlusAppEngine = {
      run: function(appSpec){
        this.appSpec = appSpec;
        this.parseModels();
        this.parseDescriptions();
        this.parseWidgets();
        this.createWidgets();
        return this.startAppStateMachine();
      },
      parseModels: function(){
        var name, ref$, model;
        this.models = {};
        for (name in ref$ = this.appSpec.models) {
          model = ref$[name];
          this.models[name] = modelParser.parse(name, model);
        }
      },
      parseDescriptions: function(){
        var modelName, ref$, descriptions;
        this.descriptions = {};
        for (modelName in ref$ = this.appSpec.descriptions) {
          descriptions = ref$[modelName];
          this.descriptions[modelName] = descriptionsParser.parse(this.models[modelName], descriptions);
        }
      },
      parseWidgets: function(){
        var i$, ref$, len$, spec, model, modelDescriptions, descriptions, widgetDetailSpec;
        this.widgetsDetailSpecs = {};
        for (i$ = 0, len$ = (ref$ = this.appSpec.widgets).length; i$ < len$; ++i$) {
          spec = ref$[i$];
          model = this.models[spec.model];
          modelDescriptions = this.descriptions[spec.model];
          descriptions = descriptionsParser.parse(model, spec.descriptions, modelDescriptions);
          widgetDetailSpec = widgetDetailSpecGenerator.generate(spec, model, descriptions);
          this.widgetsDetailSpecs[widgetDetailSpec.name] = widgetDetailSpec;
        }
      },
      createWidgets: function(){
        var name, ref$, spec;
        this.widgets = {};
        for (name in ref$ = this.widgetsDetailSpecs) {
          spec = ref$[name];
          this.widgets[name] = {
            dom: widgetsManager.createWidgetDom(spec)
          };
        }
      },
      startAppStateMachine: function(){}
    };
  };
  if (typeof define != 'undefined' && define !== null) {
    define('app-engine', ['model-parser', 'descriptions-parser', 'widget-detail-spec-generator', 'widgets-manager'], appEngine);
  } else {
    root = (ref$ = typeof module != 'undefined' && module !== null ? module.exports : void 8) != null ? ref$ : this;
    root.appEngine = appEngine(modelParser, descriptionsParser, widgetDetailSpecGenerator, widgetsManager);
  }
}).call(this);
