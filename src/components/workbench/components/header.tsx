import { Image, message } from 'antd'
import { useNavigate } from 'react-router-dom'

import requests from '@/lib/fetchers'

import HeaderCompile from '../assets/header-compile.png'
import HeaderDeploy from '../assets/header-deploy.png'
import HeaderPreview from '../assets/header-preview.png'
import styles from './header.module.scss'

export default function Header(props: { onToggleSider: () => void }) {
  const navigate = useNavigate()

  return (
    <div className={styles.header}>
      <div className={styles.dashboardIcon} onClick={() => props.onToggleSider()} />
      <div className={styles.logo} onClick={() => navigate('/workbench')} />
      <div className={styles.splitLine} />
      <div className={styles.title}>后台管理系统</div>
      <div className={styles.titleIcon} />
      <div className="flex-1" />
      <div
        className={styles.headBtn}
        onClick={() =>
          void requests.get('/wdg/reStart').then(() => void message.success('正在重启!'))
        }
      >
        <img src={HeaderCompile} className="w-5.25 h-5" />
      </div>
      <div className={styles.headBtn}>
        <img src={HeaderPreview} className="w-5 h-5" />
      </div>
      <div className={styles.headBtn}>
        <img src={HeaderDeploy} className="w-5 h-5" />
      </div>
      {/*<div className={styles.headBtn}>*/}
      {/*  <HeaderDeploy />*/}
      {/*</div>*/}
      {/*<div className={styles.headBtn}>*/}
      {/*  <HeaderPreview />*/}
      {/*</div>*/}
      <div className={styles.splitLine} style={{ margin: '0 26px' }} />

      <div className={styles.helpIcon} onClick={() => navigate('/workbench/help')} />
      <div className={styles.configIcon} onClick={() => navigate('/workbench/setting')} />
      <div className={styles.avatar}>
        <Image width={20} height={20} preview={false} alt="avatar" src="/assets/total-user.png" />
      </div>
    </div>
  )
}
