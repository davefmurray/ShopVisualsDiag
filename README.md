# Ralph Wiggum

> Autonomous AI coding with spec-driven development

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🤖 AI Agent? Installing Ralph Wiggum?

**If you are an AI coding agent setting up Ralph Wiggum in a user's project**, read and execute the instructions in **[INSTALLATION.md](INSTALLATION.md)**.

That file contains everything you need to install Ralph Wiggum.

---

## What is Ralph Wiggum?

Ralph Wiggum is an approach to **fully autonomous AI-assisted software development** that combines:

- **Iterative self-correction** - AI agents work until acceptance criteria pass
- **Spec-driven development** - Professional-grade specifications guide the work
- **Cross-platform support** - Works with Claude Code, OpenAI Codex, and Cursor

## Quick Start (For Humans)

**Just tell your AI agent:**

> "Set up Ralph Wiggum in this project using the instructions at https://github.com/fstandhartinger/ralph-wiggum"

That's it. Your AI will read the INSTALLATION.md file and set up everything automatically.

---

## What Gets Installed

When your AI agent reads this repo, it will create:

| File/Folder | Purpose |
|-------------|---------|
| `.specify/memory/constitution.md` | Core project principles |
| `templates/spec-template.md` | Feature specification template |
| `templates/checklist-template.md` | Quality checklist template |
| `.cursor/commands/speckit.*.md` | Cursor slash commands |
| `.claude/commands/ralph-loop.md` | Claude Code command |
| `codex-prompts/*.md` | OpenAI Codex prompts |
| `scripts/ralph-loop.sh` | Universal runner script |
| `AGENTS.md` | Project-specific agent instructions |

## How It Works

### 1. Specify Features
```
/speckit.specify Add user authentication with OAuth
```

### 2. Implement Autonomously
```
/speckit.implement
```

The AI agent will:
- Read the specification
- Implement iteratively until all acceptance criteria pass
- Commit and push changes
- Deploy and verify
- Output `<promise>DONE</promise>` when complete

---

## Supported Platforms

| Platform | Method | YOLO Mode |
|----------|--------|-----------|
| **Cursor** | `/speckit.specify` and `/speckit.implement` | Built-in |
| **Claude Code** | `/ralph-loop:ralph-loop "..."` | Built-in |
| **Codex CLI** | `./scripts/ralph-loop.sh --all` | `--dangerously-bypass-approvals-and-sandbox` |

## Using Codex CLI

Ralph Wiggum works great with [OpenAI Codex CLI](https://github.com/openai/codex):

```bash
# Install Codex CLI
npm install -g @openai/codex
codex --login

# Run for all specs (YOLO mode)
./scripts/ralph-loop.sh --all

# Or directly:
codex --dangerously-bypass-approvals-and-sandbox --prompt-file codex-prompts/ralph-all.md
```

---

## File Reference

| File | Purpose |
|------|---------|
| [INSTALLATION.md](INSTALLATION.md) | **For AI agents**: Step-by-step setup instructions with all file contents |
| [AGENTS.md](AGENTS.md) | **For AI agents**: Day-to-day working instructions |
| [INSTALL.md](INSTALL.md) | **For humans**: Quick manual installation guide |

---

## Credits

This approach builds upon and is inspired by:

- [Original Ralph Wiggum technique](https://awesomeclaude.ai/ralph-wiggum) by the Claude community
- [How to Ralph Wiggum](https://github.com/ghuntley/how-to-ralph-wiggum) by Geoffrey Huntley
- [Claude Code Ralph Wiggum plugin](https://github.com/anthropics/claude-code/tree/main/plugins/ralph-wiggum)
- [Matt Pocock's variant](https://twitter.com/mattpocockuk) for async/concurrent loops
- [SpecKit](https://github.com/github/spec-kit) by GitHub

Our contribution is integrating these approaches with a simplified SpecKit workflow optimized for modern AI agents.

## License

MIT License - See [LICENSE](LICENSE) for details.

---

**Website**: [ralph-wiggum-web.onrender.com](https://ralph-wiggum-web.onrender.com)
