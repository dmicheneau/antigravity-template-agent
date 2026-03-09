import { intro, outro, select, multiselect, isCancel, cancel, note } from '@clack/prompts';
import pc from 'picocolors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { installItems } from './installer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const manifestPath = path.join(__dirname, '..', 'manifest.json');

export async function runTUI() {
    console.clear();
    intro(pc.bgMagenta(pc.black(pc.bold(' 🪐 ANTIGRAVITY AGENTS '))) + ' - ' + pc.blue('Workflow & Skill Installer'));

    let manifest;
    try {
        manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    } catch (err) {
        cancel(pc.red('Failed to read manifest.json. Is the template repository corrupted?'));
        process.exit(1);
    }

    const installType = await select({
        message: 'What do you want to install into your Antigravity environment?',
        options: [
            { value: 'workflows', label: '📄 Workflows', hint: 'Step-by-step procedural instructions (.md)' },
            { value: 'skills', label: '🛠  Skills', hint: 'Advanced capabilities with executable scripts (Directories)' }
        ]
    });

    if (isCancel(installType)) {
        cancel('Operation cancelled.');
        process.exit(0);
    }

    const options = [];
    const items = manifest[installType];

    if (!items || Object.keys(items).length === 0) {
        cancel(`No ${installType} available in the repository.`);
        process.exit(0);
    }

    for (const [id, info] of Object.entries(items)) {
        options.push({
            value: { id, type: installType === 'workflows' ? 'workflow' : 'skill' },
            label: info.name,
            hint: `${pc.dim(info.category)} · ${info.description}`
        });
    }

    const selections = await multiselect({
        message: `Select the ${installType} you want to install:`,
        options: options,
        required: true
    });

    if (isCancel(selections)) {
        cancel('Operation cancelled.');
        process.exit(0);
    }

    note(`Will automatically install to .agents/${installType}/`, 'Destination');

    await installItems(selections, manifest);

    outro(pc.green('🚀 All done! Ready for takeoff.'));
}
