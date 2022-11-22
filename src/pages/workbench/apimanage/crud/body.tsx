import { Button, Checkbox, Form, Input, message, Modal, Radio, Select, Table } from 'antd'
import type {
  IntrospectionInputObjectType,
  IntrospectionType
} from 'graphql/utilities/getIntrospectionQuery'
import { cloneDeep, keyBy, mapValues } from 'lodash'
import type React from 'react'
import { useContext, useEffect, useRef, useState } from 'react'
import useSWR from 'swr'
import { useImmer } from 'use-immer'

import type { DMFField, DMFModel } from '@/interfaces/datasource'
import { WorkbenchContext } from '@/lib/context/workbenchContext'
import requests from '@/lib/fetchers'
import GraphqlIntrospection from '@/lib/helpers/GraphqlIntrospection'
import type { RelationMap } from '@/lib/helpers/prismaRelation'
import buildApi from '@/pages/workbench/apimanage/crud/buildApi'

import type { _DMFField, _DMFModel, ApiOptions, TableAttr } from './interface'
import { API, AuthOptions, AuthType, KeyType, SortDirection } from './interface'

interface CRUDBodyProps {
  model?: DMFModel
  modelList?: DMFModel[]
  relationMap?: RelationMap
  dbName: string
}

const apiOptions = [
  { label: '增加', value: API.Create },
  { label: '删除', value: API.Delete },
  { label: '更新', value: API.Update },
  { label: '详情', value: API.Detail },
  { label: '分页查询', value: API.List },
  { label: '批量删除', value: API.BatchDelete },
  { label: '查询全部', value: API.Export }
]

function omitForeignKey(model: _DMFModel, relationMap: RelationMap) {
  const filtered = model.fields.filter(field => {
    if (relationMap.key2obj[field.name]) {
      return false
    }
    if (relationMap.obj2key[field.name]) {
      field.originField = model.fields.find(field => field.name === relationMap.obj2key[field.name])
    }
    return true
  })
  model.fields = filtered
}

/**
 * 将model中的外键字段展开为级联model，会修改入参model
 * @param model 需要展开的model
 * @param modelList 所有的model，用于查找外键对应的model
 * @param depth 展开的深度，0表示不展开，1表示展开一层，以此类推
 * @param parentField
 */
function expandForeignField(
  model: _DMFModel,
  modelList: DMFModel[],
  depth = 1,
  parentField?: _DMFField
) {
  const isForeign = !!parentField
  model.fields = model.fields.filter(field => {
    field.tableId = field.name
    if (parentField) {
      field.tableId = parentField?.tableId + '.' + field.tableId
    }
    field.isForeign = isForeign
    field.parentField = parentField
    field.isPrimaryKey = field.name === model.idField

    if (field.kind !== 'object') {
      // 非外键字段，直接返回
      return true
    }
    let relatedModel = modelList.find(item => item.name === field.type)
    if (!relatedModel) {
      // 找不到外键对应的model，过滤掉该字段
      return false
    }
    relatedModel = cloneDeep(relatedModel)

    if (depth > 0) {
      expandForeignField(relatedModel, modelList, depth - 1, field)
    }
    // @ts-ignore
    field.children = relatedModel.fields
    return true
  })
}

