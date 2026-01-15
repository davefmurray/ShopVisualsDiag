# Testing Guide

## Test Environment

- **Shop**: JJ Auto (Shop ID: 6212)
- **Production URL**: https://web-production-97db.up.railway.app
- **Video Processor**: https://ast-video-processor-production.up.railway.app

## Prerequisites

Before testing:

1. Install TM Token Capture Chrome extension
2. Log into Tekmetric with JJ Auto credentials
3. Click extension to sync token
4. Verify green "Connected" badge in app

## Test Scenarios

### 1. Happy Path (Full Flow)

**Goal**: Complete flow with all features

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open app | Green "Connected" badge |
| 2 | Enter valid RO number | Vehicle info displays |
| 3 | Select inspection task | Navigate to report builder |
| 4 | Take 3 photos | Photos appear in grid |
| 5 | Annotate 1 photo | Arrow/circle visible |
| 6 | Upload scan report | PDF thumbnail shows |
| 7 | Enter findings text | Text saves (auto-save) |
| 8 | Click "Generate PDF" | PDF preview opens |
| 9 | Click "Upload to TM" | Progress modal shows |
| 10 | Verify in TM | PDF attached to task |

### 2. Mobile Camera Flow

**Goal**: Test iPhone camera capture

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open app on iPhone Safari | App loads correctly |
| 2 | Enter RO, select task | Navigate to builder |
| 3 | Tap "Take Photo" | Camera opens |
| 4 | Capture photo | Photo appears in grid |
| 5 | Tap photo to view | Fullscreen preview |
| 6 | Tap "Add Annotations" | Canvas editor opens |
| 7 | Draw arrow | Arrow appears |
| 8 | Save | Returns to grid |
| 9 | Generate + upload | PDF in TM |

### 3. Desktop File Upload

**Goal**: Test drag-and-drop file upload

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open app on Chrome desktop | App loads |
| 2 | Enter RO, select task | Navigate to builder |
| 3 | Drag photos to drop zone | Files upload |
| 4 | Click photo | Fullscreen preview |
| 5 | Annotate | Canvas editor works |
| 6 | Upload scan PDF | Thumbnail shows |
| 7 | Generate + upload | PDF in TM |

### 4. Large Report

**Goal**: Test with many attachments

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Upload 10+ photos | All show in grid |
| 2 | Annotate 5 photos | Annotations save |
| 3 | Upload 3 scan PDFs | All show in preview |
| 4 | Enter long findings | Text saves |
| 5 | Generate PDF | Multi-page PDF |
| 6 | Upload to TM | Success |

### 5. Minimal Report

**Goal**: Test with minimal content

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Enter RO, select task | Navigate |
| 2 | Take 1 photo (no annotation) | Photo shows |
| 3 | Enter brief findings | Text saves |
| 4 | Generate PDF | Single page PDF |
| 5 | Upload to TM | Success |

### 6. Error Recovery

**Goal**: Test error handling

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Disconnect network mid-upload | Error modal shows |
| 2 | Reconnect network | Can retry |
| 3 | Click retry | Upload resumes |
| 4 | Enter invalid RO | Error message |
| 5 | Clear and retry | Lookup works |

## Browser Compatibility

| Browser | Status | Notes |
|---------|--------|-------|
| Chrome Desktop | Primary | Full support |
| Safari iOS | Primary | Camera + touch |
| Chrome Mobile | Supported | Full support |
| Firefox | Supported | May need testing |
| Edge | Supported | Should work |

## Known Limitations

1. **Max photo size**: ~10MB per photo
2. **Recommended photos**: < 20 per report
3. **Scan formats**: PDF, PNG, JPG
4. **Auth**: Requires Chrome extension

## Verification Checklist

After each test scenario:

- [ ] PDF appears in TM inspection task
- [ ] Description field updated in TM
- [ ] Photos are clear in PDF
- [ ] Annotations visible in PDF
- [ ] Scan reports embedded correctly
- [ ] Findings text matches input

## Reporting Issues

If a test fails:

1. Note the step where failure occurred
2. Check browser console for errors
3. Check network tab for failed requests
4. Screenshot the error state
5. Create GitHub issue with details
