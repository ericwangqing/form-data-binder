class Descriptions
  (@__model__)->


  parse: (descriptions)->
    @parse-labels descriptions.labels
    @parse-placeholders descriptions.placeholders
    @parse-tooltips descriptions.tooltips
    @

  parse-labels: (labels)!-> for own let key, label of labels
    key = key.camelize!
    @set 'label', key, label

  parse-placeholders: (placeholders)!-> for own let key-or-label, placeholder of placeholders
    @set 'placeholder', key-or-label, placeholder

  parse-tooltips: (tooltips)!-> for own let key-or-label, tooltip of tooltips
    @set 'tooltip', key-or-label, tooltip

  set: (attr, key-or-label, value)->
    key = if attr is 'label' then key-or-label else @get-path-key key-or-label
    @[key] ||= {}
    @[key][attr] = value

  get-path-key: (key-or-label)-> # 先找key，找到就用，然后找label
    key = key-or-label.camelize!
    if @__model__[key-or-label] then key else @find-key key-or-label

  find-key: (label)->
    [return key for key, description of @ when key isnt '__model__' and description.label is label]

descriptions-parser = ->
  parse: (descriptions, model)->
    (new Descriptions model).parse descriptions


if define? # AMD
  define 'descriptions-parser', ['model-parser'], descriptions-parser 
else # other
  root = module?.exports ? @
  root.descriptions-parser = descriptions-parser model-parser
