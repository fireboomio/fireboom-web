import type { ButtonProps } from 'antd'
import { uniqueId } from 'lodash'
import type { ReactNode } from 'react'
import { create } from 'zustand'

const SILENT_MODE_KEY = 'notification.silent'

export type NotificationItem = {
  id: string
  tag?: string
  type?: 'success' | 'info' | 'warning' | 'error'
  title: string
  // 消息来源
  source?: string
  content?: ReactNode
  buttons?: {
    type?: ButtonProps['type']
    label: ReactNode
    handler: () => void | Promise<void>
    closeAfterHandler?: boolean
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
  addNotification: (item: Omit<NotificationItem, 'id'>) => void
  removeNotification: (item: NotificationItem) => void
  removeByTag: (tag: string) => void
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
    localStorage.setItem(SILENT_MODE_KEY, get().silentMode ? '1' : '0')
  },
  addNotification: (item: Omit<NotificationItem, 'id'>) => {
    if (get().notifications.some(n => n.title === item.title)) {
      return
    }
    set({ notifications: [{ id: uniqueId(), ...item }, ...get().notifications] })
    if (!get().silentMode) {
      set({ visible: true })
    }
  },
  removeNotification(item) {
    set({ notifications: get().notifications.filter(n => n !== item) })
    if (!get().notifications.length) {
      set({ visible: false })
    }
  },
  removeByTag(tag) {
    set({ notifications: get().notifications.filter(n => n.tag !== tag) })
    if (!get().notifications.length) {
      set({ visible: false })
    }
  },
  clear() {
    set({ notifications: [], visible: false })
  }
}))
