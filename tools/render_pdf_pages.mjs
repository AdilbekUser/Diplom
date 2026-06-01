import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const NODE_MODULES =
  "C:/Users/adilb/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules";
const pdfjs = await import(
  pathToFileURL(path.join(NODE_MODULES, "pdfjs-dist/legacy/build/pdf.mjs")).href
);
const { createCanvas } = await import(
  pathToFileURL(path.join(NODE_MODULES, "@napi-rs/canvas/index.js")).href
);

const [pdfPath, outputDir, scaleArg] = process.argv.slice(2);
if (!pdfPath || !outputDir) {
  console.error("Usage: node render_pdf_pages.mjs <input.pdf> <output_dir> [scale]");
  process.exit(2);
}

const scale = Number(scaleArg || "1.5");
await mkdir(outputDir, { recursive: true });

const data = new Uint8Array(await readFile(pdfPath));
const task = pdfjs.getDocument({
  data,
  disableFontFace: true,
  useSystemFonts: true,
});
const pdf = await task.promise;

for (let pageNum = 1; pageNum <= pdf.numPages; pageNum += 1) {
  const page = await pdf.getPage(pageNum);
  const viewport = page.getViewport({ scale });
  const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
  const context = canvas.getContext("2d");
  context.fillStyle = "white";
  context.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvasContext: context, viewport }).promise;
  const output = path.join(outputDir, `page-${String(pageNum).padStart(3, "0")}.png`);
  await writeFile(output, canvas.toBuffer("image/png"));
}

console.log(JSON.stringify({ pages: pdf.numPages, outputDir, scale }));
