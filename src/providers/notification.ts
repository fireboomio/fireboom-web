import type { ButtonProps } from 'antd'
import { uniqueId } from 'lodash'
import type { ReactNode } from 'react'
import create from 'zustand'

const SILENT_MODE_KEY = 'notification.silent'

export type NotificationItem = {
  id: string
  type?: 'success' | 'info' | 'warning' | 'error'
  title: string
  // 消息来源
  source?: string
  content?: ReactNode
  buttons?: {
    type?: ButtonProps['type']
    label: ReactNode
    handler: () => void
  }[]
  closeable?: boolean
}

interface NotificationState {
  visible: boolean
  silentMode: boolean
  notifications: NotificationItem[]
  hide: () => void
  toggleVisible: () => void
  toggleSilentMode: () => void
  addNotification: (item: NotificationItem) => void
  removeNotification: (item: NotificationItem) => void
  clear: () => void
}

export const useNotification = create<NotificationState>((set, get) => ({
  visible: false,
  silentMode: localStorage.getItem(SILENT_MODE_KEY) === '1',
  notifications: [],
  hide() {
    set({ visible: false })
  },
  toggleVisible() {
    set({ visible: !get().visible })
  },
  toggleSilentMode() {
    set({ silentMode: !get().silentMode })
    localStorage.setItem(SILENT_MODE_KEY, get().silentMode ? '0' : '1')
  },
  addNotification: (item: Omit<NotificationItem, 'id'>) => {
    set({ notifications: [{ id: uniqueId(), ...item }, ...get().notifications] })
  },
  removeNotification(item) {
    set({ notifications: get().notifications.filter(n => n !== item) })
  },
  clear() {
    set({ notifications: [] })
  }
}))
