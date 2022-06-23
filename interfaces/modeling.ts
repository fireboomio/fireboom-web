export interface SchemaResp {
  id: number
  name: string
}

export interface Entity {
  id: number
  name: string
  [key: string]: string | number | boolean
}

export interface Field {
  property: string
  value: string
  note: string
  [key: string]: number | string | boolean
}
