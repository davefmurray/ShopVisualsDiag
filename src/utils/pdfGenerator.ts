'use client'

import { pdf } from '@react-pdf/renderer'
import ReportTemplate from '@/components/ReportTemplate'
import { optimizeImageForPDF, blobToDataURL, getImageDimensions } from './imageOptimizer'
import { pdfToImages } from './pdfToImages'
import type { CapturedPhoto } from '@/hooks/usePhotoCapture'
import type { ScanReport } from '@/hooks/useScanReports'
import type { Vehicle, Customer } from '@/types'

interface GeneratePDFOptions {
  photos: CapturedPhoto[]
  scanReports: ScanReport[]
  findings: string
  vehicle?: Vehicle
  customer?: Customer
  roNumber?: string | number
}

interface PreparedPhoto {
  id: string
  dataUrl: string
  caption?: string
  width: number
  height: number
  isLandscape: boolean
}

interface PreparedScanReport {
  id: string
  name: string
  category: string
  dataUrl: string
  width: number
  height: number
  isLandscape: boolean
  pageNumber?: number
}

/**
 * Prepare photos for PDF generation (optimize and convert to data URLs)
 */
async function preparePhotos(photos: CapturedPhoto[]): Promise<PreparedPhoto[]> {
  const prepared: PreparedPhoto[] = []

  for (const photo of photos) {
    try {
      // Use annotated version if available, otherwise use original
      const imageSource = photo.annotatedBlob || photo.blob
      const objectUrl = URL.createObjectURL(imageSource)

      // Get original dimensions first
      const dimensions = await getImageDimensions(objectUrl)

      // Optimize with higher resolution for full-page display
      const dataUrl = await optimizeImageForPDF(
        objectUrl,
        2000, // Higher resolution for full page
        2000
      )

      URL.revokeObjectURL(objectUrl)

      prepared.push({
        id: photo.id,
        dataUrl,
        caption: photo.filename,
        width: dimensions.width,
        height: dimensions.height,
        isLandscape: dimensions.width > dimensions.height,
      })
    } catch (error) {
      console.error(`Failed to prepare photo ${photo.id}:`, error)
    }
  }

  return prepared
}

/**
 * Prepare scan reports for PDF generation
 */
async function prepareScanReports(
  scans: ScanReport[]
): Promise<PreparedScanReport[]> {
  const prepared: PreparedScanReport[] = []

  for (const scan of scans) {
    try {
      // For images, optimize them
      if (scan.file.type.startsWith('image/')) {
        const objectUrl = URL.createObjectURL(scan.file)
        const dimensions = await getImageDimensions(objectUrl)

        const dataUrl = await optimizeImageForPDF(
          objectUrl,
          2000,
          2000
        )

        URL.revokeObjectURL(objectUrl)

        prepared.push({
          id: scan.id,
          name: scan.file.name,
          category: scan.category,
          dataUrl,
          width: dimensions.width,
          height: dimensions.height,
          isLandscape: dimensions.width > dimensions.height,
        })
      } else if (scan.file.type === 'application/pdf') {
        // Convert PDF pages to images
        try {
          const pageImages = await pdfToImages(scan.file, 2.0)

          // Add each page as a separate scan report entry
          for (const pageImage of pageImages) {
            prepared.push({
              id: `${scan.id}-page-${pageImage.pageNumber}`,
              name: scan.file.name,
              category: scan.category,
              dataUrl: pageImage.dataUrl,
              width: pageImage.width,
              height: pageImage.height,
              isLandscape: pageImage.width > pageImage.height,
              pageNumber: pageImage.pageNumber,
            })
          }
        } catch (pdfError) {
          console.error(`Failed to convert PDF ${scan.file.name}:`, pdfError)
          // Fallback to preview URL if PDF conversion fails
          if (scan.previewUrl) {
            prepared.push({
              id: scan.id,
              name: scan.file.name,
              category: scan.category,
              dataUrl: scan.previewUrl,
              width: 800,
              height: 600,
              isLandscape: true,
            })
          }
        }
      }
    } catch (error) {
      console.error(`Failed to prepare scan report ${scan.id}:`, error)
    }
  }

  return prepared.filter((s) => s.dataUrl)
}

/**
 * Generate a PDF blob from the report data
 */
export async function generatePDF(
  options: GeneratePDFOptions
): Promise<Blob> {
  const { photos, scanReports, findings, vehicle, customer, roNumber } = options

  // Prepare all images
  const [preparedPhotos, preparedScans] = await Promise.all([
    preparePhotos(photos),
    prepareScanReports(scanReports),
  ])

  // Create the document and generate PDF blob
  const pdfBlob = await pdf(
    ReportTemplate({
      photos: preparedPhotos,
      scanReports: preparedScans,
      findings,
      vehicle,
      customer,
      roNumber,
      reportDate: new Date(),
    })
  ).toBlob()

  return pdfBlob
}

/**
 * Generate PDF and create a download URL
 */
export async function generatePDFDataUrl(
  options: GeneratePDFOptions
): Promise<string> {
  const blob = await generatePDF(options)
  return URL.createObjectURL(blob)
}

/**
 * Download the generated PDF
 */
export async function downloadPDF(
  options: GeneratePDFOptions,
  filename: string = 'inspection-report.pdf'
): Promise<void> {
  const blob = await generatePDF(options)
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  // Clean up
  URL.revokeObjectURL(url)
}

/**
 * Get file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
