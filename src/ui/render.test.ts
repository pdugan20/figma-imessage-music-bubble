import { describe, it, expect, vi } from 'vitest'
import { makeItem, addSection } from './render'
import { TrackEntry } from '../types'

const entry: TrackEntry = {
  trackName: 'Song',
  artistName: 'Artist',
  artworkUrl: 'https://x/200x200bb.jpg',
  dominantColor: { r: 1, g: 0, b: 0 },
}

describe('render', () => {
  it('makeItem builds a row with track + artist and fires onClick', () => {
    const onClick = vi.fn()
    const el = makeItem(entry, onClick)
    expect(el.querySelector('.track-name')!.textContent).toBe('Song')
    expect(el.querySelector('.artist-name')!.textContent).toBe('Artist')
    el.dispatchEvent(new MouseEvent('click'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('addSection renders a header and returns the list container', () => {
    const area = document.createElement('div')
    const onClear = vi.fn()
    const list = addSection(area, 'Recently used', onClear)
    expect(area.querySelector('.section-header span')!.textContent).toBe('Recently used')
    area.querySelector<HTMLButtonElement>('.section-clear')!.click()
    expect(onClear).toHaveBeenCalledOnce()
    expect(list.classList.contains('results-list')).toBe(true)
  })
})
