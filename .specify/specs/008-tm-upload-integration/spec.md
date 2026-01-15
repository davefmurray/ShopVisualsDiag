# Spec 008: TM Upload Integration

## Summary
Implement the Tekmetric upload functionality to push the generated PDF to the task document field and the findings text to the description field.

## GitHub Issue
`[SPEC-008] Tekmetric Upload - PDF & Media Push`

---

## Requirements

### 1. PDF Upload to TM
Upload generated PDF to inspection task:
- Get presigned S3 URL from TM
- Upload PDF to S3
- Update task with media path
- Handle success/failure

### 2. Description Update
Push findings text to task description:
- Use TM task update endpoint
- Preserve existing description or append
- Handle text length limits

### 3. Optional: Individual Media Upload
Allow uploading photos/videos directly to task media:
- Separate from PDF
- Individual media items
- Same presigned URL flow

### 4. Upload Flow
Create `src/utils/tmUpload.ts`:
```typescript
interface UploadResult {
  success: boolean
  pdfUrl?: string
  error?: string
}

async function uploadReportToTM(
  shopId: string,
  roId: number,
  inspectionId: number,
  taskId: number,
  pdfBlob: Blob,
  findings: string
): Promise<UploadResult>
```

### 5. Upload Progress UI
Create `src/components/UploadProgress.tsx`:
- Show upload steps:
  1. Generating PDF...
  2. Getting upload URL...
  3. Uploading to TM...
  4. Updating task...
  5. Complete!
- Progress bar or spinner
- Error state with retry option

### 6. Success State
After successful upload:
- Show success message
- Option to view in TM (link)
- Option to create another report
- Clear local state

---

## Acceptance Criteria

- [ ] PDF uploads to TM task media/doc field
- [ ] Findings text updates task description
- [ ] Upload progress displays to user
- [ ] Success message shows on completion
- [ ] Error message shows on failure
- [ ] Retry option available on failure
- [ ] Can view uploaded PDF in TM
- [ ] Can verify description updated in TM
- [ ] Local state clears after success
- [ ] Works with shop 6212 test account

---

## Technical Notes

### TM Media Upload Flow (from ShopVisuals)
```typescript
// 1. Get presigned URL
POST /media/create-video-upload-url
Body: { shopId, roId, inspectionId, taskId, mediaType: 'pdf' }
Response: { data: [{ s3: { url, fields }, path }] }

// 2. Upload to S3
POST {s3.url}
FormData with s3.fields + file

// 3. Update task
PUT /api/shop/{shopId}/inspections/{inspectionId}/tasks/{taskId}
Body: { mediaPath: path, description: findings }
```

### Error Handling
- Token expired: Show re-auth message
- Upload failed: Retry with backoff
- TM API error: Show error details

### Reference Implementation
See `/Users/dfm/Documents/GitHub/ast-video-processor/routes/video.js` for S3 upload flow.

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/utils/tmUpload.ts` | Create |
| `src/components/UploadProgress.tsx` | Create |
| `src/components/UploadSuccess.tsx` | Create |
| `src/app/report/[taskId]/page.tsx` | Update (add upload) |
| `src/utils/api.ts` | Extend (TM endpoints) |
