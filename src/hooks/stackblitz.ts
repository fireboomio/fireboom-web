import stackblizSDK from '@stackblitz/sdk'

import requests from '@/lib/fetchers'
import { useCallback, useState } from 'react'

interface DebugResp {
  dependFiles: Record<string, string>
  dependVersion: Record<string, string>
}

export type StackblitzProps = {
  // apiHost: string
}
export function useStackblitz() {
  const [loading, setLoading] = useState(false)
  const openHookServer = useCallback((openFile?: string | string[]) => {
    setLoading(true)
    requests
      .get(`/hook/dependFiles`)
      .then(resp => {
        const { dependFiles, dependVersion } = resp as unknown as DebugResp
        stackblizSDK.openProject(
          {
            template: 'node',
            title: 'Fireboom online debug',
            description: openFile ? (Array.isArray(openFile) ? openFile.join('\n') : openFile) : '',
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
    "start": "INDEX_PAGE=./ START_HOOKS_SERVER=true WG_ABS_DIR=.wundergraph ts-node .wundergraph/wundergraph.server.ts"
  },
  "dependencies": {
    "@types/node": "^14.14.37",
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
      <script src="https://unpkg.com/json-formatter-js@2.3.4/dist/json-formatter.umd.js"></script>
      <style>
        body {
          margin: 0;
          padding: 1em;
        }
        .requests {
          margin: 32px 0 0;
          width: 100%;
          border-collapse: collapse;
          border: 1px solid #e8e8e8;
          table-layout: fixed;
        }
        th {
          text-align: left;
        }
        th,
        td {
          padding: 4px 6px;
          border-right: 1px solid #e8e8e8;
        }
        th:last-child,
        td:last-child {
          border-right: none;
        }
        td {
          border-top: 1px solid #e8e8e8;
        }
        td:nth-child(2) {
          font-size: 12px;
          word-break: break-all;
        }
        td:last-child > .json-formatter-row {
          overflow-x: auto;
        }
      </style>
    </head>
    <body>
      <iframe id="frame" style="height: 0; border: 0; display: block"></iframe>
      请勿关闭当前窗口
      <table class="requests">
        <thead>
          <tr>
            <th style="width: 28px">序</th>
            <th style="width: 120px; overflow-x: auto">Method/Url</th>
            <th>Query</th>
            <th>Body</th>
            <th>Response</th>
          </tr>
        </thead>
        <tbody class="tbody"></tbody>
      </table>
    </body>
    <script>
      const url = window.location.href;
      const frame = document.getElementById('frame');
      const $tbody = document.querySelector('.tbody');
      window.addEventListener('message', async (e) => {
        const { type, ...args } = e.data;
        if (type === 'request') {
          try {
            const $tr = document.createElement('tr');
            $tr.innerHTML = \`<td>\${$tbody.children.length + 1}</td><td>[\${
              args.method
            }]\${args.url}</td><td></td><td></td><td></td>\`;
            if (args.query) {
              const query = typeof args.query === 'string' ? JSON.parse(args.query) : args.query
              $tr.querySelector('td:nth-child(3)').appendChild(new JSONFormatter(query).render());
            }
            if (args.body) {
              $tr.querySelector('td:nth-child(4)').appendChild(new JSONFormatter(args.body).render());
            }
            $tbody.appendChild($tr);
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
            if (result) {
              $tr.querySelector('td:last-child').appendChild(new JSONFormatter(result).render());
            }
          } catch (error) {
            console.error(e);
            frame.contentWindow.postMessage({ type: 'error', error });
          }
        }
      });
      frame.contentWindow.document
        .write(\`<script>const ws = new WebSocket('ws://localhost:9123/ws');
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
            newWindow: true,
            openFile
          }
        )
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return { openHookServer, loading }
}