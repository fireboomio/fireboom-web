import type { EditorProps } from '@swordjs/monaco-editor-react'
import Editor from '@swordjs/monaco-editor-react'
import type { FC } from 'react'

import iconDoubleLeft from '../assets/double-left.svg'
import styles from './../subs.module.less'
import ideStyles from './index.module.less'

interface Props {
  value?: string
  defaultLanguage?: string
  expandAction: boolean
  fullScreen: boolean
  editorOptions: EditorProps['options']
  onBeforeMount: EditorProps['beforeMount']
  onMount: EditorProps['onMount']
  onChange?: (value?: string) => void
  onClickExpandAction: () => void
}

const IdeCodeContainer: FC<Props> = props => {
  return (
    <div
      className={`${ideStyles['code-container']} ${
        props.expandAction ? ideStyles['code-container-expand-action'] : ''
      } ${props.fullScreen ? ideStyles['code-container-full-screen'] : ''}`}
    >
      <Editor
        language={props.defaultLanguage ?? 'typescript'}
        value={props.value}
        onChange={value => {
          if (props.onChange) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            props.onChange(value)
          }
        }}
        options={{
          ...props.editorOptions
        }}
        beforeMount={props.onBeforeMount}
        onMount={props.onMount}
        keepCurrentModel={true}
        className={`mt-4 ${styles.monaco}`}
      />
      {/* 是否展开输入和输出区域 */}
      <div
        className="show-more flex items-center justify-center cursor-pointer"
        onClick={props.onClickExpandAction}
      >
        {props.expandAction ? (
          <img src={iconDoubleLeft} alt="折叠" style={{ transform: 'rotate(-90deg)' }} />
        ) : (
          <img src={iconDoubleLeft} alt="展开" style={{ transform: 'rotate(90deg)' }} />
        )}
        <span className="ml-2">{props.expandAction ? '收起' : '展开'}</span>
      </div>
    </div>
  )
}

export default IdeCodeContainer
