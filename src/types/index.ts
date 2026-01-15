// Tekmetric Types

export interface TokenStatus {
  hasToken: boolean
  shopId?: string
  shopName?: string
  expiresAt?: string
  error?: string
}

export interface Shop {
  id: number
  name: string
}

export interface Vehicle {
  id: number
  year: number
  make: string
  model: string
  vin?: string
  licensePlate?: string
}

export interface Customer {
  id: number
  firstName: string
  lastName: string
  email?: string
  phone?: string
}

export interface RepairOrder {
  id: number
  repairOrderNumber: number
  shopId: number
  vehicleId: number
  customerId: number
  vehicle: Vehicle
  customer: Customer
  status: string
  createdAt: string
  updatedAt: string
}

export interface InspectionTask {
  id: number
  inspectionId: number
  name: string
  description?: string
  condition: 'OK' | 'NEEDS_ATTENTION' | 'URGENT' | null
  notes?: string
  mediaPath?: string
  media?: MediaItem[]
}

export interface Inspection {
  id: number
  repairOrderId: number
  shopId: number
  name: string
  status: string
  tasks: InspectionTask[]
  createdAt: string
  updatedAt: string
}

export interface MediaItem {
  id: number
  type: 'image' | 'video' | 'pdf'
  url: string
  thumbnailUrl?: string
}

// Report Types

export interface ReportPhoto {
  id: string
  file: File
  dataUrl: string
  annotations?: AnnotationData[]
  caption?: string
}

// Fabric.js serialized annotation data
export interface AnnotationData {
  objects: object[]  // Fabric.js serialized objects
  version: string
  canvasWidth: number
  canvasHeight: number
}

// Legacy single annotation (kept for compatibility)
export interface SingleAnnotation {
  type: 'arrow' | 'circle' | 'rectangle' | 'text'
  color: string
  points: number[]
  text?: string
}

// Annotation tool types
export type AnnotationTool = 'select' | 'arrow' | 'circle' | 'rectangle' | 'text' | 'freehand'
export type AnnotationColor = '#EF4444' | '#F59E0B' | '#3B82F6' // red, yellow, blue
export type LineThickness = 2 | 4 | 6 // thin, medium, thick

export interface ScanReport {
  id: string
  file: File
  type: 'obd2' | 'alignment' | 'battery' | 'electrical' | 'other'
  name: string
  previewUrl?: string
}

export interface DiagnosticReport {
  id: string
  shopId: string
  roId: number
  inspectionId: number
  taskId: number
  vehicle: Vehicle
  customer: Customer
  photos: ReportPhoto[]
  scanReports: ScanReport[]
  findings: string
  createdAt: string
}

// API Response Types

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface PresignedUrlResponse {
  url: string
  fields: Record<string, string>
  path: string
}
