import { Image } from 'antd'

export default function ErrorWorking() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Image src="/assets/404-2.png" height={151} width={173} alt="50x" preview={false} />
      <div className="my-8 ml-2 text-sm text-[#AFB0B4CC]">正在努力开发中～</div>
    </div>
  )
}
