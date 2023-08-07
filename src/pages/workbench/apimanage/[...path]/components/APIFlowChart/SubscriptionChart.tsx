// eslint-disable-next-line import/no-unassigned-import
import '@antv/x6-react-shape/dist/x6-react-shape.js'

import type { Node } from '@antv/x6'
import { Graph } from '@antv/x6'
import React, { useEffect, useRef } from 'react'
import { useIntl } from 'react-intl'

import { ActionGroup } from './ActionGroup'
import globalHookImg from './assets/global-hook.png'
import gridImg from './assets/grid.png'
import hookImg from './assets/hook.png'
import IndexNode from './IndexNode'
import type { CommonChartProps, SubscriptionGlobalHookState } from './interface'
import StatusDirective from './StatusDirective'

export type SubscriptionChartProps = CommonChartProps & {
  globalHookState: SubscriptionGlobalHookState
}

const CANVAS_PADDING = 24
const CANVAS_WIDTH = 410

const ENDPOINT_WIDTH = 320

// 计算图形 x 值
const ENDPOINT_X = (CANVAS_WIDTH - ENDPOINT_WIDTH) / 2

const SubscriptionChart = ({
  globalHookState,
  hookState,
  directiveState,
  apiDesc,
  onEditHook,
  onToggleHook
}: SubscriptionChartProps) => {
  const intl = useIntl()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 端点
    Graph.registerNode('endpoint', {
      inherit: 'rect',
      width: ENDPOINT_WIDTH,
      height: 28,
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

    // 决策判断
    Graph.registerNode('decision', {
      inherit: 'polygon',
      width: 112,
      height: 50,
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

    // 执行
    Graph.registerNode('operation', {
      inherit: 'rect',
      width: ENDPOINT_WIDTH,
      height: 44,
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
          rx: 6,
          ry: 6
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
      width: 20,
      height: 20,
      markup: [{ tagName: 'image' }],
      attrs: {
        image: {
          'xlink:href': globalHookImg,
          width: 20,
          height: 20,
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
      width: 20,
      height: 20,
      markup: [{ tagName: 'image' }],
      attrs: {
        image: {
          'xlink:href': hookImg,
          width: 20,
          height: 20,
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

    // 橙线
    Graph.registerEdge('orange', {
      zIndex: -1,
      attrs: {
        line: {
          stroke: '#FF9810',
          strokeWidth: '1px',
          targetMarker: {
            name: 'block',
            width: 3,
            height: 4
          }
        }
      }
    })

    // 蓝线
    Graph.registerEdge('blue', {
      zIndex: -1,
      attrs: {
        line: {
          stroke: '#1034FF',
          strokeWidth: '1px',
          targetMarker: {
            name: 'block',
            width: 3,
            height: 4
          }
        }
      }
    })

    // 自定义流程标签
    Graph.registerNode('flowLabel', {
      inherit: 'rect',
      height: 14,
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

    // 异常流程
    Graph.registerEdge('rejectLine', {
      attrs: {
        line: {
          stroke: '#787D8B',
          strokeWidth: 0.5,
          strokeDasharray: '3 3',
          targetMarker: {
            name: 'block',
            width: 3,
            height: 5
          }
        }
      }
    })

    return () => {
      Graph.unregisterNode('endpoint')
      Graph.unregisterNode('decision')
      Graph.unregisterNode('operation')
      Graph.unregisterNode('globalHook')
      Graph.unregisterNode('hook')
      Graph.unregisterNode('flowLabel')
      Graph.unregisterEdge('orange')
      Graph.unregisterEdge('blue')
      Graph.unregisterEdge('rejectLine')
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

    // 客户端
    const client = graph.createNode({
      shape: 'endpoint',
      label: intl.formatMessage({ description: '流程图', defaultMessage: '客户端' }),
      x: ENDPOINT_X,
      y: CANVAS_PADDING
    })

    // operation
    const operation = graph.createNode({
      shape: 'operation',
      label: 'Subscription Operation',
      x: ENDPOINT_X,
      y: 356
    })

    // 事件源
    const source = graph.createNode({
      shape: 'endpoint',
      label: intl.formatMessage({ description: '流程图', defaultMessage: '事件源' }),
      x: ENDPOINT_X,
      y: 507
    })

    // 主节点
    graph.addNodes([client, operation, source])

    // 流程线
    graph.addEdges([
      {
        shape: 'orange',
        source: { x: 160, y: 52 },
        target: { x: 160, y: 356 }
      },
      {
        shape: 'blue',
        source: { x: 240, y: 356 },
        target: { x: 240, y: 52 }
      },
      {
        shape: 'orange',
        source: { x: 300, y: 52 },
        target: { x: 300, y: 356 }
      },
      {
        shape: 'orange',
        source: { x: 176, y: 400 },
        target: { x: 176, y: 507 }
      },
      {
        shape: 'blue',
        source: { x: 220, y: 507 },
        target: { x: 220, y: 400 }
      },
      {
        shape: 'orange',
        source: { x: 322, y: 400 },
        target: { x: 322, y: 507 }
      }
    ])

    // fromClaim会隐式要求登录
    if (directiveState.fromClaim || apiDesc.authenticationConfig.authRequired) {
      graph.addNode({
        shape: 'decision',
        label: intl.formatMessage({ description: '流程图', defaultMessage: '登录校验?' }),
        x: 104,
        y: 72
      })
      graph.addEdge({
        shape: 'rejectLine',
        source: { x: 100, y: 97 },
        target: { x: 32, y: 97 }
      })
      graph.addNode({
        shape: 'flowLabel',
        label: '401',
        width: 26,
        height: 14,
        x: 58,
        y: 90
      })
    }

    // 授权校验
    if (directiveState.rbac) {
      graph.addNode({
        shape: 'decision',
        label: intl.formatMessage({ description: '流程图', defaultMessage: '授权校验?' }),
        x: 104,
        y: 139
      })
      graph.addEdge({
        shape: 'rejectLine',
        source: { x: 100, y: 164 },
        target: { x: 32, y: 164 }
      })
      graph.addNode({
        shape: 'flowLabel',
        label: '401',
        width: 26,
        height: 14,
        x: 57,
        y: 157
      })
    }

    // 入参校验
    if (directiveState.jsonSchema) {
      graph.addNode({
        shape: 'decision',
        label: intl.formatMessage({ description: '流程图', defaultMessage: '入参校验?' }),
        x: 104,
        y: 208
      })
      graph.addEdge({
        shape: 'rejectLine',
        source: { x: 100, y: 233 },
        target: { x: 32, y: 233 }
      })
      graph.addNode({
        shape: 'flowLabel',
        label: '400',
        width: 26,
        height: 14,
        x: 57,
        y: 226
      })
    }

    // 结束
    if (
      directiveState.fromClaim ||
      apiDesc.authenticationConfig.authRequired ||
      directiveState.rbac ||
      directiveState.jsonSchema
    ) {
      graph.addNode({
        shape: 'rect',
        label: intl.formatMessage(
          { description: '流程图', defaultMessage: '结{br}束' },
          { br: '\n' }
        ),
        x: 11,
        y: 82,
        width: 21,
        height: 164,
        attrs: {
          body: {
            stroke: '#E9EBF3',
            strokeWidth: 3,
            fill: 'none'
          },
          text: {
            fill: '#B6BACC',
            fontSize: 12
          }
        }
      })
    }

    // 钩子
    // onConnectionInit
    new ActionGroup(
      {
        shape: 'globalHook',
        // x: 132,
        x: 166,
        y: 450
      },
      [
        {
          shape: 'react-shape',
          width: 114,
          height: 20,
          component: (
            <StatusDirective
              enabled={globalHookState.onConnectionInit.enabled}
              label="onConnectionInit"
              onClick={() => {
                onEditHook?.(globalHookState.onConnectionInit)
              }}
              onToggleEnabled={flag => onToggleHook?.(globalHookState.onConnectionInit, flag)}
            />
          ),
          x: 50,
          y: 480
        }
      ],
      'arrow'
    ).addToGraph(graph, {
      position: 'left',
      fixedTargetPort: 'top',
      customVertices: [
        {
          x: 120,
          y: 464
        }
        // { x: 64, y: 470 }
      ]
    })

    // pre 钩子
    const preHooks: Node.Metadata[] = [
      {
        shape: 'react-shape',
        width: 114,
        height: 20,
        component: (
          <StatusDirective
            enabled={hookState.preResolve.enabled}
            label="preResolve"
            onClick={() => {
              onEditHook?.(hookState.preResolve)
            }}
            onToggleEnabled={flag => onToggleHook?.(hookState.preResolve, flag)}
          />
        ),
        x: 4,
        y: 264
      }
    ]
    // 根据是否支持 mutatingPreResolve 钩子显示
    if (hookState.mutatingPreResolve.can) {
      preHooks.push({
        shape: 'react-shape',
        width: 114,
        height: 20,
        component: (
          <StatusDirective
            enabled={hookState.mutatingPreResolve.enabled}
            label="mutatingPreResolve"
            onClick={() => {
              onEditHook?.(hookState.mutatingPreResolve)
            }}
            onToggleEnabled={flag => onToggleHook?.(hookState.mutatingPreResolve, flag)}
          />
        ),
        x: 4,
        y: 298
      })
    }
    new ActionGroup(
      {
        shape: 'hook',
        x: 150,
        y: 280
      },
      preHooks,
      'arrow'
    ).addToGraph(graph, { position: 'left' })

    // post 钩子
    new ActionGroup(
      { shape: 'hook', x: 230, y: 240 },
      [
        {
          shape: 'react-shape',
          width: 114,
          height: 20,
          component: (
            <StatusDirective
              enabled={hookState.mutatingPostResolve.enabled}
              label="mutatingPostResolve"
              onClick={() => {
                onEditHook?.(hookState.mutatingPostResolve)
              }}
              onToggleEnabled={flag => onToggleHook?.(hookState.mutatingPostResolve, flag)}
            />
          ),
          x: 288,
          y: 224
        },
        {
          shape: 'react-shape',
          width: 114,
          height: 20,
          component: (
            <StatusDirective
              enabled={hookState.postResolve.enabled}
              label="postResolve"
              onClick={() => {
                onEditHook?.(hookState.postResolve)
              }}
              onToggleEnabled={flag => onToggleHook?.(hookState.postResolve, flag)}
            />
          ),
          x: 288,
          y: 258
        }
      ],
      'arrow'
    ).addToGraph(graph)

    // 流程顺序
    const steps: Node.Metadata[] = [
      {
        shape: 'react-shape',
        x: 132,
        y: 315,
        component: (
          <IndexNode
            index="1"
            text={intl.formatMessage({ description: '流程图', defaultMessage: '订阅' })}
          />
        )
      },
      {
        shape: 'react-shape',
        // x: 108,
        x: 148,
        y: 415,
        component: (
          <IndexNode
            index="2"
            text={intl.formatMessage({ description: '流程图', defaultMessage: '订阅' })}
          />
        )
      },
      {
        shape: 'react-shape',
        // x: 181,
        x: 192,
        y: 466,
        component: (
          <IndexNode
            index="3"
            text={intl.formatMessage({ description: '流程图', defaultMessage: '推送' })}
          />
        )
      },
      {
        shape: 'react-shape',
        x: 204,
        y: 188,
        component: (
          <IndexNode
            index="4"
            text={intl.formatMessage({ description: '流程图', defaultMessage: '推送' })}
          />
        )
      },
      {
        shape: 'react-shape',
        x: 272,
        y: 305,
        component: (
          <IndexNode
            index="5"
            text={intl.formatMessage({ description: '流程图', defaultMessage: '取消' })}
          />
        )
      },
      {
        shape: 'react-shape',
        x: 292,
        y: 442,
        component: (
          <IndexNode
            index="6"
            text={intl.formatMessage({ description: '流程图', defaultMessage: '取消' })}
          />
        )
      }
    ]
    steps.forEach(step => {
      graph.addNode(step)
    })

    // 备注
    graph.addNode({
      shape: 'rect',
      x: 286,
      y: 552,
      label: intl.formatMessage({
        description: '流程图',
        defaultMessage: '注：3 → 4 重复执行'
      }),
      attrs: {
        body: {
          fill: 'none',
          stroke: 'none'
        },
        text: {
          fill: '#9296A0',
          fontSize: 12
        }
      }
    })
  }, [apiDesc, directiveState, globalHookState, hookState, onEditHook])

  return (
    <div className="flex flex-shrink-0 w-full overflow-x-auto overflow-y-hidden !h-full">
      <div className="flex-1 min-h-175 min-w-102" ref={containerRef} />
    </div>
  )
}

export default SubscriptionChart
