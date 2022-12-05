import { Image, Tooltip } from 'antd'

interface Props {
  title: React.ReactNode
  className: string
}

const FormToolTip = (props: Props) => {
  return (
    <div
      className={props.className}
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
      <Tooltip overlayClassName="!max-w-100vw !max-h-100vh" title={props.title} arrowPointAtCenter>
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
