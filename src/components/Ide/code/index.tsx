import type { EditorProps } from '@monaco-editor/react'
import Editor from '@monaco-editor/react'
import type { FC } from 'react'

import styles from './../subs.module.less'
import ideStyles from './index.module.less'

interface Props {
  value?: string
  path?: string
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
        path={`inmemory://model/hook/${props.path}.ts`}
        language={props.defaultLanguage ?? 'typescript'}
        value={props.value}
        onChange={value => {
          if (props.onChange) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            props.onChange(value)
          }
        }}
        // ==========
        // 2023-02-10
        // monaco-editor/react 组件在 isMonacoMounting 和 isEditorReady 都是 false 时(即 Monaco 加载完毕，editor 未初始化)时，
        // 会调用 createEditor 创建编辑器，但是如果在创建过程中 props.options 发生了变化，会导致 creteEditor 重复调用，导致创建了多个编辑器
        // 为了避免这个问题，此处的 options 移除了此前的浅克隆逻辑，避免 options 的引用地址发生变化，绕过 createEditor 重复调用的bug
        // PS: 目前版本下列 prop 会触发此bug，请避免在初始化过程中修改这些 prop
        //     defaultValue
        //     defaultLanguage,
        //     defaultPath
        //     value
        //     language
        //     path
        //     options
        //     overrideServices
        //     saveViewState
        //     theme
        // ==========
        options={props.editorOptions}
        beforeMount={props.onBeforeMount}
        onMount={props.onMount}
        keepCurrentModel={true}
        className={`mt-4 ${styles.monaco}`}
      />
      {/* 是否展开输入和输出区域 */}
      {/*<div*/}
      {/*  className="show-more flex items-center justify-center cursor-pointer"*/}
      {/*  onClick={props.onClickExpandAction}*/}
      {/*>*/}
      {/*  {props.expandAction ? (*/}
      {/*    <img src={iconDoubleLeft} alt="折叠" style={{ transform: 'rotate(-90deg)' }} />*/}
      {/*  ) : (*/}
      {/*    <img src={iconDoubleLeft} alt="展开" style={{ transform: 'rotate(90deg)' }} />*/}
      {/*  )}*/}
      {/*  <span className="ml-2">{props.expandAction ? '收起' : '展开'}</span>*/}
      {/*</div>*/}
    </div>
  )
}

export default IdeCodeContainer
