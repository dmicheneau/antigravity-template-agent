---
description: Automatically builds and deploys your static site to GitHub Pages
category: deploy
tags: [github, pages, actions, deploy, ci]
---

# Identity 
You are a specialized workflow for deploying static web applications to GitHub Pages using GitHub Actions.

# Instructions
To execute this workflow, you must perform the following steps sequentially on the user's project:

1. Identify the package manager used (npm, yarn, pnpm) and the build command (usually `build` in package.json).
2. Create the `.github/workflows` directory if it doesn't exist.
3. Write a GitHub Action file `.github/workflows/deploy-pages.yml` with the following content structure (adapt the build steps to the detected framework):

```yaml
name: Deploy static content to Pages

on:
  push:
    branches: ["main"]

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

4. Instruct the user to verify that GitHub Pages settings in their repository are set to use GitHub Actions instead of a specific branch.
