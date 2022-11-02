const NPM_REGISTRY = 'https://registry.npmjs.org'

export const getDependList = async (keys: string) => {
  const endpoint = `${NPM_REGISTRY}/-/v1/search?text=${keys}`
  const res = await fetch(endpoint)
  const data = await res.json()
  return data.objects.map((item: any) => {
    return {
      label: item.package.name,
      value: item.package.version
    }
  })
}

export const getDependVersions = async (keys: string) => {
  const endpoint = `${NPM_REGISTRY}/${keys}`
  const res = await fetch(endpoint)
  const data = await res.json()

  return {
    latest: data['dist-tags'].latest,
    list: Object.keys(data.versions).map((item: any) => {
      return {
        label: item,
        value: item
      }
    })
  }
}
