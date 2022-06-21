import type { Field } from '@/interfaces/modeling'

export default function ModelEditorContent() {
  const fileds: Field[] = [
    { property: 'id', value: '123', note: 'default' },
    { property: 'title', value: 'string', note: 'char' },
    { property: 'content', value: 'string', note: '' },
  ]

  return (
    <div className="mt-6">
      {fileds.map((item) => (
        <div key={item.property} className="flex justify-start items-center">
          <div className="mr-3">{item.property}</div>
          <div className="mr-4">{item.value}</div>
          <div>{item.note}</div>
        </div>
      ))}
    </div>
  )
}
