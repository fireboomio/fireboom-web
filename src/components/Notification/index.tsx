import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CloseOutlined,
  DownOutlined,
  InfoCircleOutlined,
  WarningOutlined
} from '@ant-design/icons'
import { Button } from 'antd'
import clsx from 'clsx'
import type { ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'

import type { NotificationItem } from '@/providers/notification'
import { useNotification } from '@/providers/notification'

import { ClearAllOutlined, NoNotificationOutlined, NotificationOutlined } from '../icons'

interface NotificationButtonProps {
  className?: string
}

const notificationTypeIcons: Record<NonNullable<NotificationItem['type']>, ReactNode> = {
  success: <CheckCircleOutlined className="text-[#52c41a]" />,
  info: <InfoCircleOutlined className="text-[#1677ff]" />,
  warning: <WarningOutlined className="text-[#faad14]" />,
  error: <CloseCircleOutlined className="text-[#ff4d4f]" />
}

export const NotificationButton = (props: NotificationButtonProps) => {
  const { silentMode, visible, toggleVisible } = useNotification()
  return (
    <>
      <span {...props} onClick={toggleVisible}>
        {silentMode ? (
          <NoNotificationOutlined className="cursor-pointer" />
        ) : (
          <NotificationOutlined className="cursor-pointer" />
        )}
      </span>
      <NotificationWindow />
    </>
  )
}

interface NotificationWindowProps {
  className?: string
}

export const NotificationWindow = (props: NotificationWindowProps) => {
  const { silentMode, visible, hide, removeNotification, toggleSilentMode, notifications, clear } =
    useNotification()

  if (!visible) {
    return null
  }

  return (
    <div className="shadow-lg rounded absolute right-2 bottom-9 z-1000 bg-white min-w-100 max-w-150 overflow-hidden">
      <div className="px-2 py-2 bg-[#e3e3d3] flex items-center text-xs">
        <span className="mr-auto">
          <FormattedMessage defaultMessage="通知" />
        </span>
        <ClearAllOutlined onClick={clear} className="cursor-pointer" />
        {silentMode ? (
          <NoNotificationOutlined className="ml-3 cursor-pointer" onClick={toggleSilentMode} />
        ) : (
          <NotificationOutlined className="ml-3 cursor-pointer" onClick={toggleSilentMode} />
        )}
        <DownOutlined className="ml-3 cursor-pointer" onClick={hide} />
      </div>
      <div className="max-h-100 overflow-y-auto">
        {notifications.map(notification => (
          <div
            className="p-3 border border-solid border-[transparent] focus:border-[#e92e5e] text-xs"
            key={notification.id}
            tabIndex={0}
            style={{
              boxShadow: `0 1px 0 0 rgba(0,0,0,0.05)`
            }}
          >
            <div className="flex items-start">
              <span className="flex-shrink-0 leading-5">
                {notificationTypeIcons[notification.type ?? 'info']}
              </span>
              <div className="flex-1 ml-2 text-[#333] leading-5">{notification.title}</div>
              <span className="ml-4 leading-5">
                <CloseOutlined
                  className="flex-shrink-0 cursor-pointer text-[#333]"
                  onClick={() => removeNotification(notification)}
                />
              </span>
            </div>
            {(notification.source || notification.buttons?.length) && (
              <div className="mt-2 flex">
                {notification.source && (
                  <span className="text-[#999] mr-auto">
                    <FormattedMessage defaultMessage="来源:" />
                    &nbsp;&nbsp;{notification.source}
                  </span>
                )}
                {notification.buttons?.map((btn, index) => (
                  <Button
                    key={index}
                    className={clsx([
                      index === notification.buttons!.length - 1 ? '' : 'mr-1.5',
                      index === 0 ? 'ml-auto' : '',
                      '!text-xs'
                    ])}
                    type={btn.type}
                    size="small"
                    onClick={async () => {
                      await btn.handler()
                      if (btn.closeAfterHandler !== false) {
                        removeNotification(notification)
                      }
                    }}
                  >
                    {btn.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
