import { useEffect, useRef } from 'react'

interface RichTextInputProps {
  value?: string
  disabled?: boolean
  language?: string
  onChange?: (v: string) => void
  className?: string
}
if (!document.querySelector('#ck-editor')) {
  const s = document.createElement('script')
  s.id = 'ck-editor'
  s.src = `${import.meta.env.BASE_URL}ckeditor/ckeditor.js`
  const s1 = document.createElement('script')
  s1.src = `${import.meta.env.BASE_URL}ckeditor/translations/zh-cn.js`
  document.head.appendChild(s)
  document.head.appendChild(s1)
}

const RichTextInput = ({ value, disabled, language, onChange, className }: RichTextInputProps) => {
  const divRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<any>()
  useEffect(() => {
    // @ts-ignore
    window.ClassicEditor.create(divRef.current, {
      language
    })
      // @ts-ignore
      .then(editor => {
        editorRef.current = editor
        if (value) {
          editor.data.set(value)
        }
        if (disabled) {
          editor.enableReadOnlyMode('editor')
        }
        if (onChange) {
          editor.model.document.on('change:data', () => {
            onChange(editor.data.get())
          })
        }
      })
      .catch(console.error)

    return () => {
      editorRef.current?.destroy()
      editorRef.current = null
    }
  }, [])
  return <div className={className} ref={divRef}></div>
}

export default RichTextInput
