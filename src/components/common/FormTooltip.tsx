import { Image, Tooltip } from 'antd'

interface Props {
  title: string
}

const FormToolTip = (props: Props) => {
  return (
    <div
      style={{
        width: 0,
        position: 'relative',
        left: '5px',
        height: '100%',
        display: 'inline-block',
        verticalAlign: 'middle',
        fontSize: 0
      }}
    >
      <Tooltip title={props.title} arrowPointAtCenter>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: 0,
            maxWidth: 'initial'
          }}
        >
          <Image width={10} height={10} alt="提示" preview={false} src="/assets/warning.png" />
        </div>
      </Tooltip>
    </div>
  )
}

export default FormToolTip
