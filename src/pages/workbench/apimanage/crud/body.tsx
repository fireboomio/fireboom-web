import {
  AutoComplete,
  Button,
  Checkbox,
  Form,
  Input,
  message,
  Modal,
  Popover,
  Radio,
  Select,
  Table
} from 'antd'
import { cloneDeep, keyBy, upperFirst } from 'lodash'
import type React from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Link, useNavigate } from 'react-router-dom'
import useSWRImmutable from 'swr/immutable'
import { useImmer } from 'use-immer'

import RoleDiagram from '@/components/RoleDiagram'
import { mutateApi, useApiList } from '@/hooks/store/api'
import { useValidate } from '@/hooks/validate'
import type { DMFModel } from '@/interfaces/datasource'
import requests from '@/lib/fetchers'
import type { RelationMap } from '@/lib/helpers/prismaRelation'
import buildApi from '@/pages/workbench/apimanage/crud/buildApi'
import type { ApiDocuments } from '@/services/a2s.namespace'

import failIcon from './assets/fail-icon.svg'
import failPic from './assets/fail-pic.svg'
import successIcon from './assets/success-icon.svg'
import successPic from './assets/success-pic.svg'
import styles from './index.module.less'
import type { _DMFField, _DMFModel, ApiOptions, TableAttr } from './interface'
import { API, AuthOptions, AuthType, KeyType, SortDirection } from './interface'

interface CRUDBodyProps {
  model?: DMFModel
  modelList?: DMFModel[]
  relationMap?: RelationMap
  dbName: string
  dmf?: string // graphql schema
}

function omitForeignKey(model: _DMFModel, relationMap: RelationMap) {
  model.fields.forEach(field => {
    // if (relationMap.key2obj[field.name]) {
    //   return false
    // }
    if (relationMap.obj2key[field.name]) {
      field.originField = model.fields.find(field => field.name === relationMap.obj2key[field.name])
    }
    return true
  })
}

