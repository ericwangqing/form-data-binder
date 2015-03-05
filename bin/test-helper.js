(function(){
  var insertAddingItemButton, clickingButtonToAddArrayItem, updateIndexAndLength, updateItemIndex, updateName, slice$ = [].slice;
  insertAddingItemButton = function(container){
    var button;
    button = $('<button class="at-plus add-array-item"> + </button> ');
    button.click(function(event){
      return clickingButtonToAddArrayItem(this);
    });
    $(container).prepend(button);
  };
  window.formDataBinder.clickingButtonToAddArrayItem = clickingButtonToAddArrayItem = function(button){
    var container, item, newItem;
    container = $(button).parent('.a-plus.array-container');
    item = container.find('.array-item').get(0);
    newItem = $(item).clone();
    $(newItem).find('button.at-plus.add-array-item').click(function(event){
      return clickingButtonToAddArrayItem(this, event);
    });
    updateIndexAndLength(container, newItem);
    $(container).append(newItem);
    return false;
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
