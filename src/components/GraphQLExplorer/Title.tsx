import type { ReactNode } from 'react'

interface TitleProps {
  children?: ReactNode
  size?: 'lg' | 'default'
  prefix?: ReactNode
  suffix?: ReactNode
}

const Title = ({ children, size, prefix, suffix }: TitleProps) => {
  return (
    <div
      className={`flex items-center mb-2 py-2 font-500 border-b border-[#dee2e7] ${
        size === 'lg' ? 'text-lg' : 'text-md'
      }`}
      style={{ borderBottomStyle: 'solid' }}
    >
      {prefix}
      <div className="flex-1 flex-shrink-0 truncate">{children}</div>
      <div className="ml-auto">{suffix}</div>
    </div>
  )
}

export default Title

export const SimpleTitle = ({ children }: { children: ReactNode }) => {
  return <p className="mt-4 mb-2 font-semibold text-md">{children}</p>
}
