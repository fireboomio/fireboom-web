import { pull } from 'lodash'

export type EventHandler<E = any> = (e: E) => void
/*这个就是事件的原型*/
class EventEmitter<E extends any, TYPE extends { event: string }> {
  private _events: Record<string, EventHandler<E>[]>

  constructor() {
    this._events = {}
  }

  private _getFns(event: string) {
    return this._events[event] || (this._events[event] = [])
  }

  on<T = E>(event: string, cb: EventHandler<T>) {
    const fns = this._getFns(event)
    fns.push(cb as any)
  }

  off(event: string, cb?: EventHandler<E>) {
    if (cb) {
      const fns = this._getFns(event)
      pull(fns, cb)
    } else {
      delete this._events[event]
    }
  }

  once<T = E>(event: string, cb: EventHandler<T>) {
    const fn2: EventHandler<E> = e => {
      this.off(event, fn2)
      cb(e as any)
    }
    this.on(event, fn2)
  }

  /* 同步调用 */
  emit(event: TYPE) {
    const fns = this._getFns(event.event)
    for (let i = 0; i < fns.length; i++) {
      const fn = fns[i] as EventHandler<any>
      fn(event)
    }
  }
}

export default EventEmitter
