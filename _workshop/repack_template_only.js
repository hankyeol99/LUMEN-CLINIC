// Lightweight repack: only updates the template script, not the asset manifest.
// Use this when you've only edited extracted_template.html (no JSX changes).
const fs = require('fs');
const path = require('path');

const dir = __dirname;
const wrapperPath = path.join(dir, '..', 'index.html');
const tplPath = path.join(dir, 'extracted_template.html');

const wrapper = fs.readFileSync(wrapperPath, 'utf8');
const newTemplate = fs.readFileSync(tplPath, 'utf8');

const tplRe = /<script type="__bundler\/template">([\s\S]*?)<\/script>/;
const m = wrapper.match(tplRe);
if (!m) { console.error('no template tag'); process.exit(1); }

// JSON inside an HTML <script> must escape </script> to <\/script>.
const escapeForScript = (s) => s.replace(/<\/script>/gi, '<\\/script>');
const newTemplateRaw = escapeForScript(JSON.stringify(newTemplate));

const out = wrapper.replace(m[0],
  `<script type="__bundler/template">\n${newTemplateRaw}\n  </script>`);

fs.writeFileSync(wrapperPath, out, 'utf8');
console.log('Updated template only. Final size:', (out.length / 1024).toFixed(1), 'KB');
