import { SVGAttributes } from 'react'

export const FilterIcon = (props: SVGAttributes<SVGSVGElement>) => {
  return (
    <svg {...props} width="5.78400913px" height="6.82867681px" viewBox="0 0 5.78400913 6.82867681">
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinecap="round">
        <path
          d="M1.33952568,6.67432405 L1.33952568,2.19378413 L0.185760874,0.304226535 C0.128198148,0.209954215 0.157957154,0.08686759 0.252229475,0.0293048642 C0.283616631,0.0101398512 0.319680321,6.7555844e-18 0.35645601,0 L4.97795573,0 C5.08841268,1.73998417e-16 5.17795573,0.08954305 5.17795573,0.2 C5.17795573,0.239386698 5.1663262,0.277896602 5.1445257,0.310699806 L3.89305715,2.19378413 L3.89305715,2.19378413 L3.89305715,4.01629817"
          stroke="currentColor"
          strokeWidth="0.5"
        />
        <line
          x1="3.23144671"
          y1="5.32867681"
          x2="5.78400913"
          y2="5.32867681"
          stroke="currenColor"
          strokeWidth="0.5"
        />
        <line
          x1="3.23144671"
          y1="6.32867681"
          x2="5.78400913"
          y2="6.32867681"
          stroke="currenColor"
          strokeWidth="0.5"
        />
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
