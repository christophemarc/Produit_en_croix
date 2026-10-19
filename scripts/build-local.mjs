#!/usr/bin/env node
/**
 * Génère la VERSION LOCALE autonome : `version-locale/index.html`.
 *
 * À partir du build Vite (`dist/index.html`, déjà en fichier unique grâce à
 * vite-plugin-singlefile), ce script :
 *   1. retire les liens Google Fonts et intègre les polices en base64
 *      (paquets @fontsource-variable/*, sous-ensembles latin + latin-ext) ;
 *   2. intègre les images de `public/images/` en base64 (data URI) ;
 *   3. ajoute un favicon intégré ;
 *   4. vérifie qu'il ne reste AUCUNE référence externe.
 *
 * Résultat : un seul fichier HTML, ouvrable par double-clic (file://),
 * 100 % hors ligne, copiable tel quel sur le Bureau ou une clé USB.
 *
 * Usage : `npm run build:local`  (lance `vite build` puis ce script)
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const distFile = join(root, "dist/index.html");
const outDir = join(root, "version-locale");
const outFile = join(outDir, "index.html");

if (!existsSync(distFile)) {
  console.error("✗ dist/index.html introuvable. Lancez d'abord « npm run build » (ou « npm run build:local »).");
  process.exit(1);
}

let html = readFileSync(distFile, "utf8");

// Retirer le garde « double-clic » : il ne sert qu'à la racine du dépôt.
// (La version locale doit fonctionner seule, même copiée sur le Bureau.)
html = html.replace(/<script id="garde-fichier-local">[\s\S]*?<\/script>\s*/g, "");

/* ------------------------------------------------------------------ */
/* 1. Polices intégrées (remplacent Google Fonts)                      */
/* ------------------------------------------------------------------ */

// Même découpe que la requête Google Fonts d'origine :
// - Fraunces : axes opsz + wght (= variante « standard » Fontsource)
// - Archivo et JetBrains Mono : axe wght
const FONTS = [
  {
    pkg: "@fontsource-variable/fraunces",
    css: ["standard.css", "standard-italic.css"],
    from: "Fraunces Variable",
    to: "Fraunces",
  },
  {
    pkg: "@fontsource-variable/archivo",
    css: ["wght.css", "wght-italic.css"],
    from: "Archivo Variable",
    to: "Archivo",
  },
  {
    pkg: "@fontsource-variable/jetbrains-mono",
    css: ["index.css", "wght-italic.css"],
    from: "JetBrains Mono Variable",
    to: "JetBrains Mono",
  },
];

function buildFontCss() {
  let out = "";
  let count = 0;
  const seen = new Set();

  for (const font of FONTS) {
    const pkgDir = join(root, "node_modules", font.pkg);
    if (!existsSync(pkgDir)) {
      console.error(`✗ Paquet manquant : ${font.pkg}. Lancez « npm install ».`);
      process.exit(1);
    }
    for (const cssFile of font.css) {
      const css = readFileSync(join(pkgDir, cssFile), "utf8");
      const blocks = css.match(/\/\*[^*]+\*\/\s*@font-face\s*{[^}]+}/g) ?? [];
      for (const block of blocks) {
        const m = block.match(/url\(\.\/files\/([^)]+\.woff2)\)/);
        if (!m) continue;
        const fname = m[1];
        // Ne garder que latin + latin-ext (français), comme Google Fonts.
        if (!/-latin-ext-|-latin-/.test(fname)) continue;
        if (seen.has(fname)) continue;
        seen.add(fname);
        const b64 = readFileSync(join(pkgDir, "files", fname)).toString("base64");
        out +=
          block
            .replaceAll(`'${font.from}'`, `'${font.to}'`)
            .replace(m[0], `url(data:font/woff2;base64,${b64})`) + "\n";
        count++;
      }
    }
  }
  console.log(`• Polices intégrées : ${count} fichiers woff2 (latin + latin-ext)`);
  return out;
}

const fontCss = buildFontCss();
if (!fontCss) {
  console.error("✗ Aucune @font-face générée : abandon.");
  process.exit(1);
}