export default function CRUDBody(props: CRUDBodyProps) {
  const [form] = Form.useForm()
  const auth = Form.useWatch('auth', form)
  const table = Form.useWatch('table', form)
  // 当前选择的模型
  const [model, setModel] = useImmer<DMFModel | undefined>(void 0)
  // 表单初始化数据
  const [initData, setInitData] = useState<ApiOptions>()
  // 字段列表，用于主键下拉框
  const [field, setField] = useImmer<{ value: string; label: string }[]>([])
  // 展开状态表，用于标记外键展开状态
  const [expandRowKey, setExpandRowKey] = useImmer<string[]>([])
  // api已存在提示内容
  const [confirmModal, setConfirmModal] = useState<React.ReactNode>()
  // api已存在提示内容
  const { data: typeMap } = useSWR<Record<string, IntrospectionType>>(
    'graphql',
    GraphqlIntrospection
  )
  // api提示的promise对应的resolve，用于实现对话框promise化
  const confirmResolve = useRef<(value: unknown) => void>()
  const { data: roles } = useSWR<{ id: number; code: string; remark: string }[]>(
    '/role',
    (url: string) =>
      requests.get<unknown, { id: number; code: string; remark: string }[]>(url).then(res => {
        res.forEach(item => {
          item.remark = item.remark || item.code
        })
        return res
      })
  )

  const { onRefreshMenu } = useContext(WorkbenchContext)
  useEffect(() => {
    if (!props.model) {
      return
    }
    // 设置主键选择列表
    setField(props.model?.fields.map(item => ({ value: item.name, label: item.name })) || [])
    // 展开外键
    const model: _DMFModel = cloneDeep(props.model)

    omitForeignKey(model, props.relationMap!)
    expandForeignField(model, props.modelList || [], 3)

    const createType = typeMap?.[
      `${props.dbName}_${model.name}CreateInput`
    ]! as IntrospectionInputObjectType
    const createTypeMap: Record<string, string> = {}
    createType.inputFields.forEach(item => {
      if (item.type.kind === 'NON_NULL') {
        // @ts-ignore
        createTypeMap[item.name] = item.type.ofType?.name
      } else {
        // @ts-ignore
        createTypeMap[item.name] = item.type?.name
      }
    })
    const updateType = typeMap?.[
      `${props.dbName}_${model.name}UpdateInput`
    ]! as IntrospectionInputObjectType
    const updateTypeMap: Record<string, string> = {}
    updateType.inputFields.forEach(item => {
      if (item.type.kind === 'NON_NULL') {
        // @ts-ignore
        updateTypeMap[item.name] = item.type.ofType?.name
      } else {
        // @ts-ignore
        updateTypeMap[item.name] = item.type?.name
      }
    })
    const tableData: Record<string, TableAttr> = {}
    const genTableData = (fields: _DMFField[]) => {
      fields.forEach(field => {
        if (field.children) {
          // 取消级联生成，子字段目前不做任何默认数据
          // genTableData(field.children || [])
        }
        if (field.kind === 'object') {
          tableData[field.tableId ?? ''] = {
            isDirectField: false,
            kind: field.kind,
            name: field.name,
            type: field.type,
            createType: createTypeMap[field.name],
            updateType: updateTypeMap[field.name],
            detail: false,
            filter: false,
            list: false,
            sort: false,
            create: field.required ? KeyType.Required : KeyType.Optional,
            update: KeyType.Optional,
            sortDirection: SortDirection.Asc
          }
        } else {
          tableData[field.tableId ?? ''] = {
            isDirectField: true,
            kind: field.kind,
            name: field.name,
            type: field.type,
            createType: createTypeMap[field.name],
            updateType: updateTypeMap[field.name],
            sort: true,
            detail: true,
            list: true,
            filter: true,
            sortDirection: SortDirection.Asc,
            create:
              field.name === props.model?.idField
                ? KeyType.Hidden
                : field.required
                ? KeyType.Required
                : KeyType.Optional,
            update: field.name === props.model?.idField ? KeyType.Hidden : KeyType.Optional
          }
        }
      })
    }
    genTableData(model.fields)

    // 设置表单初始化数据
    setInitData({
      dbName: props.dbName,
      apiList: Object.values(API),
      authApiList: [API.Create, API.Update, API.Delete],
      roleList: [],
      auth: AuthOptions.default,
      authType: AuthType.RequireMatchAll,
      table: tableData,
      prefix: '',
      alias: props?.model?.name,
      modelName: props?.model?.name,
      primaryKey: props.model.idField
    })
    setModel(model)
  }, [props.model])
  useEffect(() => {
    form.resetFields()
  }, [initData])

  if (!model) return null

  const onFinish = async (values: any) => {
    let apiList = buildApi(values)
    console.log(apiList)
    const pathList = apiList.map(item => item.path)

    const hideCheck = message.loading('校验中')
    // TODO 校验API是否重复
    const existPathList = await requests.get<unknown, { ID: string; Path: string }[]>(
      '/operateApi/operationByPaths',
      {
        params: { paths: JSON.stringify(pathList) }
      }
    )
    const pathIdMap = mapValues(keyBy(existPathList, 'Path'), 'ID')
    hideCheck()
    if (existPathList.length) {
      const result = await new Promise(resolve => {
        confirmResolve.current = resolve
        setConfirmModal(
          existPathList.map(item => {
            return <div key={item.Path}>{item.Path}</div>
          })
        )
      })
      if (result === 0) {
        return
      } else if (result === 1) {
        apiList = apiList.filter(item => !pathIdMap[item.path])
      }
    }
    const hide = message.loading('正在生成')

    const results: boolean[] = await Promise.all(
      apiList.map(item => {
        const existId = pathIdMap[item.path]
        let promise
        if (existId) {
          promise = requests.put(`/operateApi/content/${existId}`, {
            content: item.content
          })
        } else {
          promise = requests.post('/operateApi', {
            path: item.path,
            content: item.content
          })
        }
        return promise
          .then(() => {
            return true
          })
          .catch(e => {
            console.log(e)
            return false
          })
      })
    )
    // 处理登录鉴权
    // if (values.auth !== AuthOptions.default) {
    // }
    hide()
    onRefreshMenu('api')
    message.success(
      `执行结束，成功${results.filter(x => x).length}条，失败${results.filter(x => !x).length}条`
    )
  }

  const setTableFiled = (rowName: string, key: string, value: any) => {
    const table = form.getFieldValue('table')
    if (!table[rowName]) {
      table[rowName] = {}
    }
    table[rowName][key] = value
    form.setFieldValue('table', { ...table })
  }

  const onSelectCheck = (type: 'list' | 'detail', field: _DMFField, check: boolean) => {
    setTableFiled(field.tableId ?? '', type, check)
    console.log(field.tableId ?? '', type, check)
    if (check) {
      // 如果是勾选，则递归向上将所有祖先勾选，同时则将自己的主键和第一个非主键子字段勾选
      let parent = field.parentField
      while (parent) {
        setTableFiled(parent.tableId ?? '', type, check)
        parent = parent.parentField
      }
      if (field.children) {
        // 自动展开当前行
        if (!expandRowKey.includes(field.tableId!)) {
          setExpandRowKey(keys => {
            keys.push(field.tableId!)
          })
        }
        const noIdField = field.children?.find(child => !child.isPrimaryKey)
        const idField = field.children?.find(child => child.isPrimaryKey)
        noIdField && setTableFiled(noIdField.tableId ?? '', type, check)
        idField && setTableFiled(idField.tableId ?? '', type, check)
      }
    } else {
      // 如果是取消，则递归向上检查是否需要取消勾选，同时将自己的子字段全部去选
      const tableData: Record<string, TableAttr> = form.getFieldValue('table')
      let parent = field.parentField
      while (parent) {
        const hasChecked = parent.children?.some(field => tableData[field.tableId ?? ''][type])
        setTableFiled(parent.tableId ?? '', type, hasChecked)
        parent = parent.parentField
      }
      const cancelList: _DMFField[] = [...(field.children ?? [])]
      while (cancelList.length) {
        const current = cancelList.pop()
        setTableFiled(current?.tableId ?? '', type, false)
        if (current?.children) {
          cancelList.push(...current.children)
        }
      }
    }
  }

  const columns = [
    {
      title: '字段',
      dataIndex: 'name',
      render: (text: string, field: DMFField, index: number) => (
        <>
          <span>{text}</span>
        </>
      )
    },
    { title: '类型', dataIndex: 'type' },
    {
      title: '列表',
      dataIndex: 'list',
      render: (text: any, record: any) => {
        return (
          <Checkbox
            checked={table?.[record.tableId]?.list}
            onClick={e => {
              // @ts-ignore
              onSelectCheck('list', record, e.target.checked)
            }}
          />
        )
      }
    },
    {
      title: '详情',
      dataIndex: 'detail',
      render: (text: any, record: any) => {
        return (
          <Checkbox
            checked={table?.[record.tableId]?.detail}
            onChange={e => {
              // @ts-ignore
              onSelectCheck('detail', record, e.target.checked)
            }}
          />
        )
      }
    },
    {
      title: '过滤',
      dataIndex: 'filter',
      render: (text: any, record: any) => {
        return (
          !record.isForeign && (
            <Checkbox
              disabled={record.kind === 'object'}
              checked={table?.[record.tableId]?.filter}
              onChange={e => {
                setTableFiled(record.tableId, 'filter', e.target.checked)
              }}
            />
          )
        )
      }
    },
    {
      title: '排序',
      dataIndex: 'sort',
      render: (text: any, record: any) => {
        return (
          !record.isForeign && (
            <Checkbox
              disabled={record.kind === 'object'}
              checked={table?.[record.tableId]?.sort}
              onChange={e => {
                setTableFiled(record.tableId, 'sort', e.target.checked)
              }}
            />
          )
        )
      }
    },
    {
      title: '默认排序',
      dataIndex: 'sortDirection',
      render: (text: any, record: any) => {
        return (
          !record.isForeign &&
          (table?.[record.tableId]?.sort ? (
            <Select
              value={table?.[record.tableId]?.sortDirection}
              options={[
                { label: '正序', value: SortDirection.Asc },
                { label: '倒序', value: SortDirection.Desc }
              ]}
              onChange={value => {
                setTableFiled(record.tableId, 'sortDirection', value)
              }}
            />
          ) : (
            '-'
          ))
        )
      }
    },
    {
      title: '创建',
      dataIndex: 'create',
      render: (text: any, record: any) => {
        return (
          !record.isForeign && (
            <Select
              value={table?.[record.tableId]?.create}
              // 生成时，如果是主键，必须是隐藏，如果是必填，必须是必填
              disabled={record.tableId === model.idField || record.required}
              options={[
                { label: '无', value: KeyType.Hidden },
                { label: '选填', value: KeyType.Optional },
                { label: '必填', value: KeyType.Required }
              ]}
              onChange={value => {
                setTableFiled(record.tableId, 'create', value)
              }}
            />
          )
        )
      }
    },
    {
      title: '更新',
      dataIndex: 'update',
      render: (text: any, record: any) => {
        return (
          !record.isForeign && (
            <Select
              disabled={record.tableId === model.idField}
              value={table?.[record.tableId]?.update ?? 'choose'}
              options={[
                { label: '无', value: KeyType.Hidden },
                { label: '选填', value: KeyType.Optional },
                { label: '必填', value: KeyType.Required }
              ]}
              onChange={value => {
                setTableFiled(record.tableId, 'update', value)
              }}
            />
          )
        )
      }
    }
  ]

  return (
    <div className="common-form flex-1 pt-4 px-8 overflow-y-auto">
      <Form
        labelCol={{ span: 4, xs: 5 }}
        wrapperCol={{ span: 20, xs: 19 }}
        form={form}
        onFinish={onFinish}
        initialValues={initData}
      >
        <Form.Item
          name="primaryKey"
          label="主键选择"
          rules={[{ required: true, message: '请选择主键' }]}
        >
          <Select options={field} />
        </Form.Item>
        <Form.Item name="apiList" label="生成接口">
          <Checkbox.Group options={apiOptions} />
        </Form.Item>
        <Form.Item name="auth" label="登录鉴权">
          <Radio.Group>
            <Radio value={-1}>默认</Radio>
            <Radio value={1}>开启</Radio>
            <Radio value={0}>关闭</Radio>
          </Radio.Group>
        </Form.Item>
        <>
          <Form.Item name="authApiList" label="接口角色">
            <Checkbox.Group options={apiOptions} />
          </Form.Item>
          <Form.Item name="authType" wrapperCol={{ offset: 4, xs: { offset: 5 } }}>
            <Radio.Group>
              <Radio value={AuthType.RequireMatchAll}>requireMatchAll</Radio>
              <Radio value={AuthType.RequireMatchAny}>requireMatchAny</Radio>
              <Radio value={AuthType.DenyMatchAll}>denyMatchAll</Radio>
              <Radio value={AuthType.DenyMatchAny}>denyMatchAny</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="roleList" wrapperCol={{ offset: 4, xs: { offset: 5 } }}>
            <Select
              mode="multiple"
              showArrow
              options={roles ?? []}
              fieldNames={{ label: 'remark', value: 'code' }}
            />
          </Form.Item>
        </>
        <Form.Item
          name="prefix"
          label="API前缀"
          rules={[
            {
              pattern: /^[A-Z][a-zA-Z0-9_]*$/,
              message: '请输入字母数字或下划线组合，以大写字母开头'
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="alias"
          label="别名"
          rules={[
            {
              required: true,
              pattern: /^[a-zA-Z0-9_]*$/,
              message: '请输入字母数字或下划线组合'
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="table" wrapperCol={{ offset: 4, xs: { offset: 5 } }}>
          <Table
            expandable={{
              expandedRowKeys: expandRowKey,
              onExpandedRowsChange: keys => {
                setExpandRowKey(keys as string[])
              }
            }}
            rowKey="tableId"
            dataSource={model.fields}
            columns={columns}
            pagination={false}
          />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 4, xs: { offset: 5 } }}>
          <>
            <Button
              className="btn-cancel mr-4"
              onClick={() => {
                form.resetFields()
              }}
            >
              重置
            </Button>
            <Button className="btn-save mr-4" htmlType="submit">
              创建
            </Button>
          </>
        </Form.Item>
        {/* 用于保持字段 */}
        <Form.Item name="dbName" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="modelName" hidden>
          <Input />
        </Form.Item>
      </Form>
      <Modal
        open={!!confirmModal}
        title="检测到以下API已存在，是否覆盖？"
        onCancel={() => {
          setConfirmModal(undefined)
        }}
        footer={
          <div className="common-form">
            <Button
              className="btn-cancel"
              onClick={() => {
                setConfirmModal(undefined)
                confirmResolve.current?.(0)
              }}
            >
              取消
            </Button>
            <Button
              className="btn-save"
              onClick={() => {
                setConfirmModal(undefined)
                confirmResolve.current?.(1)
              }}
            >
              跳过已有API
            </Button>
            <Button
              className="btn-save"
              onClick={() => {
                setConfirmModal(undefined)
                confirmResolve.current?.(2)
              }}
            >
              全部覆盖
            </Button>
          </div>
        }
      >
        {confirmModal}
      </Modal>
    </div>
  )
}
