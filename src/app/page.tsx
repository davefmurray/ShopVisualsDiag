'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { checkTokenStatus } from '@/utils/api'
import ROLookup from '@/components/ROLookup'
import VehicleInfo from '@/components/VehicleInfo'
import InspectionTaskList from '@/components/InspectionTaskList'
import type { TokenStatus, RepairOrder, Inspection, InspectionTask } from '@/types'

export default function Home() {
  const router = useRouter()
  const [tokenStatus, setTokenStatus] = useState<TokenStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // RO data state
  const [selectedRO, setSelectedRO] = useState<RepairOrder | null>(null)
  const [inspections, setInspections] = useState<Inspection[]>([])

  useEffect(() => {
    async function fetchTokenStatus() {
      setLoading(true)
      const status = await checkTokenStatus()
      setTokenStatus(status)
      setLoading(false)
    }
    fetchTokenStatus()
  }, [])

  function handleROFound(ro: RepairOrder, inspectionData: Inspection[]) {
    setError(null)
    setSelectedRO(ro)
    setInspections(inspectionData)
  }

  function handleROError(errorMessage: string) {
    setError(errorMessage)
    setSelectedRO(null)
    setInspections([])
  }

  function handleClearRO() {
    setSelectedRO(null)
    setInspections([])
    setError(null)
  }

  function handleTaskSelect(inspection: Inspection, task: InspectionTask) {
    if (!selectedRO || !tokenStatus?.shopId) return

    // Navigate to report builder with context
    const params = new URLSearchParams({
      shopId: tokenStatus.shopId,
      roId: String(selectedRO.id),
      inspectionId: String(inspection.id),
    })
    router.push(`/report/${task.id}?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            ShopVisualsDiag
          </h1>
          <TokenStatusBadge status={tokenStatus} loading={loading} />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {!tokenStatus?.hasToken && !loading ? (
          <NoTokenMessage />
        ) : (
          <>
            {/* Error Display */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* RO Search or Vehicle Info */}
            {!selectedRO ? (
              <section className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 p-6">
                <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-4">
                  Find Repair Order
                </h2>
                <ROLookup
                  shopId={tokenStatus?.shopId || ''}
                  onROFound={handleROFound}
                  onError={handleROError}
                />
              </section>
            ) : (
              <>
                {/* Vehicle Info Card */}
                <VehicleInfo ro={selectedRO} onClear={handleClearRO} />

                {/* Inspection Tasks */}
                <section className="space-y-3">
                  <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                    Select Inspection Task
                  </h2>
                  <InspectionTaskList
                    inspections={inspections}
                    onTaskSelect={handleTaskSelect}
                  />
                </section>
              </>
            )}

            {/* Instructions (show when no RO selected) */}
            {!selectedRO && (
              <section className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  How to use ShopVisualsDiag
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-blue-800 dark:text-blue-200 text-sm">
                  <li>Enter an RO number to find the repair order</li>
                  <li>Select an inspection task to create a report for</li>
                  <li>Capture photos and upload scan reports</li>
                  <li>Add annotations to highlight issues</li>
                  <li>Enter your findings and generate the PDF</li>
                  <li>Upload directly to Tekmetric</li>
                </ol>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  )
}

function TokenStatusBadge({
  status,
  loading,
}: {
  status: TokenStatus | null
  loading: boolean
}) {
  if (loading) {
    return (
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400 text-sm">
        <span className="w-2 h-2 rounded-full bg-zinc-400 animate-pulse" />
        Checking...
      </span>
    )
  }

  if (status?.hasToken) {
    return (
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm">
        <span className="w-2 h-2 rounded-full bg-green-500" />
        {status.shopName || `Shop ${status.shopId}`}
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm">
      <span className="w-2 h-2 rounded-full bg-red-500" />
      No Token
    </span>
  )
}

function NoTokenMessage() {
  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 text-center">
      <h2 className="text-lg font-medium text-yellow-800 dark:text-yellow-200 mb-2">
        Tekmetric Connection Required
      </h2>
      <p className="text-yellow-700 dark:text-yellow-300 mb-4">
        Please log into Tekmetric and use the Chrome extension to capture your session token.
      </p>
      <div className="text-sm text-yellow-600 dark:text-yellow-400 space-y-1">
        <p>1. Install the TM Token Capture extension</p>
        <p>2. Log into your Tekmetric account</p>
        <p>3. Click the extension to capture your token</p>
        <p>4. Refresh this page</p>
      </div>
    </div>
  )
}
