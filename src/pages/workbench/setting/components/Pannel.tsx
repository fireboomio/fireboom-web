import { useEffect } from 'react'

import type { SettingType } from '@/interfaces/setting'
import { intl } from '@/providers/IntlProvider'

// import styles from './Pannel.module.less'
import SettingItem from './subs/PannelItem'

interface Props {
  handleToggleDesigner: (settingType: SettingType) => void
  showType: string
}

const settingTypeList: SettingType[] = [
  {
    name: intl.formatMessage({ defaultMessage: '外观' }),
    type: 'appearance',
    icon: (
      <img alt="xxx" src="assets/iconfont/waiguan.svg" style={{ width: '1em', height: '1em' }} />
    )
  },
  {
    name: intl.formatMessage({ defaultMessage: '系统' }),
    type: 'system',
    icon: (
      <img alt="xitong" src="assets/iconfont/xitong.svg" style={{ height: '1em', width: '1em' }} />
    )
  },
  {
    name: intl.formatMessage({ defaultMessage: '安全' }),
    type: 'security',
    icon: (
      <img alt="anquan" src="assets/iconfont/anquan.svg" style={{ height: '1em', width: '1em' }} />
    )
  },
  {
    name: intl.formatMessage({ defaultMessage: '跨域' }),
    type: 'cross-domain',
    icon: (
      <img alt="kuayu" src="assets/iconfont/kuayu.svg" style={{ height: '1em', width: '1em' }} />
    )
  },
  // {
  //   name: 'API Token',
  //   type: 'API Token',
  //   icon: <img alt="a-APItoken" src="assets/iconfont/a-APItoken.svg" style={{height:'1em', width: '1em'}} />,
  // },
  {
    name: intl.formatMessage({ defaultMessage: 'SDK 模板' }),
    type: 'sdk-template',
    icon: (
      <img
        alt="huanjingbianliang"
        src="assets/iconfont/huanjingbianliang.svg"
        style={{ height: '1em', width: '1em' }}
      />
    )
  },
  {
    name: intl.formatMessage({ defaultMessage: '环境变量' }),
    type: 'environment-variable',
    icon: (
      <img
        alt="huanjingbianliang"
        src="assets/iconfont/huanjingbianliang.svg"
        style={{ height: '1em', width: '1em' }}
      />
    )
  },
  {
    name: intl.formatMessage({ defaultMessage: '版本' }),
    type: 'version',
    icon: (
      <img alt="banben" src="assets/iconfont/banben.svg" style={{ height: '1em', width: '1em' }} />
    )
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
