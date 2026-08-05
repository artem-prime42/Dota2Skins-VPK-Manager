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

function writeManifest(name, fileName, platform) {
  const fullPath = path.join(distDir, fileName);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Artifact not found: ${fileName}`);
  }

  const manifest = {
    version,
    files: [
      {
        // use relative filename so electron-updater will resolve it against
        // the configured GitHub release download base
        url: fileName,
        sha512: sha512(fullPath),
        size: fs.statSync(fullPath).size,
      }
    ],
    path: fileName,
    sha512: sha512(fullPath),
    releaseDate: new Date().toISOString(),
    type: platform,
  };

  fs.writeFileSync(path.join(distDir, name), JSON.stringify(manifest, null, 2));
}

fs.mkdirSync(distDir, { recursive: true });
writeManifest('latest.yml', `Dota2skins-mod-manager-Setup-${version}.exe`, 'win');
writeManifest('latest-linux.yml', `${pkg.productName}-${version}-x86_64.AppImage`, 'linux');
