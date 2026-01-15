'use client'

import { useCallback, useEffect, useRef } from 'react'

interface FindingsEditorProps {
  value: string
  onChange: (value: string) => void
  maxLength?: number
  placeholder?: string
  disabled?: boolean
}

const DEFAULT_PLACEHOLDER = 'Describe the issue and recommended action...\n\n• What was found during inspection\n• Severity/urgency of the issue\n• Recommended repairs or next steps'
const DEFAULT_MAX_LENGTH = 5000

export default function FindingsEditor({
  value,
  onChange,
  maxLength = DEFAULT_MAX_LENGTH,
  placeholder = DEFAULT_PLACEHOLDER,
  disabled = false,
}: FindingsEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const charCount = value.length
  const isNearLimit = charCount > maxLength * 0.8
  const isOverLimit = charCount > maxLength

  // Auto-resize textarea
  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    // Reset height to get accurate scrollHeight
    textarea.style.height = 'auto'

    // Calculate new height (min 4 lines, max 12 lines)
    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight) || 24
    const minHeight = lineHeight * 4
    const maxHeight = lineHeight * 12

    const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight)
    textarea.style.height = `${newHeight}px`
  }, [])

  // Adjust height on value change
  useEffect(() => {
    adjustHeight()
  }, [value, adjustHeight])

  // Adjust height on window resize
  useEffect(() => {
    window.addEventListener('resize', adjustHeight)
    return () => window.removeEventListener('resize', adjustHeight)
  }, [adjustHeight])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    // Don't prevent typing over limit, just warn
    onChange(newValue)
  }

  const handleClear = () => {
    onChange('')
    textareaRef.current?.focus()
  }

  const handleBulletPoint = () => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const currentValue = value

    // Insert bullet point at cursor
    const bullet = '• '
    const newValue =
      currentValue.substring(0, start) +
      (start === 0 || currentValue[start - 1] === '\n' ? '' : '\n') +
      bullet +
      currentValue.substring(end)

    onChange(newValue)

    // Set cursor position after bullet
    setTimeout(() => {
      const newPosition = start + (start === 0 || currentValue[start - 1] === '\n' ? 0 : 1) + bullet.length
      textarea.setSelectionRange(newPosition, newPosition)
      textarea.focus()
    }, 0)
  }

  return (
    <div className="space-y-2">
      {/* Editor */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full px-4 py-3 rounded-lg border resize-none
            bg-white dark:bg-zinc-800
            text-zinc-900 dark:text-zinc-100
            placeholder:text-zinc-400 dark:placeholder:text-zinc-500
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors
            ${isOverLimit
              ? 'border-red-500 dark:border-red-500'
              : 'border-zinc-300 dark:border-zinc-600'
            }
          `}
          style={{ minHeight: '120px' }}
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        {/* Actions */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleBulletPoint}
            disabled={disabled}
            className="px-3 py-1.5 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded transition-colors disabled:opacity-50"
            title="Add bullet point"
          >
            • Bullet
          </button>
          {value.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              disabled={disabled}
              className="px-3 py-1.5 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors disabled:opacity-50"
            >
              Clear
            </button>
          )}
        </div>

        {/* Character Count */}
        <div
          className={`text-sm ${
            isOverLimit
              ? 'text-red-500 font-medium'
              : isNearLimit
              ? 'text-amber-500'
              : 'text-zinc-400 dark:text-zinc-500'
          }`}
        >
          {charCount.toLocaleString()} / {maxLength.toLocaleString()}
          {isOverLimit && ' (over limit)'}
        </div>
      </div>
    </div>
  )
}
