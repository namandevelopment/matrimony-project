# Antigravity Universal Strict Token-Saving Directives

> ⚡ **TRIGGER PROTOCOL (WHEN TAGGED `@AGENTS.md`)**:
> Whenever this file is tagged (`@AGENTS.md`), referenced, or loaded in context, Antigravity MUST immediately activate **ULTRA TOKEN-LOCKDOWN MODE**:
> - **File Lock**: Restrict 100% of attention and edits to the exact file specified in the prompt.
> - **Line Cap**: Never view full files. Read maximum 40–80 lines via targeted slice.
> - **Surgical Diffs**: Modify only 1–15 lines using `replace_file_content`. Never rewrite full files.
> - **Zero-Fluff Response**: Cap final chat output to strictly under 40–50 words (3-line format).
> - **Tool Lockdown**: Zero subagents, zero web searches, zero unsolicited builds/tests/linters.
>
> **MANDATORY SYSTEM DIRECTIVE**: These rules take the absolute highest precedence. Every tool call and response MUST strictly comply with these rules to minimize token consumption and eliminate redundant operations.

---

## 1. Strict File Isolation & Scope Lock
- **Explicit Target Only**: Read, analyze, or modify ONLY the file(s) explicitly named in the user's prompt.
- **Zero Unsolicited Refactoring**: Never fix formatting, typos, or code smells in untouched lines or adjacent files.
- **Configuration Lock**: Never touch `package.json`, build configs, environment files, or READMEs unless explicitly commanded.
- **Parent/Child Component Lock**: Do not navigate to parent layouts or child components unless an import is directly broken.

## 2. File Viewing & Line-Slice Optimization
- **Mandatory Line Limits**: NEVER call `view_file` on an entire file. Always provide narrow `StartLine` and `EndLine` (maximum 40–80 lines).
- **Targeted Grep First**: Use `grep_search` with specific keywords and file filters (`Includes`) to pinpoint exact line numbers before viewing.
- **Zero File Re-reading**: Never inspect a file that was already viewed in recent context. Rely entirely on cached context.
- **No Exploratory Listing**: Never call `list_dir` on parent directories or browse folder trees when the target file path is already known.

## 3. Surgical Diff & Edit Optimization
- **Strictly Minimal Diffs**: ALWAYS use `replace_file_content` targeting only the specific lines being changed (1–15 lines max).
- **Absolute Ban on Full Rewrites**: NEVER use `write_to_file` to overwrite an existing source code file.
- **No Dummy Comments or Bloat**: Do not add unnecessary comments, redundant docstrings, or decorative banners.

## 4. Universal Directory & Extension Blacklist (Zero-Scan Zone)
Never view, search, or scan inside:
- **Directories**: `node_modules/`, `.git/`, `build/`, `dist/`, `.next/`, `.expo/`, `ios/Pods/`, `android/app/build/`, `.gradle/`, `coverage/`.
- **Large/Binary Files**: Lockfiles (`package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`), minified bundles (`*.min.js`, `*.bundle.js`), source maps (`*.map`), image/audio/video files (`*.svg`, `*.png`, `*.jpg`, `*.mp4`), database dumps (`*.sql`, `*.dump`), and logs (`*.log`).

## 5. Terminal Output & Command Restraint
- **Output Paging & Caps**: Always limit terminal command output (e.g., `git log -n 3`, `head -n 20`, `tail -n 20`).
- **No Background Server Restarts**: Never restart dev servers, Metro bundlers, or background services unless explicitly asked.
- **No Unsolicited Build or Lint Checks**: Never run `npm test`, `npm run build`, `npm run lint`, or type-checks unless commanded.
- **No Dependency Installs**: Never run `npm install`, `yarn add`, or global package installations without direct instruction.

## 6. Prohibited Heavy Tools & Zero-Subagent Policy
- **No Subagents**: Spawning subagents (`browser_subagent`, `invoke_subagent`) is strictly prohibited unless explicitly requested.
- **No Web Searching**: Do not use `search_web` or download external documentation for standard coding tasks.
- **No Image/Asset Generation**: Never invoke `generate_image` or create mock graphics unless specifically commanded.

## 7. Single-Pass Resolution (One-Shot Rule)
- **Zero Iterative Churn**: Inspect once, edit once, finish. Avoid multi-turn trial-and-error experiments that burn tokens.
- **Mentally Validate**: Verify syntax, parameters, and variable imports mentally before executing the tool call.

