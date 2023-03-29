import { message, Tabs } from 'antd'
import { cloneDeep } from 'lodash'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { useNavigate, useParams } from 'react-router-dom'

import IdeContainer from '@/components/Ide'
import FbTabs from '@/components/Tabs'
import { mutateStorage, useStorageList } from '@/hooks/store/storage'
import requests from '@/lib/fetchers'

import styles from './[profile].module.less'
import Form from './Form'

export default function StorageProfile() {
  const intl = useIntl()
  const { id, profile } = useParams()
  const navigate = useNavigate()
  const currentId = useRef<string>() // 当前storageId，用于在切换storage时清空tabs
  const [tabs, setTabs] = useState<{ key: string; label: string }[]>([])
  const storageList = useStorageList()
  const [activeTab, setActiveTab] = useState('base')
  useEffect(() => {
    if (currentId.current !== id) {
      currentId.current = id
      setTabs([{ key: profile!, label: profile! }])
    } else {
      setTabs(tabs => {
        tabs = cloneDeep(tabs)
        if (!tabs.find(x => x.key === profile)) {
          tabs.push({ key: profile!, label: profile! })
        }
        const storage = storageList?.find(x => String(x.id) === id)
        tabs = tabs.filter(x => storage?.config.uploadProfiles?.[x.key])
        return tabs
      })
    }
  }, [id, profile, storageList])
  // 当前选中的配置
  const currentStorage = useMemo(() => {
    return storageList?.find(x => String(x.id) === id)
  }, [storageList, id])
  const currentProfile = useMemo(() => {
    const storage = storageList?.find(x => String(x.id) === id)
    if (storage) {
      return storage.config.uploadProfiles?.[profile ?? '']
    }
  }, [storageList, profile, id])
  const saveProfile = async (values: any) => {
    const storage = cloneDeep(storageList?.find(x => String(x.id) === id))!
    storage.config.uploadProfiles![profile!] = {
      ...storage.config.uploadProfiles![profile!],
      ...values
    }
    await requests.put('/storageBucket ', storage)
    message.success(intl.formatMessage({ defaultMessage: '保存成功' }))
    void mutateStorage()
  }
  if (!currentProfile) {
    return null
  }
  return (
    <div className={styles.container}>
      <FbTabs
        activeKey={profile!}
        onClick={item => {
          navigate(`/workbench/storage/${id}/profile/${item.key}`)
        }}
        items={tabs}
        onClose={item => {
          setTabs(tabs => tabs.filter(x => x.key !== item.key))
        }}
      />
      <div className={styles.content}>
        <Tabs
          animated={false}
          activeKey={activeTab}
          onChange={key => setActiveTab(key)}
          items={[
            {
              key: 'base',
              label: '基本设置'
            },
            {
              key: 'pre',
              label: '前置钩子'
            },
            { key: 'post', label: '后置钩子' }
          ]}
        />
        {activeTab === 'base' && <Form onSave={saveProfile} profile={currentProfile} />}
        {activeTab === 'pre' && (
          <IdeContainer
            key={profile + 'preUpload'}
            onChangeEnable={void 0}
            hookPath={`uploads/${currentStorage?.name}/${profile}/preUpload`}
            defaultLanguage="typescript"
          />
        )}
        {activeTab === 'post' && (
          <IdeContainer
            key={profile + 'postUpload'}
            onChangeEnable={void 0}
            hookPath={`uploads/${currentStorage?.name}/${profile}/postUpload`}
            defaultLanguage="typescript"
          />
        )}
      </div>
    </div>
  )
}
