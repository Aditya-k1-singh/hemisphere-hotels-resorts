const fs = require('fs');
const path = require('path');

const PARTIALS_DIR = path.join(__dirname, 'partials');
const partials = {
  header: fs.readFileSync(path.join(PARTIALS_DIR, 'header.html'), 'utf8'),
  footer: fs.readFileSync(path.join(PARTIALS_DIR, 'footer.html'), 'utf8'),
  bookingWidget: fs.readFileSync(path.join(PARTIALS_DIR, 'booking-widget.html'), 'utf8')
};

// Regex to identify the header & drawer block
const headerBlockRegex = /<a href="#main-content" class="skip-to-content">[\s\S]*?<div class="drawer-backdrop" id="mobile-drawer-backdrop"[^>]*><\/div>/;

// Recursive function to process HTML files
function processDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Skip partials, data, assets, node_modules, .git
      if (!['partials', 'assets', 'data', '.git', 'node_modules'].includes(file)) {
        processDirectory(fullPath);
      }
    } else if (file.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;

      // Replace {{HEADER}} or existing header block
      if (content.includes('{{HEADER}}')) {
        content = content.replace(/\{\{HEADER\}\}/g, partials.header);
        modified = true;
      } else if (headerBlockRegex.test(content)) {
        content = content.replace(headerBlockRegex, partials.header);
        modified = true;
      }
      
      // Replace {{FOOTER}}
      if (content.includes('{{FOOTER}}')) {
        content = content.replace(/\{\{FOOTER\}\}/g, partials.footer);
        modified = true;
      }

      // Replace {{BOOKING_WIDGET}}
      if (content.includes('{{BOOKING_WIDGET}}')) {
        content = content.replace(/\{\{BOOKING_WIDGET\}\}/g, partials.bookingWidget);
        modified = true;
      }

      // Ensure CSS has cache-buster
      if (content.includes('/assets/css/components.css')) {
        const updatedCss = content.replace(/\/assets\/css\/components\.css(\?v=[^"'\s>]+)?/g, '/assets/css/components.css?v=2.1');
        if (updatedCss !== content) {
          content = updatedCss;
          modified = true;
        }
      }

      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`[Processed] ${path.relative(__dirname, fullPath)}`);
      }
    }
  }
}

console.log('Building Hemisphere Hospitality Ecosystem...');
processDirectory(__dirname);
console.log('Build complete successfully.');
