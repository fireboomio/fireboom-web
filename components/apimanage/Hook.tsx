import {
  ExclamationCircleOutlined,
  CaretRightOutlined,
  MenuOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons'
import Editor, { loader } from '@monaco-editor/react'
import { Switch } from 'antd'
import type { FC } from 'react'

import RcTab from '@/components/rc-tab'

import styles from './Hook.module.scss'

loader.config({ paths: { vs: 'https://cdn.bootcdn.net/ajax/libs/monaco-editor/0.33.0/min/vs' } })

type HookProps = {
  //
}

const tabs = [
  { key: '0', title: 'preResolve' },
  { key: '1', title: 'postResolve' },
  { key: '2', title: 'customResolve' },
  { key: '3', title: 'mutatingPostResolve' },
]

const Hook: FC<HookProps> = () => {
  return (
    <div>
      <RcTab tabs={tabs} />
      <div className="mt-4">
        <div className="flex justify-between items-center">
          <div className="text-[#00000040] flex items-center">
            <ExclamationCircleOutlined />
            <span className="text-12px leading-17px ml-2">主要用于日志等副作用操作</span>
          </div>
          <div className="space-x-4 flex items-center">
            <div className="text-[#E92E5E]">
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
            </div>
            <div className="text-[#E92E5E]">
              <span className="leading-20px ml-1">选择</span>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
        <Editor
          height="90vh"
          defaultLanguage="typescript"
          defaultValue="// some comment"
          className={`mt-4 ${styles.monaco}`}
        />
      </div>
    </div>
  )
}

export default Hook
