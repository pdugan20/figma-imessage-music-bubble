import { TrackEntry } from '../types'
import { toHex } from '../shared/color'

function escHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function makeItem(entry: TrackEntry, onClick: () => void): HTMLElement {
  const item = document.createElement('div')
  item.className = 'result-item'
  item.innerHTML = `
    <div class="artwork-wrap">
      <img class="artwork" src="${escHtml(entry.artworkUrl)}" alt="" />
      <div class="color-dot" style="background:${toHex(entry.dominantColor)}"></div>
    </div>
    <div class="track-info">
      <div class="track-name">${escHtml(entry.trackName)}</div>
      <div class="artist-name">${escHtml(entry.artistName)}</div>
    </div>`
  item.addEventListener('click', onClick)
  return item
}

export function addSection(area: HTMLElement, label: string, onClear?: () => void): HTMLElement {
  const header = document.createElement('div')
  header.className = 'section-header'
  const title = document.createElement('span')
  title.textContent = label
  header.appendChild(title)
  if (onClear) {
    const btn = document.createElement('button')
    btn.className = 'section-clear'
    btn.textContent = 'Clear'
    btn.addEventListener('click', onClear)
    header.appendChild(btn)
  }
  area.appendChild(header)
  const list = document.createElement('div')
  list.className = 'results-list'
  area.appendChild(list)
  return list
}
