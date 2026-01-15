# Spec 001: Project Foundation

## Summary
Initialize the ShopVisualsDiag project with Next.js 14, TypeScript, and Tailwind CSS. Set up Auth Hub integration for Tekmetric authentication.

## GitHub Issue
`[SPEC-001] Project Foundation - Next.js Setup & Auth Integration`

---

## Requirements

### 1. Project Initialization
- Initialize Next.js 14 project with App Router
- Configure TypeScript in strict mode
- Set up Tailwind CSS
- Configure ESLint and Prettier
- Create basic folder structure per constitution

### 2. Environment Configuration
Create `.env.local.example` with required variables:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_AUTH_HUB_URL=
NEXT_PUBLIC_AUTH_HUB_APP_KEY=
NEXT_PUBLIC_VIDEO_PROCESSOR_URL=
```

### 3. Auth Hub Integration
- Copy auth patterns from ShopVisuals mobile app
- Create `src/utils/api.ts` with:
  - `checkTokenStatus(shopId)` - verify token exists
  - `getInspections(shopId, roNumber)` - fetch RO inspections
- Display token status badge (green/yellow/red)

### 4. Basic Layout
- Create `src/app/layout.tsx` with:
  - App title: "ShopVisualsDiag"
  - Viewport meta for mobile
  - Tailwind imports
- Create `src/app/page.tsx` with:
  - Header with app name and version
  - Token status indicator
  - Placeholder for RO lookup (Spec 002)

### 5. Project Files
- Update `README.md` with project description
- Ensure `CLAUDE.md` and `AGENTS.md` point to constitution
- Create `railway.toml` for deployment config

---

## Acceptance Criteria

- [ ] `npm run dev` starts server on localhost:3000
- [ ] `npm run build` completes without errors
- [ ] TypeScript strict mode enabled (`tsconfig.json`)
- [ ] Tailwind CSS working (test with a colored div)
- [ ] Auth Hub token check returns status for shop 6212
- [ ] Token badge displays green when token valid
- [ ] Environment variables documented in `.env.local.example`
- [ ] Project structure matches constitution spec

---

## Technical Notes

### Auth Hub Endpoints (Reference)
```
GET /token/:shopId - Get JWT token (requires x-app-key)
GET /verify/:shopId - Verify token validity
GET /get-inspections - Fetch RO inspections
```

### Reference Implementation
See `/Users/dfm/Documents/GitHub/tm-mobile-app-main/src/utils/api.ts`

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `package.json` | Create (npx create-next-app) |
| `tsconfig.json` | Configure strict mode |
| `tailwind.config.js` | Configure |
| `.env.local.example` | Create |
| `src/app/layout.tsx` | Create |
| `src/app/page.tsx` | Create |
| `src/utils/api.ts` | Create |
| `README.md` | Update |
| `railway.toml` | Create |
