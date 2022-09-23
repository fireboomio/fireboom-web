import styles from './Designer.module.scss'

const data = [
  {
    name: 'API',
    items: [{ name: 'REST API' }, { name: 'GraphQL API' }],
  },
  { name: '数据库', items: [{ name: 'PostgreSQL' }, { name: 'MySQL' }] },
  { name: '自定义', items: [{ name: '自定义' }] },
]

export default function Designer() {
  return (
    <>
      {data.map(category => (
        <div key={category.name} className="my-42px">
          <div className={`text-lg ${styles['title']}`}>
            <span className="pl-2.5">{category.name}</span>
          </div>
          <div className="flex flex-wrap gap-x-9.5 gap-y-5 items-center my-4">
            {category.items.map(x => (
              <div
                key={x.name}
                className="text-[#333333FF] border border-gray-300/20 bg-[#FDFDFDFF] py-3.5 pl-4 min-w-53 w-53"
              >
                {x.name}
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  )
}
