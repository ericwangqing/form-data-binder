app-spec =
  name: 'agile homework'

  models: 
    '@options': {required: true} # 这里可以修改一些默认值，也可以在属性定义中单独定义
    'assignment': 
      'title': '@valid': {min: 20}
      'requirement': '@valid': {min: 20}
      'restrictions':
        'end-time'
        'submit-times'
      'assgined-by': 
        '@ref': 'user.name', 
        '_id'
        'name'
      'for-students': 
        '@array': '[1, 10]'
        '@ref': 'students'
        '_id'
        'name'
      'submissions': 
        '@array': '[1, 2]'
        'name'
        'filetype': 
          '@array': [1, 2]
          '@candidates': <[zip pdf doc *]>
        'copies-amount': '@type': number
        'description'

      # 规则：instance为json，这里的model定义了instance的结构（scheme），一个instance，为一组attr、value，一个attr的value可以是简单数据类型，或者是Object，或者是Array
      #   1) 当attr为简单数据类型时，需要定义的是其校验规则：
      #       1）不定义，由b+根据attr的名称来推断。此时，attr在model中为叶子节点。2）定义，此时attr为model第2层节点，其key为attr，
      #       2）定义，此时attr为model第2层节点，其key为attr，value为校验规则（attr：valid：{...}）
      #   2）当attr为Object时，需要定义其属性。1）此时，attr为中间节点，并且没有valid、array属性，Object的属性就是attr的属性（若instance本身有valid、array属性，转义为\valid、\array）
      #   3）当attr为Array时，需要定义元素属性。此时，attr通过其array属性来定义其元素属性。1）元素为简单数据类型，array值为null；2）元素为array或者object，继续运用规则2）、3）。此时可有validate属性来定义对数组的校验和对元素的校验。
      #   
      #   引用： ref: '引用对象（obj.path）'，引用对象为简单类型时，仅仅是一个域，为复杂类型时，可全部引用 ref: 'user'；也可选择引用，ref: 'user': ['_id', 'account.name']      #   

  widgets:
    assignment:
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


      detail:
        layout:
          type: 'gridforms'
          rows:
            <[ 题目(3)  出题老师  ]>
            <[ 参与学生列表  截止时间  最多提交次数 ]>
            <[ 具体要求 2]>
            <[ * 交付件列表 ]>
              <[ 名称 类型 总量 ]>


        holders:
          '题目': '作业题目'
          'requirement': '请输入作业要求的内容'
          'submissions[].name': '交付件名称'

        tooltips:
          '截止时间': '截止后，将不能够提交'
          '出题老师': '今天已经出了#{getTodayAssignemtsOfUser}题目'

        behaviors:
          '作业内容': validate: 'keyup'
          '出题老师': pop: 'user.view.pop'












  widgets:
    assignment:
      list:
        data  : ['title', 'content', 'end-time']
        title : ['题目'  ,    '内容',   '截止时间']
    
      detail:
        '题目详情':
          * labels  : ['题目'       ,   '截止时间'   ]
            holders : ['作业题目'    ,   '-'        ]
            data    : ['title'      ,   'end-time' ]
            widths  : [ 2           ,    1         ]

          * '交付件':
              * labels    :   ['名称'       ,   '要求'   ]
                holders   :   ['交付件名称'  ,   '具体要求']
                data      :   ['artifacts[].name' ,    'artifacts[].requirement']
                width     :   [ 1           ,    4      ]
                multiple  :   [1, 3]
      
      # widget-states-app-states-map: edit: ['测试'], view: ['正式']

    # homeworks:
    #   table:




  app:
    states: <[ 测试 正式 ]>

    states-data:
      '测试': assignments: null
      '正式': assignments: null # , homewoks: null # TODO：考虑homeworks stop subscribe时，依赖于item的widget的data-binder，没有state而出错的问题。

    transitions:
      '测试   ->  正式'          :   'click'     :   hot-area  :   {is-live: true, selector: 'button#test'}
      '正式   ->  测试'          :   'click'     :   hot-area  :   {is-live: true, selector: 'button#test'} 
 
    start-state: '测试'



if define? # a+运行时
  define 'app-spec', ['state', 'util'], (state, util)-> app-spec 
else # 独立运行
  module.exports = app-spec
