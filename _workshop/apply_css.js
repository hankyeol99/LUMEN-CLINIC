const fs = require('fs');
const path = require('path');

const tplPath = path.join(__dirname, 'extracted_template.html');
const cssPath = path.join(__dirname, 'new_css.txt');

const tpl = fs.readFileSync(tplPath, 'utf8');
const newCss = fs.readFileSync(cssPath, 'utf8');

// Find boundaries: from ":root {" within the first <style> block to the
// final </style> of the third <style> block, replace with newCss + close.
// Strategy: split lines, keep lines 1..3140 (font-face still inside <style>),
// then inject blank + new CSS, then close with </style>, then keep tail.
const lines = tpl.split(/\r?\n/);

// Verify boundaries
if (!lines[3140].startsWith(':root')) {
  console.error('Expected :root at line 3141 (idx 3140), got:', JSON.stringify(lines[3140]));
  process.exit(1);
}
if (!lines[4129].startsWith('</style>')) {
  console.error('Expected </style> at line 4130 (idx 4129), got:', JSON.stringify(lines[4129]));
  process.exit(1);
}

const head = lines.slice(0, 3140); // lines 1..3140 (incl blank line 3140)
const tail = lines.slice(4130);    // line 4131 onward (the </head> etc)

const out = head.join('\n') + '\n' + newCss + '</style>\n' + tail.join('\n');
fs.writeFileSync(path.join(__dirname, 'extracted_template.html'), out, 'utf8');
console.log('OK. Lines before:', lines.length, 'after:', out.split('\n').length);
