# AI AGENT: Execute These Instructions

> **YOU ARE AN AI CODING AGENT.** Follow these instructions to set up Ralph Wiggum in the user's project.
> 
> **DO NOT just describe these steps.** Actually execute them using your file creation tools.

---

## Phase 1: Create Directory Structure

Create these directories in the user's project:

```bash
mkdir -p .specify/memory
mkdir -p .specify/specs
mkdir -p templates
mkdir -p scripts
mkdir -p .cursor/commands
mkdir -p .claude/commands
mkdir -p codex-prompts
```

---

## Phase 2: Create Constitution Template

Create the file `.specify/memory/constitution.md` with this content:

```markdown
# [PROJECT_NAME] Constitution

> [PROJECT_DESCRIPTION]

## Version
1.0.0

## Core Principles

### I. [PRINCIPLE_1_NAME]
<!-- Example: API-First Architecture, Component-Based Design, etc. -->
[Describe your first core principle]

### II. [PRINCIPLE_2_NAME]
[Describe your second core principle]

### III. Simplicity & YAGNI
Start simple. Avoid over-engineering. Build exactly what's needed, nothing more.
No premature abstractions. No "just in case" features.

### IV. Autonomous Agent Development (YOLO Mode)
AI coding agents MUST work as autonomously as possible:

- Make decisions without asking for approval on implementation details
- **Commit and push autonomously** - don't wait for user to commit
- Deploy without user intervention
- Monitor deployments and fix issues independently
- Only ask the user when genuinely stuck

This is enabled by extensive testing:
- Unit tests, integration tests, browser automation
- Smoke tests after each deploy
- Production testing

### V. Quality Standards
<!-- Customize: Add your quality requirements -->
[Describe your quality expectations - design system, code standards, etc.]

## Technical Stack

| Layer | Technology | Notes |
|-------|------------|-------|
| Framework | [YOUR_FRAMEWORK] | e.g., Next.js, FastAPI, etc. |
| Language | [YOUR_LANGUAGE] | e.g., TypeScript, Python |
| Styling | [YOUR_STYLING] | e.g., Tailwind CSS |
| Testing | [YOUR_TESTING] | e.g., Vitest + Playwright |
| Deployment | [YOUR_DEPLOYMENT] | e.g., Render, Vercel |

## API Integration (if applicable)

<!-- Customize: Add your API endpoints -->
- Main API: [YOUR_API_URL]
- Documentation: [YOUR_API_DOCS]

## Development Workflow

This project follows the **Ralph Wiggum + SpecKit** methodology:

1. **Constitution** -> Define principles (this file)
2. **Spec** -> Create feature specifications with Completion Signals - `/speckit.specify`
3. **Implement** -> Execute via Ralph Wiggum iterative loops - `/speckit.implement`

### Completion Signal

Every spec includes a Completion Signal section with:
- Implementation checklist
- Testing requirements
- Completion promise: `<promise>DONE</promise>`

Agents iterate until all checks pass.

## Governance

- **Amendments**: Update this file, increment version, note changes
- **Compliance**: Follow principles in spirit, not just letter
- **Exceptions**: Document and justify in specs when deviating

**Version**: 1.0.0 | **Created**: [DATE]
```

---

## Phase 3: Create Spec Template

Create the file `templates/spec-template.md` with this content:

```markdown
# Specification: [FEATURE_NAME]

## Feature: [Feature Title]

### Overview
[Brief description of the feature]

### User Stories
- As a [user type], I want to [action] so that [benefit]

### Acceptance Criteria
- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]

### Functional Requirements

#### FR-1: [Requirement Name]
[Description]

#### FR-2: [Requirement Name]
[Description]

### Dependencies
- [Dependency 1]
- [Dependency 2]

### Assumptions
- [Assumption 1]
- [Assumption 2]

---

## Completion Signal

### Implementation Checklist
- [ ] [Deliverable 1]
- [ ] [Deliverable 2]
- [ ] [Deliverable 3]

### Testing Requirements

The agent MUST complete ALL before marking done:

#### Unit & Integration Tests
- [ ] All existing unit tests pass
- [ ] All existing E2E tests pass
- [ ] New tests added for new functionality

#### Browser Verification
- [ ] Navigate to relevant pages
- [ ] Take screenshots
- [ ] Verify visual appearance
- [ ] Test interactive elements
- [ ] Check console for errors

#### Visual Verification
- [ ] Desktop view looks correct
- [ ] Tablet view looks correct
- [ ] Mobile view looks correct

#### Console/Network Check
- [ ] No JavaScript console errors
- [ ] No failed network requests
- [ ] No 4xx or 5xx errors

### Iteration Instructions

If ANY check fails:
1. Identify the specific issue
2. Fix the code
3. Commit and push
4. Re-test
5. Iterate until everything passes

**Output when ALL checks pass**: `<promise>DONE</promise>`
```

