import axios from 'axios'

const CDN = 'https://api.cdnjs.com/libraries'

export const getDependList = async (keys: string) => {
  type Return = Record<'results', { name: string; latest: string }[]>
  const data = await axios.get<any, { data: Return }>(`${CDN}?search=${keys}&limit=20`)
  // 处理data为select的label和value格式
  return data.data.results.map(item => ({ label: item.name, value: item.name }))
}

export const getDependVersions = async (keys: string) => {
  // const t = await axios.get(
  //   'https://unpkg.webutils.app/search/wunder?_data=routes%2Fsearch%2F%24query'
  // )
  // console.log(t)
  const data = await axios.get<any, { data: { versions: string[]; version: string } }>(
    `${CDN}/${keys}`
  )
  console.log({
    list: data.data.versions
      .reverse()
      .slice(0, 100)
      .map(item => ({ label: item, value: item })),
    latest: data.data.version
  })
  // 处理data为select的label和value格式
  // 倒序且筛选前100条
  return {
    list: data.data.versions
      .reverse()
      .slice(0, 100)
      .map(item => ({ label: item, value: item })),
    latest: data.data.version
  }
}
