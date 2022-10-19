import { message } from 'antd'
import copy from 'copy-to-clipboard'
import type { ReactNode } from 'react'

import { CopyOutlined } from '../../../icons'

interface DirectiveDescriptionProps {
  name: string
  title: ReactNode
  code: string
}

const DirectiveDescription = ({ name, title, code }: DirectiveDescriptionProps) => {
  return (
    <div className="p-2.5">
      <div className="text-xs text-[#6F6F6F]">
        {name} {title}，参考用法如下
      </div>
      <code className="bg-[#F8F9FD] mt-2 text-default text-xs px-2 pt-6 pb-2 leading-5 block relative">
        <pre className="mb-0 max-h-60 max-w-100 overflow-auto">{code}</pre>

        <CopyOutlined
          className="cursor-pointer text-xs top-3 right-3 absolute"
          onClick={() => {
            copy(code)
            message.success('复制成功')
          }}
        />
      </code>
    </div>
  )
}

export default DirectiveDescription