## 8. Git & Version Control Restraint
- **Never Run Full Repo Diffs**: Never run `git diff` without specifying the exact file path (e.g., `git diff path/to/file`).
- **No Unprompted Commits**: Do not stage (`git add`) or commit (`git commit`) changes unless instructed.

## 9. Zero-Fluff Chat Response Protocol (Hard Token Cap)
- **English Only**: Output must strictly be in English. Non-Latin scripts (Devanagari, Hindi) multiply token consumption by 3x–4x.
- **Strict Word Cap**: Every chat response must remain under **40–60 words**.
- **No Conversational Boilerplate**: Prohibit phrases like "Sure, I can help", "Let me examine", "Hope this helps!", or repeating the user's prompt.
- **Zero Code Duplication in Chat**: NEVER paste full code blocks or repeated functions in chat. The code is already saved in the file.
- **Mandatory 3-Line Output Structure**:
  1. **Action**: 1 sentence stating what was changed.
  2. **File**: Markdown link (`[filename](file:///...)`).
  3. **Verification**: 1 line verifying the edit.

## 10. Pre-Flight Tool Call Checklist
Before invoking ANY tool, verify:
1. Is this tool call 100% essential to complete the prompt?
2. Is the file target explicitly within scope?
3. Am I reading only a small slice (<80 lines)?
4. Can this edit be completed in a single surgical replacement?

---

# 📖 User Guide: Maximum Token Savings & File Scoping

## 🎯 1. How to Structure Prompts
Always specify the exact target file path to reduce context scanning by 85%:

- ❌ **Inefficient (Consumes thousands of tokens):**  
  *"Change button color in admin login and check the user list."*

- ✅ **Optimal (Minimal tokens):**  
  *"In `sindiMatrimonyAdmin/src/pages/Login.jsx`, change submit button color to #007bff. Only edit this file. Minimal diff. Silent mode."*

### ⚡ Quickest Method: Tag `@AGENTS.md`
Add `@AGENTS.md` at the start of your prompt:
```text
@AGENTS.md in sindiMatrimonyAdmin/src/pages/Login.jsx change button color to #007bff
```
👉 Tagging `@AGENTS.md` triggers immediate Ultra Token-Lockdown Mode.

---

## 📋 2. Powerful Token-Saving Keywords

| Keyword / Directive | Effect |
| :--- | :--- |
| **`Only touch [file]`** | Prohibits reading or modifying any other file. |
| **`Minimal diff only`** | Targets only 1–15 specific lines. |
| **`Silent mode / No explanation`** | Generates 0 conversational text (100% output token savings). |
| **`Lines X to Y only`** | Reads narrow slice instead of searching the file. |
| **`No build / No tests`** | Blocks all terminal checks and build scripts. |
| **`Single pass fix`** | Forces single-attempt execution without tool churn. |
| **`One line response`** | Caps final output to a single sentence. |
| **`English only`** | Prevents non-Latin script token inflation (saves ~70% tokens). |

### Quick Prompt Template:
```text
File: [file_path] (Lines: 40-70)
Task: [Exact bug or feature]
Rule: Only edit this file. Minimal diff. Silent mode. English only.
```

---

## ⚡ 3. Pro Tips
1. **Copy Relative Path**: Right-click file in IDE > "Copy Relative Path" and paste in prompt.
2. **Gemini Flash**: Fastest execution with the lowest token rate.
3. **Fresh Context**: Start a new chat after completing a task to avoid sending long histories.

---

## 🌐 4. Live Production Links & Repository
- **User Web Panel**: [sindhi-matrimony-user-panel.vercel.app](https://sindhi-matrimony-user-panel.vercel.app) ([sindhimarriage.in](https://sindhimarriage.in))
- **Admin CRM Panel**: [sindi-matrimony-admin.vercel.app](https://sindi-matrimony-admin.vercel.app) ([admin.sindhimarriage.in](https://admin.sindhimarriage.in))
- **Backend API Gateway**: [sindhi-matrimony-backend.vercel.app](https://sindhi-matrimony-backend.vercel.app/api/v1/health)
- **GitHub Repository**: `namandevelopment/matrimony-project` (`main` auto-deploys to Vercel)

