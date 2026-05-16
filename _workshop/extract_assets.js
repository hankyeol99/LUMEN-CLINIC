const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const file = path.join(__dirname, '..', 'index.html');
const content = fs.readFileSync(file, 'utf8');

function getScript(type) {
  const re = new RegExp(`<script type="${type.replace(/\//g, '\\/')}">([\\s\\S]*?)<\\/script>`);
  const m = content.match(re);
  return m ? JSON.parse(m[1].trim()) : null;
}

const manifest = getScript('__bundler/manifest');
const extRes = getScript('__bundler/ext_resources') || [];

console.log('Total assets:', Object.keys(manifest).length);
console.log('Ext resources count:', extRes.length);

// List ext resources by name+id
extRes.forEach(r => {
  const m = manifest[r.uuid];
  if (m) console.log(`${r.uuid}  type=${m.mime}  name=${r.id}  size=${m.data.length}`);
});

// Decode all assets and save as files
const outDir = path.join(__dirname, 'assets_decoded');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

const uuidToName = {};
extRes.forEach(r => { uuidToName[r.uuid] = r.id; });

for (const [uuid, entry] of Object.entries(manifest)) {
  let bytes = Buffer.from(entry.data, 'base64');
  if (entry.compressed) bytes = zlib.gunzipSync(bytes);
  const name = uuidToName[uuid] || uuid;
  const safe = name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const ext = entry.mime.includes('javascript') ? '.js'
            : entry.mime.includes('json') ? '.json'
            : entry.mime.includes('woff2') ? '.woff2'
            : entry.mime.includes('jpeg') || entry.mime.includes('jpg') ? '.jpg'
            : entry.mime.includes('png') ? '.png'
            : entry.mime.includes('svg') ? '.svg'
            : '';
  const outPath = path.join(outDir, safe + ext);
  fs.writeFileSync(outPath, bytes);
}
console.log('Decoded all assets to', outDir);
