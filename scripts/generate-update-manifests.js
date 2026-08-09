const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const version = pkg.version;
// For electron-updater + GitHub provider the manifest `url` should be a filename
// (relative) because the updater composes the full download URL itself.
function sha512(filePath) {
  const hash = crypto.createHash('sha512');
  hash.update(fs.readFileSync(filePath));
  return hash.digest('hex');
}

function yamlScalar(value) {
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  const text = String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  return `"${text}"`;
}

function writeManifest(name, fileName, platform) {
  const fullPath = path.join(distDir, fileName);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Artifact not found: ${fileName}`);
  }

  const fileHash = sha512(fullPath);
  const fileSize = fs.statSync(fullPath).size;
  const releaseDate = new Date().toISOString();

  const manifest = [
    `version: ${yamlScalar(version)}`,
    'files:',
    `  - url: ${yamlScalar(fileName)}`,
    `    sha512: ${yamlScalar(fileHash)}`,
    `    size: ${fileSize}`,
    `path: ${yamlScalar(fileName)}`,
    `sha512: ${yamlScalar(fileHash)}`,
    `releaseDate: ${yamlScalar(releaseDate)}`,
    `type: ${yamlScalar(platform)}`,
    '',
  ].join('\n');

  fs.writeFileSync(path.join(distDir, name), manifest, 'utf8');
}

fs.mkdirSync(distDir, { recursive: true });
const manifests = [
  { name: 'latest.yml', fileName: `Dota2skins-mod-manager-Setup-${version}.exe`, platform: 'win' },
  { name: 'latest-linux.yml', fileName: `${pkg.productName}-${version}-x86_64.AppImage`, platform: 'linux' },
];
for (const manifest of manifests) {
  const fullPath = path.join(distDir, manifest.fileName);
  if (!fs.existsSync(fullPath)) {
    console.warn(`Skipping manifest generation: ${manifest.fileName} not found`);
    continue;
  }
  writeManifest(manifest.name, manifest.fileName, manifest.platform);
}
