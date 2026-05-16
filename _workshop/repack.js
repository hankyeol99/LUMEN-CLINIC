const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const dir = __dirname;
// The shipped bundle lives one level up at <project>/index.html. All
// intermediate artifacts (extracted template, decoded assets, image map)
// stay inside _workshop/ next to this script.
const wrapperPath = path.join(dir, '..', 'index.html');
const tplPath = path.join(dir, 'extracted_template.html');
const assetsDir = path.join(dir, 'assets_decoded');
const imageMapPath = path.join(assetsDir, '_image_map.json');

const wrapper = fs.readFileSync(wrapperPath, 'utf8');
let newTemplate = fs.readFileSync(tplPath, 'utf8');

// Inject the image lookup table into the template head so JSX components
// can resolve filename → UUID. The bundler runtime will then text-replace
// each UUID with its blob: URL (same mechanism used for fonts).
const imageMap = fs.existsSync(imageMapPath) ? JSON.parse(fs.readFileSync(imageMapPath, 'utf8')) : {};
const imageMapScript =
  '\n  <script>window.__lumenImages = ' +
  JSON.stringify(imageMap).split('</' + 'script>').join('<\\/' + 'script>') +
  ';</' + 'script>\n';
const markerRe = /\n?\s*<script>window\.__lumenImages =[\s\S]*?<\/script>\n?/;
if (markerRe.test(newTemplate)) {
  newTemplate = newTemplate.replace(markerRe, imageMapScript);
} else {
  newTemplate = newTemplate.replace('</head>', imageMapScript + '</head>');
}
fs.writeFileSync(tplPath, newTemplate, 'utf8');

// Parse manifest from wrapper
function findScript(type) {
  const re = new RegExp(`<script type="${type.replace(/\//g, '\\/')}">([\\s\\S]*?)<\\/script>`);
  const m = wrapper.match(re);
  if (!m) return null;
  return { raw: m[1].trim(), full: m[0] };
}

const manifestSlot = findScript('__bundler/manifest');
const templateSlot = findScript('__bundler/template');

const manifest = JSON.parse(manifestSlot.raw);

// Map UUID -> asset filename in assets_decoded
const fileMap = {};
for (const f of fs.readdirSync(assetsDir)) {
  const uuid = f.replace(/\.[^.]+$/, '');
  fileMap[uuid] = path.join(assetsDir, f);
}

// Rewrite each manifest entry from the (possibly-edited) on-disk file.
let updated = 0;
for (const [uuid, entry] of Object.entries(manifest)) {
  const filePath = fileMap[uuid];
  if (!filePath) {
    console.warn('No file for', uuid);
    continue;
  }
  const bytes = fs.readFileSync(filePath);
  let payload = bytes;
  if (entry.compressed) payload = zlib.gzipSync(bytes);
  const b64 = payload.toString('base64');
  if (b64 !== entry.data) updated++;
  entry.data = b64;
}
console.log('Manifest entries rewritten:', updated, '/', Object.keys(manifest).length);

// Add new image assets (referenced from _image_map.json) that aren't yet in
// the manifest. PNG/JPG are already DEFLATE-compressed internally so we skip
// gzip — the savings are negligible and decode is faster.
let added = 0;
for (const [name, meta] of Object.entries(imageMap)) {
  if (!meta.uuid) continue;
  if (manifest[meta.uuid]) continue;
  const candidate = fileMap[meta.uuid];
  if (!candidate) {
    console.warn('Image listed in map but no file found:', name, meta.uuid);
    continue;
  }
  const bytes = fs.readFileSync(candidate);
  manifest[meta.uuid] = {
    mime: meta.mime || 'image/png',
    compressed: false,
    data: bytes.toString('base64'),
  };
  added++;
}
console.log('Image assets added:', added);

// JSON inside an HTML <script> must escape </script> to <\/script> so the
// outer script tag isn't closed prematurely. \/ is a valid JSON escape.
const escapeForScript = (s) => s.replace(/<\/script>/gi, '<\\/script>');

const newManifestRaw = escapeForScript(JSON.stringify(manifest));
const newTemplateRaw = escapeForScript(JSON.stringify(newTemplate));

let out = wrapper.replace(manifestSlot.full,
  `<script type="__bundler/manifest">\n${newManifestRaw}\n  </script>`);
out = out.replace(templateSlot.full,
  `<script type="__bundler/template">\n${newTemplateRaw}\n  </script>`);

fs.writeFileSync(wrapperPath, out, 'utf8');
console.log('Wrote updated bundler to', wrapperPath);
console.log('Final size:', (out.length / 1024).toFixed(1), 'KB');
