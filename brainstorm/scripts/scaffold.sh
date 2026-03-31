#!/usr/bin/env bash
set -euo pipefail

# Scaffold the brainstorm template (base + brainstorm) into a project's .claude/ directory
# Usage: ./scripts/scaffold.sh /path/to/your/project

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMPLATE_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
BASE_DIR="$TEMPLATE_ROOT/base"
BRAINSTORM_DIR="$TEMPLATE_ROOT/brainstorm"

if [ $# -eq 0 ]; then
  echo "Usage: $0 <project-path>"
  echo "Example: $0 /projects/my-ml-project"
  exit 1
fi

PROJECT="$1"
TARGET="$PROJECT/.claude"

if [ ! -d "$PROJECT" ]; then
  echo "Error: $PROJECT does not exist"
  exit 1
fi

echo "Scaffolding brainstorm template into $TARGET"

# Create directory structure
mkdir -p "$TARGET"/{agents,skills,commands,hooks,rules,mcp-configs,scripts,tests}

# Copy base layer first
echo "  Copying base layer..."
cp "$BASE_DIR"/agents/*.md "$TARGET/agents/" 2>/dev/null || true
cp -r "$BASE_DIR"/skills/* "$TARGET/skills/" 2>/dev/null || true
cp "$BASE_DIR"/commands/*.md "$TARGET/commands/" 2>/dev/null || true
cp "$BASE_DIR"/hooks/* "$TARGET/hooks/" 2>/dev/null || true
cp "$BASE_DIR"/rules/* "$TARGET/rules/" 2>/dev/null || true

# Copy brainstorm layer (overwrites base on conflict)
echo "  Copying brainstorm layer..."
cp "$BRAINSTORM_DIR"/agents/*.md "$TARGET/agents/"
cp -r "$BRAINSTORM_DIR"/skills/* "$TARGET/skills/"
cp "$BRAINSTORM_DIR"/commands/*.md "$TARGET/commands/"

# Merge CLAUDE.md — base first, then append brainstorm sections
if [ ! -f "$TARGET/CLAUDE.md" ]; then
  echo "  Creating CLAUDE.md..."
  cat "$BASE_DIR/CLAUDE.md" > "$TARGET/CLAUDE.md"
  echo "" >> "$TARGET/CLAUDE.md"
  echo "---" >> "$TARGET/CLAUDE.md"
  echo "" >> "$TARGET/CLAUDE.md"
  cat "$BRAINSTORM_DIR/CLAUDE.md" >> "$TARGET/CLAUDE.md"
else
  echo "  CLAUDE.md already exists — skipping (merge manually)"
fi

echo ""
echo "Done. Scaffolded into $TARGET:"
find "$TARGET" -type f | sort | sed 's|^|  |'
echo ""
echo "Next steps:"
echo "  1. Edit $TARGET/CLAUDE.md — fill in {{placeholders}}"
echo "  2. Run /brainstorm <topic> to start"
