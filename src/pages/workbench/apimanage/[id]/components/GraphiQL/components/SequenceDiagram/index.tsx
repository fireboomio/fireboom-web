import type { Node } from '@antv/x6'
import { Graph } from '@antv/x6'
import type { SelectionNode } from 'graphql'
import { Kind } from 'graphql'
import { useEffect, useMemo, useRef } from 'react'

import { useAPIManager } from '../../../../store'

type SequenceItem = {
  name?: string
  from: string
  to: string
  children: SequenceItem[]
}

const SequenceDiagram = () => {
  const { schemaAST, schema } = useAPIManager()
  const containerRef = useRef<HTMLDivElement>(null)

  const allQueryFields = useMemo(() => {
    return Object.keys({
      ...schema?.getQueryType()?.getFields(),
      ...schema?.getMutationType()?.getFields(),
      ...schema?.getSubscriptionType()?.getFields()
    })
  }, [schema])

  // selections
  const selections = useMemo(() => {
    return (
      (schemaAST?.definitions?.[0].kind === Kind.OPERATION_DEFINITION &&
        schemaAST.definitions[0].selectionSet.selections) ||
      []
    )
  }, [schemaAST])

  // 序列
  const sequence = useMemo(() => {
    const sequenceList: SequenceItem[] = []
    const dataSourceList: string[] = []

    function findChildren(
      _selections: readonly SelectionNode[],
      list: SequenceItem[],
      from: string
    ) {
      for (const sel of _selections) {
        if (sel.kind === Kind.FIELD) {
          const children: SequenceItem[] = []
          const fieldName = sel.name.value
          if (allQueryFields.includes(fieldName)) {
            const dataSource = fieldName.split('_').shift()!
            list.push({ name: fieldName, children, from, to: dataSource })
            if (!dataSourceList.includes(dataSource)) {
              dataSourceList.push(dataSource)
            }
            if (sel.selectionSet?.selections.length) {
              findChildren(sel.selectionSet.selections, children, dataSource)
            }
          }
        }
      }
    }

    findChildren(selections, sequenceList, '')

    return {
      sequenceList,
      dataSourceList
    }
  }, [allQueryFields, selections])

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

  const totalHeight = useMemo(
    () => 100 * (2 + sequence.dataSourceList.length) - 35,
    [sequence.dataSourceList.length]
  )

  useEffect(() => {
    if (selections.length) {
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

      // 初始的客户端/服务端
      const dataSourceNodes: Node[] = [
        graph.createNode({
          shape: 'block',
          label: '客户端',
          x: 12,
          y: 12
          // ports: {
          //   groups: { g: { position: 'bottom', attrs: { circle: { r: 0 } } } },
          //   items: [{ id: 'p', group: 'g' }]
          // }
        }),
        graph.createNode({
          shape: 'block',
          label: '客户端',
          x: 12,
          y: totalHeight - 35
          // ports: {
          //   groups: { g: { position: 'top', attrs: { circle: { r: 0 } } } },
          //   items: [{ id: 'p', group: 'g' }]
          // }
        }),
        graph.createNode({
          shape: 'block',
          label: '服务端',
          x: 124,
          y: 12
          // ports: {
          //   groups: { g: { position: 'bottom', attrs: { circle: { r: 0 } } } },
          //   items: [{ id: 'p', group: 'g' }]
          // }
        }),
        graph.createNode({
          shape: 'block',
          label: '服务端',
          x: 124,
          y: totalHeight - 35
          // ports: {
          //   groups: { g: { position: 'top', attrs: { circle: { r: 0 } } } },
          //   items: [{ id: 'p', group: 'g' }]
          // }
        })
      ]

      // 关联到的数据源
      for (const [index, seq] of sequence.dataSourceList.entries()) {
        const node = graph.createNode({
          shape: 'block',
          label: seq,
          x: 20 + 112 * (index + 2),
          y: 12
          // ports: {
          //   groups: { g: { position: 'bottom', attrs: { circle: { r: 0 } } } },
          //   items: [{ id: 'p', group: 'g' }]
          // }
        })
        dataSourceNodes.push(node)
        const eNode = graph.createNode({
          shape: 'block',
          label: seq,
          x: 20 + 112 * (index + 2),
          y: totalHeight - 35
          // ports: {
          //   groups: { g: { position: 'top', attrs: { circle: { r: 0 } } } },
          //   items: [{ id: 'p', group: 'g' }]
          // }
        })
        dataSourceNodes.push(eNode)
      }

      graph.addNodes([...dataSourceNodes])

      // 上下连线
      for (let i = 0; i < dataSourceNodes.length; i = i + 2) {
        graph.addEdge({
          shape: 'block-connector',
          source: dataSourceNodes[i],
          target: dataSourceNodes[i + 1]
        })
      }

      // 请求去程
      graph.addEdge({ shape: 'flow', source: { x: 52, y: 56 }, target: { x: 164, y: 56 } })

      graph.addEdge({ shape: 'dash-flow', source: { x: 164, y: 108 }, target: { x: 52, y: 108 } })

      // 请求回程

      // graph.addEdges([
      //   { shape: 'block-connector', source: client1, target: client2 },
      //   { shape: 'block-connector', source: server1, target: server2 },
      //   { shape: 'flow', source: { x: 52, y: 56 }, target: { x: 164, y: 56 } },
      //   { shape: 'dash-flow', source: { x: 164, y: 108 }, target: { x: 52, y: 108 } }
      // ])

      // return () => graph.dispose()
    }
  }, [totalHeight, selections, sequence.dataSourceList, sequence.sequenceList])

  return (
    <div className="bg-white rounded shadow p-2">
      <div
        ref={containerRef}
        className="min-w-120 min-h-80"
        style={{
          width: `${40 + (2 + sequence.dataSourceList.length) * 112}px`,
          height: `${totalHeight + 40}px`
        }}
      >
        {!selections.length && <div className="p-4">暂无内容</div>}
      </div>
    </div>
  )
}

export default SequenceDiagram
