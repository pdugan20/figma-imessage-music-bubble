import { RGB, TrackEntry } from '../types'
import { searchTracks } from './itunes'
import { extractDominantColor } from './dominant-color'

export const FEATURED_SEARCHES = [
  'Taylor Swift Shake It Off',
  'Olivia Rodrigo good 4 u',
  'Weezer Island in the Sun',
  'Nirvana Come As You Are',
  'Beastie Boys Intergalactic',
  'Radiohead Let Down',
]

export async function loadFeatured(): Promise<TrackEntry[]> {
  const settled = await Promise.allSettled(
    FEATURED_SEARCHES.map(async (term) => {
      const results = await searchTracks(term, 1)
      if (!results[0]) throw new Error('no result')
      return results[0]
    })
  )
  const tracks = settled
    .filter((r): r is PromiseFulfilledResult<TrackEntry> => r.status === 'fulfilled')
    .map((r) => r.value)

  const colors = await Promise.allSettled(
    tracks.map((t) => (t.artworkUrl ? extractDominantColor(t.artworkUrl) : Promise.resolve(null)))
  )

  return tracks.map((t, i) => {
    const c = colors[i]
    const dominantColor: RGB | null = c.status === 'fulfilled' ? c.value : null
    return { ...t, dominantColor }
  })
}
