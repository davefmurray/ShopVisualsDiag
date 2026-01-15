# Spec 007: Findings Text Editor

## Summary
Implement a text editor for technicians to enter their inspection findings. This text is pushed to the Tekmetric task description field and included in the PDF report.

## GitHub Issue
`[SPEC-007] Findings Text Entry`

---

## Requirements

### 1. Findings Editor Component
Create `src/components/FindingsEditor.tsx`:
- Multi-line text area
- Placeholder text: "Describe the issue and recommended action..."
- Character counter (TM may have limits)
- Auto-save to local state (debounced)
- Clear button

### 2. Editor Features
- Resize handle (desktop)
- Minimum height: 4 lines
- Maximum height: 12 lines (then scroll)
- Mobile-friendly keyboard handling
- Prevent accidental navigation away with unsaved text

### 3. Text Formatting (Optional)
- Basic formatting could help but keep simple for MVP
- Maybe just bullet points (• character)
- No rich text editor needed initially

### 4. State Management
Integrate with report state:
```typescript
interface ReportState {
  photos: CapturedPhoto[]
  scans: ScanReport[]
  findings: string
  // ...
}
```

### 5. Auto-Save
- Save to localStorage as backup
- Debounce saves (500ms)
- Restore on page reload
- Clear saved data after successful upload

---

## Acceptance Criteria

- [ ] Text area accepts multi-line input
- [ ] Character count displays
- [ ] Text persists in state between component renders
- [ ] Auto-saves to localStorage
- [ ] Restores text if page reloaded
- [ ] Mobile keyboard doesn't cause layout issues
- [ ] Can clear text with button
- [ ] Text included in PDF preview
- [ ] Text ready for TM description push (Spec 008)

---

## Technical Notes

### Character Limits
- Check if TM has description field limit
- Display warning if approaching limit
- Typical: 2000-5000 characters

### Mobile Keyboard Handling
```css
/* Prevent viewport resize on iOS */
body {
  position: fixed;
  width: 100%;
}
```

Or use proper viewport meta tags.

### LocalStorage Key
```typescript
const STORAGE_KEY = `shopvisuals-diag-findings-${taskId}`
```

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/components/FindingsEditor.tsx` | Create |
| `src/hooks/useAutoSave.ts` | Create |
| `src/app/report/[taskId]/page.tsx` | Update (add editor) |
