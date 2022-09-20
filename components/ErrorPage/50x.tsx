import { Image } from 'antd'

export default function Error50x() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Image src="/assets/50x.png" height={89} width={198} alt="50x" preview={false} />
      <div className="my-8 ml-6 text-sm text-[#AFB0B4CC]">网络出现问题～</div>
    </div>
  )
}
