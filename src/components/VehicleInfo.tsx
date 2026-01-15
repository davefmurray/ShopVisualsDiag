'use client'

import type { RepairOrder } from '@/types'

interface VehicleInfoProps {
  ro: RepairOrder
  onClear: () => void
}

export default function VehicleInfo({ ro, onClear }: VehicleInfoProps) {
  const { repairOrderNumber } = ro

  // Handle both legacy format (objects) and new format (strings from video processor)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const roAny = ro as any
  const customerName = roAny.customerName ||
    (roAny.customer?.firstName ? `${roAny.customer.firstName} ${roAny.customer.lastName}`.trim() : 'Unknown Customer')
  const vehicleDescription = roAny.vehicleDescription ||
    (roAny.vehicle?.year ? [roAny.vehicle.year, roAny.vehicle.make, roAny.vehicle.model].filter(Boolean).join(' ') : 'Unknown Vehicle')
  const vehicleVin = roAny.vehicle?.vin

  return (
    <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* RO Number */}
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-mono rounded">
              RO #{repairOrderNumber}
            </span>
          </div>

          {/* Vehicle */}
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {vehicleDescription || 'Unknown Vehicle'}
          </h3>

          {/* Customer */}
          <p className="text-zinc-600 dark:text-zinc-400">
            {customerName || 'Unknown Customer'}
          </p>

          {/* VIN if available */}
          {vehicleVin && (
            <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-1 font-mono">
              VIN: {vehicleVin}
            </p>
          )}
        </div>

        {/* Clear Button */}
        <button
          onClick={onClear}
          className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors touch-target"
          title="Search different RO"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
