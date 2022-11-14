import { Button, Checkbox, Form, Input, Radio, Select, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import useSWR from 'swr'
import { useImmer } from 'use-immer'

import type { DMFModel } from '@/interfaces/datasource'
import { getFetcher } from '@/lib/fetchers'
import buildApi from '@/pages/workbench/apimanage/crud/buildApi'

import type { ApiOptions, TableAttr } from './interface'
import { API, AuthType, KeyType, SortDirection } from './interface'

interface CRUDBodyProps {
  model?: DMFModel
}

const apiOptions = [
  { label: '增加', value: API.Create },
  { label: '删除', value: API.Delete },
  { label: '更新', value: API.Update },
  { label: '详情', value: API.Detail },
  { label: '分页查询', value: API.List },
  { label: '批量删除', value: API.BatchDelete },
  { label: '批量导出', value: API.Export }
]

export default function CRUDBody(props: CRUDBodyProps) {
  const [form] = Form.useForm()
  const auth = Form.useWatch('auth', form)
  const table = Form.useWatch('table', form)
  const [model, setModel] = useImmer<DMFModel | undefined>(void 0)
  const [initData, setInitData] = useState<ApiOptions>()
  const [field, setField] = useImmer<{ value: string; label: string }[]>([])
  const { data: roles } = useSWR<{ id: number; code: string; remark: string }[]>(
    '/role',
    getFetcher
  )

  useEffect(() => {
    if (!props.model) {
      return
    }
    setField(props.model?.fields.map(item => ({ value: item.name, label: item.name })) || [])
    setInitData({
      apiList: Object.values(API),
      roleList: [],
      auth: true,
      authType: AuthType.RequireMatchAll,
      table: props.model.fields.reduce((acc: Record<string, TableAttr>, cur) => {
        acc[cur.name] = {
          name: cur.name,
          type: cur.type,
          sort: false,
          show: true,
          filter: false,
          sortDirection: SortDirection.Asc,
          create: KeyType.Hidden,
          update: KeyType.Hidden
        }
        return acc
      }, {}),
      prefix: props?.model?.name,
      primaryKey: props.model.idField
    })
    form.resetFields()
    setModel(props.model)
  }, [props.model])

  if (!model) return null

  const onFinish = (values: any) => {
    buildApi(values).then(() => {})
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
    { title: '字段', dataIndex: 'name' },
    { title: '类型', dataIndex: 'type' },
    {
      title: '展示',
      dataIndex: 'show',
      render: (text: any, record: any) => {
        return (
          <Checkbox
            checked={table?.[record.name]?.show}
            onChange={e => {
              setTableFiled(record.name, 'show', e.target.checked)
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
            value={table?.[record.name]?.update ?? 'choose'}
            options={[
              { label: '无', value: 'none' },
              { label: '选填', value: 'choose' },
              { label: '必填', value: 'required' }
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
      </Form>
    </div>
  )
}
