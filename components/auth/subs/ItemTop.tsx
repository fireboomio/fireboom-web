import type { AuthListType } from '@/interfaces/auth'

interface Props {
  handleTopToggleDesigner: (authType: AuthListType) => void
  authType: AuthListType
}

export default function AuthItemTop({ handleTopToggleDesigner, authType }: Props) {
  return (
    <div
      className="pl-8 py-2.5 cursor-pointer hover:bg-[#F8F8F9]"
      onClick={() => handleTopToggleDesigner(authType)}
    >
      <div className="text-[#000000] h-4 leading-4">{authType.name}</div>
    </div>
  )
}
