import { useCallback, useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { useParams } from 'react-router-dom'

import type { DMMF } from '@/interfaces/dbml'
import requests from '@/lib/fetchers'
import { generateDBMLSchema } from '@/lib/prisma-dbml-generator/generator/dbml'

const ErDiagram = () => {
  const intl = useIntl()
  const frameRef = useRef<HTMLIFrameElement>(null)
  const { id } = useParams()
  const [dmmf, setDMMF] = useState<DMMF.Document>()
  const loadRef = useRef(false)

  const run = useCallback(() => {
    if (dmmf) {
      // prisma-client-go 结构内容有缺失
      dmmf.datamodel.models.forEach(model => {
        model.uniqueFields = model.fields.reduce<string[][]>((arr, field) => {
          if (field.isUnique) {
            arr.push([field.name])
          }
          return arr
        }, [])
      })

      const dbml = generateDBMLSchema(dmmf)
      console.log('dbml', dbml)

      if (loadRef.current) {
        ;(frameRef.current!.contentWindow as any)['setContent'](dbml)
      }
    }
  }, [dmmf])

  useEffect(() => {
    if (id) {
      requests.get(`/prisma/nativeDMF/${id}`).then(resp => {
        if (resp) {
          setDMMF(resp as any)
        }
      })
    }
  }, [id])

  useEffect(() => {
    run()
  }, [dmmf, run])

  useEffect(() => {
    frameRef.current!.contentWindow!.addEventListener('DOMContentLoaded', () => {
      loadRef.current = true
      run()
    })
  }, [run])

  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex mb-6 justify-start items-center">
        <span className="flex-grow font-medium text-lg">
          {intl.formatMessage({ defaultMessage: 'ER 图' })}
        </span>
      </div>
      <iframe ref={frameRef} src="/d" className="border-none flex-1 mt-4 w-full" />
    </div>
  )
}

export default ErDiagram
