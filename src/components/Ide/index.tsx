import { DoubleRightOutlined } from '@ant-design/icons';
import { AutoTypings, LocalStorageCache } from '@swordjs/monaco-editor-auto-typings'
import type { EditorProps, OnMount } from '@swordjs/monaco-editor-react'
import { loader } from '@swordjs/monaco-editor-react';
import { Button } from 'antd';
import { debounce } from 'lodash';
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { FullScreen, useFullScreenHandle } from 'react-full-screen';

import { saveHookDepend, saveHookInput, saveHookScript, updateHookSwitch, getHook, runHook } from '@/lib/service/hook'

loader.config({ paths: { vs: '/modules/monaco-editor/min/vs' } });


import IdeActionContainer from './action/index'
import IdeCodeContainer from './code/index';
import IdeDependList from './depend-list/index'
import IdeHeaderContainer from './header/index'
import ideStyles from './ide.module.scss'


export const hookPath = {
  OperationPreResolve: (api: string) => `operations/${api}/preResolve`,
  OperationPostResolve: (api: string) => `operations/${api}/postResolve`,
  OperationMustomResolve: (api: string) => `operations/${api}/customResolve`,
  OperationMutatingPostResolve: (api: string) => `operations/${api}/mutatingPostResolve`,
  OperationMutatingPreResolve: (api: string) => `operations/${api}/mutatingPreResolve`,
  OperationMock: (api: string) => `operations/${api}/mock`,
  AuthPostAuthentication: 'auth/postAuthentication',
  AuthMutatingPostPreResolve: 'auth/mutatingPostPreResolve',
  Customize: (connect: string) => `customize/${connect}`,
  GlobalOnRequest: 'global/onRequest',
  GlobalOnResponse: 'global/onResponse'
}


export type Depend = { [key: string]: string }
export type Input = { [key: string]: any }
export type HookInfo = { script: string, scriptType: string, type: string, path: string, depend: Depend[] | null, input: Input | null, switch: boolean };
export type RunHookResponse = { logs: any[][], result: any }

// 保存的4种状态
export enum AutoSaveStatus {
  LOADED = 'loaded',
  SAVEING = 'saveing',
  SAVED = 'saved',
  EDIT = 'edit'
}

// 保存的payload类型
export type AutoSavePayload = {
  // 是主动还是被动
  type: 'active' | 'passive',
  // 保存状态
  status: AutoSaveStatus | null
}

export const editorOptions: EditorProps['options'] = {
  minimap: {
    enabled: true
  },
  overviewRulerLanes: 0,
  scrollbar: {
    vertical: 'hidden',
    horizontal: 'hidden',
    handleMouseWheel: false,
  }
}


// 实时保存代码的延迟时间
const SAVE_DELAY = 1000;

interface Props {
  hookPath: string,
  defaultLanguage?: string
  onChange?: (value?: string) => void
}


/**
 *
 * 代码ide容器
 * @param {*} props
 * @return {*}
 */
