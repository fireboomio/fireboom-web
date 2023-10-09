export const AddOutlined = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 24 24"
      role="checkbox"
      aria-checked="false"
      className={`icon ${className}`}
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
      >
        <path d="M12 7.5v9M7.5 12h9M12 .75C18.213.75 23.25 5.787 23.25 12S18.213 23.25 12 23.25.75 18.213.75 12 5.787.75 12 .75z"></path>
      </g>
    </svg>
  )
}

export const CheckedFilled = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 24 24"
      role="checkbox"
      aria-checked="true"
      className={`icon ${className}`}
      {...props}
    >
      <path
        fill="currentColor"
        d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm6.9 8.2l-6.8 9.3c-.3.4-1 .5-1.4.2l-4.9-3.9c-.4-.3-.5-1-.2-1.4s1-.5 1.4-.2l4.1 3.3L17.3 7c.3-.5.9-.6 1.4-.3.5.3.6 1 .2 1.5.1 0 0 0 0 0z"
      />
      <path
        fill="transparent"
        d="M18.9 8.2l-6.8 9.3c-.3.4-1 .5-1.4.2l-4.9-3.9c-.4-.3-.5-1-.2-1.4s1-.5 1.4-.2l4.1 3.3L17.3 7c.3-.5.9-.6 1.4-.3.5.3.6 1 .2 1.5.1 0 0 0 0 0z"
        className="inner"
      />
    </svg>
  )
}

export const ArrowFilled = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox="0 0 24 24" className={`icon ${className}`} {...props}>
      <g
        fill="none"
        fillRule="evenodd"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
      >
        <path d="M.75 12h22.5M12.75 1.5L23.25 12l-10.5 10.5"></path>
      </g>
    </svg>
  )
}

export const SortableOutlined = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox="0 0 24 24" className={`icon ${className}`} {...props}>
      <g
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1"
      >
        <path d="M3.75 15l7.72 7.72a.75.75 0 0 0 1.06 0L20.25 15M3.75 9l7.72-7.72a.749.749 0 0 1 1.059-.001l.001.001L20.25 9"></path>
      </g>
    </svg>
  )
}
