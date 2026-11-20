import {
  Person,
  TreeSettings,
  MAIN_BRANCH_IDS,
  getBirthSortKey,
  getInitials,
} from '../data/wiciFamily';
import { resolveBranchId } from './treeLayout';
import { buildBotanicalTreeSvg } from './botanicalTreePoster';

export interface PosterOptions {
  orientation: 'landscape' | 'portrait';
  style?: 'tree' | 'gallery';
  title?: string;
  subtitle?: string;
}

const xml = (value: string | undefined | null) =>
  (value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

export const BRANCH_CONFIG: Record<
  string,
  {
    name: string;
    founderId: string;
    subtitle: string;
    color: string;
    light: string;
    accent: string;
    border: string;
  }
> = {
  serge: {
    name: 'Branche Serge',
    founderId: 'serge',
    subtitle: '1928 – 1979',
    color: '#8C6239',
    light: '#FAF4EE',
    accent: '#C4A482',
    border: '#8C6239',
  },
  genevieve: {
    name: 'Branche Geneviève',
    founderId: 'genevieve',
    subtitle: 'Née en 1930',
    color: '#3B624C',
    light: '#F1F7F3',
    accent: '#8EB09B',
    border: '#3B624C',
  },
  'jean-claude': {
    name: 'Branche Jean-Claude',
    founderId: 'jean-claude',
    subtitle: '1933 – 1991',
    color: '#2E5275',
    light: '#F1F5F9',
    accent: '#8BA6C1',
    border: '#2E5275',
  },
  raymond: {
    name: 'Branche Raymond',
    founderId: 'raymond',
    subtitle: '1936 – 2026',
    color: '#8E4A42',
    light: '#FAF2F0',
    accent: '#C8958E',
    border: '#8E4A42',
  },
  pierre: {
    name: 'Branche Pierre',
    founderId: 'pierre',
    subtitle: 'Né en 1937',
    color: '#6B4E71',
    light: '#F7F3F8',
    accent: '#B39CB8',
    border: '#6B4E71',
  },
  colette: {
    name: 'Branche Colette',
    founderId: 'colette',
    subtitle: '1939 – 2022',
    color: '#7C6438',
    light: '#F9F5ED',
    accent: '#C2AE88',
    border: '#7C6438',
  },
  claude: {
    name: 'Branche Claude',
    founderId: 'claude',
    subtitle: 'Né(e) en 1940',
    color: '#35606A',
    light: '#EFF6F8',
    accent: '#88AEB6',
    border: '#35606A',
  },
  michel: {
    name: 'Branche Michel',
    founderId: 'michel',
    subtitle: '1941 – 1990',
    color: '#5A5E6B',
    light: '#F4F5F7',
    accent: '#A4A8B4',
    border: '#5A5E6B',
  },
  denise: {
    name: 'Branche Denise',
    founderId: 'denise',
    subtitle: 'Née en 1944',
    color: '#944B5F',
    light: '#FBF2F5',
    accent: '#CE96A6',
    border: '#944B5F',
  },
  jacqueline: {
    name: 'Branche Jacqueline',
    founderId: 'jacqueline',
    subtitle: '1946 – 1974',
    color: '#596A42',
    light: '#F3F6EF',
    accent: '#A3B38D',
    border: '#596A42',
  },
};

/**
 * Renders a single person medallion card with photo on top and full name + dates underneath.
 */
function renderPersonCardSvg(
  person: Person,
  x: number,
  y: number,
  width: number,
  height: number,
  cardIndex: number,
  branchColor: string,
  branchLight: string,
  options?: { isFounder?: boolean; role?: string }
): string {
  const isFounder = !!options?.isFounder;
  const radius = isFounder ? 56 : 48;
  const cx = width / 2;
  const cy = radius + (isFounder ? 18 : 14);
  const clipId = `poster-avatar-${cardIndex}-${person.id.replace(/[^a-zA-Z0-9_-]/g, '')}`;

  const dates = [person.birth, person.death].filter(Boolean).join(' – ');
  const fullName = [person.first, person.last].filter(Boolean).join(' ');
  const maiden = person.maidenName ? `(née ${person.maidenName})` : '';

  // Clean initials fallback
  const initials = getInitials(person);

  const photoElem = person.photo
    ? `<image x="${cx - radius}" y="${cy - radius}" width="${radius * 2}" height="${
        radius * 2
      }" href="${xml(person.photo)}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${clipId})"/>`
    : `<text x="${cx}" y="${cy + 8}" text-anchor="middle" font-family="Georgia,serif" font-size="${
        isFounder ? 26 : 22
      }" font-weight="600" fill="${branchColor}" letter-spacing="1">${xml(initials)}</text>`;

  return `
    <g transform="translate(${x} ${y})">
      <!-- Card Container Background -->
      <rect width="${width}" height="${height}" rx="12" fill="#FFFFFF" stroke="#E6DFD3" stroke-width="1.2"/>
      <rect x="1" y="1" width="${width - 2}" height="4" rx="2" fill="${branchColor}" opacity="0.85"/>

      <!-- Definitions for image clipping -->
      <defs>
        <clipPath id="${clipId}">
          <circle cx="${cx}" cy="${cy}" r="${radius}"/>
        </clipPath>
      </defs>

      <!-- Outer decorative ring -->
      <circle cx="${cx}" cy="${cy}" r="${radius + 4}" fill="none" stroke="${branchColor}" stroke-width="1.2" stroke-opacity="0.35"/>
      <!-- Inner circular avatar backdrop -->
      <circle cx="${cx}" cy="${cy}" r="${radius}" fill="${branchLight}"/>

      <!-- Photo or Initiales -->
      ${photoElem}

      <!-- Border around avatar -->
      <circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="${branchColor}" stroke-width="2"/>

      ${
        options?.role
          ? `<text x="${cx}" y="${cy + radius + 18}" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" font-weight="700" letter-spacing="1.5" fill="${branchColor}" text-transform="uppercase">${xml(
              options.role
            )}</text>`
          : ''
      }

      <!-- First Name -->
      <text x="${cx}" y="${
    cy + radius + (options?.role ? 36 : 22)
  }" text-anchor="middle" font-family="Georgia,serif" font-size="${
    isFounder ? 18 : 16
  }" font-weight="600" fill="#1C1917">
        ${xml(person.first)}
      </text>

      <!-- Last Name -->
      <text x="${cx}" y="${
    cy + radius + (options?.role ? 53 : 39)
  }" text-anchor="middle" font-family="Georgia,serif" font-size="13" font-weight="400" fill="#4A443C">
        ${xml(person.last || '')}
      </text>

      ${
        maiden
          ? `<text x="${cx}" y="${
              cy + radius + (options?.role ? 68 : 54)
            }" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="11" fill="#756A5D">${xml(
              maiden
            )}</text>`
          : ''
      }

      <!-- Life Dates -->
      ${
        dates
          ? `<text x="${cx}" y="${
              height - 12
            }" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" font-weight="500" fill="#8C7A65">${xml(
              dates
            )}</text>`
          : ''
      }
    </g>
  `;
}

