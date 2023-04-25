import { ConfigProvider, Switch } from 'antd'
import type { SwitchChangeEventHandler } from 'antd/es/switch'

import { primaryColor } from '@/styles'

interface StatusDirectiveProps {
  className?: string
  enabled: boolean
  label: string
  onToggleEnabled?: (enabled: boolean) => void
  onClick?: () => void
}

const StatusDirective = ({
  className,
  enabled,
  label,
  onToggleEnabled,
  onClick
}: StatusDirectiveProps) => {
  const _onToggleEnabled: SwitchChangeEventHandler = flag => {
    onToggleEnabled?.(flag)
  }

  return (
    <div
      className={`cursor-pointer flex p-2px truncate bg-[#f3f9fd] items-center rounded-xl text-[#333] text-xs  ${className}`}
      onClick={onClick}
      style={{
        border: '0.3px solid #C7D4DC',
        boxShadow: '0 2px 4px #F8F9FD',
        opacity: enabled ? 'unset' : '0.75'
        // lineHeight: '20px',
      }}
    >
      <div className="flex flex-shrink-0 items-center" onClick={e => e.stopPropagation()}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: primaryColor
            }
          }}
        >
          <Switch size="small" checked={enabled} onChange={_onToggleEnabled} />
        </ConfigProvider>
      </div>
      {/* <div className="h-full bg-[#c7d4dc] flex-shrink-0 mx-1 w-0.5px" /> */}
      <div className="text-ellipsis ml-1" title={label}>
        {label}
      </div>
    </div>
  )
}

export default StatusDirective
