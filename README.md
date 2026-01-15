# ShopVisualsDiag

Visual diagnostic report builder for automotive repair shops. Creates professional PDF reports with photos, annotations, and scan reports, then uploads directly to Tekmetric.

## Features

- **RO Lookup** - Search repair orders by number
- **Photo Capture** - Take photos via mobile camera or upload from desktop
- **Photo Annotation** - Draw arrows, circles, and text to highlight issues
- **Scan Reports** - Upload OBD2, alignment, battery test PDFs
- **PDF Generation** - Auto-layout professional reports
- **TM Integration** - Upload PDF and findings directly to Tekmetric

## Production URL

https://web-production-97db.up.railway.app

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **PDF**: jspdf
- **Annotations**: Fabric.js
- **Auth**: Auth Hub (Supabase Edge Functions + Chrome Extension)
- **Backend**: ast-video-processor (Railway)
- **Deployment**: Railway

## Setup

### Prerequisites

1. Chrome extension installed for TM token capture
2. Logged into Tekmetric
3. Token synced via extension

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_AUTH_HUB_URL=https://wiorzvaptjwasczzahxm.supabase.co/functions/v1
NEXT_PUBLIC_AUTH_HUB_APP_KEY=your-app-key
NEXT_PUBLIC_VIDEO_PROCESSOR_URL=https://ast-video-processor-production.up.railway.app
```

### Development

```bash
npm install
npm run dev
```

### Build

```bash
npm run build
npm start
```

## Usage

1. Open the app and verify "Connected" badge shows green
2. Enter an RO number to find the repair order
3. Select an inspection task
4. Capture photos (camera or upload)
5. Add annotations to highlight issues
6. Upload scan reports (optional)
7. Enter technician findings
8. Generate PDF preview
9. Upload to Tekmetric

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |

## Deployment

Deployed to Railway with auto-deploy on push to `main`.

### Railway Configuration

See `railway.toml` for deployment settings.

### Environment Variables (Railway)

Set these in Railway dashboard:
- `NEXT_PUBLIC_AUTH_HUB_URL`
- `NEXT_PUBLIC_AUTH_HUB_APP_KEY`
- `NEXT_PUBLIC_VIDEO_PROCESSOR_URL`

## Troubleshooting

### "Tekmetric Connection Required"

1. Install TM Token Capture Chrome extension
2. Log into Tekmetric in another tab
3. Click extension icon to capture token
4. Refresh this app

### Photos not uploading

- Check file size (max 10MB per photo)
- Ensure network connection is stable
- Try reducing number of photos

### PDF generation fails

- Reduce number of photos (try < 20)
- Check browser console for errors
- Try desktop Chrome (most reliable)

## License

MIT
