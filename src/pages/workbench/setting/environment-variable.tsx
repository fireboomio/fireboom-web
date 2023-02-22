/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Input, Modal, Popconfirm, Table } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import { useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useImmer } from 'use-immer'

import requests from '@/lib/fetchers'

import styles from './components/subs/subs.module.less'

interface DataType {
  createTime: string
  envType: number
  id: number
  deleteTime: string
  updateTime: string
  key: string
  oldKey?: string
  devEnv?: string
  proEnv?: string
}

type FromValues = Record<string, number | string | boolean>

//系统变量传对象数组
export default function SettingMainEnvironmentVariable() {
  const intl = useIntl()
  const [form] = Form.useForm()
  const [refreshFlag, setRefreshFlag] = useState<boolean>()
  const [isShowSecret, setIsShowSecret] = useImmer(false)
  const [showMap, setShowMap] = useImmer<Record<string, boolean>>({})
  const [isVariableVisible, setIsVariableVisible] = useImmer(false)
  const [isProEnvVisible, setIsProEnvVisible] = useImmer(false)
  const [disabled, setDisabled] = useImmer(true)
  const [system, setSystem] = useImmer<DataType[]>([])
  const [id, setID] = useImmer(-1)
  const [environmentConfig, setEnvironmentConfig] = useImmer<DataType[]>([])
  const [selectInfo, setSelectInfo] = useState('')

  useEffect(() => {
    void requests.get<unknown, DataType[]>('/env').then(res => {
      res.forEach(item => {
        item.oldKey = item.key
      })
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
        setIsVariableVisible(false)
      })
    } else {
      const newValues = { ...values, id }
      void requests.put('/env', newValues).then(() => {
        setRefreshFlag(!refreshFlag)
        setIsVariableVisible(false)
      })
    }
  }

  const onFinishFailed = (errorInfo: unknown) => {
    console.log('Failed:', errorInfo)
  }

  const handleDeleteEnvVariable = (key: string) => {
    void requests.delete(`/env/${key}`).then(() => {
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
      title: intl.formatMessage({ defaultMessage: '变量名' }),
      dataIndex: 'key',
      key: 'key',
      width: 320
    },
    {
      title: intl.formatMessage({ defaultMessage: '变量值' }),
      dataIndex: 'devEnv',
      key: 'devEnv',
      render: (text, record) => {
        console.log(record)
        return (
          <span
            onClick={() =>
              setShowMap(showMap => {
                showMap[record.key] = !showMap[record.key]
              })
            }
          >
            {showMap[record.key] ? (
              <div>
                {text}
                <img
                  alt="xiaoyanjing-chakan"
                  src="assets/iconfont/xiaoyanjing-chakan.svg"
                  style={{ height: '1em', width: '1em' }}
                  className="ml-6"
                />
              </div>
            ) : (
              <div>
                <span>**************</span>
                <img
                  alt="xiaoyanjing-yincang"
                  src="assets/iconfont/xiaoyanjing-yincang.svg"
                  style={{ height: '1em', width: '1em' }}
                  className="ml-6"
                />
              </div>
            )}
          </span>
        )
      }
    },
    {
      title: intl.formatMessage({ defaultMessage: '操作' }),
      dataIndex: 'action',
      width: 200,
      render: (_, { id, key, devEnv, proEnv, oldKey }) => (
        <div>
          <img
            alt="zhongmingming"
            src="assets/iconfont/zhongmingming.svg"
            style={{ height: '1em', width: '1em' }}
            onClick={() => {
              setIsVariableVisible(true)
              form.setFieldsValue({ key, devEnv, proEnv, oldKey })
              setID(id)
            }}
            className="mr-3"
          />
          <Popconfirm
            title={intl.formatMessage({ defaultMessage: '确定要删除?' })}
            okText={intl.formatMessage({ defaultMessage: '确定' })}
            cancelText={intl.formatMessage({ defaultMessage: '取消' })}
            onConfirm={e => {
              // @ts-ignore
              e.stopPropagation()
              handleDeleteEnvVariable(key)
            }}
            onCancel={e => {
              // @ts-ignore
              e.stopPropagation()
            }}
          >
            <img
              alt="shanchu"
              src="assets/iconfont/shanchu.svg"
              style={{ height: '1em', width: '1em' }}
              onClick={e => e.stopPropagation()}
            />
          </Popconfirm>
        </div>
      )
    }
  ]

  return (
    <>
      <div className="bg-white h-full px-8 pt-7">
        <div className="flex justify-between">
          <div className="mt-0">
            <span>
              <FormattedMessage defaultMessage="环境变量" />
            </span>
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
              <FormattedMessage defaultMessage="新建环境变量" />
            </span>
          </button>
        </div>
        <Modal
          mask={false}
          title={
            id === -1
              ? intl.formatMessage({ defaultMessage: '新建变量' })
              : intl.formatMessage({ defaultMessage: '修改环境变量' })
          }
          forceRender={true}
          transitionName=""
          bodyStyle={{
            width: '549px',
            height: '150px',
            margin: '12px auto'
          }}
          open={isVariableVisible}
          onCancel={() => setIsVariableVisible(false)}
          okText={
            <span
              className={styles['save-env-btn']}
              onClick={() => {
                form.submit()
              }}
            >
              {id === -1
                ? intl.formatMessage({ defaultMessage: '创建' })
                : intl.formatMessage({ defaultMessage: '保存' })}
            </span>
          }
          cancelText={
            <span className="w-10">{intl.formatMessage({ defaultMessage: '取消' })} </span>
          }
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
              label={intl.formatMessage({ defaultMessage: '名称' })}
              name="key"
              rules={[
                { required: true, message: intl.formatMessage({ defaultMessage: '名称不能为空' }) },
                {
                  pattern: new RegExp('^[a-zA-Z_][a-zA-Z0-9_]*$', 'g'),
                  message: intl.formatMessage({
                    defaultMessage: '以字母或下划线开头，只能由数字、字母、下划线组成'
                  })
                },
                {
                  validator: (rule, value) => {
                    if (value === form.getFieldValue('oldKey')) {
                      return Promise.resolve()
                    }
                    const existItem = environmentConfig.find(item => item.key == value)
                    if (existItem) {
                      return Promise.reject(intl.formatMessage({ defaultMessage: '名称重复' }))
                    } else {
                      return Promise.resolve()
                    }
                  }
                }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="oldKey" hidden></Form.Item>
            <Form.Item
              label={intl.formatMessage({ defaultMessage: '值' })}
              name="devEnv"
              rules={[
                {
                  required: true,
                  pattern: /^.{1,256}$/g,
                  message: intl.formatMessage({ defaultMessage: '请输入长度不大于256的非空值' })
                }
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
      </div>
    </>
  )
}
