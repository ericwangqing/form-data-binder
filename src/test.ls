$ -> 
  window.detail-spec = detail-spec-generator.generate widget-spec
  console.log detail-spec
  form = $ 'form#assignment' .append widgets-manager.create-widget-dom detail-spec
  window.assignment-form = form-manager.create form
  # window.unparsed-form = new Form-data-binder 'form#unparsed'