---

## Phase 4: Create Checklist Template

Create the file `templates/checklist-template.md` with this content:

```markdown
# Specification Quality Checklist: [FEATURE_NAME]

**Purpose**: Validate specification completeness and quality before implementation
**Created**: [DATE]
**Feature**: [Link to spec.md]

## Content Quality

- [ ] No implementation details (languages, frameworks, APIs)
- [ ] Focused on user value and business needs
- [ ] Written for non-technical stakeholders
- [ ] All mandatory sections completed

## Requirement Completeness

- [ ] No [NEEDS CLARIFICATION] markers remain
- [ ] Requirements are testable and unambiguous
- [ ] Success criteria are measurable
- [ ] Success criteria are technology-agnostic
- [ ] Acceptance criteria are defined
- [ ] Edge cases are identified
- [ ] Scope is clearly bounded
- [ ] Dependencies and assumptions identified

## Feature Readiness

- [ ] All functional requirements have clear acceptance criteria
- [ ] User scenarios cover primary flows
- [ ] Feature meets measurable outcomes defined in Success Criteria
- [ ] No implementation details leak into specification

## Notes

- Items marked incomplete require spec updates before implementation
```

---

## Phase 5: Create Cursor Slash Commands

### 5a. Create `/speckit.specify` command

Create `.cursor/commands/speckit.specify.md`:

```markdown
---
description: Create or update a feature specification from a natural language description.
---

## User Input

\`\`\`text
$ARGUMENTS
\`\`\`

You **MUST** consider the user input before proceeding (if not empty).

## Outline

The text after `/speckit.specify` is the feature description. Do not ask the user to repeat it unless it is empty.

Given that description, do this:

1. **Generate a concise short name** (2-4 words) for the spec folder:
   - Extract the most meaningful keywords
   - Use action-noun format when possible (e.g., "user-auth", "billing-dashboard")
   - Preserve technical terms and acronyms (OAuth2, JWT, API)

2. **Determine the next spec number** (NO BRANCH CREATION):

   a. List existing spec directories:
      \`\`\`bash
      ls -d specs/[0-9]*/ 2>/dev/null | sort -t/ -k2 -n
      \`\`\`

   b. Find the highest number N and use N+1 (zero-padded to 3 digits)

   c. Create the spec directory structure:
      \`\`\`bash
      mkdir -p specs/NNN-short-name/checklists
      \`\`\`

   d. Set SPEC_FILE = `specs/NNN-short-name/spec.md`

3. Load `templates/spec-template.md` to understand required sections.

4. Write the spec using the template structure, replacing placeholders with concrete details derived from the feature description while preserving section order and headings.

5. **Completion Signal**: Ensure the spec includes a `## Completion Signal` section with:
   - Implementation checklist
   - Testing requirements
   - Iteration instructions
   - Completion promise (`<promise>DONE</promise>`)

6. **Create a quality checklist** at `specs/NNN-short-name/checklists/requirements.md` using `templates/checklist-template.md`.

7. If anything is ambiguous, add up to 3 `[NEEDS CLARIFICATION: ...]` markers in the spec. For each marker, present a clear question and suggested answers.

## Output

Return: SUCCESS (spec ready for implementation via Ralph Wiggum)
```

### 5b. Create `/speckit.implement` command

Create `.cursor/commands/speckit.implement.md`:

```markdown
---
description: Execute implementation using Ralph Wiggum iterative loops on specs
---

## User Input

