models = {}

model-parser = ->

  parse: (name, spec)-> 
    @model = {__name__: name}; @deep = 0 ; @path = ''
    @_parse spec
    @model

  _parse: (spec)!-> for key, value of spec
    continue if typeof value is 'function' or @is-directive key
    @add-model-spec key, value
    @path = @move-path-down key
    @path = "#{@path}[]" if @model[@path]?.multi?
    @_parse value if value # end null 不用 parse
    @path = @move-path-up!
      
  move-path-down: (key)-> if @path is '' then key else "#{@path}.#{key}"

  move-path-up: (key)-> (@path.split '.')[0 to -2].join '.'
        
  add-model-spec: (attr, obj)-> 
    all-directive-keys = true
    full-attr-path = @move-path-down attr
    for key, value of obj 
      (all-directive-keys = false ; continue) if not @is-directive key
      @model[full-attr-path] ||= {}
      @model[full-attr-path][@get-directive-key key] = value
    if all-directive-keys and not @model[full-attr-path]?field-type
      @model[full-attr-path] ||= {} # 默认值
      @model[full-attr-path].field-type =  @get-field-type-by-attr-name full-attr-path 

  get-field-type-by-attr-name: (attr)->
    return "input.#{@model[attr].type}" if @model[attr].type?
    last = (start, end)-> attr.substr (attr.length - start), (attr.length - end) .to-lower-case!
    switch
    | attr is '_id'              =>    'input.hidden'
    | (last 4, 1) is 'time'      =>    'input.datetime-local'
    | (last 5, 1) is 'count'     =>    'input.number'
    | (last 6, 1) is 'amount'    =>    'input.number'
    | otherwise                  =>    'input.text'

  is-directive: (key)-> (key.index-of '@') is 0

  # extend-spec: (spec, directive-obj)->
  #   spec = {}
  #   @add-directives spec, directive-obj
  #   spec

  # add-directives: (spec, directive-obj)!->
  #   [spec[@get-directive-key key] = directive for own let key, directive of directive-obj]
  #   spec

  get-directive-key: (key)-> if key[0] is '@' then key.substr 1, key.length else key# strip the leading @

  


if define? # AMD
  define 'model-parser', [], model-parser 
else # other
  root = module?.exports ? @
  root.model-parser = model-parser!
