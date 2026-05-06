import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const IMG_DIR = path.join(ROOT, "assets", "img");
const PLACEHOLDERS_OUT = path.join(IMG_DIR, "placeholders.json");
const MAX_WIDTH = 1920;
const WEBP_QUALITY = 75;
const PLACEHOLDER_WIDTH = 20;

function toPosix(p) {
  return p.split(path.sep).join("/");
}

function isPng(fileName) {
  return fileName.toLowerCase().endsWith(".png");
}

function escapeHtmlAttr(value) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function parseImgTag(tag) {
  const attrs = {};
  // very small attribute parser: key="value" or key='value'
  const re = /(\w[\w-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'))?/g;
  let m;
  while ((m = re.exec(tag))) {
    const key = m[1];
    const val = m[2] ?? m[3] ?? "";
    attrs[key] = val;
  }
  return attrs;
}

function buildImgTag(attrs) {
  const parts = ["<img"];
  for (const [k, v] of Object.entries(attrs)) {
    if (v === "" && (k === "loading" || k === "decoding")) {
      continue;
    }
    if (v === "" && (k === "alt" || k === "class" || k === "width" || k === "height")) {
      parts.push(` ${k}=""`);
      continue;
    }
    parts.push(` ${k}="${escapeHtmlAttr(String(v))}"`);
  }
  parts.push(" />");
  return parts.join("");
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function listHtmlFiles(rootDir) {
  const entries = await fs.readdir(rootDir, { withFileTypes: true });
  return entries.filter((e) => e.isFile() && e.name.toLowerCase().endsWith(".html")).map((e) => path.join(rootDir, e.name));
}

async function optimizeImages() {
  const files = await fs.readdir(IMG_DIR);
  const pngs = files.filter(isPng);

  const placeholders = {};

  for (const fileName of pngs) {
    const inputPath = path.join(IMG_DIR, fileName);
    const baseName = fileName.replace(/\.png$/i, "");
    const webpName = `${baseName}.webp`;
    const webpPath = path.join(IMG_DIR, webpName);

    const pipeline = sharp(inputPath, { failOn: "none" }).rotate();
    const meta = await pipeline.metadata();

    const shouldResize = typeof meta.width === "number" && meta.width > MAX_WIDTH;

    const webpPipeline = sharp(inputPath, { failOn: "none" })
      .rotate()
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY });

    // If it's already smaller than max width, we still pass withoutEnlargement=true so it won't upscale.
    await webpPipeline.toFile(webpPath);

    const placeholderBuffer = await sharp(inputPath, { failOn: "none" })
      .rotate()
      .resize({ width: PLACEHOLDER_WIDTH, withoutEnlargement: true })
      .webp({ quality: 40 })
      .toBuffer();

    const placeholderBase64 = placeholderBuffer.toString("base64");
    const placeholderDataUri = `data:image/webp;base64,${placeholderBase64}`;

    placeholders[fileName] = {
      sourcePng: fileName,
      webp: webpName,
      placeholderDataUri,
      meta: {
        width: meta.width ?? null,
        height: meta.height ?? null,
        resizedToMaxWidth: Boolean(shouldResize),
      },
    };
  }

  await fs.writeFile(PLACEHOLDERS_OUT, JSON.stringify(placeholders, null, 2), "utf8");
  return placeholders;
}

function makeBlurUpMarkup({ originalImgTag, attrs, placeholderDataUri, webpSrc }) {
  const originalClass = attrs.class ?? "";

  const commonAttrs = {
    alt: attrs.alt ?? "",
    width: attrs.width ?? "",
    height: attrs.height ?? "",
  };

  const placeholderAttrs = {
    ...commonAttrs,
    src: placeholderDataUri,
    class: `blur-up__placeholder ${originalClass}`.trim(),
    "aria-hidden": "true",
  };

  const fullAttrs = {
    ...commonAttrs,
    "data-src": webpSrc,
    class: `blur-up__img ${originalClass}`.trim(),
    loading: "lazy",
    decoding: "async",
  };

  // Keep empty alt on the real image only; placeholder is aria-hidden.
  if ((attrs.alt ?? "") === "") {
    placeholderAttrs.alt = "";
    fullAttrs.alt = "";
  }

  const wrapperClass = "blur-up";

  const placeholderTag = buildImgTag(placeholderAttrs);
  const fullTag = buildImgTag(fullAttrs);

  return `<span class="${wrapperClass}">${placeholderTag}${fullTag}</span>`;
}

async function updateHtmlFiles(placeholders) {
  const htmlFiles = await listHtmlFiles(ROOT);

  // Exclude logo from blur-up replacement (keep crisp + cached).
  const EXCLUDE = new Set(["chefs-atalier-logo.png"]);

  const imgTagRe = /<img\b[^>]*\bsrc="assets\/img\/([^">]+\.png)"[^>]*\/?>/gi;

  for (const htmlPath of htmlFiles) {
    let html = await fs.readFile(htmlPath, "utf8");
    let changed = false;

    html = html.replace(imgTagRe, (tag, fileName) => {
      if (EXCLUDE.has(fileName)) return tag;
      const entry = placeholders[fileName];
      if (!entry) return tag;

      const attrs = parseImgTag(tag);
      const webpSrc = `assets/img/${entry.webp}`;
      const replacement = makeBlurUpMarkup({
        originalImgTag: tag,
        attrs,
        placeholderDataUri: entry.placeholderDataUri,
        webpSrc,
      });

      changed = true;
      return replacement;
    });

    if (changed) {
      await fs.writeFile(htmlPath, html, "utf8");
    }
  }
}

async function main() {
  await ensureDir(path.join(ROOT, "scripts"));
  const placeholders = await optimizeImages();
  await updateHtmlFiles(placeholders);

  console.log(
    [
      "Image optimization complete.",
      `- PNG → WebP quality ${WEBP_QUALITY}, max width ${MAX_WIDTH}px`,
      `- Placeholder: ${PLACEHOLDER_WIDTH}px wide, Base64 data URI`,
      `- Wrote: ${toPosix(path.relative(ROOT, PLACEHOLDERS_OUT))}`,
      "- Updated HTML: replaced <img src=\"assets/img/*.png\"> with blur-up markup (logo excluded)",
    ].join("\n")
  );
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

