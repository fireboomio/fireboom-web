import { useEnv } from '@/providers/env'

// FIXME 经常刷新
export default function useEnvOptions() {
  const { envs } = useEnv()
  return Object.keys(envs).map(k => ({
    label: (
      <div className="flex items-center justify-between w-full">
        <span>{k}</span>
        <span className="text-[#999] pl-1">{envs[k]}</span>
      </div>
    ),
    value: k
  }))
}