type FieldMap = Record<string, { isSet: boolean; name: string }>
type TypeMap = Record<string, FieldMap>
function genTypeMap(dmf: string, prefix: string): TypeMap {
  const allTypeMap: TypeMap = {}
  for (const [subStr, type] of dmf.matchAll(/input (\w+)\s\{\n[\s\S]*?\n}/g)) {
    const fieldMap: FieldMap = {}
    ;(subStr.match(/(\w+):\s(\w+)/g) ?? []).forEach(pair => {
      const [key, value] = pair.split(': ')
      fieldMap[key.trim()] = { isSet: false, name: value.trim() }
    })
    allTypeMap[type] = fieldMap
  }
  const enumMap: Record<string, boolean> = {}
  for (const [subStr, type] of dmf.matchAll(/enum (\w+)\s\{\n[\s\S]*?\n}/g)) {
    enumMap[type] = true
  }
  // 再次遍历，给所有非标量增加前缀，将所有set类型解包
  Object.keys(allTypeMap).forEach(type => {
    const fieldMap = allTypeMap[type]
    Object.keys(fieldMap).forEach(fieldKey => {
      const field = fieldMap[fieldKey]
      const refType = allTypeMap[field.name]
      // 如果当前字段对应的是set类型，则将其set内容提取出来
      if (refType && refType.set) {
        field.isSet = true
        field.name = refType.set.name
      }
      // 增加类型前缀
      if (allTypeMap[field.name] || enumMap[field.name]) {
        field.name = prefix + field.name
      }
    })
  })
  return allTypeMap
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

export default function CRUDBody({ bodyData: props }: { bodyData: CRUDBodyProps }) {
  const intl = useIntl()
  const apiOptions = useMemo(
    () => [
      { label: intl.formatMessage({ defaultMessage: '增加' }), value: API.Create },
      { label: intl.formatMessage({ defaultMessage: '删除' }), value: API.Delete },
      { label: intl.formatMessage({ defaultMessage: '更新' }), value: API.Update },
      { label: intl.formatMessage({ defaultMessage: '详情' }), value: API.Detail },
      { label: intl.formatMessage({ defaultMessage: '分页查询' }), value: API.List },
      { label: intl.formatMessage({ defaultMessage: '批量删除' }), value: API.BatchDelete },
      { label: intl.formatMessage({ defaultMessage: '查询全部' }), value: API.Export }
    ],
    [intl]
  )
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const table = Form.useWatch('table', form)
  const prefix = Form.useWatch('prefix', form)
  const { validateAPI } = useValidate()
  // 当前选择的模型
  const [model, setModel] = useImmer<DMFModel | undefined>(void 0)
  // 表单初始化数据
  const [initData, setInitData] = useState<ApiOptions>()
  // 字段列表，用于主键下拉框
  const [field, setField] = useImmer<{ value: string; label: string }[]>([])
  // 展开状态表，用于标记外键展开状态
  const [expandRowKey, setExpandRowKey] = useImmer<string[]>([])
  // 结果显示
  const [resultPanel, setResultPanel] = useState<React.ReactNode>()
  // api已存在提示内容
  const [confirmModal, setConfirmModal] = useState<React.ReactNode>()
  const [existPathFlag, setExistPathFlag] = useState<boolean>()
  // table展示哪些字段
  const [showColMap, setShowColMap] = useState<Record<string, boolean>>()
  // api提示的promise对应的resolve，用于实现对话框promise化
  const confirmResolve = useRef<(value: unknown) => void>()
  const [openMoreField, setOpenMoreField] = useState(false)
  const { data: roles } = useSWRImmutable<{ id: number; code: string; remark: string }[]>(
    '/role',
    (url: string) =>
      requests
        .get<unknown, { id: number; code: string; remark: string; full: string }[]>(url)
        .then(res => {
          res.forEach(item => {
            item.full = item.code + ' ' + item.remark
          })
          return res
        })
  )
  const apiList = useApiList()
  const dirOptions = useMemo(() => {
    const list = apiList ? [...apiList] : []
    const result: { value: string }[] = []
    while (list.length) {
      const item = list.pop()!
      if (item.isDir) {
        if (item.path.includes(prefix)) {
          result.push({ value: item.path.substring(1) })
        }
        list.push(...(item.children ?? []))
      }
    }
    return result
  }, [apiList, prefix])

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
    const typeMap = genTypeMap(props.dmf ?? '', `${props.dbName}_`)
    const createTypeMap = typeMap[`${model.name}CreateInput`]
    const updateTypeMap = {
      ...typeMap[`${model.name}UpdateInput`]
      // ...typeMap[`${model.name}WhereUniqueInput`]
    }
    const tableData: Record<string, TableAttr> = {}
    const genTableData = (fields: _DMFField[]) => {
      console.log(fields)
      fields.forEach(field => {
        if (field.children) {
          // 取消级联生成，子字段目前不做任何默认数据
          // genTableData(field.children || [])
        }
        let data
        if (field.kind === 'object') {
          data = {
            isDirectField: true,
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
            createDisableFlag: false,
            updateDisableFlag: false,
            directive: '',
            sortDirection: SortDirection.Asc
          }
        } else {
          data = {
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
            create: field.required ? KeyType.Required : KeyType.Optional,
            update: field.name === props.model?.idField ? KeyType.Hidden : KeyType.Optional,
            createDisableFlag: false,
            updateDisableFlag: false,
            directive: ''
          }
          if (field.name === props.model?.idField) {
            if (field.hasDefault) {
              data.create = KeyType.Hidden
            } else {
              data.create = KeyType.Required
            }
          } else {
            if (field.hasDefault) {
              data.create = KeyType.Hidden
            }
          }
          if (data.createType === undefined) {
            data.create = KeyType.Hidden
          }
          if (data.updateType === undefined) {
            data.update = KeyType.Hidden
          }
        }
        if (field.tableId === model.idField) {
          data.createDisableFlag = true
          data.updateDisableFlag = true
        }
        if (field.required && !field.hasDefault) {
          data.createDisableFlag = true
        }
        if (data.createType === undefined) {
          data.createDisableFlag = true
        }
        if (data.updateType === undefined) {
          data.updateDisableFlag = true
        }
        // 针对性屏蔽createAt和updateAt的更新和创建
        if (field.name === 'createdAt' || field.name === 'created_at') {
          data.createDisableFlag = true
          data.updateDisableFlag = true
          data.create = KeyType.Hidden
          data.update = KeyType.Hidden
        }
        if (field.name === 'updatedAt' || field.name === 'updated_at') {
          data.createDisableFlag = true
          data.updateDisableFlag = true
          data.create = KeyType.Required
          data.update = KeyType.Required
          data.directive = ' @injectCurrentDateTime(format: UnixDate)'
        }
        tableData[field.tableId ?? ''] = data
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
      prefix: props?.model?.name ? upperFirst(props.model.name) : '',
      alias: props?.model?.name,
      modelName: props?.model?.name,
      primaryKey: props.model.idField
    })

    onApiListChange(Object.values(API))
    setModel(model)
    setResultPanel(undefined)
  }, [props.dbName, props.dmf, props.model, props.modelList, props.relationMap])
  useEffect(() => {
    form.resetFields()
  }, [initData])

  if (!model) return null

  const onFinish = async (values: any) => {
    let apiList = buildApi(values)
    const pathList = apiList.map(item => item.path)

    const hideCheck = message.loading(intl.formatMessage({ defaultMessage: '校验中' }))
    const existPathList = await requests.get<unknown, ApiDocuments.Operation[]>('/operation', {
      params: { dataNames: JSON.stringify(pathList) }
    })
    const pathMap = keyBy(existPathList, 'path')
    hideCheck()
    const genType = await new Promise(resolve => {
      confirmResolve.current = resolve
      setExistPathFlag(!!existPathList.length)
      setConfirmModal(
        pathList.map(path => {
          return (
            <div key={path} className="flex">
              <span className="w-3/5">{path}</span>
              {pathMap[path] ? (
                <span className="text-[#f21212]">
                  <FormattedMessage defaultMessage="已存在" />
                </span>
              ) : (
                <span>
                  <FormattedMessage defaultMessage="不存在" />
                </span>
              )}
            </div>
          )
        })
      )
    })
    if (genType === 0) {
      return
    } else if (genType === 1) {
      apiList = apiList.filter(item => !pathMap[item.path])
    }
    if (apiList.length === 0) {
      return
    }
    const hide = message.loading(intl.formatMessage({ defaultMessage: '正在生成' }))

    // 处理登录鉴权
    let result
    console.log(apiList)
    try {
      result = await requests.post<unknown, void>(`/operation/batch`, {
        list: apiList
      })
    } catch (e) {
      console.error(e)
    }
    setConfirmModal(undefined)
    hide()
    void mutateApi()
    setResultPanel(
      <div className={styles.successInfo}>
        <img
          src={result ? successPic : failPic}
          alt=""
          className="m-auto mt-30 left-3 block relative"
        />
        <div className="font-500 mt-8 text-center text-default">
          {result ? (
            <FormattedMessage
              defaultMessage="本次成功生成{count}条API"
              values={{
                count: result.filter(x => !x.Code).length
              }}
            />
          ) : (
            '生成失败'
          )}
        </div>
        {result && (
          <div className="bg-[#FAFAFC] mx-auto rounded-2 mt-6 py-4 w-140">
            {result.map(row => (
              <div key={row.Path} className="flex my-2.5 pr-27 pl-21 leading-5 items-center">
                <img src={row.Code === 0 ? successIcon : failIcon} alt="" className="flex-0" />
                <span className="flex-1 text-default ml-1.5">{row.Path}</span>
                <Link
                  className="text-default ml-1.5 text-[#649FFF]"
                  to={`/workbench/apimanage/${row.Path}`}
                >
                  <FormattedMessage defaultMessage="查看" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  function onApiListChange(apis: any[]) {
    const showColMap: Record<string, boolean> = {}
    apis.forEach((api: API) => {
      let exhaustive: never
      switch (api) {
        case API.Create:
          showColMap.create = true
          break
        case API.Update:
          showColMap.update = true
          break
        case API.Detail:
          showColMap.detail = true
          break
        case API.List:
          showColMap.list = true
          showColMap.filter = true
          showColMap.sort = true
          break
        case API.Export:
          showColMap.list = true
          break
        case API.Delete:
        case API.BatchDelete:
          break
        default:
          exhaustive = api
      }
    })
    setShowColMap(showColMap)
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
      title: intl.formatMessage({ defaultMessage: '字段' }),
      dataIndex: 'name',
      render: (text: string) => (
        <Popover content={text}>
          <span>{text}</span>
        </Popover>
      )
    },
    { title: intl.formatMessage({ defaultMessage: '类型' }), dataIndex: 'type' },
    {
      title: intl.formatMessage({ defaultMessage: '列表' }),
      dataIndex: 'list',
      filterKey: 'list',
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
      title: intl.formatMessage({ defaultMessage: '详情' }),
      dataIndex: 'detail',
      filterKey: 'detail',
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
      title: intl.formatMessage({ defaultMessage: '过滤' }),
      dataIndex: 'filter',
      filterKey: 'filter',
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
      title: intl.formatMessage({ defaultMessage: '排序' }),
      dataIndex: 'sort',
      filterKey: 'sort',
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
      title: intl.formatMessage({ defaultMessage: '默认排序' }),
      dataIndex: 'sortDirection',
      filterKey: 'sort',
      render: (text: any, record: any) => {
        return (
          !record.isForeign &&
          (table?.[record.tableId]?.sort ? (
            <Select
              value={table?.[record.tableId]?.sortDirection}
              options={[
                { label: intl.formatMessage({ defaultMessage: '正序' }), value: SortDirection.Asc },
                { label: intl.formatMessage({ defaultMessage: '倒序' }), value: SortDirection.Desc }
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
      title: intl.formatMessage({ defaultMessage: '创建' }),
      dataIndex: 'create',
      filterKey: 'create',
      render: (text: any, record: any) => {
        return (
          !record.isForeign && (
            <Select
              value={table?.[record.tableId]?.create}
              // 生成时，如果是主键，必须是隐藏，如果是必填，必须是必填
              disabled={table?.[record.tableId]?.createDisableFlag}
              options={[
                { label: intl.formatMessage({ defaultMessage: '无' }), value: KeyType.Hidden },
                { label: intl.formatMessage({ defaultMessage: '选填' }), value: KeyType.Optional },
                { label: intl.formatMessage({ defaultMessage: '必填' }), value: KeyType.Required }
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
      title: intl.formatMessage({ defaultMessage: '更新' }),
      dataIndex: 'update',
      filterKey: 'update',
      render: (text: any, record: any) => {
        return (
          !record.isForeign && (
            <Select
              disabled={table?.[record.tableId]?.updateDisableFlag}
              value={table?.[record.tableId]?.update ?? 'choose'}
              options={[
                { label: intl.formatMessage({ defaultMessage: '无' }), value: KeyType.Hidden },
                { label: intl.formatMessage({ defaultMessage: '选填' }), value: KeyType.Optional },
                { label: intl.formatMessage({ defaultMessage: '必填' }), value: KeyType.Required }
              ]}
              onChange={value => {
                setTableFiled(record.tableId, 'update', value)
              }}
            />
          )
        )
      }
    }
  ].filter(column => !column.filterKey || showColMap?.[column.filterKey ?? ''])

  return (
    <div className="flex-1 px-8 pt-4 common-form overflow-y-auto">
      <Form
        labelCol={{ span: 4, xs: 5 }}
        wrapperCol={{ span: 20, xs: 19 }}
        form={form}
        onFinish={onFinish}
        initialValues={initData}
      >
        <Form.Item
          name="primaryKey"
          label={intl.formatMessage({ defaultMessage: '主键选择' })}
          rules={[
            { required: true, message: intl.formatMessage({ defaultMessage: '请选择主键' }) }
          ]}
        >
          <Select options={field} />
        </Form.Item>
        <Form.Item name="apiList" label={intl.formatMessage({ defaultMessage: '生成接口' })}>
          <Checkbox.Group onChange={onApiListChange} options={apiOptions} />
        </Form.Item>
        <Form.Item
          name="prefix"
          label={intl.formatMessage({ defaultMessage: 'API目录' })}
          rules={[
            {
              validator(_, value) {
                if (!value) {
                  return Promise.resolve()
                }
                const parts = value.split('/')
                for (let i = 0; i < parts.length; i++) {
                  const part = parts[i]
                  const err = validateAPI(part)
                  if (err) {
                    return Promise.reject(
                      new Error(intl.formatMessage({ defaultMessage: '每一级目录' }) + err)
                    )
                  }
                }
                return Promise.resolve()
              }
            }
          ]}
        >
          <AutoComplete options={dirOptions} />
        </Form.Item>
        <Form.Item
          label={
            <div
              className="cursor-pointer flex items-center"
              onClick={() => {
                setOpenMoreField(!openMoreField)
              }}
            >
              <img
                alt=""
                className="w-5"
                style={{ transform: openMoreField ? '' : 'rotate(-90deg)' }}
                src="/assets/shape-down.svg"
              />
              {intl.formatMessage({ defaultMessage: '更多设置' })}
            </div>
          }
        ></Form.Item>
        <div style={{ display: openMoreField ? 'block' : 'none' }}>
          <div className={styles.authContainer}>
            <Form.Item
              name="authApiList"
              label={intl.formatMessage({ defaultMessage: '授权接口' })}
            >
              <Checkbox.Group options={apiOptions} />
            </Form.Item>
            <Form.Item name="auth" label={intl.formatMessage({ defaultMessage: '登录鉴权' })}>
              <Radio.Group>
                <Radio value={-1}>
                  <FormattedMessage defaultMessage="默认" />
                </Radio>
                <Radio value={1}>
                  <FormattedMessage defaultMessage="开启" />
                </Radio>
                <Radio value={0}>
                  <FormattedMessage defaultMessage="关闭" />
                </Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item name="authType" wrapperCol={{ offset: 4, xs: { offset: 5 } }}>
              <Radio.Group>
                <Radio value={AuthType.RequireMatchAll}>
                  <div>
                    requireMatchAll
                    <RoleDiagram className="mt-1" rule="requireMatchAll" />
                  </div>
                </Radio>
                <Radio value={AuthType.RequireMatchAny}>
                  <div>
                    requireMatchAny
                    <RoleDiagram className="mt-1" rule="requireMatchAny" />
                  </div>
                </Radio>
                <Radio value={AuthType.DenyMatchAll}>
                  <div>
                    denyMatchAll
                    <RoleDiagram className="mt-1" rule="denyMatchAll" />
                  </div>
                </Radio>
                <Radio value={AuthType.DenyMatchAny}>
                  <div>
                    denyMatchAny
                    <RoleDiagram className="mt-1" rule="denyMatchAny" />
                  </div>
                </Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item name="roleList" wrapperCol={{ offset: 4, xs: { offset: 5 } }}>
              <Select
                className="disable-common-select"
                mode="multiple"
                showArrow
                options={roles ?? []}
                fieldNames={{ label: 'full', value: 'code' }}
                optionLabelProp="code"
              />
            </Form.Item>
          </div>
          <Form.Item
            name="alias"
            label={intl.formatMessage({ defaultMessage: '别名' })}
            rules={[
              {
                required: true,
                pattern: /^[a-zA-Z0-9_]*$/,
                message: intl.formatMessage({ defaultMessage: '请输入字母数字或下划线组合' })
              }
            ]}
          >
            <Input />
          </Form.Item>
        </div>
        <Form.Item name="table" label={intl.formatMessage({ defaultMessage: '选择字段' })}>
          <Table
            className={styles.table}
            expandable={{
              indentSize: 0,
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
              className="mr-4 btn-cancel"
              onClick={() => {
                form.resetFields()
              }}
            >
              <FormattedMessage defaultMessage="重置" />
            </Button>
            <Button className="mr-4 btn-save" htmlType="submit">
              <FormattedMessage defaultMessage="创建" />
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
      {confirmModal && (
        <Modal
          key="confirmModal"
          open={true}
          title={intl.formatMessage({ defaultMessage: '批量新建预览' })}
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
                <FormattedMessage defaultMessage="取消" />
              </Button>
              {existPathFlag && (
                <Button
                  className="btn-save"
                  onClick={() => {
                    confirmResolve.current?.(1)
                  }}
                >
                  <FormattedMessage defaultMessage="跳过已有API" />
                </Button>
              )}
              <Button
                className="btn-save"
                onClick={() => {
                  confirmResolve.current?.(2)
                }}
              >
                {existPathFlag ? (
                  <FormattedMessage defaultMessage="全部覆盖" />
                ) : (
                  <FormattedMessage defaultMessage="全部创建" />
                )}
              </Button>
            </div>
          }
        >
          {confirmModal}
        </Modal>
      )}
      {resultPanel}
    </div>
  )
}
