import moment from 'moment'
import type { editor } from 'monaco-editor'

import { DATETIME_FORMAT } from '@/components/PrismaTable/constants'

const capitalize = (str: string) => {
  return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : ''
}

const isEmpty = (obj: any) =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
  [Object, Array].includes((obj || {}).constructor) && !Object.entries(obj || {}).length

const formatBytes = (bytes: number | undefined, decimals = 2) => {
  if (bytes === 0 || !bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

const formatDate = (date: string): string => {
  return moment(date).format(DATETIME_FORMAT)
}

const makeSuggest = (editor: editor.IStandaloneCodeEditor) => {
  editor.onKeyDown(e => {
    // 阻止默认行为
    if (e.keyCode === 85 && (e.altKey || e.ctrlKey)) {
      // ctrl+/ 或者 alt+/
      e.preventDefault()
    }
  })
  editor.onKeyUp(e => {
    let isSuggestKey = false
    if (e.keyCode === 85 && (e.altKey || e.ctrlKey)) {
      // ctrl+/ 或者 alt+/
      e.preventDefault()
      isSuggestKey = true
    } else {
      // 回车，点，左花括号，冒号
      isSuggestKey = [87, 84, 80, 3].includes(e.keyCode)
    }
    if (isSuggestKey) {
      editor.trigger('', 'editor.action.triggerSuggest', '')
    }
  })
}

export { capitalize, formatBytes, formatDate, isEmpty, makeSuggest }
