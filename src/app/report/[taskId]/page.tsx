'use client'

import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function ReportPage() {
  const params = useParams()
  const searchParams = useSearchParams()

  const taskId = params.taskId as string
  const shopId = searchParams.get('shopId')
  const roId = searchParams.get('roId')
  const inspectionId = searchParams.get('inspectionId')

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
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
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 p-6">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🚧</div>
            <h2 className="text-xl font-medium text-zinc-900 dark:text-zinc-100 mb-2">
              Report Builder Coming Soon
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">
              This page will allow you to capture photos, upload scan reports, and generate PDFs.
            </p>

            {/* Debug Info */}
            <div className="mt-8 text-left bg-zinc-100 dark:bg-zinc-700 rounded-lg p-4 text-sm font-mono">
              <p className="text-zinc-500 dark:text-zinc-400 mb-2">Context:</p>
              <ul className="space-y-1 text-zinc-700 dark:text-zinc-300">
                <li>Task ID: {taskId}</li>
                <li>Shop ID: {shopId}</li>
                <li>RO ID: {roId}</li>
                <li>Inspection ID: {inspectionId}</li>
              </ul>
            </div>

            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to RO Lookup
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
