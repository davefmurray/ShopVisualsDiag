# Agent Instructions: Ralph Wiggum

> Universal instructions for AI coding agents working on projects using Ralph Wiggum

## Quick Start

1. **Read the constitution first**: `.specify/memory/constitution.md`
2. **Check specs**: `specs/` — feature specifications to implement
3. **Use slash commands**: `/speckit.specify` and `/speckit.implement`

## Project Structure

| Path | Purpose |
|------|---------|
| `.specify/memory/constitution.md` | Core principles and constraints |
| `specs/NNN-feature-name/spec.md` | Feature specifications |
| `templates/spec-template.md` | Template for new specs |
| `.cursor/commands/` | Cursor slash commands |
| `.claude/commands/` | Claude Code commands |
| `codex-prompts/` | OpenAI Codex prompts |

## Core Principles

1. **Spec-Driven** — Always work from specifications
2. **Autonomous** — Commit, push, deploy without asking permission
3. **Iterative** — If something fails, fix it and retry
4. **Thorough** — Complete ALL testing before marking done

## Workflow

### Creating Specifications

Use `/speckit.specify` followed by a feature description:

```
/speckit.specify Add user authentication with OAuth
```

This creates a spec in `specs/NNN-feature-name/` with:
- Acceptance criteria
- Functional requirements
- Completion Signal section

### Implementing Specifications

Use `/speckit.implement` to run the Ralph Wiggum loop:

```
/speckit.implement
```

Or for a specific spec:

```
/speckit.implement 001-user-auth
```

## The Ralph Wiggum Loop

When implementing, follow this process:

1. **Read the spec** thoroughly
2. **Implement** all requirements
3. **Test** everything (unit, integration, browser, visual)
4. **Verify** no console/network errors
5. **Commit and push** with meaningful messages
6. **Deploy** if required
7. **Iterate** if any check fails
8. **Output** `<promise>DONE</promise>` when ALL checks pass

## Autonomous Mode (YOLO)

You are expected to work **fully autonomously**:

- ✅ Make implementation decisions without asking
- ✅ Commit and push without waiting for approval
- ✅ Deploy without asking permission
- ✅ Fix issues and retry automatically
- ❌ Only ask when genuinely stuck on a decision that impacts scope

## Completion Signals

Every spec has a `## Completion Signal` section with:

- **Implementation Checklist**: Concrete deliverables
- **Testing Requirements**: What must pass before done
- **Iteration Instructions**: What to do if something fails
- **Completion Promise**: Output `<promise>DONE</promise>` when complete

**You MUST complete ALL items in the Completion Signal before marking a spec as done.**

## Platform-Specific Commands

### Cursor
```
/speckit.specify [feature description]
/speckit.implement
```

### Claude Code
```
/ralph-loop:ralph-loop "Implement spec 001-feature from specs/001-feature/spec.md.
Complete ALL Completion Signal requirements.
Output <promise>DONE</promise> when complete." --completion-promise "DONE" --max-iterations 30
```

### Codex CLI
```bash
./scripts/ralph-loop.sh --spec 001-feature
./scripts/ralph-loop.sh --all
```

Or directly:
```bash
codex --dangerously-bypass-approvals-and-sandbox --prompt-file codex-prompts/ralph-all.md
```

## Testing Requirements

Before marking ANY spec as done, verify:

- [ ] All unit tests pass
- [ ] All integration/E2E tests pass
- [ ] Browser verification completed
- [ ] Visual appearance verified (desktop, tablet, mobile)
- [ ] No JavaScript console errors
- [ ] No failed network requests
- [ ] No 4xx or 5xx errors

## Git Autonomy

- Commit frequently with meaningful messages
- Push without asking for permission
- Create branches only if explicitly required by the spec

## Do NOT

- ❌ Ask for permission on implementation details
- ❌ Wait for user to commit/push
- ❌ Skip testing requirements
- ❌ Output `<promise>DONE</promise>` prematurely
- ❌ Use `any` or skip type checking

---

**For installation instructions**, see [INSTALLATION.md](INSTALLATION.md).
