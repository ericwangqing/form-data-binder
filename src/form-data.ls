path-delimiter = '.'
path-validation-regex = /^[_a-zA-Z0-9.[\]]+$/

form-data = ->

  f2d: (form, data = {})->
    @form = $ form
    name-value-pairs = @get-name-value-pairs!
    # name-value-pairs = @form.serialize-array!
    @build-data name-value-pairs, data

  get-name-value-pairs: ->
    result = []
    @form.find '[name][type!=checkbox]' .each -> if @tag-name.to-lower-case! isnt 'div'
      value = $ @ .val!
      result.push {name: ($ @ .attr 'name'), value: value} if value?
    result = result ++ @get-checkbox-value!

  get-checkbox-value: ->
    result = {}
    @form.find '[type=checkbox]' .each ->
      $checkbox = $ @
      result[][$checkbox.attr 'name'].push $checkbox.attr('value') if $checkbox.is ':checked'
    result = [{name, value: value.join ','} for own name, value of result]

  build-data: (pairs, data)->
    [@set-data-value pair.name, pair.value, data for pair in pairs]
    data

  set-data-value: (path, value, data)->
    path = path.trim!
    # throw new Error "path: '#{path}'' is invalid" if not path-validation-regex.test path
    levels = path.split path-delimiter
    for level, i in levels
      matches = level.match /(.+)\[(\d+)\]$/ # attr[index]
      if not matches # object
        data = @set-object-value data, level, value, @get-next-level levels, i
      else # array
        [__all__, attr, index] = matches
        data = @set-array-value data, attr, index, value, @get-next-level levels, i

  get-next-level: (levels, i)-> if i is levels.length - 1 then null else {} # 没有多重数组

  set-object-value: (obj, attr, value, next-level)->
    if obj?[attr]? and not next-level then throw new Error "value can't be set as #{value} since it has already been set as: #{obj[attr]}"
    obj[attr] = next-level or value

  set-array-value: (obj, attr, index, value, next-level)->
    if obj[attr]?[index]? and not next-level
      throw new Error "value can't be set as #{value} since it has already been set as: #{obj[attr][index]}"
    value = next-level or value
    @set-array-value-to-index obj, attr, index, value

  set-array-value-to-index: (obj, attr, index, value)->
    throw new Error "#{attr} of object: #{obj} should be an array" if obj[attr]? and not Array.is-array obj[attr]
    array = obj[attr] ||= []

    [array[i] = null if typeof array[i] is 'undefined' for i in [0 to index - 1]]
    array[index] ||= value

  d2f: (data, @form)!->
    @set-form-with-data data, ''

  set-form-with-data: (data, path)!->
    if Array.is-array data
      if @is-third-party-widget path
        @set-field-value data, path
      else
        # if typeof data[0] is 'object' then @set-form-with-array data, path else @set-multi-field-value data, path
        @set-form-with-array data, path
    else if typeof data is 'object'
      @set-form-with-object data, path
    else
      @set-field-value data, path

  set-form-with-array: (data, path)!->
    container = @form.find "[name=\"#{path}\"]"
    console.warn "can't find #{path}" if container.length is 0
    console.warn "#{path} is an array but can't find its array-container" if not container.has-class 'array-container'
    for value, index in data
      new-path = "#{path}[#{index}]"
      # throw new Error "can't find #{new-path}" if @form.find "[name=\"#{new-path}\"]" .length is 0
      @set-form-with-data value, new-path

  set-form-with-object: (data, path)!->
    return if not data? # null 和 undefined 返回
    for key, value of data
      new-path = if path is '' then key else "#{path}.#{key}"
      # console.warn "can't find #{new-path}" if @form.find "[name=\"#{new-path}\"]" .length is 0
      @set-form-with-data value, new-path

  set-field-value: (data, path)!->
    $control = @form.find "[name='#{path}\']"
    return console.warn "can't find #{path}" if $control.length is 0
    if $control.is 'select'
      @set-select-value $control, data
    else if $control.is '[type=checkbox]'
      @set-checkbox-value $control, data
    else
      $control.val data # .change! # fire change event for accomodate 3rd controls

  is-third-party-widget: (path)->
    @form.find "[name='#{path}']" .is 'input select' # 或者需要有[third-party]标识？
    false

  set-select-value: (select, data)!->
    selectizer = select.selectize!0.selectize # TODO：refactoring out到外部
    selectizer.clear!
    selectizer['@set-value'] data
    # [selectizer.add-item item for item in data]

  set-checkbox-value: (checkbox, data)!->
    checkbox.trigger 'set-value', data

if define? # AMD
  define 'form-data', [], form-data
else # other
  root = module?.exports ? @
  root.form-data = form-data!