const IdeContainer: FC<Props> = props => {
  const defaultRunResult = { logs: [], result: '' };
  // 防止主动保存和被动保存冲突的timer
  const saveTimer = useRef<NodeJS.Timeout | null>(null);
  const handle = useFullScreenHandle();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const [editor, setEditor] = useState<any>();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const [monaco, setMonaco] = useState<any>();
  // depend
  const [depend, setDepend] = useState<Depend[]>([]);
  // 运行结果
  const [runResult, setRunResult] = useState<RunHookResponse>(defaultRunResult);
  const typingsRef = useRef<any>(null);
  // hook详情
  const [hookInfo, setHookInfo] = useState<HookInfo>();
  // 是否展开输入和输出区域
  const [expandAction, setExpandAction] = useState(false)
  // 是否全屏显示
  const [fullScreen, setFullScreen] = useState(false)
  // 是否缩小依赖区域
  const [smallDepend, setSmallDepend] = useState(false)
  const [savePayload, setPayload] = useState<AutoSavePayload>({
    type: 'passive',
    status: null
  });
  // 保存上一次的脚本内容
  const [lastScript, setLastScript] = useState<string>()

  // 获取hook信息
  useEffect(() => {
    void getHook<HookInfo>(props.hookPath).then(data => {
      // 更新payload
      setPayload({
        type: 'passive',
        status: AutoSaveStatus.LOADED
      })
      setHookInfo(data);
    })
  }, [])

  useEffect(() => {
    // 监听键盘的ctrl+s事件
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        // 执行主动保存
        handleSave('active')
        e.preventDefault();
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [editor, monaco])

  // 内置本地声明文件
  useEffect(() => {
    if (editor && monaco) {
      // const libSource = [
      //   'declare class Facts {',
      //   '    /**',
      //   '     * Returns the next fact',
      //   '     */',
      //   '    static next():string',
      //   '}'
      // ].join('\n');
      // const libUri = 'ts:filename/facts.d.ts';
      // monaco.languages.typescript.javascriptDefaults.addExtraLib(libSource, libUri);
      // monaco.editor.createModel(libSource, 'typescript', monaco.Uri.parse(libUri));
    }
  }, [editor, monaco])

  useEffect(() => {
    if (editor && monaco) {
      // depend数组转换为对象
      const depend = hookInfo?.depend?.reduce((acc, cur) => {
        acc[cur.name] = cur.version
        return acc
      }, {} as Depend)
      // 装载typings插件
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      void AutoTypings.create(editor, {
        sourceCache: new LocalStorageCache(),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        monaco: monaco,
        onlySpecifiedPackages: true,
        preloadPackages: true,
        versions: depend,
      }).then(t => {
        typingsRef.current = t;
      })
    }
  }, [editor, monaco, hookInfo?.depend])

  useEffect(() => {
    if (hookInfo?.script) {
      // 将lastScript设置为当前的脚本内容
      setLastScript(hookInfo?.script)
    }

  }, [hookInfo?.script])

  const handleEditorMount: OnMount = (monacoEditor, monaco) => {
    setEditor(monacoEditor)
    setMonaco(monaco)
  }

  // 保存内容(依赖和脚本)
  const handleSave = useCallback(debounce((type: AutoSavePayload['type'] = 'passive') => {
    // 如果正在保存中，不再重复保存
    if (savePayload.status === AutoSaveStatus.SAVEING) {
      return
    }
    if (type === 'active' && saveTimer.current) {
      clearTimeout(saveTimer.current)
      saveTimer.current = null
    }
    setPayload({
      type,
      status: AutoSaveStatus.SAVEING
    })
    console.log(editor)
    // 保存脚本内容
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    void saveHookScript(props.hookPath, editor.getValue()).then(() => {
      setPayload({
        type,
        status: AutoSaveStatus.SAVED
      })
    })
  }, 1000), [editor])

  // depend变更时，保存依赖
  const handleDependChange = async (depend: Depend) => {
    // 把depend对象转换为name, version的数组
    const dependList = Object.entries(depend).map(([name, version]) => ({ name, version }))
    // 保存依赖
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    await saveHookDepend(props.hookPath, dependList)
    setDepend(dependList);
  }

  // dependchange回调
  const dependChange = (depend: Depend) => {
    // 在typings类中的原型上调用setVersions
    if (typingsRef.current) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      typingsRef.current.setVersions(depend)
      void handleDependChange(depend);
    }
  }

  const dependRemove = (name: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    typingsRef.current.removePackage(name)
  }

  // 代码改变回调
  const codeChange = (value?: string) => {
    if (hookInfo) {
      setHookInfo({
        ...hookInfo,
        script: value ?? ''
      })
    }
    // 和上一次的脚本内容进行比对
    if (lastScript !== value) {
      if (![AutoSaveStatus.EDIT, AutoSaveStatus.SAVEING].includes(savePayload.status ?? AutoSaveStatus.LOADED)) {
        setPayload({
          type: 'passive',
          status: AutoSaveStatus.EDIT
        })
        saveTimer.current = setTimeout(() => {
          handleSave('passive')
        }, SAVE_DELAY);
      }
      setLastScript(value)
    }
  }

  // 折叠依赖区域
  const dependFold = () => {
    setSmallDepend(true)
  }

  // 处理点击调试按钮
  const handleDebug = async (json: Input) => {
    // 保存input内容
    void await saveHookInput(props.hookPath, json)
    const result = await runHook<RunHookResponse>(props.hookPath, {
      depend,
      script: lastScript ?? '',
      scriptType: 'typescript',
      input: json
    })
    // result为json
    setRunResult(result)
    return result;
  }

  return (
    <div className={`${ideStyles['ide-container']}`}>
      <FullScreen handle={handle} className={`${ideStyles['fullscreen']}`} onChange={(state) => {
        if (!state) {
          setFullScreen(false);
        }
      }}>
        <>
          {/* 头部 */}
          <IdeHeaderContainer {...{
            savePayload,
            fullScreen,
            disabled: hookInfo?.switch === false,
            onSave: () => { handleSave('active') },
            onToggleHook: async (value) => {
              await updateHookSwitch(props.hookPath, value)
            },
            onFullScreen: () => {
              setFullScreen(!fullScreen)
              handle.active ? void handle.exit() : void handle.enter()
            }
          }} />
          <div className="flex justify-start" style={{ height: fullScreen ? '100vh' : 'auto' }}>
            {/* 依赖列表是否收起 */}
            {smallDepend ? <Button onClick={() => {
              setSmallDepend(false)
            }} className="mt-2 ml-2" size="small" shape="circle" icon={<DoubleRightOutlined color='#ADADAD' />} /> : <IdeDependList {...{
              dependList: hookInfo?.depend || [],
              onFold: dependFold,
              onDependChange: dependChange,
              onDependDelete: dependRemove
            }} />}
            <div className={`${ideStyles['code-wrapper']} ${smallDepend ? 'flex-1' : ''}`}>
              {/* 编辑器 */}
              <IdeCodeContainer {...{
                defaultLanguage: props.defaultLanguage,
                value: hookInfo?.script,
                expandAction,
                fullScreen,
                editorOptions,
                onChange: (value) => {
                  codeChange(value);
                  props.onChange?.()
                },
                onMount: handleEditorMount,
                onClickExpandAction: () => {
                  setExpandAction(!expandAction)
                }
              }} />
              {/* 输入和输出区 */}
              <IdeActionContainer onClickDebug={async (json) => {
                return await handleDebug(json);
              }}
                onClickClearLog={() => {
                  setRunResult(defaultRunResult);
                }} runResult={runResult} expandAction={expandAction} editorOptions={editorOptions} />
            </div>
          </div>
        </>
      </FullScreen>
    </div>

  )
}

export default IdeContainer
