import { Image } from  'antd'

import styles from './header.module.scss'
export default function header() {


  return (
    <div className={styles.header}>
      <div className={styles.dashboardIcon}/>
      <div className={styles.logo}/>
      <div className={styles.splitLine}/>
      <div className={styles.title}>测试标题</div>
      <div className={styles.titleIcon}/>
      <div className="flex-1"/>
      <div className={styles.headBtn}>
        <image />
      </div>
      <div className={styles.headBtn}>
        <image />
      </div>
      <div className={styles.headBtn}>
        <image />
      </div>
      <div className={styles.splitLine} style={{ margin:'0 26px' }}/>

      <div className={styles.helpIcon}/>
      <div className={styles.configIcon}/>
      <div className={styles.avatar}><Image width={20} height={20} preview={false} alt="avatar" src="/assets/total-user.png"/></div>
    </div>
  )
}
