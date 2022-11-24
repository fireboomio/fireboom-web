import { LoadingOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Select, Switch } from 'antd'
import dayjs from 'dayjs'
import { FC, useCallback } from 'react'
import { useEffect, useState } from 'react'
import stackblizSDK from '@stackblitz/sdk'

import iconCloud from '../assets/cloud.svg'
import iconFullscreen from '../assets/fullscreen.svg'
import iconFullscreen2 from '../assets/fullscreen2.svg'
import iconHelp from '../assets/help.svg'
import type { AutoSavePayload } from './../index'
import { AutoSaveStatus } from './../index'
import ideStyles from './index.module.less'
import requests from '@/lib/fetchers'

interface Props {
  // 钩子路径
  hookPath: string
  // API域名
  hostUrl: string
  // 隐藏启停开关
  hideSwitch: boolean
  // 保存状态
  savePayload: AutoSavePayload
  fullScreen: boolean
  // 是否禁用此脚本
  disabled?: boolean
  // 点击全屏按钮
  onFullScreen: () => void
  onToggleHook?: (value: boolean) => Promise<void>
  // 点击手动保存按钮
  onSave?: () => void
}

interface DebugResp {
  dependFiles: Record<string, string>
  dependVersion: Record<string, string>
}

const IdeHeaderContainer: FC<Props> = props => {
  // 保存状态text文案
  const [saveStatusText, setSaveStatusText] = useState('')
  // toggle是否loading
  const [toggleLoading, setToggleLoading] = useState(false)
  // 在线调试loading
  const [debugOpenLoading, setDebugOpenLoading] = useState(false)

  useEffect(() => {
    let _text = ''
    const { type, status } = props.savePayload
    const date = new Date()
    switch (status) {
      case AutoSaveStatus.LOADED:
        _text = '已加载最新版本'
        break
      case AutoSaveStatus.SAVEING:
        // 这里牵扯到保存的主动/被动
        if (type === 'active') {
          _text = '手动保存中...'
        } else {
          _text = '自动保存中...'
        }
        break
      case AutoSaveStatus.SAVED:
        // 拼接保存时间, 时:分:秒
        _text = `已保存 ${dayjs().format('HH:mm:ss')}`
        break
      case AutoSaveStatus.EDIT:
        _text = '已编辑'
        break
      case AutoSaveStatus.DEFAULT:
        _text = '示例代码'
        break
      default:
        break
    }
    setSaveStatusText(_text)
  }, [props.savePayload])

  // toggle switch按钮的change事件
  const onToggleHookChange = async (checked: boolean) => {
    setToggleLoading(true)
    if (props.onToggleHook) {
      await props.onToggleHook(checked)
    }
    setToggleLoading(false)
  }

  // 在线stackbliz调试
  const onlineDebug = useCallback(() => {
    setDebugOpenLoading(true)
    requests
      .get(`/hook/dependFiles?hookName=${encodeURIComponent(props.hookPath)}`)
      .then(resp => {
        const { dependFiles, dependVersion } = resp as unknown as DebugResp
        stackblizSDK.openProject(
          {
            template: 'node',
            title: 'Fireboom online debug',
            description: props.hookPath,
            files: {
              ...Object.keys(dependFiles).reduce<Record<string, string>>((obj, fileName) => {
                obj[fileName] = dependFiles[fileName].replace(/@wundergraph\/sdk/g, 'fireboom-wundersdk')
                // if (fileName === '.wundergraph/wundergraph.server.ts') {
                //   // 注入socket
                //   obj[fileName] = obj[fileName].replace('export default', `import { initSocket } from './socket'\nexport default`) + '\ninitSocket()\n'
                // }
                return obj
              }, {}),
              'package.json': `{
  "name": "wundergraph-hooks",
  "version": "1.0.0",
  "scripts": {
    "start": "INDEX_PAGE=./ START_HOOKS_SERVER=true WG_ABS_DIR=.wundergraph ts-node .wundergraph/wundergraph.server.ts --host ${props.hostUrl}"
  },
  "dependencies": {
    "@types/node": "^14.14.37",
    "axios": "^1.1.3",
    "fireboom-wundersdk": "0.98.1-r5",
    "graphql": "^16.3.0",
    "typescript": "^4.1.3",
    "ts-node": "^10.9.1"${Object.keys(dependVersion).map(
      dep => `,
    "${dep}": "${dependVersion[dep]}"`
    ).join("")}
  },
  "stackblitz": {
    "startCommand": "npm start"
  }
}`,
              'tsconfig.json': `
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "commonjs",
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "paths": {
      "baseUrl": ["./"],
      "generated/*": ["./.wundergraph/generated/*"]
    }
  },
  "include": [".wundergraph/*.ts"]
}`,
  'index.html': `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Document</title>
    </head>
    <body>
      请勿关闭当前窗口
      <iframe id="frame" style="border:0;display:block"></iframe>
    </body>
    <script>
      const url = window.location.href;
      const frame = document.getElementById('frame');
      window.addEventListener('message', async (e) => {
        const { type, ...args } = e.data;
        if (type === 'request') {
          try {
            const result = await fetch(args.url + (args.query ? '?' + Object.keys(args.query).map((k) => k + '=' + args.query[k]).join('&') : ''),
              {
                method: args.method,
                body: args.method.toLowerCase() === 'get' ? undefined : args.body,
                headers: {
                  'Content-Type': 'application/json;charset=utf-8',
                },
              }
            ).then((res) => res.json());
            frame.contentWindow.postMessage({
              type: 'result',
              result,
              url: args.url,
            });
          } catch (error) {
            console.error(e);
            frame.contentWindow.postMessage({ type: 'error', error });
          }
        }
      });
      frame.contentWindow.document
        .write(\`<script>const ws = new WebSocket('ws://${props.hostUrl.replace('http://', '')}/ws');
      ws.onopen = function () {
        ws.send('hook:ready');
      };
      ws.onmessage = async function (e) {
        console.log(e)
        try {
          const data = JSON.parse(e.data)
          const { channel, ...args } = data
          if (channel === 'hook:request') {
            window.parent.postMessage({ type: 'request', ...args })
          }
        } catch(e) {
          console.error(e)
        }
      };
      ws.onclose = (e) => {
        // The connection was closed abnormally, e.g., without sending or receiving a Close control frame
        if (e.code === 1006) {
          alert('连接被关闭，请勿打开多个调试窗口并保证fireboom服务打开')
        }
      }
      window.addEventListener('message', e => {
        const { type, result, url, error } = e.data
        if (type === 'result') {
          ws.send(JSON.stringify({ channel: 'hook:result', url, result }))
        } else if (type === 'error') {
          ws.send(JSON.stringify({ channel: 'hook:error', error: e }))
        }
      })
      <\\/script>\`);
    </script>
  </html>
  `,
            }
          },
          {
            newWindow: true,
            openFile: `.wundergraph/new_hook/${props.hookPath}.ts:L6`
          }
        )
        setDebugOpenLoading(false)
      })
      .catch(() => setDebugOpenLoading(false))
  }, [])

  // 上一次已保存的时间
  return (
    <div className={`${ideStyles['ide-container-header']} flex justify-start items-center`}>
      {/* 左侧 */}
      <div className="flex ide-container-header-left justify-start items-center">
        <div className="flex items-center">
          <div className="title">编辑脚本</div>
          <img src={iconHelp} alt="帮助" className="ml-1" />
        </div>
        {/* 已保存 */}
        <div className="flex ml-3 items-center" style={{ borderLeft: '1px solid #EBEBEB' }}>
          <span className="ml-3 save">{saveStatusText}</span>
          {props.savePayload.status !== null && <img src={iconCloud} alt="帮助" className="ml-1" />}
        </div>
      </div>
      <div className="flex flex-1 ide-container-header-right justify-between">
        <div className="flex items-center">
          <Button
            className="ml-2"
            onClick={props.onSave}
            size="small"
            disabled={props.savePayload.status !== AutoSaveStatus.EDIT}
            icon={
              props.savePayload.status === AutoSaveStatus.SAVEING ? (
                <LoadingOutlined />
              ) : (
                <SaveOutlined />
              )
            }
          >
            保存
          </Button>
          {/* 开关 */}
          {props.hideSwitch ? null : (
            <div className="flex ml-10 common-form items-center">
              {toggleLoading && <LoadingOutlined className="mr-5" />}
              <div>
                <Switch
                  checked={props.disabled === false}
                  disabled={toggleLoading}
                  onChange={onToggleHookChange}
                />
              </div>
            </div>
          )}
          <Button className="ml-4" loading={debugOpenLoading} type="primary" onClick={onlineDebug}>
            在线调试
          </Button>
        </div>
        {/* 右侧区域 */}
        <div className="flex items-center">
          <div className="name">脚本语言</div>
          <div className="ml-2">
            <Select defaultValue="TypeScript">
              <Select.Option value="TypeScript">TypeScript</Select.Option>
            </Select>
          </div>
          <div className="cursor-pointer ml-3">
            <img src={iconHelp} alt="帮助" />
          </div>
          <div className="cursor-pointer ml-3" onClick={() => props.onFullScreen()}>
            {props.fullScreen ? (
              <img src={iconFullscreen2} alt="全屏" />
            ) : (
              <img src={iconFullscreen} alt="全屏" />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default IdeHeaderContainer
