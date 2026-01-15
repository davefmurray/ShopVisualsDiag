'use client'

import { Canvas, Line, Triangle, Group, FabricObject, Circle, Rect, IText, PencilBrush, util, Point, FabricImage } from 'fabric'
import type { AnnotationColor, LineThickness } from '@/types'

// Arrow configuration
interface ArrowOptions {
  x1: number
  y1: number
  x2: number
  y2: number
  color: string
  strokeWidth: number
}

/**
 * Create an arrow object (line with triangle head)
 */
export function createArrow(options: ArrowOptions): Group {
  const { x1, y1, x2, y2, color, strokeWidth } = options

  // Calculate angle for arrow head
  const angle = Math.atan2(y2 - y1, x2 - x1)
  const headLength = strokeWidth * 4

  // Line
  const line = new Line([x1, y1, x2, y2], {
    stroke: color,
    strokeWidth: strokeWidth,
    strokeLineCap: 'round',
    selectable: false,
  })

  // Arrow head (triangle)
  const headX = x2 - headLength * Math.cos(angle - Math.PI / 6)
  const headY = y2 - headLength * Math.sin(angle - Math.PI / 6)
  const headX2 = x2 - headLength * Math.cos(angle + Math.PI / 6)
  const headY2 = y2 - headLength * Math.sin(angle + Math.PI / 6)

  const triangle = new Triangle({
    left: x2,
    top: y2,
    width: headLength,
    height: headLength,
    fill: color,
    angle: (angle * 180 / Math.PI) + 90,
    originX: 'center',
    originY: 'center',
    selectable: false,
  })

  // Group line and head together
  const group = new Group([line, triangle], {
    selectable: true,
    hasControls: true,
    hasBorders: true,
  })

  // Store metadata
  group.set('annotationType', 'arrow')
  group.set('annotationColor', color)

  return group
}

/**
 * Create a circle annotation
 */
export function createCircle(
  left: number,
  top: number,
  radius: number,
  color: string,
  strokeWidth: number
): Circle {
  const circle = new Circle({
    left,
    top,
    radius,
    fill: 'transparent',
    stroke: color,
    strokeWidth,
    originX: 'center',
    originY: 'center',
  })

  circle.set('annotationType', 'circle')
  circle.set('annotationColor', color)

  return circle
}

/**
 * Create a rectangle annotation
 */
export function createRectangle(
  left: number,
  top: number,
  width: number,
  height: number,
  color: string,
  strokeWidth: number
): Rect {
  const rect = new Rect({
    left,
    top,
    width,
    height,
    fill: 'transparent',
    stroke: color,
    strokeWidth,
  })

  rect.set('annotationType', 'rectangle')
  rect.set('annotationColor', color)

  return rect
}

/**
 * Create a text annotation
 */
export function createText(
  text: string,
  left: number,
  top: number,
  color: string,
  fontSize: number
): IText {
  const textObj = new IText(text, {
    left,
    top,
    fill: color,
    fontSize,
    fontFamily: 'Arial, sans-serif',
    fontWeight: 'bold',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 4,
  })

  textObj.set('annotationType', 'text')
  textObj.set('annotationColor', color)

  return textObj
}

/**
 * Setup freehand brush on canvas
 */
export function setupFreehandBrush(
  canvas: Canvas,
  color: string,
  strokeWidth: number
): void {
  canvas.freeDrawingBrush = new PencilBrush(canvas)
  canvas.freeDrawingBrush.color = color
  canvas.freeDrawingBrush.width = strokeWidth
}

/**
 * Export canvas to data URL
 */
export function exportCanvasToDataURL(
  canvas: Canvas,
  format: 'png' | 'jpeg' = 'jpeg',
  quality: number = 0.9
): string {
  return canvas.toDataURL({
    format,
    quality,
    multiplier: 1,
  })
}

/**
 * Export canvas to Blob
 */
export async function exportCanvasToBlob(
  canvas: Canvas,
  format: 'image/png' | 'image/jpeg' = 'image/jpeg',
  quality: number = 0.9
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const dataUrl = canvas.toDataURL({
      format: format === 'image/png' ? 'png' : 'jpeg',
      quality,
      multiplier: 1,
    })

    // Convert data URL to Blob
    fetch(dataUrl)
      .then(res => res.blob())
      .then(resolve)
      .catch(reject)
  })
}

