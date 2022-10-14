import { useEffect } from 'react'

import IconFont from '@/components/iconfont'
import type { SettingType } from '@/interfaces/setting'

import styles from './Pannel.module.less'
import SettingItem from './subs/PannelItem'

interface Props {
  handleToggleDesigner: (settingType: SettingType) => void
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

export default function SettingPannel({ handleToggleDesigner }: Props) {
  useEffect(() => {
    handleToggleDesigner(settingTypeList[0])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div className="border-gray border-b ">
        <div className={`${styles.title} text-lg font-bold mt-6 ml-4 mb-8`}>设置</div>
      </div>

      <div className="mt-3">
        {settingTypeList.map(settingType => (
          <SettingItem
            key={settingType.type}
            handleToggleDesigner={handleToggleDesigner}
            settingType={settingType}
          />
        ))}
      </div>
    </>
  )
}
