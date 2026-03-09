import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spinner, log, confirm } from '@clack/prompts';
import pc from 'picocolors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

export async function installItems(selections, manifest) {
    const cwd = process.cwd();
    const errors = [];
    let installedWorkflows = 0;
    let installedSkills = 0;
    let skippedItems = 0;

    for (const selection of selections) {
        const { id, type } = selection; // type is 'workflow' or 'skill'
        const itemInfo = manifest[type + 's'][id];

        if (!itemInfo) {
            errors.push(`${type} ${id} not found in manifest.`);
            continue;
        }

        const sourcePath = path.join(projectRoot, itemInfo.path);
        if (!fs.existsSync(sourcePath)) {
            errors.push(`Source for ${id} not found: ${itemInfo.path}`);
            continue;
        }

        const destDir = path.join(cwd, '.agents', type + 's');
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }

        const destFileName = path.basename(itemInfo.path);
        const destPath = path.join(destDir, destFileName);
        const niceName = itemInfo.name || id;

        // --- OVERWRITE DETECTION ---
        if (fs.existsSync(destPath)) {
            const shouldOverwrite = await confirm({
                message: `${pc.yellow('Warning:')} The ${type} "${pc.bold(niceName)}" is already installed at \n${pc.dim(destPath)}\n${pc.white('Do you want to overwrite it? (Any local changes will be lost)')}`,
                initialValue: false
            });

            if (!shouldOverwrite) {
                log.step(`${pc.dim('Skipped')} ${niceName}`);
                skippedItems++;
                continue; // Skip this iteration
            }
        }

        // Install logic
        const s = spinner();
        s.start(`Installing ${niceName}...`);

        try {
            // Use cpSync to handle both single Markdown files (Workflows) and full Directories (Skills)
            fs.cpSync(sourcePath, destPath, { recursive: true });

            s.stop(`${pc.green('Installed')} ${type}: ${niceName}`);
            await new Promise(r => setTimeout(r, 200));

            if (type === 'workflow') installedWorkflows++;
            if (type === 'skill') installedSkills++;

        } catch (err) {
            s.stop(`${pc.red('Failed')} to install ${niceName}`);
            errors.push(`Failed to install ${id}: ${err.message}`);
        }
    }

    if (errors.length > 0) {
        log.error(`Encountered ${errors.length} error(s):`);
        errors.forEach(e => log.warn(e));
    } else if (installedWorkflows > 0 || installedSkills > 0) {
        let msg = [];
        if (installedWorkflows > 0) msg.push(`${installedWorkflows} Workflow(s)`);
        if (installedSkills > 0) msg.push(`${installedSkills} Skill(s)`);
        log.success(`Successfully installed ${msg.join(' and ')}.`);
    }

    if (skippedItems > 0) {
        log.info(`${skippedItems} item(s) were skipped.`);
    }
}
