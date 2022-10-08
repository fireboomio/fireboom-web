import statusOff from './assets/status-off.png'
import statusOn from './assets/status-on.png'

interface StatusDirectiveProps {
  status: 'On' | 'Off'
  label: string
}

const StatusDirective = ({ status, label }: StatusDirectiveProps) => {
  return (
    <div
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
        lineHeight: '20px'
      }}
    >
      <img
        src={status === 'On' ? statusOn : statusOff}
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
