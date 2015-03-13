# b+应用的声明
app-spec = ->
  name: 'Agile Homework'
  roles: ['student', 'teacher']
  models:
    assignment:
      # '@options': {required: true} # 这里可以修改一些默认值，也可以在属性定义中单独定义
      title: '@valid': {min: 20}
      requirement: '@valid': {min: 20}
      restrictions:
        end-time: null
        submit-times: null
      assigned-by: 
        '@ref': 'user.name', 
      for-students: 
        '@multi': '[1, 10]'
        '@ref': 'students'
      submissions: 
        '@multi': '[1, 2]'
        name: null
        filetype: 
          '@multi': [1, 2]
          '@candidates': <[zip pdf doc *]>
        copies-amount: '@type': 'number'
        description: null

  descriptions:
    assignment:
      labels:
        'title': '题目'
        'assigned-by': '出题老师'
        'for-students': '参与学生列表'
        'restrictions.end-time': '截止时间'
        'restrictions.submit-times': '最多提交次数'
        'requirement': '具体要求'
        'submissions': '交付件列表'
        'submissions[].name': '名称'
        'submissions[].filetype': '类型'
        'submissions[].copies-amount': '总量'

      placeholders:
        '题目': '作业题目'
        'requirement': '请输入作业要求的内容'
        'submissions[].name': '交付件名称'

      tooltips:
        '截止时间': '截止后，将不能够提交'
        '出题老师': '今天已经出了#{getTodayAssignemtsOfUser}题目'

  widgets:
    * type: 'create'
      label: '布置作业'
      model: 'assignment'
      # descriptions: …… 这里的会覆盖 app-spec.descriptions
      appearance:
        type: 'gridforms'
        rows:
          [ '题目(3)',  '出题老师'  ]
          [ '参与学生列表',  '截止时间',  '最多提交次数' ]
          [ '具体要求', 2] # 2表示height，field的height无意义
          # * 表示是mutil rows，第1个元素为这个multi rows集合的label，第二个元素为一行的定义
          [ '交付件列表', 
            ['名称', '类型', '总量']
          ]
      behaviors:
        '作业内容': validate: 'keyup'
        '出题老师': pop: 'user.view.pop'
    ...

  runtime: # 待完善分析
    states: <[ splash ]> 

    states-data: null # state与data之间的mapping

    states-widgets: null # 说明widget的状态与state的状态间的mapping关系

    transitions: null # app状态机

if define? # a+运行时
  define 'app-spec', [], app-spec 
else # 独立运行
  root = module?.exports ? @
  root.app-spec = app-spec!
