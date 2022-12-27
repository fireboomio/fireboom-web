import { Image } from 'antd'
import { FormattedMessage } from 'react-intl'

export default function Error404() {
  return (
    <div className="flex flex-col h-full items-center justify-center">
      <Image src="/assets/404.png" height={99} width={105} alt="50x" preview={false} />
      <div className="my-8 text-sm ml-2 text-[#AFB0B4CC]">
        <FormattedMessage defaultMessage="暂无内容～" description="状态码404" />
      </div>
    </div>
  )
}
