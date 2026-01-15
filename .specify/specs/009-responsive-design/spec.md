# Spec 009: Responsive Design

## Summary
Ensure the application works seamlessly on both mobile devices (iPhone/iPad) and desktop browsers with appropriate layouts and interactions for each.

## GitHub Issue
`[SPEC-009] Responsive Design - Mobile & Desktop`

---

## Requirements

### 1. Mobile Layout (< 768px)
- Single column layout
- Full-width components
- Large touch targets (min 44px)
- Bottom-anchored action buttons
- Collapsible sections to save space
- Camera capture optimized for mobile

### 2. Desktop Layout (>= 768px)
- Two-column layout where appropriate
- Side panel for tool options
- Hover states for buttons
- Keyboard shortcuts (optional)
- Larger preview areas

### 3. Tablet Layout (768px - 1024px)
- Hybrid approach
- May use two columns
- Touch-friendly but more space

### 4. Touch Interactions
- Swipe to delete photos
- Pinch to zoom on previews
- Long press for context menu (optional)
- Pull to refresh (if applicable)

### 5. iOS Safari Fixes
Address common iOS issues:
- 100vh viewport issue
- Safe area insets (notch)
- Keyboard pushing content
- Rubber-band scrolling in modals

### 6. Loading States
- Skeleton loaders for content
- Spinners for actions
- Disabled states during operations
- Optimistic UI updates

### 7. Error Boundaries
- Graceful error handling
- User-friendly error messages
- Recovery options
- Error reporting (optional)

---

## Acceptance Criteria

- [ ] App loads correctly on iPhone Safari
- [ ] App loads correctly on iPad Safari
- [ ] App loads correctly on Chrome desktop
- [ ] Camera capture works on iPhone
- [ ] File upload works on desktop
- [ ] Touch targets are min 44px on mobile
- [ ] No horizontal scroll on any screen size
- [ ] Keyboard doesn't break layout on mobile
- [ ] Notch/safe area handled on iPhone X+
- [ ] Loading states show during operations
- [ ] Errors display with recovery options

---

## Technical Notes

### Tailwind Responsive Prefixes
```css
/* Mobile first */
.class        /* < 640px */
sm:class      /* >= 640px */
md:class      /* >= 768px */
lg:class      /* >= 1024px */
xl:class      /* >= 1280px */
```

### iOS Viewport Fix
```css
/* In globals.css */
html {
  height: -webkit-fill-available;
}
body {
  min-height: 100vh;
  min-height: -webkit-fill-available;
}
```

### Safe Area Insets
```css
padding-bottom: env(safe-area-inset-bottom);
padding-top: env(safe-area-inset-top);
```

### Touch Target Size
```css
.touch-target {
  min-height: 44px;
  min-width: 44px;
}
```

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/app/globals.css` | Update (iOS fixes) |
| `src/components/*.tsx` | Update (responsive classes) |
| `src/components/LoadingSpinner.tsx` | Create |
| `src/components/ErrorBoundary.tsx` | Create |
| `src/components/Skeleton.tsx` | Create |
| `tailwind.config.js` | Update (custom breakpoints if needed) |
