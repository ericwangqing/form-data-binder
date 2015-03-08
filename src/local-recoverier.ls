local-recoverier =
  activate: (form)->
    @form = $ form



if define?.cmd?
  define 'local-recoverier', ->
    local-recoverier
else # other
  root = module?.exports ? @
  root.local-recoverier = local-recoverier


