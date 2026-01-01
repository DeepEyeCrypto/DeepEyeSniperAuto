
import fs from 'fs';
import path from 'path';

const packagePath = path.resolve('package.json');
const tauriConfPath = path.resolve('src-tauri/tauri.conf.json');
const publicVersionPath = path.resolve('public/version.json');
const distDir = path.resolve('public');

if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// 1. Read Package
const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const currentVer = pkg.version;
const parts = currentVer.split('.').map(Number);

// 2. Increment Patch
parts[2] += 1;
const newVer = parts.join('.');

console.log(`[AUTO-VERSION] Bumping: ${currentVer} -> ${newVer}`);

// 3. Update Package
pkg.version = newVer;
fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + '\n');

// 4. Update Tauri Conf
if (fs.existsSync(tauriConfPath)) {
    const tauri = JSON.parse(fs.readFileSync(tauriConfPath, 'utf8'));
    tauri.version = newVer;
    // Also update product name if needed, but we did that manually
    fs.writeFileSync(tauriConfPath, JSON.stringify(tauri, null, 4)); // Tauri uses 4 spaces usually
    console.log(`[AUTO-VERSION] Updated tauri.conf.json`);
}

// 5. Write Public Version File
fs.writeFileSync(publicVersionPath, JSON.stringify({ version: newVer, buildTime: new Date().toISOString() }));
console.log(`[AUTO-VERSION] Generated public/version.json`);
