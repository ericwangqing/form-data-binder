widget-detail-spec-generator = (model-parser, descriptions-parser, appearance-parser)->
  generate: (spec, @model, @descriptions)->
    {@type, @label, @class, @folderable, model, descriptions, appearance, behaviors} = spec
    @get-widget-name model
    @parse-descriptions descriptions
    @parse-appearance appearance
    @parse-behaviors behaviors

    @create-detail-spec!

  get-widget-name: (model-name)!->  
    @name = "#{@type}_#{model-name}"

  parse-descriptions: (descriptions)!->if descriptions?
    @descriptions = descriptions-parser.parse descriptions, @model, @descriptions

  parse-behaviors: (behaviors)!-> 
    @behaviors = {}
    for own let key, behavior of behaviors
      name = @descriptions.get-path-key key
      @behaviors[name] = behavior

  parse-appearance: (appearance)!->
    @appearance = appearance-parser.parse appearance, @model, @descriptions

  create-detail-spec: ->
    spec = {@type, @class, @name, @label, @folderable} 
    spec.rows = [@create-row row-spec for row-spec in @appearance.rows]
    spec

  create-row: (spec)->
    if spec.multi
      row = spec{name, label, multi}
      row.rows = [@create-row row-spec for row-spec in spec.rows]
    else
      row = spec{width, height, css}
      row.fields = [@create-field field-spec for field-spec in spec.fields]
    row

  create-field: (spec)->
    field = {}
    field{name, width, css} = spec
    field{valid, ref, value, multi, field-type} = @model[spec.name]
    field{label, placeholder, tooltip} = @descriptions[spec.name]
    field

if define? # AMD
  define 'widget-detail-spec-generator', ['model-parser', 'descriptions-parser', 'appearance-parser'], widget-detail-spec-generator 
else # other
  root = module?.exports ? @
  root.widget-detail-spec-generator = widget-detail-spec-generator model-parser, descriptions-parser, appearance-parser
