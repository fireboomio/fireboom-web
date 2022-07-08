import { EyeFilled, EyeInvisibleFilled, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { Table, Button, Descriptions, Modal, Form, Input } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import { useImmer } from 'use-immer'

import styles from './setting-main.module.scss'

interface DataType {
  key: number
  name: string
  developmentenv?: string
  productionenv?: string
}

const data: DataType[] = [
  {
    key: 1,
    name: 'DB_HOST',
    developmentenv: '1232314',
    productionenv: '******',
  },
  {
    key: 2,
    name: 'DB_HOST2',
    developmentenv: '1232314',
    productionenv: '******',
  },
  {
    key: 3,
    name: 'DB_HOST3',
    developmentenv: '1232314',
    productionenv: '******',
  },
]

export default function SettingMainEnvironmentVariable() {
  const [form] = Form.useForm()
  const [isShowSecret, setIsShowSecret] = useImmer(false)
  const [isVariableVisible, setIsVariableVisible] = useImmer(false)
  const [variableData, setVariableData] = useImmer(data)

  const onFinish = (values: DataType) => {
    setVariableData(
      variableData.concat({
        key: variableData.length + 1,
        name: values.name,
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
      dataIndex: 'developmentenv',
      key: 'development-env',
    },
    {
      title: '生产环境',
      key: 'productionenv',
      render: (_, { developmentenv }) => <span>{developmentenv}</span>,
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
                  <span>保存</span>
                </Button>
              }
              cancelText="取消"
              okType="text"
            >
              <div className={`${styles.authSetFrom} mr-2`}>
                <Form
                  className="ml-15"
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 15 }}
                  initialValues={{ remember: true }}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                  labelAlign="left"
                  colon={false}
                >
                  <Form.Item label={<span className={styles['label-style']}>名称:</span>}>
                    <Input />
                  </Form.Item>

                  <Form.Item label={<span className={styles['label-style']}>开发环境:</span>}>
                    <Input />
                  </Form.Item>
                  <Form.Item label={<span className={styles['label-style']}>生产环境:</span>}>
                    <Input />
                  </Form.Item>
                </Form>
              </div>
            </Modal>
          </div>
        </div>
        <Table columns={columns} dataSource={data} pagination={false} className="mb-3 " />
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
