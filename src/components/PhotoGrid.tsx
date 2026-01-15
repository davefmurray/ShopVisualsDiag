'use client'

import { useState } from 'react'
import type { CapturedPhoto } from '@/hooks/usePhotoCapture'

interface PhotoGridProps {
  photos: CapturedPhoto[]
  onDelete: (id: string) => void
  onMove?: (id: string, direction: 'up' | 'down') => void
  onPhotoClick?: (photo: CapturedPhoto) => void
}

export default function PhotoGrid({
  photos,
  onDelete,
  onMove,
  onPhotoClick,
}: PhotoGridProps) {
  const [fullscreenPhoto, setFullscreenPhoto] = useState<CapturedPhoto | null>(null)

  if (photos.length === 0) {
    return null
  }

  function handlePhotoClick(photo: CapturedPhoto) {
    if (onPhotoClick) {
      onPhotoClick(photo)
    } else {
      setFullscreenPhoto(photo)
    }
  }

  return (
    <>
      <div className="space-y-3">
        {/* Photo Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {photos.length} photo{photos.length !== 1 ? 's' : ''} captured
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {photos.map((photo, index) => (
            <PhotoThumbnail
              key={photo.id}
              photo={photo}
              index={index}
              total={photos.length}
              onDelete={() => onDelete(photo.id)}
              onMove={onMove ? (dir) => onMove(photo.id, dir) : undefined}
              onClick={() => handlePhotoClick(photo)}
            />
          ))}
        </div>
      </div>

      {/* Fullscreen Preview */}
      {fullscreenPhoto && (
        <PhotoFullscreen
          photo={fullscreenPhoto}
          onClose={() => setFullscreenPhoto(null)}
          onDelete={() => {
            onDelete(fullscreenPhoto.id)
            setFullscreenPhoto(null)
          }}
        />
      )}
    </>
  )
}

interface PhotoThumbnailProps {
  photo: CapturedPhoto
  index: number
  total: number
  onDelete: () => void
  onMove?: (direction: 'up' | 'down') => void
  onClick: () => void
}

function PhotoThumbnail({
  photo,
  index,
  total,
  onDelete,
  onMove,
  onClick,
}: PhotoThumbnailProps) {
  return (
    <div className="relative group aspect-square">
      {/* Image */}
      <button
        onClick={onClick}
        className="w-full h-full rounded-lg overflow-hidden bg-zinc-200 dark:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <img
          src={photo.previewUrl}
          alt={`Photo ${index + 1}`}
          className="w-full h-full object-cover"
        />
      </button>

      {/* Index Badge */}
      <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/60 text-white text-xs font-medium rounded">
        {index + 1}
      </div>

      {/* Delete Button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity touch-target"
        title="Delete photo"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Reorder Buttons (optional) */}
      {onMove && (
        <div className="absolute bottom-1 left-1 right-1 flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {index > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onMove('up')
              }}
              className="p-1 bg-black/60 text-white rounded"
              title="Move left"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          {index < total - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onMove('down')
              }}
              className="p-1 bg-black/60 text-white rounded"
              title="Move right"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  )
}

interface PhotoFullscreenProps {
  photo: CapturedPhoto
  onClose: () => void
  onDelete: () => void
}

function PhotoFullscreen({ photo, onClose, onDelete }: PhotoFullscreenProps) {
  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/50 safe-area-top">
        <button
          onClick={onClose}
          className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors touch-target"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <span className="text-white font-medium">Preview</span>
        <button
          onClick={onDelete}
          className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors touch-target"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>

      {/* Image */}
      <div className="flex-1 flex items-center justify-center p-4">
        <img
          src={photo.previewUrl}
          alt="Full preview"
          className="max-w-full max-h-full object-contain"
        />
      </div>
    </div>
  )
}
