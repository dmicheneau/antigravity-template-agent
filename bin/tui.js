import { intro, outro, select, multiselect, text, isCancel, cancel, note } from '@clack/prompts';
import pc from 'picocolors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { installAgents } from './installer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const manifestPath = path.join(__dirname, '..', 'manifest.json');

export async function runTUI() {
    console.clear();

    intro(pc.bgMagenta(pc.black(pc.bold(' 🪐 ANTIGRAVITY AGENTS '))) + ' - ' + pc.blue('Workflow Installer'));

    let manifest;
    try {
        manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    } catch (err) {
        cancel(pc.red('Failed to read manifest.json. Is the template repository corrupted?'));
        process.exit(1);
    }

    const installMode = await select({
        message: 'What do you want to install?',
        options: [
            { value: 'agents', label: '🤖 Individual Agents', hint: 'Pick specific workflows from our categories' },
            { value: 'packs', label: '📦 Agent Packs', hint: 'Install pre-configured bundles for specific roles' }
        ]
    });

    if (isCancel(installMode)) {
        cancel('Operation cancelled.');
        process.exit(0);
    }

    let selectedAgents = [];

    if (installMode === 'packs') {
        const packOptions = manifest.packs.map(pack => ({
            value: pack.agents,
            label: pack.name,
            hint: pack.description
        }));

        const selectedPacks = await multiselect({
            message: 'Select the packs you want to install:',
            options: packOptions,
            required: true
        });

        if (isCancel(selectedPacks)) {
            cancel('Operation cancelled.');
            process.exit(0);
        }

        // Flatten the selected arrays of agents into a Set to avoid duplicates
        const finalSet = new Set();
        for (const group of selectedPacks) {
            group.forEach(agentId => finalSet.add(agentId));
        }
        selectedAgents = Array.from(finalSet);

    } else {
        // Individual agents mode
        const agentOptions = [];

        for (const category of manifest.categories) {
            const categoryAgents = Object.entries(manifest.agents)
                .filter(([id]) => id.startsWith(category.id + '/'))
                .map(([id, info]) => ({
                    value: id,
                    label: info.name,
                    hint: `${pc.dim(category.name)} · ${info.description}`
                }));

            if (categoryAgents.length > 0) {
                agentOptions.push(...categoryAgents);
            }
        }

        selectedAgents = await multiselect({
            message: 'Select the agents you want to install:',
            options: agentOptions,
            required: true
        });

        if (isCancel(selectedAgents)) {
            cancel('Operation cancelled.');
            process.exit(0);
        }
    }

    const installDir = await text({
        message: 'Where should we install these agents?',
        initialValue: '.agents/workflows',
        placeholder: '.agents/workflows'
    });

    if (isCancel(installDir)) {
        cancel('Operation cancelled.');
        process.exit(0);
    }

    note(`Installing ${selectedAgents.length} agent(s) into ${installDir}`, 'Ready to install');

    await installAgents(selectedAgents, manifest, installDir);

    outro(pc.green('🚀 All done! Your workflows are installed and ready to use.'));
}