// Retirer les liens Google Fonts (preconnect + stylesheet)
html = html.replace(/<link\b[^>]*fonts\.(?:googleapis|gstatic)\.com[^>]*>\s*/g, "");
if (html.includes("fonts.googleapis.com") || html.includes("fonts.gstatic.com")) {
  console.error("✗ Des références Google Fonts subsistent : abandon.");
  process.exit(1);
}

// Injecter les polices intégrées dans le <head>
html = html.replace(
  "</head>",
  `  <style id="polices-integrees">\n/* Polices intégrées (version locale hors ligne) */\n${fontCss}</style>\n  </head>`
);

/* ------------------------------------------------------------------ */
/* 2. Images intégrées en base64                                      */
/* ------------------------------------------------------------------ */

const MIME = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
};

const imgDir = join(root, "public/images");
if (existsSync(imgDir)) {
  for (const name of readdirSync(imgDir)) {
    const ext = name.slice(name.lastIndexOf(".")).toLowerCase();
    const mime = MIME[ext];
    if (!mime) continue;
    const uri = `data:${mime};base64,${readFileSync(join(imgDir, name)).toString("base64")}`;
    let n = 0;
    for (const variant of [`/images/${name}`, `./images/${name}`, `images/${name}`]) {
      const parts = html.split(variant);
      n += parts.length - 1;
      html = parts.join(uri);
    }
    console.log(`• Image intégrée : images/${name} (${n} référence${n > 1 ? "s" : ""})`);
    if (html.includes(`images/${name}`)) {
      console.error(`✗ Il reste une référence à images/${name} : abandon.`);
      process.exit(1);
    }
  }
}

/* ------------------------------------------------------------------ */
/* 3. Favicon intégré + commentaire d'en-tête                          */
/* ------------------------------------------------------------------ */

if (!/rel="icon"/.test(html)) {
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'>` +
    `<rect width='64' height='64' rx='13' fill='#F7F1E4'/>` +
    `<rect x='14' y='30.6' width='36' height='2.8' rx='1.4' fill='#1E2F55'/>` +
    `<text x='32' y='27' font-family='Georgia,serif' font-size='21' font-weight='bold' fill='#1E2F55' text-anchor='middle'>20</text>` +
    `<text x='32' y='52' font-family='Georgia,serif' font-size='21' font-weight='bold' fill='#C8412B' text-anchor='middle'>×</text>` +
    `</svg>`;
  html = html.replace(
    "</title>",
    `</title>\n    <link rel="icon" href="data:image/svg+xml,${encodeURIComponent(svg)}" />`
  );
}

html = html.replace(
  /<!doctype html>/i,
  (m) =>
    `${m}\n<!--\n  VERSION LOCALE AUTONOME — Produit en croix\n` +
    `  Fichier unique généré par « npm run build:local » : tout est intégré\n` +
    `  (code, styles, images, polices). Ouvrable par double-clic, 100 % hors ligne.\n` +
    `  Ne pas modifier à la main : régénérez-le depuis les sources du projet.\n-->`
);

/* ------------------------------------------------------------------ */
/* 4. Vérifications finales : aucune ressource externe                 */
/* ------------------------------------------------------------------ */

const problems = [];
if (html.includes("garde-fichier-local")) problems.push("le garde « double-clic » n'a pas été retiré");
if (/<script\b[^>]*\bsrc=/i.test(html)) problems.push("un <script src=…> externe subsiste");
if (/<link\b[^>]*href="https?:/i.test(html)) problems.push("un <link href=\"http…\"> externe subsiste");
if (/url\(\s*['"]?https?:/i.test(html)) problems.push("une url(http…) subsiste dans les styles");
if (problems.length) {
  console.error("✗ Vérification échouée :\n  - " + problems.join("\n  - "));
  process.exit(1);
}

/* ------------------------------------------------------------------ */
/* 5. Écriture du fichier final                                        */
/* ------------------------------------------------------------------ */

mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, html, "utf8");

const sizeKo = Math.round(Buffer.byteLength(html, "utf8") / 1024);
console.log(`✓ Version locale générée : version-locale/index.html (${sizeKo} Ko, fichier unique, 100 % hors ligne)`);
