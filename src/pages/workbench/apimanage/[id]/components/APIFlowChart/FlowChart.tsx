// eslint-disable-next-line import/no-unassigned-import
import '@antv/x6-react-shape/dist/x6-react-shape.js'

import type { Edge, Node } from '@antv/x6'
import { Graph, Shape } from '@antv/x6'
import React, { useEffect, useRef } from 'react'
import { useIntl } from 'react-intl'

import { ActionGroup } from './ActionGroup'
import globalHookImg from './assets/global-hook.png'
import gridImg from './assets/grid.png'
import hookImg from './assets/hook.png'
import loopImg from './assets/loop.png'
import loopInactiveImg from './assets/loop-inactive.png'
import routerBottomImg from './assets/tee-bottom.png'
import routerLeftImg from './assets/tee-left.png'
import type { CommonChartProps, NormalGlobalHookState } from './interface'
import StatusDirective from './StatusDirective'

export type FlowChartProps = CommonChartProps & {
  globalHookState: NormalGlobalHookState
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

const FlowChart = ({
  globalHookState,
  hookState,
  directiveState,
  apiSetting,
  onEditHook
}: FlowChartProps) => {
  const intl = useIntl()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
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

    return () => {
      Graph.unregisterNode('terminal')
      Graph.unregisterEdge('flowline')
      Graph.unregisterEdge('rejectArrow')
      Graph.unregisterNode('decision')
      Graph.unregisterNode('process')
      Graph.unregisterNode('operation')
      Graph.unregisterNode('globalHook')
      Graph.unregisterNode('hook')
      Graph.unregisterNode('flowLabel')
      Graph.unregisterNode('router')
      Graph.unregisterEdge('reject')
      Graph.unregisterNode('directiveTrigger')
      Graph.unregisterNode('directive')
    }
  }, [])

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
      },
      autoResize: true
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
      label: intl.formatMessage({ description: '流程图', defaultMessage: '开始请求' }),
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
                onClick={() => onEditHook?.(globalHookState.onRequest)}
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
    // fromClaim会隐式要求登录
    if (directiveState.fromClaim || apiSetting.authenticationRequired) {
      const loggedValidation = graph.createNode({
        shape: 'decision',
        label: intl.formatMessage({ description: '流程图', defaultMessage: '登录校验?' }),
        x: DECISION_X,
        y
      })
      arrowNodes.push(loggedValidation)
      // 指令
      if (directiveState.fromClaim) {
        const fromClaimDirective = new ActionGroup(
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
        directiveNodes.push(fromClaimDirective)
      }
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
        label: intl.formatMessage({ description: '流程图', defaultMessage: '授权校验?' }),
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
        label: intl.formatMessage({ description: '流程图', defaultMessage: '入参校验?' }),
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
        label: intl.formatMessage({ description: '流程图', defaultMessage: '参数注入' }),
        x: PROCESS_X,
        y
      })
      arrowNodes.push(argsInjection)

      // 参数注入指令集
      const directives: Node.Metadata[] = []
      if (directiveState.injectCurrentDatetime) {
        directives.push({
          shape: 'directive',
          label: '@CurrentDatetime',
          width: 110,
          height: 16,
          x: 290,
          y: y + 40
        })
      }
      if (directiveState.injectEnvironmentVariable) {
        directives.push({
          shape: 'directive',
          label: '@EnvironmentVariable',
          width: 128,
          height: 16,
          x: 280,
          y: y - 40
        })
      }
      if (directiveState.injectGeneratedUUID) {
        directives.push({
          shape: 'directive',
          label: '@GeneratedUUID',
          width: 110,
          height: 16,
          x: 290,
          y: y
        })
      }
      const injectDirective = new ActionGroup(
        {
          shape: 'directiveTrigger',
          label: '3',
          x: 258,
          y: y
        },
        directives,
        'linear'
      )
      directiveNodes.push(injectDirective)
      y += 7 + PROCESS_HEIGHT
      renderNodes.push(argsInjection)
    }

    // 路由器
    const routerSwitch = graph.createNode({
      shape: 'router',
      x: (CANVAS_WIDTH - 54) / 2,
      y,
      attrs: {
        image: {
          width: 54,
          height: 36,
          'xlink:href': hookState.mockResolve.enable ? routerLeftImg : routerBottomImg
        }
      }
    })
    renderNodes.push(routerSwitch)
    // 记录路由索引
    const routerIndex = arrowNodes.push(routerSwitch) - 1
    y += 12 + 36

    const loopStartPoint = y - 6

    // 执行前钩子
    const preHookMetadata: Node.Metadata = {
      shape: 'hook',
      x: HOOK_X,
      y
    }

    // 执行前置指令集
    const preHookRefs: Node.Metadata[] = [
      {
        shape: 'react-shape',
        width: 114,
        height: 20,
        component: (
          <StatusDirective
            enabled={hookState.preResolve.enable}
            label="preResolve"
            onClick={() => onEditHook?.(hookState.preResolve)}
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
            enabled={hookState.customResolve.enable}
            label="customResolve"
            onClick={() => onEditHook?.(hookState.customResolve)}
          />
        ),
        x: 290,
        y: y + 16
      }
    ]
    // 根据是否支持 mutatingPreResolve 钩子显示
    if (hookState.mutatingPreResolve.can) {
      preHookRefs.splice(1, 0, {
        shape: 'react-shape',
        width: 114,
        height: 20,
        component: (
          <StatusDirective
            enabled={hookState.mutatingPreResolve.enable}
            label="mutatingPreResolve"
            onClick={() => onEditHook?.(hookState.mutatingPreResolve)}
          />
        ),
        x: 280,
        y: y - 8
      })
    }
    const preOperationDirective = new ActionGroup(preHookMetadata, preHookRefs, 'arrow')
    directiveNodes.push(preOperationDirective)
    y += 14 + HOOK_HEIGHT

    // mockResolve
    const mockResolve = graph.createNode({
      shape: 'react-shape',
      width: 88,
      height: 20,
      x: 30,
      y: y + 94,
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
          onClick={() => onEditHook?.(hookState.mockResolve)}
        >
          mockResolve
        </div>
      )
    })

    // 执行
    const operation = graph.createNode({
      shape: 'operation',
      label: intl.formatMessage({ description: '流程图', defaultMessage: '执行\n(Operation)' }),
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
        label: intl.formatMessage({ description: '流程图', defaultMessage: '响应转换' }),
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
              onClick={() => onEditHook?.(hookState.postResolve)}
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
              onClick={() => onEditHook?.(hookState.mutatingPostResolve)}
            />
          ),
          x: 280,
          y: y + 12
        }
      ],
      'arrow'
    ).addToGraph(graph)
    y += 14 + HOOK_HEIGHT

    const loopEndPoint = y - 6

    // 轮询
    if (apiSetting.liveQueryEnable) {
      const centerY = (loopEndPoint - loopStartPoint) / 2 + loopStartPoint
      const flowHook = hookState.mockResolve.enable
      // 开始
      const s = new Shape.Rect({
        x: HOOK_X,
        y: loopStartPoint,
        // visible: false,
        width: 0,
        height: 0
      })
      // 中间
      const c1 = new Shape.Rect({
        x: PROCESS_X - 40,
        y: centerY - 12,
        width: 0,
        height: 0
      })
      const c2 = new Shape.Rect({
        x: PROCESS_X - 40,
        y: centerY + 12,
        width: 0,
        height: 0
      })
      // 结束
      const e = new Shape.Rect({
        x: HOOK_X,
        y: loopEndPoint,
        // visible: false,
        width: 0,
        height: 0
      })
      graph.addNodes([s, e, c1, c2])
      graph.addEdge({
        source: s,
        target: c1,
        connector: {
          name: 'rounded',
          args: {
            radius: 100
          }
        },
        vertices: [{ x: c1.getBBox().x, y: loopStartPoint }],
        attrs: {
          line: {
            stroke: {
              type: 'linearGradient',
              attrs: { x1: '0%', y1: '0%', x2: '100%', y2: '0%' },
              stops: [
                {
                  offset: '0%',
                  color: flowHook ? 'rgba(179, 186, 204, 0.2)' : 'rgba(71, 143, 255, 0.2)'
                },
                {
                  offset: '100%',
                  color: flowHook ? 'rgba(179, 186, 204, 0.5)' : 'rgba(71, 143, 255, 0.5)'
                }
              ]
            },
            strokeWidth: 2,
            targetMarker: ''
          }
        }
      })
      graph.addEdge({
        source: c2,
        target: e,
        connector: {
          name: 'rounded',
          args: {
            radius: 100
          }
        },
        vertices: [{ x: c2.getBBox().x, y: loopEndPoint }],
        attrs: {
          line: {
            stroke: {
              type: 'linearGradient',
              attrs: { x1: '0%', y1: '0%', x2: '100%', y2: '0%' },
              stops: [
                {
                  offset: '0%',
                  color: flowHook ? 'rgba(179, 186, 204, 0.5)' : 'rgba(71, 143, 255, 0.5)'
                },
                {
                  offset: '100%',
                  color: flowHook ? 'rgba(179, 186, 204, 1)' : 'rgba(71, 143, 255, 1)'
                }
              ]
            },
            strokeWidth: 2,
            targetMarker: {
              name: 'block',
              fill: flowHook ? '#B3BACC' : '#478FFF',
              width: 9,
              height: 12
            }
          }
        }
      })
      graph.addNode({
        inherit: 'rect',
        x: c1.getBBox().x - 23,
        y: c1.getBBox().y + 6,
        width: 47,
        height: 16,
        markup: [{ tagName: 'image' }],
        attrs: {
          image: {
            height: 16,
            width: 47,
            'xlink:href': flowHook ? loopInactiveImg : loopImg
          }
        }
      })
      graph.addNode({
        x: c1.getBBox().x - 20,
        y: c1.getBBox().y,
        width: 40,
        height: 12,
        attrs: {
          body: {
            fill: 'transparent',
            stroke: 'transparent'
          },
          label: {
            fontSize: 11,
            stroke: flowHook ? '#B3BACC' : '#478FFF',
            text: `${apiSetting.liveQueryPollingIntervalSeconds}s`
          }
        }
      })
    }

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
              onClick={() => onEditHook?.(globalHookState.onResponse)}
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
      label: intl.formatMessage({ description: '流程图', defaultMessage: '发送响应到客户端' }),
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
      label: intl.formatMessage({ description: '流程图', defaultMessage: '结束' }),
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
      source: { x: 100, y: routerSwitch.getBBox().y + 18 },
      target: { x: 96, y: routerSwitch.getBBox().y + 18 },
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
  }, [directiveState, hookState, globalHookState, apiSetting, onEditHook])

  return (
    <div className="flex flex-shrink-0 w-full overflow-x-auto overflow-y-hidden !h-full">
      <div className="flex-1 min-h-175 min-w-102" ref={containerRef} />
    </div>
  )
}

export default FlowChart
