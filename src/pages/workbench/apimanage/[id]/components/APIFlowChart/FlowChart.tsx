// eslint-disable-next-line import/no-unassigned-import
import '@antv/x6-react-shape/dist/x6-react-shape.js'

import type { Edge, Node } from '@antv/x6'
import { Graph } from '@antv/x6'
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

import EditPanel from '@/pages/workbench/apimanage/[id]/components/APIFlowChart/EditPanel'
import { useAPIManager } from '@/pages/workbench/apimanage/[id]/store'

import { ActionGroup } from './ActionGroup'
import globalHookImg from './assets/global-hook.png'
import gridImg from './assets/grid.png'
import hookImg from './assets/hook.png'
import routerBottomImg from './assets/tee_bottom.svg'
import routerLeftImg from './assets/tee_left.svg'
import StatusDirective from './StatusDirective'

export interface FlowChartProps {
  globalHookState: {
    onRequest: {
      name: string
      enable: boolean
      path: string
    }
    onResponse: {
      name: string
      enable: boolean
      path: string
    }
  }
  hookState: {
    preResolve: {
      name: string
      enable: boolean
      path: string
    }
    mutatingPreResolve: {
      name: string
      enable: boolean
      path: string
    }
    customResolve: {
      name: string
      enable: boolean
      path: string
    }
    postResolve: {
      name: string
      enable: boolean
      path: string
    }
    mutatingPostResolve: {
      name: string
      enable: boolean
      path: string
    }
    mockResolve: {
      name: string
      enable: boolean
      path: string
    }
  }
  directiveState: {
    fromClaim: boolean
    rbac: boolean
    jsonSchema: boolean
    injectGeneratedUUID: boolean
    injectCurrentDatetime: boolean
    injectEnvironmentVariable: boolean
    transform: boolean
  }
}

const CANVAS_PADDING = 20
const CANVAS_WIDTH = 410

const TERMINAL_WIDTH = 80
const TERMINAL_HEIGHT = 28
const DECISION_WIDTH = 112
const DECISION_HEIGHT = 50
const PROCESS_WIDTH = 112
const PROCESS_HEIGHT = 32
const OPERATION_WIDTH = 130
const OPERATION_HEIGHT = 46
const LABEL_WIDTH = 14
const LABEL_HEIGHT = 14
const HOOK_WIDTH = 20
const HOOK_HEIGHT = 20

// 计算各图形 x 值
const TERMINAL_X = (CANVAS_WIDTH - TERMINAL_WIDTH) / 2
const DECISION_X = (CANVAS_WIDTH - DECISION_WIDTH) / 2
const PROCESS_X = (CANVAS_WIDTH - PROCESS_WIDTH) / 2
const OPERATION_X = (CANVAS_WIDTH - OPERATION_WIDTH) / 2
const LABEL_X = (CANVAS_WIDTH - LABEL_WIDTH) / 2
const HOOK_X = (CANVAS_WIDTH - HOOK_WIDTH) / 2

// 起止
Graph.registerNode('terminal', {
  inherit: 'rect',
  width: TERMINAL_WIDTH,
  height: TERMINAL_HEIGHT,
  attrs: {
    body: {
      strokeWidth: 0.5,
      stroke: 'rgba(95, 98, 105, 0.6)',
      fill: '#F3F9FD',
      rx: 14,
      ry: 14
    },
    text: {
      fontSize: 14,
      fill: '#333333'
    }
  }
})

// 流程箭头
Graph.registerEdge('flowline', {
  zIndex: -1,
  attrs: {
    line: {
      stroke: '#1034FF',
      targetMarker: {
        name: 'block',
        width: 3,
        height: 4
      }
    }
  }
})

// 拒绝流程里的箭头
Graph.registerEdge('rejectArrow', {
  attrs: {
    line: {
      stroke: '#787D8B',
      targetMarker: {
        name: 'block',
        width: 3,
        height: 4
      }
    }
  }
})

// 决策判断
Graph.registerNode('decision', {
  inherit: 'polygon',
  width: DECISION_WIDTH,
  height: DECISION_HEIGHT,
  attrs: {
    body: {
      strokeWidth: 0.5,
      stroke: '#F2B241',
      fill: '#ffffff',
      refPoints: '0,10 10,0 20,10 10,20'
    },
    text: {
      fontSize: 14,
      fill: '#F3B13F'
    }
  }
})

