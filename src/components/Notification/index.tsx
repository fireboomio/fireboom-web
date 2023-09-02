import {
  CheckCircleOutlined,
  CloseOutlined,
  DownOutlined,
  InfoCircleOutlined,
  WarningOutlined
} from '@ant-design/icons'
import { Button, Popover } from 'antd'
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
  error: <CloseOutlined className="text-[#ff4d4f]" />
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
    <div className="shadow-lg rounded absolute right-5 bottom-10 z-1000 bg-white min-w-100 overflow-hidden">
      <div className="px-2 py-3 bg-[#e3e3d3] flex items-center">
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
      {notifications.map(notification => (
        <div
          className="px-3 py-4 focus:border focus:border-solid focus:border-[#e92e5e]"
          key={notification.id}
        >
          <div className="flex items-start">
            <span className="flex-shrink-0 leading-6">
              {notificationTypeIcons[notification.type ?? 'info']}
            </span>
            <div className="flex-1 ml-2 text-[#333] leading-6">{notification.title}</div>
            <span className="ml-4 leading-6">
              <CloseOutlined
                className="flex-shrink-0 cursor-pointer text-[#333]"
                onClick={() => removeNotification(notification)}
              />
            </span>
          </div>
          {notification.source ||
            (notification.buttons?.length && (
              <div className="mt-3 flex">
                {notification.source ?? (
                  <span className="text-[#999] mr-auto">{notification.source}</span>
                )}
                {notification.buttons?.map((btn, index) => (
                  <Button
                    key={index}
                    className={index === notification.buttons!.length - 1 ? '' : 'mr-1.5'}
                    type={btn.type}
                    onClick={btn.handler}
                  >
                    {btn.label}
                  </Button>
                ))}
              </div>
            ))}
        </div>
      ))}
    </div>
  )
}
