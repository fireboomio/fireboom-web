# GraphQL 文档查询选择器

## 名词约定
- operation: query mutation subscription
- schema: GraphQL 内省出的查询定义对象
- document: 由用户查询语句解析 ast 后得到的结构体对象
- field 栈: 由用户点击查询产生的堆栈，包括最外层的 operation
- argument 栈: 由用户点击 field 上的 argument 产生的堆栈
- 当前选择的 field: 由 field 栈在 document 上映射查到的 field node，可能是对象，也可能是 scalar 类型
- 当前选择的 argument: 当前 field 为对象类型时，在当前 field 上根据 argument 栈在当前 field 的 arguments 上映射查到的 argument node

## schema 选中逻辑

- root operation 选中逻辑
  document 的 operation type = 当前 operation type
- field 选中逻辑
  "当前选择的 field" 的字段列表包含 field 的 name
- 字段列表后图标选中逻辑
  列表中所有 field 都在 "当前选择的 field" 的字段列表中
- 面包屑下方导航图标选中逻辑
  即 field 栈中最后一个 field的选中逻辑
- 参数列表选中逻辑
  "当前选择的 argument"的参数列表包含 argument 的 name

## schema 点击逻辑

- 点击选择 operation 的逻辑
  - 如果和 document 的 type 不一致（包括空），则清空并插入当前 operation 的空查询结构体
  - 如果和 document 的 type 一致，则清空查询

- 点击选择 field 的逻辑
  - 如果和 document 的 type 不一致（包括空），则清空并插入由所有 field 栈构成的新查询树
  - 如果和 document 的 type 一致，则根据 field 栈从 document root 开始依次向下查找是否存在该 field
    - 如果 document 原本就存在该 field，则从 document 中删除当前的 field
    - 如果 document 中不存在该 field，则从 document root 开始依次向下确保所有 field 存在

- 点击选择 argument 的逻辑
  - 如果和 document 的 type 不一致（包括空），则清空并插入由所有 field 栈构成的新查询树，同时在 document operation 上追加一个变量并为最后一个 field 添加查询参数
  - 如果和 document 的 type 一致
    - 如果 document 的最后一个 field 上已经有该参数（即已选择），则将该 field 的该参数移除
      - 如果整个 query 中没有该变量的其它引用，则移除 document operation 上的参数
      - 如果 query 中有其他该变量的引用，则不改变 document operation 上的参数
    - 如果 document 的最后一个 field 上没有该参数，则在 document operation 的参数上追加一个变量和对应的类型（此时可能会出现孤岛变量，即之前已存在但未被使用的变量）

- 点击选择 FieldTitle 的选择所有
  - 如果和 document 的 type 不一致（包括空），则清空并插入由所有 field 栈构成的新查询树
  - 如果和 document 的 type 一致，则检查当前 field 的上一层
    - 如果有，则从最后一层 field 中移除该 field
    - 如果没有，则在最后一层

- 点击选择字段列表的选择所有
  - 如果和 document 的 type 不一致（包括空），则清空并插入由所有 field 栈 + 当前所有 field 构成的新查询树
  - 如果和 document 的 type 一致
    - 如果当前是半选，则清空当前所有 field 的选择
    - 如果当前是全选，则清空当前所有 field 的选择
    - 如果当前是未选中，则追加当前所有 field，对象追加 {}
- 点击选择字段列表的选择所有标量
  逻辑同上，但只选择标量字段
- 点击选择字段列表的递归选择所有
  逻辑同上，但采用递归选择
