// TODO:
/* eslint-disable react/prop-types */
import { Button } from 'antd'
import type { ButtonProps } from 'antd/lib/button'

// interface Props {
//   children: React.ReactNode
// }

const MyButton: React.FC<ButtonProps> = props => {
  return (
    <Button className="my-button">
      <span className="text">{props.children}</span>
    </Button>
  )
}

export default MyButton
