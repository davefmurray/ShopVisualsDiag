'use client'

import { useEffect, useState } from 'react'
import type { UploadProgress as UploadProgressType } from '@/utils/tmUpload'

interface UploadProgressProps {
  progress: UploadProgressType
  onClose: () => void
  onRetry?: () => void
}

const STEP_ICONS = {
  preparing: (
    <svg className="w-6 h-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  uploading: (
    <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  ),
  updating: (
    <svg className="w-6 h-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
  complete: (
    <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
}

const STEP_LABELS = {
  preparing: 'Preparing',
  uploading: 'Uploading',
  updating: 'Updating Task',
  complete: 'Complete',
  error: 'Error',
}

export default function UploadProgress({
  progress,
  onClose,
  onRetry,
}: UploadProgressProps) {
  const [showDetails, setShowDetails] = useState(false)
  const isComplete = progress.step === 'complete'
  const isError = progress.step === 'error'

  // Auto-close after success (after a delay)
  useEffect(() => {
    if (isComplete) {
      const timeout = setTimeout(onClose, 2000)
      return () => clearTimeout(timeout)
    }
  }, [isComplete, onClose])

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-xl max-w-sm w-full p-6">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className={`p-4 rounded-full ${
            isError ? 'bg-red-100 dark:bg-red-900/30' :
            isComplete ? 'bg-green-100 dark:bg-green-900/30' :
            'bg-blue-100 dark:bg-blue-900/30'
          }`}>
            {STEP_ICONS[progress.step]}
          </div>
        </div>

        {/* Status */}
        <div className="text-center mb-4">
          <h3 className={`text-lg font-semibold ${
            isError ? 'text-red-600 dark:text-red-400' :
            isComplete ? 'text-green-600 dark:text-green-400' :
            'text-zinc-900 dark:text-zinc-100'
          }`}>
            {STEP_LABELS[progress.step]}
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-1">
            {progress.message}
          </p>
        </div>

        {/* Progress Bar */}
        {!isComplete && !isError && (
          <div className="mb-4">
            <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300 ease-out"
                style={{ width: `${progress.percent}%` }}
              />
            </div>
            <p className="text-center text-xs text-zinc-500 mt-1">
              {progress.percent}%
            </p>
          </div>
        )}

        {/* Error Details Toggle */}
        {isError && progress.message && (
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 mb-4"
          >
            {showDetails ? 'Hide details' : 'Show details'}
          </button>
        )}

        {/* Error Details */}
        {isError && showDetails && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-sm text-red-700 dark:text-red-300 font-mono break-all">
            {progress.message}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {isError && onRetry && (
            <button
              onClick={onRetry}
              className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          )}
          <button
            onClick={onClose}
            className={`py-2 px-4 rounded-lg font-medium transition-colors ${
              isError && onRetry
                ? 'flex-1 bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600'
                : isComplete
                ? 'w-full bg-green-600 text-white hover:bg-green-700'
                : 'w-full bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600'
            }`}
          >
            {isComplete ? 'Done' : isError ? 'Close' : 'Cancel'}
          </button>
        </div>
      </div>
    </div>
  )
}
