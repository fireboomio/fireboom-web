import type { SVGAttributes } from 'react'

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
    <svg {...props} width="8px" height="8px" viewBox="0 0 8 8">
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

export const SaveFilled = (props: SVGAttributes<SVGSVGElement>) => {
  return (
    <svg {...props} width="10.5416667px" height="11px" viewBox="0 0 10.5416667 11">
      <defs>
        <linearGradient
          x1="8.50765497%"
          y1="100%"
          x2="88.9833073%"
          y2="23.0371066%"
          id="linearGradient-1"
        >
          <stop stopColor="#FF9378" offset="0%"></stop>
          <stop stopColor="#E13D5B" offset="100%"></stop>
        </linearGradient>
      </defs>
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <path
          d="M1,0 L4.76876914,0 C5.21627632,-8.22057342e-17 5.65085454,0.150084319 6.00298782,0.426245176 L9.77588535,3.38514356 C10.2593094,3.76426932 10.5416667,4.34454087 10.5416667,4.95889838 L10.5416667,10 C10.5416667,10.5522847 10.0939514,11 9.54166667,11 L1,11 C0.44771525,11 5.11724585e-16,10.5522847 0,10 L0,1 C-6.76353751e-17,0.44771525 0.44771525,7.67586877e-16 1,0 Z"
          fill="url(#linearGradient-1)"
        />
        <path
          d="M3,7 L7,7 C7.55228475,7 8,7.44771525 8,8 L8,11 L8,11 L2,11 L2,8 C2,7.44771525 2.44771525,7 3,7 Z"
          fill="#FFFFFF"
        />
        <line
          x1="2.25998382"
          y1="2.79651715"
          x2="6.27956774"
          y2="2.79651715"
          stroke="#FFFFFF"
          strokeWidth="0.5"
          fill="#FFFFFF"
        />
        <line
          x1="3.46763719"
          y1="8.79651715"
          x2="6.47848669"
          y2="8.79651715"
          stroke="#E92E5E"
          strokeWidth="0.5"
        />
      </g>
    </svg>
  )
}

export const CircleRemoveOutlined = (props: SVGAttributes<SVGSVGElement>) => {
  return (
    <svg {...props} width="16px" height="16px" viewBox="0 0 16 16">
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <circle strokeOpacity="0.1" stroke="#5F6269" strokeWidth="0.5" cx="8" cy="8" r="8"></circle>
        <path
          d="M9.22412229,10.6003696 C9.07186293,10.6003696 8.94916849,10.4776751 8.94916849,10.3254158 L8.94916849,7.29944566 C8.94916849,7.1471863 9.07186292,7.02449185 9.22412229,7.02449185 C9.37638166,7.02449185 9.4990761,7.14718629 9.4990761,7.29944566 L9.4990761,10.3239375 C9.4990761,10.4761969 9.37638166,10.6003696 9.22412229,10.6003696 Z M7.57439946,10.6003696 C7.4221401,10.6003696 7.29944565,10.4776751 7.29944565,10.3254158 L7.29944565,7.29944566 C7.29944565,7.1471863 7.4221401,7.02449185 7.57439947,7.02449185 C7.72665883,7.02449185 7.84935328,7.14718629 7.84935328,7.29944566 L7.84935328,10.3239375 C7.84935328,10.4761969 7.72665883,10.6003696 7.57439946,10.6003696 Z M11.9751386,5.92467663 L10.6003696,5.92467663 L10.6003696,5.37476903 C10.6003696,4.91946918 10.2337645,4.54990761 9.78142114,4.54990761 L7.02449185,4.54990761 C6.569192,4.54990761 6.19963043,4.91946918 6.19963043,5.37476903 L6.19963043,5.92467663 L4.82486141,5.92467663 C4.67260205,5.92467663 4.5499076,6.04737107 4.5499076,6.19963044 C4.5499076,6.35188981 4.67260204,6.47458425 4.82486141,6.47458425 L11.9751386,6.47458425 C12.1273979,6.47458425 12.2500924,6.35188981 12.2500924,6.19963044 C12.2500924,6.04737107 12.127398,5.92467663 11.9751386,5.92467663 Z M6.74953805,5.37476903 C6.74953805,5.22398791 6.87371074,5.09981522 7.02449186,5.09981522 L9.78142114,5.09981522 C9.93220225,5.09981522 10.050462,5.22103141 10.050462,5.37476903 L10.050462,5.92467663 L6.74953805,5.92467663 L6.74953805,5.37476903 L6.74953805,5.37476903 Z M10.3254158,12.2500924 L6.47606249,12.2500924 C6.02076264,12.2500924 5.65120107,11.8805308 5.65120107,11.425231 L5.65120107,7.29648916 C5.65120107,7.1442298 5.77389551,7.02153535 5.92615488,7.02153535 C6.07841425,7.02153535 6.20110869,7.14422979 6.20110869,7.29648916 L6.20110869,11.425231 C6.20110869,11.5774903 6.32528137,11.7001848 6.4760625,11.7001848 L10.326894,11.7001848 C10.4791534,11.7001848 10.6018478,11.5774903 10.6018478,11.425231 L10.6018478,7.30683689 C10.6018478,7.15457752 10.7245422,7.03188308 10.8768016,7.03188308 C11.029061,7.03188308 11.1517554,7.15457752 11.1517554,7.30683689 L11.1517554,11.425231 C11.1502772,11.8790526 10.7807156,12.2500924 10.3254158,12.2500924 Z"
          fill="#000000"
          fillRule="nonzero"
        />
      </g>
    </svg>
  )
}

export const CircleCloseOutlined = (props: SVGAttributes<SVGSVGElement>) => {
  return (
    <svg {...props} width="12px" height="12px" viewBox="0 0 12 12">
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeOpacity="0.6">
        <circle stroke="#AFB0B4" strokeWidth="0.4" fill="#FFFFFF" cx="6" cy="6" r="5.8" />
        <path
          d="M3,6 L9,6 M6,3 L6,9"
          stroke="#5F6269"
          strokeWidth="0.64"
          strokeLinecap="round"
          transform="translate(6.000000, 6.000000) rotate(45.000000) translate(-6.000000, -6.000000) "
        />
      </g>
    </svg>
  )
}

export const PlusCircleFilled = (props: SVGAttributes<SVGSVGElement>) => {
  return (
    <svg {...props} width="16px" height="16px" viewBox="0 0 16 16">
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <circle fill="#116DF8" cx="8" cy="8" r="8"></circle>
        <line x1="4" y1="7.6" x2="12.8" y2="7.6" stroke="#FFFFFF" strokeLinecap="round" />
        <line x1="8.4" y1="3.2" x2="8.4" y2="12" stroke="#FFFFFF" strokeLinecap="round" />
      </g>
    </svg>
  )
}
