'use client'

import Link from 'next/link'

interface UploadSuccessProps {
  roNumber: string
  shopId: string
  onClose: () => void
  onCreateAnother: () => void
}

export default function UploadSuccess({
  roNumber,
  shopId,
  onClose,
  onCreateAnother,
}: UploadSuccessProps) {
  // Construct TekMetric RO link (if known format)
  // Note: This URL pattern may vary by shop/TM version
  const tmUrl = `https://shop.tekmetric.com/shop/${shopId}/repair-orders?search=${roNumber}`

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-xl max-w-md w-full p-6">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full">
            <svg
              className="w-12 h-12 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Message */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
            Report Uploaded Successfully!
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            Your diagnostic report has been uploaded to Tekmetric for RO #{roNumber}.
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-zinc-100 dark:bg-zinc-700/50 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white dark:bg-zinc-600 rounded-lg">
              <svg
                className="w-5 h-5 text-zinc-600 dark:text-zinc-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                PDF & Findings Uploaded
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                The report PDF and findings text are now in Tekmetric
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <a
            href={tmUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            View in Tekmetric
          </a>

          <button
            onClick={onCreateAnother}
            className="w-full py-3 px-4 bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
          >
            Create Another Report
          </button>

          <Link
            href="/"
            className="block w-full py-3 px-4 text-center text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
