---
description: Analyzes TypeScript code and enforces stricter typing rules automatically
category: quality
tags: [typescript, strict, any, quality, code-review]
---

# TypeScript Stricter Skill

This skill provides you (the Antigravity agent) with the ability to run a strict TypeScript analysis on the user's codebase to detect implicit `any` usage and other lax typings, and guide them towards a stricter configuration.

## Capabilities

When the user asks to "make type checking stricter", "run typescript analysis", or "review typescript quality", you must:

// turbo
1. Use the run_command tool to execute the included script: `bash .agents/skills/quality/typescript-stricter/scripts/analyze.sh`
2. Analyze the standard output of this script.
3. Present the results to the user in a structured format (tables or lists).
4. Propose code modifications using your multi_replace_file_content tool to fix the detected `any` types.
5. Suggest updating `tsconfig.json` to enable `"strict": true` if it's not already enabled.
