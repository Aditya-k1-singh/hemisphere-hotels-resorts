const fs = require('fs');
const path = require('path');

const PARTIALS_DIR = path.join(__dirname, 'partials');
const partials = {
  header: fs.readFileSync(path.join(PARTIALS_DIR, 'header.html'), 'utf8').trim(),
  footer: fs.readFileSync(path.join(PARTIALS_DIR, 'footer.html'), 'utf8').trim(),
  bookingWidget: fs.readFileSync(path.join(PARTIALS_DIR, 'booking-widget.html'), 'utf8').trim()
};

// Regex to identify the header & drawer block (including any trailing blank lines)
const headerBlockRegex = /<a href="#main-content" class="skip-to-content">[\s\S]*?<div class="drawer-backdrop" id="mobile-drawer-backdrop"[^>]*><\/div>\s*/;

// Regex to identify existing footer block (including script)
const footerBlockRegex = /<footer class="site-footer"[\s\S]*?<\/footer>(\s*<script>[\s\S]*?footer-year[\s\S]*?<\/script>)?\s*/;

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
      const originalContent = fs.readFileSync(fullPath, 'utf8');
      let content = originalContent;

      // Replace {{HEADER}} or existing header block
      if (content.includes('{{HEADER}}')) {
        content = content.replace(/\{\{HEADER\}\}/g, partials.header + '\n\n');
      } else if (headerBlockRegex.test(content)) {
        content = content.replace(headerBlockRegex, partials.header + '\n\n');
      }
      
      // Replace {{FOOTER}} or existing footer block
      if (content.includes('{{FOOTER}}')) {
        content = content.replace(/\{\{FOOTER\}\}/g, partials.footer + '\n\n');
      } else if (footerBlockRegex.test(content)) {
        content = content.replace(footerBlockRegex, partials.footer + '\n\n');
      }

      // Replace {{BOOKING_WIDGET}}
      if (content.includes('{{BOOKING_WIDGET}}')) {
        content = content.replace(/\{\{BOOKING_WIDGET\}\}/g, partials.bookingWidget);
      }

      // Ensure CSS has cache-buster
      if (content.includes('/assets/css/components.css')) {
        content = content.replace(/\/assets\/css\/components\.css(\?v=[^"'\s>]+)?/g, '/assets/css/components.css?v=2.1');
      }

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`[Processed] ${path.relative(__dirname, fullPath)}`);
      }
    }
  }
}

console.log('Building Hemisphere Hospitality Ecosystem...');
processDirectory(__dirname);
console.log('Build complete successfully.');

