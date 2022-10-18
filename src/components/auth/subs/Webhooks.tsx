import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Button, Checkbox, Form, Input, Modal, Radio, Switch, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
// import { useCallback, useEffect } from 'react'
import { useImmer } from 'use-immer'

// import requests from '@/lib/fetchers'
import styles from './subs.module.less'

interface hooksProvResp {
  id: number
  key: React.Key
  name: string
  triggerEvents?: string[]
  status: string
  createTime: string
}

const data: hooksProvResp[] = [
  {
    id: 1,
    key: 1,
    name: 'Alean',
    triggerEvents: ['修改密码', '创建用户'],
    status: '正常',
    createTime: '2022-06-27 15:47:14'
  },
  {
    id: 2,
    key: 2,
    name: 'Alean',
    triggerEvents: ['修改密码', '创建用户'],
    status: '正常',
    createTime: '2022-06-27 15:47:14'
  }
]

const options = [
  { label: '修改用户密码', value: 'Apple' },
  { label: '创建用户', value: 'Pear' },
  { label: '成功验证邮箱', value: 'Orange' },
  { label: '用户被解除锁定', value: 'Apple' },
  { label: '修改用户信息', value: 'Pear' },
  { label: '删除用户', value: 'Orange' },
  { label: '用户被取消归档', value: 'Apple' },
  { label: '用户被锁定', value: 'Pear' },
  { label: '用户社交账号绑定', value: 'Orange' }
]

export default function AuthMainRole() {
  const [form] = Form.useForm()
  const [value, setValue] = useImmer('')
  const [hooksVisible, setHooksVisible] = useImmer(false)
  const [hooksData, setHooksData] = useImmer(data)

  const onFinish = (values: hooksProvResp) => {
    setHooksData(
      hooksData.concat({
        ...values,
        key: hooksData.length + 1
      })
    )
  }

  const typeChange = (value: string) => {
    setValue(value)
  }

  const columns: ColumnsType<object> = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '触发事件',
      dataIndex: 'triggerEvents',
      key: 'triggerEvents',
      render: (triggerEvents: string[]) => (
        <>
          {triggerEvents.map(item => {
            return (
              <Tag color="#FA6400" key={item}>
                {item}
              </Tag>
            )
          })}
        </>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <Switch
          checked={status == 0 ? true : false}
          className={`${styles['switch-edit-btn']}`}
          size="small"
          checkedChildren="开"
          unCheckedChildren="关"
        />
      )
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time'
    },
    {
      title: '操作',
      key: 4,
      render: _ => (
        <span
          className="pl-0 text-red-500"
          onClick={() => {
            setHooksVisible(true)
          }}
        >
          查看详情
        </span>
      )
    }
  ]

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div>
          <span className={styles['auth-head']}>
            <ExclamationCircleOutlined />
            <span className="ml-3">
              webhook允许你对用户注册、登录行为进行监听，从而对其做一些自定义处理，点此
            </span>
          </span>
          <span className="text-red-500 ml-2">了解更多</span>
        </div>
        <Button
          className="px-4 py-0 h-7.5"
          onClick={() => {
            setHooksVisible(true)
          }}
        >
          <span className="text-sm text-gray">添加</span>
        </Button>
      </div>
      <Modal
        mask={false}
        title="添加webhook"
        style={{ top: '200px' }}
        bodyStyle={{ width: '549px', height: '480px', overflow: 'auto', margin: '10px auto' }}
        width={549}
        transitionName=""
        visible={hooksVisible}
        onOk={() => setHooksVisible(false)}
        onCancel={() => setHooksVisible(false)}
        okText={
          <Button className={styles['save-btn']} onClick={() => form.submit()}>
            <span>确定</span>
          </Button>
        }
        okType="text"
        cancelText="取消"
      >
        <Form
          name="hooksList"
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          initialValues={{ remember: true }}
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          onFinish={values => void onFinish(values)}
          autoComplete="off"
          labelAlign="left"
          className={styles['dialog-form']}
        >
          <Form.Item label="名称" name="name" rules={[{ required: true, message: '输入不能为空' }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="回调链接"
            name="triggerEvents"
            rules={[{ required: true, message: '输入不能为空' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="请求数据格式"
            name="triggerEvents"
            rules={[{ required: true, message: '输入不能为空' }]}
          >
            <Radio.Group onChange={e => typeChange(e.target.value as string)} value={value}>
              <Radio value={1} className="mr-180">
                静态
              </Radio>
              <Radio value={2}>动态</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="请求密钥"
            name="triggerEvents"
            rules={[{ required: true, message: '输入不能为空' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="触发事件"
            name="triggerEvents"
            rules={[{ required: true, message: '输入不能为空' }]}
          >
            <Checkbox.Group options={options} />
          </Form.Item>
        </Form>
      </Modal>
      <div className={styles['role-container-table']}>
        {hooksData.length > 0 ? (
          <Table
            columns={columns}
            dataSource={hooksData}
            rowClassName={(record, index) => (index % 2 === 1 ? styles['role-table'] : '')}
            pagination={false}
          />
        ) : (
          <Table
            columns={columns}
            dataSource={[]}
            rowClassName={(record, index) => (index % 2 === 1 ? styles['role-table'] : '')}
            pagination={false}
          />
        )}
      </div>
    </>
  )
}
