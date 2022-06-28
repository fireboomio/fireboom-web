import type { Block, BlockAction } from '@/interfaces'

export default function modelingReducer(blocks: Block[], action: BlockAction) {
  switch (action.type) {
    case 'fetched': {
      return action.data
    }
    case 'selected': {
      return blocks
    }
    case 'added': {
      return [...blocks, action.data]
    }
    case 'changed':
      return blocks.map((b) => {
        if (b.id === action.data.id) {
          return action.data
        } else {
          return b
        }
      })
    case 'deleted': {
      return blocks.filter((b) => b.id !== action.data.id)
    }
    default: {
      throw Error('Unknown action')
    }
  }
}
