import { Image } from 'antd'
import { FormattedMessage } from 'react-intl'

export default function ErrorWorking() {
  return (
    <div className="flex flex-col h-full items-center justify-center">
      <Image src="/assets/404-2.png" height={151} width={173} alt="50x" preview={false} />
      <div className="my-8 text-sm ml-2 text-[#AFB0B4CC]">
        <FormattedMessage defaultMessage="正在努力开发中～" />
      </div>
    </div>
  )
}
