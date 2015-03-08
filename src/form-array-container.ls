restriction-regex = /\[(\d+).+([\d*]+)]/

class Form-array-container
  (container)->
    @container = $ container

  init: !->
    {@min, @max} = @parse-restriction!
    @insert-adding-item-button!
    @insert-removing-item-buttons!
    @add-up-to-minium-items!
    @show-or-hide-adding-removing-buttons!

  add-up-to-minium-items: !->
    length = @get-length!
    if length < @min and @min > 1
      [@add-array-item! for i in [length to min]]

  insert-adding-item-button: !->
    add-button = @container.children 'button.a-plus.add-array-item'
    if no-add-button = add-button.length is 0
      add-button = $ '<button>' .add-class 'a-plus add-array-item' .html ' + '
    add-button.click (event)~> @clicking-button-to-add-array-item! ; false
    @container.prepend add-button if no-add-button

  clicking-button-to-add-array-item: !->
    if @get-length! is 0
      item = @get-array-item!
      @change-fields-name item.show!, 'name'
      @set-length 1
    else
      @add-array-item!
    @show-or-hide-adding-removing-buttons!

  add-array-item: (after-item-add)!->
    item = @get-array-item!.get 0
    new-item = $ item .clone!
    @clean-array-item-in-container new-item
    @increase-index-and-length new-item
    @insert-removing-item-button new-item
    @container.append new-item
    after-item-add? @container, new-item

  clean-array-item-in-container: (item)->
    for container in item.find '.array-container'
      console.log container
      container = new Form-array-container container
      array-item = container.get-array-item!
      if array-item.length > 1
        for i in [1 to array-item.length - 1]
          array-item[i].remove!
      container.set-length 1
      container.init!
    item.find 'input' .val ''

  insert-removing-item-buttons: !->
    items = @get-array-item!
    [@insert-removing-item-button($ item) for item in items]

  insert-removing-item-button: (item)!->
    remove-button = item.children 'button.a-plus.remove-array-item'
    if no-remove-button = remove-button.length is 0
      remove-button = $ '<button>' .add-class 'a-plus remove-array-item' .html ' × '
    remove-button.click (event)~> @clicking-button-to-remove-array-item event.target ; false
    item.prepend remove-button if no-remove-button

  clicking-button-to-remove-array-item: (button)!->
    item = $ button .closest '.a-plus.array-item'
    if @get-length! > 1
      item.remove!
      @decrease-index-and-length!
    else
      @change-fields-name item.hide!, '_name_' # 当仅剩一个item，不能移除，以便将来添加时，能够有模板clone
      @set-length 0
    @show-or-hide-adding-removing-buttons!

  increase-index-and-length: (new-item)!->
    new-item-index = @get-length!
    @update-item-index new-item, new-item-index
    @set-length new-item-index + 1

  decrease-index-and-length: !->
    items = @get-array-item!
    [@update-item-index item, index for item, index in items]
    @set-length @get-length! - 1

  update-item-index: (item, index)!->
    old-item-name = $ item .attr 'name' or $ item .children '[name]' .attr 'name'
    new-item-name = (old-item-name[0 to -4].join '') + "[#{index}]"
    fields = $ item .find '[name]'
    [@update-name ($ field), old-item-name, new-item-name for field in fields]
    @update-name item, old-item-name, new-item-name

  update-name: (dom, old-item-name, new-item-name)!->
    if old-name = $ dom .attr 'name'
      new-name = old-name.replace old-item-name, new-item-name
      $ dom .attr 'name' new-name

  show-or-hide-adding-removing-buttons: !->
    length  = @get-length!
    removes = @container.children '.array-item' .children 'button.a-plus.remove-array-item'
    adds    = @container.children 'button.a-plus.add-array-item'
    switch
    | length is @min        => removes.hide! ; adds.show!
    | @min < length < @max  => removes.show! ; adds.show!
    | length is @max        => removes.show! ; adds.hide!

  change-fields-name: (item, _to)!->
    from = if _to is '_name_' then 'name' else '_name_'
    item.find "[#{from}]" .each -> $ @ .attr _to, ($ @ .attr from) .remove-attr from

  get-length: -> parse-int @container.attr 'data-a-plus-length'

  set-length: (length)!-> @container.attr 'data-a-plus-length', length

  get-array-item: -> @container.children '.a-plus.array-item'

  parse-restriction: ->
    restriction = @container.attr('data-a-plus-restriction') or '[0, *]'
    [__all__, min, max] = restriction.match restriction-regex
    min = @parse-number min
    max = @parse-number max
    {restriction, min, max}

  parse-number: (number)-> if number is '*' then Infinity else parse-int number


if define? # AMD
  define 'form-array-container', [], -> Form-array-container
else
  root = module?.exports ? @
  root.Form-array-container = Form-array-container

