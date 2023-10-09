import { Breadcrumb as AntBreadcrumb } from 'antd'
import type { GraphQLObjectType } from 'graphql'

interface BreadcrumbProps {
  items: GraphQLObjectType<any, any>[]
  onClick: (i: number) => void
}

const Breadcrumb = ({ items, onClick }: BreadcrumbProps) => {
  return (
    <AntBreadcrumb
      separator="/"
      className='my-3 select-none'
      items={[
        { title: 'Root', key: 0, href: '', onClick: () => onClick(0) },
        ...items.map((item, index) => ({
          title: item.name,
          key: item.name,
          onClick: () => onClick(index + 1)
        }))
      ]}
    />
  )
}

export default Breadcrumb
