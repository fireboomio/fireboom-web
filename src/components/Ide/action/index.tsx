import type { EditorProps } from '@swordjs/monaco-editor-react'
import Editor from '@swordjs/monaco-editor-react'
import { Button, message } from 'antd'
import { debounce } from 'lodash'
import type { FC } from 'react'
import { useRef, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import type { RunHookResponse } from '..'
import iconDebug from '../assets/debug.svg'
import iconDelBtn from '../assets/del-btn.svg'
import iconRefreshBtn from '../assets/refresh-btn.svg'
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
  const intl = useIntl()
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
        void message.warning(intl.formatMessage({ defaultMessage: '脚本内容不是json格式' }))
        return
      }
      setLoading(true)
      await props.onClickDebug(parseCode ?? {})
      setLoading(false)
    }
  }
  return (
    <div className={`${ideStyles['input-container']}`}>
      <div className="flex mb-1 justify-between">
        <div className="title">
          <FormattedMessage defaultMessage="输入" />
        </div>
        {props.expandAction && <img src={iconRefreshBtn} alt="Refresh" />}
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
              icon={<img src={iconDebug} alt="debug" className="mr-1" />}
              type="primary"
              className={ideStyles['save-btn']}
            >
              <FormattedMessage defaultMessage="调试" />
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
      <div className="flex mb-1 justify-between">
        <div className="title">输出</div>
        {props.expandAction && (
          <span
            className="cursor-pointer text-0px"
            onClick={debounce(handleClickClearLog, 1000, { leading: true })}
          >
            {props.expandAction && <img src={iconDelBtn} alt="删除" />}
          </span>
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
