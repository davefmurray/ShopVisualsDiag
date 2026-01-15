# Spec 006: PDF Generation Engine

## Summary
Implement the PDF generation engine that compiles captured photos, annotations, scan reports, and findings into a professional inspection report document.

## GitHub Issue
`[SPEC-006] PDF Generation - Report Builder`

---

## Requirements

### 1. PDF Template Design
Create a professional report layout:
- **Header**: Shop name (generic), report date, vehicle info
- **Vehicle Section**: Year/Make/Model, VIN, Mileage, RO#
- **Customer Section**: Name (optional)
- **Issue Photos**: Annotated photos with captions
- **Scan Reports**: Embedded diagnostic documents
- **Findings**: Text summary from technician
- **Footer**: Page numbers, disclaimer

### 2. Auto-Layout Engine
Create `src/utils/pdfGenerator.ts`:
- Calculate pages based on content
- Smart photo placement (grid or full-width based on count)
- Automatic page breaks
- Consistent margins and spacing

### 3. Photo Layout Options
- 1 photo: Full width
- 2 photos: Side by side
- 3-4 photos: 2x2 grid
- 5+ photos: Multi-page with grids

### 4. PDF Preview Component
Create `src/components/PDFPreview.tsx`:
- Show PDF before generating/uploading
- Page navigation (if multi-page)
- Zoom controls
- Download button (local save)

### 5. Report Builder Page
Create `src/app/report/[taskId]/page.tsx`:
- Combine all capture components:
  - PhotoCapture (Spec 003)
  - ScanUpload (Spec 004)
  - Annotator access (Spec 005)
  - FindingsEditor (Spec 007)
- "Generate PDF" button
- Preview modal
- "Upload to TM" button (Spec 008)

### 6. PDF Generation Library
Options (choose one):
- `@react-pdf/renderer`: React-based, client-side
- `pdfmake`: JSON-driven, client-side
- `puppeteer` (server): HTML to PDF, server-side

**Recommendation**: Start with `@react-pdf/renderer` for client-side MVP.

---

## Acceptance Criteria

- [ ] Generate PDF from captured photos
- [ ] Photos display with annotations visible
- [ ] Scan reports embedded in PDF
- [ ] Vehicle info appears in header
- [ ] Findings text included in PDF
- [ ] Auto-layout adjusts to content amount
- [ ] Multi-page PDFs generate correctly
- [ ] PDF preview shows before upload
- [ ] PDF can be downloaded locally
- [ ] Generated PDF is < 10MB for typical reports
- [ ] Works on mobile browsers
- [ ] Works on desktop browsers

---

## Technical Notes

### @react-pdf/renderer Example
```typescript
import { Document, Page, Image, Text, View } from '@react-pdf/renderer'

const InspectionReport = ({ photos, findings, vehicle }) => (
  <Document>
    <Page size="A4">
      <View style={styles.header}>
        <Text>Inspection Report</Text>
      </View>
      {photos.map(photo => (
        <Image src={photo.annotatedUrl} />
      ))}
      <Text>{findings}</Text>
    </Page>
  </Document>
)
```

### Image Optimization
- Resize images before embedding (max 1200px width)
- Compress to JPEG quality 80
- Keep PDF file size reasonable

### Scan PDF Embedding
- For PDF scan reports, may need to:
  - Extract pages as images, or
  - Use pdf-lib to merge PDFs

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/utils/pdfGenerator.ts` | Create |
| `src/components/PDFPreview.tsx` | Create |
| `src/components/ReportTemplate.tsx` | Create (PDF template) |
| `src/app/report/[taskId]/page.tsx` | Create |
| `src/utils/imageOptimizer.ts` | Create |
| `package.json` | Add @react-pdf/renderer |
