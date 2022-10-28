import axios from 'axios'
import { useState } from 'react'

export default function UserInfo() {
  const [info, setInfo] = useState<string>()

  axios.get('/api/v1/oidc/userInfo').then(info => {
    console.log(info)
    setInfo(String(info))
  })

  // const { config } = useContext(ConfigContext)
  // const apiHost =
  //   config.apiHost || `${location.protocol}//${location.pathname}:${location.protocol}`
  // const cookieId = document.cookie.replace(/(?:(?:^|.*;\s*)id\s*\=\s*([^;]*).*$)|^.*$/, '$1')
  // const cookieUser = document.cookie.replace(/(?:(?:^|.*;\s*)id\s*\=\s*([^;]*).*$)|^.*$/, '$1')
  // document.cookie = `id=${cookieId}; path=/; domain=${location.pathname}:${location.protocol}`
  // document.cookie = `user=${cookieUser}; path=/; domain=${location.pathname}:${location.protocol}`
  // void axios
  //   .get(`${apiHost}/app/main/auth/cookie/user`, {
  //     withCredentials: true,
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'WG-SDK-Version': '1.0.0-next.32'
  //     }
  //   })
  //   .then(res => {
  //     console.log('user请求结果', res.data)
  //     setInfo(res.data.toString())
  //   })

  return <div>{info}</div>
}
