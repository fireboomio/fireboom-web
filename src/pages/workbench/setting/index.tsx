import { Col, Row } from 'antd'
import { useContext, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useImmer } from 'use-immer'

import IconSetting from '/assets/workbench/header-setting.png'
import { SettingContainer, SettingPannel } from '@/components/setting'
import type { SettingType } from '@/interfaces/setting'
import { WorkbenchContext } from '@/lib/context/workbenchContext'

import styles from './index.module.less'

export default function Setting() {
  const { setFullscreen } = useContext(WorkbenchContext)
  const [showType, setShowType] = useImmer('data')

  // 进入设置页面时，自动全屏
  useEffect(() => {
    setFullscreen(true)
  }, [])

  // TODO: need refine

  function handleToggleDesigner(settingType: SettingType) {
    setShowType(settingType.type)
  }

  return (
    <div className="flex flex-col h-full">
      <div
        className="flex-0 h-56px bg-white flex items-center pl-8"
        style={{ border: '1px solid rgba(95,98,105,0.1)' }}
      >
        <img alt="设置" src={IconSetting} className="w-4 h-4 mr-2" />
        <span className="text-default font-medium">设置</span>
      </div>
      <div className="flex flex-1">
        <Col className="w-188px flex-0">
          <SettingPannel showType={showType} handleToggleDesigner={handleToggleDesigner} />
        </Col>
        <Col className="flex-1">
          <SettingContainer showType={showType} />
        </Col>
      </div>
    </div>
  )
}
