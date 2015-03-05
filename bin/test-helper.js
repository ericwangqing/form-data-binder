(function(){
  var insertAddingItemButton, updateIndexAndLength, updateItemIndex, updateName, slice$ = [].slice;
  insertAddingItemButton = function(container){
    var button;
    button = $('<button> + </button> ');
    (function(container){
      button.click(function(event){
        var item, newItem;
        item = $(container).find('.array-item').get(0);
        newItem = $(item).clone();
        updateIndexAndLength(container, newItem);
        $(container).append(newItem);
        return false;
      });
      $(container).prepend(button);
    }.call(this, container));
  };
  updateIndexAndLength = function(container, newItem){
    var newItemIndex;
    newItemIndex = parseInt($(container).attr('data-a-plus-length'));
    updateItemIndex(newItem, newItemIndex);
    $(container).attr('data-a-plus-length', newItemIndex + 1);
  };
  updateItemIndex = function(item, index){
    var oldItemName, newItemName;
    oldItemName = $(item).attr('name');
    newItemName = slice$.call(oldItemName, 0, -4 + 1 || 9e9).join('') + ("[" + index + "]");
    $(item).find('[name]').each(function(){
      return updateName(this, oldItemName, newItemName);
    });
    updateName(item, oldItemName, newItemName);
  };
  updateName = function(dom, oldItemName, newItemName){
    var newName;
    newName = $(dom).attr('name').replace(oldItemName, newItemName);
    return $(dom).attr('name', newName);
  };
  $(function(){
    return $('.a-plus.array-container').each(function(){
      return insertAddingItemButton(this);
    });
  });
}).call(this);
