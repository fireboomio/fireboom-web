import type { Edge, Graph, Node } from '@antv/x6'

export class ActionGroup {
  _trigger: Node.Metadata
  _references: Node.Metadata[]
  trigger!: Node
  references!: Node[]
  edges!: Edge[]
  linkType: 'linear' | 'arrow'

  constructor(trigger: Node.Metadata, references: Node.Metadata[], linkType: 'linear' | 'arrow') {
    this._trigger = trigger
    this._references = references
    this.linkType = linkType
  }

  public addToGraph(
    graph: Graph,
    {
      position = 'right'
    }: {
      position?: 'right' | 'left'
    } = {}
  ) {
    const revertPosition = position === 'right' ? 'left' : 'right'
    this.trigger = graph.createNode({
      ...this._trigger,
      ports: {
        groups: {
          [position!]: {
            position: position,
            attrs: {
              circle: {
                r: 0,
                style: { visibility: 'hidden' }
              }
            }
          }
        },
        items: [
          {
            id: position,
            group: position
          }
        ]
      }
    })
    this.references = this._references.map(ref =>
      graph.createNode({
        ...ref,
        ports: {
          groups: {
            [revertPosition]: {
              position: revertPosition,
              attrs: {
                circle: {
                  r: 0,
                  style: { visibility: 'hidden' }
                }
              }
            }
          },
          items: [
            {
              id: revertPosition,
              group: revertPosition
            }
          ]
        }
      })
    )
    graph.addNode(this.trigger)
    graph.addNodes(this.references)
    this.edges =
      this.linkType === 'linear'
        ? this.references.map<Edge>(ref => {
            return graph.createEdge({
              source: {
                cell: this.trigger,
                port: position
              },
              target: {
                cell: ref,
                port: revertPosition
              },
              attrs: {
                line: {
                  stroke: '#529DFF',
                  strokeWidth: 1,
                  targetMarker: ''
                }
              }
            })
          })
        : this.references.map<Edge>(ref => {
            return graph.createEdge({
              source: {
                cell: this.trigger,
                port: position
              },
              target: {
                cell: ref,
                port: revertPosition
              },
              connector: 'smooth',
              attrs: {
                line: {
                  stroke: {
                    type: 'linearGradient',
                    attrs: { x1: '0%', y1: '0%', x2: '100%', y2: '0%' },
                    stops: [
                      { offset: '0%', color: '#CF4BFF' },
                      { offset: '100%', color: '#478FFF' }
                    ]
                  },
                  strokeWidth: 2,
                  targetMarker: {
                    name: 'block',
                    fill: '#478FFF',
                    width: 9,
                    height: 12
                  }
                }
              }
            })
          })
    graph.addEdges(this.edges)
    graph.on('node:click', ({ cell }) => {
      if (cell === this.trigger) {
        if (this.references.length) {
          if (this.references[0].isVisible()) {
            this.references.forEach(r => r.hide())
            this.edges.forEach(e => e.hide())
          } else {
            this.references.forEach(r => r.show())
            this.edges.forEach(e => e.show())
          }
        }
      }
    })
  }
}
