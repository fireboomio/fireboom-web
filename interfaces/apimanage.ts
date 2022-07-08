export type operationResp = DirOrFile[]

export interface DirOrFile {
  title: string
  children?: DirOrFile[]
}
