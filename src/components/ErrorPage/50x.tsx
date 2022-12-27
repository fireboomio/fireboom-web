import { Image } from 'antd'
import { FormattedMessage } from 'react-intl'

export default function Error50x() {
  return (
    <div className="flex flex-col h-full items-center justify-center">
      <Image src="/assets/50x.png" height={89} width={198} alt="50x" preview={false} />
      <div className="my-8 text-sm ml-6 text-[#AFB0B4CC]">
        <FormattedMessage defaultMessage="网络出现问题～" description="状态码50x" />
      </div>
    </div>
  )
}
