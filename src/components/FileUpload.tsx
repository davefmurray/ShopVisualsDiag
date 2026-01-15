'use client'

import { useState, useRef, useCallback } from 'react'

interface FileUploadProps {
  onFilesSelected: (files: { blob: Blob; filename: string }[]) => void
  accept?: string
  maxSizeMB?: number
}

const DEFAULT_ACCEPT = 'image/jpeg,image/png,image/heic,image/heif'
const DEFAULT_MAX_SIZE_MB = 10

export default function FileUpload({
  onFilesSelected,
  accept = DEFAULT_ACCEPT,
  maxSizeMB = DEFAULT_MAX_SIZE_MB,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [warnings, setWarnings] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const processFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return

      const files: { blob: Blob; filename: string }[] = []
      const newWarnings: string[] = []
      const maxSizeBytes = maxSizeMB * 1024 * 1024

      Array.from(fileList).forEach((file) => {
        // Check file size
        if (file.size > maxSizeBytes) {
          newWarnings.push(
            `${file.name} is ${(file.size / 1024 / 1024).toFixed(1)}MB (larger than ${maxSizeMB}MB)`
          )
        }

        // Accept the file regardless of size warning
        files.push({ blob: file, filename: file.name })
      })

      setWarnings(newWarnings)

      if (files.length > 0) {
        onFilesSelected(files)
      }
    },
    [maxSizeMB, onFilesSelected]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      const { files } = e.dataTransfer
      processFiles(files)
    },
    [processFiles]
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      processFiles(e.target.files)
      // Reset input so same file can be selected again
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    },
    [processFiles]
  )

  const handleClick = useCallback(() => {
    inputRef.current?.click()
  }, [])

  return (
    <div className="space-y-3">
      {/* Drop Zone */}
      <button
        type="button"
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full p-8 border-2 border-dashed rounded-lg transition-colors text-center ${
          isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-zinc-300 dark:border-zinc-600 hover:border-blue-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
        }`}
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className={`p-3 rounded-full ${
              isDragging ? 'bg-blue-100 dark:bg-blue-800' : 'bg-zinc-100 dark:bg-zinc-700'
            }`}
          >
            <svg
              className={`w-8 h-8 ${
                isDragging ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-500 dark:text-zinc-400'
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>

          <div>
            <p className="font-medium text-zinc-900 dark:text-zinc-100">
              {isDragging ? 'Drop photos here' : 'Drop photos here or click to browse'}
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              JPG, PNG, HEIC • Multiple files supported
            </p>
          </div>
        </div>
      </button>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        onChange={handleFileInput}
        className="hidden"
      />

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">
            Large file warning:
          </p>
          <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
            {warnings.map((warning, i) => (
              <li key={i}>• {warning}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
