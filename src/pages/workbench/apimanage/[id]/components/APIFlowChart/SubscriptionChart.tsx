// eslint-disable-next-line import/no-unassigned-import
import '@antv/x6-react-shape/dist/x6-react-shape.js'

import { Edge, Node, Shape } from '@antv/x6'
import { Graph } from '@antv/x6'
import { isEqual } from 'lodash'
import React, { useEffect, useRef, useState } from 'react'

import globalHookImg from './assets/global-hook.png'
import gridImg from './assets/grid.png'
import hookImg from './assets/hook.png'

export interface SubscriptionChartProps {

}

const CANVAS_PADDING = 20
const CANVAS_WIDTH = 410

const ENDPOINT_WIDTH = 320

// 计算图形 x 值
const ENDPOINT_X = (CANVAS_WIDTH - ENDPOINT_WIDTH) / 2

const SubscriptionChart = React.memo((props: SubscriptionChartProps) => {
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

    return () => {
      Graph.unregisterNode('endpoint')
      Graph.unregisterNode('decision')
      Graph.unregisterNode('operation')
      Graph.unregisterNode('globalHook')
      Graph.unregisterNode('hook')
      Graph.unregisterEdge('orange')
      Graph.unregisterEdge('blue')
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
      label: '客户端',
      x: ENDPOINT_X,
      y: CANVAS_PADDING,
      ports: {
        groups: {
          g1: {
            size: {
              width: 0,
              height: 0
            }
          }
        }
      }
    })

    // operation
    const operation = graph.createNode({
      shape: 'operation',
      label: 'Subscription Operation',
      x: ENDPOINT_X,
      y: 450,
    })

    // 事件源
    const source = graph.createNode({
      shape: 'endpoint',
      label: '事件源',
      x: ENDPOINT_X,
      y: 700,
    })
    
    // graph.addEdges([
    //   {
    //     shape: 'orange',
    //   }
    // ])

    graph.addNodes([
      client,
      operation,
      source
    ])
  }, [])

  return (
    <div className="flex flex-shrink-0 w-full overflow-x-auto overflow-y-hidden !h-full">
      <div className="flex-1 min-h-175 min-w-102" ref={containerRef} />
    </div>
  )
},
(prev, next) => isEqual(prev, next))

export default SubscriptionChart