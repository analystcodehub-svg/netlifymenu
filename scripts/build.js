const fs = require('fs').promises;
const path = require('path');

async function copyDir(src, dest) {
  await fs.rm(dest, { recursive: true, force: true });
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) await copyDir(srcPath, destPath);
    else await fs.copyFile(srcPath, destPath);
  }
}

async function build() {
  const src = path.join(__dirname, '..', 'public');
  const dest = path.join(__dirname, '..', 'dist');
  try {
    await copyDir(src, dest);
    // Add a Netlify _redirects file to ensure client-side routing works (optional)
    const redirects = `# Redirect all to index for client-side routing\n/* /index.html 200`;
    await fs.writeFile(path.join(dest, '_redirects'), redirects);
    console.log('Build complete. dist/ is ready for Netlify.');
  } catch (err) {
    console.error('Build failed:', err);
    process.exit(1);
  }
}

build();
