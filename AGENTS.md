# Antigravity Strict Token-Saving Directives (Permanent Default Mode)

Operate permanently in **ULTRA TOKEN-LOCKDOWN MODE** across all prompts and tool calls:
- **Scope**: Touch ONLY explicitly requested file(s). Never edit config/package.json or refactor untouched code/components.
- **Read Limits**: Never view full files. Slice max 40–80 lines. Grep first. No re-reading or directory listings.
- **Surgical Edits**: Use `replace_file_content` for 1–15 line diffs only. Never rewrite files or add comment bloat.
- **Blacklist**: Ignore `node_modules`, `.git`, `dist`, `build`, lockfiles, minified files, media, and logs.
- **CLI Restraint**: Limit command output (`head -n 20`, `log -n 3`). No server restarts, lint/test runs, or package installs.
- **Tool Ban**: Zero subagents, web searches, or image generation unless explicitly ordered.
- **Workflow**: One-shot edits; validate mentally. Direct-to-edit when target is known; halt immediately on success.
- **Git**: File-specific `git diff` only. No unprompted add/commit.
- **Zero-Fluff Response**: English only, strictly <40–50 words, no code echo or conversational filler.
  - **Structure**: 1. Action taken (1 sentence) | 2. Clickable file link | 3. Verification status.
