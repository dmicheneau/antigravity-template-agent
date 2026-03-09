import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spinner, log } from '@clack/prompts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

export async function installItems(selections, manifest) {
    const cwd = process.cwd();
    const errors = [];
    let installedWorkflows = 0;
    let installedSkills = 0;

    const s = spinner();
    s.start(`Preparing installation...`);

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

        try {
            // Use cpSync to handle both single Markdown files (Workflows) and full Directories (Skills)
            fs.cpSync(sourcePath, destPath, { recursive: true });

            const niceName = itemInfo.name || id;
            s.message(`Installed ${type}: ${niceName}`);
            await new Promise(r => setTimeout(r, 200));

            if (type === 'workflow') installedWorkflows++;
            if (type === 'skill') installedSkills++;

        } catch (err) {
            errors.push(`Failed to install ${id}: ${err.message}`);
        }
    }

    s.stop(`Finished processing items.`);

    if (errors.length > 0) {
        log.error(`Encountered ${errors.length} error(s):`);
        errors.forEach(e => log.warn(e));
    } else {
        if (installedWorkflows > 0) log.success(`Installed ${installedWorkflows} Workflow(s) into .agents/workflows/`);
        if (installedSkills > 0) log.success(`Installed ${installedSkills} Skill(s) into .agents/skills/`);
    }
}
