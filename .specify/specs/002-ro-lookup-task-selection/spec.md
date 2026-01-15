# Spec 002: RO Lookup & Task Selection

## Summary
Create the RO lookup interface and inspection task selection UI. Users enter an RO number to fetch inspections from Tekmetric and select a task to create a diagnostic report.

## GitHub Issue
`[SPEC-002] RO Lookup & Inspection Task Selection UI`

---

## Requirements

### 1. RO Lookup Component
Create `src/components/ROLookup.tsx`:
- Input field for RO number
- "Find" button to trigger search
- Loading state during API call
- Error display for failed lookups
- Success: display RO details (customer name, vehicle)

### 2. API Integration
Extend `src/utils/api.ts`:
- `getInspections(shopId, roNumber)` - returns RO + inspection tasks
- Handle errors: RO not found, token expired, network issues
- Return structured data:
  ```typescript
  interface ROData {
    roId: number
    roNumber: string
    customer: { name: string }
    vehicle: { year: number, make: string, model: string, vin: string }
    inspections: Inspection[]
  }
  ```

### 3. Inspection Task List
Create `src/components/InspectionTaskList.tsx`:
- Display inspection tasks grouped by category
- Each task shows:
  - Task name
  - Current rating (if any)
  - Existing media count
  - "Create Report" button
- Collapsible groups (like ShopVisuals)

### 4. Task Selection Flow
When user clicks "Create Report" on a task:
- Navigate to `/report/[taskId]` (to be implemented in Spec 006)
- Pass task context via URL params or state

### 5. Page Integration
Update `src/app/page.tsx`:
- Add ROLookup component
- Show InspectionTaskList when RO data loaded
- Handle empty states

---

## Acceptance Criteria

- [ ] Enter RO number → click Find → fetches inspection data
- [ ] RO details display (customer name, vehicle info)
- [ ] Inspection tasks display in grouped list
- [ ] Groups are collapsible
- [ ] Each task shows name, rating status, media count
- [ ] "Create Report" button visible on each task
- [ ] Error messages display for: RO not found, token expired
- [ ] Loading spinner shows during API call
- [ ] Works on mobile (responsive input)

---

## Technical Notes

### Tekmetric API Flow
1. Search RO: `GET /api/shop/{shopId}/repair-orders?search={roNumber}`
2. Get inspections: `GET /api/shop/{shopId}/repair-orders/{roId}/inspections`

### Task Structure (handle both)
```typescript
// Flat structure
inspection.tasks[]

// Nested structure
inspection.inspectionTasks[].tasks[]
```

### Reference Implementation
See `/Users/dfm/Documents/GitHub/tm-mobile-app-main/src/app/page.tsx` lines 200-400

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/components/ROLookup.tsx` | Create |
| `src/components/InspectionTaskList.tsx` | Create |
| `src/utils/api.ts` | Extend |
| `src/types/index.ts` | Create (TypeScript interfaces) |
| `src/app/page.tsx` | Update |
