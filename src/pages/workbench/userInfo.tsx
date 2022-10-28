import axios from 'axios'
import { useContext, useState } from 'react'

import { ConfigContext } from '@/lib/context/ConfigContext'

export default function UserInfo() {
  const [info, setInfo] = useState<string>()

  const { config } = useContext(ConfigContext)
  const apiHost =
    config.apiHost || `${location.protocol}//${location.pathname}:${location.protocol}`
  void axios
    .get(`${apiHost}/app/main/auth/cookie/user`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'WG-SDK-Version': '1.0.0-next.32'
      }
    })
    .then(res => {
      console.log('user请求结果', res.data)
      setInfo(res.data.toString())
    })

  return <div>{info}</div>
}
