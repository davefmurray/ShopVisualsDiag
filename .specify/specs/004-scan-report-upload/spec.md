# Spec 004: Scan Report Upload

## Summary
Implement upload functionality for diagnostic scan reports (OBD2 codes, alignment reports, battery tests, etc.). These documents are embedded into the final PDF report.

## GitHub Issue
`[SPEC-004] Scan Report Upload - Diagnostic Documents`

---

## Requirements

### 1. Scan Upload Component
Create `src/components/ScanUpload.tsx`:
- Drag-and-drop zone (distinct from photo upload)
- Click to browse files
- Accept: PDF, JPG, PNG
- Visual distinction from photo capture area
- Icon indicating "diagnostic reports"

### 2. Supported Report Types
Display as selectable categories:
- OBD2 / Code Scan Reports
- Wheel Alignment Reports
- Battery / Electrical Test Results
- Brake Inspection Reports
- Other Diagnostic Documents

### 3. Scan Document Preview
Create `src/components/ScanPreview.tsx`:
- PDF: Show first page thumbnail or PDF icon
- Images: Show thumbnail
- Display filename
- Display file size
- Category label
- Delete button

### 4. Scan State Management
Create `src/hooks/useScanReports.ts`:
- Store scan documents in local state
- Data structure:
  ```typescript
  interface ScanReport {
    id: string
    file: File
    type: 'pdf' | 'image'
    category: ScanCategory
    previewUrl: string
    filename: string
    fileSize: number
  }

  type ScanCategory =
    | 'obd2'
    | 'alignment'
    | 'battery'
    | 'brake'
    | 'other'
  ```
- Methods: addScan, removeScan, updateCategory

### 5. Category Selection
When uploading a scan:
- Show category selector modal/dropdown
- Allow user to categorize the document
- Category shown on preview card

---

## Acceptance Criteria

- [ ] Upload PDF scan reports via drag-drop
- [ ] Upload image scan reports via drag-drop
- [ ] Click to browse and select files
- [ ] PDF files show appropriate preview/icon
- [ ] Image files show thumbnail preview
- [ ] Category can be selected for each scan
- [ ] Multiple scans can be uploaded
- [ ] Scans can be deleted
- [ ] File name and size displayed
- [ ] Clear visual separation from photo capture
- [ ] Works on mobile and desktop

---

## Technical Notes

### PDF Preview
- Use `pdf.js` for thumbnail generation, or
- Show PDF icon with filename (simpler)

### File Size Limits
- Warn at 10MB
- Hard limit at 25MB (reasonable for scan PDFs)

### Integration with PDF Generator (Spec 006)
- Scans will be embedded in final PDF
- Images: placed inline
- PDFs: pages extracted and included

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/components/ScanUpload.tsx` | Create |
| `src/components/ScanPreview.tsx` | Create |
| `src/components/CategorySelector.tsx` | Create |
| `src/hooks/useScanReports.ts` | Create |
| `src/types/index.ts` | Extend (ScanReport, ScanCategory) |
