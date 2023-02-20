import { useState } from 'react'
import { useParams } from 'react-router-dom'

import ApiConfig from '@/components/ApiConfig'
import { useAPIManager } from '@/pages/workbench/apimanage/[id]/store'
import { intl } from '@/providers/IntlProvider'

import APIFlowChart from '../APIFlowChart'
import HookPanel from '../HookPanel'
import iconAI from './assets/ai.svg'
import iconAIActive from './assets/ai-active.svg'
import iconClose from './assets/close.svg'
import iconConfig from './assets/config.svg'
import iconConfigActive from './assets/config-active.svg'
import iconFlow from './assets/flow.svg'
import iconFlowActive from './assets/flow-active.svg'
import iconHook from './assets/hook.svg'
import iconHookActive from './assets/hook-active.svg'
import styles from './index.module.less'

export default function RightSider() {
  const params = useParams()
  const [active, setActive] = useState<string>('hook')
  const { operationType } = useAPIManager(state => ({
    operationType: state.computed.operationType
  }))

  function clickToolbar(item: string) {
    if (active === item) {
      setActive('')
    } else {
      setActive(item)
    }
  }

  const items = [
    {
      key: 'ai',
      icon: iconAI,
      title: 'AI',
      iconActive: iconAIActive,
      content: ''
    },
    {
      key: 'flow',
      icon: iconFlow,
      title: intl.formatMessage({ defaultMessage: '流程图' }),
      iconActive: iconFlowActive,
      content: (
        <div className="w-102 h-full">
          <APIFlowChart id={params.id as string} />
        </div>
      )
    },
    {
      key: 'hook',
      icon: iconHook,
      title: intl.formatMessage({ defaultMessage: '钩子' }),
      iconActive: iconHookActive,
      content: <HookPanel id={params.id} />
    },
    {
      key: 'config',
      icon: iconConfig,
      title: intl.formatMessage({ defaultMessage: '配置' }),
      iconActive: iconConfigActive,
      content: (
        <div className="w-70 h-full">
          <ApiConfig operationType={operationType} type="panel" id={Number(params.id)} />
        </div>
      )
    }
  ]

  // 屏蔽AI
  items.shift()

  const currentItem = items.find(item => item.key === active)
  const currentContent = currentItem?.content ?? ''
  const currentTitle = currentItem?.title ?? ''

  return (
    <div className="flex flex-shrink-0">
      {currentContent && (
        <div className={styles.panel}>
          <div className={styles.panelHead}>
            {currentTitle}
            <div
              className="flex w-10 h-10 items-center justify-center cursor-pointer"
              onClick={() => setActive('')}
            >
              <img alt="" src={iconClose} />
            </div>
          </div>
          {currentContent}
        </div>
      )}
      <div className={styles.toolbar}>
        {items.map(item => (
          <div
            key={item.key}
            className={`${styles.item} ${active === item.key ? styles.active : ''}`}
            onClick={() => clickToolbar(item.key)}
          >
            <img alt="" src={active === item.key ? item.iconActive : item.icon} className="w-4.5" />
          </div>
        ))}
      </div>
    </div>
  )
}
