import { Button, Descriptions, Radio, Table } from 'antd'
import { useContext } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import ReactJson from 'react-json-view'

import { GlobalContext } from '@/lib/context/globalContext'

const CustomAPI = () => {
  const intl = useIntl()
  const { vscode } = useContext(GlobalContext)

  const edit = () => {
    vscode.show()
  }

  return (
    <div className="p-4">
      <div className="flex justify-end mb-4">
        <Button type="primary" onClick={edit}>
          <FormattedMessage defaultMessage="编辑代码" />
        </Button>
      </div>
      <Descriptions>
        <Descriptions.Item label={intl.formatMessage({ defaultMessage: '参数定义' })}>
          <ReactJson
            src={{}}
            iconStyle="triangle"
            name={false}
            style={{
              wordBreak: 'break-word'
            }}
          />
        </Descriptions.Item>
        <Descriptions.Item label={intl.formatMessage({ defaultMessage: '响应定义' })}>
          <ReactJson
            src={{}}
            iconStyle="triangle"
            name={false}
            style={{
              wordBreak: 'break-word'
            }}
          />
        </Descriptions.Item>

        <Descriptions.Item label={intl.formatMessage({ defaultMessage: '是否需要认证' })}>
          <Radio checked />
        </Descriptions.Item>
        <Descriptions.Item label={intl.formatMessage({ defaultMessage: '是否需要认证' })}>
          <Radio checked />
        </Descriptions.Item>
        <Descriptions.Item label={intl.formatMessage({ defaultMessage: '实时查询' })}>
          <div className="flex items-center">
            <Radio checked />
            <p className="ml-3">
              <FormattedMessage defaultMessage="轮询间隔" />
              <span></span>
            </p>
          </div>
        </Descriptions.Item>
        <Descriptions.Item label={intl.formatMessage({ defaultMessage: '权限设置' })}>
          <div>
            <FormattedMessage defaultMessage="角色设置" />
            <Table
              columns={[
                {
                  title: intl.formatMessage({ defaultMessage: '策略' }),
                  dataIndex: 'name'
                },
                {
                  title: intl.formatMessage({ defaultMessage: '值' }),
                  dataIndex: 'description'
                }
              ]}
              dataSource={[]}
            />
          </div>
          <div className="mt-3">
            <FormattedMessage defaultMessage="自定义 Claim" />
            <span className="ml-3"></span>
          </div>
        </Descriptions.Item>
      </Descriptions>
    </div>
  )
}

export default CustomAPI
