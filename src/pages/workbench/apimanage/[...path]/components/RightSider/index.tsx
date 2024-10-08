import { Tooltip } from 'antd'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'

import { useAPIManager } from '@/pages/workbench/apimanage/[...path]/store'
import ApiConfig from '../ApiConfig'

import APIFlowChart from '../APIFlowChart'
import HookPanel from '../HookPanel'
import iconAIActive from './assets/ai-active.svg'
import iconAI from './assets/ai.svg'
import iconClose from './assets/close.svg'
import iconConfigActive from './assets/config-active.svg'
import iconConfig from './assets/config.svg'
import iconFlowActive from './assets/flow-active.svg'
import iconFlow from './assets/flow.svg'
import iconHookActive from './assets/hook-active.svg'
import iconHook from './assets/hook.svg'
import styles from './index.module.less'

export default function RightSider() {
  const [active, setActive] = useState<string>('hook')
  const intl = useIntl()
  const { apiPath, operationType, schemaAST, apiDesc } = useAPIManager(state => ({
    apiPath: state.apiPath,
    operationType: state.computed.operationType,
    schemaAST: state.schemaAST,
    apiDesc: state.apiDesc
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
      content: schemaAST ? (
        <div className="w-102 h-full">
          <APIFlowChart apiPath={apiPath} />
        </div>
      ) : null,
      disableTip: !schemaAST ? intl.formatMessage({ defaultMessage: 'API内容为空' }) : null
    },
    {
      key: 'hook',
      icon: iconHook,
      title: intl.formatMessage({ defaultMessage: '钩子' }),
      iconActive: iconHookActive,
      content: <HookPanel apiPath={apiPath} key={apiDesc?.path} />
    },
    {
      key: 'config',
      icon: iconConfig,
      title: intl.formatMessage({ defaultMessage: '配置' }),
      iconActive: iconConfigActive,
      content: (
        <div className="w-80 h-full">
          <ApiConfig operationType={operationType} operationName={apiPath} />
        </div>
      )
    }
  ]

  // 屏蔽AI
  items.shift()

  const currentItem = items.find(item => item.key === active)
  const currentContent = currentItem?.content ?? ''
  const currentTitle = currentItem?.title ?? ''

  useEffect(() => {
    // 如果当前项被禁用，则自动关闭
    if (currentItem?.disableTip) {
      setActive('')
    }
  }, [currentItem])

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
          <Tooltip title={item.disableTip} placement="left" key={item.key}>
            <div
              className={`${styles.item} ${active === item.key ? styles.active : ''}`}
              onClick={() => clickToolbar(item.key)}
            >
              <img
                alt=""
                src={active === item.key ? item.iconActive : item.icon}
                className="w-4.5"
              />
            </div>
          </Tooltip>
        ))}
      </div>
    </div>
  )
}
