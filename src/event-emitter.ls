class Event-emitter
  ->
    @_callback = {}

  on: (event-name, cb)->
    @_callback[][event-name].push cb
    @

  after: (event-name, times, cb)->
    if times is 0 then cb! else
      after-cb = !~> if --times is 0 then
        cb ...
        @remove event-name, after-cb
      @on event-name, after-cb
    @

  once: (event-name, cb)->
    _cb = !~>
      cb ...
      @remove event-name, _cb
    @on event-name, _cb

  remove: (event-name, cb)->
    if cb? and @_callback[event-name]?
      for _cb, index in @_callback[event-name]
        if _cb is cb then @_callback[event-name].splice index, 1 ; break
    else
      delete @_callback[event-name]
    @

  fire: (event-name, ...args)->
    for cb in @_callback[event-name] or []
      cb.apply null, args
    @

  emit: @::fire


if define?.cmd?
  define 'event-emitter', -> Event-emitter
else # other
  root = module?.exports ? @
  root.Event-emitter = Event-emitter


