import { Button, Checkbox, Form, Input, message, Modal, Radio, Select, Table } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import useSWR from 'swr'
import { useImmer } from 'use-immer'

import type { DMFField, DMFModel } from '@/interfaces/datasource'
import { WorkbenchContext } from '@/lib/context/workbenchContext'
import requests, { getFetcher } from '@/lib/fetchers'
import buildApi from '@/pages/workbench/apimanage/crud/buildApi'

import type { ApiOptions, TableAttr } from './interface'
import { API, AuthType, KeyType, SortDirection } from './interface'

interface CRUDBodyProps {
  model?: DMFModel
  modelList?: DMFModel[]
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
  const [expandMap, setExpandMap] = useImmer<Record<string, boolean>>({})
  const { data: roles } = useSWR<{ id: number; code: string; remark: string }[]>(
    '/role',
    getFetcher
  )
  const { onRefreshMenu } = useContext(WorkbenchContext)

  useEffect(() => {
    if (!props.model) {
      return
    }
    setField(props.model?.fields.map(item => ({ value: item.name, label: item.name })) || [])
    setInitData({
      dbName: props.dbName,
      apiList: Object.values(API),
      roleList: [],
      auth: true,
      authType: AuthType.RequireMatchAll,
      table: props.model.fields.reduce((acc: Record<string, TableAttr>, cur) => {
        acc[cur.name] = {
          name: cur.name,
          type: cur.type,
          sort: false,
          detail: true,
          list: true,
          filter: true,
          sortDirection: SortDirection.Asc,
          create:
            cur.name === props.model?.idField
              ? KeyType.Hidden
              : cur.required
              ? KeyType.Required
              : KeyType.Optional,
          update: cur.name === props.model?.idField ? KeyType.Hidden : KeyType.Optional
        }
        return acc
      }, {}),
      prefix: props?.model?.name,
      primaryKey: props.model.idField
    })
    setModel(props.model)
  }, [props.model])
  useEffect(() => {
    form.resetFields()
  }, [initData])

  if (!model) return null

  const onFinish = async (values: any) => {
    console.log(values)
    const apiList = buildApi(values)
    const pathList = apiList.map(item => item.path)

    const hideCheck = message.loading('校验中')
    // TODO 校验API是否重复
    const existPathList = pathList
    hideCheck()
    if (existPathList.length) {
      const confirmFlag = await new Promise(resolve => {
        Modal.confirm({
          title: '检测到以下API已存在，是否覆盖？',
          content: existPathList.map(item => <div key={item}>{item}</div>),
          onOk: () => {
            // TODO 生成API
            resolve(true)
          },
          onCancel: () => {
            resolve(false)
          },
          okText: '确认生成',
          cancelText: '取消'
        })
      })
      if (!confirmFlag) {
        return false
      }
    }
    const hide = message.loading('正在生成')

    const results: boolean[] = await Promise.all(
      apiList.map(item => {
        return requests
          .post<unknown, { id: number }>('/operateApi', {
            path: item.path,
            content: item.content
          })
          .then(() => {
            return true
          })
          .catch(e => {
            console.log(e)
            return false
          })
      })
    )
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
            checked={table?.[record.name]?.list}
            onChange={e => {
              setTableFiled(record.name, 'list', e.target.checked)
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
            checked={table?.[record.name]?.detail}
            onChange={e => {
              setTableFiled(record.name, 'detail', e.target.checked)
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
          <Checkbox
            checked={table?.[record.name]?.filter}
            onChange={e => {
              setTableFiled(record.name, 'filter', e.target.checked)
            }}
          />
        )
      }
    },
    {
      title: '排序',
      dataIndex: 'sort',
      render: (text: any, record: any) => {
        return (
          <Checkbox
            checked={table?.[record.name]?.sort}
            onChange={e => {
              setTableFiled(record.name, 'sort', e.target.checked)
            }}
          />
        )
      }
    },
    {
      title: '默认排序',
      dataIndex: 'sortDirection',
      render: (text: any, record: any) => {
        return table?.[record.name]?.sort ? (
          <Select
            value={table?.[record.name]?.sortDirection}
            options={[
              { label: '正序', value: SortDirection.Asc },
              { label: '倒序', value: SortDirection.Desc }
            ]}
            onChange={value => {
              setTableFiled(record.name, 'sortDirection', value)
            }}
          />
        ) : (
          '-'
        )
      }
    },
    {
      title: '创建',
      dataIndex: 'create',
      render: (text: any, record: any) => {
        return (
          <Select
            value={table?.[record.name]?.create}
            // 生成时，如果是主键，必须是隐藏，如果是必填，必须是必填
            disabled={record.name === model.idField || record.required}
            options={[
              { label: '无', value: KeyType.Hidden },
              { label: '选填', value: KeyType.Optional },
              { label: '必填', value: KeyType.Required }
            ]}
            onChange={value => {
              setTableFiled(record.name, 'create', value)
            }}
          />
        )
      }
    },
    {
      title: '更新',
      dataIndex: 'update',
      render: (text: any, record: any) => {
        return (
          <Select
            disabled={record.name === model.idField}
            value={table?.[record.name]?.update ?? 'choose'}
            options={[
              { label: '无', value: KeyType.Hidden },
              { label: '选填', value: KeyType.Optional },
              { label: '必填', value: KeyType.Required }
            ]}
            onChange={value => {
              setTableFiled(record.name, 'update', value)
            }}
          />
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
        <Form.Item name="primaryKey" label="主键选择" rules={[{ required: true }]}>
          <Select options={field} />
        </Form.Item>
        <Form.Item name="apiList" label="生成接口">
          <Checkbox.Group options={apiOptions} />
        </Form.Item>
        <Form.Item name="auth" label="登录鉴权">
          <Radio.Group>
            <Radio value={true}>开启</Radio>
            <Radio value={false}>关闭</Radio>
          </Radio.Group>
        </Form.Item>
        {auth ? (
          <>
            <Form.Item name="authType" label="登录鉴权">
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
                options={roles ?? []}
                fieldNames={{ label: 'remark', value: 'code' }}
              />
            </Form.Item>
          </>
        ) : null}
        <Form.Item name="prefix" label="API前缀" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="table"
          wrapperCol={{ offset: 4, xs: { offset: 5 } }}
          rules={[{ required: true }]}
        >
          <Table rowKey="id" dataSource={model.fields} columns={columns} pagination={false} />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 4, xs: { offset: 5 } }} rules={[{ required: true }]}>
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
      </Form>
    </div>
  )
}
