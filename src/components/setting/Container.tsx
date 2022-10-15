import { CaretRightOutlined } from '@ant-design/icons'
import type React from 'react'
import { useEffect } from 'react'
import { useImmer } from 'use-immer'

import IconFont from '../iconfont'
import SettingMainAppearance from './subs/Appearance'
import SettingMainCrossdomain from './subs/Crossdomain'
import SettingMainEnvironmentVariable from './subs/EnvironmentVariable'
import SettingMainSecurity from './subs/Security'
import SettingMainSystem from './subs/System'
import SettingMainVersion from './subs/Version'

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
      // case 'API Token':
      //   setTitle('API Token')
      //   setViewer(<div>Api Token</div>)
      //   break
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

  return viewer
}
