import { SelectionStatus } from '../types'
import { LAYER } from './bubble-schema'

export function getSelectionStatus(selection: readonly SceneNode[]): SelectionStatus {
  if (selection.length === 0) return { ok: false, message: 'Select a Music Bubble layer' }
  if (selection.length > 1) return { ok: false, message: 'Select a single Music Bubble layer' }
  const node = selection[0]
  if (node.type !== 'INSTANCE') return { ok: false, message: 'Select a Music Bubble instance' }
  const songName = node.findOne((n) => n.name === LAYER.SONG_NAME)
  if (!songName) return { ok: false, message: 'Select a Music Bubble instance' }
  return { ok: true, message: '1 layer selected' }
}
