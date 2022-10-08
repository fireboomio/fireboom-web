// TODO:
/* eslint-disable react/prop-types */

import { Avatar } from 'antd'

interface Props {
  name: string
  logo: string
  className: string
  onClick: () => void
}

const AvatarBox: React.FC<Props> = props => {
  return (
    <div className={props.className} onClick={() => props.onClick()}>
      <Avatar src={props.logo} size={30} />
      <span className="ml-2 text-xs">{props.name}</span>
    </div>
  )
}

export default AvatarBox
