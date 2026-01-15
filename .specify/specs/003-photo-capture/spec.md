# Spec 003: Photo Capture System

## Summary
Implement photo capture functionality supporting both mobile camera capture and desktop file upload. Photos are stored locally until PDF generation.

## GitHub Issue
`[SPEC-003] Photo Capture - Camera & File Upload`

---

## Requirements

### 1. Camera Capture Component
Create `src/components/PhotoCapture.tsx`:
- Access device camera via `getUserMedia` API
- Capture button (large, touch-friendly)
- Preview captured photo
- Retake option
- Accept/confirm option
- Support rear camera on mobile (environment facing)

### 2. File Upload Component
Create `src/components/FileUpload.tsx`:
- Drag-and-drop zone
- Click to browse files
- Accept: JPG, PNG, HEIC
- Multiple file selection
- File size validation (warn > 10MB)

### 3. Photo Preview Grid
Create `src/components/PhotoGrid.tsx`:
- Display captured/uploaded photos in grid
- Thumbnail previews
- Click to view fullscreen
- Delete button on each photo
- Drag to reorder (optional, nice-to-have)
- Counter: "X photos captured"

### 4. Photo State Management
Create `src/hooks/usePhotoCapture.ts`:
- Store photos in local state (not uploaded yet)
- Photo data structure:
  ```typescript
  interface CapturedPhoto {
    id: string
    blob: Blob
    previewUrl: string
    timestamp: Date
    annotations?: AnnotationData  // Added in Spec 005
  }
  ```
- Methods: addPhoto, removePhoto, reorderPhotos, clearPhotos

### 5. Mobile Optimizations
- Large touch targets (min 44px)
- Fullscreen camera view
- Haptic feedback on capture (if supported)
- Handle orientation changes

---

## Acceptance Criteria

- [ ] Mobile: Camera opens and captures photo
- [ ] Mobile: Rear camera used by default
- [ ] Desktop: File upload via drag-drop works
- [ ] Desktop: File browser opens on click
- [ ] Multiple photos can be captured/uploaded
- [ ] Photos display in preview grid
- [ ] Photos can be deleted from grid
- [ ] Photo count displays correctly
- [ ] Large files (>10MB) show warning
- [ ] HEIC files from iPhone are handled
- [ ] Works on iPhone Safari
- [ ] Works on Chrome desktop

---

## Technical Notes

### Camera Access
```typescript
const stream = await navigator.mediaDevices.getUserMedia({
  video: { facingMode: 'environment' }  // Rear camera
})
```

### HEIC Handling
- iPhone may capture as HEIC
- Convert to JPEG before storing or rely on browser support
- Consider heic2any library if needed

### Reference
See ShopVisuals video capture patterns (different but similar UX)

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/components/PhotoCapture.tsx` | Create |
| `src/components/FileUpload.tsx` | Create |
| `src/components/PhotoGrid.tsx` | Create |
| `src/hooks/usePhotoCapture.ts` | Create |
| `src/types/index.ts` | Extend (CapturedPhoto type) |