/**
 * Builds a pristine, publication-grade SVG calibrated strictly for DIN A3 (300 DPI equivalent).
 * Landscape: 4960 x 3508 px
 * Portrait: 3508 x 4960 px
 */
export function buildPhotoPosterSvg(
  people: Person[],
  settings: TreeSettings,
  options: PosterOptions
): { svg: string; width: number; height: number } {
  if ((options.style ?? 'tree') === 'tree') {
    return buildBotanicalTreeSvg(people, settings, options);
  }
  const isLandscape = options.orientation === 'landscape';
  const width = isLandscape ? 4960 : 3508;
  const height = isLandscape ? 3508 : 4960;

  const byId = new Map(people.map((p) => [p.id, p]));
  const title = options.title || settings.familyName || 'L’Arbre de Denise';
  const subtitle =
    options.subtitle ||
    `${people.length} PERSONNES RÉUNIES · 10 BRANCHES FAMILIALES · UNE HISTOIRE À TRANSMETTRE`;

  // 1. Group members by branch
  const branchKeys: string[] = [...MAIN_BRANCH_IDS];
  const branchMembers: Record<string, Person[]> = {};
  for (const key of branchKeys) {
    branchMembers[key] = [];
  }

  const founderIds = ['guillaume', 'georgette', 'charles', 'blanche'];
  const founders: Person[] = [];

  for (const p of people) {
    if (founderIds.includes(p.id)) {
      founders.push(p);
      continue;
    }
    const bId = resolveBranchId(p.id, byId);
    if (branchMembers[bId]) {
      branchMembers[bId].push(p);
    } else {
      branchMembers[branchKeys[0]].push(p);
    }
  }

  const sortedFounders = founderIds
    .map((id) => byId.get(id))
    .filter(Boolean) as Person[];

  // 2. Sort members inside each branch: head of branch first, then chronologically
  for (const bKey of Object.keys(branchMembers)) {
    const cfg = BRANCH_CONFIG[bKey];
    branchMembers[bKey].sort((a, b) => {
      if (a.id === cfg?.founderId) return -1;
      if (b.id === cfg?.founderId) return 1;
      return getBirthSortKey(a.birth) - getBirthSortKey(b.birth);
    });
  }

  let cardGlobalCounter = 0;

  // Header SVG Block
  const headerHeight = 310;
  const headerSvg = `
    <!-- Top Editorial Header & Frontispiece -->
    <g transform="translate(0 0)">
      <!-- Ornamental frame lines -->
      <rect x="80" y="40" width="${width - 160}" height="${headerHeight}" rx="16" fill="#FFFFFF" stroke="#E2DAD0" stroke-width="1.5"/>
      <rect x="92" y="52" width="${width - 184}" height="${headerHeight - 24}" rx="12" fill="none" stroke="#8C7355" stroke-width="0.8" stroke-dasharray="8 4"/>

      <!-- Kicker -->
      <text x="${width / 2}" y="94" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="700" letter-spacing="4" fill="#8C7355">
        ARCHIVES PATRIMONIALES · GALERIE DES PORTRAITS
      </text>

      <!-- Main Title -->
      <text x="${width / 2}" y="172" text-anchor="middle" font-family="Georgia,serif" font-size="64" font-weight="700" fill="#1C1917" letter-spacing="1">
        ${xml(title)}
      </text>

      <!-- Subtitle -->
      <text x="${width / 2}" y="222" text-anchor="middle" font-family="Arial,sans-serif" font-size="14" font-weight="600" letter-spacing="2.5" fill="#6B6053">
        ${xml(subtitle)}
      </text>

      <!-- Central ornamental diamond divider -->
      <path d="M ${width / 2 - 160} 255 L ${width / 2 - 25} 255 M ${width / 2 + 25} 255 L ${width / 2 + 160} 255" stroke="#C5B49E" stroke-width="1.5"/>
      <polygon points="${width / 2},247 ${width / 2 + 10},255 ${width / 2},263 ${width / 2 - 10},255" fill="#8C7355"/>
      <circle cx="${width / 2 - 50}" cy="255" r="2.5" fill="#8C7355"/>
      <circle cx="${width / 2 + 50}" cy="255" r="2.5" fill="#8C7355"/>
    </g>
  `;

  // Founders Block (Gen I)
  const foundersY = 380;
  const foundersHeight = 270;
  const founderCardW = 220;
  const founderCardH = 210;
  const totalFoundersW = sortedFounders.length * founderCardW + (sortedFounders.length - 1) * 60;
  const foundersStartX = (width - totalFoundersW) / 2;

  let foundersCardsSvg = '';
  sortedFounders.forEach((p, idx) => {
    cardGlobalCounter++;
    const fx = foundersStartX + idx * (founderCardW + 60);
    const fy = foundersY + 45;
    const role =
      p.id === 'guillaume'
        ? 'Grand-Père'
        : p.id === 'georgette'
        ? 'Grand-Mère'
        : p.id === 'charles'
        ? 'Père'
        : 'Mère';
    foundersCardsSvg += renderPersonCardSvg(
      p,
      fx,
      fy,
      founderCardW,
      founderCardH,
      cardGlobalCounter,
      '#8C7355',
      '#F7F3EC',
      {
        isFounder: true,
        role,
      }
    );
  });

  const foundersSvg = `
    <!-- Founders Section -->
    <g transform="translate(0 0)">
      <rect x="80" y="${foundersY}" width="${width - 160}" height="${foundersHeight}" rx="14" fill="#FAF6F0" stroke="#DFD5C6" stroke-width="1.2"/>
      <text x="${width / 2}" y="${foundersY + 30}" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" font-weight="700" letter-spacing="3" fill="#8C7355">
        GÉNÉRATIONS I &amp; II — GRANDS-PARENTS &amp; PARENTS
      </text>
      ${foundersCardsSvg}
    </g>
  `;

  let branchesSvg = '';

  if (isLandscape) {
    // ==========================================
    // LANDSCAPE LAYOUT (5 COLUMNS x 2 ROWS)
    // ==========================================
    const branchesStartY = 680;
    const availableW = width - 160; // 4800 px
    const availableH = height - branchesStartY - 80;
    const cols = 5;
    const rows = 2;
    const branchColGap = 35;
    const branchRowGap = 30;
    const branchColW = (availableW - (cols - 1) * branchColGap) / cols;
    const branchRowH = (availableH - (rows - 1) * branchRowGap) / rows;

    branchKeys.forEach((bKey, idx) => {
      const cfg = BRANCH_CONFIG[bKey];
      const members = branchMembers[bKey] || [];
      const colIdx = idx % cols;
      const rowIdx = Math.floor(idx / cols);
      const colX = 80 + colIdx * (branchColW + branchColGap);
      const colY = branchesStartY + rowIdx * (branchRowH + branchRowGap);
      const colHeight = branchRowH;

      const cardMargin = 16;
      const cardGap = 16;
      const innerW = branchColW - 2 * cardMargin;
      const cardsPerRow = 3;
      const cardW = Math.floor((innerW - (cardsPerRow - 1) * cardGap) / cardsPerRow);
      const cardH = 200;

      let branchCardsSvg = '';
      members.forEach((m, mIdx) => {
        cardGlobalCounter++;
        const row = Math.floor(mIdx / cardsPerRow);
        const col = mIdx % cardsPerRow;
        const cx = colX + cardMargin + col * (cardW + cardGap);
        const cy = colY + 95 + row * (cardH + cardGap);

        branchCardsSvg += renderPersonCardSvg(
          m,
          cx,
          cy,
          cardW,
          cardH,
          cardGlobalCounter,
          cfg.color,
          cfg.light,
          {
            role: m.id === cfg.founderId ? 'Chef de Branche' : undefined,
          }
        );
      });

      branchesSvg += `
        <!-- Branch Column: ${cfg.name} -->
        <g>
          <rect x="${colX}" y="${colY}" width="${branchColW}" height="${colHeight}" rx="14" fill="#FCFAF7" stroke="#E6DFD3" stroke-width="1.2"/>
          <rect x="${colX}" y="${colY}" width="${branchColW}" height="76" rx="14" fill="${cfg.color}"/>
          <rect x="${colX}" y="${colY + 64}" width="${branchColW}" height="12" fill="${cfg.color}"/>
          <text x="${colX + branchColW / 2}" y="${colY + 34}" text-anchor="middle" font-family="Georgia,serif" font-size="20" font-weight="700" fill="#FFFFFF" letter-spacing="1">
            ${xml(cfg.name.toUpperCase())}
          </text>
          <text x="${colX + branchColW / 2}" y="${colY + 56}" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" font-weight="400" fill="#E8EDF5" letter-spacing="0.8">
            ${members.length} membres · ${xml(cfg.subtitle)}
          </text>
          ${branchCardsSvg}
        </g>
      `;
    });
  } else {
    // ==========================================
    // PORTRAIT LAYOUT (2 COLUMNS x 5 ROWS)
    // ==========================================
    const branchesStartY = 680;
    const availableW = width - 160;
    const availableH = height - branchesStartY - 80;
    const cols = 2;
    const rows = 5;
    const colGap = 32;
    const rowGap = 24;
    const panelW = (availableW - colGap) / cols;
    const panelH = (availableH - (rows - 1) * rowGap) / rows;
    const cardGap = 16;
    const cardW = 210;
    const cardH = 200;

    branchKeys.forEach((bKey, idx) => {
      const cfg = BRANCH_CONFIG[bKey];
      const members = branchMembers[bKey] || [];
      const colIdx = idx % cols;
      const rowIdx = Math.floor(idx / cols);
      const panelX = 80 + colIdx * (panelW + colGap);
      const panelY = branchesStartY + rowIdx * (panelH + rowGap);
      const cardsPerRow = Math.max(1, Math.floor((panelW - 32) / (cardW + cardGap)));

      let branchCardsSvg = '';
      members.forEach((m, mIdx) => {
        cardGlobalCounter++;
        const row = Math.floor(mIdx / cardsPerRow);
        const col = mIdx % cardsPerRow;
        const cx = panelX + 16 + col * (cardW + cardGap);
        const cy = panelY + 60 + row * (cardH + cardGap);

        branchCardsSvg += renderPersonCardSvg(
          m,
          cx,
          cy,
          cardW,
          cardH,
          cardGlobalCounter,
          cfg.color,
          cfg.light,
          {
            role: m.id === cfg.founderId ? 'Chef de Branche' : undefined,
          }
        );
      });

      branchesSvg += `
        <!-- Branch Section: ${cfg.name} -->
        <g>
          <rect x="${panelX}" y="${panelY}" width="${panelW}" height="${panelH}" rx="12" fill="#FCFAF7" stroke="#E6DFD3" stroke-width="1.2"/>
          <rect x="${panelX}" y="${panelY}" width="${panelW}" height="44" rx="12" fill="${cfg.color}"/>
          <rect x="${panelX}" y="${panelY + 34}" width="${panelW}" height="10" fill="${cfg.color}"/>
          <text x="${panelX + 24}" y="${panelY + 28}" font-family="Georgia,serif" font-size="18" font-weight="700" fill="#FFFFFF">
            ${xml(cfg.name.toUpperCase())}
          </text>
          <text x="${panelX + panelW - 24}" y="${panelY + 27}" text-anchor="end" font-family="Arial,sans-serif" font-size="12" fill="#E8EDF5">
            ${members.length} membres · ${xml(cfg.subtitle)}
          </text>
          ${branchCardsSvg}
        </g>
      `;
    });
  }

  // Footer bar with heritage seal
  const footerY = height - 55;
  const footerSvg = `
    <!-- Footer Heritage Bar -->
    <g transform="translate(0 ${footerY})">
      <line x1="80" y1="0" x2="${width - 80}" y2="0" stroke="#DFD5C6" stroke-width="1"/>
      <text x="90" y="24" font-family="Arial,sans-serif" font-size="11" letter-spacing="1.5" fill="#8C7A65">
        DOCUMENT DE FAMILLE OFFICIEL · CONÇU POUR IMPRESSION FORMAT A3 (420 × 297 MM)
      </text>
      <text x="${width - 90}" y="24" text-anchor="end" font-family="Georgia,serif" font-size="13" font-style="italic" fill="#8C7A65">
        « Chaque génération ajoute une page au grand livre de notre histoire. »
      </text>
    </g>
  `;

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <!-- Background Wallpaper -->
  <rect width="100%" height="100%" fill="#FAF8F5"/>
  <rect x="25" y="25" width="${width - 50}" height="${height - 50}" rx="20" fill="none" stroke="#E0D7C9" stroke-width="2"/>
  <rect x="35" y="35" width="${width - 70}" height="${height - 70}" rx="16" fill="none" stroke="#C5B49E" stroke-width="0.8"/>

  ${headerSvg}
  ${foundersSvg}
  ${branchesSvg}
  ${footerSvg}
</svg>`;

  return { svg, width, height };
}

/**
 * Silent in-page iframe printing engine.
 * Never blocked by popup blockers or iframe restrictions.
 */
function printHtmlViaHiddenIframe(htmlContent: string): void {
  const existing = document.getElementById('family-tree-print-iframe');
  if (existing) {
    existing.remove();
  }

  const iframe = document.createElement('iframe');
  iframe.id = 'family-tree-print-iframe';
  iframe.setAttribute(
    'style',
    'position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;border:none;visibility:hidden;'
  );
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document || iframe.contentDocument;
  if (!doc) {
    throw new Error('Impossible d’initialiser l’impression du document.');
  }

  doc.open();
  doc.write(htmlContent);
  doc.close();

  // Give styles and SVG fonts time to settle, then invoke print
  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch {
      window.print();
    } finally {
      setTimeout(() => {
        iframe.remove();
      }, 60000);
    }
  }, 400);
}

/**
 * Triggers browser print dialog calibrated specifically for DIN A3 landscape/portrait.
 */
export function printPhotoPoster(
  people: Person[],
  settings: TreeSettings,
  options: PosterOptions
): void {
  const { svg } = buildPhotoPosterSvg(people, settings, options);
  const isLandscape = options.orientation === 'landscape';
  const cleanSvg = svg.replace(/^<\?xml[^?]*\?>/, '');

  const printHtml = `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>${xml(options.title || settings.familyName || 'Arbre Généalogique A3 - Famille Tronchet')}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A3 ${isLandscape ? 'landscape' : 'portrait'};
      margin: 0;
    }
    @media print {
      html, body {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        background: #FAF8F5 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .no-print {
        display: none !important;
      }
      svg {
        display: block;
        width: 100vw;
        height: 100vh;
      }
    }
    body {
      margin: 0;
      background: #FAF8F5;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    svg {
      display: block;
      width: 100%;
      height: auto;
    }
  </style>
