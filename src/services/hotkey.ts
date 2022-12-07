import type { HotkeysEvent } from 'hotkeys-js'
import hotkeys from 'hotkeys-js'

const hotkeyMap: Record<string, ((e: KeyboardEvent, handler: HotkeysEvent) => void)[]> = {}

export function registerHotkeyHandler(
  hotkey: string,
  handler: (e: KeyboardEvent, handler: HotkeysEvent) => void
) {
  if (!hotkeyMap[hotkey]) {
    hotkeyMap[hotkey] = []
  }
  hotkeyMap[hotkey].push(handler)

  hotkeys(hotkey, handler)

  return () => {
    hotkeyMap[hotkey].pop()
    if (hotkeyMap[hotkey].length) {
      hotkeys(hotkey, hotkeyMap[hotkey][hotkeyMap[hotkey].length - 1])
    } else {
      hotkeys.unbind()
    }
  }
}
