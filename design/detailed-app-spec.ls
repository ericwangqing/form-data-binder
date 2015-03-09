widgets =
    'name': 'create_assignment'
    'label': '布置作业' # 默认值 Create Assignment
    'folderable': false
    rows:
      * 'width': 6 # 计算值，所有field的width相加
        'height': 1 # 计算值，所有field中最大的height
        'fields':
          * 'name': 'title'
            'label': '题目' # 默认值等于key
            'fieldType': 'input.text'
            'placeholder': '作业题目' # 默认值等于label
            'tooltip': '作业题目' # 默认值等于placeholder
            'width': 4
            'height': 1
            'css': null
            'valid': "data-parsley-minlength='20' data-parsley-trigger='keyup' required "

          * 'name': 'assigned-by._id'
            'ref': 'auto'  # 自动从当前数据环境中获取，无须用户交互选择
            'fieldType': 'input.hidden'
            'value': 'user._id'

          * 'name': 'assigned-by._name':
            'ref': 'auto'  # 自动从当前数据环境中获取，无须用户交互选择
            'label': '出题人' # 默认值等于key
            'fieldType': 'input.text.disabled'
            'tooltip': '出题教师' # 默认等于view_user中，user.name的tooltip
            'width': 2
            'height': 1
            'css': null
            'link': 'user.view'
            'pop': 'user.view.pop'
            'behavior': -> # 会在运行时执行的代码

      * 'width': 6 # 计算值，所有field的width相加
        'height': 2 # 计算值，所有field中最大的height

        'fields':
          * 'name': 'for-students': # ？如何取两个值(_id, name)
            'ref': 'select'  # 从当前数据环境中获取候选集，然后用户选择
            'value': 'students{_id, name}' 
            'multi': '[1, *]'
            'label': '参与学生列表' # 默认值等于key
            'fieldType': 'typeahead'
            'placeholder': '输入并删选参与学生' # 默认值等于label
            'tooltip': '输入并删选参与学生' # 默认值等于placeholder
            'width': 3
            'height': 1
            'css': null

          * 'name': 'restrictions.end-time':
            'label': '结束时间' # 默认值等于key
            'fieldType': 'input.datatime'
            'tooltip': '作业题目' # 默认值等于placeholder
            'width': 2
            'height': 1
            'css': null
       
          * 'name': 'restrictions.submit-times':
            'label': '提交次数' # 默认值等于key
            'fieldType': 'input.number'
            'tooltip': '提交次数' # 默认值等于placeholder
            'width': 1
            'height': 1
            'css': null

      * 'width': 1 # 计算值，所有field的width相加
        'height': 5 # 计算值，所有field中最大的height

        'fields':
          * 'name': 'requirement':
            'label': '要求' # 默认值等于key
            'fieldType': 'textarea'
            'placeholder': '请输入作业要求的内容' # 默认值等于label
            'tooltip': '请输入作业要求的内容' # 默认值等于placeholder
            'width': 1
            'height': 5
            'css': null
          ...

      * 'name': 'submissions'
        'label': '交付件列表' # 默认等于key
        'multi': '[1, 10]'
        rows:
          * 'width': 1
            'height': 1

            'fields':
              * 'name': 'submissions[].name'
                'label': '名称' # 默认值等于key
                'fieldType': 'input.text'
                'placeholder': '名称' # 默认值等于label
                'tooltip': '名称' # 默认值等于placeholder
                'width': 1
                'height': 1
                'css': null
                'valid': "data-parsley-minlength='20' data-parsley-trigger='keyup' required "

              * 'name': 'submissions[].type': # ？如何取两个值(_id, name)
                'ref': 'select'  # 从当前数据环境中获取候选集，然后用户选择
                'value': "#{['zip', 'pdf', 'doc', '*']}"
                'multi': '[1, *]'
                'label': '文件格式' # 默认值等于key
                'fieldType': 'typeahead'
                'placeholder': '输入并删选格式' # 默认值等于label
                'tooltip': '输入并删选格式' # 默认值等于placeholder
                'width': 3
                'height': 1
                'css': null

              * 'name': 'submissions[].copies-amount'
                'label': '交付件总数量' # 默认值等于key
                'fieldType': 'input.number'
                'width': 1
                'height': 1
                'css': null
                'valid': "data-parsley-minlength='20' data-parsley-trigger='keyup' required "


