import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import toIco from "to-ico";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "assets", "favicon", "favicon.png");
const OUT = path.join(ROOT, "assets", "favicon");

const PNG_SIZES = [
  { name: "favicon-16x16.png", size: 16 },
  { name: "favicon-32x32.png", size: 32 },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "android-chrome-192x192.png", size: 192 },
  { name: "android-chrome-512x512.png", size: 512 },
];

async function main() {
  await fs.mkdir(OUT, { recursive: true });

  const icoBuffers = [];
  for (const size of [16, 32, 48]) {
    icoBuffers.push(
      await sharp(SRC).resize(size, size, { fit: "cover" }).png().toBuffer()
    );
  }
  await fs.writeFile(path.join(OUT, "favicon.ico"), await toIco(icoBuffers));

  for (const { name, size } of PNG_SIZES) {
    await sharp(SRC)
      .resize(size, size, { fit: "cover" })
      .png({ compressionLevel: 9 })
      .toFile(path.join(OUT, name));
  }

  const manifest = {
    name: "Chefs Atelier",
    short_name: "Chefs Atelier",
    icons: [
      { src: "/assets/favicon/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/assets/favicon/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    theme_color: "#281732",
    background_color: "#281732",
    display: "standalone",
  };

  await fs.writeFile(path.join(OUT, "site.webmanifest"), JSON.stringify(manifest, null, 2) + "\n");

  console.log("Favicon assets written to assets/favicon/");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
