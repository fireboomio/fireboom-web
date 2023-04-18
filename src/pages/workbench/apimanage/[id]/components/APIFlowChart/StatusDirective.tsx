import { Switch } from 'antd'
import type { SwitchChangeEventHandler } from 'antd/es/switch'

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
      className={className}
      onClick={onClick}
      style={{
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        padding: '0 5px',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        background: '#f3f9fd',
        border: '0.3px solid #C7D4DC',
        borderRadius: '10px',
        boxShadow: '0 2px 4px #F8F9FD',
        color: '#333',
        fontSize: '12px',
        height: '20px',
        boxSizing: 'content-box',
        opacity: enabled ? 'unset' : '0.75'
        // lineHeight: '20px',
      }}
    >
      <div className="flex-shrink-0 h-full flex items-center" onClick={e => e.stopPropagation()}>
        <Switch size="small" checked={enabled} onChange={_onToggleEnabled} />
      </div>
      <div className="h-full bg-[#c7d4dc] w-0.5px mx-1 flex-shrink-0" />
      {label}
    </div>
  )
}

export default StatusDirective
