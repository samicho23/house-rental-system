/**
 * Generates flat-design SVG illustrations for property photos.
 * Run: bun scripts/gen-images.ts
 */
import fs from "node:fs";
import path from "node:path";

const OUT = new URL("../../public/images", import.meta.url).pathname;
fs.mkdirSync(OUT, { recursive: true });

function house(width = 460, height = 200, wall = "#e8e2d5", roof = "#b5543b") {
  return `
  <g>
    <rect x="120" y="${height + 60 - height}" width="220" height="120" rx="4" fill="${wall}"/>
    <polygon points="100,${140} 230,${60} 360,${140}" fill="${roof}"/>
    <rect x="205" y="180" width="50" height="80" rx="3" fill="#7c5a43"/>
    <circle cx="247" cy="222" r="3" fill="#e8c37a"/>
    <rect x="140" y="170" width="46" height="46" rx="3" fill="#9fc4d8"/>
    <rect x="275" y="170" width="46" height="46" rx="3" fill="#9fc4d8"/>
  </g>`;
}

function apartment(tint1: string, tint2: string) {
  return `
  <g>
    <rect x="140" y="90" width="180" height="190" rx="6" fill="${tint1}"/>
    <rect x="230" y="130" width="130" height="150" rx="6" fill="${tint2}"/>
    ${[
      [158, 110], [206, 110], [254, 110],
      [158, 158], [206, 158], [254, 158],
      [158, 206], [206, 206],
    ]
      .map(
        ([x, y]) =>
          `<rect x="${x}" y="${y}" width="34" height="34" rx="3" fill="#f6e7b2" opacity="0.92"/>`
      )
      .join("")}
    <rect x="252" y="238" width="34" height="42" rx="3" fill="#6d5140"/>
  </g>`;
}

