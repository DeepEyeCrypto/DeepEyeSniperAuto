
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Helper to run commands
const run = (cmd) => {
    console.log(`> ${cmd}`);
    execSync(cmd, { stdio: 'inherit' });
};

try {
    // 1. Bump Version
    run('node scripts/bump_version.js');

    // 2. Read New Version
    const pkg = JSON.parse(fs.readFileSync(path.resolve('package.json'), 'utf8'));
    const version = `v${pkg.version}`;

    // 3. Git Operations
    console.log(`[SHIP] Committing and Tagging ${version}...`);
    run('git add .');
    run(`git commit -m "chore(release): ${version}"`);
    run(`git tag ${version}`);

    // 4. Push
    console.log(`[SHIP] Pushing to origin...`);
    run('git push origin main --tags');

    console.log(`[SHIP] 🚀 Released ${version} successfully! GitHub Action should trigger.`);
} catch (e) {
    console.error(`[SHIP] Error: ${e.message}`);
    process.exit(1);
}
