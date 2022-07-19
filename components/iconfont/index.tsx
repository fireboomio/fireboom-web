import { createFromIconfontCN } from '@ant-design/icons/lib'
// import { IconBaseProps } from '@ant-design/icons/lib/components/Icon'

export type IconFontType = string

// interface IconFontProps extends Omit<IconBaseProps, 'type'> {
//   type: IconFontType
// }

const IconFont = createFromIconfontCN({
  scriptUrl: '/iconfont/iconfont.js',
})

export default IconFont
