import { Col } from 'antd'
import { Suspense, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import type { SettingType } from '@/interfaces/setting'

import settingIcon from './components/Workbench/assets/header-setting.png'
import Pannel from './setting/components/Pannel'

export default function Setting() {
  const location = useLocation()
  const navigate = useNavigate()

  const showType = location.pathname.match(/^\/workbench\/setting\/.+$/)?.[0]
  useEffect(() => {
    if (!showType) {
      navigate('/workbench/setting/appearance', { replace: true })
    }
  }, [navigate, showType])

  function handleToggleDesigner(settingType: SettingType) {
    navigate(`/workbench/setting/${settingType.type}`, { replace: true })
  }

  return (
    <div className="flex flex-col h-full">
      <div
        className="bg-white flex flex-0 h-56px pl-8 items-center"
        style={{ border: '1px solid rgba(95,98,105,0.1)' }}
      >
        <img alt="设置" src={settingIcon} className="h-4 mr-2 w-4" />
        <span className="font-medium text-default">
          <FormattedMessage defaultMessage="设置" />
        </span>
      </div>
      {showType && (
        <div className="flex flex-1 min-h-0">
          <Col className="flex-0 w-188px">
            <Pannel showType={showType} handleToggleDesigner={handleToggleDesigner} />
          </Col>
          <Col className="bg-white h-full flex-1 min-w-0 overflow-y-auto">
            <Suspense fallback={<div />}>
              <Outlet />
            </Suspense>
          </Col>
        </div>
      )}
    </div>
  )
}
