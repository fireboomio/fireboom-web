import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons'
import { Table, Button, Descriptions, Modal, Form, Input } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import { useImmer } from 'use-immer'

import styles from './setting-main.module.scss'

interface DataType {
  key: string
  name: string
  developmentenv: string
  productionenv: string
  action: string[]
}

export default function SettingMainEnvironmentVariable() {
  const [isShowSecret, setIsShowSecret] = useImmer(false)
  const [isModalVisible, setIsModalVisible] = useImmer(false)
  const handleToggleSecret = () => {
    setIsShowSecret(!isShowSecret)
  }

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }
  const onFinish = (values: any) => {
    console.log('Success:', values)
  }

  const onFinishFailed = (errorInfo: any) => {
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
      //   render: (_: any, record: Item) => {
      //     const editable = isEditing(record);
      //     return editable ? (
      //       <span>
      //         <Typography.Link onClick={() => save(record.key)} style={{ marginRight: 8 }}>
      //           Save
      //         </Typography.Link>
      //         <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
      //           <a>Cancel</a>
      //         </Popconfirm>
      //       </span>
      //     ) : (
      //       <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
      //         Edit
      //       </Typography.Link>
      //     );
    },
  ]

  const data: DataType[] = [
    {
      key: '1',
      name: 'DB_HOST',
      developmentenv: '1232314',
      productionenv: '******',
      action: ['编辑', '删除'],
    },
    {
      key: '2',
      name: 'DB_HOST2',
      developmentenv: '1232314',
      productionenv: '******',
      action: ['编辑', '删除'],
    },
    {
      key: '3',
      name: 'DB_HOST3',
      developmentenv: '1232314',
      productionenv: '******',
      action: ['编辑', '删除'],
    },
  ]

  return (
    <>
      <div>
        <div className="flex items-center justify-between border-gray border-b">
          <div>
            <span className="ml-2">环境变量</span>
          </div>
          <div className="flex justify-center items-center mb-2">
            <Button className={styles['edit-btn']} onClick={showModal}>
              <span>新建变量</span>
            </Button>
            <Modal
              title="新增环境变量"
              visible={isModalVisible}
              onOk={handleOk}
              onCancel={handleCancel}
            >
              <div className={`${styles.authSetFrom} mr-2`}>
                <Form
                  labelCol={{ span: 3 }}
                  wrapperCol={{ span: 6 }}
                  initialValues={{ remember: true }}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                >
                  <Form.Item label={<span className={styles['label-style']}>名称：</span>}>
                    <Input />
                  </Form.Item>

                  <Form.Item label={<span className={styles['label-style']}>开发环境：</span>}>
                    <Input />
                  </Form.Item>
                  <Form.Item label={<span className={styles['label-style']}>生产环境：</span>}>
                    <Input />
                  </Form.Item>
                </Form>
              </div>
            </Modal>
          </div>
        </div>
        <Table columns={columns} dataSource={data} />
        <div className="border-gray border-b">
          <div>
            <span className="ml-2">系统变量</span>
          </div>
          <Descriptions
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
            <Descriptions.Item label="App Secret">
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
