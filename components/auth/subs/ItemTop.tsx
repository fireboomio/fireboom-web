import { useImmer } from 'use-immer'

import type { AuthListType } from '@/interfaces/auth'

import styles from '../Pannel.module.scss'

interface Props {
  handleTopToggleDesigner: (authType: AuthListType) => void
  authType: AuthListType
}

export default function AuthItemTop({ handleTopToggleDesigner, authType }: Props) {
  const [isHovering, setIsHovering] = useImmer(false)
  return (
    <>
      <div
        className="flex justify-start items-center py-2.5 pl-3 cursor-pointer"
        style={isHovering ? { background: '#F8F8F9' } : {}}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={() => {
          handleTopToggleDesigner(authType)
        }}
      >
        <div className={styles['item-label']}>{authType.name}</div>
      </div>
    </>
  )
}
