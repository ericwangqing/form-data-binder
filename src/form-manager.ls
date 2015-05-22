# 1) 初始化后用户可点击加、减表单的行(s)。根据multi的restriction添加并维护加（+）、减（-）按钮，达到上限不显示加，达到下限不显示减。
# 2）提供了f2d，d2f方法，萃取form数据、将数据填充到表单中（自动根据数据增减行）。
# 3）提供了save-current和reset方法，保存和恢复表单状态。
class Smart-form
  (@form, @is-editable, @working-mode, @form-data, @add-dom-behaviors)!->
    @unrendered-form = @form.clone!

  activate: (need-save-current = true)!->
    console.warn "spec-behaviors 没有设定！" if not @spec-behaviors
    @render-form @form
    if @is-editable
      @save-current! if need-save-current
    else
      @form.find 'input, select, textarea' .attr 'disabled', 'disabled' # 提醒：与下面行交换后，界面将显示彩色选项。现在是灰色。
      @form.find '.button' .hide!

  save-current: !-> @data = @f2d!

  clear: !->
    new-form = @unrendered-form.clone!
    @form.replace-with new-form
    @form = new-form
    @activate need-save-current = false

  reset: !->
    @d2f @data

  render-form: (dom)!->
    Form-array-container.after-render-cb.push (dom)!~>
      @add-input-fields-behaviors dom
    Form-array-container.render-container @form, @is-editable

  add-input-fields-behaviors: (dom)!->
    self = @
    for own attr-path, behaviors of @spec-behaviors
      targets = @get-dom-contain-target dom, attr-path
      targets.each -> [behavior.act @, self.working-mode for behavior in behaviors]

  get-dom-contain-target: (dom, attr-path)->
    self = @
    dom.find '[name]' .filter -> self.strip-index-number-in-name($ @ .attr 'name') is attr-path

  strip-index-number-in-name: (name)-> name.replace /\[\d+\]/g, '[]'

  f2d: (data)-> @form-data.f2d @form, data

  d2f: (data)->
    @generate-form-with-data data
    @form-data.d2f data, @form

  generate-form-with-data: (data)!->
    @clear! ; i = 0
    Form-array-container.containers = []
    Form-array-container.render-container @form, @is-editable
    while i < Form-array-container.containers.length # 由于add-array-item会插入新的containers，因此要通过while来动态遍历数组而不能用for in
      container = Form-array-container.containers[i]
      name = container.name
      console.log 'container name: ', name
      value = eval "data.#{name}"
      if Array.is-array value
        while container.get-length! < value.length
          container.add-array-item!
      i++

smart-form-manager = (form-data)->
  create: (dom, type, add-dom-behaviors = ->)-> # type: create | edit | view
    working-mode = type
    is-editable = type isnt 'view'
    new Smart-form $(dom), is-editable, working-mode, form-data, add-dom-behaviors

if define? # AMD
  define 'form-manager', ['form-data'], smart-form-manager
else # other
  root = module?.exports ? @
  root.form-manager = smart-form-manager form-data
