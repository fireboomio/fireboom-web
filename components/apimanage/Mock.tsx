import { ExclamationCircleOutlined } from '@ant-design/icons'
import Editor, { loader } from '@monaco-editor/react'
import { Switch } from 'antd'
import { FC, useEffect, useState } from 'react'

import { DirTreeNode, MockResp } from '@/interfaces/apimanage'
import requests, { getFetcher } from '@/lib/fetchers'

import styles from './Mock.module.scss'

loader.config({ paths: { vs: 'https://cdn.bootcdn.net/ajax/libs/monaco-editor/0.33.0/min/vs' } })

type MockProps = { node: DirTreeNode | undefined }

const Mock: FC<MockProps> = ({ node }) => {
  const [mock, setMock] = useState<MockResp>()
  const [refreshFlag, setRefreshFlag] = useState<boolean>()

  useEffect(() => {
    if (!node) return
    getFetcher<MockResp>(`/operateApi/getMock/${node.id}`)
      .then(res => setMock(res))
      .catch((err: Error) => {
        throw err
      })
  }, [node, refreshFlag])

  function handleEditorChange(value: string | undefined) {
    if (!value) return

    setMock({
      content: value,
      mockSwitch: mock?.mockSwitch ?? false,
    })
  }

  const save = () => {
    if (!node) return
    void requests
      .put(`/operateApi/updateMock/${node.id}`, {
        mockSwitch: mock?.mockSwitch,
        content: mock?.content,
      })
      .then(() => setRefreshFlag(!refreshFlag))
  }

  function toggleSwitch() {
    if (!node) return
    void requests
      .put(`/operateApi/updateMock/${node.id}`, {
        mockSwitch: !mock?.mockSwitch,
        content: mock?.content,
      })
      .then(() => setRefreshFlag(!refreshFlag))
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="text-[#00000040] flex items-center">
          <ExclamationCircleOutlined />
          <span className="text-12px leading-17px ml-2">主要用于日志等副作用操作</span>
        </div>

        <div className="space-x-4 flex items-center">
          <div className="text-[#E92E5E] cursor-pointer" onClick={save}>
            <span className="leading-20px ml-1">保存</span>
          </div>
          <Switch onClick={toggleSwitch} checked={mock?.mockSwitch} />
        </div>
      </div>

      <Editor
        height="90vh"
        defaultLanguage="typescript"
        defaultValue="// 请编辑 Mock"
        value={mock?.content}
        onChange={value => handleEditorChange(value)}
        className={`mt-4 ${styles.monaco}`}
      />
    </>
  )
}

export default Mock
