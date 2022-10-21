import { BugOutlined, DeleteOutlined, RedoOutlined } from '@ant-design/icons'
import type { EditorProps } from '@swordjs/monaco-editor-react'
import Editor from '@swordjs/monaco-editor-react'
import { Button, message } from 'antd'
import { debounce } from 'lodash'
import type { FC } from 'react'
import { useRef, useState } from 'react'

import type { RunHookResponse } from '..'
import styles from './../subs.module.less'
import ideStyles from './index.module.less'

interface Props {
  // 默认inputvalue
  defaultInputValue?: string
  // 输出日志列表
  runResult: RunHookResponse
  expandAction: boolean
  editorOptions: EditorProps['options']
  // 点击调试按钮
  onClickDebug: (code: Record<string, any>) => Promise<RunHookResponse>
  // 清空调试日志
  onClickClearLog: () => void
}

type EditorInputContainerProps = Pick<
  Props,
  'onClickDebug' | 'expandAction' | 'editorOptions' | 'defaultInputValue'
>

export const EditorInputContainer: FC<EditorInputContainerProps> = props => {
  const editorRef = useRef<any>(null)
  // debug运行中loading
  const [loading, setLoading] = useState<boolean>(false)
  // 点击调试按钮
  const onClickDebug = async () => {
    if (!loading) {
      // 获取脚本内容, 查看是否是json格式
      let parseCode
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        const code: string = editorRef.current.getValue().replace(/\s/g, '')
        parseCode = JSON.parse(code) as Record<string, any>
      } catch (error) {
        // 不是json格式
        void message.warning('脚本内容不是json格式')
        return
      }
      setLoading(true)
      await props.onClickDebug(parseCode ?? {})
      setLoading(false)
    }
  }
  return (
    <div className={`${ideStyles['input-container']}`}>
      <div className="flex justify-between">
        <div className="title">输入</div>
        {props.expandAction && (
          <RedoOutlined color="#C0C4CE" size={20} className="cursor-pointer mt-2" />
        )}
      </div>
      {props.expandAction && (
        <>
          <Editor
            language="json"
            height="80%"
            defaultValue={props.defaultInputValue}
            onMount={monacoEditor => {
              editorRef.current = monacoEditor
              monacoEditor.updateOptions({ minimap: { enabled: false } })
            }}
            options={{
              ...props.editorOptions
            }}
            className={`${styles.monaco}`}
          />
          <div className="debug">
            <Button
              onClick={debounce(onClickDebug, 1000, { leading: true })}
              loading={loading}
              icon={<BugOutlined />}
              type="primary"
              className={ideStyles['save-btn']}
            >
              调试
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

type EditorOutPutContainerProps = Pick<Props, 'expandAction' | 'runResult' | 'onClickClearLog'>

export const EditorOutPutContainer: FC<EditorOutPutContainerProps> = props => {
  // 点击清空按钮
  const handleClickClearLog = () => {
    void message.success('已清空调试结果')
    props.onClickClearLog()
  }
  return (
    <div className={`${ideStyles['output-container']}`}>
      <div className="flex justify-between">
        <div className="title">输出</div>
        {props.expandAction && (
          <DeleteOutlined
            onClick={debounce(handleClickClearLog, 1000, { leading: true })}
            color="#C0C4CE"
            size={20}
            className="cursor-pointer mt-2"
          />
        )}
      </div>
      {/* 控制台输出 */}
      {props.expandAction && (
        <div className="output">
          {/* 循环loglist二维数组 */}
          {props.runResult.logs
            .map((item, index) => {
              return (
                <div className="output-item" key={index}>
                  {'>'} {item.join(' ')}
                </div>
              )
            })
            .concat(
              <div className="output-item" key={props.runResult.logs.length}>
                {'> 函数执行结果:'} {JSON.stringify(props.runResult.result)}
              </div>
            )}
        </div>
      )}
    </div>
  )
}

const IdeActionContainer: FC<Props> = ({
  defaultInputValue,
  runResult,
  expandAction,
  editorOptions,
  onClickDebug,
  onClickClearLog
}) => {
  return (
    <div className={`${ideStyles['ide-action']} flex`}>
      <EditorInputContainer
        defaultInputValue={defaultInputValue}
        onClickDebug={onClickDebug}
        expandAction={expandAction}
        editorOptions={editorOptions}
      />
      <EditorOutPutContainer
        onClickClearLog={onClickClearLog}
        runResult={runResult}
        expandAction={expandAction}
      />
    </div>
  )
}

export default IdeActionContainer
