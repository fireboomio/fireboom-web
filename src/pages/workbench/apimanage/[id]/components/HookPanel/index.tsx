import { values } from 'lodash'
import React, { useMemo } from 'react'
import useSWRImmutable from 'swr/immutable'

import requests from '@/lib/fetchers'
import EditPanel from '@/pages/workbench/apimanage/[id]/components/APIFlowChart/EditPanel'
import { useAPIManager } from '@/pages/workbench/apimanage/[id]/store'

import iconOff from './assets/off.svg'
import iconOn from './assets/on.svg'
import styles from './index.module.less'

export default function HookPanel({ id }: { id?: string }) {
  const [editingHook, setEditingHook] = React.useState<{ name: string; path: string } | null>(null)
  const { apiDesc, query } = useAPIManager(state => ({
    apiDesc: state.apiDesc,
    query: state.query
  }))
  const { data: hookInfo } = useSWRImmutable<any>(
    id ? `/operateApi/hooks/${id}` : null,
    requests.get
  )
  const hookList = useMemo(() => {
    if (!hookInfo) {
      return []
    }
    return [...values(hookInfo.globalHooks), ...values(hookInfo.operationHooks)].map(
      (hook: any) => ({
        name: hook.path.split('/').pop(),
        path: hook.path,
        switch: hook.switch
      })
    )
  }, [hookInfo])
  if (!id) {
    return null
  }
  return (
    <>
      <div className="pt-2.5 w-45">
        {hookList.map((hook: any) => (
          <div
            className={`${styles.line} ${hook.switch ? styles.active : ''}`}
            key={hook.name}
            onClick={() => {
              setEditingHook(hook)
            }}
          >
            <div className={styles.iconWrapper}>
              <img alt="" src={hook.switch ? iconOn : iconOff} />
            </div>
            {hook.name}
          </div>
        ))}
      </div>
      {editingHook && (
        <EditPanel
          apiName={(apiDesc?.path ?? '').split('/').pop() || ''}
          hasParams={!!(query ?? '').match(/\(\$\w+/)}
          hook={editingHook}
          onClose={() => setEditingHook(null)}
        />
      )}
    </>
  )
}
