export type Maybe<T> = T | null | undefined

export type ReactComponentLike =
  | string
  | ((props: any, context?: any) => any)
  | (new (props: any, context?: any) => any)

export type ReactElementLike = {
  type: ReactComponentLike
  props: any
  key: string | number | null
}

export type ReactNodeLike =
  // eslint-disable-next-line @typescript-eslint/ban-types
  {} | ReactElementLike | Array<ReactNodeLike> | string | number | boolean | null | undefined
