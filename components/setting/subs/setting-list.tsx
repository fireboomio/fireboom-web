import IconFont from '@/components/iconfont'
import type { SettingType } from '@/interfaces/setting'

import SettingItem from './setting-item'
interface Props {
  handleToggleDesigner: (settingType: SettingType) => void
}

const settingTypeList: SettingType[] = [
  {
    name: '外观',
    type: 'colorTheme',
    icon: <IconFont type="icon-waiguan" />,
  },
  {
    name: '系统',
    type: 'system',
    icon: <IconFont type="icon-xitong" />,
  },
  {
    name: '安全',
    type: 'secure',
    icon: <IconFont type="icon-anquan" />,
  },
  {
    name: '跨域',
    type: 'cors',
    icon: <IconFont type="icon-kuayu" />,
  },
  {
    name: 'API Token',
    type: 'API Token',
    icon: <IconFont type="icon-a-APItoken" />,
  },
  {
    name: '环境变量',
    type: 'path',
    icon: <IconFont type="icon-huanjingbianliang" />,
  },
  {
    name: '版本',
    type: 'version',
    icon: <IconFont type="icon-banben" />,
  },
]

export default function SettingList({ handleToggleDesigner }: Props) {
  return (
    <>
      <div className="mt-3">
        {settingTypeList.map((settingType) => (
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
