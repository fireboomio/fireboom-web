/* eslint-disable react-hooks/exhaustive-deps */
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons'
import { AutoComplete, Button, Form, Input, Modal, Popconfirm, Table } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useImmer } from 'use-immer'

import type { EnvData } from '@/providers/env'
import { useEnv } from '@/providers/env'

import styles from './components/subs/subs.module.less'

//系统变量传对象数组
export default function SettingMainEnvironmentVariable() {
  const intl = useIntl()
  const [form] = Form.useForm()
  const {
    computed: { asArray: envs },
    updateEnv,
    deleteEnv
  } = useEnv()
  const [showMap, setShowMap] = useImmer<Record<string, boolean>>({})
  const [editingEnv, setEditingEnv] = useState<EnvData | undefined>()

  const onFinishFailed = (errorInfo: unknown) => {
    console.log('Failed:', errorInfo)
  }

  // 弹窗重置后显示
  const showModal = () => {
    form.resetFields()
    setEditingEnv({ key: '', value: '' })
  }
  const columns: ColumnsType<EnvData> = [
    {
      title: intl.formatMessage({ defaultMessage: '变量名' }),
      dataIndex: 'key',
      key: 'key',
      width: 320
    },
    {
      title: intl.formatMessage({ defaultMessage: '变量值' }),
      dataIndex: 'value',
      key: 'value',
      render: (text, record) => {
        const toggle = () =>
          setShowMap(showMap => {
            showMap[record.key] = !showMap[record.key]
          })
        return (
          <div className="flex items-center">
            {showMap[record.key] ? (
              <>
                <span>{text}</span>
                <EyeOutlined onClick={toggle} className="ml-4" />
              </>
            ) : (
              <>
                <span>***********</span>
                <EyeInvisibleOutlined onClick={toggle} className="ml-4" />
              </>
            )}
          </div>
        )
      }
    },
    {
      title: intl.formatMessage({ defaultMessage: '操作' }),
      dataIndex: 'action',
      width: 200,
      render: (_, row) => (
        <div>
          <img
            alt="zhongmingming"
            src={`${import.meta.env.BASE_URL}assets/iconfont/zhongmingming.svg`}
            style={{ height: '1em', width: '1em' }}
            onClick={() => {
              setEditingEnv(row)
              form.setFieldsValue(row)
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
              deleteEnv(row.key)
            }}
            onCancel={e => {
              // @ts-ignore
              e.stopPropagation()
            }}
          >
            <img
              alt="shanchu"
              src={`${import.meta.env.BASE_URL}assets/iconfont/shanchu.svg`}
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
          <Button className="mb-2mb-2" type="default" onClick={showModal}>
            <span className="h-7">
              <FormattedMessage defaultMessage="新建环境变量" />
            </span>
          </Button>
        </div>
        <Modal
          mask={false}
          title={
            editingEnv?.key
              ? intl.formatMessage({ defaultMessage: '修改环境变量' })
              : intl.formatMessage({ defaultMessage: '新建变量' })
          }
          forceRender={true}
          transitionName=""
          bodyStyle={{
            width: '549px',
            margin: '32px auto 48px'
          }}
          open={!!editingEnv}
          onCancel={() => setEditingEnv(undefined)}
          okText={
            <span
              className={styles['save-env-btn']}
              onClick={() => {
                form.submit()
              }}
            >
              {editingEnv?.key
                ? intl.formatMessage({ defaultMessage: '保存' })
                : intl.formatMessage({ defaultMessage: '创建' })}
            </span>
          }
          okButtonProps={{
            style: {
              background: 'none'
            }
          }}
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
            onFinish={async values => {
              await updateEnv(values)
              setEditingEnv(undefined)
            }}
            autoComplete="off"
            onFinishFailed={onFinishFailed}
            labelAlign="left"
          >
            <Form.Item
              label={intl.formatMessage({ defaultMessage: '名称' })}
              name="key"
              rules={
                editingEnv?.key
                  ? []
                  : [
                      {
                        required: true,
                        message: intl.formatMessage({ defaultMessage: '名称不能为空' })
                      },
                      {
                        pattern: new RegExp('^[a-zA-Z_][a-zA-Z0-9_]*$', 'g'),
                        message: intl.formatMessage({
                          defaultMessage: '以字母或下划线开头，只能由数字、字母、下划线组成'
                        })
                      },
                      {
                        validator: (rule, value) => {
                          const existItem = envs.find(item => item.key == value)
                          if (existItem) {
                            return Promise.reject(
                              intl.formatMessage({ defaultMessage: '名称重复' })
                            )
                          } else {
                            return Promise.resolve()
                          }
                        }
                      }
                    ]
              }
            >
              <AutoComplete
                disabled={!!editingEnv?.key}
                options={[{ value: 'GITHUB_PROXY_URL' }, { value: 'GITHUB_RAW_PROXY_URL' }]}
              />
            </Form.Item>
            <Form.Item
              label={intl.formatMessage({ defaultMessage: '值' })}
              name="value"
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
          dataSource={envs}
          rowKey={record => record.key}
          pagination={false}
          className={'mb-3 ' + styles.envTable}
        />
      </div>
    </>
  )
}
