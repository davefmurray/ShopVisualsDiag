'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface UseAutoSaveOptions {
  key: string
  debounceMs?: number
}

export function useAutoSave<T>(
  initialValue: T,
  options: UseAutoSaveOptions
): [T, (value: T) => void, () => void] {
  const { key, debounceMs = 500 } = options
  const [value, setValue] = useState<T>(initialValue)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isInitializedRef = useRef(false)

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const stored = localStorage.getItem(key)
      if (stored) {
        const parsed = JSON.parse(stored) as T
        setValue(parsed)
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error)
    }

    isInitializedRef.current = true
  }, [key])

  // Debounced save to localStorage
  useEffect(() => {
    if (!isInitializedRef.current) return
    if (typeof window === 'undefined') return

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(value))
      } catch (error) {
        console.error('Failed to save to localStorage:', error)
      }
    }, debounceMs)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [value, key, debounceMs])

  // Clear saved data
  const clearSaved = useCallback(() => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Failed to clear localStorage:', error)
    }
  }, [key])

  return [value, setValue, clearSaved]
}
