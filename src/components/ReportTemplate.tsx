'use client'

import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from '@react-pdf/renderer'
import type { Vehicle, Customer } from '@/types'

// Register default fonts
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8LYS7T-nOnE1oeAUV3L_GjZ.woff2' },
  ],
})

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
    fontSize: 10,
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb',
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 4,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  infoItem: {
    width: '50%',
    marginBottom: 6,
  },
  infoLabel: {
    fontSize: 8,
    color: '#6b7280',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 11,
    color: '#111827',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  photoContainer: {
    marginBottom: 10,
  },
  photoFull: {
    width: '100%',
  },
  photoHalf: {
    width: '48%',
  },
  photo: {
    objectFit: 'contain',
    marginBottom: 4,
  },
  photoCaption: {
    fontSize: 9,
    color: '#6b7280',
    textAlign: 'center',
  },
  scanReport: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 4,
  },
  scanReportTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 4,
  },
  scanReportImage: {
    width: '100%',
    objectFit: 'contain',
    maxHeight: 400,
  },
  findings: {
    fontSize: 11,
    lineHeight: 1.6,
    color: '#374151',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 10,
    fontSize: 8,
    color: '#9ca3af',
  },
  pageNumber: {
    textAlign: 'center',
  },
  disclaimer: {
    maxWidth: '70%',
  },
})

interface PhotoItem {
  id: string
  dataUrl: string
  caption?: string
}

interface ScanReportItem {
  id: string
  name: string
  category: string
  dataUrl: string
}

interface ReportTemplateProps {
  vehicle?: Vehicle
  customer?: Customer
  roNumber?: string | number
  photos: PhotoItem[]
  scanReports: ScanReportItem[]
  findings: string
  reportDate?: Date
}

export default function ReportTemplate({
  vehicle,
  customer,
  roNumber,
  photos,
  scanReports,
  findings,
  reportDate = new Date(),
}: ReportTemplateProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // Calculate photo layout
  const getPhotoStyle = (index: number, total: number) => {
    if (total === 1) return styles.photoFull
    return styles.photoHalf
  }

  // Split photos into pages (max 4 per page)
  const photosPerPage = 4
  const photoPages: PhotoItem[][] = []
  for (let i = 0; i < photos.length; i += photosPerPage) {
    photoPages.push(photos.slice(i, i + photosPerPage))
  }

  return (
    <Document>
      {/* First Page - Header and Info */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Inspection Report</Text>
          <Text style={styles.headerSubtitle}>{formatDate(reportDate)}</Text>
        </View>

        {/* Vehicle Information */}
        {vehicle && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vehicle Information</Text>
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Year / Make / Model</Text>
                <Text style={styles.infoValue}>
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </Text>
              </View>
              {vehicle.vin && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>VIN</Text>
                  <Text style={styles.infoValue}>{vehicle.vin}</Text>
                </View>
              )}
              {vehicle.licensePlate && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>License Plate</Text>
                  <Text style={styles.infoValue}>{vehicle.licensePlate}</Text>
                </View>
              )}
              {roNumber && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>RO Number</Text>
                  <Text style={styles.infoValue}>{roNumber}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Customer Information */}
        {customer && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Customer</Text>
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Name</Text>
                <Text style={styles.infoValue}>
                  {customer.firstName} {customer.lastName}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Findings */}
        {findings && findings.trim() && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Technician Findings</Text>
            <Text style={styles.findings}>{findings}</Text>
          </View>
        )}

        {/* First set of photos (if we have any) */}
        {photoPages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Inspection Photos</Text>
            <View style={styles.photoGrid}>
              {photoPages[0].map((photo, index) => (
                <View
                  key={photo.id}
                  style={[
                    styles.photoContainer,
                    getPhotoStyle(index, photoPages[0].length),
                  ]}
                >
                  <Image src={photo.dataUrl} style={styles.photo} />
                  {photo.caption && (
                    <Text style={styles.photoCaption}>{photo.caption}</Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.disclaimer}>
            This report is provided for informational purposes only.
          </Text>
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>

      {/* Additional Photo Pages */}
      {photoPages.slice(1).map((pagePhotos, pageIndex) => (
        <Page key={`photo-page-${pageIndex}`} size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Inspection Photos (continued)
            </Text>
            <View style={styles.photoGrid}>
              {pagePhotos.map((photo, index) => (
                <View
                  key={photo.id}
                  style={[
                    styles.photoContainer,
                    getPhotoStyle(index, pagePhotos.length),
                  ]}
                >
                  <Image src={photo.dataUrl} style={styles.photo} />
                  {photo.caption && (
                    <Text style={styles.photoCaption}>{photo.caption}</Text>
                  )}
                </View>
              ))}
            </View>
          </View>

          <View style={styles.footer} fixed>
            <Text style={styles.disclaimer}>
              This report is provided for informational purposes only.
            </Text>
            <Text
              style={styles.pageNumber}
              render={({ pageNumber, totalPages }) =>
                `Page ${pageNumber} of ${totalPages}`
              }
            />
          </View>
        </Page>
      ))}

      {/* Scan Reports Pages */}
      {scanReports.length > 0 && (
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Diagnostic Scan Reports</Text>
            {scanReports.map((scan) => (
              <View key={scan.id} style={styles.scanReport}>
                <Text style={styles.scanReportTitle}>
                  {scan.name} ({scan.category.toUpperCase()})
                </Text>
                <Image src={scan.dataUrl} style={styles.scanReportImage} />
              </View>
            ))}
          </View>

          <View style={styles.footer} fixed>
            <Text style={styles.disclaimer}>
              This report is provided for informational purposes only.
            </Text>
            <Text
              style={styles.pageNumber}
              render={({ pageNumber, totalPages }) =>
                `Page ${pageNumber} of ${totalPages}`
              }
            />
          </View>
        </Page>
      )}
    </Document>
  )
}
