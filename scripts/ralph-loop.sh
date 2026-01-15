#!/bin/bash
#
# Ralph Wiggum Loop Runner
# Universal script for running Ralph loops with Claude Code or OpenAI Codex CLI
#
# Usage:
#   ./scripts/ralph-loop.sh "Your prompt here"           # Free-form prompt
#   ./scripts/ralph-loop.sh --spec 001-project-setup     # Run single spec
#   ./scripts/ralph-loop.sh --all                        # Run all specs
#   ./scripts/ralph-loop.sh "prompt" --full-auto         # YOLO mode
#
# Examples:
#   ./scripts/ralph-loop.sh "Fix all GitHub issues in this project"
#   ./scripts/ralph-loop.sh --spec 001-project-setup
#   ./scripts/ralph-loop.sh --all --full-auto
#   ./scripts/ralph-loop.sh "Implement user auth" --full-auto --codex
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Defaults
USE_CODEX=false
FORCE_CLAUDE=false
FULL_AUTO=false
ALL_SPECS=false
SPEC_NAME=""
PROMPT=""
MAX_ITERATIONS=30

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --all|-a)
            ALL_SPECS=true
            shift
            ;;
        --spec|-s)
            SPEC_NAME="$2"
            shift 2
            ;;
        --full-auto|-f)
            FULL_AUTO=true
            shift
            ;;
        --codex)
            USE_CODEX=true
            shift
            ;;
        --claude)
            FORCE_CLAUDE=true
            shift
            ;;
        --max-iterations)
            MAX_ITERATIONS="$2"
            shift 2
            ;;
        --help|-h)
            cat <<EOF
Ralph Wiggum Loop Runner

Usage:
  ./scripts/ralph-loop.sh "Your prompt here"           # Free-form prompt
  ./scripts/ralph-loop.sh --spec 001-project-setup     # Run single spec
  ./scripts/ralph-loop.sh --all                        # Run all specs
  ./scripts/ralph-loop.sh "prompt" --full-auto         # YOLO mode

Options:
  "prompt"              Free-form prompt (put in quotes)
  --spec, -s NAME       Run a specific spec from specs/
  --all, -a             Process all specs in order
  --full-auto, -f       YOLO mode: no permission prompts (uses
                        --dangerously-bypass-approvals-and-sandbox for Codex)
  --codex               Force use of OpenAI Codex CLI
  --claude              Force use of Claude Code
  --max-iterations N    Maximum iterations (default: 30)
  --help, -h            Show this help message

Examples:
  ./scripts/ralph-loop.sh "Fix all GitHub issues and verify visually"
  ./scripts/ralph-loop.sh --spec 001-project-setup
  ./scripts/ralph-loop.sh --all --full-auto
  ./scripts/ralph-loop.sh "Implement user auth" --full-auto --codex

EOF
            exit 0
            ;;
        -*)
            echo -e "${RED}Unknown option: $1${NC}"
            echo "Use --help to see available options"
            exit 1
            ;;
        *)
            # Positional argument = free-form prompt
            PROMPT="$1"
            shift
            ;;
    esac
done

cd "$PROJECT_DIR"

# Detect available CLI
detect_cli() {
    if [[ "$USE_CODEX" == "true" ]]; then
        if command -v codex &> /dev/null; then
            echo "codex"
        else
            echo -e "${RED}Error: --codex specified but codex CLI not found${NC}" >&2
            exit 1
        fi
    elif [[ "$FORCE_CLAUDE" == "true" ]]; then
        if command -v claude &> /dev/null; then
            echo "claude"
        else
            echo -e "${RED}Error: --claude specified but claude CLI not found${NC}" >&2
            exit 1
        fi
    elif command -v claude &> /dev/null; then
        echo "claude"
    elif command -v codex &> /dev/null; then
        echo "codex"
    else
        echo "none"
    fi
}

CLI=$(detect_cli)

if [[ "$CLI" == "none" ]]; then
    echo -e "${RED}Error: Neither 'claude' nor 'codex' CLI found in PATH${NC}"
    echo "Please install one of:"
    echo "  - Claude Code: https://claude.ai/code"
    echo "  - OpenAI Codex: npm install -g @openai/codex"
    exit 1
fi

echo -e "${BLUE}Using CLI: $CLI${NC}"
if [[ "$FULL_AUTO" == "true" ]]; then
    echo -e "${YELLOW}Mode: FULL AUTO (YOLO)${NC}"
fi

