import statusOff from './assets/status-off.svg'
import statusOn from './assets/status-on.svg'

interface StatusDirectiveProps {
  enabled: boolean
  label: string
  onClick?: () => void
}

const StatusDirective = ({ enabled, label, onClick }: StatusDirectiveProps) => {
  return (
    <div
      onClick={onClick}
      style={{
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
      <img
        src={enabled ? statusOn : statusOff}
        width="14"
        height="14"
        style={{ marginRight: '2px', verticalAlign: 'sub' }}
        alt=""
      />
      {label}
    </div>
  )
}

export default StatusDirective