/**
 * Load image into canvas as background
 * Note: In Fabric.js v6, setBackgroundImage is deprecated. Use canvas.backgroundImage directly.
 */
export async function loadImageToCanvas(
  canvas: Canvas,
  imageUrl: string
): Promise<void> {
  // Fabric.js v6 uses FabricImage.fromURL for loading
  const fabricImg = await FabricImage.fromURL(imageUrl, { crossOrigin: 'anonymous' })

  if (!fabricImg) {
    throw new Error('Failed to load image')
  }

  // Calculate scaling to fit canvas while maintaining aspect ratio
  const canvasWidth = canvas.width || 800
  const canvasHeight = canvas.height || 600

  const scale = Math.min(
    canvasWidth / (fabricImg.width || 1),
    canvasHeight / (fabricImg.height || 1)
  )

  fabricImg.scale(scale)
  fabricImg.set({
    left: (canvasWidth - (fabricImg.width || 0) * scale) / 2,
    top: (canvasHeight - (fabricImg.height || 0) * scale) / 2,
    selectable: false,
    evented: false,
  })

  // Set as background in v6
  canvas.backgroundImage = fabricImg
  canvas.renderAll()
}

/**
 * Serialize canvas annotations (excluding background)
 */
export function serializeAnnotations(canvas: Canvas): object[] {
  const objects = canvas.getObjects()
  return objects.map(obj => obj.toObject(['annotationType', 'annotationColor']))
}

/**
 * Load annotations from serialized data
 */
export async function loadAnnotations(
  canvas: Canvas,
  annotations: object[]
): Promise<void> {
  for (const annotation of annotations) {
    const objects = await util.enlivenObjects([annotation])
    objects.forEach(obj => canvas.add(obj as FabricObject))
  }
  canvas.renderAll()
}

// Drawing mode state
export interface DrawingState {
  isDrawing: boolean
  startX: number
  startY: number
  currentObject: FabricObject | null
}

/**
 * Create drawing handlers for a canvas
 */
export function createDrawingHandlers(
  canvas: Canvas,
  tool: string,
  color: string,
  strokeWidth: number,
  onObjectCreated?: (obj: FabricObject) => void
) {
  let state: DrawingState = {
    isDrawing: false,
    startX: 0,
    startY: 0,
    currentObject: null,
  }

  const handleMouseDown = (e: { pointer?: Point }) => {
    if (tool === 'select' || tool === 'text') return
    if (!e.pointer) return

    state.isDrawing = true
    state.startX = e.pointer.x
    state.startY = e.pointer.y
  }

  const handleMouseMove = (e: { pointer?: Point }) => {
    if (!state.isDrawing || tool === 'select' || tool === 'text') return
    if (!e.pointer) return

    const { x, y } = e.pointer

    // Remove current preview object
    if (state.currentObject) {
      canvas.remove(state.currentObject)
    }

    // Create preview based on tool
    switch (tool) {
      case 'arrow':
        state.currentObject = createArrow({
          x1: state.startX,
          y1: state.startY,
          x2: x,
          y2: y,
          color,
          strokeWidth,
        })
        break
      case 'circle': {
        const radius = Math.sqrt(
          Math.pow(x - state.startX, 2) + Math.pow(y - state.startY, 2)
        )
        state.currentObject = createCircle(
          state.startX,
          state.startY,
          radius,
          color,
          strokeWidth
        )
        break
      }
      case 'rectangle': {
        const width = x - state.startX
        const height = y - state.startY
        state.currentObject = createRectangle(
          state.startX,
          state.startY,
          Math.abs(width),
          Math.abs(height),
          color,
          strokeWidth
        )
        // Adjust position for negative dimensions
        if (width < 0) state.currentObject.set('left', x)
        if (height < 0) state.currentObject.set('top', y)
        break
      }
    }

    if (state.currentObject) {
      canvas.add(state.currentObject)
      canvas.renderAll()
    }
  }

  const handleMouseUp = () => {
    if (!state.isDrawing) return

    state.isDrawing = false

    if (state.currentObject && onObjectCreated) {
      onObjectCreated(state.currentObject)
    }

    state.currentObject = null
  }

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    getState: () => state,
    reset: () => {
      state = {
        isDrawing: false,
        startX: 0,
        startY: 0,
        currentObject: null,
      }
    },
  }
}
