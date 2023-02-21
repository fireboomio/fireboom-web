import { message } from 'antd'
import copy from 'copy-to-clipboard'
import type { ReactNode } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { CopyOutlined } from '@/components/icons'

interface DirectiveDescriptionProps {
  name: string
  title: ReactNode
  code: string
}

const DirectiveDescription = ({ name, title, code }: DirectiveDescriptionProps) => {
  const intl = useIntl()
  return (
    <div className="flex flex-col h-full p-2.5 overflow-y-hidden">
      <div className="flex-shrink-0 text-xs text-[#6F6F6F]">
        {name} {title}, <FormattedMessage defaultMessage="参考用法如下" />
      </div>
      <code className="bg-[#F8F9FD] flex-1 mt-2 text-default text-xs px-2 pt-6 pb-2 leading-5 block relative overflow-hidden">
        <pre className="h-full mb-0 w-full overflow-auto">{code}</pre>

        <CopyOutlined
          className="cursor-pointer text-xs top-3 right-3 absolute"
          onClick={() => {
            copy(code)
            message.success(intl.formatMessage({ defaultMessage: '复制成功' }))
          }}
        />
      </code>
    </div>
  )
}

export default DirectiveDescription
