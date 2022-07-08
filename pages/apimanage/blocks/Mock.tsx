import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Switch } from 'antd'
import Editor from '@monaco-editor/react'
import styles from './Mock.module.scss'
import type { FC } from 'react'

type MockProps = {
  //
}

const Mock: FC<MockProps> = () => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="text-[#00000040] flex items-center">
          <ExclamationCircleOutlined />
          <span className="text-12px leading-17px ml-2">主要用于日志等副作用操作</span>
        </div>
        <Switch defaultChecked />
      </div>
      <Editor
        height="90vh"
        defaultLanguage="typescript"
        defaultValue="// some comment"
        className={`mt-4 ${styles.monaco}`}
      />
    </div>
  )
}

export default Mock
