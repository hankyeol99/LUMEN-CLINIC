const fs = require('fs');
const path = require('path');
const c = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const m = c.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/);
const tpl = JSON.parse(m[1].trim());

const lines = [];
lines.push('Template length: ' + tpl.length);
lines.push('section-head--flush? ' + tpl.includes('section-head--flush'));
lines.push('--bp-tablet? ' + tpl.includes('--bp-tablet'));
lines.push('1024px? ' + tpl.includes('max-width: 1024px'));
lines.push('640px? ' + tpl.includes('max-width: 640px'));
lines.push('880px (should be 0): ' + (tpl.match(/max-width: 880px/g) || []).length);
lines.push('980px (should be 0): ' + (tpl.match(/max-width: 980px/g) || []).length);
lines.push('600px (should be 0): ' + (tpl.match(/max-width: 600px/g) || []).length);
lines.push('700px (should be 0): ' + (tpl.match(/max-width: 700px/g) || []).length);
lines.push('hero__stat !important (should be 0): ' + (tpl.match(/hero__stat[^}]*!important/g) || []).length);
fs.writeFileSync(path.join(__dirname, 'verify.out.txt'), lines.join('\n'));
process.stdout.write('OK\n');
