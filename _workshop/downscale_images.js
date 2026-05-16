// Downscale all PNGs in assets_decoded/ in-place.
//   - Resize so the longest edge <= MAX_EDGE (no upscale).
//   - Re-encode as palette PNG with quantization quality=QUALITY.
// The bundle layout is preserved (UUID filenames + image/png mime), so
// repack.js can rebuild index.html without further changes.
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const MAX_EDGE = 1600;
const QUALITY = 80;

const assetsDir = path.join(__dirname, 'assets_decoded');
const files = fs.readdirSync(assetsDir).filter(f => f.toLowerCase().endsWith('.png'));

(async () => {
  let beforeTotal = 0;
  let afterTotal = 0;
  const report = [];

  for (const name of files) {
    const p = path.join(assetsDir, name);
    const before = fs.statSync(p).size;
    beforeTotal += before;

    const img = sharp(p);
    const meta = await img.metadata();

    let pipeline = sharp(p, { failOn: 'none' });
    if (meta.width > MAX_EDGE || meta.height > MAX_EDGE) {
      pipeline = pipeline.resize({
        width: MAX_EDGE,
        height: MAX_EDGE,
        fit: 'inside',
        withoutEnlargement: true,
      });
    }
    const out = await pipeline
      .png({ quality: QUALITY, compressionLevel: 9, palette: true, effort: 10 })
      .toBuffer();

    // Only overwrite if smaller — palette mode may inflate on tiny/already-optimized PNGs.
    if (out.length < before) {
      fs.writeFileSync(p, out);
    }
    const after = fs.statSync(p).size;
    afterTotal += after;
    report.push({
      name,
      beforeKB: (before / 1024).toFixed(0),
      afterKB: (after / 1024).toFixed(0),
      savedPct: ((1 - after / before) * 100).toFixed(0) + '%',
      origW: meta.width,
      origH: meta.height,
      resized: meta.width > MAX_EDGE || meta.height > MAX_EDGE,
    });
  }

  report.sort((a, b) => Number(b.beforeKB) - Number(a.beforeKB));
  console.log('file'.padEnd(45), 'before'.padStart(8), 'after'.padStart(8), 'saved'.padStart(7), 'dims');
  for (const r of report) {
    console.log(
      r.name.padEnd(45),
      (r.beforeKB + 'KB').padStart(8),
      (r.afterKB + 'KB').padStart(8),
      r.savedPct.padStart(7),
      `${r.origW}x${r.origH}${r.resized ? ' (resized)' : ''}`
    );
  }
  console.log('---');
  console.log('Total before:', (beforeTotal / 1024 / 1024).toFixed(1), 'MB');
  console.log('Total after: ', (afterTotal / 1024 / 1024).toFixed(1), 'MB');
  console.log('Saved:       ', ((1 - afterTotal / beforeTotal) * 100).toFixed(1), '%');
})();
