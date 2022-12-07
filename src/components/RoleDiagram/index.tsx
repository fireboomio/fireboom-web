import type { SVGProps } from 'react'

interface RoleDiagramProps {
  rule?: string
  className?: string
}

const RequireMatchAllIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg width="31" height="31" viewBox="0 0 31 31" {...props}>
      <title>requireMatchAll</title>
      <g id="requireMatchAll" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <rect stroke="#5F6269" fill="#DCDBDC" x="0.5" y="0.5" width="30" height="30" rx="3"></rect>
        <rect stroke="#5F6269" fill="#A5A5A5" x="7.5" y="13.5" width="16" height="17" rx="3"></rect>
      </g>
    </svg>
  )
}

const RequireMatchAnyIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" {...props}>
      <title>requireMatchAny</title>
      <g id="requireMatchAny" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <rect stroke="#5F6269" fill="#DCDBDC" x="0.5" y="10.5" width="19" height="19" rx="3"></rect>
        <rect stroke="#5F6269" fill="#DCDBDC" x="10.5" y="0.5" width="19" height="19" rx="3"></rect>
        <path
          d="M17,10.5 C17.6903559,10.5 18.3153559,10.779822 18.767767,11.232233 C19.220178,11.6846441 19.5,12.3096441 19.5,13 L19.5,13 L19.5,19.5 L13,19.5 C12.3096441,19.5 11.6846441,19.220178 11.232233,18.767767 C10.779822,18.3153559 10.5,17.6903559 10.5,17 L10.5,17 L10.5,10.5 Z"
          stroke="#5F6269"
          fill="#A5A5A5"
        />
      </g>
    </svg>
  )
}

const DenyMatchAllIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg width="31" height="28" viewBox="0 0 31 28" {...props}>
      <title>denyMatchAll</title>
      <defs>
        <path
          d="M17,8 C18.6568542,8 20,9.34314575 20,11 L20,20 L14,20 C12.3431458,20 11,18.6568542 11,17 L11,8 L17,8 Z"
          id="path-1"
        ></path>
        <mask
          id="mask-2"
          maskContentUnits="userSpaceOnUse"
          maskUnits="objectBoundingBox"
          x="0"
          y="0"
          width="9"
          height="12"
          fill="white"
        >
          <use xlinkHref="#path-1"></use>
        </mask>
        <mask
          id="mask-4"
          maskContentUnits="userSpaceOnUse"
          maskUnits="objectBoundingBox"
          x="0"
          y="0"
          width="9"
          height="12"
          fill="white"
        >
          <use xlinkHref="#path-1"></use>
        </mask>
      </defs>
      <g id="denyMatchAny" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <rect stroke="#5F6269" fill="#DCDBDC" x="0.5" y="8.5" width="19" height="19" rx="3"></rect>
        <rect stroke="#5F6269" fill="#DCDBDC" x="11.5" y="0.5" width="19" height="19" rx="3"></rect>
        <mask id="mask-3" fill="white">
          <use xlinkHref="#path-1"></use>
        </mask>
        <g stroke="#5F6269" mask="url(#mask-2)" strokeWidth="2" fill="#F4F4F4" strokeDasharray="5">
          <use mask="url(#mask-4)" xlinkHref="#path-1"></use>
        </g>
        <line
          x1="8.85121931"
          y1="12.7651686"
          x2="17.8942057"
          y2="7.08731594"
          stroke="#5F6269"
          strokeWidth="0.8"
          mask="url(#mask-3)"
        ></line>
        <line
          x1="9.85121931"
          y1="14.7651686"
          x2="18.8942057"
          y2="9.08731594"
          stroke="#5F6269"
          strokeWidth="0.8"
          mask="url(#mask-3)"
        ></line>
        <line
          x1="10.8512193"
          y1="16.7651686"
          x2="19.8942057"
          y2="11.0873159"
          stroke="#5F6269"
          strokeWidth="0.8"
          mask="url(#mask-3)"
        ></line>
        <line
          x1="10.8512193"
          y1="19.7651686"
          x2="19.8942057"
          y2="14.0873159"
          stroke="#5F6269"
          strokeWidth="0.8"
          mask="url(#mask-3)"
        ></line>
        <line
          x1="10.8512193"
          y1="22.7651686"
          x2="19.8942057"
          y2="17.0873159"
          stroke="#5F6269"
          strokeWidth="0.8"
          mask="url(#mask-3)"
        ></line>
      </g>
    </svg>
  )
}

const DenyMatchAnyIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg width="44" height="20" viewBox="0 0 44 20" {...props}>
      <title>denyMatchAny</title>
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <rect stroke="#5F6269" fill="#DCDBDC" x="0.5" y="0.5" width="19" height="19" rx="3"></rect>
        <rect stroke="#5F6269" fill="#DCDBDC" x="24.5" y="0.5" width="19" height="19" rx="3"></rect>
      </g>
    </svg>
  )
}

const iconMap = {
  requireMatchAll: <RequireMatchAllIcon className="my-auto" />,
  requireMatchAny: <RequireMatchAnyIcon className="my-auto" />,
  denyMatchAll: <DenyMatchAllIcon className="my-auto" />,
  denyMatchAny: <DenyMatchAnyIcon className="my-auto" />
}

const RoleDiagram = ({ rule, className }: RoleDiagramProps) => {
  return (
    <div
      className={`flex flex-col bg-[#F4F4F7] h-16.5 w-18 items-center justify-center rounded-lg ${
        className || ''
      }`}
    >
      <div className="mt-0.5 text-xs text-[#666666] scale-75">角色列表</div>
      {rule && iconMap[rule as keyof typeof iconMap]}
    </div>
  )
}

export default RoleDiagram
