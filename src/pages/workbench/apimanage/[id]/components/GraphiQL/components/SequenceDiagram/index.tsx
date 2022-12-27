import type { Node } from '@antv/x6'
import { Graph } from '@antv/x6'
import type { SelectionNode } from 'graphql'
import { Kind } from 'graphql'
import { useEffect, useMemo, useRef } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { useAPIManager } from '../../../../store'

type SequenceItem = {
  name?: string
  from: string
  to: string
  children: SequenceItem[]
}

const HEIGHT_PER_SEQUENCE = 32

function getLabelAttrs(name: string) {
  return {
    position: {
      distance: 0.5,
      offset: {
        y: -12,
        x: 0
      }
    },
    attrs: {
      text: {
        text: name,
        fill: '#888',
        fontSize: 11,
        textAnchor: 'middle',
        textVerticalAnchor: 'middle',
        pointerEvents: 'none'
      }
    }
  }
}

const SequenceDiagram = () => {
  const intl = useIntl()
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
          const dataSource = fieldName.split('_').shift()!
          let found = false
          if (allQueryFields.includes(fieldName)) {
            list.push({ name: fieldName, children, from, to: dataSource })
            found = true
            if (!dataSourceList.includes(dataSource)) {
              dataSourceList.push(dataSource)
            }
          }
          if (sel.selectionSet?.selections.length) {
            findChildren(
              sel.selectionSet.selections,
              found ? children : list,
              found ? dataSource : from
            )
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

  const totalHeight = useMemo(() => {
    let h = 72 * 2
    function calcHeight(list: SequenceItem[]) {
      h += list.length * HEIGHT_PER_SEQUENCE * 2
      for (const item of list) {
        calcHeight(item.children)
      }
    }
    calcHeight(sequence.sequenceList)
    return h
  }, [sequence.sequenceList])

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
      // defaultLabel: {
      //   position: 4,
      //   attrs: {
      //     text: {
      //       fill: '#888',
      //       fontSize: 11,
      //       textAnchor: 'middle',
      //       textVerticalAnchor: 'middle',
      //       pointerEvents: 'none'
      //     }
      //   }
      // }
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
    if (selections.length) {
      setTimeout(() => {
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
            label: intl.formatMessage({ defaultMessage: '客户端' }),
            x: 12,
            y: 12
          }),
          graph.createNode({
            shape: 'block',
            label: intl.formatMessage({ defaultMessage: '客户端' }),
            x: 12,
            y: totalHeight - 40
          }),
          graph.createNode({
            shape: 'block',
            label: intl.formatMessage({ defaultMessage: '服务端' }),
            x: 148,
            y: 12
          }),
          graph.createNode({
            shape: 'block',
            label: intl.formatMessage({ defaultMessage: '服务端' }),
            x: 148,
            y: totalHeight - 40
          })
        ]

        // 关联到的数据源
        for (const [index, seq] of sequence.dataSourceList.entries()) {
          const node = graph.createNode({
            shape: 'block',
            label: seq,
            x: 20 + 136 * (index + 2),
            y: 12
          })
          dataSourceNodes.push(node)
          const eNode = graph.createNode({
            shape: 'block',
            label: seq,
            x: 20 + 136 * (index + 2),
            y: totalHeight - 40
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

        // 请求去程 客户端-服务端
        const e1 = graph.addEdge({
          shape: 'flow',
          source: { x: 52, y: 64 },
          target: { x: 188, y: 64 }
        })
        e1.appendLabel(getLabelAttrs(intl.formatMessage({ defaultMessage: '发起请求' })))

        let y = 56
        console.log(sequence.sequenceList)

        // eslint-disable-next-line no-inner-declarations
        function loopSequence(list: SequenceItem[]) {
          // 请求去程
          for (const seq of list) {
            y += HEIGHT_PER_SEQUENCE
            let source: Node
            let target: Node
            if (!seq.from) {
              source = dataSourceNodes[2]
            } else {
              const index = sequence.dataSourceList.indexOf(seq.from)
              source = dataSourceNodes[index * 2 + 4]
            }
            const toIndex = sequence.dataSourceList.indexOf(seq.to)
            target = dataSourceNodes[toIndex * 2 + 4]
            const edge = graph.addEdge({
              shape: 'flow',
              source: { x: source.getBBox().x + 40, y },
              target: { x: target.getBBox().x + 40, y }
            })
            if (seq.name) {
              edge.appendLabel(getLabelAttrs(seq.name))
            }
          }
          for (const seq of list) {
            if (seq.children.length) {
              loopSequence(seq.children)
            }
          }
          // 请求回程
          for (const seq of list) {
            y += HEIGHT_PER_SEQUENCE
            let source: Node
            let target: Node
            if (!seq.from) {
              target = dataSourceNodes[2]
            } else {
              const index = sequence.dataSourceList.indexOf(seq.from)
              target = dataSourceNodes[index * 2 + 4]
            }
            const toIndex = sequence.dataSourceList.indexOf(seq.to)
            source = dataSourceNodes[toIndex * 2 + 4]
            const edge = graph.addEdge({
              shape: 'dash-flow',
              source: { x: source.getBBox().x + 40, y },
              target: { x: target.getBBox().x + 40, y }
            })
            if (seq.name) {
              edge.appendLabel(getLabelAttrs(seq.name))
            }
          }
        }
        loopSequence(sequence.sequenceList)

        // 请求回程 服务端-客户端
        y += HEIGHT_PER_SEQUENCE
        const e2 = graph.addEdge({
          shape: 'dash-flow',
          source: { x: 188, y },
          target: { x: 52, y }
        })
        e2.appendLabel(getLabelAttrs(intl.formatMessage({ defaultMessage: '请求结果' })))

        // return graph.dispose
      }, 100)
    }
  }, [totalHeight, selections, sequence.dataSourceList, sequence.sequenceList])

  return (
    <div className="bg-white rounded shadow p-2">
      <div
        ref={containerRef}
        // className="min-w-60 min-h-40"
        style={{
          width: `${40 + (2 + sequence.dataSourceList.length) * 136}px`,
          height: `${totalHeight}px`
        }}
      >
        {!selections.length && (
          <div className="p-4">
            <FormattedMessage defaultMessage="暂无内容" />{' '}
          </div>
        )}
      </div>
    </div>
  )
}

export default SequenceDiagram
