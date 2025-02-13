import { useContext } from 'react'

import { PrismaSchemaContext } from '@/lib/context/PrismaSchemaContext'
import type { Datasource, Assignment } from '@mrleebo/prisma-ast'
import {DataSourceKind} from "@/interfaces/datasource";

const useDBSource = () => {
  const {
    state: { blocks, currentDBSource }
  } = useContext(PrismaSchemaContext)
  let realKind = currentDBSource.kind
  if (realKind == DataSourceKind.Prisma) {
    const provider = blocks
        .filter(x => x.type === "datasource")
        .map(x => x as Datasource)
        .flatMap(x =>
            x.assignments
                .filter(y => y.type === "assignment" && y.key === "provider")
                .map(y => y as Assignment)
                .map(y => y.value as string)
                .map(y => y.toLowerCase().replace(/^"|"$/g, ''))
        ).pop()
    if (provider) {
      for (const key in DataSourceKind) {
        if (key.toLowerCase() === provider) {
          realKind = DataSourceKind[key as keyof typeof DataSourceKind]
        }
      }
    }
  }
  return {...currentDBSource, realKind}
}

export default useDBSource