// 程序
Graph.registerNode('process', {
  inherit: 'rect',
  width: PROCESS_WIDTH,
  height: PROCESS_HEIGHT,
  attrs: {
    body: {
      strokeWidth: 0.5,
      stroke: 'rgba(95, 98, 105, 0.6)',
      fill: '#ffffff',
      rx: 4,
      ry: 4
    },
    text: {
      fontSize: 14,
      fill: '#333333'
    }
  }
})

// 执行
Graph.registerNode('operation', {
  inherit: 'rect',
  width: OPERATION_WIDTH,
  height: OPERATION_HEIGHT,
  attrs: {
    body: {
      strokeWidth: 0.5,
      stroke: {
        type: 'linearGradient',
        attrs: { x1: '100%', y1: '100%', x2: '0%', y2: '0%' },
        stops: [
          { offset: '0%', color: '#FF9378' },
          { offset: '100%', color: '#E13D5B' }
        ]
      },
      fill: {
        type: 'linearGradient',
        attrs: { x1: '100%', y1: '0%', x2: '0%', y2: '100%' },
        stops: [
          { offset: '0%', color: '#FFF3F8' },
          { offset: '100%', color: '#FFDBDD' }
        ]
      },
      rx: 4,
      ry: 4
    },
    text: {
      fontSize: 14,
      fill: '#E92E5E'
    }
  }
})

// 全局钩子
Graph.registerNode('globalHook', {
  inherit: 'rect',
  width: HOOK_WIDTH,
  height: HOOK_HEIGHT,
  markup: [{ tagName: 'image' }],
  attrs: {
    image: {
      'xlink:href': globalHookImg,
      width: HOOK_WIDTH,
      height: HOOK_HEIGHT,
      refX: 0,
      refY: 0,
      filter: {
        name: 'dropShadow',
        args: {
          color: 'rgba(202,83,206,0.33)',
          dx: 0,
          dy: 2,
          blur: 7
        }
      }
    }
  }
})

// API钩子
Graph.registerNode('hook', {
  inherit: 'rect',
  width: HOOK_WIDTH,
  height: HOOK_HEIGHT,
  markup: [{ tagName: 'image' }],
  attrs: {
    image: {
      'xlink:href': hookImg,
      width: HOOK_WIDTH,
      height: HOOK_HEIGHT,
      refX: 0,
      refY: 0,
      filter: {
        name: 'dropShadow',
        args: {
          color: 'rgba(56,110,252,0.23)',
          dx: 0,
          dy: 2,
          blur: 4
        }
      }
    }
  }
})

// 自定义流程标签
Graph.registerNode('flowLabel', {
  inherit: 'rect',
  height: LABEL_HEIGHT,
  attrs: {
    body: {
      fill: '#fff',
      strokeWidth: 0.3,
      stroke: 'rgba(175, 176, 180, 0.6)',
      rx: 7,
      ry: 7
    },
    text: {
      fontSize: 12,
      fill: '#6f6f6f'
    }
  }
})

// 路由器
Graph.registerNode('router', {
  inherit: 'rect',
  width: 24,
  height: 24,
  markup: [{ tagName: 'image' }],
  attrs: {
    image: {
      // 'xlink:href': routerImg,
      width: 24,
      height: 24,
      refX: 0,
      refY: 0,
      filter: {
        name: 'dropShadow',
        args: {
          color: 'rgba(69, 211, 142, 0.4)',
          dx: 0,
          dy: 3,
          blur: 6
        }
      }
    }
  }
})

// 异常流程
Graph.registerEdge('reject', {
  router: {
    name: 'oneSide',
    args: {
      side: 'left',
      padding: 128
    }
  },
  attrs: {
    line: {
      stroke: '#787D8B',
      strokeWidth: 0.5,
      strokeDasharray: '3 3',
      targetMarker: ''
    }
  }
})

