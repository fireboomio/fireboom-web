import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { useCallback } from 'react'
import { useIntl } from 'react-intl'

interface Runtime {
  days: number
  hours: number
  minutes: number
  seconds: number
}

dayjs.extend(duration)

export default function useCalcTime() {
  const intl = useIntl()
  return useCallback(
    (initTime: string) => {
      const time = dayjs.duration(
        dayjs().diff(dayjs(initTime), 'seconds'),
        'seconds'
      ) as unknown as {
        $d: Runtime
      }
      if (time.$d.days > 0) {
        return intl.formatMessage({ defaultMessage: '{days}天前' }, { days: time.$d.days })
      }
      if (time.$d.hours > 0) {
        return intl.formatMessage({ defaultMessage: '{hours}小时前' }, { hours: time.$d.hours })
      }
      if (time.$d.minutes > 0) {
        return intl.formatMessage(
          { defaultMessage: '{minutes}分钟前' },
          { minutes: time.$d.minutes }
        )
      }
      if (time.$d.seconds > 0) {
        return intl.formatMessage({ defaultMessage: '{seconds}秒前' }, { seconds: time.$d.seconds })
      }
      return intl.formatMessage({ defaultMessage: '刚刚' })
    },
    [intl]
  )
}
