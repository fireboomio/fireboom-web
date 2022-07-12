import { EyeFilled, EyeInvisibleFilled, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { Table, Button, Descriptions, Modal, Form, Input } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import axios from 'axios'
import { useEffect } from 'react'
import { useImmer } from 'use-immer'

import styles from './setting-main.module.scss'

interface DataType {
  key: number
  name: string
  devEnv?: string
  proEnv?: string
}

const data: DataType[] = [
  {
    key: 1,
    name: 'DB_HOST',
    devEnv: '1232314',
    proEnv: '******',
  },
  {
    key: 2,
    name: 'DB_HOST2',
    devEnv: '1232314',
    proEnv: '******',
  },
  {
    key: 3,
    name: 'DB_HOST3',
    devEnv: '1232314',
    proEnv: '******',
  },
]

export default function SettingMainEnvironmentVariable() {
  const [form] = Form.useForm()
  const [isShowSecret, setIsShowSecret] = useImmer(false)
  const [isVariableVisible, setIsVariableVisible] = useImmer(false)
  const [variableData, setVariableData] = useImmer(data)

  useEffect(() => {
    void axios.get('/api/v1/setting/environmentConfig')
  }, [])

  const onFinish = (values: DataType) => {
    setVariableData(
      variableData.concat({
        ...values,
        key: variableData.length + 1,
      })
    )
    console.log('Success:', values)
  }

  // const handleEditVariable = (key: number) => {
  //   setVariableData(
  //     variableData.filter((row) => {
  //       return row.key !== key
  //     })
  //   )
  // }

  const handleDeleteVariable = (key: number) => {
    setVariableData(
      variableData.filter((row) => {
        return row.key !== key
      })
    )
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
      dataIndex: 'devEnv',
      key: 'devEnv',
    },
    {
      title: '生产环境',
      key: 'proEnv',
      dataIndex: 'proEnv',
      render: (_, { devEnv }) => <span>{devEnv}</span>,
    },

    {
      title: '操作',
      dataIndex: 'action',
      render: (_, { key }) => (
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
              handleDeleteVariable(key)
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
                <Button
                  className={styles['save-btn']}
                  onClick={() => {
                    form.submit()
                  }}
                >
                  <div>保存</div>
                </Button>
              }
              cancelText="取消"
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
                <Form.Item label="开发环境" name="devEnv">
                  <Input />
                </Form.Item>
                <Form.Item label="生产环境" name="proEnv">
                  <Input />
                </Form.Item>
              </Form>
            </Modal>
          </div>
        </div>
        <Table columns={columns} dataSource={variableData} pagination={false} className="mb-3 " />
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
