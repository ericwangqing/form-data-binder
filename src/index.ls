$ ->
  require! ['form-manager', 'local-recoverier']
  window.test-form = form-manager.create 'form#parsed'
  local-recoverier.activate 'form#parsed'
  # window.unparsed-form = new Form-data-binder 'form#unparsed'