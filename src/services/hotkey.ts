import type { HotkeysEvent } from 'hotkeys-js'
import hotkeys from 'hotkeys-js'

const hotkeyMap: Record<string, ((e: KeyboardEvent, handler: HotkeysEvent) => void)[]> = {}

hotkeys.filter = function (event) {
  const target = event.target || event.srcElement;
  const tagName = target?.tagName;
  return !(target?.isContentEditable || tagName == 'INPUT' || tagName == 'SELECT' || tagName == 'TEXTAREA');
}

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