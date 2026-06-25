import { describe, it, expect, beforeEach, vi } from 'vitest'
import { fillBubble } from './fill'
import { PopulateMessage } from '../types'

function textNode(name: string) {
  return {
    name,
    type: 'TEXT',
    characters: '',
    fontName: { family: 'Inter', style: 'Regular' },
    fills: [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 1 }],
  }
}

function buildInstance() {
  const song = textNode('Song Name')
  const artist = textNode('Artist Name')
  const albumArt = { name: 'Album Art', type: 'RECTANGLE', fills: [] as unknown[] }
  const nodes: Record<string, unknown> = { song, artist, albumArt }
  return {
    nodes,
    instance: {
      setRelaunchData: vi.fn(),
      findOne: (p: (n: { name: string; type: string }) => boolean) =>
        [song, artist, albumArt].find((n) => p(n)) ?? null,
      findAll: () => [],
    },
  }
}

beforeEach(() => {
  ;(globalThis as { figma?: unknown }).figma = {
    mixed: Symbol('mixed'),
    loadFontAsync: vi.fn().mockResolvedValue(undefined),
    createImage: vi.fn(() => ({ hash: 'abc' })),
    notify: vi.fn(),
  }
})

const data: PopulateMessage = {
  type: 'populate',
  trackName: 'Shake It Off',
  artistName: 'Taylor Swift',
  artworkBytes: [1, 2, 3],
  dominantColor: { r: 0.1, g: 0.1, b: 0.1 },
}

describe('fillBubble', () => {
  it('sets text characters and returns true', async () => {
    const { nodes, instance } = buildInstance()
    const ok = await fillBubble(instance as never, data)
    expect(ok).toBe(true)
    expect((nodes.song as { characters: string }).characters).toBe('Shake It Off')
    expect((nodes.artist as { characters: string }).characters).toBe('Taylor Swift')
  })

  it('applies an image fill from artwork bytes', async () => {
    const { nodes, instance } = buildInstance()
    await fillBubble(instance as never, data)
    const fills = (nodes.albumArt as { fills: { type: string }[] }).fills
    expect(fills.some((f) => f.type === 'IMAGE')).toBe(true)
  })

  it('returns false when required layers are missing', async () => {
    const instance = { findOne: () => null, findAll: () => [], setRelaunchData: vi.fn() }
    expect(await fillBubble(instance as never, data)).toBe(false)
  })
})
