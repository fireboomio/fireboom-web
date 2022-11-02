import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

interface Runtime {
  days: number
  hours: number
  minutes: number
  seconds: number
}
dayjs.extend(duration)
export default function (initTime: string) {
  const time = dayjs.duration(dayjs().diff(dayjs(initTime), 'seconds'), 'seconds') as unknown as {
    $d: Runtime
  }
  if (time.$d.days > 0) {
    return `${time.$d.days}天前`
  }
  if (time.$d.hours > 0) {
    return `${time.$d.hours}小时前`
  }
  if (time.$d.minutes > 0) {
    return `${time.$d.minutes}分钟前`
  }
  if (time.$d.seconds > 0) {
    return `${time.$d.seconds}秒前`
  }
  return '刚刚'
}
