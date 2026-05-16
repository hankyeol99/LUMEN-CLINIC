// Convenience wrapper: rebuild image catalog + repack bundle in one go.
// Run after dropping/replacing files in assets_decoded/images/ or after
// editing extracted_template.html / assets_decoded/<UUID>.js.
const { spawnSync } = require('child_process');
const path = require('path');

function run(script) {
  console.log('▶ ' + script);
  const r = spawnSync(process.execPath, [path.join(__dirname, script)], { stdio: 'inherit' });
  if (r.status !== 0) process.exit(r.status || 1);
}

run('add_images.js');
console.log('');
run('repack.js');
