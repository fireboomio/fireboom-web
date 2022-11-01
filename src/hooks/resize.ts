/* eslint-disable no-inner-declarations */
import { useEffect, useRef } from 'react'

export type DragResizeArgs = {
  direction: 'horizontal' | 'vertical'
  minSize?: number
  maxSize?: number
}

export function useDragResize({ direction, minSize = 2, maxSize }: DragResizeArgs) {
  const dragRef = useRef<HTMLElement>()

  useEffect(() => {
    const el = dragRef.current
    console.log(el)
    if (el) {
      if (direction === 'horizontal') {
        el.style.cursor = 'col-resize'
        const initialWidth = el.clientWidth
        let startX: number

        function onMouseDown(e: MouseEvent) {
          startX = e.clientX
        }
        function onMouseMove(e: MouseEvent) {
          let size = Math.max(minSize, initialWidth + e.clientX - startX)
          if (maxSize) {
            size = Math.min(maxSize, size)
          }
          el!.style.width = `${size}px`
        }
        el.addEventListener('mousedown', onMouseDown)
        el.addEventListener('mousemove', onMouseMove)
        el.removeEventListener('mousedown', onMouseDown)
        el.removeEventListener('mousemove', onMouseMove)
      } else {
        el.style.cursor = 'row-resize'
        const initialHeight = el.clientHeight
        let startY: number

        function onMouseDown(e: MouseEvent) {
          console.log('onMouseDown')
          startY = e.clientY
        }
        function onMouseMove(e: MouseEvent) {
          let size = Math.max(minSize, initialHeight + e.clientY - startY)
          if (maxSize) {
            size = Math.min(maxSize, size)
          }
          console.log('onMouseMove', size)
          el!.style.width = `${size}px`
        }
        el.addEventListener('mousedown', onMouseDown)
        el.addEventListener('mousemove', onMouseMove)
        el.removeEventListener('mousedown', onMouseDown)
        el.removeEventListener('mousemove', onMouseMove)
      }
    }
  }, [direction, maxSize, minSize])

  return {
    dragRef
  }
}
