/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { DoubleRightOutlined } from '@ant-design/icons'
import { AutoTypings, LocalStorageCache } from '@swordjs/monaco-editor-auto-typings'
import type { BeforeMount, EditorProps, OnMount } from '@swordjs/monaco-editor-react'
import { loader } from '@swordjs/monaco-editor-react'
import { Button, message } from 'antd'
import { debounce } from 'lodash'
import type { FC } from 'react'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useFullScreenHandle } from 'react-full-screen'
import { useIntl } from 'react-intl'
import { useImmer } from 'use-immer'

import type { LocalLib } from '@/components/Ide/dependLoader'
import { DependManager } from '@/components/Ide/dependLoader'
import getDefaultCode from '@/components/Ide/getDefaultCode'
import { ConfigContext } from '@/lib/context/ConfigContext'
import { WorkbenchContext } from '@/lib/context/workbenchContext'
import requests from '@/lib/fetchers'
import {
  getHook,
  getTypes,
  saveHookDepend,
  saveHookScript,
  updateHookSwitch
} from '@/lib/service/hook'

import IdeCodeContainer from './code/index'
import IdeDependList from './depend-list/index'
import IdeHeaderContainer from './header/index'
import ideStyles from './ide.module.less'

loader.config({ paths: { vs: '/modules/monaco-editor/min/vs' } })

export const hookPath = {
  OperationPreResolve: (api: string) => `operations/${api}/preResolve`,
  OperationPostResolve: (api: string) => `operations/${api}/postResolve`,
  OperationMustomResolve: (api: string) => `operations/${api}/customResolve`,
  OperationMutatingPostResolve: (api: string) => `operations/${api}/mutatingPostResolve`,
  OperationMutatingPreResolve: (api: string) => `operations/${api}/mutatingPreResolve`,
  OperationMock: (api: string) => `operations/${api}/mock`,
  AuthPostAuthentication: 'auth/postAuthentication',
  AuthMutatingPostAuthentication: 'auth/mutatingPostAuthentication',
  Customize: (connect: string) => `customize/${connect}`,
  GlobalOnRequest: 'global/onRequest',
  GlobalOnResponse: 'global/onResponse'
}

export type Depend = Record<string, string>
export type Input = Record<string, any>
export type HookInfo = {
  script: string
  scriptType: string
  type: string
  path: string
  depend: { dependencies: Depend[]; devDependencies: Depend[] }
  input: Input | null
  switch: boolean
}
export type RunHookResponse = { logs: any[][]; result: any }

// 保存的4种状态
export enum AutoSaveStatus {
  DEFAULT = 'default',
  LOADED = 'loaded',
  SAVEING = 'saveing',
  SAVED = 'saved',
  EDIT = 'edit'
}

// 保存的payload类型
export type AutoSavePayload = {
  // 是主动还是被动
  type: 'active' | 'passive'
  // 保存状态
  status: AutoSaveStatus | null
}

export const editorOptions: EditorProps['options'] = {
  minimap: {
    enabled: false
  },
  overviewRulerLanes: 0,
  scrollbar: {
    // vertical: 'hidden',
    // horizontal: 'hidden',
    handleMouseWheel: true
  }
}

// 实时保存代码的延迟时间
const SAVE_DELAY = 1000

interface Props {
  // api是否有参数，用来判断默认code类型
  hasParams?: boolean
  hideSwitch?: boolean
  hookPath: string
  defaultCode?: string
  defaultInput?: string
  defaultLanguage?: string
  onChange?: (value?: string) => void
  onChangeEnable?: (value?: string) => void
  onSelectHook?: (value: string) => void
}

const tabSizeKey = 'editorTabSize'
/**
 *
 * 代码ide容器
 * @param {*} props
 * @return {*}
 */
