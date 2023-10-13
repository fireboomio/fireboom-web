import { Breadcrumb as AntBreadcrumb } from 'antd'
import { useGraphQLExplorer } from './provider'

interface BreadcrumbProps {
  //
}

const Breadcrumb = (props: BreadcrumbProps) => {
  const { graphqlObjectStack, setGraphqlObjectStack } = useGraphQLExplorer()
  const navigateTo = (i: number) => {
    const arr = graphqlObjectStack.slice(0, i)
    setGraphqlObjectStack(arr)
  }
  return (
    <AntBreadcrumb
      separator="/"
      className="my-3 select-none"
      items={[
        {
          title: 'Root',
          key: 0,
          href: '',
          onClick: e => {
            e.stopPropagation()
            e.preventDefault()
            navigateTo(0)
          }
        },
        ...graphqlObjectStack.map((item, index) => ({
          title: item.name,
          key: item.name,
          href: index === graphqlObjectStack.length - 1 ? undefined : '',
          onClick: (e: React.MouseEvent<HTMLAnchorElement | HTMLSpanElement, MouseEvent>) => {
            e.stopPropagation()
            e.preventDefault()
            navigateTo(index + 1)
          }
        }))
      ]}
    />
  )
}

export default Breadcrumb
