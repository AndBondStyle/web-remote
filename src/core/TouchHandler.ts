export type Point = { x: number; y: number } // TODO: Common types.ts
export type CommonCallback = (point: Point) => unknown

export class TouchHandler {
  el?: HTMLElement
  pid?: number
  callback?: CommonCallback

  constructor() {
    this._pointerDown = this._pointerDown.bind(this)
    this._pointerMove = this._pointerMove.bind(this)
    this._pointerUp = this._pointerUp.bind(this)
  }

  init(el: HTMLElement, callback: CommonCallback) {
    this.el = el
    this.callback = callback

    this.el.addEventListener("pointerdown", this._pointerDown)
    console.log("handler init")
  }

  destroy() {
    this.el?.removeEventListener("pointerdown", this._pointerDown)
    window.removeEventListener("pointermove", this._pointerMove)
    window.removeEventListener("pointerup", this._pointerUp)
    window.removeEventListener("pointercancel", this._pointerUp)
    console.log("handler destroy")
  }

  _convert(e: PointerEvent): Point {
    const rect = this.el!.getBoundingClientRect()
    const margin = 25 // TODO: Pass extra element for bounds
    let x = e.clientX
    let y = e.clientY
    x = Math.min(Math.max(x, rect.x + margin), rect.x + rect.width - margin)
    y = Math.min(Math.max(y, rect.y + margin), rect.y + rect.height - margin)
    x = ((x - rect.x - margin) / (rect.width - margin * 2)) * 2 - 1
    y = ((y - rect.y - margin) / (rect.height - margin * 2)) * 2 - 1
    return { x, y }
  }

  _pointerDown(e: PointerEvent) {
    console.log("pointerdown", e)
    if (this.pid !== undefined) return
    this.pid = e.pointerId
    window.addEventListener("pointermove", this._pointerMove)
    window.addEventListener("pointerup", this._pointerUp)
    window.addEventListener("pointercancel", this._pointerUp)
    this.callback?.(this._convert(e))
  }

  _pointerMove(e: PointerEvent) {
    console.log("pointermove", e)
    if (e.pointerId != this.pid) return
    this.callback?.(this._convert(e))
  }

  _pointerUp(e: PointerEvent) {
    console.log("pointerup", e)
    if (e.pointerId != this.pid) return
    window.removeEventListener("pointermove", this._pointerMove)
    window.removeEventListener("pointerup", this._pointerUp)
    window.removeEventListener("pointercancel", this._pointerUp)
    this.pid = undefined
    this.callback?.({ x: 0, y: 0 })
  }
}
