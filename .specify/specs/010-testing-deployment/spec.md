# Spec 010: Testing & Deployment

## Summary
Complete end-to-end testing with JJ Auto shop and deploy the application to Railway for production use.

## GitHub Issue
`[SPEC-010] Testing & Production Deployment`

---

## Requirements

### 1. End-to-End Testing
Test complete flow with Shop 6212 (JJ Auto):
- Token capture via Chrome extension
- RO lookup with real RO numbers
- Photo capture on mobile device
- Scan report upload
- Photo annotation
- PDF generation
- Upload to TM
- Verify in TM admin

### 2. Test Scenarios
| Scenario | Description |
|----------|-------------|
| Happy path | Full flow with all features |
| Mobile only | iPhone camera capture to upload |
| Desktop only | File upload with annotations |
| Large report | 10+ photos, multiple scans |
| Minimal report | Single photo, no scans |
| Error recovery | Network failure mid-upload |

### 3. Railway Deployment
Create deployment configuration:
- `railway.toml` with build settings
- Environment variables in Railway
- Health check endpoint
- Domain configuration

### 4. Environment Setup
Production environment variables:
```
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_AUTH_HUB_URL=https://wiorzvaptjwasczzahxm.supabase.co/functions/v1
NEXT_PUBLIC_AUTH_HUB_APP_KEY=...
NEXT_PUBLIC_VIDEO_PROCESSOR_URL=https://ast-video-processor-production.up.railway.app
```

### 5. Documentation
- Update README with:
  - Production URL
  - Setup instructions
  - Usage guide
- Document known limitations
- Create troubleshooting guide

### 6. Monitoring (Optional)
- Error tracking (Sentry or similar)
- Usage analytics
- Performance monitoring

---

## Acceptance Criteria

- [ ] Full flow tested with JJ Auto (shop 6212)
- [ ] Mobile flow works on iPhone
- [ ] Desktop flow works on Chrome
- [ ] PDF appears in TM after upload
- [ ] Description field updates in TM
- [ ] Railway deployment successful
- [ ] Production URL accessible
- [ ] Environment variables configured
- [ ] README updated with prod info
- [ ] No critical bugs in production

---

## Technical Notes

### Railway Configuration
```toml
# railway.toml
[build]
builder = "nixpacks"

[deploy]
healthcheckPath = "/api/health"
healthcheckTimeout = 300
restartPolicyType = "on_failure"
restartPolicyMaxRetries = 10
```

### Health Check Endpoint
Create `src/app/api/health/route.ts`:
```typescript
export async function GET() {
  return Response.json({ status: 'ok', version: '1.0.0' })
}
```

### Testing Checklist
Before deploying:
- [ ] All specs pass acceptance criteria
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] Build completes successfully
- [ ] Local testing complete
- [ ] Mobile testing complete

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `railway.toml` | Create/Update |
| `src/app/api/health/route.ts` | Create |
| `README.md` | Update |
| `.env.production.example` | Create |
| `TESTING.md` | Create (test scenarios) |
