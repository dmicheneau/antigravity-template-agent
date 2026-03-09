# Antigravity Template: Workflows & Skills

This repository provides a template and specialized CLI installer designed specifically for the **Antigravity IDE** ecosystem.

Unlike traditional prompt-based editors that use monolithic "Personas", Antigravity orchestrates work via procedural **Workflows** and code-based **Skills**. This tool allows you to easily distribute and install these advanced capabilities directly into your projects.

## Architecture

This ecosystem provides two core types of capabilities:

### 1. Workflows (`.agents/workflows/`)
Workflows are declarative Markdown files containing step-by-step procedural guidelines. They teach Antigravity *how* to accomplish a specific multi-step task (e.g., standardizing a CI/CD setup, generating a UI component according to your design system).

### 2. Skills (`.agents/skills/`)
Skills are full advanced toolsets installed as directories. They contain a `SKILL.md` instruction file and executable `scripts/` that Antigravity can be authorized to run autonomously. This allows the AI to perform complex static analysis, migrations, or deploy routines on its own.

## Quick Install (TUI / CLI)

You can launch the interactive beautiful installer using `npx`:

```bash
npx github:dmicheneau/antigravity-template-agent tui
```
*The TUI will guide you to select the Workflows or Skills you need. It automatically routes the files to the correct `.agents/workflows` or `.agents/skills` local directories so that Antigravity immediately recognizes them.*

To install specific elements directly via the CLI without the UI:
```bash
npx github:dmicheneau/antigravity-template-agent install <id>

# Examples:
npx github:dmicheneau/antigravity-template-agent install deploy/setup-github-pages
npx github:dmicheneau/antigravity-template-agent install quality/typescript-stricter
```

## Creating Your Own Repository

1. Fork this repository or copy its structure.
2. Edit `manifest.json` to declare your own tools.
3. Write your `.md` files in the `workflows/` directory.
4. Structure your skill sets (directories containing scripts + SKILL.md) in the `skills/` directory.
5. Provide the `npx github:your-org/your-repo tui` command to your developers for a 1-click upgrade of their local AI capabilities.
