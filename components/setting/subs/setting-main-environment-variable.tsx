import { EyeFilled, EyeInvisibleFilled, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { Table, Button, Descriptions, Modal, Form, Input } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import { useCallback, useEffect } from 'react'
import { useImmer } from 'use-immer'

import requests from '@/lib/fetchers'

import styles from './setting-main.module.scss'

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

  const getData = useCallback(async () => {
    const result = await requests.get<unknown, EnvironmentConfig>('/setting/environmentConfig')
    setEnvironmentConfig(result)
  }, [])

  useEffect(() => {
    void getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onFinish = (values: DataType) => {
    setEnvironmentConfig((draft) => {
      const newEnvList = draft.environmentList.concat(values)
      void requests.post('/setting', { key: 'environmentList', val: newEnvList })
      draft.environmentList.push(values)
    })
    console.log('Success:', values)
  }

  // const handleEditVariable = (key: number) => {
  //   setVariableData(
  //     variableData.filter((row) => {
  //       return row.key !== key
  //     })
  //   )
  // }

  const handleDeleteEnvVariable = (name: string) => {
    setEnvironmentConfig((draft) => {
      const newEnvList = draft.environmentList.filter((item) => item.name != name)
      const result = requests.post('/setting', { key: 'environmentList', val: newEnvList })
      console.log(result)
      draft.environmentList = draft.environmentList.filter((item) => item.name != name)
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
      render: (_, { name }) => (
        <div>
          <EditOutlined
            onClick={() => {
              // handleEditVariable(key)
              console.log('Success:')
            }}
            className="mr-3"
          />
          <DeleteOutlined
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
        <div className="flex items-center justify-between border-gray border-b">
          <div>
            <span>环境变量</span>
          </div>
          <div>
            <Button
              className={`${styles['variable-btn']} flex justify-center items-center mb-3`}
              onClick={showModal}
            >
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
        </div>
        <Table
          columns={columns}
          dataSource={environmentConfig.environmentList}
          rowKey={(record) => record.name}
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
                    1234566
                    <EyeFilled className="ml-6" />
                  </div>
                ) : (
                  <div>
                    *****************************
                    <EyeInvisibleFilled className="ml-6" />
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
