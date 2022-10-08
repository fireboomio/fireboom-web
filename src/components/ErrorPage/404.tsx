import { Image } from 'antd'

export default function Error404() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Image src="/assets/404.png" height={99} width={105} alt="50x" preview={false} />
      <div className="my-8 ml-2 text-sm text-[#AFB0B4CC]">暂无内容～</div>
    </div>
  )
}
