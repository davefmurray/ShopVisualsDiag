'use client'

import { useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { usePhotoCapture } from '@/hooks/usePhotoCapture'
import { useScanReports, type ScanCategory } from '@/hooks/useScanReports'
import PhotoCapture from '@/components/PhotoCapture'
import FileUpload from '@/components/FileUpload'
import PhotoGrid from '@/components/PhotoGrid'
import ScanUpload from '@/components/ScanUpload'
import ScanPreview from '@/components/ScanPreview'

export default function ReportPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const [showCamera, setShowCamera] = useState(false)

  const taskId = params.taskId as string
  const roId = searchParams.get('roId')

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

  function handleCameraCapture(blob: Blob) {
    addPhoto(blob, `capture-${Date.now()}.jpg`)
  }

  function handleFilesSelected(files: { blob: Blob; filename: string }[]) {
    addPhotos(files)
  }

  function handleScanSelected(file: File, category: ScanCategory) {
    addScan(file, category)
  }

  const totalAttachments = photoCount + scanCount

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
        <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-3 text-sm font-mono text-zinc-600 dark:text-zinc-400">
          <span className="text-zinc-400 dark:text-zinc-500">Task:</span> {taskId} •{' '}
          <span className="text-zinc-400 dark:text-zinc-500">RO:</span> {roId}
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

        {/* Findings Section (Placeholder) */}
        <section className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 p-6 opacity-60">
          <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-2">
            Findings
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            Coming in SPEC-007: Enter your diagnostic findings
          </p>
        </section>
      </main>

      {/* Generate PDF Button (Placeholder) */}
      <div className="fixed bottom-0 left-0 right-0 safe-area-bottom bg-zinc-50 dark:bg-zinc-900 py-4 px-4 border-t border-zinc-200 dark:border-zinc-700">
        <div className="max-w-4xl mx-auto">
          <button
            disabled
            className="w-full py-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-target text-lg"
          >
            Generate PDF (Coming Soon)
          </button>
        </div>
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <PhotoCapture
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
    </div>
  )
}
