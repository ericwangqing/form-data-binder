(function(){
  var spec, root, ref$;
  spec = function(){
    return {
      'name': 'create_assignment',
      'label': '布置作业',
      'folderable': false,
      rows: [
        {
          'width': 6,
          'height': 1,
          'fields': [
            {
              'name': 'title',
              'label': '题目',
              'fieldType': 'input.text',
              'placeholder': '作业题目',
              'tooltip': '作业题目',
              'width': 4,
              'height': 1,
              'css': null,
              'valid': "data-parsley-minlength='20' data-parsley-trigger='keyup' required "
            }, {
              'name': 'assigned-by._id',
              'ref': 'auto',
              'fieldType': 'input.hidden',
              'value': 'user._id'
            }, {
              'name': 'assigned-by.name',
              'ref': 'auto',
              'label': '出题人',
              'fieldType': 'input.text.disabled',
              'tooltip': '出题教师',
              'width': 2,
              'height': 1,
              'css': null,
              'link': 'user.view',
              'pop': 'user.view.pop',
              'behavior': function(){}
            }
          ]
        }, {
          'width': 6,
          'height': 2,
          'fields': [
            {
              'name': 'for-students',
              'ref': 'select',
              'value': 'students{_id, name}',
              'multi': '[1, 2]',
              'label': '参与学生列表',
              'fieldType': 'input.typeahead',
              'placeholder': '输入并删选参与学生',
              'tooltip': '输入并删选参与学生',
              'width': 3,
              'height': 1,
              'css': null
            }, {
              'name': 'restrictions.end-time',
              'label': '结束时间',
              'fieldType': 'input.datatime',
              'tooltip': '作业题目',
              'width': 2,
              'height': 1,
              'css': null
            }, {
              'name': 'restrictions.submit-times',
              'label': '提交次数',
              'fieldType': 'input.number',
              'tooltip': '提交次数',
              'width': 1,
              'height': 1,
              'css': null
            }
          ]
        }, {
          'width': 1,
          'height': 5,
          'fields': [{
            'name': 'requirement',
            'label': '要求',
            'fieldType': 'textarea',
            'placeholder': '请输入作业要求的内容',
            'tooltip': '请输入作业要求的内容',
            'width': 1,
            'height': 5,
            'css': null
          }]
        }, {
          'name': 'submissions',
          'label': '交付件列表',
          'multi': '[1, 10]',
          rows: [{
            'width': 1,
            'height': 1,
            'fields': [
              {
                'name': 'submissions[].name',
                'label': '名称',
                'fieldType': 'input.text',
                'placeholder': '名称',
                'tooltip': '名称',
                'width': 1,
                'height': 1,
                'css': null,
                'valid': "data-parsley-minlength='20' data-parsley-trigger='keyup' required "
              }, {
                'name': 'submissions[].type',
                'ref': 'select',
                'value': ['zip', 'pdf', 'doc', '*'] + "",
                'multi': '[1, *]',
                'label': '文件格式',
                'fieldType': 'input.typeahead',
                'placeholder': '输入并删选格式',
                'tooltip': '输入并删选格式',
                'width': 3,
                'height': 1,
                'css': null
              }, {
                'name': 'submissions[].copies-amount',
                'label': '交付件总数量',
                'fieldType': 'input.number',
                'width': 1,
                'height': 1,
                'css': null,
                'valid': "data-parsley-minlength='20' data-parsley-trigger='keyup' required "
              }
            ]
          }]
        }
      ]
    };
  };
  if (typeof define != 'undefined' && define !== null) {
    define('spec', [], spec);
  } else {
    root = (ref$ = typeof module != 'undefined' && module !== null ? module.exports : void 8) != null ? ref$ : this;
    root.spec = spec();
  }
}).call(this);
