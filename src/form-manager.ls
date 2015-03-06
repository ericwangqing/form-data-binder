restriction-regex = /\[(\d+).+([\d*]+)]/

class Form
  (selector, @form-data)!-> 
    @form = $ selector
    self = @
    @form.find '.a-plus.array-container' .each -> {min, max} = self.parse-restriction container = $ @ ; if max > 1
      self.insert-adding-item-button container

  insert-adding-item-button: (container)!->
    button = $ '<button class="a-plus add-array-item"> + </button> '
    button.click (event)~> @clicking-button-to-add-array-item container, button
    container .prepend button 

  clicking-button-to-add-array-item: (container, button)-> 
    $ button .hide! if (length = @add-array-item container) is container.a-plus-restriction.max
    false

  add-array-item: (container)-> 
    @form-data.add-array-item  container, (container, item)~> @add-item-behavior container, item
    
  add-item-behavior: (container, item)->
    $ item .find 'button.a-plus.add-array-item' .click (event)~> @clicking-button-to-add-array-item container
    length = @update-index-and-length container, item

  parse-restriction:  do ->
    parse-number = (number)-> if number is '*' then Infinity else parse-int number
    (container)!->
      return container.a-plus-restriction if container.a-plus-restriction
      restriction = container.attr 'data-a-plus-restriction'
      if not restriction
        [min = 0, max = Infinity]
      else
        [__all__, min, max] = restriction.match restriction-regex
        [min = (parse-number min), max = (parse-number max)]
      return container.a-plus-restriction = {restriction, min, max}

  update-index-and-length: (container, new-item)->
    new-item-index = parse-int container.attr 'data-a-plus-length'
    @update-item-index new-item, new-item-index
    container.attr 'data-a-plus-length', length = new-item-index + 1 
    length

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
