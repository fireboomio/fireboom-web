import { ExclamationCircleOutlined } from '@ant-design/icons'
import Editor, { loader } from '@monaco-editor/react'
import { Switch } from 'antd'
import { FC, useEffect, useMemo, useState } from 'react'
import { useImmer } from 'use-immer'

import RcTab from '@/components/rc-tab'
import { DirTreeNode, HookName, HookResp } from '@/interfaces/apimanage'
import requests, { getFetcher } from '@/lib/fetchers'

import styles from './Hook.module.scss'

loader.config({ paths: { vs: 'https://cdn.bootcdn.net/ajax/libs/monaco-editor/0.33.0/min/vs' } })

type HookProps = { node: DirTreeNode | undefined }

const tabs = [
  { key: 'preResolve', title: 'preResolve' },
  { key: 'postResolve', title: 'postResolve' },
  { key: 'customResolve', title: 'customResolve' },
  { key: 'mutatingPreResolve', title: 'mutatingPreResolve' },
  { key: 'mutatingPostResolve', title: 'mutatingPostResolve' },
]

const Hook: FC<HookProps> = ({ node }) => {
  const [activeKey, setActiveKey] = useState<HookName>('preResolve')
  const [hooks, setHooks] = useImmer<HookResp[]>([])
  const [refreshFlag, setRefreshFlag] = useState<boolean>()

  useEffect(() => {
    if (!node) return
    getFetcher<HookResp[]>(`/operateApi/hooks/${node.id}`)
      .then((res) => setHooks(res))
      .catch((err: Error) => {
        throw err
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshFlag])

  useEffect(() => {
    if (!node) return

    void requests
      .get<unknown, HookResp[]>(`/operateApi/hooks/${node.id}`)
      .then((res) => setHooks(res))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node])

  const currHook = useMemo(() => hooks?.find((x) => x.hookName === activeKey), [activeKey, hooks])

  const save = () => {
    if (!node) return
    void requests.put(`/operateApi/hooks/${node.id}`, {
      hookName: activeKey,
      content: currHook?.content,
      hookSwitch: currHook?.hookSwitch,
    })
    setRefreshFlag(!refreshFlag)
  }

  function handleEditorChange(value: string | undefined) {
    if (!value) return

    setHooks((draft) => {
      let hook = draft.find((x) => x.hookName === activeKey)
      if (!hook) hook = { content: '', fileName: '', hookName: activeKey, hookSwitch: false }
      hook.content = value
    })
  }

  function toggleSwitch() {
    if (!node) return
    void requests.put(`/operateApi/hooks/${node.id}`, {
      HookName: activeKey,
      hookSwitch: !currHook?.hookSwitch,
      content: currHook?.content,
    })
    setRefreshFlag(!refreshFlag)
  }

  return (
    <div>
      {/* @ts-ignore */}
      <RcTab tabs={tabs} onTabClick={setActiveKey} activeKey={activeKey} />

      <div className="mt-4">
        <div className="flex justify-between items-center">
          <div className="text-[#00000040] flex items-center">
            <ExclamationCircleOutlined />
            <span className="text-12px leading-17px ml-2">主要用于日志等副作用操作</span>
          </div>
          <div className="space-x-4 flex items-center">
            {/* <div className="text-[#E92E5E]">
              <CaretRightOutlined />
              <span className="leading-20px ml-1">测试</span>
            </div>
            <div className="text-[#E92E5E]">
              <PlusCircleOutlined />
              <span className="leading-20px ml-1">添加</span>
            </div>
            <div className="text-[#E92E5E]">
              <MenuOutlined />
              <span className="leading-20px ml-1">管理</span>
            </div> */}
            <div className="text-[#E92E5E] cursor-pointer" onClick={save}>
              <span className="leading-20px ml-1">保存</span>
            </div>
            <Switch onClick={toggleSwitch} checked={currHook?.hookSwitch} />
          </div>
        </div>

        <Editor
          height="90vh"
          defaultLanguage="typescript"
          defaultValue="// 请编辑勾子"
          value={currHook?.content}
          onChange={(value) => handleEditorChange(value)}
          className={`mt-4 ${styles.monaco}`}
        />
      </div>
    </div>
  )
}

export default Hook
