import { useNotification } from '@/providers/notification'

import { NoNotificationOutlined, NotificationOutlined } from '../icons'

interface NotificationButtonProps {
  className?: string
}

export const NotificationButton = (props: NotificationButtonProps) => {
  const { silentMode, visible, toggleVisible } = useNotification()
  return (
    <span {...props} onClick={toggleVisible}>
      {silentMode ? <NoNotificationOutlined /> : <NotificationOutlined />}
    </span>
  )
}

interface NotificationWindowProps {
  className?: string
}

export const NotificationWindow = (props: NotificationWindowProps) => {
  const { silentMode, visible, hide, removeNotification, toggleSilentMode, notifications, clear } =
    useNotification()

  return <></>
}
