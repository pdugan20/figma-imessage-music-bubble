import { RGB } from '../types'

type FillableNode = SceneNode & { fills: readonly Paint[] | typeof figma.mixed }

export function replaceSolidFill(node: FillableNode, color: RGB, opacity = 1): void {
  const current = node.fills
  if (current === figma.mixed || !Array.isArray(current)) return
  const fills = (current as Paint[]).slice()
  const idx = fills.findIndex((f) => f.type === 'SOLID')
  if (idx < 0) return
  fills[idx] = { type: 'SOLID', color, opacity }
  node.fills = fills
}
