#!/usr/bin/env node

import { runTUI } from './tui.js';
import { installAgents } from './installer.js';
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
    const agentsToInstall = args.slice(1);
    if (agentsToInstall.length === 0) {
      console.log('Error: Please specify at least one agent ID to install.');
      process.exit(1);
    }
    
    let manifest;
    try {
      manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    } catch (err) {
      console.error('Error reading manifest.json');
      process.exit(1);
    }
    
    const targetDir = process.env.ANTIGRAVITY_AGENT_DIR || '.agents/workflows';
    await installAgents(agentsToInstall, manifest, targetDir);
  } else {
    console.log('Usage:');
    console.log('  npx antigravity-template-agent tui');
    console.log('  npx antigravity-template-agent install <agent-id1> [agent-id2...]');
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
