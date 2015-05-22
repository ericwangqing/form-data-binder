$ ->
  test-form = window.test-form = form-manager.create 'form#parsed', 'create'
  test-form.spec-behaviors =
    'forStudents[]':
      * act: (dom)!-> $ dom .css 'background-color', 'yellow'
      ...
    'submissions[].name':
      * act: (dom)!-> $ dom .css 'background-color', 'red'
      ...
    'submissions[].type[]':
      * act: (dom)!-> $ dom .css 'background-color', 'green'
      ...
    'nonono[].type[]':
      * act: (dom)!-> $ dom .css 'background-color', 'blue'
      ...
  test-form.activate!
  # window.test-recover = local-recoverier-manager.create 'form#parsed'
  # window.unparsed-form = new Form-data-binder 'form#unparsed'
  window.data = {"title":"这是题目","content":"这是内容","endTime":"","assignedBy":{"userId":"","name":"我是老师"},"forStudents":["11","22"],"submissions":[{"name":"111","type":["11","12","13","14"],"description":""},{"name":"2","type":["21","22","23","24"],"description":""}],"nonono":[{"name":"111","type":["11","","13","14"],"description":""},{"name":"2","type":["21","","23","24"],"description":""},{"name":"3","type":["31","","33","34"],"description":""}]}
  window.set-data = -> test-form.d2f data
