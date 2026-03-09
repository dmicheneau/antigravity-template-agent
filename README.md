# Antigravity Template Agent

This repository provides a structured template and installer for bringing specialized **Agent Workflows** to the Antigravity IDE. It adapts the successful pattern from `opencode-template-agent` for the Antigravity ecosystem.

## How it Works

Antigravity natively supports specialized instructions via "Workflows" (typically stored in `.agents/workflows/`). This tooling allows you to quickly bootstrap and install pre-configured expert behaviors for your AI assistant in any project.

Agents are defined as markdown files with YAML frontmatter containing their description, category, and tags, followed by their specialized identity and operational guidelines.

## Quick Install (CLI / TUI)

You can launch the interactive installer using `npx`:

```bash
npx github:dmicheneau/antigravity-template-agent tui
```
*This will open a terminal UI where you can pick individual agents or whole packs to install directly into your current project's `.agents/workflows/` directory.*

To install specific agents directly via CLI without the UI, you can use:
```bash
npx github:dmicheneau/antigravity-template-agent install <agent-id>

# Example:
npx github:dmicheneau/antigravity-template-agent install web/expert-react database/postgres-pro
```

## Available Sample Agents

Currently, this template includes a few sample agents to demonstrate the format:

- **web/expert-react**: Specialist in React, hooks, and modern frontend architecture.
- **devops/devops-engineer**: CI/CD, Docker, and Kubernetes expert.
- **database/postgres-pro**: PostgreSQL expert for schema design and complex queries.

## Customizing for your Organization

1. Fork this repository or copy its structure.
2. Edit `manifest.json` to define your own categories and packs.
3. Write your specialized `.md` workflow files in the `agents/` directory.
4. Distribute by telling your team to run `npx github:your-org/your-repo tui`.
