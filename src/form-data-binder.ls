path-delimiter = '.'
path-validation-regex = /^[a-zA-Z0-9.[\]]+$/

form-data-binder =
  f2d: (selector, data = {})->
    name-value-pairs = $ selector .serialize-array!
    @build-data name-value-pairs, data

  build-data: (pairs, data)->
    [@set-value pair.name, pair.value, data for pair in pairs]
    data

  set-value: (path, value, data)->
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


  get-next-level: (levels, i)-> 
    # return null if i is levels.length - 1
    # matches = levels[i + 1].match /\[(\d+)\]$/
    # if is-array = matches then [] else {}
    if i is levels.length - 1 then null else {} # 没有多重数组

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


if define? # AMD
  define 'form-data-binder', [], -> form-data-binder 
else # other
  root = module?.exports ? @
  root.form-data-binder = form-data-binder