const IdeContainer: FC<Props> = props => {
  const intl = useIntl()
  const workbenchCtx = useContext(WorkbenchContext)
  const defaultRunResult = { logs: [], result: '' }
  // 防止主动保存和被动保存冲突的timer
  const saveTimer = useRef<number | null>(null)
  const handle = useFullScreenHandle()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const [editor, setEditor] = useState<any>()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const [monaco, setMonaco] = useState<any>()
  const dependManager = useRef<DependManager>()
  // 运行结果
  const [runResult, setRunResult] = useState<RunHookResponse>(defaultRunResult)
  const typingsRef = useRef<any>(null)
  // hook详情
  const [hookInfo, setHookInfo] = useImmer<HookInfo | undefined>(undefined)
  // 是否展开输入和输出区域
  const [expandAction, setExpandAction] = useState(false)
  // 是否全屏显示
  const [fullScreen, setFullScreen] = useState(false)
  // 是否缩小依赖区域
  const [smallDepend, setSmallDepend] = useState(false)
  const [scriptList, setScriptList] = useState<string[]>()
  const [tabSize, setTabSize] = useState(localStorage.getItem(tabSizeKey) === '2' ? 2 : 4)
  const [savePayload, setPayload] = useState<AutoSavePayload>({
    type: 'passive',
    status: null
  })
  const [localDepends, setLocalDepends] = useState<LocalLib[]>([])
  const { config: globalConfig } = useContext(ConfigContext)

  const [hookPath, setHookPath] = useState(props.hookPath)
  // 将hookPath保存到本地， 用以支持动态更换
  useEffect(() => {
    setHookPath(props.hookPath)
  }, [props.hookPath])

  // 获取hook信息
  useEffect(() => {
    void getHook<HookInfo>(hookPath).then(async data => {
      const defaultCode = await resolveDefaultCode(hookPath)
      // 如果data中的script为空, 就用defaultCode
      if (data.script === '' || (data.script === null && defaultCode)) {
        setPayload({
          type: 'passive',
          status: AutoSaveStatus.DEFAULT
        })
        data.script = defaultCode
      } else {
        setPayload({
          type: 'passive',
          status: AutoSaveStatus.LOADED
        })
      }
      setHookInfo(data)
    })
  }, [hookPath])

  const resolveDefaultCode = async (path: string): Promise<string> => {
    const list = path.split('/')
    const name = list.pop()
    const apiName = list.pop() as string
    if (path.startsWith('global/')) {
      return getDefaultCode(`global.${name}`)
    } else if (path.startsWith('auth/')) {
      return getDefaultCode(`auth.${name}`)
    } else if (path.startsWith('customize/')) {
      return getDefaultCode('custom')
    } else {
      const tmplPath = `hook.${props.hasParams ? 'WithInput' : 'WithoutInput'}.${name}`
      return getDefaultCode(tmplPath).then((res: string) => {
        return res.replaceAll('$HOOK_NAME$', apiName)
      })
    }
  }

  // scriptList和monaco加载完毕后，将所有scriptList中的代码加载到monaco中
  useEffect(() => {
    if (!scriptList || !monaco) return
    requests.get<unknown, { path: string; content: string }[]>('hook/ctree').then(res => {
      res.forEach(({ path, content }) => {
        const model = monaco.editor.getModel(path)
        if (!model) {
          if (!monaco.editor.getModel(path)) {
            monaco.editor.createModel(content, 'typescript', monaco.Uri.parse(path))
          }
        }
      })
    })
  }, [scriptList, monaco])

  useEffect(() => {
    // 监听键盘的ctrl+s事件
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        // 执行主动保存
        handleSave('active')
        e.preventDefault()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [editor, monaco])

  useEffect(() => {
    if (editor && monaco) {
      hookInfo?.depend?.dependencies?.forEach((item, index) => {
        dependManager.current?.addDepend(item.name, item.version)
      })
      hookInfo?.depend?.devDependencies?.forEach((item, index) => {
        dependManager.current?.addDepend(item.name, item.version)
      })
      // depend['@angular/cdk'] = '14.2.5'
      // 装载typings插件
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      void AutoTypings.create(editor, {
        sourceCache: new LocalStorageCache(),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        monaco: monaco,
        onlySpecifiedPackages: true,
        preloadPackages: true,
        versions: {}
      }).then(t => {
        typingsRef.current = t
      })
    }
  }, [editor, monaco, hookInfo?.depend])

  const refreshLocalDepend = async (_monaco = monaco) => {
    return getTypes<Record<string, string>>().then(res => {
      const list = Object.keys(res).map(key => ({
        filePath: `inmemory://model${key.replace(/^@?/, '/node_modules/')}`,
        content: res[key],
        name: key
      }))
      if (dependManager.current) {
        dependManager.current?.setLocalLibs(list)
      }
      setLocalDepends(list)
    })
  }

  const handleEditorBeforeMount: BeforeMount = monaco => {
    dependManager.current = new DependManager(monaco, localDepends ?? [])
    refreshLocalDepend(monaco).then(() => {
      monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false
      })
    })
  }

  const handleEditorMount: OnMount = (monacoEditor, monaco) => {
    setEditor(monacoEditor)
    setMonaco(monaco)
    const model = monaco.editor.getModel(monaco.Uri.parse(`inmemory://model/hook/${hookPath}`))
    model?.updateOptions({ tabSize: tabSize, indentSize: tabSize })
  }

  // 保存内容(依赖和脚本)
  const handleSave = useCallback(
    debounce((type: AutoSavePayload['type'] = 'passive') => {
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
      // 保存脚本内容
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      void saveHookScript(hookPath, editor.getValue()).then(() => {
        setPayload({
          type,
          status: AutoSaveStatus.SAVED
        })
      })
    }, 1000),
    [editor, hookPath]
  )

  // depend变更时，保存依赖
  const handleDependChange = async (depend: Depend) => {
    // 把depend对象转换为name, version的数组
    const dependList = Object.entries(depend).map(([name, version]) => ({ name, version }))

    // 更新ide语法提示
    const loadTarget = { ...depend }
    hookInfo?.depend?.devDependencies?.forEach(item => {
      loadTarget[item.name] = item.version
    })
    dependManager.current?.setDepends(loadTarget)

    // 保存依赖
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    await saveHookDepend(hookPath, dependList)
    if (hookInfo) {
      setHookInfo(hookInfo => {
        if (hookInfo) {
          hookInfo.depend.dependencies = dependList
        }
      })
    }
  }

  // 选择hooks
  const selectHook = (hookPath: string) => {
    setHookPath(hookPath)
    props.onSelectHook?.(hookPath)
  }
  // scriptListLoad回调
  const scriptListLoad = (list: string[]) => {
    setScriptList(list)
  }
  // dependchange回调
  const dependChange = (depend: Depend) => {
    // 在typings类中的原型上调用setVersions
    void handleDependChange(depend)
  }
  const dependRefresh = (depend: Depend) => {
    Object.keys(depend).forEach(key => {
      dependManager.current?.addDepend(key, depend[key], true)
    })
  }

  const dependRemove = (name: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    typingsRef.current.removePackage(name)
  }
  const insertLocalDepend = (name: string) => {
    name = name.replace(/.ts$/, '')
    if (!hookInfo) {
      return
    }

    const code = editor.getValue()
    //
    const lines = code.split('\n')
    let lastImport = -1
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const match = line.match(/^import\s[\w\W]+['"]([^'"]+)['"];?$/)
      if (match) {
        lastImport = i
        if (match[1] === name) {
          message.warning(intl.formatMessage({ defaultMessage: '已存在，请勿重复引入' }))
          return
        }
      }
    }
    lines.splice(lastImport + 1, 0, `import {} from '${name}'`)
    editor.setValue(lines.join('\n'))
  }

  // 代码改变回调
  const codeChange = (value?: string) => {
    if (hookInfo?.script === value) return
    if (hookInfo) {
      setHookInfo({
        ...hookInfo,
        script: value ?? ''
      })
    }
    if (
      ![AutoSaveStatus.EDIT, AutoSaveStatus.SAVEING].includes(
        savePayload.status ?? AutoSaveStatus.LOADED
      )
    ) {
      setPayload({
        type: 'passive',
        status: AutoSaveStatus.EDIT
      })
      saveTimer.current = window.setTimeout(() => {
        handleSave('passive')
      }, SAVE_DELAY)
    }
  }

  // 折叠依赖区域
  const dependFold = () => {
    setSmallDepend(true)
  }

  return (
    <div className={`${ideStyles['ide-container']}`}>
      {/*<FullScreen*/}
      {/*  handle={handle}*/}
      {/*  className={`${ideStyles['fullscreen']}`}*/}
      {/*  onChange={state => {*/}
      {/*    if (!state) {*/}
      {/*      setFullScreen(false)*/}
      {/*    }*/}
      {/*  }}*/}
      {/*>*/}
      <div className={(fullScreen ? ideStyles.fullscreen : '') + ' h-full flex flex-col'}>
        {/* 头部 */}
        <IdeHeaderContainer
          hideSwitch={props.hideSwitch ?? false}
          hookPath={hookPath}
          hookInfo={hookInfo}
          hostUrl={globalConfig.apiHost}
          tabSize={tabSize}
          setTabSize={size => {
            setTabSize(size)
            localStorage.setItem(tabSizeKey, String(size))
            const model = monaco.editor.getModel(`inmemory://model/hook/${hookPath}`)
            model.updateOptions({ tabSize: size, indentSize: size })
          }}
          {...{
            savePayload,
            fullScreen,
            disabled: hookInfo?.switch === false,
            onSave: () => {
              handleSave('active')
            },
            onToggleHook: async value => {
              hookInfo && setHookInfo({ ...hookInfo, switch: value })
              await updateHookSwitch(hookPath, value)
              props.onChangeEnable?.()
            },
            onFullScreen: () => {
              workbenchCtx.setFullscreen(!fullScreen)
              setFullScreen(!fullScreen)
              handle.active ? void handle.exit() : void handle.enter()
            }
          }}
        />
        <div
          className="flex flex-1 min-h-0 justify-start"
          style={{ height: fullScreen ? '100vh' : 'auto' }}
        >
          {/* 依赖列表是否收起 */}
          {smallDepend ? (
            <Button
              onClick={() => {
                setSmallDepend(false)
              }}
              className="mt-2 ml-2"
              size="small"
              shape="circle"
              icon={<DoubleRightOutlined color="#ADADAD" />}
            />
          ) : (
            <IdeDependList
              {...{
                hookInfo,
                dependList: hookInfo?.depend?.dependencies || [],
                devDependList: hookInfo?.depend?.devDependencies || [],
                hookPath: hookPath,
                onSelectHook: selectHook,
                onChangeDependVersion: dependChange,
                onFold: dependFold,
                onDependChange: dependChange,
                onRefreshLocalDepend: refreshLocalDepend,
                onDependRefresh: dependRefresh,
                onDependDelete: dependRemove,
                onInsertLocalDepend: insertLocalDepend,
                onScriptListLoad: scriptListLoad
              }}
              localDepends={localDepends.map(item => item.name)}
            />
          )}
          <div className={`${ideStyles['code-wrapper']} ${smallDepend ? 'flex-1' : ''}`}>
            {/* 编辑器 */}
            <IdeCodeContainer
              {...{
                path: hookPath,
                defaultLanguage: props.defaultLanguage,
                value: hookInfo?.script,
                expandAction,
                fullScreen,
                editorOptions,
                onChange: value => {
                  codeChange(value)
                  props.onChange?.()
                },
                onBeforeMount: handleEditorBeforeMount,
                onMount: handleEditorMount,
                onClickExpandAction: () => {
                  setExpandAction(!expandAction)
                }
              }}
            />
            {/* 输入和输出区 */}
            {/*<IdeActionContainer*/}
            {/*  defaultInputValue={props.defaultInput}*/}
            {/*  onClickDebug={async json => {*/}
            {/*    return await handleDebug(json)*/}
            {/*  }}*/}
            {/*  onClickClearLog={() => {*/}
            {/*    setRunResult(defaultRunResult)*/}
            {/*  }}*/}
            {/*  runResult={runResult}*/}
            {/*  expandAction={expandAction}*/}
            {/*  editorOptions={editorOptions}*/}
            {/*/>*/}
          </div>
        </div>
      </div>
      {/*</FullScreen>*/}
    </div>
  )
}

export default IdeContainer
