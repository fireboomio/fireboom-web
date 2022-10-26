import { useEffect } from 'react'

import type { EventHandler } from '@/lib/event/emitter'
import EventEmitter from '@/lib/event/emitter'

type TitleChangeEvent = {
  event: 'titleChange'
  data: { title: string; path: string }
}
type CompileFinishEvent = {
  event: 'compileFinish'
}

type EventTypes = TitleChangeEvent | CompileFinishEvent

const events = new EventEmitter<any, EventTypes>()

export default events

export function useEventBus(event: 'titleChange', cb: EventHandler<TitleChangeEvent>): void
export function useEventBus(event: 'compileFinish', cb: EventHandler<CompileFinishEvent>): void
export function useEventBus(event: string, cb: EventHandler) {
  useEffect(() => {
    events.on(event, cb)
    return () => {
      events.off(event, cb)
    }
  })
}