\`\`\`text
$ARGUMENTS
\`\`\`

You **MUST** consider the user input before proceeding (if not empty).

## Overview

This command launches the Ralph Wiggum implementation loop to process specifications autonomously. The agent iterates until acceptance criteria and Completion Signal requirements pass.

## Execution

### Option A: Single Spec

If `$ARGUMENTS` specifies a single spec (e.g., "001-user-auth"):

1. Read the spec from `specs/$ARGUMENTS/spec.md`
2. Read `.specify/memory/constitution.md` for project principles
3. Read `AGENTS.md` for development guidelines
4. Implement all requirements iteratively
5. Complete ALL items in the Completion Signal section
6. Run all tests (unit, integration, browser, visual)
7. Verify no console/network errors
8. Commit and push changes
9. Deploy if required and verify
10. Iterate until all checks pass
11. Output `<promise>DONE</promise>` when complete

### Option B: All Specs (Master Loop)

If no specific spec provided:

1. List all specs in `specs/` folder in numerical order
2. For each spec, execute Option A process
3. Move to next spec only after current one is DONE
4. Output `<promise>ALL_DONE</promise>` when all complete

## Ralph Wiggum Principles

- **Autonomous**: Don't ask for permission, just do it
- **Iterative**: If something fails, fix it and retry
- **Thorough**: Complete ALL testing requirements
- **Honest**: Only output DONE when truly complete
```

---

## Phase 6: Create Claude Code Command

Create `.claude/commands/ralph-loop.md`:

```markdown
---
description: Run the Ralph Wiggum loop for a spec (Claude Code)
---

Use this command to run an autonomous Ralph loop:

### For a single spec:
\`\`\`
/ralph-loop:ralph-loop "Implement spec {spec-name} from specs/{spec-name}/spec.md.
Complete ALL Completion Signal requirements.
Output <promise>DONE</promise> when complete." --completion-promise "DONE" --max-iterations 30
\`\`\`

### For all specs:
\`\`\`
/ralph-loop:ralph-loop "Work through all specs in specs/ folder in order.
For each, complete all Completion Signal requirements.
Output <promise>ALL_DONE</promise> when complete." --completion-promise "ALL_DONE" --max-iterations 100
\`\`\`
```

---

## Phase 7: Create Codex CLI Prompts

### 7a. Create single spec prompt

Create `codex-prompts/ralph-spec.md`:

```markdown
# Ralph Wiggum - Single Spec

Implement the spec specified by SPEC_NAME from `specs/$SPEC_NAME/spec.md`.

## Before starting:
1. Read `.specify/memory/constitution.md` for project principles
2. Read `AGENTS.md` for development guidelines
3. Read the spec file thoroughly

## Process:
1. Implement all requirements in the spec
2. Complete ALL items in the Completion Signal section
3. Run all tests (unit, integration, browser)
4. Verify no console/network errors
5. Commit and push with meaningful messages
6. Deploy if required and verify

## Completion:
Output `<promise>DONE</promise>` when ALL checks pass.

---

**Usage**: `codex --dangerously-bypass-approvals-and-sandbox --prompt-file codex-prompts/ralph-spec.md`
```

### 7b. Create all specs prompt

Create `codex-prompts/ralph-all.md`:

