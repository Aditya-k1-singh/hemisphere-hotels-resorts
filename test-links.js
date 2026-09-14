/**
 * Hemisphere Hotels & Resorts — Pre-deployment Integrity Test
 * Verifies all 29 HTML pages for broken links, missing scripts, and missing assets.
 */
const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;

function getHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      if (!['node_modules', '.git', 'partials'].includes(file)) {
        results = results.concat(getHtmlFiles(filePath));
      }
    } else if (file.endsWith('.html')) {
      results.push(filePath);
    }
  });
  return results;
}

const htmlFiles = getHtmlFiles(ROOT_DIR);
console.log(`[Test] Auditing ${htmlFiles.length} HTML pages in portfolio...`);

let errors = 0;
let totalCheckedLinks = 0;
let totalCheckedAssets = 0;

function checkPath(relUrl) {
  let clean = relUrl.split('?')[0].split('#')[0];
  if (clean.endsWith('/')) clean += 'index.html';
  let target = path.join(ROOT_DIR, clean);
  if (fs.existsSync(target)) return true;
  if (fs.existsSync(path.join(ROOT_DIR, clean, 'index.html'))) return true;
  if (fs.existsSync(path.join(ROOT_DIR, clean + '.html'))) return true;
  return false;
}

htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const relPath = path.relative(ROOT_DIR, file);

  // Check all internal href links
  const hrefMatches = [...content.matchAll(/href="(\/[^"#?]*)/g)];
  hrefMatches.forEach(m => {
    const url = m[1];
    if (url === '/' || url === '') return;
    totalCheckedLinks++;
    if (!checkPath(url)) {
      console.error(`  [FAIL] Broken Link: ${url} in ${relPath}`);
      errors++;
    }
  });

  // Check all internal src assets (scripts, images)
  const srcMatches = [...content.matchAll(/src="(\/[^"#?]*)/g)];
  srcMatches.forEach(m => {
    const url = m[1];
    totalCheckedAssets++;
    if (!checkPath(url)) {
      console.error(`  [FAIL] Broken Asset: ${url} in ${relPath}`);
      errors++;
    }
  });
});

console.log(`[Test] Checked ${totalCheckedLinks} internal links and ${totalCheckedAssets} assets.`);

if (errors > 0) {
  console.error(`\n[FAILED] Found ${errors} issues. Resolve them before deploying.`);
  process.exit(1);
} else {
  console.log(`\n[PASS] All links and assets validated successfully. 100% deployment ready!`);
  process.exit(0);
}