// 可交互的指令
Graph.registerNode('directiveTrigger', {
  inherit: 'circle',
  zIndex: 200,
  width: 12,
  height: 12,
  attrs: {
    body: {
      fill: {
        type: 'linearGradient',
        attrs: { x1: '0', y1: '0%', x2: '100%', y2: '100%' },
        stops: [
          { offset: '0%', color: '#7CD4FC' },
          { offset: '100%', color: '#478FFF' }
        ]
      },
      stroke: '',
      filter: {
        name: 'dropShadow',
        args: {
          color: 'rgba(105,187,253,0.43)',
          dx: 0,
          dy: 2,
          blur: 3
        }
      }
    },
    text: {
      fontSize: 12,
      fill: '#fff'
    }
  }
})

// 指令
Graph.registerNode('directive', {
  inherit: 'rect',
  width: 100,
  height: 16,
  attrs: {
    body: {
      height: 16,
      rx: 8,
      ry: 8,
      fill: '#A4BEE1',
      stroke: ''
    },
    text: {
      fontSize: 12,
      fill: '#fff'
    }
  }
})

const FlowChart = ({ globalHookState, hookState, directiveState }: FlowChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hook, setHook] = useState<{ name: string; path: string } | null>()
  const { apiDesc } = useAPIManager(state => ({
    apiDesc: state.apiDesc
  }))

  const { id } = useParams()
  // 监听路由变化，当路由变化时自动关闭钩子编辑器
  useEffect(() => {
    setHook(undefined)
  }, [id])

  useEffect(() => {
    // 初始化画布
    const graph = new Graph({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      container: containerRef.current!,
      mousewheel: {
        enabled: true,
        zoomAtMousePosition: true,
        modifiers: 'ctrl',
        minScale: 0.5,
        maxScale: 3
      },
      interacting: {
        nodeMovable: false,
        edgeMovable: false,
        edgeLabelMovable: false,
        arrowheadMovable: false,
        vertexMovable: false,
        useEdgeTools: false
      },
      background: {
        color: '#F8F9FD',
        image: gridImg,
        size: {
          width: 22,
          height: 22
        },
        repeat: 'repeat'
      }
    })

    // 记录要渲染的节点 边
    const renderNodes: Node<Node.Properties>[] = []
    // 有箭头的节点
    const arrowNodes: Node<Node.Properties>[] = []
    // 拦截异常请求
    const rejectNodes: [Node<Node.Properties>, string][] = []
    // 指令
    const directiveNodes: ActionGroup[] = []

    // 开始请求
    let y = CANVAS_PADDING
    const start = graph.createNode({
      shape: 'terminal',
      label: '开始请求',
      x: TERMINAL_X,
      y
    })
    renderNodes.push(start)
    arrowNodes.push(start)
    y += 16 + TERMINAL_HEIGHT

    // 请求拦截
    if (globalHookState.onRequest) {
      const globalPreHookMetadata: Node.Metadata = {
        shape: 'globalHook',
        x: HOOK_X,
        y
      }
      // 全局请求前置指令
      const globalPreDirective = new ActionGroup(
        globalPreHookMetadata,
        [
          {
            shape: 'react-shape',
            width: 114,
            height: 20,
            component: (
              <StatusDirective
                enabled={globalHookState.onRequest.enable}
                label="onRequest"
                onDoubleClick={() => setHook(globalHookState.onRequest)}
              />
            ),
            x: 290,
            y
          }
        ],
        'arrow'
      )
      directiveNodes.push(globalPreDirective)
      y += 10 + HOOK_HEIGHT
    }

    // 登录校验
    if (directiveState.fromClaim) {
      const loggedValidation = graph.createNode({
        shape: 'decision',
        label: '登录校验?',
        x: DECISION_X,
        y
      })
      arrowNodes.push(loggedValidation)
      // 指令
      const loggedDirective = new ActionGroup(
        {
          shape: 'directiveTrigger',
          label: '1',
          x: 258,
          y: y + 19
        },
        [
          {
            shape: 'directive',
            label: '@fromClaim',
            width: 84,
            height: 16,
            x: 290,
            y: y + 17
          }
        ],
        'linear'
      )
      directiveNodes.push(loggedDirective)
      // yes
      y += 7 + DECISION_HEIGHT
      const y1 = graph.createNode({
        shape: 'flowLabel',
        label: 'Y',
        width: LABEL_WIDTH,
        height: LABEL_HEIGHT,
        x: LABEL_X,
        y
      })
      renderNodes.push(loggedValidation, y1)
      rejectNodes.push([loggedValidation, '401'])
      y += 8 + LABEL_HEIGHT
    }

    // 授权校验
    if (directiveState.rbac) {
      const authValidation = graph.createNode({
        shape: 'decision',
        label: '授权校验?',
        x: DECISION_X,
        y
      })
      arrowNodes.push(authValidation)
      rejectNodes.push([authValidation, '401'])

      // 授权指令
      const authDirective = new ActionGroup(
        {
          shape: 'directiveTrigger',
          label: '1',
          x: 258,
          y: y + 19
        },
        [
          {
            shape: 'directive',
            label: '@rbac',
            width: 64,
            height: 16,
            x: 300,
            y: y + 17
          }
        ],
        'linear'
      )
      directiveNodes.push(authDirective)

      // yes
      y += 7 + DECISION_HEIGHT
      const y2 = graph.createNode({
        shape: 'flowLabel',
        label: 'Y',
        width: LABEL_WIDTH,
        height: LABEL_HEIGHT,
        x: LABEL_X,
        y
      })
      renderNodes.push(authValidation, y2)
    }

    // 入参校验
    if (directiveState.jsonSchema) {
      y += 8 + LABEL_HEIGHT
      const requestValidation = graph.createNode({
        shape: 'decision',
        label: '入参校验?',
        x: DECISION_X,
        y
      })
      arrowNodes.push(requestValidation)
      rejectNodes.push([requestValidation, '400'])

      // 入参指令
      const argumentDirective = new ActionGroup(
        {
          shape: 'directiveTrigger',
          label: '1',
          x: 258,
          y: y + 19
        },
        [
          {
            shape: 'directive',
            label: '@jsonSchema',
            width: 88,
            height: 16,
            x: 290,
            y: y + 17
          }
        ],
        'linear'
      )
      directiveNodes.push(argumentDirective)

      // yes
      y += 7 + DECISION_HEIGHT
      const y3 = graph.createNode({
        shape: 'flowLabel',
        label: 'Y',
        width: LABEL_WIDTH,
        height: LABEL_HEIGHT,
        x: LABEL_X,
        y
      })
      renderNodes.push(requestValidation, y3)
      y += 8 + LABEL_HEIGHT
    }

    // 参数注入
    if (
      directiveState.injectCurrentDatetime ||
      directiveState.injectEnvironmentVariable ||
      directiveState.injectGeneratedUUID
    ) {
      const argsInjection = graph.createNode({
        shape: 'process',
        label: '参数注入',
        x: PROCESS_X,
        y
      })
      arrowNodes.push(argsInjection)
      // 参数注入指令集
      const injectDirective = new ActionGroup(
        {
          shape: 'directiveTrigger',
          label: '3',
          x: 258,
          y: y
        },
        [
          {
            shape: 'directive',
            label: '@EnvironmentVariable',
            width: 128,
            height: 16,
            x: 280,
            y: y - 40
          },
          {
            shape: 'directive',
            label: '@GeneratedUUID',
            width: 110,
            height: 16,
            x: 290,
            y: y
          },
          {
            shape: 'directive',
            label: '@CurrentDatetime',
            width: 110,
            height: 16,
            x: 290,
            y: y + 40
          }
        ],
        'linear'
      )
      directiveNodes.push(injectDirective)
      y += 7 + PROCESS_HEIGHT
      renderNodes.push(argsInjection)
    }

    // 路由器
    const routerSwitch = graph.createNode({
      shape: 'router',
      x: (CANVAS_WIDTH - 24) / 2,
      y,
      attrs: {
        image: {
          'xlink:href': hookState.mockResolve.enable ? routerLeftImg : routerBottomImg
        }
      }
    })
    renderNodes.push(routerSwitch)
    // 记录路由索引
    const routerIndex = arrowNodes.push(routerSwitch) - 1
    y += 12 + 24

    // 执行前钩子
    const preHookMetadata: Node.Metadata = {
      shape: 'hook',
      x: HOOK_X,
      y
    }

    // 执行前置指令集
    const preOperationDirective = new ActionGroup(
      preHookMetadata,
      [
        {
          shape: 'react-shape',
          width: 114,
          height: 20,
          component: (
            <StatusDirective
              enabled={hookState.preResolve.enable}
              label="preResolve"
              onDoubleClick={() => setHook(hookState.preResolve)}
            />
          ),
          x: 290,
          y: y - 32
        },
        {
          shape: 'react-shape',
          width: 114,
          height: 20,
          component: (
            <StatusDirective
              enabled={hookState.mutatingPreResolve.enable}
              label="mutatingPreResolve"
              onDoubleClick={() => setHook(hookState.mutatingPreResolve)}
            />
          ),
          x: 280,
          y: y - 8
        },
        {
          shape: 'react-shape',
          width: 114,
          height: 20,
          component: (
            <StatusDirective
              enabled={hookState.customResolve.enable}
              label="customResolve"
              onDoubleClick={() => setHook(hookState.customResolve)}
            />
          ),
          x: 290,
          y: y + 16
        }
      ],
      'arrow'
    )
    directiveNodes.push(preOperationDirective)
    y += 14 + HOOK_HEIGHT

    // mockResolve
    const mockResolve = graph.createNode({
      shape: 'react-shape',
      width: 88,
      height: 20,
      x: 30,
      y: y + 14,
      // attrs: {
      //   body: { rx: 10, ry: 10 }
      // },
      component: (
        <div
          className="rounded-xl h-5 text-xs text-center px-1 leading-5 "
          style={{
            border: `1px solid rgb(233, 46, 94)`,
            background: `linear-gradient(316deg, #FFF3F8 0%, #FFDBDD 100%)`
          }}
          onDoubleClick={() => setHook(hookState.mockResolve)}
        >
          mockResolve
        </div>
      )
    })

    // 执行
    const operation = graph.createNode({
      shape: 'operation',
      label: '执行\n(Operation)',
      x: OPERATION_X,
      y
    })
    renderNodes.push(operation)
    arrowNodes.push(operation)
    y += 12 + OPERATION_HEIGHT

    // 响应转换
    if (directiveState.transform) {
      const responseTransform = graph.createNode({
        shape: 'process',
        label: '响应转换',
        x: PROCESS_X,
        y
      })
      renderNodes.push(responseTransform)
      arrowNodes.push(responseTransform)
      // 响应转换指令
      const transformDirective = new ActionGroup(
        {
          shape: 'directiveTrigger',
          label: '1',
          x: 258,
          y: y + 10
        },
        [
          {
            shape: 'directive',
            label: '@transform',
            width: 82,
            height: 16,
            x: 290,
            y: y + 8
          }
        ],
        'linear'
      )
      y += 12 + PROCESS_HEIGHT
      directiveNodes.push(transformDirective)
    }

    // 响应后置钩子
    const postHookMetadata: Node.Metadata = {
      shape: 'hook',
      x: HOOK_X,
      y
    }
    // 后置指令
    new ActionGroup(
      postHookMetadata,
      [
        {
          shape: 'react-shape',
          width: 114,
          height: 20,
          component: (
            <StatusDirective
              enabled={hookState.postResolve.enable}
              label="postResolve"
              onDoubleClick={() => setHook(hookState.postResolve)}
            />
          ),
          x: 290,
          y: y - 12
        },
        {
          shape: 'react-shape',
          width: 114,
          height: 20,
          component: (
            <StatusDirective
              enabled={hookState.mutatingPostResolve.enable}
              label="mutatingPostResolve"
              onDoubleClick={() => setHook(hookState.mutatingPostResolve)}
            />
          ),
          x: 280,
          y: y + 12
        }
      ],
      'arrow'
    ).addToGraph(graph)
    y += 14 + HOOK_HEIGHT

    // 全局后置钩子
    const globalPostHookMetadata: Node.Metadata = {
      shape: 'globalHook',
      x: HOOK_X,
      y
    }
    // 全局后置指令
    const globalPostDirective = new ActionGroup(
      globalPostHookMetadata,
      [
        {
          shape: 'react-shape',
          width: 114,
          height: 20,
          component: (
            <StatusDirective
              enabled={globalHookState.onResponse.enable}
              label="onResponse"
              onDoubleClick={() => setHook(globalHookState.onResponse)}
            />
          ),
          x: 290,
          y
        }
      ],
      'arrow'
    )
    directiveNodes.push(globalPostDirective)
    y += 12 + HOOK_HEIGHT

    // 发送响应到客户端
    const sendResponse = graph.createNode({
      shape: 'process',
      label: '发送响应到客户端',
      width: 144,
      height: PROCESS_HEIGHT,
      x: PROCESS_X - (144 - PROCESS_WIDTH) / 2,
      y
    })
    renderNodes.push(sendResponse)
    arrowNodes.push(sendResponse)

    // 结束
    y += 20 + PROCESS_HEIGHT
    const end = graph.createNode({
      shape: 'terminal',
      label: '结束',
      x: TERMINAL_X,
      y
    })
    renderNodes.push(end)
    arrowNodes.push(end)

    // 主流程
    graph.addNodes(renderNodes)

    // mock 边
    graph.addEdge({
      shape: 'reject',
      source: routerSwitch,
      target: sendResponse,
      router: {
        name: 'oneSide',
        args: {
          side: 'left',
          padding: 60
        }
      },

      ...(hookState.mockResolve.enable
        ? {
            stroke: '#1034FF',
            attrs: {
              line: {
                stroke: '#1034FF',
                strokeWidth: 1,
                strokeDasharray: '3 0',
                targetMarker: ''
              }
            }
          }
        : {})
    })
    graph.addEdge({
      shape: 'rejectArrow',
      source: { x: 100, y: routerSwitch.getBBox().y + 12 },
      target: { x: 96, y: routerSwitch.getBBox().y + 12 },
      ...(hookState.mockResolve.enable
        ? {
            attrs: {
              line: {
                stroke: '#1034FF'
              }
            }
          }
        : {})
    })

    graph.addNode(mockResolve)

    // 主流程边
    graph.addEdges(
      arrowNodes.reduce<(Edge | Edge.Metadata)[]>((arr, node, index) => {
        if (index < arrowNodes.length - 1) {
          arr.push({
            shape: 'flowline',
            source: node,
            target: arrowNodes[index + 1],
            // mock 开启，灰色
            ...(hookState.mockResolve.enable &&
            index >= routerIndex &&
            index !== arrowNodes.length - 2
              ? {
                  attrs: {
                    line: {
                      stroke: '#787D8B',
                      strokeWidth: 0.5,
                      strokeDasharray: '3 3',
                      targetMarker: ''
                    }
                  }
                }
              : index === routerIndex - 1
              ? {
                  attrs: {
                    line: {
                      targetMarker: ''
                    }
                  }
                }
              : {})
          })
        }
        return arr
      }, [])
    )

    // 校验失败边
    rejectNodes.forEach(node => {
      const bbox = node[0].getBBox()
      // 边
      graph.addEdge({
        shape: 'reject',
        source: node[0],
        target: end
      })
      // 状态码
      graph.addNode({
        shape: 'flowLabel',
        label: node[1],
        width: 24,
        height: LABEL_HEIGHT,
        x: 80,
        y: bbox.y + 18
      })
      // 箭头
      graph.addEdge({
        shape: 'rejectArrow',
        source: { x: 64, y: bbox.y + 25 },
        target: { x: 60, y: bbox.y + 25 }
      })
    })

    // 指令
    directiveNodes.forEach(item => item.addToGraph(graph))

    return () => {
      console.log('dispose FlowChart')
      graph.dispose()
    }
  }, [directiveState, hookState, globalHookState])

  return (
    <>
      <div className="flex-shrink-0 min-h-175 w-102.5 !h-full" ref={containerRef} />
      {hook ? (
        <EditPanel
          apiName={(apiDesc?.path ?? '').split('/').pop() || ''}
          hook={hook}
          onClose={() => setHook(null)}
        />
      ) : (
        ''
      )}
    </>
  )
}

export default FlowChart
