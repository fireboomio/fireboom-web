import axios from 'axios'

import { Result } from '@/interfaces/common'

export const getFetcher = <T>(url: string, params?: Record<string, string>) =>
  axios.get<Result<T>>(url, { params: params }).then((res) => {
    return res.data.result ?? res.data
  })
