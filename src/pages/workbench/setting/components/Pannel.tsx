import { useEffect } from 'react'

import IconFont from '@/components/Iconfont'
import type { SettingType } from '@/interfaces/setting'

// import styles from './Pannel.module.less'
import SettingItem from './subs/PannelItem'

interface Props {
  handleToggleDesigner: (settingType: SettingType) => void
  showType: string
}

const settingTypeList: SettingType[] = [
  {
    name: '外观',
    type: 'colorTheme',
    icon: <IconFont type="icon-waiguan" />
  },
  {
    name: '系统',
    type: 'system',
    icon: <IconFont type="icon-xitong" />
  },
  {
    name: '安全',
    type: 'secure',
    icon: <IconFont type="icon-anquan" />
  },
  {
    name: '跨域',
    type: 'cors',
    icon: <IconFont type="icon-kuayu" />
  },
  // {
  //   name: 'API Token',
  //   type: 'API Token',
  //   icon: <IconFont type="icon-a-APItoken" />,
  // },
  {
    name: 'SDK 模板',
    type: 'sdk',
    icon: <IconFont type="icon-huanjingbianliang" />
  },
  {
    name: '环境变量',
    type: 'path',
    icon: <IconFont type="icon-huanjingbianliang" />
  },
  {
    name: '版本',
    type: 'version',
    icon: <IconFont type="icon-banben" />
  }
]

export default function SettingPannel({ handleToggleDesigner, showType }: Props) {
  useEffect(() => {
    handleToggleDesigner(settingTypeList[0])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="h-full bg-[#f8f8f8] px-4 pt-5.5">
      {settingTypeList.map(settingType => (
        <SettingItem
          active={showType === settingType.type}
          key={settingType.type}
          handleToggleDesigner={handleToggleDesigner}
          settingType={settingType}
        />
      ))}
    </div>
  )
}
