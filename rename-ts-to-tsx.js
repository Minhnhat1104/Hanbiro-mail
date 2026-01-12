import fs from "fs"
import path from "path"

/**
 * Heuristic phát hiện JSX:
 * - <tag ...>
 * - <tag>...</tag>
 * - <tag />
 * - Fragment <>...</>
 *
 * Không parse AST, nhưng đủ chính xác cho migration.
 */
const jsxRegex = /(<[a-zA-Z][^>\n]*>)|(<\/[a-zA-Z][^>\n]*>)|(<>\s*)|(\s*<\/>)/

function walk(dir) {
  const entries = fs.readdirSync(dir)

  for (const entry of entries) {
    const fullPath = path.join(dir, entry)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      walk(fullPath)
      continue
    }

    // Chỉ xử lý .ts (bỏ qua .d.ts)
    if (!fullPath.endsWith(".ts") || fullPath.endsWith(".d.ts")) {
      continue
    }

    const content = fs.readFileSync(fullPath, "utf8")

    if (jsxRegex.test(content)) {
      const newPath = fullPath.replace(/\.ts$/, ".tsx")

      fs.renameSync(fullPath, newPath)
      console.log(`✔ ${path.relative(process.cwd(), fullPath)} → ${path.basename(newPath)}`)
    }
  }
}

walk(path.resolve("src"))
console.log("✔ Done renaming .ts → .tsx")
