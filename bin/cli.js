#!/usr/bin/env node

import { runTUI } from './tui.js';
import { installItems } from './installer.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const manifestPath = path.join(__dirname, '..', 'manifest.json');

const args = process.argv.slice(2);

async function main() {
  if (args.length === 0 || args[0] === 'tui') {
    await runTUI();
  } else if (args[0] === 'install') {
    const itemsToInstall = args.slice(1);
    if (itemsToInstall.length === 0) {
      console.log('Error: Please specify at least one workflow or skill ID to install.');
      process.exit(1);
    }

    let manifest;
    try {
      manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    } catch (err) {
      console.error('Error reading manifest.json');
      process.exit(1);
    }

    const selections = [];
    for (const id of itemsToInstall) {
      if (manifest.workflows && manifest.workflows[id]) {
        selections.push({ id, type: 'workflow' });
      } else if (manifest.skills && manifest.skills[id]) {
        selections.push({ id, type: 'skill' });
      } else {
        console.error(`Error: item '${id}' not found in manifest workflows or skills.`);
      }
    }

    if (selections.length > 0) {
      await installItems(selections, manifest);
    }
  } else {
    console.log('Usage:');
    console.log('  npx antigravity-template-agent tui');
    console.log('  npx antigravity-template-agent install <workflow-id>|<skill-id>...');
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
