import type {
  TokenStatus,
  RepairOrder,
  Inspection,
  ApiResponse
} from '@/types'

const AUTH_HUB_URL = process.env.NEXT_PUBLIC_AUTH_HUB_URL || 'https://wiorzvaptjwasczzahxm.supabase.co/functions/v1'
const AUTH_HUB_APP_KEY = process.env.NEXT_PUBLIC_AUTH_HUB_APP_KEY || ''

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
 * Proxy request to Tekmetric API via Auth Hub
 */
async function tmApiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${AUTH_HUB_URL}/tm-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-app-key': AUTH_HUB_APP_KEY,
      },
      body: JSON.stringify({
        endpoint,
        method: options.method || 'GET',
        body: options.body ? JSON.parse(options.body as string) : undefined,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return { success: false, error: `HTTP ${response.status}: ${errorText}` }
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error('TM API request failed:', error)
    return { success: false, error: String(error) }
  }
}

/**
 * Search for repair orders by RO number
 */
export async function searchRepairOrders(
  shopId: string,
  roNumber: string
): Promise<ApiResponse<RepairOrder[]>> {
  return tmApiRequest<RepairOrder[]>(
    `/api/shops/${shopId}/repair-orders?search=${roNumber}`
  )
}

/**
 * Get repair order by ID
 */
export async function getRepairOrder(
  shopId: string,
  roId: number
): Promise<ApiResponse<RepairOrder>> {
  return tmApiRequest<RepairOrder>(
    `/api/shops/${shopId}/repair-orders/${roId}`
  )
}

/**
 * Get inspections for a repair order
 */
export async function getInspections(
  shopId: string,
  roId: number
): Promise<ApiResponse<Inspection[]>> {
  return tmApiRequest<Inspection[]>(
    `/api/shops/${shopId}/repair-orders/${roId}/inspections`
  )
}

/**
 * Get a specific inspection with tasks
 */
export async function getInspection(
  shopId: string,
  inspectionId: number
): Promise<ApiResponse<Inspection>> {
  return tmApiRequest<Inspection>(
    `/api/shops/${shopId}/inspections/${inspectionId}`
  )
}

/**
 * Update inspection task with media and description
 */
export async function updateInspectionTask(
  shopId: string,
  inspectionId: number,
  taskId: number,
  updates: { mediaPath?: string; description?: string }
): Promise<ApiResponse<void>> {
  return tmApiRequest<void>(
    `/api/shops/${shopId}/inspections/${inspectionId}/tasks/${taskId}`,
    {
      method: 'PUT',
      body: JSON.stringify(updates),
    }
  )
}

/**
 * Get presigned URL for uploading media to TM
 */
export async function getUploadUrl(
  shopId: string,
  roId: number,
  inspectionId: number,
  taskId: number,
  mediaType: 'pdf' | 'image' | 'video'
): Promise<ApiResponse<{ s3: { url: string; fields: Record<string, string> }; path: string }>> {
  return tmApiRequest(
    `/media/create-video-upload-url`,
    {
      method: 'POST',
      body: JSON.stringify({
        shopId,
        roId,
        inspectionId,
        taskId,
        mediaType,
      }),
    }
  )
}
