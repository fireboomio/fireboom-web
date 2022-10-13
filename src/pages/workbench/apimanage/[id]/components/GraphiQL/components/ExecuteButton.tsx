import { ImgHTMLAttributes } from 'react'

import RunIcon from '../assets/run.svg'

interface ExecuteButtonProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'loading'> {
  loading?: boolean
}

const ExecuteButton = ({ loading, ...props }: ExecuteButtonProps) => {
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...props} src={RunIcon} width="28" height="28" alt="run" />
}

export default ExecuteButton
