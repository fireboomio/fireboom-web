import clsx from 'clsx'

import type { SettingType } from '@/interfaces/setting'

import styles from './subs.module.less'

interface Props {
  handleToggleDesigner: (settingType: SettingType) => void
  settingType: SettingType
  active: boolean
}

export default function SettingItem({ handleToggleDesigner, settingType, active }: Props) {
  // const [isHovering, setIsHovering] = useImmer(false)

  return (
    <div
      className={clsx('flex pl-4 h-9 items-center mb-1 cursor-pointer', {
        'bg-[rgba(95,98,105,0.1)] rounded-4px': active
      })}
      onClick={() => {
        handleToggleDesigner(settingType)
      }}
    >
      <div className="mr-4 text-[16px]">{settingType.icon}</div>
      <div className={styles['item-label']}>{settingType.name}</div>
    </div>
  )
}
