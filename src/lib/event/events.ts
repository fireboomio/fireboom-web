import { useEffect } from 'react'

import type { EventHandler } from '@/lib/event/emitter'
import EventEmitter from '@/lib/event/emitter'

type WsEvent = {
  event: 'wsEvent'
  data: {
    channel: string
    event: string
  }
}
type TitleChangeEvent = {
  event: 'titleChange'
  data: { title: string; path: string }
}
type CompileFinishEvent = {
  event: 'compileFinish'
}
type CompileFailEvent = {
  event: 'compileFail'
}

type EventTypes = TitleChangeEvent | CompileFinishEvent | CompileFailEvent | WsEvent

const events = new EventEmitter<any, EventTypes>()

export default events

export function useEventBus(event: 'titleChange', cb: EventHandler<TitleChangeEvent>): void
export function useEventBus(event: 'compileFinish', cb: EventHandler<CompileFinishEvent>): void
export function useEventBus(event: 'compileFail', cb: EventHandler<CompileFailEvent>): void
export function useEventBus(event: 'wsEvent', cb: EventHandler<WsEvent>): void
export function useEventBus(event: string, cb: EventHandler) {
  useEffect(() => {
    events.on(event, cb)
    return () => {
      events.off(event, cb)
    }
  })
}

export function useWebSocket(channel: string, event: string, cb: (data: any) => void) {
  useEventBus('wsEvent', ({ data }) => {
    if (data.channel === channel && data.event === event) {
      cb(data.data)
    }
  })
}
