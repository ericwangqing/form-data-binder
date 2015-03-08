path-delimiter = '.'
path-validation-regex = /^[a-zA-Z0-9.[\]]+$/
array-key-regex = /(.+)\[(\d+)\]$/

form-data =
  f2d: (form, data = {})->
    @form = $ form
    name-value-pairs = @form.serialize-array!
    @build-data name-value-pairs, data

  build-data: (pairs, data)->
    [@set-data-value name, value, data for {name, value} in pairs]
    data

  set-data-value: (path, value, data)->
    path = path.trim!
    throw new Error "path: '#{path}'' is invalid" if not path-validation-regex.test path
    keys = path.split path-delimiter
    last-key = keys.pop()
    for key in keys
      data = @set-data-key data, key
    @set-final-value data, last-key, value

  set-data-key: (data, key)->
    matches = key.match array-key-regex
    if not matches # object
      data[key] ?= {}
    else
      [__all__, key, index] = matches
      @set-array-value data, key, index, {}

  set-final-value: (data, key, value)->
    matches = key.match array-key-regex
    if not matches
      throw new Error "value can't be set as #{value} since it has already been set as: #{obj[attr]}" if data[key]?
      data[key] = value
    else
      [__all__, key, index] = matches
      @set-array-value data, key, index, value

  set-array-value: (data, key, index, value)->
    throw new Error "#{key} of object: #{data} should be an array" if data[key]? and not Array.is-array data[key]
    array = data[key] ?= []
    [array[i] = null if typeof array[i] is 'undefined' for i in [0 to index - 1]]
    array[index] ||= value

  d2f: (data, form, @item-behavior-adder)!->
    @form = $ form if form
    @set-form-with-data data, ''

  set-form-with-data: (data, path)!->
    if Array.is-array data then @set-form-with-array data, path else @set-form-with-object data, path

  set-form-with-array: (data, path)!->
    require! {Form-array-container: 'form-array-container'}
    container = @form.find '[name="#{path}"]'
    throw new Error "#{path} is an array but can't find its array-container" if not container.has-class 'array-container'
    container = new Form-array-container container
    amount-of-array-items-need-added = data.length - container.get-length!
    [container.add-array-item! for i in [1 to amount-of-array-items-need-added]]
    for value, index in data
      new-path = "#{path}[#{index}]"
      throw new Error "can't find #{new-path}" if @form.find "[name=\"#{new-path}\"]" .length is 0
      @set-form-with-data value, new-path

  set-form-with-object: (data, path)!->
    if typeof data isnt 'object'
      @form.find "[name=\"#{path}\"]" .val data

    else for key, value of data
      new-path = if path is '' then key else "#{path}.#{key}"
      throw new Error "can't find #{new-path}" if @form.find '[name=\"#{new-path}\"]' .length is 0
      @set-form-with-data value, new-path


if define?.cmd?
  define 'form-data', (require, exports, module)->
    require! ['form-array-container']
    form-data
else # other
  root = module?.exports ? @
  root.form-data = form-data
