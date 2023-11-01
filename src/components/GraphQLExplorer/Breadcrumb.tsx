import { Breadcrumb as AntBreadcrumb } from 'antd'
import type { ItemType } from 'antd/es/breadcrumb/Breadcrumb'

import { useGraphQLExplorer } from './provider'

interface BreadcrumbProps {
  //
}

const Breadcrumb = (props: BreadcrumbProps) => {
  const { argumentStack, setArgumentStack, graphqlObjectStack, setGraphQLObjectStack } =
    useGraphQLExplorer()
  const navigateToField = (i: number) => {
    const arr = graphqlObjectStack.slice(0, i)
    setGraphQLObjectStack(arr)
    setArgumentStack([])
  }
  const navigateToArgument = (i: number) => {
    const arr = argumentStack.slice(0, i)
    setArgumentStack(arr)
  }

  const items: ItemType[] = [
    {
      title: <><span className='italic text-gray pr-1'>(Beta)</span><span>Root</span></>,
      key: 0,
      href: '',
      onClick: e => {
        e.stopPropagation()
        e.preventDefault()
        navigateToField(0)
      }
    },
    ...graphqlObjectStack.map<ItemType>((item, index) => ({
      title: item.name,
      key: item.name,
      href: argumentStack.length ? '' : index === graphqlObjectStack.length - 1 ? undefined : '',
      onClick: (e: React.MouseEvent<HTMLAnchorElement | HTMLSpanElement, MouseEvent>) => {
        e.stopPropagation()
        e.preventDefault()
        navigateToField(index + 1)
      }
    }))
  ]
  if (argumentStack.length) {
    items.push(
      ...argumentStack.map<ItemType>((item, index) => ({
        title: (() => {
          const arr = [item.name]
          if (index === 0) {
            arr.unshift('(')
          }
          if (index === argumentStack.length - 1) {
            arr.push(')')
          }
          return arr.join('')
        })(),
        key: item.name,
        className: 'italic text-xs',
        href: index === argumentStack.length - 1 ? undefined : '',
        onClick: (e: React.MouseEvent<HTMLAnchorElement | HTMLSpanElement, MouseEvent>) => {
          e.stopPropagation()
          e.preventDefault()
          navigateToArgument(index + 1)
        }
      }))
    )
  }

  return <AntBreadcrumb separator="/" className="my-3 select-none" items={items} />
}

export default Breadcrumb
