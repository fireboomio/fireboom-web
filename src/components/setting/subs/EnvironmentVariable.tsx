/* eslint-disable react-hooks/exhaustive-deps */
import { Descriptions, Divider, Form, Input, Modal, Popconfirm, Table } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import { useEffect, useState } from 'react'
import { useImmer } from 'use-immer'

import IconFont from '@/components/iconfont'
import requests from '@/lib/fetchers'

import styles from './subs.module.less'

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

type FromValues = Record<string, number | string | boolean>

//系统变量传对象数组
export default function SettingMainEnvironmentVariable() {
  const [form] = Form.useForm()
  const [refreshFlag, setRefreshFlag] = useState<boolean>()
  const [isShowSecret, setIsShowSecret] = useImmer(false)
  const [isVariableVisible, setIsVariableVisible] = useImmer(false)
  const [isProEnvVisible, setIsProEnvVisible] = useImmer(false)
  const [disabled, setDisabled] = useImmer(true)
  const [system, setSystem] = useImmer<DataType[]>([])
  const [id, setID] = useImmer(-1)
  const [environmentConfig, setEnvironmentConfig] = useImmer<DataType[]>([])
  const [selectInfo, setSelectInfo] = useState('')

  useEffect(() => {
    void requests.get<unknown, DataType[]>('/env').then(res => {
      setEnvironmentConfig(res)
      setSystem(
        res.filter(item => {
          item.envType == 1
        })
      )
    })
  }, [refreshFlag])

  const onFinish = (values: FromValues) => {
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
  }

  const onFinishFailed = (errorInfo: unknown) => {
    console.log('Failed:', errorInfo)
  }

  const handleDeleteEnvVariable = (id: number) => {
    void requests.delete(`/env/${id}`).then(() => {
      setRefreshFlag(!refreshFlag)
    })
  }
  // 控制下边的变量值显示
  const handleToggleSecret = () => {
    setIsShowSecret(!isShowSecret)
  }
  // 控制表格里面生成环境显示
  const isCheckShow = (key: string) => key === selectInfo

  const handleToggleProEnv = (key: string) => {
    setSelectInfo(key)
    setIsProEnvVisible(!isProEnvVisible)
  }
  // 弹窗重置后显示
  const showModal = () => {
    form.resetFields()
    setIsVariableVisible(true)
  }
  // 表单item值改变回调
  const onValuesChange = () => {
    const hasErrors = form.getFieldsError().some(({ errors }) => errors.length)
    setDisabled(hasErrors)
  }

  const columns: ColumnsType<DataType> = [
    {
      title: '变量名',
      dataIndex: 'key',
      key: 'key',
      width: 200
    },
    {
      title: '开发环境',
      dataIndex: 'devEnv',
      key: 'devEnv',
      width: 200
    },
    {
      title: '生产环境',
      key: 'proEnv',
      dataIndex: 'proEnv',
      width: 200,
      render: (_, { key, proEnv }) => {
        const isThisLine = isCheckShow(key)
        return isThisLine ? (
          isProEnvVisible ? (
            <div>
              <span>{proEnv}</span>{' '}
              <IconFont
                type="icon-xiaoyanjing-chakan"
                className="ml-6"
                onClick={() => handleToggleProEnv(key)}
              />{' '}
            </div>
          ) : (
            <div>
              {' '}
              <span>**************</span>{' '}
              <IconFont
                type="icon-xiaoyanjing-yincang"
                className="ml-6"
                onClick={() => handleToggleProEnv(key)}
              />
            </div>
          )
        ) : (
          <div>
            {' '}
            <span>**************</span>{' '}
            <IconFont
              type="icon-xiaoyanjing-yincang"
              className="ml-6"
              onClick={() => handleToggleProEnv(key)}
            />
          </div>
        )
      }
    },

    {
      title: '操作',
      dataIndex: 'action',
      width: 200,
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
      )
    }
  ]

  return (
    <>
      <div className="px-8 bg-white h-full pt-7">
        <div className="flex justify-between">
          <div className="mt-0">
            <span>环境变量</span>
          </div>
          <button className={`btn-save mb-4 border-none font-14px`} onClick={showModal}>
            <span
              className="h-7"
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
          title={id === -1 ? '新增环境变量' : '修改环境变量'}
          forceRender={true}
          transitionName=""
          bodyStyle={{
            width: '549px',
            height: '200px',
            margin: '12px auto'
          }}
          open={isVariableVisible}
          onOk={() => setIsVariableVisible(false)}
          onCancel={() => setIsVariableVisible(false)}
          okButtonProps={{
            disabled: disabled
          }}
          okText={
            <span
              className={styles['save-env-btn']}
              onClick={() => {
                form.submit()
              }}
            >
              {id === -1 ? '创建' : '保存'}
            </span>
          }
          cancelText={<span className="w-10">取消</span>}
          okType="text"
        >
          <Form
            name="envList"
            form={form}
            validateTrigger={['onBlur', 'onChange']}
            className="ml-15"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 15 }}
            onFinish={values => {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              void onFinish(values)
            }}
            autoComplete="off"
            onValuesChange={onValuesChange}
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
                  message: '以字母或下划线开头，只能由数字、字母、下划线组成'
                },
                {
                  validator: (rule, value) => {
                    const index = environmentConfig.findIndex(item => item.key == value)
                    if (index != -1) {
                      return Promise.reject('名称重复')
                    } else {
                      return Promise.resolve()
                    }
                  }
                }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="开发环境"
              name="devEnv"
              rules={[
                { required: true, message: '开发环境不能为空' },
                { pattern: /^[/\w]{1,256}$/g, message: '请输入长度不大于256的非空值' }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="生产环境"
              name="proEnv"
              rules={[
                { required: true, message: '生产环境不能为空' },
                { pattern: /^[/\w]{1,256}$/g, message: '请输入长度不大于256的非空值' }
              ]}
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
          className={'mb-3 ' + styles.envTable}
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
              borderBottom: 'none'
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
