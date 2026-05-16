// Adds image assets to the bundler manifest with stable UUIDs derived from
// filename, so re-runs are deterministic. Writes both:
//   1. assets_decoded/<filename>.<ext>  (mirror copy for the repack pipeline)
//   2. assets_decoded/_image_map.json   (filename -> UUID lookup, embedded
//      into the template at repack time as window.__lumenImages)
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const dir = __dirname;
const imagesDir = path.join(dir, 'assets_decoded', 'images');
const assetsDir = path.join(dir, 'assets_decoded');

// Stable UUID v5-style derivation from a name (so reruns produce same UUID).
function stableUuid(name) {
  const h = crypto.createHash('sha1').update('lumen-image:' + name).digest('hex');
  // Format as UUID. Set version 5 nibble.
  return (
    h.slice(0, 8) + '-' + h.slice(8, 12) + '-5' + h.slice(13, 16) + '-' +
    ((parseInt(h.slice(16, 18), 16) & 0x3f | 0x80).toString(16)) + h.slice(18, 20) + '-' +
    h.slice(20, 32)
  );
}

const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' };

// Catalog: filename → required-or-optional, with alt text. The keys are the
// "logical names" used in JSX. Filenames are determined by adding an extension.
const catalog = [
  { name: 'hero-treatment-room',   alt: '청담 LUMEN 클리닉 트리트먼트 룸 — 자연광과 스톤 인테리어' },
  { name: 'hero-treatment-suite',  alt: '웜 베이지 트리트먼트 스위트' },
  { name: 'hero-counter',          alt: '제품 카운터와 디스플레이 영역' },
  { name: 'hero-lounge',           alt: '클리닉 라운지 — 부클레 소파와 라운드 테이블' },
  { name: 'hero-detail-ceramic',   alt: '세라믹 베젤 디테일' },
  { name: 'hero-detail-linen',     alt: '리넨 스워치 텍스처' },

  { name: 'philosophy-balance',       alt: '균형의 회복 — 피부 본연의 흐름' },
  { name: 'philosophy-consultation',  alt: '상태 우선의 1:1 상담' },
  { name: 'philosophy-personal-plan', alt: '개인 맞춤 케어 플랜' },
  { name: 'philosophy-private-space', alt: '프라이빗한 케어 공간' },

  { name: 'program-skin-balance', alt: '스킨 밸런스 케어' },
  { name: 'program-tone-texture', alt: '톤 & 텍스처 케어' },
  { name: 'program-anti-aging',   alt: '안티에이징 케어' },
  { name: 'program-pore-sebum',   alt: '모공 & 유분 케어' },
  { name: 'program-sensitive',    alt: '민감 피부 케어' },
  { name: 'program-post-care',    alt: '포스트 케어 프로그램' },

  { name: 'space-reception',      alt: '리셉션 공간' },
  { name: 'space-consultation',   alt: '상담실' },
  { name: 'space-care-room-a',    alt: '케어룸 A' },
  { name: 'space-care-room-b',    alt: '케어룸 B' },
  { name: 'space-powder-room',    alt: '파우더룸' },
  { name: 'space-lounge',         alt: '라운지' },

  { name: 'concerns-pigmentation', alt: '색소 침착 — 기미 · 잡티 · 흉터 자국' },
  { name: 'concerns-acne',         alt: '여드름 · 흉터 — 활동성 여드름과 자국' },
  { name: 'concerns-pores',        alt: '모공 · 유분 — 확장 모공과 블랙헤드' },
  { name: 'concerns-aging',        alt: '노화 · 탄력 저하 — 잔주름과 처짐' },
  { name: 'concerns-sensitivity',  alt: '민감 · 홍조 — 붉어짐과 자극 반응' },
  { name: 'concerns-lifting',      alt: '리프팅 · 윤곽 — 처진 윤곽과 늘어진 피부' },
];

const map = {};

for (const entry of catalog) {
  // Look for an actual image file in images/<name>.<ext>
  let foundExt = null;
  for (const ext of ['.png', '.jpg', '.jpeg', '.webp']) {
    const p = path.join(imagesDir, entry.name + ext);
    if (fs.existsSync(p)) { foundExt = ext; break; }
  }

  if (!foundExt) {
    // No file yet — placeholder slot. Record null so JSX falls back to pattern.
    map[entry.name] = { uuid: null, alt: entry.alt, ext: null };
    continue;
  }

  const uuid = stableUuid(entry.name);
  // Mirror to assets_decoded/<uuid>.<ext> for repack to pick up.
  const src = path.join(imagesDir, entry.name + foundExt);
  const dst = path.join(assetsDir, uuid + foundExt);
  fs.copyFileSync(src, dst);
  map[entry.name] = { uuid, alt: entry.alt, ext: foundExt, mime: MIME[foundExt] };
}

fs.writeFileSync(path.join(assetsDir, '_image_map.json'), JSON.stringify(map, null, 2), 'utf8');
console.log('Image map (' + Object.keys(map).length + ' slots):');
for (const [k, v] of Object.entries(map)) {
  console.log('  ' + k.padEnd(24) + (v.uuid ? v.uuid : '— (placeholder)'));
}
