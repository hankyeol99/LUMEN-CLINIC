const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const c = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

const mfRe = /<script type="__bundler\/manifest">([\s\S]*?)<\/script>/;
const m = c.match(mfRe);
const manifest = JSON.parse(m[1].trim());

const lines = [];
const targetUuids = {
  '65cbe0b8-637d-4a39-9ad0-97c6355b8eb1': 'GNB+Hero',
  '0d34e8ff-4cfa-4845-8481-7284db083d76': 'Philosophy+Program',
  'd83eb392-a258-49f1-923b-56f98d5d1e4a': 'Process+Space+Care',
  '3b8a72fc-9f8e-43df-870a-52d722185709': 'Contact+Footer',
};

const checks = [
  ['65cbe0b8-637d-4a39-9ad0-97c6355b8eb1', 'aria-expanded={mobileOpen}', 'GNB burger aria-expanded'],
  ['65cbe0b8-637d-4a39-9ad0-97c6355b8eb1', 'aria-current=', 'GNB nav aria-current'],
  ['65cbe0b8-637d-4a39-9ad0-97c6355b8eb1', '<ul className="hero__stats"', 'Hero stats <ul>'],
  ['65cbe0b8-637d-4a39-9ad0-97c6355b8eb1', 'type="button"', 'GNB type="button"'],
  ['0d34e8ff-4cfa-4845-8481-7284db083d76', '<blockquote className="philosophy__quote"', 'Philosophy <blockquote>'],
  ['0d34e8ff-4cfa-4845-8481-7284db083d76', 'role="tab"', 'Program tablist'],
  ['d83eb392-a258-49f1-923b-56f98d5d1e4a', '<ol className="process__rows"', 'Process <ol>'],
  ['d83eb392-a258-49f1-923b-56f98d5d1e4a', '<h3 className="process__title-en"', 'Process h3 heading'],
  ['d83eb392-a258-49f1-923b-56f98d5d1e4a', 'aria-expanded={isOpen}', 'CareFocus aria-expanded'],
  ['d83eb392-a258-49f1-923b-56f98d5d1e4a', 'section-head--flush', 'Space flush class'],
  ['3b8a72fc-9f8e-43df-870a-52d722185709', 'href="#about"', 'Footer about link'],
  ['3b8a72fc-9f8e-43df-870a-52d722185709', 'foot__logo-mark', 'Footer logo class'],
  ['3b8a72fc-9f8e-43df-870a-52d722185709', '<address className="foot__col"', 'Footer address tag'],
];

for (const [uuid, needle, label] of checks) {
  const entry = manifest[uuid];
  let bytes = Buffer.from(entry.data, 'base64');
  if (entry.compressed) bytes = zlib.gunzipSync(bytes);
  const text = bytes.toString('utf8');
  const ok = text.includes(needle);
  lines.push((ok ? 'OK ' : 'FAIL ') + label + '  (' + targetUuids[uuid] + ')');
}

// negatives
const neg = [
  ['3b8a72fc-9f8e-43df-870a-52d722185709', "style={{ padding: 0 }}", 'No inline style on contact intro'],
  ['3b8a72fc-9f8e-43df-870a-52d722185709', "fontSize: 56", 'No inline style on logo'],
  ['d83eb392-a258-49f1-923b-56f98d5d1e4a', "<div\n              key={f.n}", 'CareFocus is no longer div+onClick (heuristic)'],
];
for (const [uuid, needle, label] of neg) {
  const entry = manifest[uuid];
  let bytes = Buffer.from(entry.data, 'base64');
  if (entry.compressed) bytes = zlib.gunzipSync(bytes);
  const text = bytes.toString('utf8');
  const ok = !text.includes(needle);
  lines.push((ok ? 'OK ' : 'FAIL ') + label + '  (' + targetUuids[uuid] + ')');
}

fs.writeFileSync(path.join(__dirname, 'verify_jsx.out.txt'), lines.join('\n'));
process.stdout.write('done\n');
