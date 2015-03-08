$ ->
  require! ['form-manager', 'local-recoverier-manager']
  window.test-form = form-manager.create 'form#parsed'
  window.test-recover = local-recoverier-manager.create 'form#parsed'
  # window.unparsed-form = new Form-data-binder 'form#unparsed'