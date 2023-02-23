import { useEffect } from 'react'

import type { EventHandler } from '@/lib/event/emitter'
import EventEmitter from '@/lib/event/emitter'

type WsEvent = {
  event: 'wsEvent'
  data: {
    channel: string
    event: string
    data: any
  }
}
type BroadCastEvent = {
  event: 'broadcastEvent'
  data: {
    channel: string
    event: string
    data: any
  }
}
type TitleChangeEvent = {
  event: 'titleChange'
  data: { title: string; path: string }
}
type ApiEnableChangeEvent = {
  event: 'apiEnableChange'
  data: { ids: number[]; enabled: boolean }
}
type CompileFinishEvent = {
  event: 'compileFinish'
}
type CompileFailEvent = {
  event: 'compileFail'
}
type OpenApiSearchEvent = {
  event: 'openApiSearch'
}

type EventTypes =
  | TitleChangeEvent
  | CompileFinishEvent
  | CompileFailEvent
  | WsEvent
  | ApiEnableChangeEvent
  | BroadCastEvent
  | OpenApiSearchEvent

const events = new EventEmitter<any, EventTypes>()

export default events

export function useEventBus(event: 'titleChange', cb: EventHandler<TitleChangeEvent>): void
export function useEventBus(event: 'apiEnableChange', cb: EventHandler<ApiEnableChangeEvent>): void
export function useEventBus(event: 'compileFinish', cb: EventHandler<CompileFinishEvent>): void
export function useEventBus(event: 'compileFail', cb: EventHandler<CompileFailEvent>): void
export function useEventBus(event: 'openApiSearch', cb: EventHandler<OpenApiSearchEvent>): void
export function useEventBus(event: 'wsEvent', cb: EventHandler<WsEvent>): void
export function useEventBus(event: 'broadcastEvent', cb: EventHandler<BroadCastEvent>): void
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
      // @ts-ignore
      cb(data.data)
    }
  })
}
