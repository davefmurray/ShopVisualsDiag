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
  fullImagePage: {
    padding: 20,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
    fontSize: 10,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
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
  fullPageImageContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  fullPageImage: {
    objectFit: 'contain',
    maxWidth: '100%',
    maxHeight: '100%',
  },
  imageCaption: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
  },
  imageSectionHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 10,
    textAlign: 'center',
  },
  scanReportHeader: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 5,
  },
  scanReportPage: {
    fontSize: 9,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 10,
  },
  findings: {
    fontSize: 11,
    lineHeight: 1.6,
    color: '#374151',
  },
  footer: {
    position: 'absolute',
    bottom: 15,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 8,
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
  width: number
  height: number
  isLandscape: boolean
}

interface ScanReportItem {
  id: string
  name: string
  category: string
  dataUrl: string
  width: number
  height: number
  isLandscape: boolean
  pageNumber?: number
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

  // Group scan reports by source PDF (for page numbering display)
  const getScanReportLabel = (scan: ScanReportItem) => {
    if (scan.pageNumber) {
      return `${scan.name} - Page ${scan.pageNumber}`
    }
    return scan.name
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

        {/* Summary of attachments */}
        {(photos.length > 0 || scanReports.length > 0) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Attachments</Text>
            {photos.length > 0 && (
              <Text style={styles.infoValue}>
                • {photos.length} Inspection Photo{photos.length > 1 ? 's' : ''}
              </Text>
            )}
            {scanReports.length > 0 && (
              <Text style={styles.infoValue}>
                • {scanReports.length} Scan Report Page{scanReports.length > 1 ? 's' : ''}
              </Text>
            )}
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

      {/* Each Photo on its own page - auto-oriented */}
      {photos.map((photo, index) => (
        <Page
          key={`photo-${photo.id}`}
          size="A4"
          orientation={photo.isLandscape ? 'landscape' : 'portrait'}
          style={styles.fullImagePage}
        >
          <Text style={styles.imageSectionHeader}>
            Inspection Photo {index + 1} of {photos.length}
          </Text>

          <View style={styles.fullPageImageContainer}>
            <Image src={photo.dataUrl} style={styles.fullPageImage} />
          </View>

          {photo.caption && (
            <Text style={styles.imageCaption}>{photo.caption}</Text>
          )}

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

      {/* Each Scan Report page on its own page - auto-oriented */}
      {scanReports.map((scan, index) => (
        <Page
          key={`scan-${scan.id}`}
          size="A4"
          orientation={scan.isLandscape ? 'landscape' : 'portrait'}
          style={styles.fullImagePage}
        >
          <Text style={styles.scanReportHeader}>
            {scan.category.toUpperCase()}
          </Text>
          <Text style={styles.scanReportPage}>
            {getScanReportLabel(scan)}
          </Text>

          <View style={styles.fullPageImageContainer}>
            <Image src={scan.dataUrl} style={styles.fullPageImage} />
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
    </Document>
  )
}
