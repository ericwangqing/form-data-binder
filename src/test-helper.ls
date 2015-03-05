insert-adding-item-button = (container)!->
  button = $ '<button> + </button> '
  let container = container
    button.click (event)-> 
      item = $ container .find '.array-item' .get 0
      new-item = $ item .clone!
      update-index-and-length container, new-item
      $ container .append new-item
      false
    $ container .prepend button 

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