'use client'

import { useState, useEffect } from 'react'
import { formatFileSize } from '@/utils/pdfGenerator'

interface PDFPreviewProps {
  pdfUrl: string | null
  pdfBlob: Blob | null
  isGenerating: boolean
  onClose: () => void
  onDownload: () => void
  onUpload: () => void
  uploadDisabled?: boolean
}

export default function PDFPreview({
  pdfUrl,
  pdfBlob,
  isGenerating,
  onClose,
  onDownload,
  onUpload,
  uploadDisabled = false,
}: PDFPreviewProps) {
  const [error, setError] = useState<string | null>(null)

  // Reset error when URL changes
  useEffect(() => {
    setError(null)
  }, [pdfUrl])

  const fileSize = pdfBlob ? formatFileSize(pdfBlob.size) : null

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-zinc-900 border-b border-zinc-700 safe-area-top">
        <button
          onClick={onClose}
          className="p-2 text-zinc-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="text-center">
          <h2 className="text-white font-medium">PDF Preview</h2>
          {fileSize && (
            <p className="text-zinc-400 text-sm">{fileSize}</p>
          )}
        </div>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-zinc-800">
        {isGenerating ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-white">Generating PDF...</p>
              <p className="text-zinc-400 text-sm mt-2">This may take a moment</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-6 bg-red-900/20 rounded-lg mx-4">
              <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-red-400">{error}</p>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        ) : pdfUrl ? (
          <div className="h-full p-4">
            <iframe
              src={pdfUrl}
              className="w-full h-full rounded-lg bg-white"
              title="PDF Preview"
              onError={() => setError('Failed to load PDF preview')}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-zinc-400">No PDF to preview</p>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      {pdfUrl && !isGenerating && !error && (
        <div className="p-4 bg-zinc-900 border-t border-zinc-700 safe-area-bottom">
          <div className="flex gap-3 max-w-lg mx-auto">
            <button
              onClick={onDownload}
              className="flex-1 py-3 px-4 bg-zinc-700 text-white font-medium rounded-lg hover:bg-zinc-600 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </button>
            <button
              onClick={onUpload}
              disabled={uploadDisabled}
              className="flex-1 py-3 px-4 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Upload to Tekmetric
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
