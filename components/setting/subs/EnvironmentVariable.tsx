/* eslint-disable react-hooks/exhaustive-deps */
import { Table, Button, Descriptions, Modal, Form, Input, Divider } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import { useEffect, useState } from 'react'
import { useImmer } from 'use-immer'

import IconFont from '@/components/iconfont'
import requests from '@/lib/fetchers'

import styles from './subs.module.scss'

interface DataType {
  name: string
  dev?: string
  pro?: string
}
interface EnvironmentConfig {
  environmentList: Array<DataType>
  systemVariable: string
}
//系统变量传对象数组
export default function SettingMainEnvironmentVariable() {
  const [form] = Form.useForm()
  const [isShowSecret, setIsShowSecret] = useImmer(false)
  const [isVariableVisible, setIsVariableVisible] = useImmer(false)
  const [environmentConfig, setEnvironmentConfig] = useImmer({} as EnvironmentConfig)
  const [refreshFlag, setRefreshFlag] = useState<boolean>()

  useEffect(() => {
    void requests.get<unknown, EnvironmentConfig>('/setting/environmentConfig').then(res => {
      setEnvironmentConfig(res)
    })
  }, [refreshFlag])

  const onFinish = (values: DataType) => {
    setEnvironmentConfig(draft => {
      const newEnvList = draft.environmentList?.concat(values)
      void requests.post('/setting', { key: 'environmentList', val: newEnvList }).then(() => {
        setRefreshFlag(!refreshFlag)
      })
    })
    form.setFieldsValue({ name: '', dev: '', pro: '' })
  }

  const handleDeleteEnvVariable = (name: string) => {
    setEnvironmentConfig(draft => {
      const newEnvList = draft.environmentList.filter(item => item.name != name)
      void requests.post('/setting', { key: 'environmentList', val: newEnvList }).then(() => {
        setRefreshFlag(!refreshFlag)
      })
    })
  }

  const handleToggleSecret = () => {
    setIsShowSecret(!isShowSecret)
  }

  const showModal = () => {
    setIsVariableVisible(true)
  }

  const onFinishFailed = (errorInfo: unknown) => {
    console.log('Failed:', errorInfo)
  }

  const columns: ColumnsType<DataType> = [
    {
      title: '变量名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '开发环境',
      dataIndex: 'dev',
      key: 'dev',
    },
    {
      title: '生产环境',
      key: 'pro',
      dataIndex: 'pro',
      render: (_, { pro }) => <span>{pro}</span>,
    },

    {
      title: '操作',
      dataIndex: 'action',
      render: (_, { name, dev, pro }) => (
        <div>
          <IconFont
            type="icon-zhongmingming"
            onClick={() => {
              setIsVariableVisible(true)
              form.setFieldsValue({ name, dev, pro })
            }}
            className="mr-3"
          />
          <IconFont
            type="icon-shanchu"
            onClick={() => {
              handleDeleteEnvVariable(name)
            }}
          />
        </div>
      ),
    },
  ]

  return (
    <>
      <div>
        <Divider className={styles['divider-line']} />
        <div className="flex items-center justify-between border-gray border-b">
          <div>
            <span>环境变量</span>
          </div>
          <Button className={`${styles['save-btn']}  mb-4 mt-4`} onClick={showModal}>
            <span
              className="h-7.5"
              onClick={() => {
                setIsVariableVisible(true)
              }}
            >
              新建变量
            </span>
          </Button>
          <Modal
            title="新增环境变量"
            bodyStyle={{
              width: '549px',
              height: '200px',
              margin: '10px auto',
            }}
            visible={isVariableVisible}
            onOk={() => setIsVariableVisible(false)}
            onCancel={() => setIsVariableVisible(false)}
            okText={
              <div
                className={styles['save-env-btn']}
                onClick={() => {
                  form.submit()
                }}
              >
                <span>保存</span>
              </div>
            }
            cancelText={<span className="w-10">取消</span>}
            okType="text"
          >
            <Form
              form={form}
              className="ml-15"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 15 }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              labelAlign="left"
            >
              <Form.Item label="名称" name="name">
                <Input />
              </Form.Item>
              <Form.Item label="开发环境" name="dev">
                <Input />
              </Form.Item>
              <Form.Item label="生产环境" name="pro">
                <Input />
              </Form.Item>
            </Form>
          </Modal>
        </div>
        <Table
          columns={columns}
          dataSource={environmentConfig.environmentList}
          rowKey={record => record.name}
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
            <Descriptions.Item label="FIREBOOM_ADMINZ_SECR">
              <span onClick={handleToggleSecret}>
                {isShowSecret ? (
                  <div>
                    {environmentConfig.systemVariable}
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
