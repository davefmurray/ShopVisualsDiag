'use client'

import { useState } from 'react'
import { searchRepairOrders, getInspections } from '@/utils/api'
import type { RepairOrder, Inspection } from '@/types'

interface ROLookupProps {
  shopId: string
  onROFound: (ro: RepairOrder, inspections: Inspection[]) => void
  onError: (error: string) => void
}

export default function ROLookup({ shopId, onROFound, onError }: ROLookupProps) {
  const [roNumber, setRONumber] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSearch() {
    if (!roNumber.trim()) {
      onError('Please enter an RO number')
      return
    }

    setLoading(true)

    try {
      // Search for RO
      const roResult = await searchRepairOrders(shopId, roNumber.trim())

      if (!roResult.success || !roResult.data?.length) {
        onError(`RO ${roNumber} not found`)
        setLoading(false)
        return
      }

      const ro = roResult.data[0]

      // Get inspections for this RO
      const inspResult = await getInspections(shopId, ro.id)

      if (!inspResult.success) {
        onError('Failed to load inspections')
        setLoading(false)
        return
      }

      onROFound(ro, inspResult.data || [])
    } catch (err) {
      console.error('RO lookup error:', err)
      onError('Failed to search for RO. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <input
          type="text"
          value={roNumber}
          onChange={(e) => setRONumber(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter RO number..."
          disabled={loading}
          className="flex-1 px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 text-lg touch-target"
        />
        <button
          onClick={handleSearch}
          disabled={loading || !roNumber.trim()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-target min-w-[100px]"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </span>
          ) : (
            'Find'
          )}
        </button>
      </div>
    </div>
  )
}
