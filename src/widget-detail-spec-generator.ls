widget-detail-spec-generator = (model-parser, descriptions-parser, appearance-parser)->
  generate: ({@type, @label, @class, @folderable, model, descriptions, appearance, behaviors})->
    @parse-model model
    @parse-descriptions descriptions
    @parse-appearance appearance
    @parse-behaviors behaviors

    @create-detail-spec!

  parse-model: (spec)!-> 
    @model-name = Object.keys spec .0
    @name = "#{@type}_#{@model-name}"
    @model = model-parser.parse @model-name, spec[@model-name]

  parse-descriptions: (descriptions)!->
    @descriptions = descriptions-parser.parse descriptions, @model-name, @model

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
