import { CopyOutlined } from '@ant-design/icons'
import { Button, message, Popover, Tooltip } from 'antd'
import clsx from 'clsx'
import copy from 'copy-to-clipboard'
import dayjs from 'dayjs'
import { FormattedMessage, useIntl } from 'react-intl'
import useSWRImmutable from 'swr/immutable'

import { formatDate } from '@/lib/helpers/utils'
import { getFireboomFileContent } from '@/providers/ServiceDiscovery'

import styles from './index.module.css'
export interface LicenseProps {
  existed: boolean
  defaultLimits: {
    datasource: number
    export: 0 | 1
    import: 0 | 1
    operation: number
    teamwork: 0 | 1
    incrementBuild: 0 | 1
  }
  userCode: string
  type: string
  userLimits: {
    datasource: number
    operation: number
    import: 0 | 1
    teamwork: 0 | 1
    incrementBuild: 0 | 1
  }
  expireTime: string
}

type LicenseConfig = {
  isLimittedTime: boolean
  limitEndTime: string | null
  buyLicenseUrl: string
  freeGiftUrl: string
}

const License = ({
  existed,
  defaultLimits,
  userLimits,
  userCode,
  expireTime,
  type
}: LicenseProps) => {
  const intl = useIntl()
  const { data: licenseConfig } = useSWRImmutable<LicenseConfig>(
    'license.json',
    getFireboomFileContent
  )
  const isExpired = dayjs(expireTime).isBefore(dayjs())
  const leftDays = dayjs(expireTime).diff(dayjs(), 'day')
  const isAlmostExpired = leftDays <= 7

  const licenseTypeMap = {
    community: intl.formatMessage({ defaultMessage: '社区版' }),
    professional: intl.formatMessage({ defaultMessage: '专业版' }),
    enterprise: intl.formatMessage({ defaultMessage: '企业版' })
  }

  const getCount = (count?: number) => {
    if (count === -1) return <FormattedMessage defaultMessage="不限制" />
    return count
  }

  return (
    <Popover
      placement="topRight"
      arrow={false}
      content={
        <div className="w-160 px-3 pt-4.5 pb-5">
          <div className="text-[#333]">
            <div className="flex items-center">
              <FormattedMessage defaultMessage="机器码" />
              <span className="ml-8">{userCode}</span>
              <CopyOutlined
                className="ml-3 cursor"
                onClick={() => {
                  copy(userCode)
                  message.success(intl.formatMessage({ defaultMessage: '已复制' }))
                }}
              />
            </div>
            <div className="mt-5 mb-4 text-[rgba(95,98,105,0.6)] text-xs">
              <FormattedMessage defaultMessage="权益" />
            </div>
            <div className="flex flex items-center">
              <div className="flex-1 flex items-center">
                <div className={styles.dot} />
                <FormattedMessage defaultMessage="API数量" />
                <span className="ml-5">{getCount(userLimits?.operation)}</span>
              </div>
              <div className="flex-1 flex items-center">
                <div className={styles.dot} />
                <FormattedMessage defaultMessage="数据源数量" />
                <span className="ml-5">{getCount(userLimits?.datasource)}</span>
              </div>
              {userLimits?.incrementBuild === 1 ? (
                <div className="flex-1 flex items-center">
                  <div className={styles.dot} />
                  <FormattedMessage defaultMessage="增量编译" />
                </div>
              ) : (
                <Tooltip title={intl.formatMessage({ defaultMessage: '仅商业授权版支持' })}>
                  <a
                    className={clsx('flex-1 flex items-center', styles.notSupport)}
                    href={licenseConfig?.buyLicenseUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <div className={styles.dotError}>x</div>
                    <FormattedMessage defaultMessage="增量编译" />
                  </a>
                </Tooltip>
              )}

              <div className="flex-1 flex items-center">
                <div className={styles.dot} />
                <FormattedMessage defaultMessage="客服支持" />
              </div>
            </div>
          </div>
          <div
            className="mt-6 mb-5 h-1px"
            style={{ border: 'none', borderTop: '1px dashed #979797' }}
          />
          <div className="flex items-center">
            {expireTime && existed && userLimits && (
              <>
                <FormattedMessage defaultMessage="过期时间" />
                <div
                  className="ml-2 flex items-center h-8 bg-[#F8F9FD] px-3 w-69"
                  style={{
                    color: isExpired || isAlmostExpired ? '#F21212' : undefined
                  }}
                >
                  {formatDate(expireTime)}
                  {isExpired && (
                    <span className="ml-2 text-[10px] bg-[rgba(241,18,18,0.8)] text-white rounded px-1 py-1 scale-75 transform">
                      <FormattedMessage defaultMessage="已过期" />
                    </span>
                  )}
                  {isAlmostExpired && (
                    <span className="ml-2">
                      (
                      <FormattedMessage
                        defaultMessage="剩余{left}天"
                        values={{
                          left: leftDays
                        }}
                      />
                      )
                    </span>
                  )}
                </div>
              </>
            )}
            <Button
              className="ml-auto"
              onClick={() => window.open(licenseConfig?.buyLicenseUrl, '_blank')}
            >
              <FormattedMessage defaultMessage="购买授权" />
            </Button>
            {licenseConfig?.freeGiftUrl && (
              <div className="relative ml-4">
                <Button
                  type="primary"
                  onClick={() => window.open(licenseConfig?.freeGiftUrl, '_blank')}
                  style={{
                    backgroundImage: 'linear-gradient(36deg, #FFAE72 0%, #FF5E5E 100%)',
                    boxShadow: '0px 2px 4px 0px rgba(255,116,99,0.5)',
                    border: 'none'
                  }}
                >
                  <FormattedMessage defaultMessage="免费获取" />
                </Button>
                {licenseConfig?.isLimittedTime && (
                  <div className="absolute -right-2 -top-3 z-99 bg-[#F44848] text-white scale-75 transform px-1.5 py-0.5 text-xs rounded border border-solid border-white">
                    <FormattedMessage defaultMessage="限时" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      }
      trigger="click"
    >
      <span className="text-[#326d9f] bg-white rounded-sm cursor-pointer text-xs py-0.5 px-1">
        {existed && !userLimits ? (
          <FormattedMessage defaultMessage="非法授权" />
        ) : (
          licenseTypeMap[type as keyof typeof licenseTypeMap]
        )}
      </span>
    </Popover>
  )
}

export default License
