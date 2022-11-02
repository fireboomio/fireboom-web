/* eslint-disable no-inner-declarations */
import { useCallback, useEffect, useRef, useState } from 'react'

export type DragResizeArgs = {
  direction: 'horizontal' | 'vertical'
  defaultHidden?: boolean
  minSize?: number
  maxSize?: number
}

export function useDragResize({
  defaultHidden = false,
  direction,
  minSize = 2,
  maxSize
}: DragResizeArgs) {
  const [isHidden, setIsHidden] = useState(defaultHidden)
  const dragRef = useRef<HTMLElement>(null)
  const elRef = useRef<HTMLElement>(null)
  const parentRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const $el = elRef.current
    const $drag = dragRef.current
    const $parent = parentRef.current

    if ($drag && $el) {
      // 当水平方向时，拖动的元素在el左侧，则 坐标点 变小时需要增加宽度
      // 当水平方向时，拖动的元素在el右侧，则 坐标点 变大时需要增加宽度
      // 当垂直方向时，拖动的元素在el上方，则 坐标点 变小时需要增加高度
      // 当垂直方向时，拖动的元素在el下方，则 坐标点 变大时需要增加高度
      let increateDirection = 1
      const dragRect = $drag.getBoundingClientRect()
      const elRect = $el.getBoundingClientRect()
      if (direction === 'horizontal') {
        if (Math.abs(dragRect.left - elRect.left) > Math.abs(elRect.right - dragRect.right)) {
          increateDirection = 1
        } else {
          increateDirection = -1
        }
      } else {
        if (Math.abs(dragRect.top - elRect.top) > Math.abs(elRect.bottom - dragRect.bottom)) {
          increateDirection = 1
        } else {
          increateDirection = -1
        }
      }

      $drag.style.cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize'
      let initialSize: number
      let startP: number

      function onMouseDown(e: MouseEvent) {
        initialSize = direction === 'horizontal' ? $el!.clientWidth : $el!.clientHeight
        startP = direction === 'horizontal' ? e.clientX : e.clientY
        document.addEventListener('mousemove', onMouseMove, false)
        document.addEventListener('mouseup', onMouseLeave, false)
      }
      function onMouseMove(e: MouseEvent) {
        let size = Math.max(
          minSize,
          direction === 'horizontal' ? $drag!.clientWidth : $drag!.clientHeight,
          initialSize +
            increateDirection * ((direction === 'horizontal' ? e.clientX : e.clientY) - startP)
        )
        if (maxSize) {
          size = Math.min(maxSize, size)
        }
        if ($parent) {
          size = Math.min(
            size,
            direction === 'horizontal' ? $parent.clientWidth : $parent.clientHeight
          )
        }
        setIsHidden(
          size === (direction === 'horizontal' ? $drag!.clientWidth : $drag!.clientHeight)
        )
        $el!.style[direction === 'horizontal' ? 'width' : 'height'] = `${size}px`
      }
      function onMouseLeave(e: MouseEvent) {
        document.removeEventListener('mousemove', onMouseMove, false)
        document.removeEventListener('mouseup', onMouseLeave, false)
      }
      $drag.addEventListener('mousedown', onMouseDown, false)
      return () => {
        document.removeEventListener('mousemove', onMouseMove, false)
        document.removeEventListener('mouseup', onMouseLeave, false)
      }
    }
  }, [direction, maxSize, minSize])

  const resetSize = useCallback(
    (size: number) => {
      if (elRef.current) {
        elRef.current.style[direction === 'horizontal' ? 'width' : 'height'] = `${size}px`
      }
    },
    [direction]
  )

  return {
    dragRef,
    elRef,
    parentRef,
    resetSize,
    isHidden
  }
}
