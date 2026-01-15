# Spec 005: Photo Annotation Tools

## Summary
Implement canvas-based photo annotation tools allowing technicians to draw arrows, circles, rectangles, and text callouts on captured photos to highlight issues.

## GitHub Issue
`[SPEC-005] Photo Annotation - Canvas Editor`

---

## Requirements

### 1. Annotation Editor Component
Create `src/components/Annotator.tsx`:
- Full-screen or modal canvas editor
- Load photo as background
- Drawing tools overlay
- Save/cancel buttons
- Responsive to screen size

### 2. Drawing Tools
Implement these annotation tools:
- **Arrow**: Draw directional arrows pointing to issues
- **Circle**: Draw circles/ellipses around problem areas
- **Rectangle**: Draw boxes around areas
- **Text**: Add text labels/callouts
- **Freehand**: Simple pen/marker tool (optional)

### 3. Tool Properties
- **Color picker**: Red (urgent), Yellow (attention), Blue (info)
- **Line thickness**: Thin, Medium, Thick
- **Text size**: Small, Medium, Large

### 4. Edit Capabilities
- Select existing annotations
- Move annotations
- Resize annotations
- Delete individual annotations
- Undo/redo (maintain history stack)
- Clear all annotations

### 5. Canvas Library Integration
Use Fabric.js for canvas manipulation:
- Object-based drawing
- Built-in selection and transformation
- Serialization for saving state
- Good mobile touch support

### 6. Save Annotations
- Export annotated image as PNG/JPEG
- Store annotation data separately (for re-editing)
- Update photo in capture state with annotations

---

## Acceptance Criteria

- [ ] Open photo in annotation editor
- [ ] Draw arrows pointing to issues
- [ ] Draw circles around problem areas
- [ ] Draw rectangles/boxes
- [ ] Add text labels
- [ ] Change annotation color (red/yellow/blue)
- [ ] Change line thickness
- [ ] Select and move existing annotations
- [ ] Delete individual annotations
- [ ] Undo last action
- [ ] Redo undone action
- [ ] Save annotated photo
- [ ] Cancel without saving changes
- [ ] Works with touch on mobile
- [ ] Works with mouse on desktop

---

## Technical Notes

### Fabric.js Setup
```typescript
import { Canvas, Arrow, Circle, Rect, IText } from 'fabric'

const canvas = new Canvas('annotation-canvas', {
  selection: true,
  backgroundColor: 'transparent'
})
```

### Custom Arrow Object
Fabric.js doesn't have built-in arrows - need custom implementation:
- Line with triangle head
- Or use fabric.js arrow extension

### Annotation Data Structure
```typescript
interface AnnotationData {
  objects: fabric.Object[]  // Fabric.js serialized objects
  version: string
  canvasWidth: number
  canvasHeight: number
}
```

### Touch Handling
- Fabric.js supports touch
- May need gesture handling for pinch-zoom
- Consider disabling page scroll when editing

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/components/Annotator.tsx` | Create |
| `src/components/ToolPalette.tsx` | Create |
| `src/components/ColorPicker.tsx` | Create |
| `src/hooks/useAnnotationHistory.ts` | Create (undo/redo) |
| `src/utils/fabricHelpers.ts` | Create (custom objects) |
| `src/types/index.ts` | Extend (AnnotationData) |
| `package.json` | Add fabric dependency |
