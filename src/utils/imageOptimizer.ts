'use client'

/**
 * Image optimization utilities for PDF generation
 */

const MAX_WIDTH = 1200
const MAX_HEIGHT = 1200
const JPEG_QUALITY = 0.8

/**
 * Compress and resize an image for PDF embedding
 */
export async function optimizeImageForPDF(
  imageSource: string | Blob,
  maxWidth: number = MAX_WIDTH,
  maxHeight: number = MAX_HEIGHT,
  quality: number = JPEG_QUALITY
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      // Calculate new dimensions maintaining aspect ratio
      let { width, height } = img

      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }

      if (height > maxHeight) {
        width = (width * maxHeight) / height
        height = maxHeight
      }

      // Create canvas and draw resized image
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Failed to get canvas context'))
        return
      }

      // Use better quality scaling
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(img, 0, 0, width, height)

      // Convert to JPEG data URL
      const dataUrl = canvas.toDataURL('image/jpeg', quality)
      resolve(dataUrl)
    }

    img.onerror = () => reject(new Error('Failed to load image'))

    // Handle both string URLs and Blobs
    if (typeof imageSource === 'string') {
      img.src = imageSource
    } else {
      img.src = URL.createObjectURL(imageSource)
    }
  })
}

/**
 * Convert a Blob to a data URL
 */
export function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

/**
 * Get dimensions of an image
 */
export function getImageDimensions(
  imageSource: string | Blob
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()

    img.onload = () => {
      resolve({ width: img.width, height: img.height })
    }

    img.onerror = () => reject(new Error('Failed to load image'))

    if (typeof imageSource === 'string') {
      img.src = imageSource
    } else {
      img.src = URL.createObjectURL(imageSource)
    }
  })
}

/**
 * Calculate optimal layout for photos in PDF
 */
export function calculatePhotoLayout(photoCount: number): {
  columns: number
  rows: number
  fullWidth: boolean
} {
  if (photoCount === 1) {
    return { columns: 1, rows: 1, fullWidth: true }
  }
  if (photoCount === 2) {
    return { columns: 2, rows: 1, fullWidth: false }
  }
  if (photoCount <= 4) {
    return { columns: 2, rows: 2, fullWidth: false }
  }
  // For 5+ photos, use 2 columns with multiple rows
  return {
    columns: 2,
    rows: Math.ceil(photoCount / 2),
    fullWidth: false,
  }
}
