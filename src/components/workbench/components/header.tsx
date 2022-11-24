import { CloudDownloadOutlined, ShareAltOutlined } from '@ant-design/icons'
import { message, Popover } from 'antd'
import { useContext, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { WorkbenchContext } from '@/lib/context/workbenchContext'
import requests from '@/lib/fetchers'
import { ServiceStatus } from '@/pages/workbench/apimanage/crud/interface'

import HeaderCompile from '../assets/header-compile.png'
import HeaderDeploy from '../assets/header-deploy.png'
import HeaderPreview from '../assets/header-preview.png'
import styles from './header.module.less'

export default function Header(props: { onToggleSider: () => void; engineStatus?: ServiceStatus }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { isFullscreen } = useContext(WorkbenchContext)

  const [open, setOpen] = useState(false)

  const compiling =
    props.engineStatus === ServiceStatus.Compiling || props.engineStatus === ServiceStatus.Starting

  return (
    <>
      <div className={styles.header}>
        <div
          className={!isFullscreen ? styles.dashboardIcon : styles.dashboardIcon2}
          onClick={() => props.onToggleSider()}
        />
        <div className={styles.logo} onClick={() => navigate('/workbench')} />
        <div className={styles.splitLine} />
        <div className={styles.title}>后台管理系统</div>
        <div className={styles.titleIcon} />
        <div className="flex-1" />
        {pathname === '/workbench/rapi' ? (
          <>
            <ShareAltOutlined style={{ fontSize: '18px' }} className="cursor-pointer" />

            <Popover
              color="#2A2B2CFF"
              content={
                <div>
                  <a
                    className="text-[#f0f8ff]"
                    onClick={() => setOpen(false)}
                    href="/api/v1/file/DownloadPostman"
                    download="Postman"
                  >
                    下载 POSTMAN
                  </a>
                  <br />
                  <a
                    className="text-[#f0f8ff]"
                    onClick={() => setOpen(false)}
                    href="/api/v1/file/postToSwag"
                    download="OpenAPI"
                  >
                    下载 OpenAPI
                  </a>
                  <br />
                  <a
                    className="text-[#f0f8ff]"
                    onClick={() => setOpen(false)}
                    href="/api/v1/operateApi/sdk"
                    download="SDK"
                  >
                    下载 React SDK
                  </a>
                </div>
              }
              title={false}
              trigger="click"
              open={open}
              onOpenChange={v => setOpen(v)}
            >
              <CloudDownloadOutlined style={{ fontSize: '18px' }} className="ml-7 cursor-pointer" />
            </Popover>
          </>
        ) : (
          <>
            <div
              className={styles.headBtn}
              onClick={() => {
                if (compiling) {
                  return
                }
                void requests.get('/wdg/reStart').then(() => void message.success('开始编译...'))
              }}
            >
              {!compiling ? (
                <img src={HeaderCompile} className="h-5 w-5.25" alt="编译" />
              ) : (
                <img src="/assets/compile.gif" className={styles.compiling} alt="编译" />
              )}
            </div>
            <div
              className={styles.headBtn}
              onClick={() => window.open('/#/workbench/rapi', '_blank')}
            >
              <img src={HeaderPreview} className="h-5 w-5" alt="预览" />
            </div>
            <div className={styles.headBtn}>
              <img src={HeaderDeploy} className="h-5 w-5" alt="部署" />
            </div>
          </>
        )}
        <div className={styles.splitLine} style={{ margin: '0 26px' }} />

        <div
          className="w-4 h-4 cursor-pointer flex-0 text-0px"
          onClick={() => window.open('https://doc.fireboom.io/', '_blank')}
        >
          <img className="w-4 h-4" src="/assets/github.svg" alt="" />
        </div>
        <div className={styles.helpIcon} onClick={() => navigate('/workbench/help')} />
        <div className={styles.configIcon} onClick={() => navigate('/workbench/setting')} />
        <div className={styles.avatar}>
          <img className="h-5 w-5" alt="avatar" src="/assets/total-user.png" />
        </div>
      </div>
    </>
  )
}
