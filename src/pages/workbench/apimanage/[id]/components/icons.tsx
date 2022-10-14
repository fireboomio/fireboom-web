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

export const CopyOutlined = (props: SVGAttributes<SVGSVGElement>) => {
  return (
    <svg {...props} height="18" viewBox="0 0 18 18" width="18">
      <g fill="none" fillRule="evenodd">
        <circle cx="9" cy="9" r="8.9" stroke="#afb0b4" strokeOpacity=".6" strokeWidth=".2" />
        <g stroke="currentColor" strokeWidth=".5">
          <path
            d="m6 6.55731405v-.55731405c0-.55228475.44771525-1 1-1h5c.5522847 0 1 .44771525 1 1v5c0 .5522847-.4477153 1-1 1h-.4315054"
            strokeLinecap="round"
          />
          <rect height="6.5" rx="1" width="6.5" x="4.25" y="7.25" />
        </g>
      </g>
    </svg>
  )
}

export const LinkOutlined = (props: SVGAttributes<SVGSVGElement>) => {
  return (
    <svg {...props} height="18" viewBox="0 0 18 18" width="18">
      <g fill="none" fillRule="evenodd">
        <circle cx="9" cy="9" r="8.9" stroke="#afb0b4" strokeOpacity=".6" strokeWidth=".2" />
        <g stroke="currentColor" strokeLinecap="round" strokeWidth=".5">
          <path
            d="m9.4512426 7h2.4654241c1.1505932 0 2.0833333.9327401 2.0833333 2.08333333 0 1.15059327-.9327401 2.08333337-2.0833333 2.08333337h-2.42678281m-1.30571004 0h-2.10084052c-1.15059323 0-2.08333333-.9327401-2.08333333-2.08333337 0-1.15059323.9327401-2.08333333 2.08333333-2.08333333h2.1057142"
            transform="matrix(.83867057 -.54463904 .54463904 .83867057 -3.495173 6.36716)"
          />
          <path
            d="m6.951996 9.125026h3.967607"
            transform="matrix(.83867057 -.54463904 .54463904 .83867057 -3.528238 6.33892)"
          />
        </g>
      </g>
    </svg>
  )
}

export const FlashFilled = (props: SVGAttributes<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      width="8px"
      height="8px"
      viewBox="0 0 8 8"
    >
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <path
          d="M6.97101016,3.30839499 C6.92839638,3.22659007 6.8449487,3.17100435 6.7495246,3.16086024 L4.28214722,2.89529769 L4.28214722,0.269179155 C4.2825151,0.148250551 4.19777084,0.0420241305 4.0751865,0.00975515812 C3.95260215,-0.0225138143 3.82245894,0.0271458538 3.7573534,0.131032987 L1.04027573,4.4363652 C0.990899969,4.51415626 0.986667761,4.61072446 1.02898983,4.6938804 C1.07160361,4.77568532 1.1550513,4.83127104 1.2504754,4.84141515 L3.71785279,5.10831892 L3.71785279,7.731755 C3.71793063,7.87987196 3.84420665,8 4,8 C4.09734079,8 4.19044937,7.9517159 4.24123586,7.86990117 L6.95972427,3.56591018 C7.00910003,3.48677791 7.01333224,3.39020971 6.97101016,3.30839499 L6.97101016,3.30839499 Z"
          fill="currentColor"
          fillRule="nonzero"
         />
      </g>
    </svg>
  )
}
