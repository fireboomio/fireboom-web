export default function ModelEditorContent() {
  interface a {
    property: string
    value: string
    note: string
    [key: string]: number | string | boolean
  }
  const fileds: a[] = [
    { property: 'id', value: '123', note: 'default' },
    { property: 'title', value: 'string', note: 'char' },
    { property: 'content', value: 'string', note: '' },
  ]
  return (
    <>
      {fileds.map((item) => (
        <div className="flex justify-start items-center pt-2 pb-2">
          <div className="mr-3">{item.property}</div>
          <div className="mr-4">{item.value}</div>
          <div>{item.note}</div>
        </div>
      ))}
    </>
  )
}
