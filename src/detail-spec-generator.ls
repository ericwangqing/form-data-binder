detail-spec-generator = ->
  generate: ({@name, @label, @folderable, model, descriptions, styles, behaviors})->
    @clear!
    @parse-model model
    @parse-descriptions @_description = descriptions
    @parse-styles styles
    @parse-behaviors behaviors

    @create-detail-spec!

  clear: -> @model = {} ; @descriptions = {} ; @styles = {rows: []}; @behaviors = {}

  create-detail-spec: ->
    spec = {@name, @label, @folderable} 
    spec.rows = [@create-row row-spec for row-spec in @styles.rows]

  create-row: (spec)->
    if spec.multi
      row = spec{name, label, multi}
      row.rows = [@create-row for row-spec in spec.rows]
    else
      row = spec{width, height, css}
      row.fields = [@create-field for field-spec in spec.fields]
    row

  create-field: (spec)->
    field{name, width, height, css} = spec
    field{valid, ref, value, multi, field-type} = @model[spec.name]
    field{label, placeholder, tooltip} = @descriptions[spec.name]
    field

  parse-model: (spec)!-> 
    @deep = 0 ; @path = '' ; @ancestor-directives = {} 
    @_parse-model spec

  _parse-model: (spec)!-> for key, value of spec when typeof value isnt 'function'

    if @is-attr-node key, value 
      @add-model-spec key, value
    else if (key.index-of '@') is 0 # 非属性节点上的directive，作用于其子孙
      @push-ancestor-directives key, value
      @path = "#{@path}[]"
      continue 
    else # 中间节点 
      @path = @move-path-down key
      @deep++
      @_parse-model value
      @pop-ancestor-directives!
      @deep--
      @path = @move-path-up!

  move-path-down: (key)-> if @path is '' then key else "#{@path}.#{key}"

  move-path-up: (key)-> (@path.split '.')[0 to -2].join '.'

  is-attr-node: (key, value)-> 
    return false if (key.index-of '@') is 0 # 指令节点
    if value? and typeof value is 'object'
      [return false for key in (Object.keys value) when (key.index-of '@') < 0] # 有非指令节点孩子的是中间节点
      true # 只有指令节点孩子的是属性节点
    else
      console.log "Some wrong, we are not supposed to be here!"
      true # 不会到达这里，叶节点
        
  add-model-spec: (key, directive-obj)->
    spec = @get-default-spec!
    @model[@move-path-down key] = @extend-spec spec, directive-obj 

  get-default-spec: -> field-type: 'input.text'

  extend-spec: (spec, directive-obj)->
    spec = {}
    @add-ancestor-directives spec
    @add-directives spec, directive-obj
    spec

  add-ancestor-directives: (spec)!-> # 深层次的覆盖浅层次的
    [@add-directives spec, @ancestor-directives[i] for i in [0 to @deep]]

  add-directives: (spec, directive-obj)!->
    [spec[@get-directive-key key] = directive for own let key, directive of directive-obj]
    spec

  get-directive-key: (key)-> if key[0] is '@' then key.substr 1, key.length else key# strip the leading @

  
  push-ancestor-directives: (key, value)!-> 
    @ancestor-directives[@deep] ||= {}
    @ancestor-directives[@deep][key] = value

  pop-ancestor-directives: !-> delete @ancestor-directives[@deep]

  parse-descriptions: (descriptions)!->
    @parse-labels descriptions.labels
    @parse-placeholders descriptions.placeholders
    @parse-tooltips descriptions.tooltips

  parse-labels: (labels)!->
    [@descriptions[key].label = label for own let key, label of labels]

  parse-placeholders: (placeholders)!->
    [@descriptions[@get-path-key key-or-label].placeholder = placeholder for own let key-or-label, placeholder of placeholders]

  parse-tooltips: (tooltips)!->
    [@descriptions[@get-path-key key-or-label].tooltip = tooltip for own let key-or-label, tooltip of tooltips]

  get-path-key: (key-or-label)!-> # 先找key，找到就用，然后找label
    @model[key-or-label] ? @find-key @_descriptions, key-or-label

  find-key: (target-value, object)->
    [return key for own let key, value of object when value is target-value] 


  parse-styles: ({type, rows, rows-css, fields-css})!->
    throw new Error 'unrecognized layout type: #{type}' if type isnt 'gridforms'
    for row, index in rows # 注意：不支持row嵌套
      row-spec = @parse-row row, fields-css
      row-spec.css = rows-css[index] if rows-css?[index]?

  parse-row: (row, field-css)->
    row-spec = {}
    if @is-multi-rows row
      row-spec.name = name = @get-path-key row[0]
      row-spec.label = @descriptions[name].label
      row-spec.multi = @model[name].multi
      row-spec.rows = [@parse-row for row-spec in row[1 to -1]]
    else
      (row-spec.height = last ; row = row[0 to -2]) if typeof last = row[row.length - 1] is 'number'
      row-spec.fields = [@parse-field field-name, field-css for field-name in row]

  parse-field: (name, field-css)->
    [_all_, name, width] = name .match /(^.+)\((\d+)\)$/ if is-width-specified = name[name.length - 2] is ')'
    name = @get-path-key name
    {name, width, css: field-css[name]}


if define? # AMD
  define 'detail-spec-generator', [], detail-spec-generator 
else # other
  root = module?.exports ? @
  root.detail-spec-generator = detail-spec-generator!
