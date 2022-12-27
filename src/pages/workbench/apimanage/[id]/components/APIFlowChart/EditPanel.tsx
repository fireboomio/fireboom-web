import { Drawer } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { FormattedMessage } from 'react-intl'

import IdeContainer from '@/components/Ide'

import { useAPIManager } from '../../store'
import backArrow from './assets/back-arrow.svg'
import styles from './editPanel.module.less'

interface Props {
  onClose: () => void
  apiName: string
  hasParams?: boolean
  hook: { name: string; path: string }
}
export default function EditPanel({ onClose, hook, apiName, hasParams = false }: Props) {
  const apiContainerRef = useRef<HTMLDivElement>(document.querySelector('#api-editor-container'))
  const { refreshAPI } = useAPIManager()
  const [title, setTitle] = useState<string>()
  useEffect(() => {
    setTitle(hook.path)
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
            <FormattedMessage defaultMessage="返回文件" />
          </div>
          <div className={styles.split} />
          <div className={styles.title}>{title}</div>
        </div>
      }
    >
      <IdeContainer
        onSelectHook={setTitle}
        onChangeEnable={refreshAPI}
        hookPath={hook.path}
        hasParams={hasParams}
        defaultLanguage="typescript"
      />
    </Drawer>
  ) : null
}
