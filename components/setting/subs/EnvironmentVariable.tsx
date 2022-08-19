/* eslint-disable react-hooks/exhaustive-deps */
import { Table, Descriptions, Modal, Form, Input, Divider, Popconfirm } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import { useEffect, useState } from 'react'
import { useImmer } from 'use-immer'

import IconFont from '@/components/iconfont'
import requests from '@/lib/fetchers'

import styles from './subs.module.scss'

interface DataType {
  createTime: string
  envType: number
  id: number
  isDel: number
  updateTime: string
  key: string
  devEnv?: string
  proEnv?: string
}

//系统变量传对象数组
export default function SettingMainEnvironmentVariable() {
  const [form] = Form.useForm()
  const [refreshFlag, setRefreshFlag] = useState<boolean>()
  const [isShowSecret, setIsShowSecret] = useImmer(false)
  const [isVariableVisible, setIsVariableVisible] = useImmer(false)
  const [isProEnvVisible, setIsProEnvVisible] = useImmer(false)
  const [system, setSystem] = useImmer<DataType[]>([])
  const [id, setID] = useImmer(-1)
  const [environmentConfig, setEnvironmentConfig] = useImmer<DataType[]>([])
  const envReg =
    // eslint-disable-next-line no-useless-escape
    /^jdbc:(microsoft:)?sqlserver:\/\/((25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)):(([1-9]([0-9]{0,3}))|([1-6][0-5][0-5][0-3][0-5]))(;[ \d\w\/=\?%\-&_~`@[\]\':+!]*)?$/

  useEffect(() => {
    void requests.get<unknown, DataType[]>('/env').then(res => {
      console.log(res)
      setEnvironmentConfig(res)
      setSystem(
        res.filter(item => {
          item.envType == 1
        })
      )
    })
  }, [refreshFlag])
  const onFinish = (values: DataType) => {
    console.log('id', id)
    if (id == -1) {
      void requests.post('/env', values).then(() => {
        setRefreshFlag(!refreshFlag)
      })
    } else {
      const newValues = { ...values, id }
      void requests.put('/env', newValues).then(() => {
        setRefreshFlag(!refreshFlag)
      })
    }
    console.log('onFinish', values)
  }

  const onFinishFailed = (errorInfo: unknown) => {
    console.log('Failed:', errorInfo)
  }

  const handleDeleteEnvVariable = (id: number) => {
    void requests.delete(`/env/${id}`).then(() => {
      setRefreshFlag(!refreshFlag)
    })
  }

  const handleToggleSecret = () => {
    setIsShowSecret(!isShowSecret)
  }

  const handleToggleProEnv = () => {
    setIsProEnvVisible(!isProEnvVisible)
  }

  const showModal = () => {
    setIsVariableVisible(true)
  }

  const columns: ColumnsType<DataType> = [
    {
      title: '变量名',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: '开发环境',
      dataIndex: 'devEnv',
      key: 'devEnv',
    },
    {
      title: '生产环境',
      key: 'proEnv',
      dataIndex: 'proEnv',
      render: (_, { proEnv }) => {
        return isProEnvVisible ? (
          <div>
            <span>{proEnv}</span>{' '}
            <IconFont
              type="icon-xiaoyanjing-chakan"
              className="ml-6"
              onClick={handleToggleProEnv}
            />{' '}
          </div>
        ) : (
          <div>
            {' '}
            <span>**************</span>{' '}
            <IconFont
              type="icon-xiaoyanjing-yincang"
              className="ml-6"
              onClick={handleToggleProEnv}
            />
          </div>
        )
      },
    },

    {
      title: '操作',
      dataIndex: 'action',
      render: (_, { id, key, devEnv, proEnv }) => (
        <div>
          <IconFont
            type="icon-zhongmingming"
            onClick={() => {
              setIsVariableVisible(true)
              form.setFieldsValue({ key, devEnv, proEnv })
              setID(id)
            }}
            className="mr-3"
          />
          <Popconfirm
            title="确定要删除?"
            okText="确定"
            cancelText="取消"
            onConfirm={e => {
              // @ts-ignore
              e.stopPropagation()
              handleDeleteEnvVariable(id)
            }}
            onCancel={e => {
              // @ts-ignore
              e.stopPropagation()
            }}
          >
            <IconFont type="icon-shanchu" onClick={e => e.stopPropagation()} />
          </Popconfirm>
        </div>
      ),
    },
  ]

  return (
    <>
      <div>
        <Divider className={styles['divider-line']} />
        <div className="flex justify-between border-gray border-b">
          <div className="mt-0">
            <span>环境变量</span>
          </div>
          <button className={`${styles['save-btn']} mb-4`} onClick={showModal}>
            <span
              className="h-7.5"
              onClick={() => {
                form.setFieldsValue({ key: '', devEnv: '', proEnv: '' })
                setIsVariableVisible(true)
                setID(-1)
              }}
            >
              新建变量
            </span>
          </button>
        </div>
        <Modal
          mask={false}
          title="新增环境变量"
          forceRender={true}
          transitionName=""
          bodyStyle={{
            width: '549px',
            height: '200px',
            margin: '10px auto',
          }}
          visible={isVariableVisible}
          onOk={() => setIsVariableVisible(false)}
          onCancel={() => setIsVariableVisible(false)}
          okText={
            <span
              className={styles['save-env-btn']}
              onClick={() => {
                form.submit()
              }}
            >
              <span>保存</span>
            </span>
          }
          cancelText={<span className="w-10">取消</span>}
          okType="text"
        >
          <Form
            name="envList"
            form={form}
            className="ml-15"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 15 }}
            onFinish={values => {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              void onFinish(values)
            }}
            autoComplete="off"
            onFinishFailed={onFinishFailed}
            labelAlign="left"
          >
            <Form.Item
              label="名称"
              name="key"
              rules={[
                { required: true, message: '名称不能为空' },
                {
                  pattern: new RegExp('^[a-zA-Z_][a-zA-Z0-9_]*$', 'g'),
                  message: '名称只有由数字、字母、下划线组成',
                },
                {
                  validator: (rule, value) => {
                    const index = environmentConfig.findIndex(item => item.key == value)
                    if (index != -1) {
                      return Promise.reject('名称重复')
                    } else {
                      return Promise.resolve()
                    }
                  },
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="开发环境"
              name="devEnv"
              rules={[{ pattern: envReg, message: '请输入正确的格式' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="生产环境"
              name="proEnv"
              rules={[{ pattern: envReg, message: '请输入正确的格式' }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
        <Table
          columns={columns}
          dataSource={environmentConfig}
          rowKey={record => record.key}
          pagination={false}
          className="mb-3 "
        />
        <div className="border-gray border-b">
          <div>
            <span>系统变量</span>
          </div>
          <Descriptions
            className="mt-3"
            bordered
            column={1}
            size="small"
            labelStyle={{
              color: '#5F6269',
              backgroundColor: 'white',
              width: '30%',
              borderRight: 'none',
              borderBottom: 'none',
            }}
          >
            <Descriptions.Item label={system[0]?.key ? system[0]?.key : 'FIREBOOM_ADMINZ_SECR'}>
              <span onClick={handleToggleSecret}>
                {isShowSecret ? (
                  <div>
                    {system[0]?.devEnv}
                    <IconFont type="icon-xiaoyanjing-chakan" className="ml-6" />
                  </div>
                ) : (
                  <div>
                    <span>**************</span>
                    <IconFont type="icon-xiaoyanjing-yincang" className="ml-6" />
                  </div>
                )}
              </span>
            </Descriptions.Item>
          </Descriptions>
        </div>
      </div>
    </>
  )
}
