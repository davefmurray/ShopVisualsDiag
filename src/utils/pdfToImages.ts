'use client'

import * as pdfjsLib from 'pdfjs-dist'

// Set up the worker - use the worker file from public directory
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'
}

export interface PDFPageImage {
  pageNumber: number
  dataUrl: string
  width: number
  height: number
}

/**
 * Convert a PDF file to an array of image data URLs (one per page)
 */
export async function pdfToImages(
  pdfFile: File | Blob,
  scale: number = 2.0 // Higher scale = better quality
): Promise<PDFPageImage[]> {
  const arrayBuffer = await pdfFile.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  const pageImages: PDFPageImage[] = []

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum)
    const viewport = page.getViewport({ scale })

    // Create canvas
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')!
    canvas.width = viewport.width
    canvas.height = viewport.height

    // Render the page
    await page.render({
      canvasContext: context,
      viewport,
      canvas,
    }).promise

    // Convert to data URL
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9)

    pageImages.push({
      pageNumber: pageNum,
      dataUrl,
      width: viewport.width,
      height: viewport.height,
    })
  }

  return pageImages
}

/**
 * Get the number of pages in a PDF
 */
export async function getPDFPageCount(pdfFile: File | Blob): Promise<number> {
  const arrayBuffer = await pdfFile.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  return pdf.numPages
}
