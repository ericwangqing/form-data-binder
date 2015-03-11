detail-spec-generator = ->
  generate: ({@name, @label, @folderable, model, descriptions, styles, behaviors})->
    @clear!
    @parse-model model
    @parse-descriptions @_descriptions = descriptions
    @parse-styles styles
    @parse-behaviors behaviors

    @create-detail-spec!

  clear: -> @model = {} ; @descriptions = {} ; @styles = {rows: []}; @behaviors = {}

  create-detail-spec: ->
    spec = {@name, @label, @folderable} 
    spec.rows = [@create-row row-spec for row-spec in @styles.rows]
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

  parse-model: (spec)!-> 
    @deep = 0 ; @path = '' ; @ancestor-directives = {} 
    @_parse-model spec

  _parse-model: (spec)!-> for key, value of spec
    continue if typeof value is 'function' or @is-directive key
    @add-model-spec key, value
    @path = @move-path-down key
    @path = "#{@path}[]" if @model[@path]?.multi?
    @_parse-model value if value # end null 不用 parse
    @path = @move-path-up!
      
    # else


    # if @is-attr-node key, value 
    #   @add-model-spec key, value
    # else if (key.index-of '@') is 0 # 非属性节点上的directive，作用于其子孙
    #   @push-ancestor-directives key, value
    #   @path = "#{@path}[]"
    #   continue 
    # else # 中间节点 
    #   @path = @move-path-down key
    #   @deep++
    #   @_parse-model value
    #   @pop-ancestor-directives!
    #   @deep--

  move-path-down: (key)-> if @path is '' then key else "#{@path}.#{key}"

  move-path-up: (key)-> (@path.split '.')[0 to -2].join '.'

  # is-attr-node: (key, value)-> 
  #   return false if (key.index-of '@') is 0 # 指令节点
  #   if value? and typeof value is 'object'
  #     [return false for key in (Object.keys value) when (key.index-of '@') < 0] # 有非指令节点孩子的是中间节点
  #     true # 只有指令节点孩子的是属性节点
  #   else
  #     console.log "Some wrong, we are not supposed to be here!"
  #     true # 不会到达这里，叶节点
        
  add-model-spec: (attr, obj)-> 
    all-directive-keys = true
    full-attr-path = @move-path-down attr
    for key, value of obj 
      (all-directive-keys = false ; continue) if not @is-directive key
      @model[full-attr-path] ||= {}
      @model[full-attr-path][@get-directive-key key] = value
    if all-directive-keys and not @model[full-attr-path]?field-type 
      @model[full-attr-path] ||= {} # 默认值
      @model[full-attr-path].field-type = 'input.text' # 默认值

  is-directive: (key)-> (key.index-of '@') is 0

    # spec = @get-default-spec!
    #  = @extend-spec spec, directive-obj 

  get-default-spec: -> field-type: 'input.text'

  extend-spec: (spec, directive-obj)->
    spec = {}
    # @add-ancestor-directives spec
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

  parse-labels: (labels)!-> for own let key, label of labels
    key = key.camelize!
    @descriptions[key] ||= {}
    @descriptions[key].label = label

  parse-placeholders: (placeholders)!-> for own let key-or-label, placeholder of placeholders
    @descriptions[@get-path-key key-or-label] ||= {}
    @descriptions[@get-path-key key-or-label].placeholder = placeholder

  parse-tooltips: (tooltips)!-> for own let key-or-label, tooltip of tooltips
    @descriptions[@get-path-key key-or-label] ||= {}
    @descriptions[@get-path-key key-or-label].tooltip = tooltip

  get-path-key: (key-or-label)-> # 先找key，找到就用，然后找label
    key = key-or-label.camelize!
    if @model[key-or-label] then key else @find-key key-or-label

  find-key: (label)->
    [return key for key, description of @descriptions when description.label is label]

  parse-behaviors: (behaviors)!-> for own let key, behavior of behaviors
    name = @get-path-key key
    @behaviors[name] = behavior


  parse-styles: ({type, rows, rows-css, fields-css})!->
    throw new Error 'unrecognized layout type: #{type}' if type isnt 'gridforms'
    for row, index in rows # 注意：不支持row嵌套
      row-spec = @parse-row row, fields-css
      row-spec.css = rows-css[index] if rows-css?[index]?
      @styles.rows.push row-spec 

  parse-row: (row, field-css)->
    row-spec = {}
    if @is-multi-rows row
      row-spec.name = name = @get-path-key row[0]
      row-spec.label = @descriptions[name].label
      row-spec.multi = @model[name].multi
      row-spec.rows = [@parse-row row, field-css for row in row[1 to -1]]
    else
      if (typeof last = row[row.length - 1]) is 'number'
        (row-spec.height = last ; row = row[0 to -2]) 
      else
        row-spec.height = 1
      row-spec.fields = [@parse-field field-name, field-css for field-name in row]
      row-spec.width = row-spec.fields.reduce ((pre, field)->  pre + field.width), 0
    row-spec

  is-multi-rows: (row)-> row.length >=2 and Array.is-array row[1]

  parse-field: (name, field-css)->
    [_all_, name, width] = name .match /(^.+)\((\d+)\)$/ if is-width-specified = name[name.length - 1] is ')'
    name = @get-path-key name
    width = if width? then parse-int width else 1
    {name, width, css: field-css?[name]}


if define? # AMD
  define 'detail-spec-generator', [], detail-spec-generator 
else # other
  root = module?.exports ? @
  root.detail-spec-generator = detail-spec-generator!
