'use client'

import { SCAN_CATEGORIES, type ScanCategory } from '@/hooks/useScanReports'

interface CategorySelectorProps {
  selectedCategory: ScanCategory
  onSelect: (category: ScanCategory) => void
  variant?: 'modal' | 'inline'
  onClose?: () => void
}

export default function CategorySelector({
  selectedCategory,
  onSelect,
  variant = 'inline',
  onClose,
}: CategorySelectorProps) {
  if (variant === 'modal') {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-zinc-800 rounded-xl max-w-sm w-full p-6">
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-4">
            Select Category
          </h3>
          <div className="space-y-2">
            {SCAN_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => {
                  onSelect(cat.value)
                  onClose?.()
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors touch-target ${
                  selectedCategory === cat.value
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                    : 'hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="font-medium">{cat.label}</span>
                {selectedCategory === cat.value && (
                  <svg
                    className="w-5 h-5 ml-auto text-blue-600 dark:text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
          <button
            onClick={onClose}
            className="mt-4 w-full py-3 text-zinc-500 dark:text-zinc-400 font-medium hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors touch-target"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  // Inline variant (dropdown-style)
  return (
    <div className="flex flex-wrap gap-2">
      {SCAN_CATEGORIES.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onSelect(cat.value)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === cat.value
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
              : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-600'
          }`}
        >
          <span>{cat.icon}</span>
          <span>{cat.label}</span>
        </button>
      ))}
    </div>
  )
}
