import { message } from 'antd'

import { intl } from '@/providers/IntlProvider'

export async function downloadOSSFile(url: string, filename?: string) {
  filename = filename ?? new window.URL(url).pathname.replace(/^\//, '').split('/').pop()
  message.open({
    key: filename,
    type: 'loading',
    content: intl.formatMessage({ defaultMessage: '文件 {filename} 下载中' }, { filename })
  })
  try {
    const resp = await fetch(url, {
      mode: 'no-cors'
    })
    const blob = await resp.blob()
    const file = new File([blob], filename!)
    const a = document.createElement('a')
    a.href = window.URL.createObjectURL(file)
    a.download = filename!
    // 隐藏元素
    a.style.display = 'none'
    document.body.appendChild(a)

    a.click()

    // 清理
    document.body.removeChild(a)
    URL.revokeObjectURL(a.href)
  } catch (error) {
    setTimeout(() => {
      message.error(intl.formatMessage({ defaultMessage: '文件下载失败' }))
    })
  }
  message.destroy(filename)
}
