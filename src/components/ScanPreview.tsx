'use client'

import { useState } from 'react'
import CategorySelector from './CategorySelector'
import {
  formatFileSize,
  getCategoryLabel,
  getCategoryIcon,
  type ScanReport,
  type ScanCategory,
} from '@/hooks/useScanReports'

interface ScanPreviewProps {
  scans: ScanReport[]
  onDelete: (id: string) => void
  onUpdateCategory: (id: string, category: ScanCategory) => void
}

export default function ScanPreview({
  scans,
  onDelete,
  onUpdateCategory,
}: ScanPreviewProps) {
  if (scans.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {scans.length} scan report{scans.length !== 1 ? 's' : ''} attached
      </p>

      <div className="space-y-2">
        {scans.map((scan) => (
          <ScanCard
            key={scan.id}
            scan={scan}
            onDelete={() => onDelete(scan.id)}
            onUpdateCategory={(category) => onUpdateCategory(scan.id, category)}
          />
        ))}
      </div>
    </div>
  )
}

interface ScanCardProps {
  scan: ScanReport
  onDelete: () => void
  onUpdateCategory: (category: ScanCategory) => void
}

function ScanCard({ scan, onDelete, onUpdateCategory }: ScanCardProps) {
  const [showCategorySelector, setShowCategorySelector] = useState(false)

  return (
    <>
      <div className="flex items-center gap-3 p-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg">
        {/* Preview/Icon */}
        <div className="w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center">
          {scan.type === 'pdf' ? (
            <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM8.5 15.5a1 1 0 011-1h1a1 1 0 011 1v2a1 1 0 01-1 1h-1a1 1 0 01-1-1v-2zm4 0a1 1 0 011-1h1a1 1 0 011 1v2a1 1 0 01-1 1h-1a1 1 0 01-1-1v-2z" />
            </svg>
          ) : (
            <img
              src={scan.previewUrl}
              alt={scan.filename}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-zinc-900 dark:text-zinc-100 truncate text-sm">
            {scan.filename}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={() => setShowCategorySelector(true)}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-zinc-100 dark:bg-zinc-700 rounded text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors"
            >
              <span>{getCategoryIcon(scan.category)}</span>
              <span>{getCategoryLabel(scan.category)}</span>
              <svg className="w-3 h-3 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <span className="text-xs text-zinc-400 dark:text-zinc-500">
              {formatFileSize(scan.fileSize)}
            </span>
          </div>
        </div>

        {/* Delete Button */}
        <button
          onClick={onDelete}
          className="p-2 text-zinc-400 hover:text-red-500 transition-colors touch-target"
          title="Remove scan"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>

      {/* Category Selector Modal */}
      {showCategorySelector && (
        <CategorySelector
          selectedCategory={scan.category}
          onSelect={onUpdateCategory}
          variant="modal"
          onClose={() => setShowCategorySelector(false)}
        />
      )}
    </>
  )
}
