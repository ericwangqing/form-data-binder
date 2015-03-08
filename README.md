### simple use（in jade）

  label 题目
    input(type='text' name='title')
    label 要求
    input(type='text' name='content')
    label 时间
    input(type='text' name='endTime')

  .a-plus.array-container(name='submissions' data-a-plus-restriction='[0, 2]' data-a-plus-length='1')
      label 交付件列表
      .a-plus.array-item.object(name='submissions[0]')
        fieldset
          legend 交付件
          label 名称
          input(type='text', name='submissions[0].name')
          .a-plus.array-container(name='submissions[0].type' data-a-plus-restriction='[1, *]' data-a-plus-length='1')
            label 文件格式
            .a-plus.array-item
              input(type='text' name='submissions[0].type[0]')
          label 要求
          input(type='text' name='submissions[0].description')

### 说明

1. 对于数组的容器元素，需要加上类名`array-container`；
2. 数组容器dom属性`data-a-plus-restriction`声明数组长度限制；
3. 数组容器dom属性`data-a-plus-length`声明当前长度，初始为1；
4. 对于数组元素dom，需要加上类名`array-item`；
5. 如果数组元素是对象，在dom上需要加上属性`name`，声明数组元素；
6. 如果数组元素是普通值，则直接在在元素上声明属性`name`；