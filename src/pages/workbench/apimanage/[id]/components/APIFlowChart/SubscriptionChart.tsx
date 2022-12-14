// eslint-disable-next-line import/no-unassigned-import
import '@antv/x6-react-shape/dist/x6-react-shape.js'

import { Edge, Node, Shape } from '@antv/x6'
import { Graph } from '@antv/x6'
import { isEqual } from 'lodash'
import React, { useEffect, useRef, useState } from 'react'

import gridImg from './assets/grid.png'

export interface SubscriptionChartProps {

}

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

const SubscriptionChart = React.memo((props: SubscriptionChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  
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

  }, [])

  return (
    <div className="flex flex-shrink-0 w-full overflow-x-auto overflow-y-hidden !h-full">
      <div className="flex-1 min-h-175 min-w-102" ref={containerRef} />
    </div>
  )
},
(prev, next) => isEqual(prev, next))