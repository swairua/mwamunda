// Cross-platform staging step: copy the PHP API, DB config, Apache config
// and public assets into dist/ so the whole folder can be uploaded to the
// domain root on shared hosting.
import { cpSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");

if (!existsSync(dist)) {
  console.error("dist/ not found - run `pnpm build` first.");
  process.exit(1);
}

mkdirSync(dist, { recursive: true });

for (const file of ["api.php", "connection.php", ".htaccess"]) {
  cpSync(join(root, file), join(dist, file));
  console.log(`Copied ${file} -> dist/${file}`);
}

const publicDir = join(root, "public");
if (existsSync(publicDir)) {
  cpSync(publicDir, dist, { recursive: true });
  console.log("Copied public/ assets -> dist/");
}

console.log("dist/ is ready for upload to the domain root.");