const scenes: Record<string, (bg1: string, bg2: string) => string> = {
  "prop-bole-apartment.svg": (a, b) => `
    <rect width="800" height="420" fill="url(#sky)"/>
    <circle cx="660" cy="90" r="46" fill="#f7d488" opacity="0.9"/>
    ${apartment(a, b)}
    <rect x="0" y="280" width="800" height="140" fill="#cde3c1"/>
    <ellipse cx="120" cy="330" rx="70" ry="18" fill="#b5d19f"/>
    <ellipse cx="700" cy="360" rx="90" ry="20" fill="#b5d19f"/>`,

  "prop-oldairport-house.svg": (a, b) => `
    <rect width="800" height="420" fill="url(#sky)"/>
    <circle cx="140" cy="86" r="40" fill="#f7d488" opacity="0.9"/>
    <g>
      <rect x="240" y="170" width="300" height="130" rx="6" fill="${a}"/>
      <polygon points="210,170 390,80 570,170" fill="${b}"/>
      <rect x="360" y="220" width="60" height="80" rx="4" fill="#7c5a43"/>
      <rect x="270" y="200" width="56" height="52" rx="4" fill="#9fc4d8"/>
      <rect x="450" y="200" width="56" height="52" rx="4" fill="#9fc4d8"/>
      <circle cx="411" cy="262" r="4" fill="#e8c37a"/>
      <rect x="600" y="230" width="90" height="70" rx="6" fill="#c9b8a3"/>
    </g>
    <rect x="0" y="300" width="800" height="120" fill="#b8d4a0"/>
    <circle cx="120" cy="280" r="34" fill="#7fa66a"/>
    <rect x="114" y="300" width="12" height="30" fill="#8a6a4d"/>
    <circle cx="700" cy="270" r="40" fill="#7fa66a"/>
    <rect x="693" y="295" width="14" height="35" fill="#8a6a4d"/>`,

  "prop-yeka-studio.svg": (a, b) => `
    <rect width="800" height="420" fill="url(#sky)"/>
    <circle cx="680" cy="80" r="36" fill="#f7d488" opacity="0.9"/>
    ${apartment(a, b)}
    <rect x="0" y="280" width="800" height="140" fill="#cfe0cf"/>
    <rect x="60" y="250" width="16" height="60" fill="#8a6a4d"/>
    <circle cx="68" cy="240" r="26" fill="#87ab70"/>`,

  "prop-ayat-villa.svg": (a, b) => `
    <rect width="800" height="420" fill="url(#sky)"/>
    <g>
      <rect x="220" y="150" width="330" height="160" rx="8" fill="${a}"/>
      <polygon points="190,150 385,60 580,150" fill="${b}"/>
      <rect x="370" y="220" width="64" height="90" rx="4" fill="#7c5a43"/>
      <rect x="252" y="190" width="60" height="56" rx="4" fill="#9fc4d8"/>
      <rect x="452" y="190" width="60" height="56" rx="4" fill="#9fc4d8"/>
      <rect x="252" y="260" width="60" height="50" rx="4" fill="#9fc4d8"/>
      <rect x="452" y="260" width="60" height="50" rx="4" fill="#9fc4d8"/>
    </g>
    <rect x="580" y="210" width="140" height="100" rx="6" fill="#cabb9f" opacity="0.95"/>
    <rect x="0" y="310" width="800" height="110" fill="#b8d4a0"/>`,

  "prop-injibara-apartment.svg": (a, b) => `
    <rect width="800" height="420" fill="url(#sky)"/>
    <circle cx="130" cy="90" r="42" fill="#f7d488" opacity="0.9"/>
    ${apartment(a, b)}
    <rect x="0" y="280" width="800" height="140" fill="#c3ddb6"/>
    <circle cx="690" cy="260" r="30" fill="#7fa66a"/>
    <rect x="684" y="282" width="12" height="26" fill="#8a6a4d"/>`,

  "prop-injibara-house.svg": (a, b) => `
    <rect width="800" height="420" fill="url(#sky)"/>
    <g>
      <rect x="250" y="140" width="180" height="160" rx="6" fill="${a}"/>
      <rect x="400" y="180" width="150" height="120" rx="6" fill="${b}"/>
      <polygon points="220,140 340,70 460,140" fill="#8d6e63"/>
      <rect x="300" y="220" width="50" height="80" rx="4" fill="#7c5a43"/>
      <rect x="430" y="205" width="44" height="42" rx="4" fill="#f6e7b2"/>
      <rect x="270" y="170" width="40" height="40" rx="4" fill="#9fc4d8"/>
    </g>
    <rect x="0" y="300" width="800" height="120" fill="#b8d4a0"/>
    <circle cx="640" cy="270" r="36" fill="#7fa66a"/>
    <rect x="633" y="292" width="14" height="30" fill="#8a6a4d"/>`,

  "prop-kality-condo.svg": (a, b) => `
    <rect width="800" height="420" fill="url(#sky)"/>
    <circle cx="670" cy="86" r="40" fill="#f7d488" opacity="0.9"/>
    <g>
      <rect x="120" y="110" width="140" height="180" rx="6" fill="${b}"/>
      <rect x="280" y="90" width="170" height="200" rx="6" fill="${a}"/>
      ${[
        [140, 130], [190, 130], [140, 180], [190, 180],
        [300, 110], [352, 110], [404, 110],
        [300, 160], [352, 160], [404, 160],
        [300, 210], [352, 210],
      ]
        .map(
          ([x, y]) =>
            `<rect x="${x}" y="${y}" width="30" height="32" rx="3" fill="#f6e7b2" opacity="0.92"/>`
        )
        .join("")}
      <rect x="352" y="242" width="36" height="48" rx="3" fill="#6d5140"/>
    </g>
    <rect x="0" y="290" width="800" height="130" fill="#cde3c1"/>`,

  "prop-kirkos-room.svg": (a, b) => `
    <rect width="800" height="420" fill="url(#sky)"/>
    <g>
      <rect x="260" y="160" width="260" height="140" rx="6" fill="${a}"/>
      <polygon points="230,160 390,86 550,160" fill="${b}"/>
      <rect x="368" y="216" width="48" height="84" rx="4" fill="#7c5a43"/>
      <rect x="288" y="192" width="48" height="46" rx="4" fill="#9fc4d8"/>
      <rect x="444" y="192" width="48" height="46" rx="4" fill="#9fc4d8"/>
    </g>
    <rect x="0" y="300" width="800" height="120" fill="#c3ddb6"/>
    <circle cx="120" cy="278" r="28" fill="#87ab70"/>
    <rect x="114" y="298" width="10" height="24" fill="#8a6a4d"/>`,

  "property-default.svg": (a, b) => `
    <rect width="800" height="420" fill="url(#sky)"/>
    <g>
      <rect x="250" y="150" width="280" height="150" rx="6" fill="${a}"/>
      <polygon points="220,150 390,64 560,150" fill="${b}"/>
      <rect x="360" y="212" width="58" height="88" rx="4" fill="#7c5a43"/>
      <rect x="282" y="190" width="52" height="50" rx="4" fill="#9fc4d8"/>
      <rect x="446" y="190" width="52" height="50" rx="4" fill="#9fc4d8"/>
    </g>
    <rect x="0" y="300" width="800" height="120" fill="#b8d4a0"/>`,
};

const palettes: Record<string, [string, string]> = {
  "prop-bole-apartment.svg": ["#d9a066", "#b97a45"],
  "prop-oldairport-house.svg": ["#efe3cd", "#a34f38"],
  "prop-yeka-studio.svg": ["#c9b2d8", "#9d7fb5"],
  "prop-ayat-villa.svg": ["#e8d8bf", "#8f5f43"],
  "prop-injibara-apartment.svg": ["#a8c8dc", "#6f97b5"],
  "prop-injibara-house.svg": ["#e3cdb2", "#b5543b"],
  "prop-kality-condo.svg": ["#d8a9a0", "#b57c72"],
  "prop-kirkos-room.svg": ["#cdd8a8", "#98a86e"],
  "property-default.svg": ["#e8e2d5", "#b5543b"],
};

for (const [name, draw] of Object.entries(scenes)) {
  const [a, b] = palettes[name];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="420" viewBox="0 0 800 420">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f2ead9"/>
      <stop offset="100%" stop-color="#dce8d4"/>
    </linearGradient>
  </defs>
  ${draw(a, b)}
</svg>`;
  fs.writeFileSync(path.join(OUT, name), svg.trim());
  console.log("wrote", name);
}
console.log("All images generated.");
