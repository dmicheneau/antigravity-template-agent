import fs from 'fs';
import path from 'path';
import pc from 'picocolors';
import { fileURLToPath } from 'url';
import { spinner, log } from '@clack/prompts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

export async function installAgents(agentIds, manifest, targetDirStr) {
    const targetDir = path.resolve(process.cwd(), targetDirStr);

    const s = spinner();
    s.start(`Preparing to install to ${targetDirStr}`);

    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }

    let installedCount = 0;
    const errors = [];

    for (const id of agentIds) {
        const agentInfo = manifest.agents[id];
        if (!agentInfo) {
            errors.push(`Agent ${id} not found in manifest.`);
            continue;
        }

        const sourcePath = path.join(projectRoot, agentInfo.path);
        if (!fs.existsSync(sourcePath)) {
            errors.push(`Source file for ${id} not found: ${agentInfo.path}`);
            continue;
        }

        const destFileName = path.basename(agentInfo.path);
        const destPath = path.join(targetDir, destFileName);

        try {
            fs.copyFileSync(sourcePath, destPath);
            s.message(`Installed ${agentInfo.name} workflow`);
            // Add a slight delay to allow the beautiful spinner to be perceived
            await new Promise(r => setTimeout(r, 200));
            installedCount++;
        } catch (err) {
            errors.push(`Failed to install ${id}: ${err.message}`);
        }
    }

    s.stop(`Finished processing ${installedCount} agent(s).`);

    if (errors.length > 0) {
        log.error(`Encountered ${errors.length} error(s):`);
        errors.forEach(e => log.warn(e));
    } else if (installedCount > 0) {
        log.success(`Successfully installed ${installedCount} workflow(s) to ${targetDirStr}.`);
    }
}
