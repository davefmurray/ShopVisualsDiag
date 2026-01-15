'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Canvas, FabricImage, PencilBrush, FabricObject, IText, Point } from 'fabric'
import type { AnnotationTool, AnnotationColor, LineThickness, AnnotationData } from '@/types'
import { useAnnotationHistory } from '@/hooks/useAnnotationHistory'
import {
  createArrow,
  createCircle,
  createRectangle,
  createText,
  exportCanvasToBlob,
} from '@/utils/fabricHelpers'
import ToolPalette from './ToolPalette'
import ColorPicker from './ColorPicker'

interface AnnotatorProps {
  imageUrl: string
  initialAnnotations?: AnnotationData
  onSave: (blob: Blob, annotations: AnnotationData) => void
  onCancel: () => void
}

export default function Annotator({
  imageUrl,
  initialAnnotations,
  onSave,
  onCancel,
}: AnnotatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricRef = useRef<Canvas | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [tool, setTool] = useState<AnnotationTool>('arrow')
  const [color, setColor] = useState<AnnotationColor>('#EF4444')
  const [thickness, setThickness] = useState<LineThickness>(4)
  const [isReady, setIsReady] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Drawing state
  const drawingRef = useRef({
    isDrawing: false,
    startX: 0,
    startY: 0,
    currentObject: null as FabricObject | null,
  })

  const {
    setCanvas,
    saveState,
    undo,
    redo,
    clearHistory,
    canUndo,
    canRedo,
  } = useAnnotationHistory()

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return

    const container = containerRef.current
    const canvas = new Canvas(canvasRef.current, {
      width: container.clientWidth,
      height: container.clientHeight,
      backgroundColor: '#000',
      selection: true,
    })

    fabricRef.current = canvas
    setCanvas(canvas)

    // Load background image
    FabricImage.fromURL(imageUrl, { crossOrigin: 'anonymous' }).then((img) => {
      if (!img || !canvas) return

      const canvasWidth = canvas.width || 800
      const canvasHeight = canvas.height || 600

      // Scale image to fit canvas
      const scale = Math.min(
        canvasWidth / (img.width || 1),
        canvasHeight / (img.height || 1)
      )

      img.scale(scale)
      img.set({
        left: (canvasWidth - (img.width || 0) * scale) / 2,
        top: (canvasHeight - (img.height || 0) * scale) / 2,
        selectable: false,
        evented: false,
      })

      canvas.backgroundImage = img
      canvas.renderAll()
      setIsReady(true)

      // Load initial annotations if provided
      if (initialAnnotations?.objects) {
        canvas.loadFromJSON({
          objects: initialAnnotations.objects,
          backgroundImage: canvas.backgroundImage,
        }).then(() => {
          canvas.renderAll()
        })
      }
    })

    // Handle window resize
    const handleResize = () => {
      if (!canvas || !container) return
      canvas.setDimensions({
        width: container.clientWidth,
        height: container.clientHeight,
      })
      canvas.renderAll()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      canvas.dispose()
      fabricRef.current = null
    }
  }, [imageUrl, setCanvas, initialAnnotations])

  // Setup drawing handlers
  useEffect(() => {
    const canvas = fabricRef.current
    if (!canvas) return

    // Configure selection mode
    canvas.selection = tool === 'select'
    canvas.isDrawingMode = tool === 'freehand'

    // Setup freehand brush
    if (tool === 'freehand') {
      canvas.freeDrawingBrush = new PencilBrush(canvas)
      canvas.freeDrawingBrush.color = color
      canvas.freeDrawingBrush.width = thickness
    }

    // Make objects selectable only in select mode
    canvas.getObjects().forEach((obj) => {
      obj.selectable = tool === 'select'
      obj.evented = tool === 'select'
    })

    canvas.renderAll()
  }, [tool, color, thickness])

  // Mouse/touch handlers for drawing
  useEffect(() => {
    const canvas = fabricRef.current
    if (!canvas) return

    const handleMouseDown = (e: { pointer?: Point }) => {
      if (tool === 'select' || tool === 'freehand') return
      if (!e.pointer) return

      // For text tool, create text at click position
      if (tool === 'text') {
        const text = createText('Text', e.pointer.x, e.pointer.y, color, thickness * 8)
        canvas.add(text)
        canvas.setActiveObject(text)
        text.enterEditing()
        text.selectAll()
        saveState()
        canvas.renderAll()
        return
      }

      drawingRef.current.isDrawing = true
      drawingRef.current.startX = e.pointer.x
      drawingRef.current.startY = e.pointer.y
    }

    const handleMouseMove = (e: { pointer?: Point }) => {
      if (!drawingRef.current.isDrawing || tool === 'select' || tool === 'freehand' || tool === 'text') return
      if (!e.pointer) return

      const { x, y } = e.pointer
      const { startX, startY } = drawingRef.current

      // Remove current preview object
      if (drawingRef.current.currentObject) {
        canvas.remove(drawingRef.current.currentObject)
      }

      // Create preview based on tool
      let newObject: FabricObject | null = null

      switch (tool) {
        case 'arrow':
          newObject = createArrow({
            x1: startX,
            y1: startY,
            x2: x,
            y2: y,
            color,
            strokeWidth: thickness,
          })
          break
        case 'circle': {
          const radius = Math.sqrt(Math.pow(x - startX, 2) + Math.pow(y - startY, 2))
          if (radius > 5) {
            newObject = createCircle(startX, startY, radius, color, thickness)
          }
          break
        }
        case 'rectangle': {
          const width = Math.abs(x - startX)
          const height = Math.abs(y - startY)
          if (width > 5 && height > 5) {
            newObject = createRectangle(
              Math.min(startX, x),
              Math.min(startY, y),
              width,
              height,
              color,
              thickness
            )
          }
          break
        }
      }

      if (newObject) {
        newObject.selectable = false
        newObject.evented = false
        canvas.add(newObject)
        drawingRef.current.currentObject = newObject
        canvas.renderAll()
      }
    }

    const handleMouseUp = () => {
      if (!drawingRef.current.isDrawing) return

      drawingRef.current.isDrawing = false

      // Make the final object selectable
      if (drawingRef.current.currentObject) {
        drawingRef.current.currentObject.selectable = true
        drawingRef.current.currentObject.evented = true
        saveState()
      }

      drawingRef.current.currentObject = null
    }

    // Path created (freehand)
    const handlePathCreated = () => {
      saveState()
    }

    // Object modified
    const handleObjectModified = () => {
      saveState()
    }

    canvas.on('mouse:down', handleMouseDown)
    canvas.on('mouse:move', handleMouseMove)
    canvas.on('mouse:up', handleMouseUp)
    canvas.on('path:created', handlePathCreated)
    canvas.on('object:modified', handleObjectModified)

    return () => {
      canvas.off('mouse:down', handleMouseDown)
      canvas.off('mouse:move', handleMouseMove)
      canvas.off('mouse:up', handleMouseUp)
      canvas.off('path:created', handlePathCreated)
      canvas.off('object:modified', handleObjectModified)
    }
  }, [tool, color, thickness, saveState])

  // Delete selected objects
  const handleDelete = useCallback(() => {
    const canvas = fabricRef.current
    if (!canvas) return

    const activeObjects = canvas.getActiveObjects()
    if (activeObjects.length > 0) {
      activeObjects.forEach((obj) => canvas.remove(obj))
      canvas.discardActiveObject()
      canvas.renderAll()
      saveState()
    }
  }, [saveState])

  // Clear all annotations
  const handleClearAll = useCallback(() => {
    const canvas = fabricRef.current
    if (!canvas) return

    const objects = canvas.getObjects()
    objects.forEach((obj) => canvas.remove(obj))
    canvas.renderAll()
    saveState()
  }, [saveState])

  // Save annotated image
  const handleSave = useCallback(async () => {
    const canvas = fabricRef.current
    if (!canvas) return

    setIsSaving(true)

    try {
      // Deselect all before export
      canvas.discardActiveObject()
      canvas.renderAll()

      // Export to blob
      const blob = await exportCanvasToBlob(canvas)

      // Get annotation data
      const annotations: AnnotationData = {
        objects: canvas.getObjects().map((obj) => obj.toObject(['annotationType', 'annotationColor'])),
        version: '1.0',
        canvasWidth: canvas.width || 800,
        canvasHeight: canvas.height || 600,
      }

      onSave(blob, annotations)
    } catch (err) {
      console.error('Failed to save annotation:', err)
    } finally {
      setIsSaving(false)
    }
  }, [onSave])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Delete key
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const canvas = fabricRef.current
        if (canvas && !(canvas.getActiveObject() instanceof IText && (canvas.getActiveObject() as IText).isEditing)) {
          e.preventDefault()
          handleDelete()
        }
      }

      // Undo: Ctrl+Z or Cmd+Z
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      }

      // Redo: Ctrl+Shift+Z or Cmd+Shift+Z or Ctrl+Y
      if (((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') || ((e.ctrlKey || e.metaKey) && e.key === 'y')) {
        e.preventDefault()
        redo()
      }

      // Escape to deselect
      if (e.key === 'Escape') {
        fabricRef.current?.discardActiveObject()
        fabricRef.current?.renderAll()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleDelete, undo, redo])

  return (
    <div className="fixed inset-0 bg-zinc-900 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-zinc-800 border-b border-zinc-700 safe-area-top">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-zinc-300 hover:text-white transition-colors"
        >
          Cancel
        </button>
        <span className="text-white font-medium">Annotate Photo</span>
        <button
          onClick={handleSave}
          disabled={isSaving || !isReady}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-zinc-800 border-b border-zinc-700">
        <ToolPalette
          currentTool={tool}
          onToolChange={setTool}
          currentThickness={thickness}
          onThicknessChange={setThickness}
        />

        <ColorPicker currentColor={color} onColorChange={setColor} />

        <div className="flex gap-2">
          {/* Undo */}
          <button
            onClick={undo}
            disabled={!canUndo}
            className="p-2 rounded-lg bg-zinc-700 text-zinc-300 hover:bg-zinc-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
          </button>

          {/* Redo */}
          <button
            onClick={redo}
            disabled={!canRedo}
            className="p-2 rounded-lg bg-zinc-700 text-zinc-300 hover:bg-zinc-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Redo (Ctrl+Shift+Z)"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
            </svg>
          </button>

          {/* Delete */}
          <button
            onClick={handleDelete}
            className="p-2 rounded-lg bg-zinc-700 text-zinc-300 hover:bg-zinc-600 transition-colors"
            title="Delete selected"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>

          {/* Clear All */}
          <button
            onClick={handleClearAll}
            className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
            title="Clear all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Canvas Container */}
      <div ref={containerRef} className="flex-1 relative overflow-hidden">
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        <canvas ref={canvasRef} className="touch-none" />
      </div>

      {/* Tool hints */}
      <div className="p-2 bg-zinc-800 text-center text-xs text-zinc-400 safe-area-bottom">
        {tool === 'select' && 'Tap to select • Drag to move • Pinch to resize'}
        {tool === 'arrow' && 'Drag to draw an arrow'}
        {tool === 'circle' && 'Drag from center outward to draw a circle'}
        {tool === 'rectangle' && 'Drag to draw a rectangle'}
        {tool === 'text' && 'Tap to add text • Double-tap to edit'}
        {tool === 'freehand' && 'Draw freely with your finger or mouse'}
      </div>
    </div>
  )
}
