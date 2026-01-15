import type {
  TokenStatus,
  RepairOrder,
  Inspection,
  ApiResponse
} from '@/types'

const AUTH_HUB_URL = process.env.NEXT_PUBLIC_AUTH_HUB_URL || 'https://wiorzvaptjwasczzahxm.supabase.co/functions/v1'
const AUTH_HUB_APP_KEY = process.env.NEXT_PUBLIC_AUTH_HUB_APP_KEY || ''

// Video processor handles TM API calls because Railway IP can reach TM API
// (Supabase Edge Functions IP is blocked by Tekmetric)
const VIDEO_PROCESSOR_URL = process.env.NEXT_PUBLIC_VIDEO_PROCESSOR_URL || 'https://ast-video-processor-production.up.railway.app'

/**
 * Check token status from Auth Hub for a specific shop
 * Returns whether a valid TM token exists for the shop
 *
 * Note: Auth Hub stores tokens by shop ID. The Chrome extension captures
 * tokens when a user logs into TM for a specific shop.
 */
export async function checkTokenStatus(shopId: string = '6212'): Promise<TokenStatus> {
  try {
    const response = await fetch(`${AUTH_HUB_URL}/token/${encodeURIComponent(shopId)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-app-key': AUTH_HUB_APP_KEY,
      },
    })

    if (!response.ok) {
      return { hasToken: false, error: `HTTP ${response.status}` }
    }

    const data = await response.json()

    // Auth Hub returns: jwt_token, shop_name, token_is_valid, expires_at, shop_id
    if (data.jwt_token && data.token_is_valid) {
      return {
        hasToken: true,
        shopId: data.shop_id || shopId,
        shopName: data.shop_name,
        expiresAt: data.expires_at,
      }
    }

    return { hasToken: false, error: data.error || 'No valid token' }
  } catch (error) {
    console.error('Token status check failed:', error)
    return { hasToken: false, error: String(error) }
  }
}

/**
 * Get RO and inspections via video processor service
 * Routes through Railway because TM blocks Supabase Edge Functions IP
 */
export async function getROWithInspections(
  shopId: string,
  roNumber: string
): Promise<ApiResponse<{
  roId: number
  roNumber: number | string
  customer: string
  vehicle: string
  tasks: Array<{
    id: number
    name: string
    inspectionId: number
    inspectionName: string
    rating: string | null
    finding: string
    group: string
    groupSortOrder: number
    inspectionTaskId: number
    externalImages: string[]
  }>
}>> {
  try {
    const url = `${VIDEO_PROCESSOR_URL}/api/get-inspections?shopId=${encodeURIComponent(shopId)}&roNumber=${encodeURIComponent(roNumber)}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      if (errorData.error === 'RO_NOT_FOUND') {
        return { success: false, error: `RO ${roNumber} not found` }
      }
      if (errorData.error === 'NO_TOKEN') {
        return { success: false, error: 'No valid Tekmetric token' }
      }
      return { success: false, error: errorData.details || `HTTP ${response.status}` }
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error('Get inspections failed:', error)
    return { success: false, error: String(error) }
  }
}

/**
 * Search for repair orders by RO number (legacy - use getROWithInspections instead)
 */
export async function searchRepairOrders(
  shopId: string,
  roNumber: string
): Promise<ApiResponse<RepairOrder[]>> {
  // Delegate to getROWithInspections and wrap result
  const result = await getROWithInspections(shopId, roNumber)
  if (!result.success) {
    return { success: false, error: result.error }
  }
  // Convert to RepairOrder format for backward compatibility
  // Note: customer and vehicle are strings from video-processor API
  return {
    success: true,
    data: [{
      id: result.data!.roId,
      repairOrderNumber: Number(result.data!.roNumber),
      customerName: result.data!.customer,
      vehicleDescription: result.data!.vehicle,
    }] as unknown as RepairOrder[]
  }
}

/**
 * Get repair order by ID
 * TODO: Implement via video processor when needed
 */
export async function getRepairOrder(
  _shopId: string,
  _roId: number
): Promise<ApiResponse<RepairOrder>> {
  return { success: false, error: 'Not implemented - use getROWithInspections instead' }
}

/**
 * Get inspections for a repair order
 * TODO: Implement via video processor when needed
 */
export async function getInspections(
  _shopId: string,
  _roId: number
): Promise<ApiResponse<Inspection[]>> {
  return { success: false, error: 'Not implemented - use getROWithInspections instead' }
}

/**
 * Get a specific inspection with tasks
 * TODO: Implement via video processor when needed
 */
export async function getInspection(
  _shopId: string,
  _inspectionId: number
): Promise<ApiResponse<Inspection>> {
  return { success: false, error: 'Not implemented - use getROWithInspections instead' }
}

/**
 * Update inspection task with media and description
 * TODO: Implement via video processor when needed
 */
export async function updateInspectionTask(
  _shopId: string,
  _inspectionId: number,
  _taskId: number,
  _updates: { mediaPath?: string; description?: string }
): Promise<ApiResponse<void>> {
  return { success: false, error: 'Not implemented yet' }
}

/**
 * Get presigned URL for uploading media to TM
 * TODO: Implement via video processor when needed
 */
export async function getUploadUrl(
  _shopId: string,
  _roId: number,
  _inspectionId: number,
  _taskId: number,
  _mediaType: 'pdf' | 'image' | 'video'
): Promise<ApiResponse<{ s3: { url: string; fields: Record<string, string> }; path: string }>> {
  return { success: false, error: 'Not implemented yet' }
}