```markdown
# Ralph Wiggum - All Specs

Work through ALL specifications in the `specs/` folder, implementing each one until its acceptance criteria pass.

## Before starting:
1. Read `.specify/memory/constitution.md` for project principles
2. Read `AGENTS.md` for development guidelines
3. List all specs: `ls -d specs/*/`

## For each spec in numerical order:
1. Read `specs/{name}/spec.md`
2. Implement all requirements
3. Complete ALL items in the Completion Signal section
4. Run all tests
5. Commit and push
6. Move to next spec only when current is DONE

## Completion:
Output `<promise>ALL_DONE</promise>` when ALL specs are complete.

---

**Usage**: `codex --dangerously-bypass-approvals-and-sandbox --prompt-file codex-prompts/ralph-all.md`
```

---

## Phase 8: Create Ralph Loop Script

Create `scripts/ralph-loop.sh` with this content and make it executable (`chmod +x scripts/ralph-loop.sh`):

```bash
#!/bin/bash
#
# Ralph Loop - Universal runner for Ralph Wiggum
#
# Usage:
#   ./scripts/ralph-loop.sh --spec 001-project-setup
#   ./scripts/ralph-loop.sh --all
#

set -e

SPEC=""
ALL=false

while [[ $# -gt 0 ]]; do
    case $1 in
        -s|--spec) SPEC="$2"; shift 2 ;;
        -a|--all) ALL=true; shift ;;
        -h|--help)
            echo "Usage: $0 [--spec NAME] [--all]"
            echo "  --spec NAME  Run for a specific spec"
            echo "  --all        Run for all specs"
            exit 0
            ;;
        *) shift ;;
    esac
done

# Detect platform
if command -v codex &> /dev/null; then
    PLATFORM="codex"
elif command -v claude &> /dev/null; then
    PLATFORM="claude"
else
    echo "Error: Neither 'codex' nor 'claude' CLI found."
    echo "Install one of:"
    echo "  npm install -g @openai/codex"
    echo "  pip install claude-code"
    exit 1
fi

echo "Using platform: $PLATFORM"

if [[ "$PLATFORM" == "codex" ]]; then
    if [[ "$ALL" == true ]]; then
        codex --dangerously-bypass-approvals-and-sandbox --prompt-file codex-prompts/ralph-all.md
    elif [[ -n "$SPEC" ]]; then
        SPEC_NAME="$SPEC" codex --dangerously-bypass-approvals-and-sandbox --prompt-file codex-prompts/ralph-spec.md
    else
        echo "Specify --spec NAME or --all"
        exit 1
    fi
elif [[ "$PLATFORM" == "claude" ]]; then
    if [[ "$ALL" == true ]]; then
        echo "Run in Claude Code: /ralph-loop:ralph-loop with ALL specs prompt"
    elif [[ -n "$SPEC" ]]; then
        echo "Run in Claude Code: /ralph-loop:ralph-loop with spec $SPEC"
    fi
fi
```

---

## Phase 9: Create AGENTS.md for the User's Project

Create `AGENTS.md` in the project root:

```markdown
# Agent Instructions

> Instructions for AI coding agents working on this project

## Quick Start

1. Read `.specify/memory/constitution.md` for project principles
2. Read this file for development guidelines
3. Check `specs/` for feature specifications

## Development Workflow

This project uses **Ralph Wiggum + SpecKit**:

1. `/speckit.specify [feature]` - Create a feature specification
2. `/speckit.implement` - Implement specs autonomously

## Autonomous Mode (YOLO)

You are expected to work **fully autonomously**:

- Commit and push without asking
- Deploy without asking
- Fix issues and iterate
- Only ask when truly stuck

## Completion Signals

Every spec has a Completion Signal section. You MUST:
- Complete ALL checklist items
- Pass ALL tests
- Verify visually with browser tools
- Output `<promise>DONE</promise>` when complete
```

---

## Phase 10: Verify Installation

After creating all files, verify they exist:

```bash
ls -la .specify/memory/constitution.md
ls -la templates/spec-template.md
ls -la templates/checklist-template.md
ls -la .cursor/commands/speckit.specify.md
ls -la .cursor/commands/speckit.implement.md
ls -la .claude/commands/ralph-loop.md
ls -la codex-prompts/ralph-spec.md
ls -la codex-prompts/ralph-all.md
ls -la scripts/ralph-loop.sh
ls -la AGENTS.md
```

---

## Phase 11: Tell the User

**After completing all phases, inform the user:**

> **✅ Ralph Wiggum is now installed!**
> 
> **Next steps:**
> 
> 1. **Customize your constitution**: Edit `.specify/memory/constitution.md`
>    - Replace `[PROJECT_NAME]` with your project name
>    - Replace `[PROJECT_DESCRIPTION]` with what your project does
>    - Fill in the `[PLACEHOLDER]` sections with your specifics
>    - Add your tech stack and principles
> 
> 2. **Create your first spec**: Use `/speckit.specify` followed by a feature description
>    - Example: `/speckit.specify Add user authentication with OAuth`
> 
> 3. **Implement autonomously**: Use `/speckit.implement` to have me build it
> 
> **Available commands:**
> - `/speckit.specify [feature]` - Create a spec
> - `/speckit.implement` - Implement specs with Ralph Wiggum loop
> 
> **For Codex CLI users:**
> ```bash
> ./scripts/ralph-loop.sh --spec 001-project-setup
> ./scripts/ralph-loop.sh --all
> ```

---

## Credits

This approach is inspired by:
- [Ralph Wiggum technique](https://awesomeclaude.ai/ralph-wiggum) by the Claude community
- [How to Ralph Wiggum](https://github.com/ghuntley/how-to-ralph-wiggum) by Geoffrey Huntley
- [SpecKit](https://github.com/github/spec-kit) by GitHub
