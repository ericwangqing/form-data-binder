appearance-parser = ->

  parse: ({type, rows, rows-css, fields-css}, @model, @descriptions)->
    appearance = rows: []
    throw new Error 'unrecognized layout type: #{type}' if type isnt 'gridforms'
    for row, index in rows # 注意：不支持row嵌套
      row-spec = @parse-row row, fields-css
      row-spec.css = rows-css[index] if rows-css?[index]?
      appearance.rows.push row-spec 
    appearance

  parse-row: (row, field-css)->
    row-spec = {}
    if @is-multi-rows row
      row-spec.name = name = @descriptions.get-path-key row[0]
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
    name = @descriptions.get-path-key name
    width = if width? then parse-int width else 1
    {name, width, css: field-css?[name]}


if define? # AMD
  define 'appearance-parser', [], appearance-parser 
else # other
  root = module?.exports ? @
  root.appearance-parser = appearance-parser!
