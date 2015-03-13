# 根据xxx.widget.detail.spec（json）对象，生成form中的fieldset对象。一个widget就对应到一个fieldset。
view-widget-dom-creator = (util)->
  create: (spec)->


if define? # a+运行时
  define 'view-widget-dom-creator', ['util'], view-widget-dom-creator 
else # 独立运行
  root = module?.exports ? @
  root.view-widget-dom-creator = view-widget-dom-creator!

