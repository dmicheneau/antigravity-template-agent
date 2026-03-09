import fs from 'fs';
import path from 'path';
import pc from 'picocolors';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

export async function installAgents(agentIds, manifest, targetDirStr) {
    const targetDir = path.resolve(process.cwd(), targetDirStr);

    if (!fs.existsSync(targetDir)) {
        console.log(pc.gray(`Creating directory ${targetDirStr}...`));
        fs.mkdirSync(targetDir, { recursive: true });
    }

    let installedCount = 0;

    for (const id of agentIds) {
        const agentInfo = manifest.agents[id];
        if (!agentInfo) {
            console.log(pc.red(`Agent ${id} not found in manifest.`));
            continue;
        }

        const sourcePath = path.join(projectRoot, agentInfo.path);
        if (!fs.existsSync(sourcePath)) {
            console.log(pc.red(`Source file for ${id} not found: ${agentInfo.path}`));
            continue;
        }

        const destFileName = path.basename(agentInfo.path);
        const destPath = path.join(targetDir, destFileName);

        try {
            fs.copyFileSync(sourcePath, destPath);
            console.log(pc.green(`✓ Installed ${agentInfo.name} -> ${path.join(targetDirStr, destFileName)}`));
            installedCount++;
        } catch (err) {
            console.error(pc.red(`✗ Failed to install ${id}`), err.message);
        }
    }

    console.log(pc.cyan(`\n🎉 Successfully installed ${installedCount} agent(s).`));
}
