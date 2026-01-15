'use client'

import { useState, useCallback } from 'react'

export type ScanCategory = 'obd2' | 'alignment' | 'battery' | 'brake' | 'other'

export interface ScanReport {
  id: string
  file: File
  type: 'pdf' | 'image'
  category: ScanCategory
  previewUrl: string
  filename: string
  fileSize: number
}

export const SCAN_CATEGORIES: { value: ScanCategory; label: string; icon: string }[] = [
  { value: 'obd2', label: 'OBD2 / Code Scan', icon: '🔌' },
  { value: 'alignment', label: 'Wheel Alignment', icon: '🛞' },
  { value: 'battery', label: 'Battery / Electrical', icon: '🔋' },
  { value: 'brake', label: 'Brake Inspection', icon: '🛑' },
  { value: 'other', label: 'Other Diagnostic', icon: '📋' },
]

export function useScanReports() {
  const [scans, setScans] = useState<ScanReport[]>([])

  const addScan = useCallback((file: File, category: ScanCategory = 'other') => {
    const id = `scan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const previewUrl = URL.createObjectURL(file)
    const type: 'pdf' | 'image' = file.type === 'application/pdf' ? 'pdf' : 'image'

    const newScan: ScanReport = {
      id,
      file,
      type,
      category,
      previewUrl,
      filename: file.name,
      fileSize: file.size,
    }

    setScans((prev) => [...prev, newScan])
    return newScan
  }, [])

  const removeScan = useCallback((id: string) => {
    setScans((prev) => {
      const scan = prev.find((s) => s.id === id)
      if (scan) {
        URL.revokeObjectURL(scan.previewUrl)
      }
      return prev.filter((s) => s.id !== id)
    })
  }, [])

  const updateCategory = useCallback((id: string, category: ScanCategory) => {
    setScans((prev) =>
      prev.map((scan) => (scan.id === id ? { ...scan, category } : scan))
    )
  }, [])

  const clearScans = useCallback(() => {
    setScans((prev) => {
      prev.forEach((scan) => URL.revokeObjectURL(scan.previewUrl))
      return []
    })
  }, [])

  return {
    scans,
    addScan,
    removeScan,
    updateCategory,
    clearScans,
    scanCount: scans.length,
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function getCategoryLabel(category: ScanCategory): string {
  return SCAN_CATEGORIES.find((c) => c.value === category)?.label || 'Other'
}

export function getCategoryIcon(category: ScanCategory): string {
  return SCAN_CATEGORIES.find((c) => c.value === category)?.icon || '📋'
}
