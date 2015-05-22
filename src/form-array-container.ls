restriction-regex = /\[(\d+).+([\d*]+)\]/

class Form-array-container
  @containers = []
  @after-render-cb = []
  @render-container = (dom, is-editable)!->
    $dom = $ dom
    containers = $dom.find '.a-plus.array-container'
    for container in containers
      container = new @(container, is-editable)
      @containers.push container
      container.render!
    [cb $dom for cb in @after-render-cb]

  (container, @is-editable)->
    @container = $ container
    @name = @container.attr 'name'

  render: !-> if not @is-editable then @save-template! else
    {@min, @max} = @parse-restriction!
    @insert-adding-item-button!
    @insert-removing-item-buttons!
    @add-event-to-add-remove-button!
    @save-template!
    @add-up-to-minium-items!
    @show-or-hide-adding-removing-buttons!

  insert-adding-item-button: !->
    $add-button = @container.children '.a-plus.add-array-item'
    if no-add-button = ($add-button.length is 0)
      $add-button = $ '<i>' .add-class 'plus icon a-plus add-array-item'
      @container.prepend $add-button

  insert-removing-item-buttons: !->
    items = @get-array-item!
    [@insert-removing-item-button($ item) for item in items]

  insert-removing-item-button: ($item)!->
    $remove-button = $item.children '.a-plus.remove-array-item'
    if no-remove-button = ($remove-button.length is 0)
      $remove-button = $ '<i>' .add-class 'remove icon a-plus remove-array-item'
      $item.prepend $remove-button

  save-template: !->
    @template = $(@get-array-item!.get 0).clone!
    @template.remove-class 'array-item'
    @rename-attr @template, 'name', '__name__'

  add-up-to-minium-items: !->
    while @get-length! < @min
      @add-array-item!

  add-array-item: !->
    $new-item = @get-item-from-template!
    @container.append $new-item
    @increase-index-and-length $new-item
    @show-or-hide-adding-removing-buttons!
    @@render-container $new-item, @is-editable

  add-event-to-add-remove-button: !->
    self = @
    @container.children '.a-plus.add-array-item' .click ->
      self.clicking-button-to-add-array-item @ ; false
    @get-array-item!.children '.a-plus.remove-array-item' .click ->
      self.clicking-button-to-remove-array-item @ ; false

  clicking-button-to-add-array-item: (button)!->
    @add-array-item!

  clicking-button-to-remove-array-item: (button)!->
    $ button .closest '.a-plus.array-item' .remove!
    @decrease-index-and-length!
    @show-or-hide-adding-removing-buttons!

  increase-index-and-length: ($new-item)!->
    new-item-index = @get-length!
    @update-item-index $new-item, new-item-index
    @set-length new-item-index + 1

  decrease-index-and-length: !->
    $items = @get-array-item!
    [@update-item-index ($ item), index for item, index in $items]
    @set-length @get-length! - 1

  update-item-index: ($item, index)!->
    old-item-name = $item.attr 'name' or $item.children '[name]' .attr 'name'
    new-item-name = old-item-name.match(/(.*)\[\d*\]$/)[1] + "[#{index}]"
    fields = $item.find '[name]'
    [@update-name ($ field), old-item-name, new-item-name for field in fields]
    @update-name $item, old-item-name, new-item-name

  update-name: (dom, old-item-name, new-item-name)!->
    if old-name = $ dom .attr 'name'
      new-name = old-name.replace old-item-name, new-item-name
      $ dom .attr 'name', new-name

  show-or-hide-adding-removing-buttons: !->
    length  = @get-length!
    adds    = @container.children '.a-plus.add-array-item'
    removes = @get-array-item!.children '.a-plus.remove-array-item'
    switch
    | length is @min        => removes.hide! ; adds.show!
    | @min < length < @max  => removes.show! ; adds.show!
    | length is @max        => removes.show! ; adds.hide!

  get-length: -> parse-int @container.attr 'data-a-plus-length'

  set-length: (length)!-> @container.attr 'data-a-plus-length', length

  get-array-item: -> @container.children '.a-plus.array-item'

  rename-attr: (dom, old-name, new-name)!->
    $ dom .find "[#{old-name}]" .each !->
      $item = $ @
      $item.attr new-name, ($item.attr old-name)
      $item.remove-attr old-name

  get-item-from-template: ->
    self = @
    $item = @template.clone!.add-class 'array-item'
    @rename-attr $item, '__name__', 'name'
    $item.children '.a-plus.remove-array-item' .click ->
      self.clicking-button-to-remove-array-item @ ; false
    $item

  parse-restriction: ->
    restriction = @container.attr('data-a-plus-restriction') or '[0, *]'
    [__all__, min, max] = restriction.match restriction-regex
    min = @parse-number min
    max = @parse-number max
    {restriction, min, max}

  parse-number: (number)-> if number is '*' then Infinity else parse-int number


if define? # AMD
  define 'Form-array-container', [], -> Form-array-container
else
  root = module?.exports ? @
  root.Form-array-container = Form-array-container

