widget-spec = ->
  name: 'creaet_assignment'
  label: '布置作业'
  model: 
    # '@options': {required: true} # 这里可以修改一些默认值，也可以在属性定义中单独定义
    title: '@valid': {min: 20}
    requirement: '@valid': {min: 20}
    restrictions:
      end-time: null
      submit-times: null
    assgined-by: 
      '@ref': 'user', 
      _id: null
      name: null
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

      # 规则：instance为json，这里的model定义了instance的结构（scheme），一个instance，为一组attr、value，一个attr的value可以是简单数据类型，或者是Object，或者是Array
      #   1) 当attr为简单数据类型时，需要定义的是其校验规则：
      #       1）不定义，由b+根据attr的名称来推断。此时，attr在model中为叶子节点。2）定义，此时attr为model第2层节点，其key为attr，
      #       2）定义，此时attr为model第2层节点，其key为attr，value为校验规则（attr：valid：{...}）
      #   2）当attr为Object时，需要定义其属性。1）此时，attr为中间节点，并且没有valid、array属性，Object的属性就是attr的属性（若instance本身有valid、array属性，转义为\valid、\array）
      #   3）当attr为Array时，需要定义元素属性。此时，attr通过其array属性来定义其元素属性。1）元素为简单数据类型，array值为null；2）元素为array或者object，继续运用规则2）、3）。此时可有validate属性来定义对数组的校验和对元素的校验。
      #   
      #   引用： ref: '引用对象（obj.path）'，引用对象为简单类型时，仅仅是一个域，为复杂类型时，可全部引用 ref: 'user'；也可选择引用，ref: 'user': ['_id', 'account.name']      #   

  description:
    labels:
      'title': '题目'
      'assigned-by.name': '出题老师'
      'for-students': '参与学生列表'
      'restrictions.end-time': '截止时间'
      'restrictions.submit-times': '最多提交次数'
      'requirement': '具体要求'
      'submissions': '交付件列表'
      'submissions[].name': '名称'
      'submissions[].type': '类型'
      'submissions[].copies-amount': '总量'

    placeholders:
      '题目': '作业题目'
      'requirement': '请输入作业要求的内容'
      'submissions[].name': '交付件名称'

    tooltips:
      '截止时间': '截止后，将不能够提交'
      '出题老师': '今天已经出了#{getTodayAssignemtsOfUser}题目'


  styles:
    type: 'gridforms'
    # rows:
    #   <[ 题目(3)  出题老师  ]>
    #   <[ 参与学生列表  截止时间  最多提交次数 ]>
    #   <[ 具体要求 2]>
    #   # * 表示是mutil rows，第二个元素为这个multi rows集合的label，后面的元素才是各个域的label
    #   <[ * 交付件列表 ]>.push (
    #       <[名称 类型 总量]>
    #   )

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

if define? # a+运行时
  define 'widget-spec', [], widget-spec 
else # b-plus开发时
  root = module?.exports ? @
  root.widget-spec = widget-spec!
