import { Col } from 'antd'
import { useContext, useEffect } from 'react'
import { useImmer } from 'use-immer'

import type { SettingType } from '@/interfaces/setting'
import { WorkbenchContext } from '@/lib/context/workbenchContext'

import Container from './setting/components/Container'
import Pannel from './setting/components/Pannel'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

export default function Setting() {
  const location = useLocation()
  const { setFullscreen } = useContext(WorkbenchContext)
  const navigate = useNavigate()

  // 进入设置页面时，自动全屏
  useEffect(() => {
    setFullscreen(true)
  }, [])

  // TODO: need refine

  const showType = location.pathname.match(/^\/workbench\/setting\/.+$/)?.[0]
  useEffect(() => {
    console.log('showType', showType)
    if (!showType) {
      navigate('/workbench/setting/appearance', { replace: true })
    }
  }, [showType])

  function handleToggleDesigner(settingType: SettingType) {
    navigate(`/workbench/setting/${settingType.type}`, { replace: true })
  }

  return (
    <div className="flex flex-col h-full">
      <div
        className="flex-0 h-56px bg-white flex items-center pl-8"
        style={{ border: '1px solid rgba(95,98,105,0.1)' }}
      >
        <img alt="设置" src="/assets/workbench/header-setting.png" className="w-4 h-4 mr-2" />
        <span className="text-default font-medium">设置</span>
      </div>
      <div className="flex flex-1 min-h-0">
        <Col className="w-188px flex-0">
          <Pannel showType={showType} handleToggleDesigner={handleToggleDesigner} />
        </Col>
        <Col className="flex-1 min-w-0 h-full overflow-y-auto bg-white">
          <Outlet />
        </Col>
      </div>
    </div>
  )
}
