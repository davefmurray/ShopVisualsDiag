# ShopVisualsDiag Constitution

> Hi-res inspection report generator for Tekmetric - capture photos, upload scan reports, compile PDFs, push to TM.

## Version
1.0.0

---

## Context Detection

**AI Agent: Read this section first to understand your context.**

You are reading this constitution in one of two contexts:

### Context A: Ralph Loop (Implementation Mode)
You are in a Ralph loop if:
- You were started by `ralph-loop.sh` or `ralph-loop-codex.sh`
- Your prompt mentions "implement spec" or "work through all specs/issues"
- You see `<promise>` completion signals in your instructions

**In this context**: Focus on implementation. Follow the spec. Complete the acceptance criteria. Output `<promise>DONE</promise>` when finished.

### Context B: Interactive Chat (Discussion Mode)
You are in interactive chat if:
- The user is asking questions, discussing ideas, or seeking guidance
- You're helping set up the project or create specs
- No Ralph loop was started

**In this context**: Be helpful and conversational. Guide the user. Create specs with `/speckit.specify`. Explain how to start the Ralph loop when ready.

---

## Core Principles

### I. Simplicity (YAGNI)
Build exactly what's needed, nothing more. No premature abstractions.

### II. Quality First
Test everything. Verify visually. Only mark done when truly complete.

### III. Spec-Driven Development
Every feature starts as a specification with clear acceptance criteria.

### IV. Iteration
If something fails, fix it and retry. Keep iterating until done.

### V. Reuse Existing Infrastructure
Leverage ShopVisuals Auth Hub and patterns - don't reinvent the wheel.

---

## Autonomy Configuration

### YOLO Mode: ENABLED
You have FULL permission to read, write, and execute without asking.

### Git Autonomy: ENABLED
Commit and push without asking. Use meaningful commit messages.

---

## Technical Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS |
| PDF Generation | @react-pdf/renderer or pdfmake |
| Image Annotation | Fabric.js |
| Auth | Existing Auth Hub (wiorzvaptjwasczzahxm) |
| Backend | Extend ast-video-processor or new Railway service |
| Database | Supabase (if needed for report storage) |
| Deployment | Railway |

---

## Related Projects

| Project | Path | Purpose |
|---------|------|---------|
| ShopVisuals Docs | `/Users/dfm/Documents/GitHub/ShopVisuals` | Reference architecture |
| Auth Hub | `/Users/dfm/Documents/GitHub/tekmetric-auth-hub` | TM token management |
| Video Processor | `/Users/dfm/Documents/GitHub/ast-video-processor` | Backend (may extend) |
| Mobile App | `/Users/dfm/Documents/GitHub/tm-mobile-app-main` | Reference UI patterns |

---

## Work Item Source: GitHub Issues

### Using GitHub Issues
- Work items are GitHub Issues in this repository
- Each issue corresponds to a spec in `.specify/specs/`
- Issues should have clear acceptance criteria
- Close issues when spec is complete

### Spec Location
- Specs live in: `.specify/specs/NNN-feature-name/spec.md`
- Each spec has acceptance criteria / completion checklist

---

## Ralph Loop Scripts

Both scripts are in the `scripts/` folder:

### For Claude Code
```bash
./scripts/ralph-loop.sh
```

### Running the Loop

**Work through all items:**
```bash
./scripts/ralph-loop.sh --all
```

**Run a single spec:**
```bash
./scripts/ralph-loop.sh --spec 001-project-foundation
```

**Run a single GitHub issue:**
```bash
./scripts/ralph-loop.sh --issue 1
```

---

## Tekmetric Integration

### Authentication
- Reuse Auth Hub Chrome extension for token capture
- API calls via `x-app-key` header to Auth Hub
- TM API uses `x-auth-token` header (NOT Bearer)

### Target Fields
- **PDF Report** → Task document/media field
- **Text Findings** → Task description field
- **Individual Media** → Task media array (optional)

### Test Shop
- Shop ID: 6212 (JJ AUTO - SERVICE & TIRES)
- Admin URL: https://shop.tekmetric.com/admin/dashboard

---

## Deployment

| Environment | URL | Platform |
|-------------|-----|----------|
| Production | TBD | Railway |
| Development | http://localhost:3000 | Local |

---

## The Magic Word

When the user says **"Ralph, start working"**, tell them:

> Ready to start the Ralph loop! Run this in your terminal:
>
> **For Claude Code:**
> ```bash
> ./scripts/ralph-loop.sh --all
> ```

---

## Completion Signals

Every work item (spec or issue) must have acceptance criteria.

When working on an item:
1. Implement the requirements
2. Verify ALL acceptance criteria pass
3. Run tests, check visually, verify no errors
4. Output `<promise>DONE</promise>` for that item
5. The outer loop will proceed to the next item

When ALL items are complete:
- Output `<promise>ALL_DONE</promise>`

---

**Version**: 1.0.0 | **Created**: 2026-01-15
