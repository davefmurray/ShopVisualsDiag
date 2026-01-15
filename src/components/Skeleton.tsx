'use client'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
  animation?: 'pulse' | 'wave' | 'none'
}

export default function Skeleton({
  className = '',
  variant = 'text',
  width,
  height,
  animation = 'pulse',
}: SkeletonProps) {
  const baseClasses = 'bg-zinc-200 dark:bg-zinc-700'

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  }

  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  }

  const style: React.CSSProperties = {}
  if (width) style.width = typeof width === 'number' ? `${width}px` : width
  if (height) style.height = typeof height === 'number' ? `${height}px` : height

  // Default heights for text variant
  if (variant === 'text' && !height) {
    style.height = '1em'
  }

  return (
    <div
      className={`
        ${baseClasses}
        ${animationClasses[animation]}
        ${variantClasses[variant]}
        ${className}
      `}
      style={style}
      aria-hidden="true"
    />
  )
}

// Common skeleton patterns
export function SkeletonText({
  lines = 3,
  className = '',
}: {
  lines?: number
  className?: string
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i === lines - 1 ? '60%' : '100%'}
        />
      ))}
    </div>
  )
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div
      className={`bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 p-4 ${className}`}
    >
      <div className="flex items-start gap-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="70%" />
          <Skeleton variant="text" width="40%" />
        </div>
      </div>
      <div className="mt-4">
        <SkeletonText lines={2} />
      </div>
    </div>
  )
}

export function SkeletonPhotoGrid({
  count = 4,
  className = '',
}: {
  count?: number
  className?: string
}) {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton
          key={i}
          variant="rectangular"
          className="aspect-square"
        />
      ))}
    </div>
  )
}

export function SkeletonInspectionTask({ className = '' }: { className?: string }) {
  return (
    <div
      className={`bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 p-4 ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <Skeleton variant="text" width={120} height={24} />
        <Skeleton variant="rectangular" width={80} height={24} />
      </div>
      <Skeleton variant="text" width="90%" className="mb-2" />
      <Skeleton variant="text" width="60%" />
      <div className="flex gap-2 mt-4">
        <Skeleton variant="rectangular" width={32} height={32} />
        <Skeleton variant="rectangular" width={32} height={32} />
        <Skeleton variant="rectangular" width={32} height={32} />
      </div>
    </div>
  )
}

export function SkeletonRODetails({ className = '' }: { className?: string }) {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Vehicle Info Header */}
      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 p-4">
        <div className="flex items-center gap-4">
          <Skeleton variant="rectangular" width={80} height={60} />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="60%" height={24} />
            <Skeleton variant="text" width="40%" />
            <Skeleton variant="text" width="30%" />
          </div>
        </div>
      </div>

      {/* Inspection Tasks */}
      <div className="space-y-3">
        <Skeleton variant="text" width={150} height={20} />
        <SkeletonInspectionTask />
        <SkeletonInspectionTask />
      </div>
    </div>
  )
}
