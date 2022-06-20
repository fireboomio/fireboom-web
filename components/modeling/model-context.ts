import { createContext } from 'react'

import { Entity } from '@/interfaces/model'

export const EntitiesContext = createContext([] as Entity[])
