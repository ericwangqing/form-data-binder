# 根据xxx.widget.detail.spec（json）对象，生成form中的fieldset对象。一个widget就对应到一个fieldset。
create-widget-dom-creator = (util)->
  create: (spec)->
    @objects-divs-stack = []
    @format-name spec

    fieldset = $ '<fieldset>' .add-class spec.name
    @make-folderable! if spec.folderable
    [@add-row fieldset, row for row in spec.rows]
    fieldset

  format-name: (obj)!-> for key, value of obj
    if typeof value isnt 'object'
      obj[key] = value.camelize!replace '[]', '[0]' if key is 'name'
    else
      @format-name value


  add-row: (root, spec)!->
    if spec.multi?
      root = @add-row-array-container root, spec
      [@add-row root, row-spec for row-spec in spec.rows]
    else
      root.append row = @get-demension-container 'row', spec
      [@add-field row, field-spec for field-spec in spec.fields]

  get-demension-container: (type, {width, height})->
    width = if width then "data-#{type}-span='#{width}'" else ''
    height = if height then "data-#{type}-height='#{height}'" else ''
    $ "<div #{width} #{height}>"
    
  add-row-array-container: (root, spec)->
    item = @add-array-container root, spec 
    item.append row-obj = $ '<div class="a-plus object">' .attr 'name', "#{spec.name}[0]"
    row-obj

  add-array-container: (root, spec)->
    root.append container = (
      $ '<div>' .add-class 'a-plus array-container'
      .attr 'name', spec.name 
      .attr 'data-a-plus-restriction', @get-multi spec.multi
      .attr 'data-a-plus-length', 1
      .append ($ '<label>' .text spec.label) 
      .append item = $ '<div class="a-plus array-item">'
    )
    item

  get-multi: (multi)-> if typeof multi is 'string' then multi else "[#{multi[0]}, #{multi[1]}]"

  add-field: (row, spec)!->
    root = if isObject = (spec.name.index-of '.') > 0 then @add-object-div row, spec.name else row
    root.append field = @get-demension-container 'field', spec
    if spec.multi then @add-multi-value-field field, spec else @add-single-value-field field, spec

  add-single-value-field: (root, spec)!->
    root.append ($ '<label>' .text spec.label) 
    if spec.ref
      root.append new-root = $ "<div class='a-plus object' name='#{spec.name}'>"
      root = new-root
      root.append (ref-hidden-input = $ "<input type='hidden' name='#{spec.name}._id' />") 
    root.append (@get-input spec .attr 'name', @get-field-name spec)

  get-field-name: (spec)->
    if spec.ref
      [model, ...middle-path, attr] = spec.ref.split '.'
      name = "#{spec.name}.#{attr}"
    else
      spec.name

  add-multi-value-field: (root, spec)!->
    item = @add-array-container root, spec
    item.append (@get-input spec .attr 'name', spec.name + '[0]')

  get-input: (spec)-> 
    input = (@get-control spec.field-type, spec.valid)
      .attr 'title', spec.tooltip 
      .attr 'placeholder', spec.placeholder  

  get-control: (field-type, valid)->
    [name, type, ...constrains] = field-type.split '.'
    valid = @get-validation-descriptions valid
    control = $ "<#{name} type='#{type}' #{valid} />"
    [@add-constrain control, constrain for constrain in constrains]
    control

  get-validation-descriptions: (valid)->
    return valid if typeof valid is 'string'
    [@get-validation-description key, value for key, value of valid].join ' '

  get-validation-description: (key, value)->
    switch key
    | 'min'        =>  "data-parsley-minlength='#{value}'"
    | 'required'   =>  (if value then 'required' else '')
    | otherwise    =>  ''


  add-constrain: (control, constrain)->
    switch constrain
    | 'disabled'   =>  control.attr 'disabled', true
    | otherwise    =>  console.log "constrain: #{constrain} doesn't implemented yet."


  add-object-div: (row, name)-> # 1）这里object的每个层级都会多一层div嵌套，div嵌套完全和object的嵌套层次对应
    levels = (name.split '.')[0 to -2] #最后一级是field用的name
    [root-div, levels-need] = @find-root-div row, levels #如果已有某levels-div，将其找到，避免重建
    if levels-need >= levels.length
      # if $.contains row, roo-div then root-div else row # levels-div在row外，此时，将元素加到row上
      root-div
    else
      parent = root-div
      for level in [levels-need to levels.length - 1]
        level-name = @get-level-name levels, levels-need
        parent.append current = $ "<div class='a-plus object' name='#{level-name}'>"
        parent = current
      current

  get-level-name: (levels, index)-> level-name = levels[0 to index].join '.'

  find-root-div: (row, levels)-> 
    for level, index in levels
      level-name = @get-level-name levels, index
      level-divs = row.children "[name='#{level-name}']"
      if level-divs.length is 0 then break else pre = level-divs 
    if pre then [($ pre[0]), index + 1] else [row, 0]



if define? # a+运行时
  define 'create-widget-dom-creator', ['util'], create-widget-dom-creator 
else # b-plus开发时
  root = module?.exports ? @
  root.create-widget-dom-creator = create-widget-dom-creator util