</head>
<body>
  ${cleanSvg}
</body>
</html>`;

  printHtmlViaHiddenIframe(printHtml);
}

/**
 * Downloads a high-resolution 300 DPI PNG image of the A3 poster.
 */
export async function exportPhotoPosterPng(
  people: Person[],
  settings: TreeSettings,
  options: PosterOptions
): Promise<void> {
  const { svg, width, height } = buildPhotoPosterSvg(people, settings, options);
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  try {
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Impossible de charger l’affiche pour conversion.'));
      img.src = url;
    });

    // Render onto canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Moteur graphique Canvas indisponible.');

    ctx.fillStyle = '#FAF8F5';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);

    const pngBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error('Échec de création du fichier PNG.'))),
        'image/png'
      );
    });

    const prefix = (options.style ?? 'tree') === 'tree' ? 'arbre-a3-famille' : 'planche-a3-famille';
    const filename = `${prefix}-${options.orientation}.png`;
    downloadBlob(pngBlob, filename);
  } finally {
    URL.revokeObjectURL(url);
  }
}

/**
 * Downloads pure vector SVG.
 */
export function exportPhotoPosterSvg(
  people: Person[],
  settings: TreeSettings,
  options: PosterOptions
): void {
  const { svg } = buildPhotoPosterSvg(people, settings, options);
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const prefix = (options.style ?? 'tree') === 'tree' ? 'arbre-a3-famille' : 'planche-a3-famille';
  downloadBlob(blob, `${prefix}-${options.orientation}.svg`);
}

function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}
