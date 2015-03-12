(function(){
  var widgetSpec, root, ref$;
  widgetSpec = function(){
    return {
      name: 'creaet_assignment',
      label: '布置作业',
      model: {
        title: {
          '@valid': {
            min: 20
          }
        },
        requirement: {
          '@valid': {
            min: 20
          }
        },
        restrictions: {
          endTime: null,
          submitTimes: null
        },
        assignedBy: {
          '@ref': 'user.name'
        },
        forStudents: {
          '@multi': '[1, 10]',
          '@ref': 'students'
        },
        submissions: {
          '@multi': '[1, 2]',
          name: null,
          filetype: {
            '@multi': [1, 2],
            '@candidates': ['zip', 'pdf', 'doc', '*']
          },
          copiesAmount: {
            '@type': 'number'
          },
          description: null
        }
      },
      descriptions: {
        labels: {
          'title': '题目',
          'assigned-by': '出题老师',
          'for-students': '参与学生列表',
          'restrictions.end-time': '截止时间',
          'restrictions.submit-times': '最多提交次数',
          'requirement': '具体要求',
          'submissions': '交付件列表',
          'submissions[].name': '名称',
          'submissions[].filetype': '类型',
          'submissions[].copies-amount': '总量'
        },
        placeholders: {
          '题目': '作业题目',
          'requirement': '请输入作业要求的内容',
          'submissions[].name': '交付件名称'
        },
        tooltips: {
          '截止时间': '截止后，将不能够提交',
          '出题老师': '今天已经出了#{getTodayAssignemtsOfUser}题目'
        }
      },
      styles: {
        type: 'gridforms',
        rows: [['题目(3)', '出题老师'], ['参与学生列表', '截止时间', '最多提交次数'], ['具体要求', 2], ['交付件列表', ['名称', '类型', '总量']]]
      },
      behaviors: {
        '作业内容': {
          validate: 'keyup'
        },
        '出题老师': {
          pop: 'user.view.pop'
        }
      }
    };
  };
  if (typeof define != 'undefined' && define !== null) {
    define('widget-spec', [], widgetSpec);
  } else {
    root = (ref$ = typeof module != 'undefined' && module !== null ? module.exports : void 8) != null ? ref$ : this;
    root.widgetSpec = widgetSpec();
  }
}).call(this);
