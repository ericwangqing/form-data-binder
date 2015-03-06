path-delimiter = '.'
path-validation-regex = /^[a-zA-Z0-9.[\]]+$/

form-data = ->

  f2d: (form, data = {})->
    @form = $ form
    name-value-pairs = @form.serialize-array!
    @build-data name-value-pairs, data

  build-data: (pairs, data)->
    [@set-data-value pair.name, pair.value, data for pair in pairs]
    data

  set-data-value: (path, value, data)->
    path = path.trim!
    throw new Error "path: '#{path}'' is invalid" if not path-validation-regex.test path
    levels = path.split path-delimiter
    obj = data
    for level, i in levels
      matches = level.match /(.+)\[(\d+)\]$/ # attr[index]  
      if not matches # object
        obj = @set-object-value obj, level, value, @get-next-level levels, i
      else # array
        [__all__, attr, index] = matches
        obj = @set-array-value obj, attr, index, value, @get-next-level levels, i 


  get-next-level: (levels, i)-> if i is levels.length - 1 then null else {} # 没有多重数组

  set-object-value: (obj, attr, value, next-level)->
    if next-level 
      obj[attr] ||= next-level
    else
      throw new Error "value can't be set as #{value} since it has already been set as: #{obj[attr]}" if obj[attr]?
      obj[attr] = value

  set-array-value: (obj, attr, index, value, next-level)->
    if next-level 
      @set-array-value-to-index obj, attr, index, next-level
    else
      throw new Error "value can't be set as #{value} since it has already been set as: #{obj[attr][index]}" if obj[attr]?[index]?
      @set-array-value-to-index obj, attr, index, value

  set-array-value-to-index: (obj, attr, index, value)->
    throw new Error "#{attr} of object: #{obj} should be an array" if obj[attr]? and not Array.is-array obj[attr] 
    array = obj[attr] ||= []

    [array[i] = null if typeof array[i] is 'undefined' for i in [0 to index - 1]]
    array[index] ||= value 

  d2f: (data, form, @item-behavior-adder)!-> 
    @form = $ form if form
    @set-form-with-data data, ''

  set-form-with-data: (data, path)!->
    if Array.is-array data then @set-form-with-array data, path else @set-form-with-object data, path

  set-form-with-array: (data, path)!->
    container = @form.find "[name=\"#{path}\"]" 
    throw new Error "#{path} is an array but can't find its array-container" if not container.has-class 'array-container'
    amount-of-array-items-need-added = data.length - parse-int container.attr 'data-a-plus-length'
    button = $ container .children 'button.a-plus.add-array-item'
    [@add-array-item container for i in [1 to amount-of-array-items-need-added]]
    for value, index in data
      new-path = "#{path}[#{index}]"
      throw new Error "can't find #{new-path}" if @form.find "[name=\"#{new-path}\"]" .length is 0
      @set-form-with-data value, new-path

  add-array-item: (container, item-behavior-adder)-> 
    item = container.find '.array-item' .get 0 
    new-item = $ item .clone!
    $ container .append new-item 
    @item-behavior-adder = item-behavior-adder if item-behavior-adder
    @item-behavior-adder container, new-item if @item-behavior-adder

  set-form-with-object: (data, path)!->
    if typeof data isnt 'object'
      @form.find "[name=\"#{path}\"]" .val data 

    else for key, value of data
      new-path = if path is '' then key else "#{path}.#{key}" 
      throw new Error "can't find #{new-path}" if @form.find "[name=\"#{new-path}\"]" .length is 0
      @set-form-with-data value, new-path


if define? # AMD
  define 'form-data', [], form-data 
else # other
  root = module?.exports ? @
  root.form-data = form-data!
