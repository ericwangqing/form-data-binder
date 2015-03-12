# 根据xxx.widget.detail.spec（json）对象，生成form中的fieldset对象。一个widget就对应到一个fieldset。
edit-widget-dom-creator = (util)->
  create: (spec)->
    



if define? # a+运行时
  define 'edit-widget-dom-creator', ['util'], edit-widget-dom-creator 
else # b-plus开发时
  root = module?.exports ? @
  root.edit-widget-dom-creator = edit-widget-dom-creator!

