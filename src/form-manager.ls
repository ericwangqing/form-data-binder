restriction-regex = /\[(\d+).+([\d*]+)]/

class Form
  (selector, @form-data)!-> 
    @form = $ selector
    self = @
    containers = @form.find '.a-plus.array-container'
    @render-containers containers

  render-containers: (containers)!-> for container in containers
    container = $ container
    {min, max} = @parse-restriction container
    @insert-adding-item-button container
    @insert-removing-item-button container
    @add-up-to-minium-items container
    @show-or-hide-adding-removing-buttons container

  add-up-to-minium-items: (container)!-> 
    {min, max} = @parse-restriction container
    [@add-array-item container for i in [1 to min]] if min > 1

  show-or-hide-adding-removing-buttons: (container)!->
    length = parse-int container.attr 'data-a-plus-length'
    {max, min} = @parse-restriction container
    removes = container.children '.array-item' .children 'button.a-plus.remove-array-item'
    adds    = container.children 'button.a-plus.add-array-item'
    switch
    | length <= min       => removes.hide! ; adds.show!
    | min < length < max  => removes.show! ; adds.show!
    | length >= max       => removes.show! ; adds.hide!

  insert-adding-item-button: (container)!->
    self = @
    button = $ '<button class="a-plus add-array-item"> + </button> '
    button.click (event)-> self.clicking-button-to-add-array-item @
    container .prepend button 

  insert-removing-item-button: (container)!->
    items = container.children '.a-plus.array-item'
    [@add-clicking-to-remove-this-item container, item for item in items]

  clicking-button-to-add-array-item: (button)-> 
    container = $ button .closest '.array-container'
    length = parse-int container.attr 'data-a-plus-length'
    if length is 0
      item = container.children '.array-item'
      @change-fields-name item.show!, 'name' # 从0增加时，仅仅是恢复隐藏的。
      container.attr 'data-a-plus-length', 1
      @show-or-hide-adding-removing-buttons container 
    else
      @add-array-item container 
    false

  add-array-item: (container)!-> 
    @form-data.add-array-item  container, (container, item)!~> @add-item-behavior container, item
    
  add-item-behavior: (container, item)!->
    @add-clicking-to-remove-item-for-this-and-nested-children container, item
    @add-clicking-to-add-item-for-nested-children container, item
    @show-or-hide-adding-removing-buttons container

  add-clicking-to-remove-this-item: (container, item)->
    self = @
    button = $ '<button class="a-plus remove-array-item"> × </button> '
    button.click (event)-> self.clicking-button-to-remove-array-item @
    $ item .prepend button 

  add-clicking-to-remove-item-for-this-and-nested-children: (container, item)->
    self = @
    button = $ item .find 'button.a-plus.remove-array-item' 
    button.click (event)-> self.clicking-button-to-remove-array-item @

  clicking-button-to-remove-array-item: (button)->
    item = $ button .closest '.array-item'
    container = $ button .closest '.array-container'
    length = parse-int container.attr 'data-a-plus-length'
    if length > 1 
      item.remove! 
      @decrease-index-and-length container
    else 
      @change-fields-name item.hide!, '_name_' # 当仅剩一个item，不能移除，以便将来添加时，能够有模板clone
      container.attr 'data-a-plus-length', 0
    @show-or-hide-adding-removing-buttons container ; false

  change-fields-name: (item, _to)->
    from = if _to is '_name_' then 'name' else '_name_'
    item.find "[#{from}]" .each -> $ @ .attr _to, ($ @ .attr from) .remove-attr from


  decrease-index-and-length: (container)!->
    items = container.children '.a-plus.array-item'
    [@update-item-index item, index for item, index in items]
    length = (container.attr 'data-a-plus-length') - 1 
    container.attr 'data-a-plus-length',  length

  add-clicking-to-add-item-for-nested-children: (container, item)->
    self = @
    button = $ item .find 'button.a-plus.add-array-item' 
    button.click (event)-> self.clicking-button-to-add-array-item @
    length = @increase-index-and-length container, item

  parse-restriction:  do ->
    parse-number = (number)-> if number is '*' then Infinity else parse-int number
    (container)!->
      restriction = container.attr 'data-a-plus-restriction'
      if not restriction
        [min = 0, max = Infinity]
      else
        [__all__, min, max] = restriction.match restriction-regex
        [min = (parse-number min), max = (parse-number max)]
      return {restriction, min, max}

  increase-index-and-length: (container, new-item)!->
    new-item-index = parse-int container.attr 'data-a-plus-length'
    @update-item-index new-item, new-item-index
    container.attr 'data-a-plus-length', length = new-item-index + 1 

  update-item-index: (item, index)!-> 
    old-item-name = $ item .attr 'name' or $ item .children '[name]' .attr 'name'
    new-item-name = (old-item-name[0 to -4].join '') + "[#{index}]"
    fields = $ item .find '[name]'
    [@update-name ($ field), old-item-name, new-item-name for field in fields]
    @update-name item, old-item-name, new-item-name

  update-name: (dom, old-item-name, new-item-name)!-> if old-name = $ dom .attr 'name'
    new-name =  old-name.replace old-item-name, new-item-name
    $ dom .attr 'name' new-name

  f2d: (data)-> @form-data.f2d @form, data

  d2f: (data)!-> 
    @form-data.d2f data, @form, (container, item)~> @add-item-behavior container, item

form-manager = (form-data = @form-data)->
  create: (selector)-> new Form selector, form-data


if define? # AMD
  define 'form-manger', [], (form-data)-> form-manger form-data
else # other
  root = module?.exports ? @
  root.form-manager = form-manager form-data
