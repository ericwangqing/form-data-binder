insert-adding-item-button = (container)!->
  button = $ '<button class="at-plus add-array-item"> + </button> '
  button.click (event)-> clicking-button-to-add-array-item @
  $ container .prepend button 

window.form-data-binder.clicking-button-to-add-array-item = clicking-button-to-add-array-item = (button)->
  container = $ button .parent '.a-plus.array-container'
  item = container.find '.array-item' .get 0 
  new-item = $ item .clone!
  $ new-item .find 'button.at-plus.add-array-item' .click (event)-> clicking-button-to-add-array-item @, event
  update-index-and-length container, new-item
  $ container .append new-item 
  false

update-index-and-length = (container, new-item)!->
  new-item-index = parse-int ($ container .attr 'data-a-plus-length') 
  update-item-index new-item, new-item-index
  $ container .attr 'data-a-plus-length', new-item-index + 1 

update-item-index = (item, index)!-> 
  old-item-name = $ item .attr 'name'
  new-item-name = (old-item-name[0 to -4].join '') + "[#{index}]"
  $ item .find '[name]' .each -> update-name @, old-item-name, new-item-name
  update-name item, old-item-name, new-item-name

update-name = (dom, old-item-name, new-item-name)-> 
  new-name = $ dom .attr 'name' .replace old-item-name, new-item-name
  $ dom .attr 'name' new-name

$ ->
  $ '.a-plus.array-container' .each -> insert-adding-item-button @