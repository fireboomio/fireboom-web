import { AppleOutlined, CaretRightOutlined } from '@ant-design/icons'
import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'

import SettingMainAppearance from './subs/setting-main-appearance'
import SettingMainCrossdomain from './subs/setting-main-crossdomain'
import SettingMainEnvironmentVariable from './subs/setting-main-environment-variable'
import SettingMainSecurity from './subs/setting-main-security'
import SettingMainSystem from './subs/setting-main-system'
import SettingMainVersion from './subs/setting-main-version'

interface Props {
  showType: string
}

export default function SettingContainer({ showType }: Props) {
  const [viewer, setViewer] = useImmer<React.ReactNode>('')
  const [title, setTitle] = useImmer<React.ReactNode>('')
  const handleIconClick = () => {
    console.log('aaa')
  }

  useEffect(() => {
    console.log(showType)
    switch (showType) {
      case 'colorTheme':
        setTitle('外观')
        setViewer(<SettingMainAppearance />)
        break
      case 'system':
        setTitle('系统')
        setViewer(<SettingMainSystem />)
        break
      case 'secure':
        setTitle('安全')
        setViewer(<SettingMainSecurity />)
        break
      case 'cors':
        setTitle('跨域')
        setViewer(<SettingMainCrossdomain />)
        break
      case 'API Token':
        setTitle('API Token')
        setViewer(<div>Api Token</div>)
        break
      case 'path':
        setTitle('环境变量')
        setViewer(<SettingMainEnvironmentVariable />)
        break
      case 'version':
        setTitle('版本')
        setViewer(<SettingMainVersion />)
        break
      default:
        setViewer(<div>error</div>)
        break
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showType])

  return (
    <div className="pl-6 pr-10 mt-6">
      <div className="flex justify-start items-center mb-5 ">
        <span className="text-lg flex-grow font-bold">
          设置 <CaretRightOutlined /> {title}
        </span>
        <AppleOutlined className="text-base" onClick={handleIconClick} />
        <AppleOutlined className="text-base ml-4" onClick={handleIconClick} />
        <AppleOutlined className="text-base ml-4" onClick={handleIconClick} />
      </div>
      {viewer}
    </div>
  )
}
