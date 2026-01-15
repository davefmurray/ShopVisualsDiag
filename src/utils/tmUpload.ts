'use client'

import type { ApiResponse } from '@/types'

const VIDEO_PROCESSOR_URL = process.env.NEXT_PUBLIC_VIDEO_PROCESSOR_URL || 'https://ast-video-processor-production.up.railway.app'

export interface UploadResult {
  success: boolean
  pdfUrl?: string
  error?: string
}

export interface UploadProgress {
  step: 'preparing' | 'uploading' | 'updating' | 'complete' | 'error'
  message: string
  percent: number
}

export type UploadProgressCallback = (progress: UploadProgress) => void

/**
 * Upload a diagnostic report PDF to Tekmetric via the video processor service
 *
 * Flow:
 * 1. Send PDF blob to video-processor /api/upload-pdf endpoint
 * 2. Video processor gets presigned URL from TM
 * 3. Video processor uploads PDF to S3
 * 4. Video processor updates task with media path and description
 * 5. Returns success/error
 */
export async function uploadReportToTM(
  shopId: string,
  roId: number,
  inspectionId: number,
  taskId: number,
  pdfBlob: Blob,
  findings: string,
  onProgress?: UploadProgressCallback
): Promise<UploadResult> {
  try {
    // Step 1: Preparing upload
    onProgress?.({
      step: 'preparing',
      message: 'Preparing upload...',
      percent: 10
    })

    // Create FormData with PDF and metadata
    const formData = new FormData()
    formData.append('pdfFile', pdfBlob, `diagnostic-report-${Date.now()}.pdf`)
    formData.append('shopId', shopId)
    formData.append('roId', String(roId))
    formData.append('inspectionId', String(inspectionId))
    formData.append('taskId', String(taskId))
    formData.append('description', findings)

    // Step 2: Uploading
    onProgress?.({
      step: 'uploading',
      message: 'Uploading to Tekmetric...',
      percent: 30
    })

    const response = await fetch(`${VIDEO_PROCESSOR_URL}/api/upload-pdf`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))

      // Handle specific error types
      if (errorData.error === 'NO_TOKEN') {
        return {
          success: false,
          error: 'No valid Tekmetric token. Please make sure the Chrome extension is running and you are logged into Tekmetric.'
        }
      }

      if (errorData.error === 'UPLOAD_FAILED') {
        return {
          success: false,
          error: errorData.details || 'Failed to upload PDF to Tekmetric'
        }
      }

      return {
        success: false,
        error: errorData.details || errorData.message || `Upload failed (HTTP ${response.status})`
      }
    }

    // Step 3: Processing response
    onProgress?.({
      step: 'updating',
      message: 'Updating task...',
      percent: 80
    })

    const result = await response.json()

    if (!result.success) {
      return {
        success: false,
        error: result.message || result.error || 'Upload failed'
      }
    }

    // Step 4: Complete
    onProgress?.({
      step: 'complete',
      message: 'Upload complete!',
      percent: 100
    })

    return {
      success: true,
      pdfUrl: result.pdfUrl
    }

  } catch (error) {
    console.error('Upload to TM failed:', error)

    onProgress?.({
      step: 'error',
      message: String(error),
      percent: 0
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    }
  }
}

/**
 * Update inspection task description only (without PDF)
 */
export async function updateTaskDescription(
  shopId: string,
  roId: number,
  inspectionId: number,
  taskId: number,
  description: string
): Promise<ApiResponse<void>> {
  try {
    const response = await fetch(`${VIDEO_PROCESSOR_URL}/api/update-task-description`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        shopId,
        roId,
        inspectionId,
        taskId,
        description,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        error: errorData.details || errorData.message || `Update failed (HTTP ${response.status})`
      }
    }

    const result = await response.json()
    return {
      success: result.success,
      error: result.success ? undefined : result.message
    }

  } catch (error) {
    console.error('Update task description failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Update failed'
    }
  }
}

/**
 * Complete an inspection in Tekmetric
 */
export async function completeInspection(
  shopId: string,
  roId: number,
  inspectionId: number
): Promise<ApiResponse<void>> {
  try {
    const response = await fetch(`${VIDEO_PROCESSOR_URL}/api/complete-inspection`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        shopId,
        roId,
        inspectionId,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        error: errorData.details || errorData.message || `Complete failed (HTTP ${response.status})`
      }
    }

    const result = await response.json()
    return {
      success: result.success,
      error: result.success ? undefined : result.message
    }

  } catch (error) {
    console.error('Complete inspection failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Complete failed'
    }
  }
}
