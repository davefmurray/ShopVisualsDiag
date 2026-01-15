'use client'

import { useState, useCallback, useRef } from 'react'
import type { Canvas } from 'fabric'

interface HistoryState {
  json: string
}

export function useAnnotationHistory(maxHistory: number = 50) {
  const [undoStack, setUndoStack] = useState<HistoryState[]>([])
  const [redoStack, setRedoStack] = useState<HistoryState[]>([])
  const canvasRef = useRef<Canvas | null>(null)
  const isRestoringRef = useRef(false)

  const setCanvas = useCallback((canvas: Canvas | null) => {
    canvasRef.current = canvas
  }, [])

  const saveState = useCallback(() => {
    if (!canvasRef.current || isRestoringRef.current) return

    // Fabric.js v6 toJSON doesn't take arguments directly, use toObject instead
    const canvasData = canvasRef.current.toObject(['annotationType', 'annotationColor'])
    const json = JSON.stringify(canvasData)

    setUndoStack(prev => {
      const newStack = [...prev, { json }]
      // Limit stack size
      if (newStack.length > maxHistory) {
        return newStack.slice(-maxHistory)
      }
      return newStack
    })

    // Clear redo stack when new action is performed
    setRedoStack([])
  }, [maxHistory])

  const undo = useCallback(async () => {
    if (!canvasRef.current || undoStack.length === 0) return false

    isRestoringRef.current = true

    // Save current state to redo stack
    const currentJson = JSON.stringify(canvasRef.current.toObject(['annotationType', 'annotationColor']))
    setRedoStack(prev => [...prev, { json: currentJson }])

    // Get previous state
    const prevState = undoStack[undoStack.length - 1]
    setUndoStack(prev => prev.slice(0, -1))

    // Restore canvas
    try {
      await canvasRef.current.loadFromJSON(JSON.parse(prevState.json))
      canvasRef.current.renderAll()
    } catch (err) {
      console.error('Failed to restore canvas state:', err)
    }

    isRestoringRef.current = false
    return true
  }, [undoStack])

  const redo = useCallback(async () => {
    if (!canvasRef.current || redoStack.length === 0) return false

    isRestoringRef.current = true

    // Save current state to undo stack
    const currentJson = JSON.stringify(canvasRef.current.toObject(['annotationType', 'annotationColor']))
    setUndoStack(prev => [...prev, { json: currentJson }])

    // Get next state
    const nextState = redoStack[redoStack.length - 1]
    setRedoStack(prev => prev.slice(0, -1))

    // Restore canvas
    try {
      await canvasRef.current.loadFromJSON(JSON.parse(nextState.json))
      canvasRef.current.renderAll()
    } catch (err) {
      console.error('Failed to restore canvas state:', err)
    }

    isRestoringRef.current = false
    return true
  }, [redoStack])

  const clearHistory = useCallback(() => {
    setUndoStack([])
    setRedoStack([])
  }, [])

  return {
    setCanvas,
    saveState,
    undo,
    redo,
    clearHistory,
    canUndo: undoStack.length > 0,
    canRedo: redoStack.length > 0,
    undoCount: undoStack.length,
    redoCount: redoStack.length,
  }
}
