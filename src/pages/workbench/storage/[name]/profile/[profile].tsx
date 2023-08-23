import { message } from 'antd'
import { cloneDeep } from 'lodash'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { useNavigate, useParams } from 'react-router-dom'

import IdeContainer from '@/components/Ide'
import FbTabs from '@/components/Tabs'
import { mutateStorage, useStorageList } from '@/hooks/store/storage'
import requests from '@/lib/fetchers'
import type { ApiDocuments } from '@/services/a2s.namespace'

import styles from './[profile].module.less'
import Form from './Form'

export default function StorageProfile() {
  const intl = useIntl()
  const { name, profile } = useParams()
  const navigate = useNavigate()
  const currentName = useRef<string>() // 当前storageId，用于在切换storage时清空tabs
  const [tabs, setTabs] = useState<{ key: string; label: string }[]>([])
  const storageList = useStorageList()
  const [activeTab, setActiveTab] = useState('base')
  useEffect(() => {
    if (currentName.current !== name) {
      currentName.current = name
      setTabs([{ key: profile!, label: profile! }])
    } else {
      setTabs(tabs => {
        tabs = cloneDeep(tabs)
        if (!tabs.find(x => x.key === profile)) {
          tabs.push({ key: profile!, label: profile! })
        }
        const storage = storageList?.find(x => x.name === name)
        tabs = tabs.filter(x => storage?.uploadProfiles?.[x.key])
        return tabs
      })
    }
  }, [name, profile, storageList])
  // 当前选中的配置
  const currentStorage = useMemo(() => {
    return storageList?.find(x => x.name === name)
  }, [storageList, name])
  const currentProfile = useMemo(() => {
    const storage = storageList?.find(x => x.name === name)
    if (storage) {
      return storage.uploadProfiles?.[profile ?? '']
    }
  }, [storageList, profile, name])
  const saveProfile = async (values: ApiDocuments.S3UploadProfile) => {
    // const storage = cloneDeep(storageList?.find(x => x.name === name))!
    // storage.uploadProfiles![profile!] = {
    //   ...storage.uploadProfiles![profile!],
    //   ...values
    // }
    await requests.put('/storage', {
      name,
      uploadProfiles: {
        [profile as string]: values
      }
    })
    message.success(intl.formatMessage({ defaultMessage: '保存成功' }))
    void mutateStorage()
    // 如果前置钩子改变了
    if (currentProfile?.hooks.preUpload != values.hooks.preUpload) {
      // updateHookEnabled(`uploads/${storage!.name}/${profile}/preUpload`, values.hooks.preUpload)
    }
    // 如果后置钩子改变了
    if (currentProfile?.hooks.postUpload != values.hooks.postUpload) {
      // updateHookEnabled(`uploads/${storage!.name}/${profile}/postUpload`, values.hooks.postUpload)
    }
  }
  if (!currentProfile) {
    return null
  }
  return (
    <div className={styles.container}>
      <FbTabs
        activeKey={profile!}
        onClick={item => {
          navigate(`/workbench/storage/${name}/profile/${item.key}`)
        }}
        items={tabs}
        onClose={item => {
          setTabs(tabs => tabs.filter(x => x.key !== item.key))
        }}
      />
      <div className={styles.content}>
        {/*<Tabs*/}
        {/*  animated={false}*/}
        {/*  activeKey={activeTab}*/}
        {/*  onChange={key => setActiveTab(key)}*/}
        {/*  items={[*/}
        {/*    {*/}
        {/*      key: 'base',*/}
        {/*      label: '基本设置'*/}
        {/*    },*/}
        {/*    {*/}
        {/*      key: 'pre',*/}
        {/*      label: '前置钩子'*/}
        {/*    },*/}
        {/*    { key: 'post', label: '后置钩子' }*/}
        {/*  ]}*/}
        {/*/>*/}
        <div className={styles.title}>{intl.formatMessage({ defaultMessage: '基本设置' })}</div>
        {activeTab === 'base' && (
          <Form storageName={currentStorage!.name} onSave={saveProfile} profile={currentProfile} />
        )}
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
