import type { SVGAttributes } from 'react'

export const RefreshIcon = (props: SVGAttributes<SVGSVGElement>) => {
  return (
    <svg {...props} width="1em" height="1em" viewBox="0 0 24 24">
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      >
        <path d="M21.168 8A10.003 10.003 0 0 0 12 2c-5.185 0-9.45 3.947-9.95 9"></path>
        <path d="M17 8h4.4a.6.6 0 0 0 .6-.6V3M2.881 16c1.544 3.532 5.068 6 9.168 6c5.186 0 9.45-3.947 9.951-9"></path>
        <path d="M7.05 16h-4.4a.6.6 0 0 0-.6.6V21"></path>
      </g>
    </svg>
  )
}

export const ExpandIcon = (props: SVGAttributes<SVGSVGElement>) => {
  return (
    <svg {...props} width="12" height="9">
      <path fill="#666" d="M 0 0 L 0 9 L 5.5 4.5 z" />
    </svg>
  )
}

export const ExpandedIcon = (props: SVGAttributes<SVGSVGElement>) => {
  return (
    <svg {...props} width="12" height="9">
      <path fill="#666" d="M 0 2 L 9 2 L 4.5 7.5 z" />
    </svg>
  )
}

export const UnselectedCheckbox = (props: SVGAttributes<SVGSVGElement>) => {
  return (
    <svg {...props} width="12" height="12" viewBox="0 0 18 18" fill="none">
      <path
        d="M16 2V16H2V2H16ZM16 0H2C0.9 0 0 0.9 0 2V16C0 17.1 0.9 18 2 18H16C17.1 18 18 17.1 18 16V2C18 0.9 17.1 0 16 0Z"
        fill="#CCC"
      />
    </svg>
  )
}

export const SelectedCheckbox = (props: SVGAttributes<SVGSVGElement>) => {
  return (
    <svg {...props} width="12" height="12" viewBox="0 0 18 18" fill="none">
      <path
        d="M16 0H2C0.9 0 0 0.9 0 2V16C0 17.1 0.9 18 2 18H16C17.1 18 18 17.1 18 16V2C18 0.9 17.1 0 16 0ZM16 16H2V2H16V16ZM14.99 6L13.58 4.58L6.99 11.17L4.41 8.6L2.99 10.01L6.99 14L14.99 6Z"
        fill="#666"
      />
    </svg>
  )
}
