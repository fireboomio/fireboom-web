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
    "fireboom-wundersdk": "0.98.2",
    "graphql": "^16.3.0",
    "typescript": "^4.1.3",
    "ts-node": "^10.9.1",
    "socket.io-client": "^4.5.3"${Object.keys(dependVersion).map(
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
      <iframe id="frame"></iframe>
    </body>
    <script>
      document.getElementById('frame').src =
        'data:text/html;charset=utf-8,' +
        escape(\`<script>var ws = new WebSocket('ws://localhost:8080');
      ws.onopen = function () {
        ws.send('hook:ready');
      };
      ws.onmessage = function (e) {
        if (typeof e.data === 'object') {
          const { channel, ...args } = e.data
          console.log(channel, ...args)
        }
      };
      <\\/script>\`);
    </script>
  </html>
  `,
  '.wundergraph/generated/wundergraph.config.json': `{
  "api": {
    "operations": [],
    "webhooks": []
  },
  "apiName": "app",
  "deploymentName": "main"
}`,
  // '.wundergraph/socket.ts': `import { io } from 'socket.io-client';
  // import axios from 'axios';
  
  // export function initSocket() {
  //   const socket = io('http://localhost:9123/socket.io');
  //   const client = axios.create({ baseURL: process.argv[3] });
  //   socket.on('connect', () => {
  //     socket.emit('hook:ready');
  //   });
  
  //   socket.on('hook:request', async ({ url, method, query, body }) => {
  //     console.log('11', url, method, query, body);
  //     try {
  //       const ret = await client({
  //         url,
  //         method,
  //         params: query,
  //         data: body,
  //       });
  //       console.log('22', ret);
  //       socket.emit('hook:result', ret);
  //     } catch (e) {
  //       console.error('33', e);
  //       socket.emit('hook:error', e);
  //     }
  //   });
  
  //   socket.on('disconnect', (reason) => {
  //     console.error(reason);
  //     if (reason === 'io server disconnect') {
  //       socket.connect();
  //     }
  //   });
  
  //   socket.on('connect_error', () => {
  //     console.error('服务端连接失败，请检查本地 fireboom 服务是否正常开启');
  //   });
  // }
  // `
            }
          },
          {
            newWindow: true
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
