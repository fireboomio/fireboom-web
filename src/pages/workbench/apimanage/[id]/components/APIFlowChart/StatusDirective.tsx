import type { MouseEventHandler } from 'react'

import statusOff from './assets/status-off.svg'
import statusOn from './assets/status-on.svg'

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
  const _onToggleEnabled: MouseEventHandler<HTMLImageElement> = e => {
    e.stopPropagation()
    onToggleEnabled?.(!enabled)
  }

  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        cursor: 'pointer',
        display: 'block',
        padding: '0 5px',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        background: '#F3F9FD',
        border: '0.3px solid #C7D4DC',
        borderRadius: '10px',
        boxShadow: '0 2px 4px #F8F9FD',
        color: '#333',
        fontSize: '12px',
        height: '20px',
        opacity: enabled ? 'unset' : '0.75'
        // lineHeight: '20px',
      }}
    >
      <span className="mr-1" onClick={_onToggleEnabled}>
        <img
          src={enabled ? statusOn : statusOff}
          width="14"
          height="14"
          style={{ marginRight: '2px', verticalAlign: 'sub' }}
          alt=""
        />
      </span>
      {label}
    </div>
  )
}

export default StatusDirective
