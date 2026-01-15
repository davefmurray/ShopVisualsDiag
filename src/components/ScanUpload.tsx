'use client'

import { useState, useRef, useCallback } from 'react'
import CategorySelector from './CategorySelector'
import type { ScanCategory } from '@/hooks/useScanReports'

interface ScanUploadProps {
  onFileSelected: (file: File, category: ScanCategory) => void
  maxSizeMB?: number
}

const ACCEPT_TYPES = 'application/pdf,image/jpeg,image/png'
const DEFAULT_MAX_SIZE_MB = 25

export default function ScanUpload({
  onFileSelected,
  maxSizeMB = DEFAULT_MAX_SIZE_MB,
}: ScanUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<ScanCategory>('other')
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const validateAndSetFile = useCallback(
    (file: File) => {
      setError(null)

      // Check file type
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png']
      if (!validTypes.includes(file.type)) {
        setError('Please select a PDF or image file (JPG, PNG)')
        return
      }

      // Check file size
      const maxSizeBytes = maxSizeMB * 1024 * 1024
      if (file.size > maxSizeBytes) {
        setError(`File is too large. Maximum size is ${maxSizeMB}MB`)
        return
      }

      setPendingFile(file)
    },
    [maxSizeMB]
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

      const file = e.dataTransfer.files[0]
      if (file) {
        validateAndSetFile(file)
      }
    },
    [validateAndSetFile]
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        validateAndSetFile(file)
      }
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    },
    [validateAndSetFile]
  )

  const handleConfirm = useCallback(() => {
    if (pendingFile) {
      onFileSelected(pendingFile, selectedCategory)
      setPendingFile(null)
      setSelectedCategory('other')
    }
  }, [pendingFile, selectedCategory, onFileSelected])

  const handleCancel = useCallback(() => {
    setPendingFile(null)
    setSelectedCategory('other')
    setError(null)
  }, [])

  const handleClick = useCallback(() => {
    inputRef.current?.click()
  }, [])

  // If we have a pending file, show category selection
  if (pendingFile) {
    return (
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
            {pendingFile.type === 'application/pdf' ? (
              <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zm-2.5 9.5a.5.5 0 01.5.5v3a.5.5 0 01-1 0v-3a.5.5 0 01.5-.5zm3 0a.5.5 0 01.5.5v3a.5.5 0 01-1 0v-3a.5.5 0 01.5-.5z" />
              </svg>
            ) : (
              <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
              {pendingFile.name}
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {(pendingFile.size / 1024 / 1024).toFixed(1)} MB
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Select document type:
          </p>
          <CategorySelector
            selectedCategory={selectedCategory}
            onSelect={setSelectedCategory}
            variant="inline"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleCancel}
            className="flex-1 py-2 text-zinc-600 dark:text-zinc-400 font-medium hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors touch-target"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors touch-target"
          >
            Add Scan
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Drop Zone */}
      <button
        type="button"
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full p-6 border-2 border-dashed rounded-lg transition-colors text-center ${
          isDragging
            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
            : 'border-zinc-300 dark:border-zinc-600 hover:border-green-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
        }`}
      >
        <div className="flex flex-col items-center gap-2">
          <div
            className={`p-3 rounded-full ${
              isDragging ? 'bg-green-100 dark:bg-green-800' : 'bg-zinc-100 dark:bg-zinc-700'
            }`}
          >
            <svg
              className={`w-6 h-6 ${
                isDragging ? 'text-green-600 dark:text-green-400' : 'text-zinc-500 dark:text-zinc-400'
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>

          <div>
            <p className="font-medium text-zinc-900 dark:text-zinc-100 text-sm">
              {isDragging ? 'Drop scan report here' : 'Drop scan report or click to browse'}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              PDF or image • Max {maxSizeMB}MB
            </p>
          </div>
        </div>
      </button>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_TYPES}
        onChange={handleFileInput}
        className="hidden"
      />

      {/* Error message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}
    </div>
  )
}
