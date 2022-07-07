import { useImmer } from 'use-immer'

import type { SettingType } from '@/interfaces/setting'

import styles from './setting-common.module.scss'

interface Props {
  handleToggleDesigner: (settingType: SettingType) => void
  settingType: SettingType
}

export default function SettingItem({ handleToggleDesigner, settingType }: Props) {
  const [isHovering, setIsHovering] = useImmer(false)
  return (
    <>
      <div
        className="flex justify-start items-center py-2.5 pl-3 cursor-pointer"
        style={isHovering ? { background: '#F8F8F9' } : {}}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={() => {
          handleToggleDesigner(settingType)
        }}
      >
        <span className="ml-2px mr-3">{settingType.icon}</span>

        <div className={styles['item-label']}>{settingType.name}</div>
      </div>
    </>
  )
}
