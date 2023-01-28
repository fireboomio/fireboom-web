import type { HotkeysEvent } from 'hotkeys-js'
import hotkeys from 'hotkeys-js'

const hotkeyMap: Record<string, (e: KeyboardEvent, handler: HotkeysEvent) => void> = {}

hotkeys.filter = function (event) {
  const target = event.target || event.srcElement
  const tagName = target?.tagName
  return !(
    (target?.isContentEditable || tagName == 'INPUT' || tagName == 'SELECT')
    // tagName == 'TEXTAREA'
  )
}

export type HotkeyOptions = {
  scope?: string
  element?: HTMLElement | null
  keyup?: boolean | null
  keydown?: boolean | null
  capture?: boolean
  splitKey?: string
}

export function registerHotkeyHandler(
  hotkey: string,
  options: HotkeyOptions,
  handler: (e: KeyboardEvent, handler: HotkeysEvent) => void
): () => void

export function registerHotkeyHandler(
  hotkey: string,
  handler: (e: KeyboardEvent, handler: HotkeysEvent) => void
): () => void

export function registerHotkeyHandler(hotkey: string, ...args: any) {
  const options: HotkeyOptions | undefined = args.length === 1 ? undefined : args[0]
  const handler: (e: KeyboardEvent, handler: HotkeysEvent) => void =
    args.length === 1 ? args[0] : args[1]
  hotkeyMap[hotkey] = handler
  if (options) {
    hotkeys(hotkey, options, handler)
  } else {
    hotkeys(hotkey, handler)
  }

  return () => {
    hotkeys.unbind(hotkey, hotkeyMap[hotkey])
    delete hotkeyMap[hotkey]
  }
}
