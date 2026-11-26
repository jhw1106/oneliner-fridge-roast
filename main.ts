// Fridge Roast entry: holds one original one-line roast of a fridge and
// writes it to $MAKEFUN_OUTPUT_DIR/entry.txt (default /output).
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "My fridge hums all night like it pays rent, but the only thing it has ever kept fresh is my disappointment.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const charCount = [...LINE].length;
if (LINE.trim().length === 0 || charCount < 1 || charCount > 200) {
  console.error(`entry line must be 1-200 characters, got ${charCount}`);
  process.exit(1);
}
// A one-line entry cannot carry a line break, and the UTF-8 size must stay
// under the cap, so a line of wide characters cannot dodge the limit by
// counting as few characters.
if (/[\r\n]/.test(LINE)) {
  console.error("entry line must not contain a line break");
  process.exit(1);
}
const byteCount = Buffer.byteLength(LINE, "utf8");
if (byteCount > 800) {
  console.error(`entry line is ${byteCount} UTF-8 bytes, over the 800-byte cap`);
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
const target = join(outDir, "entry.txt");
writeFileSync(target, LINE, "utf8");
// Read the file back and confirm the bytes on disk are exactly the line we
// meant to submit, so a partial write or encoding slip cannot pass silently.
const written = readFileSync(target, "utf8");
if (written !== LINE) {
  console.error("entry.txt on disk does not match the validated line");
  process.exit(1);
}
console.log(`wrote ${charCount} characters to ${target}`);
