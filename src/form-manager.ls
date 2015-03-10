restriction-regex = /\[(\d+).+([\d*]+)]/

class Form
  (selector, @form-data)!->
    @form = $ selector
    @render-containers!

  render-containers: !->
    for container in @form.find '.a-plus.array-container'
      container = new Form-array-container container
      container.init!

  on: (event-name, cb)->
    @form.on event-name, (event, ...args)-> cb ...args

  emit: (event-name, ...args)->
    @form.trigger event-name, ...args

  f2d: (data)-> @form-data.f2d @form, data

  d2f: (data)!-> @form-data.d2f data, @form


form-manager = (form-data = @form-data)->
  create: (selector)-> new Form selector, form-data


if define? # AMD
  define 'form-manager', ['form-data'], (form-data)-> form-manager form-data
else # other
  root = module?.exports ? @
  root.form-manager = form-manager root.form-data
