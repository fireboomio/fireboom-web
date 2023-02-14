import { useEventBus } from '@/lib/event/events'
import { postSharedMessage } from '@/lib/socket'

export function useBroadcast(channel: string, event: string, cb: (data: any) => void) {
  useEventBus('broadcastEvent', ({ data }) => {
    if (data.channel === channel && data.event === event) {
      cb(data.data)
    }
  })
}

export function broadcast(channel: string, event: string, data: any) {
  postSharedMessage({ action: 'broadcast', value: { channel, event, data } })
}
