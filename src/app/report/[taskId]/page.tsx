'use client'

import { useState, useCallback, useEffect } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { usePhotoCapture } from '@/hooks/usePhotoCapture'
import { useScanReports, type ScanCategory } from '@/hooks/useScanReports'
import { useAutoSave } from '@/hooks/useAutoSave'
import PhotoCapture from '@/components/PhotoCapture'
import FileUpload from '@/components/FileUpload'
import PhotoGrid from '@/components/PhotoGrid'
import ScanUpload from '@/components/ScanUpload'
import ScanPreview from '@/components/ScanPreview'
import FindingsEditor from '@/components/FindingsEditor'
import PDFPreview from '@/components/PDFPreview'
import UploadProgress from '@/components/UploadProgress'
import UploadSuccess from '@/components/UploadSuccess'
import { generatePDF, downloadPDF } from '@/utils/pdfGenerator'
import { uploadReportToTM, type UploadProgress as UploadProgressType } from '@/utils/tmUpload'

export default function ReportPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [showCamera, setShowCamera] = useState(false)
  const [showPdfPreview, setShowPdfPreview] = useState(false)
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null)

  // Upload state
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<UploadProgressType | null>(null)
  const [showUploadSuccess, setShowUploadSuccess] = useState(false)

  const taskId = params.taskId as string
  const roId = searchParams.get('roId')
  const roNumber = searchParams.get('roNumber')
  const shopId = searchParams.get('shopId')
  const inspectionId = searchParams.get('inspectionId')
  const taskName = searchParams.get('taskName')

  // Photo capture state
  const {
    photos,
    addPhoto,
    addPhotos,
    removePhoto,
    movePhoto,
    updatePhotoAnnotations,
    photoCount,
  } = usePhotoCapture()

  // Scan reports state
  const {
    scans,
    addScan,
    removeScan,
    updateCategory,
    scanCount,
  } = useScanReports()

  // Findings text with auto-save
  const [findings, setFindings, clearSavedFindings] = useAutoSave<string>(
    '',
    { key: `shopvisuals-diag-findings-${taskId}` }
  )

  // Clean up PDF URL on unmount
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl)
      }
    }
  }, [pdfUrl])

  function handleCameraCapture(blob: Blob) {
    addPhoto(blob, `capture-${Date.now()}.jpg`)
  }

  function handleFilesSelected(files: { blob: Blob; filename: string }[]) {
    addPhotos(files)
  }

  function handleScanSelected(file: File, category: ScanCategory) {
    addScan(file, category)
  }

  const handleGeneratePdf = useCallback(async () => {
    setIsGeneratingPdf(true)
    setShowPdfPreview(true)

    // Clean up previous URL
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl)
      setPdfUrl(null)
      setPdfBlob(null)
    }

    try {
      const blob = await generatePDF({
        photos,
        scanReports: scans,
        findings,
        roNumber: roId || undefined,
        // vehicle and customer would come from TM API in full implementation
      })

      const url = URL.createObjectURL(blob)
      setPdfBlob(blob)
      setPdfUrl(url)
    } catch (error) {
      console.error('Failed to generate PDF:', error)
      alert('Failed to generate PDF. Please try again.')
      setShowPdfPreview(false)
    } finally {
      setIsGeneratingPdf(false)
    }
  }, [photos, scans, findings, roId, pdfUrl])

  const handleDownloadPdf = useCallback(async () => {
    if (pdfBlob) {
      const link = document.createElement('a')
      link.href = URL.createObjectURL(pdfBlob)
      link.download = `inspection-report-${roId || taskId}-${Date.now()}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      // Generate and download
      try {
        await downloadPDF(
          {
            photos,
            scanReports: scans,
            findings,
            roNumber: roId || undefined,
          },
          `inspection-report-${roId || taskId}-${Date.now()}.pdf`
        )
      } catch (error) {
        console.error('Failed to download PDF:', error)
        alert('Failed to download PDF. Please try again.')
      }
    }
  }, [pdfBlob, photos, scans, findings, roId, taskId])

  const handleClosePdfPreview = useCallback(() => {
    setShowPdfPreview(false)
    // Don't clear the URL yet in case they want to re-open
  }, [])

  const handleUploadToTm = useCallback(async () => {
    if (!pdfBlob || !shopId || !roId || !inspectionId || !taskId) {
      alert('Missing required information for upload. Please try generating the PDF again.')
      return
    }

    setShowPdfPreview(false)
    setIsUploading(true)
    setUploadProgress({
      step: 'preparing',
      message: 'Preparing upload...',
      percent: 0
    })

    const result = await uploadReportToTM(
      shopId,
      parseInt(roId, 10),
      parseInt(inspectionId, 10),
      parseInt(taskId, 10),
      pdfBlob,
      findings,
      setUploadProgress
    )

    if (result.success) {
      setIsUploading(false)
      setUploadProgress(null)
      setShowUploadSuccess(true)

      // Clear local state after successful upload
      clearSavedFindings()
    } else {
      setUploadProgress({
        step: 'error',
        message: result.error || 'Upload failed',
        percent: 0
      })
    }
  }, [pdfBlob, shopId, roId, inspectionId, taskId, findings, clearSavedFindings])

  const handleUploadRetry = useCallback(() => {
    handleUploadToTm()
  }, [handleUploadToTm])

  const handleUploadClose = useCallback(() => {
    setIsUploading(false)
    setUploadProgress(null)
  }, [])

  const handleUploadSuccessClose = useCallback(() => {
    setShowUploadSuccess(false)
  }, [])

  const handleCreateAnother = useCallback(() => {
    setShowUploadSuccess(false)
    // Clear all state for new report
    // Photos and scans are managed by hooks with their own state
    setFindings('')
    clearSavedFindings()
    setPdfUrl(null)
    setPdfBlob(null)
    // Navigate back to home to select new task
    router.push('/')
  }, [clearSavedFindings, router, setFindings])

  const totalAttachments = photoCount + scanCount
  const canGeneratePdf = totalAttachments > 0 || findings.trim().length > 0

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 pb-24">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              Create Report
            </h1>
          </div>
          {totalAttachments > 0 && (
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-medium rounded-full">
              {totalAttachments} item{totalAttachments !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Context Info */}
        <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-3 text-sm text-zinc-600 dark:text-zinc-400">
          <span className="text-zinc-400 dark:text-zinc-500">Task:</span>{' '}
          <span className="font-medium text-zinc-700 dark:text-zinc-300">{taskName || taskId}</span>
          {' '}•{' '}
          <span className="text-zinc-400 dark:text-zinc-500">RO:</span>{' '}
          <span className="font-medium text-zinc-700 dark:text-zinc-300">{roNumber || roId}</span>
        </div>

        {/* Photo Capture Section */}
        <section className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 p-6">
          <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-4">
            Capture Photos
          </h2>

          {/* Capture Options */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <button
              onClick={() => setShowCamera(true)}
              className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors touch-target"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Take Photo
            </button>
          </div>

          {/* File Upload */}
          <FileUpload onFilesSelected={handleFilesSelected} />

          {/* Photo Grid */}
          {photos.length > 0 && (
            <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-700">
              <PhotoGrid
                photos={photos}
                onDelete={removePhoto}
                onMove={movePhoto}
                onAnnotate={updatePhotoAnnotations}
              />
            </div>
          )}
        </section>

        {/* Scan Reports Section */}
        <section className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 p-6">
          <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-4">
            Scan Reports
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-4">
            Upload diagnostic scan reports (OBD2, alignment, battery tests, etc.)
          </p>

          <ScanUpload onFileSelected={handleScanSelected} />

          {scans.length > 0 && (
            <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-700">
              <ScanPreview
                scans={scans}
                onDelete={removeScan}
                onUpdateCategory={updateCategory}
              />
            </div>
          )}
        </section>

        {/* Findings Section */}
        <section className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 p-6">
          <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-2">
            Technician Findings
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-4">
            Describe the issue and recommended actions. This will be included in the PDF and pushed to Tekmetric.
          </p>

          <FindingsEditor
            value={findings}
            onChange={setFindings}
            placeholder="Describe the issue and recommended action...

• What was found during inspection
• Severity/urgency of the issue
• Recommended repairs or next steps"
          />
        </section>
      </main>

      {/* Generate PDF Button */}
      <div className="fixed bottom-0 left-0 right-0 safe-area-bottom bg-zinc-50 dark:bg-zinc-900 py-4 px-4 border-t border-zinc-200 dark:border-zinc-700">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={handleGeneratePdf}
            disabled={!canGeneratePdf || isGeneratingPdf}
            className="w-full py-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-target text-lg flex items-center justify-center gap-3"
          >
            {isGeneratingPdf ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                Generating PDF...
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Generate PDF
              </>
            )}
          </button>
          {!canGeneratePdf && (
            <p className="text-center text-zinc-500 dark:text-zinc-400 text-sm mt-2">
              Add photos, scan reports, or findings to generate a PDF
            </p>
          )}
        </div>
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <PhotoCapture
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      )}

      {/* PDF Preview Modal */}
      {showPdfPreview && (
        <PDFPreview
          pdfUrl={pdfUrl}
          pdfBlob={pdfBlob}
          isGenerating={isGeneratingPdf}
          onClose={handleClosePdfPreview}
          onDownload={handleDownloadPdf}
          onUpload={handleUploadToTm}
          uploadDisabled={!shopId || !inspectionId}
        />
      )}

      {/* Upload Progress Modal */}
      {isUploading && uploadProgress && (
        <UploadProgress
          progress={uploadProgress}
          onClose={handleUploadClose}
          onRetry={uploadProgress.step === 'error' ? handleUploadRetry : undefined}
        />
      )}

      {/* Upload Success Modal */}
      {showUploadSuccess && roId && shopId && (
        <UploadSuccess
          roNumber={roId}
          shopId={shopId}
          onClose={handleUploadSuccessClose}
          onCreateAnother={handleCreateAnother}
        />
      )}
    </div>
  )
}
