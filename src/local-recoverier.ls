SELECTOR = 'input selector textarea'

class Local-recoverier
  (form)->
    @form = $ form
    @recover-from-localStorage!
    @bind-event-to-form!

  recover-from-localStorage: !->
    # TODO 把该form的localStorage渲染回form

  bind-event-to-form: !->
    # TODO
    # 1. 监听change blur事件，把form data放到localStorage
    # 2. 当form保存后，把对应的localStorage清空


local-recoverier-manager = ->
  create: (selector)-> new Local-recoverier selector

if define? # AMD
  define 'local-recoverier-manager', [], local-recoverier-manager
else # other
  root = module?.exports ? @
  root.local-recoverier-manager = local-recoverier-manager!


