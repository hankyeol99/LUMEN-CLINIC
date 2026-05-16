const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'index.html');
const content = fs.readFileSync(file, 'utf8');

const re = /<script type="__bundler\/template">([\s\S]*?)<\/script>/;
const m = content.match(re);
if (!m) {
  console.error('template tag not found');
  process.exit(1);
}
const raw = m[1].trim();
const template = JSON.parse(raw);
fs.writeFileSync(path.join(__dirname, 'extracted_template.html'), template, 'utf8');
console.log('template length:', template.length);
console.log('saved extracted_template.html');
