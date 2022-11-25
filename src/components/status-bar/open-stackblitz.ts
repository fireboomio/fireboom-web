import stackblizSDK from '@stackblitz/sdk'
import { message } from 'antd'

import requests from '@/lib/fetchers'
import { lockFunction } from '@/lib/helpers/lock'

const openStackblitz = lockFunction(async (apiHost: string) => {
  try {
    const hide = message.loading('加载中...', 0)
    const { dependFiles, dependVersion } = await requests.get<unknown, any>(`/hook/dependFiles`)
    hide()
    stackblizSDK.openProject(
      {
        template: 'node',
        title: 'Fireboom online debug',
        description: 'hook online debug',
        files: {
          ...Object.keys(dependFiles).reduce<Record<string, string>>((obj, fileName) => {
            obj[fileName] = dependFiles[fileName].replace(
              /@wundergraph\/sdk/g,
              'fireboom-wundersdk'
            )
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
    "start": "INDEX_PAGE=./ START_HOOKS_SERVER=true WG_ABS_DIR=.wundergraph ts-node .wundergraph/wundergraph.server.ts --host ${apiHost}"
  },
  "dependencies": {
    "@types/node": "^14.14.37",
    "axios": "^1.1.3",
    "fireboom-wundersdk": "0.98.1-r5",
    "graphql": "^16.3.0",
    "typescript": "^4.1.3",
    "ts-node": "^10.9.1"${Object.keys(dependVersion)
      .map(
        dep => `,
    "${dep}": "${dependVersion[dep]}"`
      )
      .join('')}
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
        .write(\`<script>const ws = new WebSocket('ws://${apiHost.replace('http://', '')}/ws');
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
  `
        }
      },
      {
        newWindow: true
        // openFile: `.wundergraph/new_hook/${props.hookPath}.ts:L6`
      }
    )
  } catch (e) {
    console.error(e)
  }
})

export { openStackblitz }
