# 根据xxx.widget.detail.spec（json）对象，生成form中的fieldset对象。一个widget就对应到一个fieldset。
list-widgets-dom-creator = (util)->
  create: (spec)->
    

if define? # a+运行时
  define 'list-widgets-dom-creator', ['util'], list-widgets-dom-creator 
else # 独立运行
  root = module?.exports ? @
  root.list-widgets-dom-creator = list-widgets-dom-creator!

