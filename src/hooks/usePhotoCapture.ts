'use client'

import { useState, useCallback } from 'react'
import type { AnnotationData } from '@/types'

export interface CapturedPhoto {
  id: string
  blob: Blob
  previewUrl: string
  timestamp: Date
  filename?: string
  annotations?: AnnotationData
  annotatedBlob?: Blob
  annotatedPreviewUrl?: string
}

export function usePhotoCapture() {
  const [photos, setPhotos] = useState<CapturedPhoto[]>([])

  const addPhoto = useCallback((blob: Blob, filename?: string) => {
    const id = `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const previewUrl = URL.createObjectURL(blob)

    const newPhoto: CapturedPhoto = {
      id,
      blob,
      previewUrl,
      timestamp: new Date(),
      filename,
    }

    setPhotos((prev) => [...prev, newPhoto])
    return newPhoto
  }, [])

  const addPhotos = useCallback((blobs: { blob: Blob; filename?: string }[]) => {
    const newPhotos = blobs.map(({ blob, filename }) => {
      const id = `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const previewUrl = URL.createObjectURL(blob)

      return {
        id,
        blob,
        previewUrl,
        timestamp: new Date(),
        filename,
      }
    })

    setPhotos((prev) => [...prev, ...newPhotos])
    return newPhotos
  }, [])

  const removePhoto = useCallback((id: string) => {
    setPhotos((prev) => {
      const photo = prev.find((p) => p.id === id)
      if (photo) {
        URL.revokeObjectURL(photo.previewUrl)
      }
      return prev.filter((p) => p.id !== id)
    })
  }, [])

  const reorderPhotos = useCallback((startIndex: number, endIndex: number) => {
    setPhotos((prev) => {
      const result = Array.from(prev)
      const [removed] = result.splice(startIndex, 1)
      result.splice(endIndex, 0, removed)
      return result
    })
  }, [])

  const clearPhotos = useCallback(() => {
    setPhotos((prev) => {
      prev.forEach((photo) => URL.revokeObjectURL(photo.previewUrl))
      return []
    })
  }, [])

  const movePhoto = useCallback((id: string, direction: 'up' | 'down') => {
    setPhotos((prev) => {
      const index = prev.findIndex((p) => p.id === id)
      if (index === -1) return prev

      const newIndex = direction === 'up' ? index - 1 : index + 1
      if (newIndex < 0 || newIndex >= prev.length) return prev

      const result = Array.from(prev)
      const [removed] = result.splice(index, 1)
      result.splice(newIndex, 0, removed)
      return result
    })
  }, [])

  const updatePhotoAnnotations = useCallback(
    (id: string, annotatedBlob: Blob, annotations: AnnotationData) => {
      setPhotos((prev) =>
        prev.map((photo) => {
          if (photo.id !== id) return photo

          // Revoke old annotated preview URL if it exists
          if (photo.annotatedPreviewUrl) {
            URL.revokeObjectURL(photo.annotatedPreviewUrl)
          }

          return {
            ...photo,
            annotations,
            annotatedBlob,
            annotatedPreviewUrl: URL.createObjectURL(annotatedBlob),
          }
        })
      )
    },
    []
  )

  const getPhotoForDisplay = useCallback((photo: CapturedPhoto): string => {
    // Return annotated version if available, otherwise original
    return photo.annotatedPreviewUrl || photo.previewUrl
  }, [])

  return {
    photos,
    addPhoto,
    addPhotos,
    removePhoto,
    reorderPhotos,
    movePhoto,
    clearPhotos,
    updatePhotoAnnotations,
    getPhotoForDisplay,
    photoCount: photos.length,
  }
}
