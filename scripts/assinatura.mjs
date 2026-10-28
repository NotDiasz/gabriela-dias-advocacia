import fs from "node:fs";
import path from "node:path";
import opentype from "opentype.js";

const option = process.argv.indexOf("--font");
const fontName =
  option >= 0
    ? process.argv[option + 1]
    : process.env.SIGNATURE_FONT || "monsieur-la-doulaise";
const allowed = [
  "monsieur-la-doulaise",
  "mrs-saint-delafield",
  "allura",
  "great-vibes",
];
if (!allowed.includes(fontName))
  throw new Error(`Fonte inválida. Use: ${allowed.join(", ")}`);
const fontPath = path.resolve(
  `node_modules/@fontsource/${fontName}/files/${fontName}-latin-400-normal.woff`,
);
const font = opentype.loadSync(fontPath);
const size = 170;
const glyphs = font.stringToGlyphs("Gabriela Dias");
const signatureI = "Gabriela Dias".indexOf("i");
let x = 25;
let dot;
const paths = [];
glyphs.forEach((glyph, index) => {
  const outline = glyph.getPath(x, 190, size);
  if (index === signatureI) {
    const contours = [];
    let contour;
    for (const command of outline.commands) {
      if (command.type === "M") {
        contour = new opentype.Path();
        contours.push(contour);
      }
      contour.commands.push(command);
    }
    // The uppermost closed contour of the i is its tittle, independent of font metrics.
    const sorted = [...contours].sort(
      (a, b) => a.getBoundingBox().y1 - b.getBoundingBox().y1,
    );
    const mark = sorted[0];
    const bounds = mark.getBoundingBox();
    const centerX = (bounds.x1 + bounds.x2) / 2;
    const centerY = (bounds.y1 + bounds.y2) / 2;
    // Ajuste aprovado no kit: ponto 1,7×, levemente à direita e acima.
    for (const command of mark.commands) {
      for (const key of ["x", "x1", "x2"]) {
        if (key in command)
          command[key] =
            centerX + (command[key] - centerX) * 1.7 + (1.65 * size) / 300;
      }
      for (const key of ["y", "y1", "y2"]) {
        if (key in command)
          command[key] =
            centerY + (command[key] - centerY) * 1.7 - (5.15 * size) / 300;
      }
    }
    dot = mark.toPathData(3);
    const remaining = new opentype.Path();
    contours
      .filter((c) => c !== sorted[0])
      .forEach((c) => remaining.commands.push(...c.commands));
    paths.push({ letter: "i", d: remaining.toPathData(3) });
  } else if (outline.commands.length)
    paths.push({
      letter: glyph.unicode ? String.fromCodePoint(glyph.unicode) : "",
      d: outline.toPathData(3),
    });
  x += (glyph.advanceWidth * size) / font.unitsPerEm;
  if (glyphs[index + 1])
    x +=
      (font.getKerningValue(glyph, glyphs[index + 1]) * size) / font.unitsPerEm;
});
if (!dot) throw new Error("Não foi possível separar o ponto do i.");
const output = {
  font: fontName,
  dotScale: 1.7,
  viewBox: `0 0 ${Math.ceil(x + 40)} 260`,
  paths,
  dot,
};
fs.mkdirSync("src/data", { recursive: true });
fs.writeFileSync(
  "src/data/assinatura.ts",
  `// Gerado por npm run signature. Não editar os paths manualmente.\nexport const assinatura = ${JSON.stringify(output, null, 2)} as const;\n`,
);
console.log(
  `Assinatura gerada: ${fontName}, ${paths.length} glifos e ponto independente.`,
);