# Build the prompt for a single spec
build_spec_prompt() {
    local spec="$1"
    cat <<EOF
Implement the spec '$spec' from specs/$spec/spec.md.

BEFORE YOU START, read these files:
1. .specify/memory/constitution.md — Core principles  
2. AGENTS.md — Development guidelines

PROCESS:
1. Read the spec file thoroughly
2. Implement the feature following acceptance criteria
3. Run tests
4. Use Browser tools to visually verify UI if applicable
5. Commit and push with meaningful messages

AUTONOMY: You have FULL autonomy. Commit, push, deploy without asking.

OUTPUT when complete: <promise>DONE</promise>
EOF
}

# Build the prompt for all specs
build_all_specs_prompt() {
    cat <<EOF
Implement ALL specifications in the specs/ folder, one by one, in numerical order.

BEFORE YOU START, read these files:
1. .specify/memory/constitution.md — Core principles
2. AGENTS.md — Development guidelines

PROCESS for each spec:
1. Read the spec file: specs/{spec-name}/spec.md
2. Implement the feature following acceptance criteria
3. Run tests
4. Use Browser tools to visually verify UI if applicable
5. Commit and push with meaningful messages
6. Move to the next spec

AUTONOMY: You have FULL autonomy. Commit, push, deploy without asking.

OUTPUT when ALL specs are complete: <promise>ALL_DONE</promise>
EOF
}

# Build wrapper for free-form prompts
build_freeform_prompt() {
    local user_prompt="$1"
    cat <<EOF
$user_prompt

CONTEXT: Read these files first if relevant:
- .specify/memory/constitution.md — Core principles
- AGENTS.md — Development guidelines

AUTONOMY: You have FULL autonomy. Commit, push, deploy without asking.
Test everything visually using browser tools if applicable.

OUTPUT when complete: <promise>DONE</promise>
EOF
}

# Run with Claude Code
run_claude() {
    local prompt="$1"
    
    echo -e "${GREEN}Starting Claude Code with Ralph loop...${NC}"
    
    if [[ "$FULL_AUTO" == "true" ]]; then
        echo -e "${YELLOW}Note: Claude Code runs interactively but agent has full autonomy.${NC}"
    fi
    
    # Try to run claude CLI directly
    if command -v claude &> /dev/null; then
        claude "$prompt"
    else
        echo ""
        echo "Claude CLI not found. Please paste this in Claude Code:"
        echo ""
        echo -e "${BLUE}/ralph-loop:ralph-loop \"$prompt\" --completion-promise \"DONE\" --max-iterations $MAX_ITERATIONS${NC}"
        echo ""
    fi
}

# Run with OpenAI Codex CLI
run_codex() {
    local prompt="$1"
    local args=""
    
    if [[ "$FULL_AUTO" == "true" ]]; then
        # YOLO mode: bypass all approvals and sandbox
        args="--dangerously-bypass-approvals-and-sandbox"
        echo -e "${GREEN}Starting Codex in YOLO mode (no approval prompts)...${NC}"
    else
        echo -e "${GREEN}Starting Codex interactively...${NC}"
    fi
    
    if [[ -n "$args" ]]; then
        codex $args "$prompt"
    else
        codex "$prompt"
    fi
}

# Determine what to run
FINAL_PROMPT=""

if [[ "$ALL_SPECS" == "true" ]]; then
    FINAL_PROMPT=$(build_all_specs_prompt)
    echo -e "${GREEN}Running Ralph loop for ALL specs...${NC}"
elif [[ -n "$SPEC_NAME" ]]; then
    # Validate spec exists
    if [[ ! -d "specs/$SPEC_NAME" ]]; then
        echo -e "${RED}Error: Spec '$SPEC_NAME' not found in specs/ folder${NC}"
        echo "Available specs:"
        ls -1 specs/ 2>/dev/null || echo "  (no specs folder found)"
        exit 1
    fi
    FINAL_PROMPT=$(build_spec_prompt "$SPEC_NAME")
    echo -e "${GREEN}Running Ralph loop for spec: $SPEC_NAME${NC}"
elif [[ -n "$PROMPT" ]]; then
    FINAL_PROMPT=$(build_freeform_prompt "$PROMPT")
    echo -e "${GREEN}Running Ralph loop with free-form prompt...${NC}"
else
    echo -e "${RED}Error: Please provide a prompt, --spec NAME, or --all${NC}"
    echo ""
    echo "Usage:"
    echo "  ./scripts/ralph-loop.sh \"Your prompt here\""
    echo "  ./scripts/ralph-loop.sh --spec 001-project-setup"
    echo "  ./scripts/ralph-loop.sh --all"
    echo ""
    echo "Use --help for more options."
    exit 1
fi

echo -e "${BLUE}Max iterations: $MAX_ITERATIONS${NC}"
echo ""

# Run with appropriate CLI
if [[ "$CLI" == "codex" ]]; then
    run_codex "$FINAL_PROMPT"
else
    run_claude "$FINAL_PROMPT"
fi

echo ""
echo -e "${GREEN}Ralph loop completed!${NC}"
