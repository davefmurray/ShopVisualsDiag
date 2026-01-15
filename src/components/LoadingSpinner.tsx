'use client'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'white' | 'muted'
  className?: string
}

const SIZE_CLASSES = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-3',
}

const COLOR_CLASSES = {
  primary: 'border-blue-500 border-t-transparent',
  white: 'border-white border-t-transparent',
  muted: 'border-zinc-400 border-t-transparent dark:border-zinc-500',
}

export default function LoadingSpinner({
  size = 'md',
  color = 'primary',
  className = '',
}: LoadingSpinnerProps) {
  return (
    <div
      className={`
        animate-spin rounded-full
        ${SIZE_CLASSES[size]}
        ${COLOR_CLASSES[color]}
        ${className}
      `}
      role="status"
      aria-label="Loading"
    />
  )
}

export function LoadingOverlay({
  message = 'Loading...',
}: {
  message?: string
}) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 shadow-xl flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-zinc-600 dark:text-zinc-300">{message}</p>
      </div>
    </div>
  )
}

export function InlineLoading({
  message = 'Loading',
}: {
  message?: string
}) {
  return (
    <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
      <LoadingSpinner size="sm" color="muted" />
      <span className="text-sm">{message}</span>
    </div>
  )
}
