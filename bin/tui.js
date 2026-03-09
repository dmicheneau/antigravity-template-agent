import prompts from 'prompts';
import pc from 'picocolors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { installAgents } from './installer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const manifestPath = path.join(__dirname, '..', 'manifest.json');

export async function runTUI() {
    console.log(pc.cyan(pc.bold('🪐 Welcome to Antigravity Template Agent Installer\n')));

    let manifest;
    try {
        manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    } catch (err) {
        console.error(pc.red('Error reading manifest.json'));
        process.exit(1);
    }

    const choices = [];

    // Add agents by category
    for (const category of manifest.categories) {
        const categoryAgents = Object.entries(manifest.agents)
            .filter(([id]) => id.startsWith(category.id + '/'))
            .map(([id, info]) => ({
                title: info.name,
                description: info.description,
                value: id
            }));

        if (categoryAgents.length > 0) {
            choices.push({ title: pc.bold(pc.blue(`--- ${category.name} ---`)), disabled: true });
            choices.push(...categoryAgents);
        }
    }

    const response = await prompts({
        type: 'multiselect',
        name: 'selectedAgents',
        message: 'Select the agents you want to install:',
        choices: choices,
        hint: '- Space to select. Return to submit'
    });

    if (!response.selectedAgents || response.selectedAgents.length === 0) {
        console.log(pc.yellow('No agents selected. Exiting.'));
        return;
    }

    const installDir = await prompts({
        type: 'text',
        name: 'path',
        message: 'Installation directory for workflows?',
        initial: '.agents/workflows'
    });

    if (!installDir.path) {
        console.log(pc.yellow('Installation cancelled.'));
        return;
    }

    await installAgents(response.selectedAgents, manifest, installDir.path);
}
