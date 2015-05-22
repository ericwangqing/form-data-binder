(function(){
  $(function(){
    var testForm;
    testForm = window.testForm = formManager.create('form#parsed', 'create');
    testForm.specBehaviors = {
      'forStudents[]': [{
        act: function(dom){
          $(dom).css('background-color', 'yellow');
        }
      }],
      'submissions[].name': [{
        act: function(dom){
          $(dom).css('background-color', 'red');
        }
      }],
      'submissions[].type[]': [{
        act: function(dom){
          $(dom).css('background-color', 'green');
        }
      }],
      'nonono[].type[]': [{
        act: function(dom){
          $(dom).css('background-color', 'blue');
        }
      }]
    };
    testForm.activate();
    window.data = {
      "title": "这是题目",
      "content": "这是内容",
      "endTime": "",
      "assignedBy": {
        "userId": "",
        "name": "我是老师"
      },
      "forStudents": ["11", "22"],
      "submissions": [
        {
          "name": "111",
          "type": ["11", "12", "13", "14"],
          "description": ""
        }, {
          "name": "2",
          "type": ["21", "22", "23", "24"],
          "description": ""
        }
      ],
      "nonono": [
        {
          "name": "111",
          "type": ["11", "", "13", "14"],
          "description": ""
        }, {
          "name": "2",
          "type": ["21", "", "23", "24"],
          "description": ""
        }, {
          "name": "3",
          "type": ["31", "", "33", "34"],
          "description": ""
        }
      ]
    };
    return window.setData = function(){
      return testForm.d2f(data);
    };
  });
}).call(this);
