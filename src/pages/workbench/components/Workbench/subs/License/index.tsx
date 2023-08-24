import { Descriptions, Popover } from 'antd'
import dayjs from 'dayjs'
import { FormattedMessage, useIntl } from 'react-intl'

import { formatDate } from '@/lib/helpers/utils'

export interface LicenseProps {
  existed: boolean
  defaultLimits: {
    datasource: number
    export: number
    import: number
    operation: number
    teamwork: number
  }
  userCode: string
  userLimits: {
    datasource: number
    operation: number
  }
  expireTime: string
}

const License = ({ existed, defaultLimits, userLimits, userCode, expireTime }: LicenseProps) => {
  const intl = useIntl()
  return (
    <Popover
      placement="topRight"
      content={
        <Descriptions column={1} size="small" labelStyle={{ width: '100px' }} className="w-120">
          <Descriptions.Item label={intl.formatMessage({ defaultMessage: '数据源限制' })}>
            {userLimits?.datasource ?? defaultLimits.datasource}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ defaultMessage: 'API 限制' })}>
            {userLimits?.operation ?? defaultLimits.operation}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ defaultMessage: '机器码' })}>
            {userCode}
          </Descriptions.Item>
          {expireTime && existed && userLimits && (
            <Descriptions.Item label={intl.formatMessage({ defaultMessage: '过期时间' })}>
              {formatDate(expireTime)}
            </Descriptions.Item>
          )}
          <Descriptions.Item label={intl.formatMessage({ defaultMessage: '商业版升级' })}>
            <a href="https://fireboom.io/" target="_blank" rel="noreferrer">
              https://fireboom.io/
            </a>
          </Descriptions.Item>
        </Descriptions>
      }
      trigger="click"
    >
      <span className="text-[#326d9f] bg-white rounded-sm cursor-pointer text-xs py-0.5 px-1">
        {!existed ? (
          <FormattedMessage defaultMessage="社区版" />
        ) : !userLimits ? (
          <FormattedMessage defaultMessage="非法授权" />
        ) : dayjs(expireTime).isBefore(dayjs()) ? (
          <FormattedMessage defaultMessage="授权已过期" />
        ) : (
          <FormattedMessage defaultMessage="商业授权版" />
        )}
      </span>
    </Popover>
  )
}

export default License
