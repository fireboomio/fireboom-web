import { Graph } from '@antv/x6'
import { isEqual } from 'lodash'
import React, { useEffect, useRef } from 'react'

const _Chart = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 块
    Graph.registerNode('block', {
      inherit: 'rect',
      width: 80,
      height: 32,
      attrs: {
        body: {
          fill: 'none',
          strokeWidth: 0.5,
          stroke: '#333',
          rx: 4,
          ry: 4
        },
        text: {
          fontSize: 14,
          fill: '#333333'
        }
      }
    })
    // 块之间的连线
    Graph.registerEdge('block-connector', {
      attrs: {
        line: {
          stroke: '#888',
          targetMarker: ''
        }
      }
    })

    // 流程线
    Graph.registerEdge('flow', {
      attrs: {
        line: {
          stroke: '#666',
          targetMarker: {
            name: 'block',
            width: 5,
            height: 8
          }
        }
      }
    })

    // 流程虚线
    Graph.registerEdge('dash-flow', {
      attrs: {
        line: {
          stroke: '#666',
          strokeWidth: 0.5,
          strokeDasharray: '3 3',
          targetMarker: {
            name: 'block',
            width: 5,
            height: 8
          }
        }
      }
    })

    return () => {
      Graph.unregisterNode('block')
      Graph.unregisterEdge('block-connector')
      Graph.unregisterEdge('flow')
      Graph.unregisterEdge('dash-flow')
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
      autoResize: true
    })

    const client1 = graph.createNode({
      shape: 'block',
      label: '客户端',
      x: 12,
      y: 12
    })
    const client2 = graph.createNode({
      shape: 'block',
      label: '客户端',
      x: 12,
      y: 120
    })
    const server1 = graph.createNode({
      shape: 'block',
      label: '服务端',
      x: 124,
      y: 12
    })
    const server2 = graph.createNode({
      shape: 'block',
      label: '服务端',
      x: 124,
      y: 120
    })

    graph.addNodes([client1, client2, server1, server2])
    graph.addEdges([
      { shape: 'block-connector', source: client1, target: client2 },
      { shape: 'block-connector', source: server1, target: server2 },
      { shape: 'flow', source: { x: 52, y: 56 }, target: { x: 164, y: 56 } },
      { shape: 'dash-flow', source: { x: 164, y: 108 }, target: { x: 52, y: 108 } }
    ])
  }, [])

  return (
    <div className="bg-white rounded shadow p-2">
      <div className="min-w-102 min-h-80" ref={containerRef} />
    </div>
  )
}

const SequenceDiagram = React.memo(_Chart, (prev, next) => isEqual(prev, next))

export default SequenceDiagram
