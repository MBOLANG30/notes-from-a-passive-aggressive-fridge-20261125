// Notes From a Passive-Aggressive Fridge — make.fun entry.
// Deterministic: no network, no randomness. Writes one note to /output/entry.txt.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const NOTE =
  "You opened me 14 times today looking for food you never bought. The yogurt has started a support group.";

const OUTPUT_DIR = "/output";
const OUTPUT_PATH = join(OUTPUT_DIR, "entry.txt");

function validate(note: string): void {
  if (note.length < 1 || note.length > 200) {
    throw new Error(`note must be 1-200 characters, got ${note.length}`);
  }
  if (note.trim().length === 0) {
    throw new Error("note must not be only whitespace");
  }
  if (note.includes("\n") || note.includes("\r")) {
    throw new Error("note must be a single line");
  }
  // Reject control characters (other than none allowed here) so the file
  // stays clean single-line UTF-8 text for the sealed scorer.
  // eslint-disable-next-line no-control-regex
  if (/[\u0000-\u001f\u007f]/.test(note)) {
    throw new Error("note must not contain control characters");
  }
}

validate(NOTE);
mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(OUTPUT_PATH, NOTE, "utf8");

// Read back and verify byte-for-byte so a bad write never slips through.
const written = readFileSync(OUTPUT_PATH, "utf8");
if (written !== NOTE) {
  throw new Error("verification failed: entry.txt does not match the note");
}
console.log(`Wrote ${NOTE.length} characters to ${OUTPUT_PATH}`);
