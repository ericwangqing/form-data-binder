restriction-regex = /\[(\d+).+([\d*]+)]/

class Form
  (selector, @form-data)!->
    @form = $ selector
    @render-containers!

  render-containers: !->
    require! {Form-array-container: 'form-array-container'}
    for container in @form.find '.a-plus.array-container'
      container = new Form-array-container container
      container.init!

  f2d: (data)-> @form-data.f2d @form, data

  d2f: (data)!->
    @form-data.d2f data, @form, (container, item)~> @add-item-behavior container, item


form-manager = (form-data = @form-data)->
  create: (selector)-> new Form selector, form-data


if define?.cmd?
  define 'form-manager', (require, exports, module)->
    require! ['form-data', 'form-array-container']
    form-manager form-data
else # other
  root = module?.exports ? @
  root.form-manager = form-manager form-data
