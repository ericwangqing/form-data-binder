restriction-regex = /\[(\d+).+([\d*]+)]/

define 'Form', (require, exports, module)->
  require! {Event-emitter: 'event-emitter', Form-array-container: 'form-array-container'}

  class Form extends Event-emitter
    (selector, @form-data)!->
      super!
      @form = $ selector
      @render-containers!

    render-containers: !->
      for container in @form.find '.a-plus.array-container'
        container = new Form-array-container container
        container.init!

    f2d: (data)-> @form-data.f2d @form, data

    d2f: (data)!->
      @form-data.d2f data, @form, (container, item)~> @add-item-behavior container, item


form-manager = (form-data = @form-data)->
  create: (selector)->
    require! ['Form']
    new Form selector, form-data

if define?.cmd?
  define 'form-manager', (require, exports, module)->
    require! ['Form', 'form-data', 'form-array-container']
    form-manager form-data
else # other
  root = module?.exports ? @
  root.form-manager = form-manager form-data
