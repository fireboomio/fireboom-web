import { Drawer } from 'antd'
import { useEffect, useRef, useState } from 'react'

import IdeContainer from '@/components/Ide'
import getDefaultCode from '@/components/Ide/getDefaultCode'

import { useAPIManager } from '../../store'
import backArrow from './assets/back-arrow.svg'
import styles from './editPanel.module.less'

interface Props {
  onClose: () => void
  apiName: string
  hook: { name: string; path: string }
}
export default function EditPanel({ onClose, hook, apiName }: Props) {
  const apiContainerRef = useRef<HTMLDivElement>(document.querySelector('#api-editor-container'))
  const { refreshAPI } = useAPIManager()
  const [defaultCode, setDefaultCode] = useState<string>()
  useEffect(() => {
    getDefaultCode(hook.name).then(res => {
      setDefaultCode(res.replaceAll('$HOOK_NAME$', apiName))
    })
  }, [hook.name])
  return apiContainerRef.current ? (
    <Drawer
      className={styles.drawer}
      width="100%"
      placement="right"
      onClose={onClose}
      open
      getContainer={() => apiContainerRef.current!}
      style={{ position: 'absolute' }}
      extra={
        <div className="flex items-center">
          <div className={styles.back} onClick={onClose}>
            <img src={backArrow} alt="返回" className="mr-1" />
            返回文件
          </div>
          <div className={styles.split} />
          <div className={styles.title}>{hook.path.split('/').pop()}</div>
        </div>
      }
    >
      <IdeContainer
        onChange={refreshAPI}
        hookPath={hook.path}
        defaultCode={defaultCode}
        defaultLanguage="typescript"
      />
    </Drawer>
  ) : null
}
